import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';

export default function WorkoutBuilder() {
  const { token } = useContext(AuthContext);
  const [templates, setTemplates] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  // AI Generator Form States
  const [goal, setGoal] = useState('Hypertrophy');
  const [experience, setExperience] = useState('Intermediate');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [optimizationInsight, setOptimizationInsight] = useState('');

  // 1RM Predictor States
  const [oneRepMaxInput, setOneRepMaxInput] = useState({ weight: '', reps: '' });
  const [predictedOneRepMax, setPredictedOneRepMax] = useState(null);

  useEffect(() => {
    // Mock template list loading
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [token]);

  const handle1RMCalculate = (e) => {
    e.preventDefault();
    const w = parseFloat(oneRepMaxInput.weight);
    const r = parseInt(oneRepMaxInput.reps, 10);
    if (w > 0 && r > 0) {
      let oneRM = 0;
      if (r === 1) {
        oneRM = w;
      } else {
        // Brzycki formula
        oneRM = w / (1.0278 - 0.0278 * r);
      }
      setPredictedOneRepMax(Math.round(oneRM));
    }
  };

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    if (!token) return;
    setGenerating(true);
    try {
      const response = await fetch('http://localhost:8000/api/fitness/generate-plan/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          goal,
          experience_level: experience
        })
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedExercises(data.exercises);
        setOptimizationInsight(data.ai_optimization_insight);
        
        // Append generated plan name to templates list
        const newTemplate = {
          id: Date.now(),
          name: data.routine_name
        };
        setTemplates(prev => [newTemplate, ...prev]);
        setIsModalOpen(false);
      } else {
        alert('Failed to generate workout plan. Please verify server status.');
      }
    } catch (err) {
      console.error('Error generating workout plan:', err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-stack-md">
            <span className="material-symbols-outlined text-primary animate-spin">progress_activity</span>
            <p className="font-headline-md text-headline-md uppercase">Loading Builder...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-margin-mobile bg-background h-full overflow-y-auto">
      <div className="max-w-[1400px] mx-auto space-y-stack-lg">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-end border-thick border-on-surface p-4 sm:p-stack-lg bg-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] gap-4">
          <div>
            <h2 className="font-headline-xl text-headline-xl uppercase tracking-tight">Build It</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Customize your engineering targets for maximum output.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-container text-on-primary-container border-thick border-on-surface px-6 sm:px-12 py-4 sm:py-6 font-label-bold sm:font-headline-md text-headline-sm sm:text-headline-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] sm:active:translate-x-[8px] sm:active:translate-y-[8px] active:shadow-none transition-all flex items-center justify-center gap-stack-md cursor-pointer hover:bg-primary-container/90"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            AI Generate Plan
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-12 gap-stack-lg">
          {/* Left Column: Equipment & Calculator */}
          <section className="col-span-12 md:col-span-4 lg:col-span-3 space-y-stack-md">
            <div className="border-thick border-on-surface bg-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-stack-sm mb-stack-md">
                <span className="material-symbols-outlined text-primary">home_repair_service</span>
                <h3 className="font-label-bold text-label-bold uppercase">Available Equipment</h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mb-stack-md">No equipment configured yet.</p>
              <button className="w-full border-thin border-on-surface border-dashed p-stack-sm font-label-bold text-label-bold flex items-center justify-center gap-2 hover:bg-surface-container-low transition-all">
                <span className="material-symbols-outlined">add</span>
                Add Equipment
              </button>
            </div>

            <div className="border-thick border-on-surface bg-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-label-bold text-label-bold uppercase mb-stack-md">Recent Templates</h3>
              {templates.length === 0 ? (
                <p className="font-body-md text-body-md text-on-surface-variant italic">No templates saved yet.</p>
              ) : (
                <div className="space-y-stack-sm">
                  {templates.map((t) => (
                    <div key={t.id} className="p-stack-sm border-thin border-on-surface bg-surface-container-low hover:bg-primary-container transition-colors cursor-pointer">
                      <p className="font-label-bold text-label-bold">{t.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 1RM Strength Predictor Card */}
            <div className="border-thick border-on-surface bg-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-stack-sm mb-stack-md">
                <span className="material-symbols-outlined text-primary">calculate</span>
                <h3 className="font-label-bold text-label-bold uppercase">1RM Calculator</h3>
              </div>
              <form onSubmit={handle1RMCalculate} className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block font-label-bold text-label-sm uppercase mb-1">Weight (kg)</label>
                    <input 
                      type="number" 
                      value={oneRepMaxInput.weight} 
                      onChange={(e) => setOneRepMaxInput(prev => ({ ...prev, weight: e.target.value }))}
                      className="w-full bg-surface-container-low border-thin border-on-surface p-2 font-body-md focus:border-thick focus:bg-primary-container/10 outline-none" 
                      required 
                      placeholder="e.g. 80"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block font-label-bold text-label-sm uppercase mb-1">Reps</label>
                    <input 
                      type="number" 
                      value={oneRepMaxInput.reps} 
                      onChange={(e) => setOneRepMaxInput(prev => ({ ...prev, reps: e.target.value }))}
                      className="w-full bg-surface-container-low border-thin border-on-surface p-2 font-body-md focus:border-thick focus:bg-primary-container/10 outline-none" 
                      required 
                      placeholder="e.g. 5"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-2 bg-secondary text-on-secondary font-label-bold text-label-bold border-thin border-on-surface shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-secondary-container hover:text-on-secondary-container transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer uppercase">
                  Predict Max
                </button>
              </form>
              {predictedOneRepMax && (
                <div className="mt-4 p-3 border-thin border-on-surface bg-primary-container text-on-primary-container font-label-bold text-label-bold text-center">
                  ESTIMATED 1RM: {predictedOneRepMax} KG
                </div>
              )}
            </div>
          </section>

          {/* Center Column: Selected Routine */}
          <section className="col-span-12 md:col-span-8 lg:col-span-5 space-y-stack-md">
            <div className="border-thick border-on-surface bg-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col min-h-[500px]">
              <div className="p-stack-md border-b-thick border-on-surface flex justify-between items-center bg-surface-container-high">
                <h3 className="font-label-bold text-label-bold uppercase">Selected Routine</h3>
                <div className="flex gap-2">
                  <span className="font-label-sm text-label-sm px-2 py-1 bg-on-surface text-surface">{selectedExercises.length} EXERCISES</span>
                </div>
              </div>
              <div className="flex-1 p-stack-md space-y-stack-md overflow-y-auto">
                {selectedExercises.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16">
                    <span className="material-symbols-outlined text-[64px] text-outline mb-stack-md">format_list_bulleted</span>
                    <h4 className="font-headline-md text-headline-md uppercase mb-stack-sm">No Exercises Selected</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">
                      Use "AI Generate Plan" above or browse the Exercise Library to add exercises to your workout.
                    </p>
                  </div>
                ) : (
                  selectedExercises.map((ex, idx) => (
                    <div key={idx} className="group relative bg-surface border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center gap-stack-md">
                        <span className="material-symbols-outlined text-outline">drag_indicator</span>
                        <div className="flex-1">
                          <h4 className="font-label-bold text-label-bold">{ex.name}</h4>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">{ex.sets} Sets × {ex.reps} Reps | {ex.intensity} ({ex.rest})</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Right Column: AI Insights */}
          <section className="col-span-12 lg:col-span-4 space-y-stack-lg">
            <div className="border-thick border-on-surface bg-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-r-8 border-secondary">
              <div className="flex items-center justify-between mb-stack-md">
                <div className="flex items-center gap-stack-sm">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <h3 className="font-label-bold text-label-bold uppercase">AI Suggestions</h3>
                </div>
                <span className="font-label-sm text-label-sm text-secondary font-bold">SMART MATCH</span>
              </div>
              {optimizationInsight ? (
                <div className="space-y-2">
                  <p className="font-label-bold text-label-sm text-primary uppercase">VOLUME DISTRIBUTION TARGETED</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">The ML classifier populated your list based on available compound/accessory ratios.</p>
                </div>
              ) : (
                <p className="font-body-md text-body-md text-on-surface-variant italic">
                  Build your first workout routine to receive AI-powered exercise suggestions and optimizations.
                </p>
              )}
            </div>

            <div className="border-thick border-on-surface bg-primary-container p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-start gap-stack-md">
                <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                <div>
                  <h3 className="font-label-bold text-label-bold uppercase mb-stack-sm">Optimization Insight</h3>
                  <p className="font-body-md text-body-md text-on-primary-container">
                    {optimizationInsight || "Start adding exercises to your routine. The AI will analyze your push/pull balance, volume distribution, and recovery needs in real-time."}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* AI Generate Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border-thick border-on-surface shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
            <div className="bg-on-surface text-surface p-3 flex justify-between items-center">
              <h3 className="font-headline-sm uppercase">AI Workout Classifier</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-surface hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleGeneratePlan} className="p-stack-md space-y-4">
              <div>
                <label className="block font-label-bold uppercase mb-1">Target Training Goal</label>
                <select 
                  value={goal} 
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-surface border-thin border-on-surface p-2 font-body-md focus:border-thick outline-none"
                >
                  <option value="Hypertrophy">Hypertrophy (Muscle Growth)</option>
                  <option value="Strength">Strength (Maximum Output)</option>
                  <option value="Endurance">Endurance (Mitochondrial Capacity)</option>
                </select>
              </div>

              <div>
                <label className="block font-label-bold uppercase mb-1">Experience Level</label>
                <select 
                  value={experience} 
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full bg-surface border-thin border-on-surface p-2 font-body-md focus:border-thick outline-none"
                >
                  <option value="Beginner">Beginner (Adaptation Focus)</option>
                  <option value="Intermediate">Intermediate (Capacity Focus)</option>
                  <option value="Advanced">Advanced (Overload Focus)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t-thin border-outline mt-4">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-surface-variant border-thick border-on-surface font-label-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={generating}
                  className="px-4 py-2 bg-primary text-on-primary border-thick border-on-surface font-label-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer flex items-center gap-2"
                >
                  {generating ? 'Classifying...' : 'Generate Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
