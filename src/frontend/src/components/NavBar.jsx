import { NavLink } from 'react-router-dom';

export default function NavBar() {
  const getNavClass = ({ isActive }) => {
    const baseClass = "flex items-center gap-stack-sm p-stack-sm font-label-bold text-label-bold transition-all ";
    if (isActive) {
      return baseClass + "bg-primary-container text-on-primary-container border-thin border-on-surface shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]";
    } else {
      return baseClass + "text-on-surface hover:bg-surface-container-high hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
    }
  };

  return (
    <nav className="hidden md:flex fixed left-0 top-0 h-full flex-col p-margin-mobile z-40 w-64 border-r-thick border-on-surface bg-surface shadow-[4px_0px_0px_0px_rgba(0,0,0,1)]">
      <div className="mb-stack-lg">
        <h1 className="font-headline-lg text-headline-lg text-on-surface italic uppercase tracking-tighter">IRON AI</h1>
        <p className="font-label-bold text-label-bold text-on-surface-variant opacity-70">AI Gym Assistant</p>
      </div>

      <div className="flex flex-col gap-stack-sm flex-grow">
        <NavLink to="/analysis" className={getNavClass}>
          <span className="material-symbols-outlined">monitoring</span> Analysis
        </NavLink>
        <NavLink to="/nutrition" className={getNavClass}>
          <span className="material-symbols-outlined">restaurant</span> Nutrition
        </NavLink>
        <NavLink to="/library" className={getNavClass}>
          <span className="material-symbols-outlined">fitness_center</span> Library
        </NavLink>
        <NavLink to="/builder" className={getNavClass}>
          <span className="material-symbols-outlined">format_list_bulleted</span> Builder
        </NavLink>
        <NavLink to="/chat" className={getNavClass}>
          <span className="material-symbols-outlined">smart_toy</span> AI Chat
        </NavLink>
      </div>

      <button className="mt-auto mb-stack-md bg-secondary text-on-secondary font-label-bold text-label-bold border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
        Start Workout
      </button>

      <div className="flex flex-col gap-stack-sm border-t-thin border-outline-variant pt-stack-md">
        <button className="flex items-center gap-stack-sm p-stack-sm font-label-bold text-label-bold text-on-surface-variant hover:bg-surface-container-high transition-all text-left">
          <span className="material-symbols-outlined">settings</span> Settings
        </button>
        <button className="flex items-center gap-stack-sm p-stack-sm font-label-bold text-label-bold text-on-surface-variant hover:bg-surface-container-high transition-all text-left">
          <span className="material-symbols-outlined">help</span> Help
        </button>
      </div>
    </nav>
  );
}
