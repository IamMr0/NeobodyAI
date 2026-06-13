import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';

export default function Nutrition() {
  const { token } = useContext(AuthContext);
  const [nutrition, setNutrition] = useState(null);
  const [hydration, setHydration] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch from /api/nutrition/ when endpoint is ready
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-stack-md">
            <span className="material-symbols-outlined text-primary animate-spin">progress_activity</span>
            <p className="font-headline-md text-headline-md uppercase">Loading Fuel Data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!nutrition) {
    return (
      <div className="p-margin-mobile w-full h-full overflow-y-auto">
        {/* Empty Fuel Level */}
        <section className="mb-stack-lg">
          <div className="bg-surface border-thick border-on-surface p-stack-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col md:flex-row items-stretch md:items-end justify-between gap-stack-md">
              <div>
                <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-widest">Fuel Level</span>
                <h3 className="font-headline-xl text-headline-xl mt-stack-sm text-outline">— <span className="text-headline-md">kcal</span></h3>
                <p className="font-body-md text-body-md text-on-surface-variant">No intake logged today</p>
              </div>
              <div className="flex-grow max-w-2xl px-0 md:px-stack-lg w-full">
                <div className="h-8 border-thick border-on-surface flex bg-surface-container overflow-hidden">
                  <div className="h-full bg-surface-container flex-grow"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-12 gap-stack-lg">
          <div className="col-span-12 lg:col-span-8 space-y-stack-lg">
            {/* Empty Macro Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
              <div className="bg-secondary-container text-on-secondary-container border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>fitness_center</span>
                <h4 className="font-label-bold text-label-bold mt-stack-sm">PROTEIN</h4>
                <div className="font-headline-md text-headline-md">—g</div>
                <p className="font-label-sm text-label-sm opacity-80">No data yet</p>
              </div>
              <div className="bg-primary-container text-on-primary-container border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bakery_dining</span>
                <h4 className="font-label-bold text-label-bold mt-stack-sm">CARBS</h4>
                <div className="font-headline-md text-headline-md">—g</div>
                <p className="font-label-sm text-label-sm opacity-80">No data yet</p>
              </div>
              <div className="bg-tertiary-fixed-dim text-on-tertiary-fixed border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>opacity</span>
                <h4 className="font-label-bold text-label-bold mt-stack-sm">FATS</h4>
                <div className="font-headline-md text-headline-md">—g</div>
                <p className="font-label-sm text-label-sm opacity-80">No data yet</p>
              </div>
            </div>

            {/* Empty Meals */}
            <div className="space-y-stack-md">
              <h3 className="font-headline-md text-headline-md">Today's Meals</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
                {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
                  <div key={meal} className="border-thick border-dashed border-outline-variant flex flex-col items-center justify-center p-stack-lg text-center bg-surface-container-low hover:bg-surface-container-high transition-all cursor-pointer">
                    <span className="material-symbols-outlined text-[48px] text-outline">add_circle</span>
                    <h5 className="font-label-bold text-label-bold mt-stack-sm uppercase">{meal}</h5>
                    <p className="font-body-md text-body-md text-on-surface-variant">Tap to log meal</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Empty Sidebar */}
          <aside className="col-span-12 lg:col-span-4 space-y-stack-lg">
            <div className="bg-surface border-thick border-secondary p-stack-md shadow-[4px_4px_0px_0px_#18181b] relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-secondary text-on-secondary px-3 py-1 font-label-bold text-label-sm uppercase">AI Insight</div>
              <div className="flex items-center gap-stack-sm mb-stack-md mt-2">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                <h4 className="font-label-bold text-label-bold uppercase">Metabolic Status</h4>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant italic">
                No nutrition data logged. Start tracking your meals to receive AI-powered metabolic insights and recommendations.
              </p>
            </div>

            {/* Empty Hydration */}
            <div className="bg-surface border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex justify-between items-center mb-stack-md">
                <h4 className="font-label-bold text-label-bold uppercase">Hydration</h4>
                <span className="font-label-bold text-label-bold">— / — L</span>
              </div>
              <div className="grid grid-cols-10 gap-1 h-8">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="bg-surface-container border-thin border-on-surface"></div>
                ))}
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

  // When real data exists, render populated version
  return (
    <div className="p-margin-mobile w-full h-full overflow-y-auto">
      <section className="mb-stack-lg">
        <div className="bg-surface border-thick border-on-surface p-stack-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-widest">Fuel Level</span>
          <h3 className="font-headline-xl text-headline-xl mt-stack-sm">{nutrition.kcal_consumed} <span className="text-headline-md">kcal</span></h3>
          <p className="font-body-md text-body-md text-on-surface-variant">Target: {nutrition.kcal_target} kcal</p>
        </div>
      </section>
    </div>
  );
}
