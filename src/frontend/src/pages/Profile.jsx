import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export default function Profile() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/users/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-stack-md">
            <span className="material-symbols-outlined text-primary animate-spin">progress_activity</span>
            <p className="font-headline-md text-headline-md uppercase">Loading Profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-error-container border-thick border-on-surface p-stack-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-stack-md mb-stack-md">
            <span className="material-symbols-outlined text-error text-3xl">error</span>
            <p className="font-headline-md text-headline-md text-on-error-container uppercase">Connection Failed</p>
          </div>
          <p className="font-body-md text-body-md text-on-error-container">{error}</p>
        </div>
      </div>
    );
  }

  const joinDate = profile?.date_joined
    ? new Date(profile.date_joined).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  return (
    <div className="p-margin-mobile max-w-4xl mx-auto space-y-stack-lg h-full overflow-y-auto">
      {/* Profile Header */}
      <div className="bg-surface-container-lowest border-thick border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        {/* Banner */}
        <div className="h-28 md:h-36 bg-on-surface relative">
          <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary"></div>
        </div>

        {/* Avatar + Info */}
        <div className="px-stack-lg pb-stack-lg relative">
          {/* Avatar */}
          <div className="w-24 h-24 md:w-28 md:h-28 border-thick border-on-surface bg-primary-container shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center -mt-12 md:-mt-14">
            <span className="material-symbols-outlined text-on-primary-container" style={{ fontSize: '56px' }}>person</span>
          </div>

          <div className="mt-stack-md">
            <h2 className="font-headline-xl text-headline-xl text-on-surface uppercase tracking-tight">
              {profile?.username || '—'}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              {profile?.email || 'No email set'}
            </p>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
        {/* Account Info */}
        <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-stack-sm mb-stack-md">
            <span className="material-symbols-outlined text-primary">badge</span>
            <p className="font-label-bold text-label-bold text-on-surface-variant uppercase">Account Details</p>
          </div>
          <div className="space-y-stack-md">
            <div className="border-b border-outline-variant pb-stack-sm">
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Username</p>
              <p className="font-body-md text-body-md text-on-surface font-semibold">{profile?.username || '—'}</p>
            </div>
            <div className="border-b border-outline-variant pb-stack-sm">
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Email</p>
              <p className="font-body-md text-body-md text-on-surface font-semibold">{profile?.email || '—'}</p>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">User ID</p>
              <p className="font-body-md text-body-md text-on-surface font-mono">{profile?.id || '—'}</p>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-stack-sm mb-stack-md">
            <span className="material-symbols-outlined text-tertiary">verified</span>
            <p className="font-label-bold text-label-bold text-on-surface-variant uppercase">Status</p>
          </div>
          <div className="space-y-stack-md">
            <div className="border-b border-outline-variant pb-stack-sm">
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Account Status</p>
              <span className="inline-block px-3 py-1 bg-tertiary-container text-on-tertiary-container border-thin border-on-surface font-label-bold text-label-bold">
                ACTIVE
              </span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Member Since</p>
              <p className="font-body-md text-body-md text-on-surface font-semibold">{joinDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-l-[8px] border-l-error">
        <div className="flex items-center gap-stack-sm mb-stack-md">
          <span className="material-symbols-outlined text-error">logout</span>
          <p className="font-label-bold text-label-bold text-error uppercase">Session Control</p>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mb-stack-md">
          End your current session. You will be redirected to the login screen.
        </p>
        <button
          onClick={handleLogout}
          className="bg-error text-on-error border-thick border-on-surface px-8 py-stack-md font-label-bold text-label-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-wider"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
