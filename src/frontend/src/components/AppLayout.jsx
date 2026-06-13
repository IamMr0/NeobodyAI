import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import TopAppBar from './TopAppBar';
import BottomNavBar from './BottomNavBar';

export default function AppLayout() {
  const location = useLocation();
  
  // Mapping paths to titles
  const getTitle = () => {
    switch (location.pathname) {
      case '/analysis': return 'AI Body Analysis';
      case '/nutrition': return 'Fuel Up / Nutrition';
      case '/library': return 'Smart Exercise Library';
      case '/builder': return 'Custom Workout Builder';
      case '/chat': return 'AI Chatbot Assistant';
      case '/profile': return 'My Profile';
      case '/admin': return 'Admin Dashboard';
      default: return 'IRON AI Command Center';
    }
  };

  return (
    <div className="flex h-screen bg-surface-bright text-on-background overflow-hidden flex-col md:flex-row">
      <NavBar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden pb-16 md:pb-0 md:ml-64">
        <TopAppBar title={getTitle()} />
        <div className="flex-1 overflow-hidden relative">
          <Outlet />
        </div>
      </main>
      <BottomNavBar />
    </div>
  );
}
