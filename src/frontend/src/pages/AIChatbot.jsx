export default function AIChatbot() {
  return (
    <div className="flex w-full h-full">
      {/* Left: Chat History */}
      <aside className="hidden md:flex w-72 border-r-thick border-on-surface bg-surface-container-low flex-col h-full">
        <div className="p-4 border-b-thin border-on-surface bg-surface-container">
          <p className="font-label-bold text-label-sm uppercase opacity-60">History</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          <div className="p-3 border-thin border-on-surface bg-primary-container shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer">
            <p className="font-label-bold text-label-bold truncate">Bench Press Plateau</p>
            <p className="font-body-md text-label-sm opacity-70">2 hours ago</p>
          </div>
          <div className="p-3 border-thin border-on-surface bg-surface hover:bg-surface-container-high transition-all cursor-pointer">
            <p className="font-label-bold text-label-bold truncate">New Hypertrophy Routine</p>
            <p className="font-body-md text-label-sm opacity-70">Yesterday</p>
          </div>
          <div className="p-3 border-thin border-on-surface bg-surface hover:bg-surface-container-high transition-all cursor-pointer">
            <p className="font-label-bold text-label-bold truncate">Protein Intake Analysis</p>
            <p className="font-body-md text-label-sm opacity-70">3 days ago</p>
          </div>
          <div className="p-3 border-thin border-on-surface bg-surface hover:bg-surface-container-high transition-all cursor-pointer">
            <p className="font-label-bold text-label-bold truncate">Knee Tracking Concerns</p>
            <p className="font-body-md text-label-sm opacity-70">Jan 12, 2024</p>
          </div>
        </div>
        <div className="p-4 border-t-thin border-on-surface">
          <button className="w-full flex items-center justify-center gap-2 p-2 border-thin border-on-surface font-label-bold text-label-sm hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined" data-icon="add">add</span>
            NEW CHAT
          </button>
        </div>
      </aside>

      {/* Center: Main Conversation Area */}
      <section className="flex-1 flex flex-col relative bg-surface-bright h-full">
        <div className="flex-1 overflow-y-auto p-stack-lg space-y-stack-lg pb-32">
          {/* AI Greeting */}
          <div className="flex flex-col items-start max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary" data-icon="smart_toy">smart_toy</span>
              <span className="font-label-bold text-label-sm uppercase">IRON AI Assistant</span>
            </div>
            <div className="bg-surface-container-lowest border-thick border-on-surface p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-body-lg text-body-lg">Welcome back. I've analyzed your last three bench press sessions. You've hit a 225lb ceiling. Shall we look at your biomechanic efficiency or adjust the volume progression?</p>
            </div>
          </div>

          {/* User Message */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-label-bold text-label-sm uppercase">You</span>
              <span className="material-symbols-outlined" data-icon="account_circle">account_circle</span>
            </div>
            <div className="bg-primary-container border-thick border-on-surface p-6 max-w-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-body-lg text-body-lg">Show me the biomechanic data. I feel like my left shoulder is dipping slightly during the final reps.</p>
            </div>
          </div>

          {/* AI Response with Insight Card */}
          <div className="flex flex-col items-start max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary" data-icon="smart_toy">smart_toy</span>
              <span className="font-label-bold text-label-sm uppercase">IRON AI Assistant</span>
            </div>
            <div className="bg-surface-container-lowest border-thick border-on-surface p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-body-lg text-body-lg mb-4">Understood. Reviewing your wearable sensor data... You're right. There is a 4.2-degree shoulder asymmetry during the eccentric phase. Here is the breakdown:</p>
              
              <div className="border-[2px] border-secondary p-4 bg-secondary-container/5 space-y-2">
                <div className="flex justify-between">
                  <span className="font-label-bold text-label-sm">SHOULDER STABILITY</span>
                  <span className="font-label-bold text-label-sm text-error">CRITICAL</span>
                </div>
                <div className="h-4 w-full bg-surface-container border-thin border-on-surface overflow-hidden">
                  <div className="h-full bg-error" style={{ width: '82%' }}></div>
                </div>
                <p className="font-body-md text-label-sm">Correction: Tuck your elbows in by 5-10 degrees to engage the lats and stabilize the scapula.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Command Input Bar */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-surface-bright border-t border-on-surface/10">
          <div className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-4">
            <button className="bg-surface border-thick border-on-surface p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
              <span className="material-symbols-outlined" data-icon="add">add</span>
            </button>
            <div className="flex-grow">
              <input className="w-full bg-surface-container-lowest border-thick border-on-surface p-3 sm:p-4 font-body-md text-body-md sm:text-body-lg focus:ring-0 focus:outline-none focus:bg-primary-container/10 placeholder:text-outline shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" placeholder="Command IRON AI... (e.g., 'Check deadlift form')" type="text" />
            </div>
            <button className="bg-primary text-on-primary border-thick border-on-surface px-4 sm:px-8 py-3 sm:py-4 font-label-bold text-label-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2">
              <span className="hidden sm:inline">SEND</span>
              <span className="material-symbols-outlined" data-icon="send">send</span>
            </button>
          </div>
        </div>
      </section>

      {/* Right: AI Analysis Contextual Sidebar */}
      <aside className="hidden lg:flex w-80 border-l-thick border-on-surface bg-surface flex-col p-6 overflow-y-auto h-full">
        <div className="mb-stack-lg">
          <h2 className="font-headline-md text-headline-md uppercase border-b-thick border-on-surface pb-2 mb-4">LIVE ANALYSIS</h2>
          
          <div className="space-y-6">
            {/* Plateau Card */}
            <div className="border-thick border-on-surface p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-surface-container-lowest">
              <p className="font-label-bold text-label-sm text-primary uppercase mb-2">Strength Plateau</p>
              <div className="flex items-end justify-between">
                <span className="font-headline-lg text-headline-lg">225<span className="text-body-md font-normal">lb</span></span>
                <span className="text-error font-label-bold text-label-sm">STAGNANT (14 DAYS)</span>
              </div>
              <div className="mt-4 flex gap-1">
                <div className="h-6 w-8 bg-tertiary-fixed border-thin border-on-surface"></div>
                <div className="h-6 w-8 bg-tertiary-fixed border-thin border-on-surface"></div>
                <div className="h-6 w-8 bg-tertiary-fixed border-thin border-on-surface"></div>
                <div className="h-6 w-8 bg-surface-container border-thin border-on-surface"></div>
                <div className="h-6 w-8 bg-surface-container border-thin border-on-surface"></div>
              </div>
            </div>

            {/* Biomechanic Data Visual */}
            <div className="border-thick border-on-surface overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
              <div className="bg-on-surface text-surface px-4 py-1">
                <p className="font-label-bold text-label-sm">BIOMECHANIC SCAN</p>
              </div>
              <div className="p-4 flex flex-col items-center">
                <img className="w-full h-48 object-cover border-thin border-on-surface mb-4" alt="Biomechanic Scan" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUuMCIoHEJj-wOySNBGtz9Wyo2jbw0sPGBKLvxGSoQH0KTUM3x9_aZ7IAIcMf3K3qlGUhtbSEZBHnnp2BPvRBo2JD6mVo03OIqojSHa-PaahPGvuTGwfHru3S4l7MwLNnXpX9a3lak0HKxv1WoKu9k-EOLGaYHq_7OfZALz5FOCQL9Djy2cEqFZFIbMK-8rmYqWLtqv0EofMtKHjqiMXV9B15xG5ekvxFayM3m8XwiH4_2VlXQhee0SJtzVTpWRbnScA8yRpR9x-xu" />
                <div className="w-full space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-body-md text-label-sm">Left Scapula</span>
                    <span className="font-label-bold text-label-sm text-error">Unstable</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body-md text-label-sm">Grip Width</span>
                    <span className="font-label-bold text-label-sm text-tertiary">Optimal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tip Box */}
            <div className="bg-primary-container border-thick border-on-surface p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined" data-icon="lightbulb">lightbulb</span>
                <span className="font-label-bold text-label-sm uppercase">Quick Fix</span>
              </div>
              <p className="font-body-md text-label-sm leading-tight">Implement "Pause Reps" for your next 2 sets. Pause for 2 seconds at the bottom to build explosive power off the chest.</p>
            </div>
          </div>
        </div>

        <div className="mt-auto border-t-thick border-on-surface pt-4">
          <div className="flex items-center justify-between font-label-bold text-label-sm">
            <span>DATA STATUS:</span>
            <span className="text-tertiary-fixed-dim bg-on-surface px-2">ENCRYPTED LIVE</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
