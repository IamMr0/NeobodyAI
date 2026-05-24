import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import TopAppBar from './TopAppBar';

export default function AppLayout() {
  const location = useLocation();
  
  // Mapping paths to titles
  const getTitle = () => {
    switch (location.pathname) {
      case '/analysis': return 'AI Body Analysis';
      case '/nutrition': return 'Fuel Up / Nutrition';
      case '/library': return 'Smart Exercise Library';
      case '/builder': return 'Custom Workout Builder';
      case '/chatbot': return 'AI Chatbot Assistant';
      default: return 'IRON AI Command Center';
    }
  };

  return (
    <div className="flex h-screen bg-surface-bright text-on-background overflow-hidden">
      <NavBar />
      <main className="ml-64 flex-1 flex flex-col h-screen overflow-hidden">
        <TopAppBar title={getTitle()} />
        <div className="flex-1 overflow-hidden relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
