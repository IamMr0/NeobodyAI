import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';

export default function BodyAnalysis() {
  const { token } = useContext(AuthContext);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    weight_kg: '',
    body_fat_percentage: '',
    muscle_mass_kg: ''
  });

  const fetchMetrics = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:8000/api/fitness/body-metrics/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMetrics(data); // Can be null if no data exists
      } else {
        setError('Failed to load body metrics.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.weight_kg) return;
    
    setSubmitting(true);
    
    // Clean empty strings to nulls
    const payload = {
      weight_kg: formData.weight_kg,
      body_fat_percentage: formData.body_fat_percentage || null,
      muscle_mass_kg: formData.muscle_mass_kg || null,
    };

    try {
      const response = await fetch('http://localhost:8000/api/fitness/body-metrics/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
        setFormData({ weight_kg: '', body_fat_percentage: '', muscle_mass_kg: '' });
      } else {
        alert('Failed to save metrics');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <div className="p-margin-mobile max-w-7xl mx-auto space-y-stack-lg h-full overflow-y-auto pb-24">
      {/* Header */}
      <div className="bg-surface-container-lowest border-thick border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="bg-on-surface p-stack-md">
          <div className="flex items-center gap-stack-sm">
            <span className="material-symbols-outlined text-primary-container text-3xl">body_system</span>
            <h2 className="font-headline-xl text-headline-xl text-surface uppercase tracking-tight">AI Body Analysis</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
        
        {/* Left Column: Data Input */}
        <div className="lg:col-span-5 space-y-stack-md">
          <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-headline-md text-headline-md uppercase border-b-thick border-on-surface pb-2 mb-stack-md">
              Log New Scan
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-label-bold uppercase mb-1">Weight (kg) *</label>
                <input 
                  type="number" step="0.1" name="weight_kg" required
                  value={formData.weight_kg} onChange={handleInputChange}
                  className="w-full bg-surface border-thin border-on-surface p-3 font-body-lg focus:border-thick focus:bg-primary-container/10 outline-none"
                  placeholder="e.g., 80.5"
                />
              </div>
              <div>
                <label className="block font-label-bold uppercase mb-1">Body Fat (%)</label>
                <input 
                  type="number" step="0.1" name="body_fat_percentage" 
                  value={formData.body_fat_percentage} onChange={handleInputChange}
                  className="w-full bg-surface border-thin border-on-surface p-3 font-body-lg focus:border-thick focus:bg-primary-container/10 outline-none"
                  placeholder="e.g., 15.2"
                />
              </div>
              <div>
                <label className="block font-label-bold uppercase mb-1">Muscle Mass (kg)</label>
                <input 
                  type="number" step="0.1" name="muscle_mass_kg" 
                  value={formData.muscle_mass_kg} onChange={handleInputChange}
                  className="w-full bg-surface border-thin border-on-surface p-3 font-body-lg focus:border-thick focus:bg-primary-container/10 outline-none"
                  placeholder="e.g., 38.0"
                />
              </div>
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-primary text-on-primary border-thick border-on-surface py-3 font-label-bold text-label-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase flex justify-center items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-stack-md"
              >
                {submitting ? (
                  <><span className="material-symbols-outlined animate-spin">sync</span> Generating AI Insight...</>
                ) : (
                  <><span className="material-symbols-outlined">add_chart</span> Analyze Metrics</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Dashboard & AI Insight */}
        <div className="lg:col-span-7 space-y-stack-md">
          {metrics ? (
            <>
              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
                <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                  <p className="font-label-bold text-label-bold text-on-surface-variant uppercase mb-2">Weight</p>
                  <h2 className="font-headline-xl text-headline-xl text-on-surface">{metrics.weight_kg} <span className="text-headline-md">KG</span></h2>
                </div>
                <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                  <p className="font-label-bold text-label-bold text-on-surface-variant uppercase mb-2">Body Fat</p>
                  <h2 className="font-headline-xl text-headline-xl text-on-surface">{metrics.body_fat_percentage ?? '—'} <span className="text-headline-md">%</span></h2>
                </div>
                <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                  <p className="font-label-bold text-label-bold text-on-surface-variant uppercase mb-2">Muscle Mass</p>
                  <h2 className="font-headline-xl text-headline-xl text-on-surface">{metrics.muscle_mass_kg ?? '—'} <span className="text-headline-md">KG</span></h2>
                </div>
              </div>

              {/* AI Insight */}
              <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-l-[8px] border-l-secondary">
                <div className="flex items-center gap-2 mb-stack-md border-b-thin border-on-surface pb-2">
                  <span className="material-symbols-outlined text-secondary text-3xl">auto_awesome</span>
                  <h3 className="font-headline-md text-headline-md text-secondary uppercase">Metabolic Insight</h3>
                </div>
                <p className="font-body-lg text-body-lg text-on-surface leading-relaxed break-words whitespace-pre-wrap">
                  {metrics.metabolic_insight || "Awaiting insight generation."}
                </p>
              </div>
            </>
          ) : (
            /* Empty Dashboard State */
            <div className="h-full flex flex-col items-center justify-center text-center bg-surface-container-low border-thick border-dashed border-outline p-stack-lg">
              <span className="material-symbols-outlined text-outline" style={{ fontSize: '64px' }}>monitoring</span>
              <h3 className="font-headline-md text-headline-md uppercase mt-stack-md">No Data Recorded</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mt-2">
                Use the form on the left to log your first body scan. IRON AI will instantly analyze your metrics.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
