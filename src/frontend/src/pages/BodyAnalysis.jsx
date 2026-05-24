export default function BodyAnalysis() {
  return (
    <div className="p-margin-mobile max-w-7xl mx-auto space-y-stack-lg h-full overflow-y-auto">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
        {/* Main Metrics Column (Left/Center) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-stack-md">
          {/* Weight Metric */}
          <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-label-bold text-label-bold text-on-surface-variant uppercase mb-2">Current Weight</p>
            <h2 className="font-headline-xl text-headline-xl text-on-surface mb-stack-md">84.2 <span className="text-headline-md">KG</span></h2>
            <div className="space-y-stack-sm">
              <div className="flex justify-between font-label-sm text-label-sm">
                <span>Target: 82.0 KG</span>
                <span className="text-primary font-bold">-1.2 KG this week</span>
              </div>
              <div className="h-6 w-full border-thin border-on-surface flex gap-1 p-1">
                <div className="h-full w-full bg-primary-container border-[1px] border-on-surface"></div>
                <div className="h-full w-full bg-primary-container border-[1px] border-on-surface"></div>
                <div className="h-full w-full bg-primary-container border-[1px] border-on-surface"></div>
                <div className="h-full w-1/2 bg-primary-container border-[1px] border-on-surface"></div>
                <div className="h-full w-full bg-surface-variant border-[1px] border-on-surface"></div>
              </div>
            </div>
          </div>
          
          {/* Body Fat Metric */}
          <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-label-bold text-label-bold text-on-surface-variant uppercase mb-2">Body Fat</p>
            <h2 className="font-headline-xl text-headline-xl text-on-surface mb-stack-md">14.8 <span className="text-headline-md">%</span></h2>
            <div className="space-y-stack-sm">
              <div className="flex justify-between font-label-sm text-label-sm">
                <span>Athletic Range</span>
                <span className="text-tertiary font-bold">Peak Condition</span>
              </div>
              <div className="h-6 w-full border-thin border-on-surface relative overflow-hidden bg-surface-variant">
                <div className="absolute top-0 left-0 h-full w-[14.8%] bg-tertiary-fixed-dim border-r-thin border-on-surface"></div>
              </div>
            </div>
          </div>
          
          {/* Muscle Mass Metric (Full Width on md) */}
          <div className="md:col-span-2 bg-surface-container-lowest border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-start mb-stack-md">
              <div>
                <p className="font-label-bold text-label-bold text-on-surface-variant uppercase mb-2">Muscle Mass</p>
                <h2 className="font-headline-xl text-headline-xl text-on-surface">68.5 <span className="text-headline-md">KG</span></h2>
              </div>
              <div className="bg-primary-container border-thin border-on-surface p-2 font-label-bold text-label-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                +2.4% vs Last Month
              </div>
            </div>
            {/* High Contrast Bar Chart */}
            <div className="flex items-end gap-2 h-32 w-full pt-4">
              <div className="flex-1 bg-on-surface h-[60%] border-thin border-on-surface"></div>
              <div className="flex-1 bg-on-surface h-[65%] border-thin border-on-surface"></div>
              <div className="flex-1 bg-on-surface h-[58%] border-thin border-on-surface"></div>
              <div className="flex-1 bg-on-surface h-[72%] border-thin border-on-surface"></div>
              <div className="flex-1 bg-on-surface h-[85%] border-thin border-on-surface"></div>
              <div className="flex-1 bg-primary-container h-full border-thick border-on-surface shadow-[4px_0px_0px_0px_rgba(0,0,0,1)]"></div>
            </div>
            <div className="flex justify-between mt-2 font-label-sm text-label-sm text-on-surface-variant">
              <span>Week 01</span><span>Week 02</span><span>Week 03</span><span>Week 04</span><span>Week 05</span><span className="font-bold text-on-surface">Today</span>
            </div>
          </div>
        </div>

        {/* Metabolic Insight (Right Column) */}
        <aside className="space-y-stack-md">
          <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-l-[8px] border-l-secondary-container">
            <div className="flex items-center gap-2 mb-stack-sm">
              <span className="material-symbols-outlined text-secondary" data-icon="auto_awesome">auto_awesome</span>
              <p className="font-label-bold text-label-bold text-secondary">METABOLIC INSIGHT</p>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Hyper-Optimized State</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-md">
              Your current thermogenic rate is 4.2% above baseline. AI models suggest increasing leucine intake by 12% to capitalize on the current anabolic window. Protein synthesis remains peak.
            </p>
            <div className="flex flex-wrap gap-2 mb-stack-lg">
              <span className="px-2 py-1 border-thin border-on-surface font-label-sm text-label-sm bg-tertiary-container text-on-tertiary-container">AI VERIFIED</span>
              <span className="px-2 py-1 border-thin border-on-surface font-label-sm text-label-sm bg-surface-variant">HIGH ANABOLISM</span>
            </div>
            <button className="w-full bg-primary-container text-on-primary-container border-thick border-on-surface py-stack-md font-label-bold text-label-bold text-headline-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all uppercase tracking-tighter">
              Run AI Analysis
            </button>
          </div>
          <div className="bg-on-surface p-stack-md border-thick border-on-surface text-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h4 className="font-label-bold text-label-bold mb-2">RECOVERY SCORE</h4>
            <div className="flex items-center gap-stack-md">
              <span className="font-headline-xl text-headline-xl text-primary-container">92</span>
              <p className="font-body-md text-body-md">Your CNS is ready for high-intensity output today.</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Body Composition 3D Section */}
      <section className="bg-surface-container-lowest border-thick border-on-surface overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-stack-lg">
        <div className="grid grid-cols-1 lg:grid-cols-5 h-[600px]">
          {/* Left Control Panel */}
          <div className="lg:col-span-1 p-stack-md border-r-thick border-on-surface flex flex-col justify-between">
            <div>
              <h3 className="font-headline-md text-headline-md mb-stack-md uppercase italic">Body 3D</h3>
              <div className="space-y-stack-sm">
                <button className="w-full text-left p-stack-sm border-thin border-on-surface bg-primary-container font-label-bold text-label-bold">SKELETAL</button>
                <button className="w-full text-left p-stack-sm border-thin border-on-surface hover:bg-surface-container font-label-bold text-label-bold transition-all">MUSCULAR</button>
                <button className="w-full text-left p-stack-sm border-thin border-on-surface hover:bg-surface-container font-label-bold text-label-bold transition-all">HEATMAP</button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-label-sm text-label-sm text-on-surface-variant italic">RENDER V.2.04</p>
              <div className="w-full h-1 bg-on-surface"></div>
            </div>
          </div>
          
          {/* Main Visualization Canvas */}
          <div className="lg:col-span-3 relative bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:20px_20px] flex items-center justify-center">
            {/* AI Scanner Overlay */}
            <div className="absolute inset-x-0 top-1/4 h-1 bg-secondary-container/50 blur-[2px] z-10"></div>
            <img alt="3D Anatomical Visualization" className="h-full w-auto object-contain mix-blend-multiply opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAEmmqB4YQ1BA6j5supBgpqWFRy_AIuye9sY-T_grSaOR6bYA4tMHoLG1PiCkSbEbsgkbWJTbop0rY7I1CZddmJuys3epNRo1aYJa2k9E6yCmPXbViGEyJ8k2mp7XrO_5totgawHaj-WYeiUfiNJCWEemqyNPT7N9auS0JwxEvSHnJQIIPRH0HSj3gulqBcTZyujBixg4FTYSXtZ5iU8zL5R1ra0ipAhE6jeBGZywTA9eiY0DMU9pffzJy1FhkKJ8ngql9Va0oc1yN" />
            {/* Floating UI Nodes */}
            <div className="absolute top-1/4 left-1/4 bg-on-surface text-surface p-2 border-thin border-primary-container font-label-sm text-label-sm">
              CHEST: +2% DENSITY
            </div>
            <div className="absolute bottom-1/3 right-1/4 bg-primary-container text-on-primary-container p-2 border-thick border-on-surface font-label-bold text-label-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              PEAK HYPERTROPHY
            </div>
          </div>
          
          {/* Right Data Panel */}
          <div className="lg:col-span-1 p-stack-md border-l-thick border-on-surface bg-surface-container">
            <h4 className="font-label-bold text-label-bold uppercase mb-stack-md">Tissue Distribution</h4>
            <div className="space-y-stack-md">
              <div>
                <div className="flex justify-between font-label-sm text-label-sm mb-1">
                  <span>Lean Tissue</span><span>81%</span>
                </div>
                <div className="w-full h-4 border-thin border-on-surface bg-white overflow-hidden">
                  <div className="h-full w-[81%] bg-on-surface"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between font-label-sm text-label-sm mb-1">
                  <span>Subcutaneous Fat</span><span>14%</span>
                </div>
                <div className="w-full h-4 border-thin border-on-surface bg-white overflow-hidden">
                  <div className="h-full w-[14%] bg-primary"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between font-label-sm text-label-sm mb-1">
                  <span>Visceral Fat</span><span>5%</span>
                </div>
                <div className="w-full h-4 border-thin border-on-surface bg-white overflow-hidden">
                  <div className="h-full w-[5%] bg-error"></div>
                </div>
              </div>
            </div>
            <div className="mt-stack-lg p-stack-sm border-thin border-on-surface bg-white italic font-body-md text-body-md">
              "Optimal alignment detected in thoracic spine during recent sessions."
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
