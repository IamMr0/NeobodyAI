export default function Nutrition() {
  return (
    <div className="p-margin-mobile w-full h-full overflow-y-auto">
      {/* Summary Section */}
      <section className="mb-stack-lg">
        <div className="bg-surface border-thick border-on-surface p-stack-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-stretch md:items-end justify-between gap-stack-md">
            <div>
              <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-widest">Fuel Level</span>
              <h3 className="font-headline-xl text-headline-xl mt-stack-sm">2,850 <span className="text-headline-md">kcal</span></h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Target: 3,200 kcal / 350 left</p>
            </div>
            <div className="flex-grow max-w-2xl px-0 md:px-stack-lg w-full">
              <div className="h-8 border-thick border-on-surface flex bg-surface-container overflow-hidden">
                <div className="h-full bg-tertiary-fixed-dim border-r-thin border-on-surface w-[85%]"></div>
                <div className="h-full bg-surface-container flex-grow"></div>
              </div>
            </div>
            <div className="flex gap-stack-sm justify-start md:justify-end">
              <div className="bg-primary-container border-thin border-on-surface px-4 py-2 flex items-center gap-2">
                <span className="material-symbols-outlined">bolt</span>
                <span className="font-label-bold text-label-bold">SURPLUS ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-stack-lg">
        {/* Left: Macro Grid & Meals */}
        <div className="col-span-12 lg:col-span-8 space-y-stack-lg">
          {/* Macro Cards Bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
            {/* Protein */}
            <div className="bg-secondary-container text-on-secondary-container border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>fitness_center</span>
              <h4 className="font-label-bold text-label-bold mt-stack-sm">PROTEIN</h4>
              <div className="font-headline-md text-headline-md">180g</div>
              <p className="font-label-sm text-label-sm opacity-80">90% of daily goal</p>
            </div>
            {/* Carbs */}
            <div className="bg-primary-container text-on-primary-container border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bakery_dining</span>
              <h4 className="font-label-bold text-label-bold mt-stack-sm">CARBS</h4>
              <div className="font-headline-md text-headline-md">320g</div>
              <p className="font-label-sm text-label-sm opacity-80">75% of daily goal</p>
            </div>
            {/* Fats */}
            <div className="bg-tertiary-fixed-dim text-on-tertiary-fixed border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>opacity</span>
              <h4 className="font-label-bold text-label-bold mt-stack-sm">FATS</h4>
              <div className="font-headline-md text-headline-md">65g</div>
              <p className="font-label-sm text-label-sm opacity-80">Target reached</p>
            </div>
          </div>

          {/* Today's Meals */}
          <div className="space-y-stack-md">
            <h3 className="font-headline-md text-headline-md">Today's Meals</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
              {/* Breakfast */}
              <div className="bg-surface border-thick border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col group overflow-hidden">
                <div className="h-40 border-b-thin border-on-surface relative overflow-hidden">
                  <img alt="Healthy Breakfast" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJDrX6MdQoelgZxHZdqNQprSLce2PYzIckmB_pdwpUJ6kIHddMOpb0TwdN8H3Yvxy5AgV-4-cEsXWM_uL7a5kWXnL2vWdc3-a7bslLiV0LZqdS4lnptFnaVIbkTQ554pLp6mI4vrLPpcp9ASq7DWUwtKtkG_Stfjw32C8HlIftmBaW-KlhGd8VpY3yJko88Fzm7Mpoxk03jIWc5S-fzTY67IIqaEcAubCYEWUGyWlIPQ1X0-qroe4WGP63S6q5MJWcWl3UsVOlu7YM" />
                  <div className="absolute top-2 left-2 bg-on-surface text-surface px-2 py-1 font-label-sm text-label-sm uppercase">08:00 AM</div>
                </div>
                <div className="p-stack-sm">
                  <h5 className="font-label-bold text-label-bold">Breakfast Bowl</h5>
                  <p className="font-body-md text-body-md opacity-70">Eggs, Avocado, Toast</p>
                  <div className="mt-stack-sm font-label-bold text-label-bold text-secondary">640 kcal</div>
                </div>
              </div>

              {/* Lunch */}
              <div className="bg-surface border-thick border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col group overflow-hidden">
                <div className="h-40 border-b-thin border-on-surface relative overflow-hidden">
                  <img alt="Nutritious Lunch" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp5cRzNCpCtJPaXYarlXJJ6ibGMqRTrbmW5B7jDWgzXyXyiYBM1ZGn0iwC2kyBEwMDsjIBl5lQ8G16oho1lq8u3ZV4ddjhIMjLBEV8wFSdMoni-KRInEQdHM_HKYPrJGWBENdw0TwO2VC7s8FpZysvRKqMAFionF1BRXDHnTdDAAVGMMHNIAgv4CYvPK7PtNgCxVtpDSVDEODi_NWkc24VkfHUtkRNPs6ImRXK8P0AgBFjdvsgsVbGUm0I2XjzcGeQ0o7G0IbBYZTt" />
                  <div className="absolute top-2 left-2 bg-on-surface text-surface px-2 py-1 font-label-sm text-label-sm uppercase">01:30 PM</div>
                </div>
                <div className="p-stack-sm">
                  <h5 className="font-label-bold text-label-bold">Salmon & Quinoa</h5>
                  <p className="font-body-md text-body-md opacity-70">Salmon, Greens, Seeds</p>
                  <div className="mt-stack-sm font-label-bold text-label-bold text-secondary">820 kcal</div>
                </div>
              </div>

              {/* Dinner (Pending) */}
              <div className="border-thick border-dashed border-outline-variant flex flex-col items-center justify-center p-stack-lg text-center bg-surface-container-low hover:bg-surface-container-high transition-all cursor-pointer">
                <span className="material-symbols-outlined text-[48px] text-outline">add_circle</span>
                <h5 className="font-label-bold text-label-bold mt-stack-sm uppercase">Pending Meal</h5>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-[150px]">Dinner target: 1,100 kcal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: AI Insight Sidebar */}
        <aside className="col-span-12 lg:col-span-4 space-y-stack-lg">
          <div className="bg-surface border-thick border-secondary p-stack-md shadow-[4px_4px_0px_0px_#18181b] relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-secondary text-on-secondary px-3 py-1 font-label-bold text-label-sm uppercase">AI Insight</div>
            <div className="flex items-center gap-stack-sm mb-stack-md mt-2">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              <h4 className="font-label-bold text-label-bold uppercase">Metabolic Status</h4>
            </div>
            <div className="space-y-stack-md">
              <div className="p-stack-sm border-thin border-secondary bg-secondary/5">
                <div className="flex justify-between font-label-bold text-label-sm mb-1 uppercase">Glycogen Levels</div>
                <div className="h-3 border-thin border-on-surface bg-surface overflow-hidden">
                  <div className="h-full bg-secondary-container w-[45%]"></div>
                </div>
                <p className="mt-2 font-body-md text-body-md italic text-on-surface-variant">"Moderate depletion detected post-leg session. Carbs intake is currently suboptimal for recovery."</p>
              </div>
              
              <div className="p-stack-sm border-thin border-tertiary bg-tertiary-container/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-tertiary text-sm">rebase_edit</span>
                  <h5 className="font-label-bold text-label-bold uppercase">Recommendation</h5>
                </div>
                <ul className="font-body-md text-body-md space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-tertiary scale-75">check_circle</span>
                    <span>Increase complex carbs by 45g in dinner.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-tertiary scale-75">check_circle</span>
                    <span>Add 300ml electrolyte beverage.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Water Tracker */}
          <div className="bg-surface border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-center mb-stack-md">
              <h4 className="font-label-bold text-label-bold uppercase">Hydration</h4>
              <span className="font-label-bold text-label-bold">2.4 / 3.5 L</span>
            </div>
            <div className="grid grid-cols-10 gap-1 h-8">
              <div className="bg-secondary-container border-thin border-on-surface"></div>
              <div className="bg-secondary-container border-thin border-on-surface"></div>
              <div className="bg-secondary-container border-thin border-on-surface"></div>
              <div className="bg-secondary-container border-thin border-on-surface"></div>
              <div className="bg-secondary-container border-thin border-on-surface"></div>
              <div className="bg-secondary-container border-thin border-on-surface"></div>
              <div className="bg-surface-container border-thin border-on-surface"></div>
              <div className="bg-surface-container border-thin border-on-surface"></div>
              <div className="bg-surface-container border-thin border-on-surface"></div>
              <div className="bg-surface-container border-thin border-on-surface"></div>
            </div>
            <button className="w-full mt-stack-md border-thin border-on-surface p-2 font-label-bold text-label-sm hover:bg-surface-container-high active:scale-95 transition-all">
              + LOG 250ML
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
