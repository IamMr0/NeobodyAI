import { useState, useContext, useEffect, useRef } from 'react';
import AuthContext from '../context/AuthContext';

export default function AIChatbot() {
  const { token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !token) return;
    
    const userMessage = input;
    setInput('');
    
    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userMessage },
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
          session_id: sessionId
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSessionId(data.session_id); // Save session ID for future messages
        setMessages((prev) => [
          ...prev,
          { role: 'ai', content: data.message },
        ]);
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
    setMessages([]);
  };

  return (
    <div className="flex w-full h-full">
      {/* Left: Chat History */}
      <aside className="hidden md:flex w-72 border-r-thick border-on-surface bg-surface-container-low flex-col h-full">
        <div className="p-4 border-b-thin border-on-surface bg-surface-container">
          <p className="font-label-bold text-label-sm uppercase opacity-60">History</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {messages.length === 0 && (
            <div className="p-4 text-center">
              <p className="font-body-md text-body-md text-on-surface-variant italic">No conversations yet</p>
            </div>
          )}
          {sessionId && (
            <div className="p-2 border-thin border-on-surface bg-surface-container font-label-bold text-label-sm truncate">
              Current Session Active
            </div>
          )}
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
          <div className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-4">
            <button className="bg-surface border-thick border-on-surface p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer">
              <span className="material-symbols-outlined">add</span>
            </button>
            <div className="flex-grow">
              <input
                className="w-full bg-surface-container-lowest border-thick border-on-surface p-3 sm:p-4 font-body-md text-body-md sm:text-body-lg focus:ring-0 focus:outline-none focus:bg-primary-container/10 placeholder:text-outline shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                placeholder="Command IRON AI... (e.g., 'Check deadlift form')"
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
        <div className="mb-stack-lg">
          <h2 className="font-headline-md text-headline-md uppercase border-b-thick border-on-surface pb-2 mb-4">LIVE ANALYSIS</h2>

          <div className="flex flex-col items-center text-center py-8">
            <span className="material-symbols-outlined text-outline mb-stack-md" style={{ fontSize: '48px' }}>analytics</span>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {sessionId 
                ? "Active session logged. Analyzing chat patterns and exercise context for optimal recommendations."
                : "Start a conversation to see real-time AI analysis and biomechanic insights here."
              }
            </p>
          </div>
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
