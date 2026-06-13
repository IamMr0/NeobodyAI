import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';

export default function BodyAnalysis() {
  const { token } = useContext(AuthContext);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch from /api/fitness/body-metrics/ when endpoint is ready
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-stack-md">
            <span className="material-symbols-outlined text-primary animate-spin">progress_activity</span>
            <p className="font-headline-md text-headline-md uppercase">Scanning Body Data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-margin-mobile max-w-7xl mx-auto space-y-stack-lg h-full overflow-y-auto">
        {/* Empty State Hero */}
        <div className="bg-surface-container-lowest border-thick border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="bg-on-surface p-stack-md">
            <div className="flex items-center gap-stack-sm">
              <span className="material-symbols-outlined text-primary-container text-3xl">body_system</span>
              <h2 className="font-headline-xl text-headline-xl text-surface uppercase tracking-tight">AI Body Analysis</h2>
            </div>
          </div>
          <div className="p-stack-lg flex flex-col items-center text-center">
            <div className="w-24 h-24 border-thick border-on-surface bg-surface-container flex items-center justify-center mb-stack-md">
              <span className="material-symbols-outlined text-outline" style={{ fontSize: '48px' }}>monitoring</span>
            </div>
            <h3 className="font-headline-md text-headline-md uppercase mb-stack-sm">No Body Data Recorded</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-stack-lg">
              Start tracking your body composition to unlock AI-powered insights. Log your weight, body fat, and muscle mass to begin.
            </p>
            <button className="bg-primary-container text-on-primary-container border-thick border-on-surface px-8 py-stack-md font-label-bold text-label-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-wider">
              Begin First Scan
            </button>
          </div>
        </div>

        {/* Placeholder Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
          {['Weight', 'Body Fat', 'Muscle Mass'].map((label) => (
            <div key={label} className="bg-surface-container-lowest border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-label-bold text-label-bold text-on-surface-variant uppercase mb-2">{label}</p>
              <h2 className="font-headline-xl text-headline-xl text-outline mb-stack-md">— <span className="text-headline-md">{label === 'Body Fat' ? '%' : 'KG'}</span></h2>
              <div className="h-6 w-full border-thin border-on-surface bg-surface-variant"></div>
            </div>
          ))}
        </div>

        {/* Empty Insight */}
        <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-l-[8px] border-l-secondary-container">
          <div className="flex items-center gap-2 mb-stack-sm">
            <span className="material-symbols-outlined text-secondary">auto_awesome</span>
            <p className="font-label-bold text-label-bold text-secondary">METABOLIC INSIGHT</p>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant italic">
            No data available yet. Record your first body scan to receive AI-powered metabolic insights and recovery recommendations.
          </p>
        </div>
      </div>
    );
  }

  // When real data exists, render the full dashboard
  return (
    <div className="p-margin-mobile max-w-7xl mx-auto space-y-stack-lg h-full overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
        <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-label-bold text-label-bold text-on-surface-variant uppercase mb-2">Current Weight</p>
          <h2 className="font-headline-xl text-headline-xl text-on-surface">{metrics.weight_kg} <span className="text-headline-md">KG</span></h2>
        </div>
        <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-label-bold text-label-bold text-on-surface-variant uppercase mb-2">Body Fat</p>
          <h2 className="font-headline-xl text-headline-xl text-on-surface">{metrics.body_fat_percentage ?? '—'} <span className="text-headline-md">%</span></h2>
        </div>
        <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-label-bold text-label-bold text-on-surface-variant uppercase mb-2">Muscle Mass</p>
          <h2 className="font-headline-xl text-headline-xl text-on-surface">{metrics.muscle_mass_kg ?? '—'} <span className="text-headline-md">KG</span></h2>
        </div>
      </div>
    </div>
  );
}
