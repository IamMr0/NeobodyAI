import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';

export default function ExerciseLibrary() {
  const { token } = useContext(AuthContext);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter and pagination states
  const [filters, setFilters] = useState({ categories: [], bodyParts: [], equipments: [] });
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // Active technique modal state
  const [activeExercise, setActiveExercise] = useState(null);

  // Load dropdown filters once on mount
  useEffect(() => {
    const fetchFilters = async () => {
      if (!token) return;
      try {
        const response = await fetch('http://localhost:8000/api/fitness/exercises/filters/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setFilters(data);
        }
      } catch (err) {
        console.error('Failed to fetch exercise filters:', err);
      }
    };
    fetchFilters();
  }, [token]);

  // Load exercises list when page, search, or filters change
  useEffect(() => {
    const fetchExercises = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: page,
          search: search,
          category: selectedCategory,
          body_part: selectedBodyPart,
          equipment: selectedEquipment
        });

        const response = await fetch(`http://localhost:8000/api/fitness/exercises/?${queryParams.toString()}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setExercises(data.results || []);
          setTotalCount(data.count || 0);
          setHasNext(!!data.next);
          setHasPrevious(!!data.previous);
          setTotalPages(Math.ceil((data.count || 0) / 20));
        }
      } catch (err) {
        console.error('Failed to fetch exercises:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [token, page, search, selectedCategory, selectedBodyPart, selectedEquipment]);

  const handleSearchApply = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearch('');
    setSelectedCategory('');
    setSelectedBodyPart('');
    setSelectedEquipment('');
    setPage(1);
  };

  if (loading && exercises.length === 0) {
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
      <section className="mb-stack-lg bg-surface border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-stack-md items-end">
          {/* Search bar */}
          <div className="md:col-span-4 flex gap-stack-sm mb-stack-sm">
            <div className="flex-grow relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                type="text" 
                placeholder="Search movements (e.g. Squat, Chest)..." 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchApply()}
                className="w-full bg-surface-container-lowest border-thin border-on-surface pl-10 pr-4 py-2.5 font-body-md focus:border-thick focus:bg-primary-container/10 outline-none"
              />
            </div>
            <button 
              onClick={handleSearchApply}
              className="bg-primary text-on-primary border-thin border-on-surface px-6 py-2.5 font-label-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer hover:bg-primary/90"
            >
              Search
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block font-label-bold text-label-sm uppercase mb-1 text-on-surface-variant">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
              className="w-full bg-surface-container-lowest border-thin border-on-surface p-2.5 font-body-md focus:border-thick outline-none"
            >
              <option value="">All Categories</option>
              {(filters.categories || []).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Body Part Filter */}
          <div>
            <label className="block font-label-bold text-label-sm uppercase mb-1 text-on-surface-variant">Body Part</label>
            <select
              value={selectedBodyPart}
              onChange={(e) => { setSelectedBodyPart(e.target.value); setPage(1); }}
              className="w-full bg-surface-container-lowest border-thin border-on-surface p-2.5 font-body-md focus:border-thick outline-none"
            >
              <option value="">All Body Parts</option>
              {(filters.body_parts || filters.bodyParts || []).map((bp) => (
                <option key={bp} value={bp}>{bp}</option>
              ))}
            </select>
          </div>

          {/* Equipment Filter */}
          <div>
            <label className="block font-label-bold text-label-sm uppercase mb-1 text-on-surface-variant">Equipment</label>
            <select
              value={selectedEquipment}
              onChange={(e) => { setSelectedEquipment(e.target.value); setPage(1); }}
              className="w-full bg-surface-container-lowest border-thin border-on-surface p-2.5 font-body-md focus:border-thick outline-none"
            >
              <option value="">All Equipment</option>
              {(filters.equipments || filters.equipment || []).map((eq) => (
                <option key={eq} value={eq}>{eq}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          <div>
            <button 
              onClick={handleClearFilters}
              className="w-full bg-surface-variant text-on-surface border-thin border-on-surface p-2.5 font-label-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2 hover:bg-surface-container-high"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Loading list overlay (when changing pages) */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="material-symbols-outlined text-primary animate-spin text-4xl">progress_activity</span>
        </div>
      ) : exercises.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center max-w-lg">
            <div className="w-20 h-20 border-thick border-on-surface bg-surface-container flex items-center justify-center mx-auto mb-stack-md">
              <span className="material-symbols-outlined text-outline" style={{ fontSize: '40px' }}>fitness_center</span>
            </div>
            <h3 className="font-headline-md text-headline-md uppercase mb-stack-sm">No Exercises Found</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">
              We couldn't find any exercises matching your filter criteria. Try resetting the filters or typing a different search query.
            </p>
            <button onClick={handleClearFilters} className="bg-primary-container text-on-primary-container border-thick border-on-surface px-8 py-stack-md font-label-bold text-label-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase">
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-lg">
            {exercises.map((exercise) => (
              <div key={exercise.id} className="group bg-surface-container-lowest border-thick border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col overflow-hidden">
                <div className="p-stack-md flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline-md text-headline-md uppercase mb-stack-sm leading-tight line-clamp-2 min-h-[3rem]">{exercise.name}</h3>
                    <div className="flex flex-wrap gap-stack-sm mb-stack-md">
                      {exercise.category && (
                        <span className="font-label-bold text-label-sm border-thin border-on-surface px-2 py-0.5 bg-primary-container text-on-primary-container">{exercise.category}</span>
                      )}
                      {exercise.body_part && (
                        <span className="font-label-bold text-label-sm border-thin border-on-surface px-2 py-0.5 bg-surface-container text-on-surface">{exercise.body_part}</span>
                      )}
                      {exercise.target && (
                        <span className="font-label-bold text-label-sm border-thin border-on-surface px-2 py-0.5 bg-tertiary-container text-on-tertiary-container">{exercise.target}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm mt-2">
                    <span className="material-symbols-outlined text-[18px]">build</span>
                    <span>Equipment: <span className="font-bold text-on-surface">{exercise.equipment}</span></span>
                  </div>
                </div>
                <div className="p-stack-md pt-0">
                  <button 
                    onClick={() => setActiveExercise(exercise)}
                    className="w-full py-stack-sm border-thin border-on-surface font-label-bold text-label-bold uppercase bg-surface-variant hover:bg-primary transition-colors cursor-pointer group-hover:bg-primary-container"
                  >
                    View Technique
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          <section className="mt-stack-lg flex justify-between items-center bg-surface border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <button 
              disabled={!hasPrevious}
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              className={`font-label-bold text-label-bold px-stack-lg py-stack-md border-thin border-on-surface uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
                hasPrevious 
                  ? 'bg-surface-container-lowest hover:bg-primary-container active:translate-x-[2px] active:translate-y-[2px] active:shadow-none' 
                  : 'opacity-40 cursor-not-allowed bg-surface-container'
              }`}
            >
              Previous
            </button>
            <span className="font-label-bold text-label-sm sm:text-label-bold uppercase text-center">
              Page {page} of {totalPages || 1} ({totalCount} total)
            </span>
            <button 
              disabled={!hasNext}
              onClick={() => setPage(prev => prev + 1)}
              className={`font-label-bold text-label-bold px-stack-lg py-stack-md border-thin border-on-surface uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
                hasNext 
                  ? 'bg-surface-container-lowest hover:bg-primary-container active:translate-x-[2px] active:translate-y-[2px] active:shadow-none' 
                  : 'opacity-40 cursor-not-allowed bg-surface-container'
              }`}
            >
              Next
            </button>
          </section>
        </>
      )}

      {/* Technique Modal popup */}
      {activeExercise && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border-thick border-on-surface shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-on-surface text-surface p-4 flex justify-between items-center">
              <h3 className="font-headline-sm uppercase text-primary-fixed">{activeExercise.name}</h3>
              <button 
                onClick={() => setActiveExercise(null)} 
                className="text-surface hover:text-primary transition-colors cursor-pointer flex items-center justify-center p-1"
              >
                <span className="material-symbols-outlined text-[28px]">close</span>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-stack-lg space-y-stack-md overflow-y-auto flex-1">
              {/* Badges row */}
              <div className="flex flex-wrap gap-stack-sm pb-stack-sm border-b border-on-surface/10">
                <div className="px-3 py-1 border-thin border-on-surface bg-primary-container text-on-primary-container font-label-bold uppercase text-label-sm">
                  Category: {activeExercise.category}
                </div>
                <div className="px-3 py-1 border-thin border-on-surface bg-surface-container text-on-surface font-label-bold uppercase text-label-sm">
                  Body Part: {activeExercise.body_part}
                </div>
                <div className="px-3 py-1 border-thin border-on-surface bg-tertiary-container text-on-tertiary-container font-label-bold uppercase text-label-sm">
                  Target: {activeExercise.target}
                </div>
                <div className="px-3 py-1 border-thin border-on-surface bg-secondary text-on-secondary font-label-bold uppercase text-label-sm">
                  Equipment: {activeExercise.equipment}
                </div>
              </div>

              {/* Description Section */}
              <div>
                <h4 className="font-label-bold text-label-bold uppercase text-on-surface-variant mb-1">Description</h4>
                <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                  {activeExercise.instructions || "No custom biomechanical description provided."}
                </p>
              </div>

              {/* Instructions steps */}
              {activeExercise.instruction_steps && activeExercise.instruction_steps.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-label-bold text-label-bold uppercase text-on-surface-variant mb-stack-sm">Step-by-Step Execution</h4>
                  <ol className="space-y-stack-sm">
                    {activeExercise.instruction_steps.map((step, index) => (
                      <li key={index} className="flex gap-4 items-start p-3 border-thin border-on-surface bg-surface-container-low">
                        <span className="w-6 h-6 rounded-none bg-secondary text-on-secondary flex items-center justify-center font-label-bold text-label-bold text-sm flex-shrink-0">
                          {index + 1}
                        </span>
                        <p className="font-body-md text-body-md text-on-surface">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              
              {/* Muscles Targeted */}
              <div className="grid grid-cols-2 gap-stack-md mt-4 pt-stack-sm border-t border-on-surface/10">
                <div>
                  <h4 className="font-label-bold text-label-bold uppercase text-on-surface-variant mb-1">Primary Muscle</h4>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">{activeExercise.muscle_group || "General"}</p>
                </div>
                {activeExercise.secondary_muscles && activeExercise.secondary_muscles.length > 0 && (
                  <div>
                    <h4 className="font-label-bold text-label-bold uppercase text-on-surface-variant mb-1">Secondary Muscles</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      {activeExercise.secondary_muscles.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-stack-md bg-surface-container border-t-thick border-on-surface flex justify-end">
              <button 
                onClick={() => setActiveExercise(null)}
                className="px-6 py-2 bg-on-surface text-surface font-label-bold uppercase cursor-pointer shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:bg-on-surface/90 active:translate-x-[2px] active:translate-y-[2px]"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <footer className="mt-stack-lg pt-stack-lg border-t-thick border-on-surface flex flex-col md:flex-row justify-between items-center gap-stack-md">
        <span className="font-label-bold text-label-bold uppercase opacity-50">Iron AI / The Vault</span>
      </footer>
    </div>
  );
}
