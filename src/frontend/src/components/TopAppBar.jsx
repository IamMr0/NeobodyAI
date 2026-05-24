export default function TopAppBar({ title }) {
  return (
    <header className="flex justify-between items-center h-16 md:h-20 px-margin-mobile w-full sticky top-0 z-30 bg-surface border-b-thick border-on-surface shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center gap-stack-md">
        <span className="block font-headline-md text-headline-sm md:text-headline-md font-black text-on-surface uppercase truncate max-w-[200px] sm:max-w-none">
          {title}
        </span>
      </div>
      <div className="flex items-center gap-stack-md">
        <button className="hidden lg:block bg-secondary text-on-secondary border-thick border-on-surface px-6 py-2 font-label-bold text-label-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all">
          Upgrade Pro
        </button>
        <div className="flex items-center gap-stack-sm">
          <span className="material-symbols-outlined p-2 text-on-surface-variant cursor-pointer hover:bg-surface-container-high transition-all" data-icon="notifications">notifications</span>
          <span className="material-symbols-outlined p-2 text-on-surface-variant cursor-pointer hover:bg-surface-container-high transition-all" data-icon="account_circle">account_circle</span>
        </div>
      </div>
    </header>
  );
}
