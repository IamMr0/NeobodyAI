import { useState, useEffect, useContext, useRef } from 'react';
import AuthContext from '../context/AuthContext';

export default function BodyAnalysis() {
  const { token } = useContext(AuthContext);
  const [metrics, setMetrics] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Physique Scan states
  const [scanImage, setScanImage] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanFeedback, setScanFeedback] = useState('');
  const scanFileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    weight_kg: '',
    body_fat_percentage: '',
    muscle_mass_kg: ''
  });

  const handleScanImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScanImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhysiqueScan = async (e) => {
    e.preventDefault();
    if (!scanImage || !token) return;
    setScanning(true);
    setScanFeedback('');
    try {
      const response = await fetch('http://localhost:8000/api/fitness/body-scan/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ image: scanImage })
      });
      if (response.ok) {
        const data = await response.json();
        setScanFeedback(data.feedback);
        if (data.latest_metrics) {
          setMetrics(data.latest_metrics);
        }
        setScanImage(null);
      } else {
        alert('Failed to analyze body posture scan');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setScanning(false);
    }
  };

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
    }
  };

  const fetchTrends = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:8000/api/fitness/trends/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTrends(data);
      }
    } catch (err) {
      console.error('Failed to load body metrics trends:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchMetrics(), fetchTrends()]);
      setLoading(false);
    };
    loadData();
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
        await fetchTrends(); // Refresh predictions and sparkline after saving
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

          {/* Physique / Posture Scan Card */}
          <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-4">
            <h3 className="font-headline-md text-headline-md uppercase border-b-thick border-on-surface pb-2 mb-stack-md">
              Posture & Physique Scan
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4 leading-relaxed">
              Upload a front/profile photo of your physique to get instant posture evaluations and developmental feedback from Groq Llama 4 Vision.
            </p>
            <form onSubmit={handlePhysiqueScan} className="space-y-4">
              <input 
                type="file" 
                ref={scanFileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleScanImageChange} 
              />
              <button 
                type="button"
                onClick={() => scanFileInputRef.current?.click()}
                className="w-full border-thick border-dashed border-outline-variant p-6 font-label-bold text-label-bold flex flex-col items-center justify-center gap-2 hover:bg-surface-container-low transition-all bg-surface"
              >
                {scanImage ? (
                  <>
                    <img src={scanImage} alt="Body preview" className="h-32 w-auto object-contain border-thin border-on-surface mb-2 bg-white" />
                    <span className="text-primary text-sm uppercase">CHANGE PHOTO</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-4xl text-outline">photo_camera</span>
                    <span className="uppercase">CHOOSE PHYSIQUE PHOTO</span>
                  </>
                )}
              </button>

              <button 
                type="submit" 
                disabled={scanning || !scanImage}
                className="w-full bg-secondary text-on-secondary border-thick border-on-surface py-3 font-label-bold text-label-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {scanning ? (
                  <><span className="material-symbols-outlined animate-spin">sync</span> ANALYZING PHYSIQUE...</>
                ) : (
                  <><span className="material-symbols-outlined">center_focus_strong</span> SCAN PHYSIQUE</>
                )}
              </button>
            </form>

            {scanFeedback && (
              <div className="mt-6 border-thick border-on-surface p-4 bg-primary-container text-on-primary-container shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-on-primary px-3 py-1 font-label-bold text-label-sm uppercase">AI Posture Scan</div>
                <h4 className="font-label-bold text-label-bold uppercase mb-2 mt-2">Iron AI Biomechanical Feedback</h4>
                <p className="font-body-md text-body-md leading-relaxed whitespace-pre-wrap">{scanFeedback}</p>
              </div>
            )}
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

              {/* Data Science & Predictions Card */}
              {trends && (
                <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary text-on-primary px-3 py-1 font-label-bold text-label-sm uppercase">Data Science</div>
                  <div className="flex items-center gap-2 mb-stack-md border-b-thin border-on-surface pb-2 mt-4">
                    <span className="material-symbols-outlined text-primary text-3xl">query_stats</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface uppercase">Metabolic Predictions</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md mb-6">
                    {/* FFMI Indicator */}
                    <div className="border-thin border-on-surface p-4 bg-surface-container-low">
                      <p className="font-label-bold text-label-sm text-on-surface-variant uppercase mb-1">Fat-Free Mass Index (FFMI)</p>
                      <h4 className="font-headline-lg text-headline-lg">{trends.physiological_stats?.ffmi ?? '—'}</h4>
                      <p className="font-label-sm text-label-sm text-primary uppercase mt-1">{trends.physiological_stats?.ffmi_class}</p>
                    </div>

                    {/* BMR Indicator */}
                    <div className="border-thin border-on-surface p-4 bg-surface-container-low">
                      <p className="font-label-bold text-label-sm text-on-surface-variant uppercase mb-1">Basal Metabolic Rate (BMR)</p>
                      <h4 className="font-headline-lg text-headline-lg">{trends.physiological_stats?.bmr ?? '—'} <span className="text-body-md font-medium uppercase text-on-surface-variant">kcal</span></h4>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-1">Est. daily energy required at rest.</p>
                    </div>
                  </div>

                  {/* Projections */}
                  {trends.projection && (
                    <div className="border-thick border-on-surface p-4 bg-primary-container text-on-primary-container mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <h4 className="font-label-bold text-label-bold uppercase mb-2">30-Day Trend Forecasting</h4>
                      <p className="font-body-lg text-body-lg">
                        Based on your logging velocity, your weight is projected to reach <strong className="underline">{trends.projection.weight_in_30_days} kg</strong> ({trends.projection.weight_change >= 0 ? `+${trends.projection.weight_change}` : trends.projection.weight_change} kg change) in 30 days.
                      </p>
                      {trends.projection.body_fat_in_30_days && (
                        <p className="font-body-md text-body-md text-on-primary-container/85 mt-1">
                          Body fat is expected to align at roughly {trends.projection.body_fat_in_30_days}% ({trends.projection.body_fat_change >= 0 ? `+${trends.projection.body_fat_change}` : trends.projection.body_fat_change}% change).
                        </p>
                      )}
                    </div>
                  )}

                  {/* SVG Sparkline / Trend Graph */}
                  {trends.historical_data?.length >= 2 && (
                    <div>
                      <p className="font-label-bold text-label-sm text-on-surface-variant uppercase mb-3">Weight History Trendline</p>
                      <div className="h-28 w-full border-thin border-on-surface bg-surface-container-low flex items-center justify-center p-2">
                        {(() => {
                          const weights = trends.historical_data.map(h => h.weight);
                          const minWeight = Math.min(...weights) - 0.5;
                          const maxWeight = Math.max(...weights) + 0.5;
                          const weightRange = maxWeight - minWeight || 1;
                          const width = 500;
                          const height = 80;
                          const points = trends.historical_data.map((h, i) => {
                            const x = (i / (trends.historical_data.length - 1)) * (width - 20) + 10;
                            const y = height - ((h.weight - minWeight) / weightRange) * (height - 20) - 10;
                            return `${x},${y}`;
                          }).join(' ');

                          return (
                            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                              <polyline
                                fill="none"
                                stroke="var(--color-primary)"
                                strokeWidth="3"
                                points={points}
                              />
                              {trends.historical_data.map((h, i) => {
                                const x = (i / (trends.historical_data.length - 1)) * (width - 20) + 10;
                                const y = height - ((h.weight - minWeight) / weightRange) * (height - 20) - 10;
                                return (
                                  <g key={i} className="group">
                                    <circle
                                      cx={x}
                                      cy={y}
                                      r="5"
                                      className="fill-on-surface stroke-surface stroke-2 cursor-pointer hover:r-6 transition-all"
                                    />
                                    <title>{`Date: ${h.date}\nWeight: ${h.weight} kg`}</title>
                                  </g>
                                );
                              })}
                            </svg>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              )}
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
