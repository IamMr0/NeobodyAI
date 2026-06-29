import { useState, useContext, useEffect, useRef } from 'react';
import AuthContext from '../context/AuthContext';

export default function AIChatbot() {
  const { token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    const saved = localStorage.getItem('current_chat_session_id');
    return saved ? parseInt(saved, 10) : null;
  });
  const [sessions, setSessions] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch all chat sessions for user
  const fetchSessions = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:8000/api/chat/sessions/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (err) {
      console.error('Failed to fetch sessions', err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [token]);

  // Fetch message history for selected session
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!token || !sessionId) {
        setMessages([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/chat/history/${sessionId}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          const mappedMessages = data.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'ai',
            content: msg.message
          }));
          setMessages(mappedMessages);
        } else {
          console.error('Failed to fetch chat history');
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatHistory();
  }, [sessionId, token]);

  const handleSend = async () => {
    if (!input.trim() || !token) return;
    
    const userMessage = input;
    const userImage = selectedImage;
    setInput('');
    setSelectedImage(null);
    
    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userMessage, insight_data: userImage ? { image: userImage } : null },
    ]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat/message/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage,
          session_id: sessionId,
          image: userImage
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          { role: 'ai', content: data.message, insight_data: data.insight_data },
        ]);
        if (!sessionId && data.session_id) {
          setSessionId(data.session_id);
          localStorage.setItem('current_chat_session_id', data.session_id);
          fetchSessions(); // Refresh sessions list in the sidebar
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'ai', content: 'Error: Failed to connect to IRON AI. Please ensure the backend is running and the Gemini API key is configured.' },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: `Error: ${err.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setSessionId(null);
    localStorage.removeItem('current_chat_session_id');
    setMessages([]);
  };

  const handleSelectSession = (id) => {
    setSessionId(id);
    localStorage.setItem('current_chat_session_id', id);
  };

  const lastAIMessageWithAnalysis = [...messages].reverse().find(msg => msg.role === 'ai' && msg.insight_data?.joint_angles);

  return (
    <div className="flex w-full h-full">
      {/* Left: Chat History */}
      <aside className="hidden md:flex w-72 border-r-thick border-on-surface bg-surface-container-low flex-col h-full">
        <div className="p-4 border-b-thin border-on-surface bg-surface-container">
          <p className="font-label-bold text-label-sm uppercase opacity-60">History</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {sessions.length === 0 && (
            <div className="p-4 text-center">
              <p className="font-body-md text-body-md text-on-surface-variant italic">No conversations yet</p>
            </div>
          )}
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSelectSession(s.id)}
              className={`w-full text-left p-2 border-thin border-on-surface font-label-bold text-label-sm truncate cursor-pointer transition-all hover:bg-surface-container-high ${
                sessionId === s.id ? 'bg-primary-container text-on-primary-container shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-surface-container-low'
              }`}
            >
              {s.topic || `Session ${s.id}`}
            </button>
          ))}
        </div>
        <div className="p-4 border-t-thin border-on-surface">
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 p-2 border-thin border-on-surface font-label-bold text-label-sm hover:bg-surface-container-high transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined">add</span>
            NEW CHAT
          </button>
        </div>
      </aside>

      {/* Center: Main Conversation Area */}
      <section className="flex-1 flex flex-col relative bg-surface-bright h-full">
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-stack-lg space-y-stack-lg pb-32"
        >
          {messages.length === 0 ? (
            /* Welcome empty state */
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 border-thick border-on-surface bg-primary-container flex items-center justify-center mb-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="material-symbols-outlined text-on-primary-container" style={{ fontSize: '40px' }}>smart_toy</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg uppercase mb-stack-sm">IRON AI Assistant</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mb-stack-lg">
                Your AI-powered gym coach is ready. Ask about form analysis, workout optimization, nutrition advice, or recovery strategies.
              </p>
              <div className="flex flex-wrap gap-stack-sm justify-center max-w-lg">
                {['Analyze my deadlift form', 'Create a push day routine', 'How much protein do I need?'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="px-4 py-2 border-thin border-on-surface bg-surface-container-lowest font-label-bold text-label-sm hover:bg-primary-container transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Render messages */
            <>
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-2xl ${msg.role === 'user' ? 'ml-auto' : ''}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {msg.role === 'ai' && <span className="material-symbols-outlined text-primary">smart_toy</span>}
                    <span className="font-label-bold text-label-sm uppercase">{msg.role === 'ai' ? 'IRON AI Assistant' : 'You'}</span>
                    {msg.role === 'user' && <span className="material-symbols-outlined">account_circle</span>}
                  </div>
                  <div className={`border-thick border-on-surface p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${msg.role === 'user' ? 'bg-primary-container' : 'bg-surface-container-lowest'} break-words whitespace-pre-wrap w-full`}>
                    {msg.insight_data?.image && (
                      <img 
                        src={msg.insight_data.image} 
                        alt="Workout form scan" 
                        className="max-h-60 max-w-full border-thick border-on-surface mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] object-contain bg-white block"
                      />
                    )}
                    <p className="font-body-lg text-body-lg">{msg.content}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex flex-col items-start max-w-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary">smart_toy</span>
                    <span className="font-label-bold text-label-sm uppercase">IRON AI Assistant</span>
                  </div>
                  <div className="border-thick border-on-surface p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-surface-container-lowest flex items-center gap-2">
                    <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                    <span className="font-body-lg text-body-lg text-on-surface-variant italic">Analyzing data...</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom: Command Input Bar */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-surface-bright border-t border-on-surface/10">
          {selectedImage && (
            <div className="max-w-4xl mx-auto mb-3 p-2 border-thick border-on-surface bg-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 relative w-fit">
              <img src={selectedImage} alt="Attachment preview" className="h-16 w-16 object-cover border-thin border-on-surface bg-white" />
              <div className="text-left">
                <p className="font-label-bold text-label-sm uppercase text-primary">POSTURE SCAN ATTACHED</p>
                <p className="font-body-md text-body-md text-on-surface-variant">Ready to check biomechanics</p>
              </div>
              <button 
                onClick={() => setSelectedImage(null)} 
                className="absolute -top-2 -right-2 bg-error text-on-error border-thin border-on-surface p-0.5 rounded-full flex items-center justify-center cursor-pointer hover:bg-error-container hover:text-on-error-container transition-colors shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] w-6 h-6"
              >
                <span className="material-symbols-outlined text-sm font-bold">close</span>
              </button>
            </div>
          )}
          <div className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-surface border-thick border-on-surface p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center justify-center hover:bg-surface-container-high"
            >
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageChange} 
            />
            <div className="flex-grow">
              <input
                className="w-full bg-surface-container-lowest border-thick border-on-surface p-3 sm:p-4 font-body-md text-body-md sm:text-body-lg focus:ring-0 focus:outline-none focus:bg-primary-container/10 placeholder:text-outline shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                placeholder={selectedImage ? "Enter form command (e.g. 'Analyze squat depth')" : "Command IRON AI... (e.g., 'Check deadlift form')"}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-primary text-on-primary border-thick border-on-surface px-4 sm:px-8 py-3 sm:py-4 font-label-bold text-label-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="hidden sm:inline">{isLoading ? 'PROCESSING' : 'SEND'}</span>
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </section>

      {/* Right: AI Analysis Contextual Sidebar */}
      <aside className="hidden lg:flex w-80 border-l-thick border-on-surface bg-surface flex-col p-6 overflow-y-auto h-full">
        <div className="mb-stack-lg flex-1">
          <h2 className="font-headline-md text-headline-md uppercase border-b-thick border-on-surface pb-2 mb-4">LIVE ANALYSIS</h2>

          {lastAIMessageWithAnalysis ? (
            <div className="space-y-stack-md mt-4">
              {/* Safety Badge */}
              <div className="border-thick border-on-surface p-4 bg-surface-container-lowest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-label-bold text-label-sm text-on-surface-variant uppercase mb-2">Posture Safety</p>
                <span className={`px-4 py-1.5 border-thin border-on-surface font-label-bold text-label-sm uppercase inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                  lastAIMessageWithAnalysis.insight_data.posture_check === 'Safe' ? 'bg-tertiary text-on-tertiary' :
                  lastAIMessageWithAnalysis.insight_data.posture_check === 'Warning' ? 'bg-primary-container text-on-primary-container' :
                  'bg-error-container text-on-error-container'
                }`}>
                  {lastAIMessageWithAnalysis.insight_data.posture_check}
                </span>
              </div>

              {/* Joint Angles Table */}
              <div className="border-thick border-on-surface p-4 bg-surface-container-lowest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-label-bold text-label-sm text-on-surface-variant uppercase mb-3">Estimated Angles</p>
                <div className="space-y-2">
                  {Object.entries(lastAIMessageWithAnalysis.insight_data.joint_angles).map(([joint, angle]) => (
                    <div key={joint} className="flex justify-between border-b border-outline/20 pb-1">
                      <span className="font-label-bold text-label-sm text-on-surface-variant uppercase">{joint}:</span>
                      <span className="font-body-md text-body-md text-on-surface">{angle}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Correction Suggestions */}
              {lastAIMessageWithAnalysis.insight_data.suggestions?.length > 0 && (
                <div className="border-thick border-on-surface p-4 bg-surface-container-lowest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-r-8 border-r-primary">
                  <p className="font-label-bold text-label-sm text-on-surface-variant uppercase mb-3">Biomechanical Fixes</p>
                  <ul className="list-disc pl-4 space-y-2 font-body-md text-body-md text-on-surface">
                    {lastAIMessageWithAnalysis.insight_data.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center text-center py-8">
              <span className="material-symbols-outlined text-outline mb-stack-md" style={{ fontSize: '48px' }}>analytics</span>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {sessionId 
                  ? "Active session logged. Upload an image of your squat or lift form using the attachment button below to trigger a live biomechanical posture analysis."
                  : "Start a conversation and attach a photo of your exercise form to see joint angles and safety insights here."
                }
              </p>
            </div>
          )}
        </div>

        <div className="mt-auto border-t-thick border-on-surface pt-4">
          <div className="flex items-center justify-between font-label-bold text-label-sm">
            <span>DATA STATUS:</span>
            <span className={sessionId ? "text-success uppercase" : "text-on-surface-variant"}>
              {sessionId ? "SYNCING LIVE" : "AWAITING INPUT"}
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
