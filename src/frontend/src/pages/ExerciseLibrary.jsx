import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';

export default function ExerciseLibrary() {
  const { token } = useContext(AuthContext);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch from /api/fitness/exercises/ when endpoint is ready
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-stack-md">
            <span className="material-symbols-outlined text-primary animate-spin">progress_activity</span>
            <p className="font-headline-md text-headline-md uppercase">Loading The Vault...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-margin-mobile bg-background h-full overflow-y-auto">
      {/* Hero Section */}
      <section className="mb-stack-lg">
        <div className="bg-primary-container p-stack-lg border-thick border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-center gap-stack-lg">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface-variant uppercase mb-stack-sm">THE VAULT</h1>
            <p className="font-body-lg text-body-lg max-w-xl text-on-surface">Your definitive database of movement engineering. Browse AI-analyzed exercises to optimize your mechanical tension and muscle hypertrophy.</p>
          </div>
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-secondary border-thick border-on-surface flex items-center justify-center rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="material-symbols-outlined text-on-secondary text-5xl">terminal</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="mb-stack-lg">
        <div className="flex flex-wrap gap-stack-md items-center">
          <span className="font-label-bold text-label-bold uppercase text-on-surface-variant">Filter by Equipment:</span>
          {['Dumbbells', 'Bodyweight', 'Barbell', 'Kettlebell'].map((eq) => (
            <button key={eq} className="font-label-bold text-label-bold px-stack-md py-stack-sm border-thin border-on-surface bg-surface-container-lowest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-primary-container transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
              {eq}
            </button>
          ))}
        </div>
      </section>

      {/* Exercise Grid - Empty State */}
      {exercises.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center max-w-lg">
            <div className="w-20 h-20 border-thick border-on-surface bg-surface-container flex items-center justify-center mx-auto mb-stack-md">
              <span className="material-symbols-outlined text-outline" style={{ fontSize: '40px' }}>fitness_center</span>
            </div>
            <h3 className="font-headline-md text-headline-md uppercase mb-stack-sm">Exercise Database Empty</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">
              No exercises have been added to the vault yet. Add exercises via the backend admin panel or wait for the AI to populate recommendations based on your fitness profile.
            </p>
            <button className="bg-primary-container text-on-primary-container border-thick border-on-surface px-8 py-stack-md font-label-bold text-label-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase">
              Refresh Database
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-lg">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="group bg-surface-container-lowest border-thick border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col overflow-hidden">
              <div className="p-stack-md flex-grow">
                <h3 className="font-headline-md text-headline-md uppercase mb-stack-sm">{exercise.name}</h3>
                <div className="flex flex-wrap gap-stack-sm mb-stack-md">
                  {(exercise.muscle_groups || []).map((mg) => (
                    <span key={mg} className="font-label-bold text-label-sm border-thin border-on-surface px-2 py-0.5 bg-surface-container">{mg}</span>
                  ))}
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">{exercise.equipment}</p>
              </div>
              <div className="p-stack-md pt-0">
                <button className="w-full py-stack-sm border-thin border-on-surface font-label-bold text-label-bold uppercase bg-surface-variant hover:bg-primary-container transition-colors">
                  View Technique
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Section */}
      <footer className="mt-stack-lg pt-stack-lg border-t-thick border-on-surface flex flex-col md:flex-row justify-between items-center gap-stack-md">
        <span className="font-label-bold text-label-bold uppercase opacity-50">Iron AI / The Vault</span>
      </footer>
    </div>
  );
}
