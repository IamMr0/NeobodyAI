import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export default function AdminDashboard() {
  const { token, user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      try {
        const response = await fetch('http://localhost:8000/api/users/dashboard-stats/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          setError('Failed to load stats');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [token]);

  // Protect the route locally as well
  if (user && !user.is_staff) {
    return <Navigate to="/analysis" replace />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-stack-md">
            <span className="material-symbols-outlined text-primary animate-spin">progress_activity</span>
            <p className="font-headline-md text-headline-md uppercase">Loading Command Center...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-margin-mobile max-w-7xl mx-auto h-full overflow-y-auto">
        <div className="bg-error text-on-error border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-label-bold text-label-bold uppercase">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-margin-mobile max-w-7xl mx-auto space-y-stack-lg h-full overflow-y-auto">
      {/* Header */}
      <div className="bg-surface-container-lowest border-thick border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="bg-on-surface p-stack-md">
          <div className="flex items-center gap-stack-sm">
            <span className="material-symbols-outlined text-primary-container text-3xl">admin_panel_settings</span>
            <h2 className="font-headline-xl text-headline-xl text-surface uppercase tracking-tight">Admin Command Center</h2>
          </div>
        </div>
        <div className="p-stack-md bg-surface-container-high border-b-thick border-on-surface">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Monitor overall system health and user engagement metrics. Data is live.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg">
        {/* Total Users */}
        <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
          <div className="flex items-center justify-between mb-stack-md">
            <p className="font-label-bold text-label-bold text-on-surface-variant uppercase">Total Registered Users</p>
            <span className="material-symbols-outlined text-primary text-3xl">group</span>
          </div>
          <h2 className="font-display-sm text-display-sm text-on-surface">
            {stats?.total_users ?? '—'}
          </h2>
          <div className="mt-stack-sm h-2 w-full border-thin border-on-surface bg-surface-variant overflow-hidden">
             <div className="bg-primary h-full w-full"></div>
          </div>
        </div>

        {/* Upgraded Users */}
        <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all border-l-[8px] border-l-secondary">
          <div className="flex items-center justify-between mb-stack-md">
            <p className="font-label-bold text-label-bold text-on-surface-variant uppercase">Upgraded Users (PRO)</p>
            <span className="material-symbols-outlined text-secondary text-3xl">workspace_premium</span>
          </div>
          <h2 className="font-display-sm text-display-sm text-on-surface">
            {stats?.upgraded_users ?? '—'}
          </h2>
          <div className="mt-stack-sm h-2 w-full border-thin border-on-surface bg-surface-variant overflow-hidden">
             <div className="bg-secondary h-full" style={{ width: stats?.total_users ? `${(stats.upgraded_users / stats.total_users) * 100}%` : '0%' }}></div>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all border-l-[8px] border-l-success">
          <div className="flex items-center justify-between mb-stack-md">
            <p className="font-label-bold text-label-bold text-on-surface-variant uppercase">Active Users</p>
            <span className="material-symbols-outlined text-success text-3xl">bolt</span>
          </div>
          <h2 className="font-display-sm text-display-sm text-on-surface">
            {stats?.active_users ?? '—'}
          </h2>
          <div className="mt-stack-sm h-2 w-full border-thin border-on-surface bg-surface-variant overflow-hidden">
             <div className="bg-success h-full" style={{ width: stats?.total_users ? `${(stats.active_users / stats.total_users) * 100}%` : '0%' }}></div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="font-headline-sm text-headline-sm uppercase mb-stack-md border-b-thin border-outline-variant pb-2">Quick Actions</h3>
        <div className="flex flex-wrap gap-stack-sm">
          <button className="flex items-center gap-2 bg-surface text-on-surface border-thick border-on-surface px-6 py-3 font-label-bold text-label-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase">
            <span className="material-symbols-outlined">manage_accounts</span> Manage Users
          </button>
          <button className="flex items-center gap-2 bg-surface text-on-surface border-thick border-on-surface px-6 py-3 font-label-bold text-label-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase">
            <span className="material-symbols-outlined">campaign</span> Send Announcement
          </button>
          <button className="flex items-center gap-2 bg-surface text-on-surface border-thick border-on-surface px-6 py-3 font-label-bold text-label-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase">
            <span className="material-symbols-outlined">analytics</span> Deep Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
