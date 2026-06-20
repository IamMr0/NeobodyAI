import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';

export default function Nutrition() {
  const { token } = useContext(AuthContext);
  const [nutrition, setNutrition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form State for Meal Logging
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mealForm, setMealForm] = useState({
    mealName: 'Lunch', // UI only, not sent to backend
    kcal: '',
    protein_g: '',
    carbs_g: '',
    fats_g: ''
  });

  const fetchNutrition = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:8000/api/nutrition/daily/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setNutrition(data);
      } else {
        setError('Failed to load nutrition data.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNutrition();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMealForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLogMeal = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const payload = {
      kcal: mealForm.kcal || 0,
      protein_g: mealForm.protein_g || 0,
      carbs_g: mealForm.carbs_g || 0,
      fats_g: mealForm.fats_g || 0
    };

    try {
      const response = await fetch('http://localhost:8000/api/nutrition/daily/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const data = await response.json();
        setNutrition(data);
        setIsModalOpen(false);
        setMealForm({ mealName: 'Snack', kcal: '', protein_g: '', carbs_g: '', fats_g: '' });
      } else {
        alert('Failed to log meal');
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
            <p className="font-headline-md text-headline-md uppercase">Loading Fuel Data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate percentages
  const kcalPercent = nutrition ? Math.min(100, Math.round((nutrition.kcal_consumed / nutrition.kcal_target) * 100)) : 0;

  return (
    <div className="p-margin-mobile w-full h-full overflow-y-auto pb-24">
      
      {/* Fuel Level Banner */}
      <section className="mb-stack-lg">
        <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col md:flex-row items-stretch md:items-end justify-between gap-stack-md">
            <div>
              <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-widest">Fuel Level</span>
              <h3 className="font-headline-xl text-headline-xl mt-stack-sm text-on-surface">
                {nutrition?.kcal_consumed || 0} <span className="text-headline-md text-on-surface-variant">/ {nutrition?.kcal_target || 2000} kcal</span>
              </h3>
            </div>
            <div className="flex-grow max-w-2xl px-0 md:px-stack-lg w-full flex items-center">
              <div className="h-8 w-full border-thick border-on-surface flex bg-surface-container overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000 ease-in-out" 
                  style={{ width: `${kcalPercent}%` }}
                ></div>
              </div>
              <span className="ml-4 font-headline-md text-headline-md">{kcalPercent}%</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-stack-lg">
        <div className="col-span-12 lg:col-span-8 space-y-stack-lg">
          {/* Macro Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
            <div className="bg-secondary-container text-on-secondary-container border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>fitness_center</span>
              <h4 className="font-label-bold text-label-bold mt-stack-sm">PROTEIN</h4>
              <div className="font-headline-md text-headline-md">{nutrition?.protein_g || 0}g</div>
            </div>
            <div className="bg-primary-container text-on-primary-container border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bakery_dining</span>
              <h4 className="font-label-bold text-label-bold mt-stack-sm">CARBS</h4>
              <div className="font-headline-md text-headline-md">{nutrition?.carbs_g || 0}g</div>
            </div>
            <div className="bg-tertiary-fixed-dim text-on-tertiary-fixed border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>opacity</span>
              <h4 className="font-label-bold text-label-bold mt-stack-sm">FATS</h4>
              <div className="font-headline-md text-headline-md">{nutrition?.fats_g || 0}g</div>
            </div>
          </div>

          {/* Meals */}
          <div className="space-y-stack-md">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md uppercase">Today's Macros</h3>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-primary text-on-primary border-thick border-on-surface px-4 py-2 font-label-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all uppercase cursor-pointer"
              >
                + Log Custom Meal
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
              {['Post-Workout Shake', 'Chicken & Rice'].map((meal) => (
                <div key={meal} className="border-thick border-dashed border-outline flex flex-col items-center justify-center p-stack-lg text-center bg-surface-container-low hover:bg-surface-container-high transition-all cursor-pointer" onClick={() => {
                  setMealForm({ mealName: meal, kcal: meal === 'Chicken & Rice' ? 650 : 250, protein_g: meal === 'Chicken & Rice' ? 55 : 30, carbs_g: meal === 'Chicken & Rice' ? 70 : 10, fats_g: meal === 'Chicken & Rice' ? 12 : 2 });
                  setIsModalOpen(true);
                }}>
                  <span className="material-symbols-outlined text-[48px] text-outline">fastfood</span>
                  <h5 className="font-label-bold text-label-bold mt-stack-sm uppercase">{meal}</h5>
                  <p className="font-body-md text-body-md text-on-surface-variant">Tap to configure & log</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: AI Insight */}
        <aside className="col-span-12 lg:col-span-4 space-y-stack-lg">
          <div className="bg-surface-container-lowest border-thick border-secondary p-stack-md shadow-[6px_6px_0px_0px_#18181b] relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-secondary text-on-secondary px-3 py-1 font-label-bold text-label-sm uppercase">AI Insight</div>
            <div className="flex items-center gap-stack-sm mb-stack-md mt-4 border-b-thin border-outline pb-2">
              <span className="material-symbols-outlined text-secondary text-3xl">smart_toy</span>
              <h4 className="font-headline-md text-headline-md text-secondary uppercase tracking-tight">Metabolic Status</h4>
            </div>
            {nutrition?.ai_insight ? (
              <p className="font-body-lg text-body-lg text-on-surface leading-relaxed whitespace-pre-wrap break-words">
                {nutrition.ai_insight}
              </p>
            ) : (
              <p className="font-body-md text-body-md text-on-surface-variant italic">
                {nutrition?.kcal_consumed > 0 
                  ? "Awaiting AI analysis. Log another meal to trigger fresh insights." 
                  : "No nutrition data logged today. Start tracking your meals to receive AI-powered metabolic insights."}
              </p>
            )}
          </div>
        </aside>
      </div>

      {/* Log Meal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border-thick border-on-surface shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
            <div className="bg-on-surface text-surface p-3 flex justify-between items-center">
              <h3 className="font-headline-sm uppercase">Log Macro Entry</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-surface hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleLogMeal} className="p-stack-md space-y-4">
              <div>
                <label className="block font-label-bold uppercase mb-1">Meal / Item Name (Optional)</label>
                <input 
                  type="text" name="mealName" 
                  value={mealForm.mealName} onChange={handleInputChange}
                  className="w-full bg-surface border-thin border-on-surface p-2 font-body-md focus:border-thick outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-bold uppercase mb-1">Calories (kcal) *</label>
                  <input 
                    type="number" name="kcal" required
                    value={mealForm.kcal} onChange={handleInputChange}
                    className="w-full bg-surface border-thin border-on-surface p-2 font-body-md focus:border-thick outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label-bold uppercase mb-1">Protein (g)</label>
                  <input 
                    type="number" name="protein_g" 
                    value={mealForm.protein_g} onChange={handleInputChange}
                    className="w-full bg-surface border-thin border-on-surface p-2 font-body-md focus:border-thick outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label-bold uppercase mb-1">Carbs (g)</label>
                  <input 
                    type="number" name="carbs_g" 
                    value={mealForm.carbs_g} onChange={handleInputChange}
                    className="w-full bg-surface border-thin border-on-surface p-2 font-body-md focus:border-thick outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label-bold uppercase mb-1">Fats (g)</label>
                  <input 
                    type="number" name="fats_g" 
                    value={mealForm.fats_g} onChange={handleInputChange}
                    className="w-full bg-surface border-thin border-on-surface p-2 font-body-md focus:border-thick outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t-thin border-outline mt-4">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-surface-variant border-thick border-on-surface font-label-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={submitting}
                  className="px-4 py-2 bg-primary text-on-primary border-thick border-on-surface font-label-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer flex items-center gap-2"
                >
                  {submitting ? 'Analyzing...' : 'Log & Analyze'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
