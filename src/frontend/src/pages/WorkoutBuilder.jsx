export default function WorkoutBuilder() {
  return (
    <div className="p-margin-mobile bg-background h-full overflow-y-auto">
      <div className="max-w-[1400px] mx-auto space-y-stack-lg">
        {/* Top Action Bar */}
        <div className="flex justify-between items-end border-thick border-on-surface p-stack-lg bg-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div>
            <h2 className="font-headline-xl text-headline-xl uppercase tracking-tight">Build It</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Customize your engineering targets for maximum output.</p>
          </div>
          <button className="bg-primary-container text-on-primary-container border-thick border-on-surface px-12 py-6 font-headline-md text-headline-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all flex items-center gap-stack-md">
            <span className="material-symbols-outlined" data-icon="bolt" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            AI Generate Plan
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-12 gap-stack-lg">
          {/* Left Column: Equipment */}
          <section className="col-span-12 md:col-span-4 lg:col-span-3 space-y-stack-md">
            <div className="border-thick border-on-surface bg-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-stack-sm mb-stack-md">
                <span className="material-symbols-outlined text-primary" data-icon="home_repair_service">home_repair_service</span>
                <h3 className="font-label-bold text-label-bold uppercase">Current Home Equipment</h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-stack-lg">
                <span className="px-3 py-1 border-thin border-on-surface bg-surface-container font-label-sm text-label-sm flex items-center gap-1">Dumbbells <button className="material-symbols-outlined text-[14px]" data-icon="close">close</button></span>
                <span className="px-3 py-1 border-thin border-on-surface bg-surface-container font-label-sm text-label-sm flex items-center gap-1">Pull-up Bar <button className="material-symbols-outlined text-[14px]" data-icon="close">close</button></span>
                <span className="px-3 py-1 border-thin border-on-surface bg-surface-container font-label-sm text-label-sm flex items-center gap-1">Kettlebell <button className="material-symbols-outlined text-[14px]" data-icon="close">close</button></span>
                <span className="px-3 py-1 border-thin border-on-surface bg-surface-container font-label-sm text-label-sm flex items-center gap-1">Resistance Bands <button className="material-symbols-outlined text-[14px]" data-icon="close">close</button></span>
              </div>
              <button className="w-full border-thin border-on-surface border-dashed p-stack-sm font-label-bold text-label-bold flex items-center justify-center gap-2 hover:bg-surface-container-low transition-all">
                <span className="material-symbols-outlined" data-icon="add">add</span>
                Add More
              </button>
            </div>
            
            <div className="border-thick border-on-surface bg-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-label-bold text-label-bold uppercase mb-stack-md">Recent Templates</h3>
              <div className="space-y-stack-sm">
                <div className="p-stack-sm border-thin border-on-surface bg-surface-container-low hover:bg-primary-container transition-colors cursor-pointer">
                  <p className="font-label-bold text-label-bold">Full Body Power</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Last used 2 days ago</p>
                </div>
                <div className="p-stack-sm border-thin border-on-surface bg-surface-container-low hover:bg-primary-container transition-colors cursor-pointer">
                  <p className="font-label-bold text-label-bold">Upper Push Focus</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Last used 5 days ago</p>
                </div>
              </div>
            </div>
          </section>

          {/* Center Column: Selected Routine */}
          <section className="col-span-12 md:col-span-8 lg:col-span-5 space-y-stack-md">
            <div className="border-thick border-on-surface bg-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col min-h-[500px]">
              <div className="p-stack-md border-b-thick border-on-surface flex justify-between items-center bg-surface-container-high">
                <h3 className="font-label-bold text-label-bold uppercase">Selected Routine</h3>
                <div className="flex gap-2">
                  <span className="font-label-sm text-label-sm px-2 py-1 bg-on-surface text-surface">3 EXERCISES</span>
                  <span className="font-label-sm text-label-sm px-2 py-1 bg-on-surface text-surface">45 MIN</span>
                </div>
              </div>
              <div className="flex-1 p-stack-md space-y-stack-md overflow-y-auto">
                {/* Draggable Row 1 */}
                <div className="group relative bg-surface border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all cursor-grab active:cursor-grabbing">
                  <div className="flex items-center gap-stack-md">
                    <span className="material-symbols-outlined text-outline" data-icon="drag_indicator">drag_indicator</span>
                    <div className="h-12 w-12 border-thin border-on-surface bg-surface-container-highest">
                      <img alt="Chest Press" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPgm9977agk5tdexzZcqQMq51Oz_W0_h5-YSCkEs4kpUV6MhgfZjiuGCSCOgOUfmqh12Cipsd3Wi4heb3-Ana7o4MYNGZ3ycWVksgklBjW4sRgH31jYhLA-IwRblnjfdU3MxvxHYmv2EOUwwFtg_LYW-oz3NQqN18MHbPiuVoF-rV9kig3q8c8JAWZQxVDAyLJtcefDBdC-slVcMlkXK-u3x82VrR8yFsUldRMomaetXHAbEh4l-pgj0RltCpUYoXHfpvBeJZCb0X7" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-label-bold text-label-bold">Incline DB Press</h4>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">4 Sets × 8-10 Reps</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:bg-surface-container-highest transition-colors"><span className="material-symbols-outlined" data-icon="edit">edit</span></button>
                      <button className="p-1 hover:bg-error-container text-error transition-colors"><span className="material-symbols-outlined" data-icon="delete">delete</span></button>
                    </div>
                  </div>
                </div>

                {/* Draggable Row 2 */}
                <div className="group relative bg-surface border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all cursor-grab active:cursor-grabbing">
                  <div className="flex items-center gap-stack-md">
                    <span className="material-symbols-outlined text-outline" data-icon="drag_indicator">drag_indicator</span>
                    <div className="h-12 w-12 border-thin border-on-surface bg-surface-container-highest">
                      <img alt="Pullups" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF9Ma6stQhUocU4a80_leYqO_OSJ0Atmr0dZ7orQuZSsg3Jslux0a0CMjRVm4w5gB08tQvjiSKx5UlIIX-i6GbgdtXbAShzVmO34Jt6E-b1mwy-z24m9AfERJUyVP-83pBy9DT8Ik2lFGp3TWByuDMm6p7a-XuEy4d-N360ZL6EwSX0kPF7tEvWbQj4Y4uw9LcAbpOtmTQKgflUO8cuu-cAZVgqSK3MfBvZA8cF5UfFFuAEsjRzNEdBlzdnjX9re2G9K46jnIuwhb5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-label-bold text-label-bold">Weighted Pull-ups</h4>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">3 Sets × Max Reps</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:bg-surface-container-highest transition-colors"><span className="material-symbols-outlined" data-icon="edit">edit</span></button>
                      <button className="p-1 hover:bg-error-container text-error transition-colors"><span className="material-symbols-outlined" data-icon="delete">delete</span></button>
                    </div>
                  </div>
                </div>

                {/* Draggable Row 3 */}
                <div className="group relative bg-surface border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all cursor-grab active:cursor-grabbing">
                  <div className="flex items-center gap-stack-md">
                    <span className="material-symbols-outlined text-outline" data-icon="drag_indicator">drag_indicator</span>
                    <div className="h-12 w-12 border-thin border-on-surface bg-surface-container-highest">
                      <img alt="Squats" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXSsq0QA_hppPyOXYUl3fS5aGGO2TwFd_k6BMF2zDlMbiWs6hUY8-Jo_7DEoLyryiQtE3pp1o44iE2VubqmFOltFcAb4bj4GNFWBar9rsNbQ0ffX_X2SYp-OdmUIei60Yojjov-lGvEP52x87Kcfws3alNiOwO954acyzbfSD33Ld-JtxnmORB4sUbw4KFYn02WqUcFaAYcZF4Fxg-YdaptlJ5TMBwlxrcCLs-O4N2q_q1xsIYfIZ2Z6V_jOTHQgkvKmpf34fTfHeo" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-label-bold text-label-bold">Goblet Squats</h4>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">4 Sets × 12 Reps</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:bg-surface-container-highest transition-colors"><span className="material-symbols-outlined" data-icon="edit">edit</span></button>
                      <button className="p-1 hover:bg-error-container text-error transition-colors"><span className="material-symbols-outlined" data-icon="delete">delete</span></button>
                    </div>
                  </div>
                </div>

                <div className="border-thin border-dashed border-on-surface-variant p-stack-lg flex flex-col items-center justify-center opacity-40">
                  <span className="material-symbols-outlined text-[48px]" data-icon="add_circle">add_circle</span>
                  <p className="font-label-bold text-label-bold uppercase">Drag exercises here</p>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: AI Insights */}
          <section className="col-span-12 lg:col-span-4 space-y-stack-lg">
            {/* AI Suggestions */}
            <div className="border-thick border-on-surface bg-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-r-8 border-secondary">
              <div className="flex items-center justify-between mb-stack-md">
                <div className="flex items-center gap-stack-sm">
                  <span className="material-symbols-outlined text-secondary" data-icon="auto_awesome" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <h3 className="font-label-bold text-label-bold uppercase">AI Suggestions</h3>
                </div>
                <span className="font-label-sm text-label-sm text-secondary font-bold">SMART MATCH</span>
              </div>
              <div className="space-y-stack-sm">
                <div className="border-thin border-on-surface bg-surface-container-low p-stack-sm flex justify-between items-center group">
                  <div>
                    <p className="font-label-bold text-label-bold">Lateral Raises</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Fixes: Muscle Imbalance</p>
                  </div>
                  <button className="bg-on-surface text-surface p-1 hover:bg-secondary transition-colors">
                    <span className="material-symbols-outlined" data-icon="add">add</span>
                  </button>
                </div>
                <div className="border-thin border-on-surface bg-surface-container-low p-stack-sm flex justify-between items-center group">
                  <div>
                    <p className="font-label-bold text-label-bold">Dips (Bench)</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Matches: Dumbbell Press</p>
                  </div>
                  <button className="bg-on-surface text-surface p-1 hover:bg-secondary transition-colors">
                    <span className="material-symbols-outlined" data-icon="add">add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Optimization Insight */}
            <div className="border-thick border-on-surface bg-primary-container p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-start gap-stack-md">
                <span className="material-symbols-outlined text-[32px]" data-icon="lightbulb" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                <div>
                  <h3 className="font-label-bold text-label-bold uppercase mb-stack-sm">Optimization Insight</h3>
                  <p className="font-body-md text-body-md text-on-primary-container">
                    Your current routine is heavy on **Push** mechanics. AI recommends adding a rowing movement to protect your shoulder health and balance posterior chain tension.
                  </p>
                  <div className="mt-stack-md">
                    <div className="w-full h-4 border-thin border-on-surface bg-surface flex overflow-hidden">
                      <div className="w-3/4 bg-on-surface border-r-thin border-on-surface"></div>
                      <div className="w-1/4 bg-surface"></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="font-label-sm text-label-sm">Push Balance</span>
                      <span className="font-label-sm text-label-sm">75%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Progress Visual */}
            <div className="border-thick border-on-surface bg-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-label-bold text-label-bold uppercase mb-stack-md">Plan Intensity</h3>
              <div className="flex items-end gap-2 h-24">
                <div className="flex-1 bg-surface-container-highest border-thin border-on-surface h-1/2"></div>
                <div className="flex-1 bg-surface-container-highest border-thin border-on-surface h-2/3"></div>
                <div className="flex-1 bg-primary border-thick border-on-surface h-full"></div>
                <div className="flex-1 bg-surface-container-highest border-thin border-on-surface h-3/4"></div>
                <div className="flex-1 bg-surface-container-highest border-thin border-on-surface h-1/2"></div>
                <div className="flex-1 bg-surface-container-highest border-thin border-on-surface h-2/3"></div>
                <div className="flex-1 bg-surface-container-highest border-thin border-on-surface h-1/3"></div>
              </div>
              <div className="flex justify-between mt-2 font-label-sm text-label-sm text-on-surface-variant">
                <span>MON</span>
                <span>WED</span>
                <span>SUN</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
