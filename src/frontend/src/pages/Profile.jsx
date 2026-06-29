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

  const exportProgressReport = async () => {
    if (!token) return;
    try {
      // Fetch latest metrics and trends for accurate document content
      const [metricsRes, trendsRes] = await Promise.all([
        fetch('http://localhost:8000/api/fitness/body-metrics/', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:8000/api/fitness/trends/', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      const metricsData = metricsRes.ok ? await metricsRes.json() : null;
      const trendsData = trendsRes.ok ? await trendsRes.json() : null;

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups to export your progress report.');
        return;
      }
      
      const title = `IRON_AI_Progress_Report_${profile?.username}`;
      const dateString = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      
      let historyRows = '';
      if (trendsData?.historical_data) {
        historyRows = trendsData.historical_data.map(h => `
          <tr style="border-bottom: 1px solid #ccc;">
            <td style="padding: 8px;">${h.date}</td>
            <td style="padding: 8px;">${h.weight} kg</td>
            <td style="padding: 8px;">${h.body_fat ?? '—'}%</td>
            <td style="padding: 8px;">${h.muscle_mass ?? '—'} kg</td>
          </tr>
        `).join('');
      }

      const htmlContent = `
        <html>
          <head>
            <title>${title}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                color: #000;
                background: #fff;
                padding: 40px;
                line-height: 1.6;
              }
              .header {
                border-bottom: 4px solid #000;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .header h1 {
                margin: 0;
                font-size: 32px;
                text-transform: uppercase;
                font-weight: 900;
              }
              .section-title {
                border-bottom: 2px solid #000;
                text-transform: uppercase;
                font-size: 18px;
                margin-top: 30px;
                padding-bottom: 5px;
                font-weight: bold;
              }
              .grid {
                display: grid;
                grid-template-cols: 1fr 1fr;
                gap: 20px;
                margin-top: 15px;
              }
              .card {
                border: 2px solid #000;
                padding: 15px;
                background: #f9f9f9;
              }
              .value {
                font-size: 24px;
                font-weight: bold;
                margin-top: 5px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
              }
              th {
                text-align: left;
                background: #000;
                color: #fff;
                padding: 8px;
                text-transform: uppercase;
                font-size: 12px;
              }
              td {
                padding: 8px;
                font-size: 14px;
              }
              .footer {
                margin-top: 50px;
                border-top: 1px solid #ccc;
                font-size: 12px;
                text-align: center;
                color: #666;
                padding-top: 15px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>IRON AI Fitness Progress Report</h1>
              <p>User: <strong>${profile?.username}</strong> | Generated: ${dateString}</p>
            </div>
            
            <div class="section-title">Current Physiological Status</div>
            <div class="grid">
              <div class="card">
                <div>Weight</div>
                <div class="value">${metricsData?.weight_kg ?? '—'} kg</div>
              </div>
              <div class="card">
                <div>Muscle Mass</div>
                <div class="value">${metricsData?.muscle_mass_kg ?? '—'} kg</div>
              </div>
              <div class="card">
                <div>Basal Metabolic Rate (BMR)</div>
                <div class="value">${trendsData?.physiological_stats?.bmr ?? '—'} kcal</div>
              </div>
              <div class="card">
                <div>Fat-Free Mass Index (FFMI)</div>
                <div class="value">${trendsData?.physiological_stats?.ffmi ?? '—'} (${trendsData?.physiological_stats?.ffmi_class ?? '—'})</div>
              </div>
            </div>

            ${trendsData?.projection ? `
              <div class="section-title">30-Day Progress Forecasting</div>
              <div class="card" style="margin-top: 15px; border-left: 6px solid #000;">
                <p style="margin: 0; font-size: 16px;">
                  Based on ordinary least squares (OLS) linear regression analysis, your body weight is projected to reach <strong>${trendsData.projection.weight_in_30_days} kg</strong> (representing a <strong>${trendsData.projection.weight_change >= 0 ? `+${trendsData.projection.weight_change}` : trendsData.projection.weight_change} kg</strong> trend) in 30 days.
                </p>
              </div>
            ` : ''}

            <div class="section-title">Historical Log Progress</div>
            <table>
              <thead>
                <tr>
                  <th>Date Recorded</th>
                  <th>Weight</th>
                  <th>Body Fat</th>
                  <th>Muscle Mass</th>
                </tr>
              </thead>
              <tbody>
                ${historyRows || '<tr><td colspan="4" style="text-align: center; padding: 15px;">No historical logs recorded.</td></tr>'}
              </tbody>
            </table>

            <div class="section-title">Metabolic Insight & Biomechanics Feedback</div>
            <div class="card" style="margin-top: 15px; white-space: pre-wrap; font-size: 14px; background: #fff;">
              ${metricsData?.metabolic_insight || 'No metabolic or physique scan assessments logged yet.'}
            </div>

            <div class="footer">
              IRON AI gym platform. Core analysis engines compiled with Groq & Llama 4 Vision inference.
            </div>
            
            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
        </html>
      `;
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } catch (err) {
      alert('Error exporting PDF progress report: ' + err.message);
    }
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

      {/* Report Exporter Card */}
      <div className="bg-surface-container-lowest border-thick border-on-surface p-stack-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-l-[8px] border-l-primary">
        <div className="flex items-center gap-stack-sm mb-stack-md">
          <span className="material-symbols-outlined text-primary">download</span>
          <p className="font-label-bold text-label-bold text-primary uppercase">Analytics & Progress Exporter</p>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mb-stack-md">
          Export your complete fitness profile, parsed posture scans, linear regression weight predictions, and historical metrics into a clean, print-friendly PDF report to track improvement over time.
        </p>
        <button
          onClick={exportProgressReport}
          className="bg-primary text-on-primary border-thick border-on-surface px-8 py-stack-md font-label-bold text-label-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-wider flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined">picture_as_pdf</span> Export Progress PDF
        </button>
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
