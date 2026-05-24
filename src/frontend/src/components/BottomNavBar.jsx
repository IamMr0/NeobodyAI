import { NavLink } from 'react-router-dom';

export default function BottomNavBar() {
  const getNavClass = ({ isActive }) => {
    const baseClass = "flex flex-col items-center justify-center p-2 w-full h-full transition-colors ";
    if (isActive) {
      return baseClass + "text-on-surface border-t-[4px] border-on-surface bg-primary-container";
    } else {
      return baseClass + "text-on-surface-variant border-t-[4px] border-transparent hover:bg-surface-container-high";
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface border-t-thick border-on-surface flex justify-around h-16 z-50">
      <NavLink to="/analysis" className={getNavClass}>
        <span className="material-symbols-outlined" data-icon="monitoring">monitoring</span>
        <span className="text-[10px] font-label-bold uppercase mt-1">Stats</span>
      </NavLink>
      
      <NavLink to="/nutrition" className={getNavClass}>
        <span className="material-symbols-outlined" data-icon="restaurant">restaurant</span>
        <span className="text-[10px] font-label-bold uppercase mt-1">Fuel</span>
      </NavLink>

      <NavLink to="/builder" className={getNavClass}>
        <span className="material-symbols-outlined" data-icon="format_list_bulleted">format_list_bulleted</span>
        <span className="text-[10px] font-label-bold uppercase mt-1">Build</span>
      </NavLink>

      <NavLink to="/library" className={getNavClass}>
        <span className="material-symbols-outlined" data-icon="fitness_center">fitness_center</span>
        <span className="text-[10px] font-label-bold uppercase mt-1">Lib</span>
      </NavLink>

      <NavLink to="/chat" className={getNavClass}>
        <span className="material-symbols-outlined" data-icon="smart_toy">smart_toy</span>
        <span className="text-[10px] font-label-bold uppercase mt-1">AI</span>
      </NavLink>
    </nav>
  );
}
