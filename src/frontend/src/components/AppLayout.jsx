import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import NavBar from './NavBar';
import TopAppBar from './TopAppBar';
import BottomNavBar from './BottomNavBar';

export default function AppLayout() {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  
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

  // Strict route redirection based on role
  if (user?.is_staff) {
    if (!location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin" replace />;
    }
    
    // Minimal Admin Layout (no sidebar menu, no bottom nav bar)
    return (
      <div className="flex h-screen bg-surface-bright text-on-background overflow-hidden flex-col">
        <header className="bg-surface border-b-thick border-on-surface p-4 flex justify-between items-center shadow-[0_2px_0_0_rgba(0,0,0,1)]">
          <h1 className="font-headline-md text-headline-md text-on-surface italic uppercase tracking-tighter">IRON AI ADMIN PORTAL</h1>
          <div className="flex items-center gap-4">
            <span className="font-body-md text-body-md text-on-surface-variant font-semibold">Welcome, {user.username} (Staff)</span>
            <button 
              onClick={logout}
              className="bg-error text-on-error border-thin border-on-surface px-4 py-1.5 font-label-bold text-label-sm uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer hover:bg-error-container hover:text-on-error-container transition-colors"
            >
              Log Out
            </button>
          </div>
        </header>
        <div className="flex-grow overflow-hidden relative">
          <Outlet />
        </div>
      </div>
    );
  }

  // Redirect standard user away from admin views
  if (user && !user.is_staff && location.pathname.startsWith('/admin')) {
    return <Navigate to="/analysis" replace />;
  }

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
