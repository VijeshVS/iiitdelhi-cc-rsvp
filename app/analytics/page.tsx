'use client';

import { useState, useEffect } from 'react';
import { getAnalytics, type AnalyticsData, type TeamAnalytics } from '@/app/actions/analytics';
import { checkAdminSession, logoutAdmin } from '@/app/actions/adminAuth';
import { verifyAdminCredentials } from '@/app/actions/adminAuth';
import Link from 'next/link';

/* ── Stat Card ── */
function StatCard({ label, value, sub, color, icon }: {
  label: string; value: string | number; sub?: string;
  color: 'gold' | 'green' | 'red' | 'blue' | 'white'; icon: string;
}) {
  const styles: Record<string, { border: string; text: string; glow: string; bg: string }> = {
    gold:  { border: 'border-accent-gold/40', text: 'text-accent-gold', glow: 'shadow-[0_0_20px_rgba(249,221,156,0.15)]', bg: 'bg-gradient-to-br from-[#2b2200] to-[#1a1500]' },
    green: { border: 'border-emerald-400/40', text: 'text-emerald-400', glow: 'shadow-[0_0_20px_rgba(52,211,153,0.12)]', bg: 'bg-gradient-to-br from-[#0a2618] to-[#061a10]' },
    red:   { border: 'border-rose-400/40',    text: 'text-rose-400',    glow: 'shadow-[0_0_20px_rgba(251,113,133,0.12)]', bg: 'bg-gradient-to-br from-[#2a0f18] to-[#1a0810]' },
    blue:  { border: 'border-sky-400/40',     text: 'text-sky-400',     glow: 'shadow-[0_0_20px_rgba(56,189,248,0.12)]', bg: 'bg-gradient-to-br from-[#0a1a2e] to-[#06101a]' },
    white: { border: 'border-gray-500/40',    text: 'text-white',       glow: 'shadow-[0_0_20px_rgba(255,255,255,0.06)]', bg: 'bg-gradient-to-br from-[#1f1f2b] to-[#141420]' },
  };
  const s = styles[color];
  return (
    <div className={`relative border rounded-2xl p-5 ${s.border} ${s.bg} ${s.glow} transition-all hover:scale-[1.02]`}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-gray-400 text-[11px] uppercase tracking-widest font-semibold">{label}</p>
        <span className="text-xl opacity-70">{icon}</span>
      </div>
      <p className={`text-4xl font-extrabold ${s.text} tracking-tight`}>{value}</p>
      {sub && <p className="text-gray-500 text-xs mt-2">{sub}</p>}
    </div>
  );
}

/* ── Progress Bar ── */
function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="w-full bg-[#1a1a22] rounded-full h-2.5 overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ease-out ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ── Team Row ── */
function TeamRow({ team }: { team: TeamAnalytics }) {
  const [expanded, setExpanded] = useState(false);
  const pct = team.totalMembers > 0 ? Math.round((team.enteredCount / team.totalMembers) * 100) : 0;

  let statusColor: string, statusBg: string, statusBorder: string, statusLabel: string;
  if (team.enteredCount === team.totalMembers) {
    statusColor = 'text-emerald-300'; statusBg = 'bg-emerald-500/15'; statusBorder = 'border-emerald-500/30'; statusLabel = 'All Entered';
  } else if (team.enteredCount > 0) {
    statusColor = 'text-amber-300'; statusBg = 'bg-amber-500/15'; statusBorder = 'border-amber-500/30'; statusLabel = 'Partial';
  } else {
    statusColor = 'text-gray-400'; statusBg = 'bg-gray-700/30'; statusBorder = 'border-gray-600/30'; statusLabel = 'Not Entered';
  }

  const barColor = team.enteredCount === team.totalMembers
    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
    : team.enteredCount > 0
      ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
      : 'bg-gray-700';

  return (
    <div
      className="border border-gray-800 rounded-2xl overflow-hidden transition-all hover:border-gray-600"
      style={{ background: 'linear-gradient(135deg, #1c1c28, #141420)' }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between gap-4 hover:bg-white/[0.03] transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <p className="text-white font-bold truncate">{team.teamName}</p>
            <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${statusColor} ${statusBg} ${statusBorder}`}>
              {statusLabel}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="text-gray-400">{team.college}</span>
            <span className="text-gray-700">•</span>
            <span>{team.leadName}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <p className="text-white font-bold text-lg">{team.enteredCount}<span className="text-gray-500 font-normal">/{team.totalMembers}</span></p>
            <p className="text-gray-500 text-xs">{pct}%</p>
          </div>
          <div className="w-24 hidden sm:block">
            <ProgressBar value={team.enteredCount} max={team.totalMembers} color={barColor} />
          </div>
          <span className={`text-gray-500 text-sm transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>▾</span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-800 p-4 space-y-2" style={{ background: 'rgba(0,0,0,0.25)' }}>
          {/* Lead */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(249,221,156,0.04)' }}>
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${team.leadEntered ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]' : 'bg-gray-600'}`} />
            <span className="text-white text-sm font-medium flex-1">{team.leadName}</span>
            <span className="text-accent-gold/60 text-[10px] font-bold uppercase tracking-wider">Lead</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${team.leadEntered ? 'text-emerald-300 bg-emerald-500/15 border border-emerald-500/20' : 'text-gray-400 bg-gray-800 border border-gray-700'}`}>
              {team.leadEntered ? '✅ Entered' : '⏳ Pending'}
            </span>
          </div>
          {/* Members */}
          {team.members.map((m, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${m.entered ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]' : 'bg-gray-600'}`} />
              <span className="text-white text-sm font-medium flex-1">{m.name}</span>
              <span className="text-gray-600 text-[10px] font-bold uppercase tracking-wider">Member {i + 1}</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${m.entered ? 'text-emerald-300 bg-emerald-500/15 border border-emerald-500/20' : 'text-gray-400 bg-gray-800 border border-gray-700'}`}>
                {m.entered ? '✅ Entered' : '⏳ Pending'}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-4 pt-2 text-[11px] text-gray-600">
            <span>Pass: <span className="text-gray-400 font-mono">{team.passId}</span></span>
            <span>•</span>
            <span>Year: <span className="text-gray-400">{team.year}</span></span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Data state
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'entered' | 'partial' | 'pending'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    checkAdminSession().then((result) => {
      if (result.success) {
        setIsAuthenticated(true);
      }
      setAuthChecking(false);
    });
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    const result = await getAnalytics();
    if (result.success && result.data) {
      setData(result.data);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch analytics when authenticated
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        const result = await getAnalytics();
        if (result.success && result.data) {
          setData(result.data);
        } else {
          setError(result.message);
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    const result = await verifyAdminCredentials(username, password);
    if (result.success) setIsAuthenticated(true);
    else setAuthError(result.message);
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
    setData(null);
  };

  const filteredTeams = data?.teams.filter((t) => {
    // Status filter
    if (filter === 'entered' && t.enteredCount !== t.totalMembers) return false;
    if (filter === 'pending' && t.enteredCount !== 0) return false;
    if (filter === 'partial' && (t.enteredCount === 0 || t.enteredCount === t.totalMembers)) return false;

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      return (
        t.teamName.toLowerCase().includes(q) ||
        t.leadName.toLowerCase().includes(q) ||
        t.passId.toLowerCase().includes(q) ||
        t.college.toLowerCase().includes(q)
      );
    }
    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-bg-dark py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Loading session */}
        {authChecking ? (
          <div className="flex items-center justify-center mt-32">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Checking session...</p>
            </div>
          </div>
        ) :

        /* Login Gate */
        !isAuthenticated ? (
          <div className="max-w-md mx-auto mt-16">
            <div className="text-center mb-8">
              <span className="inline-block bg-accent-gold text-bg-dark px-6 py-2 text-sm font-bold uppercase tracking-wider mb-4">
                Admin Access
              </span>
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-white">ENTRY </span>
                <span className="text-accent-gold">ANALYTICS</span>
              </h1>
              <p className="text-gray-400">Sign in to view analytics</p>
            </div>

            <div className="bg-surface-light border border-gray-700 rounded-lg p-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-accent-gold/10 flex items-center justify-center">
                  <span className="text-accent-gold text-3xl">🔒</span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter admin username"
                    className="w-full px-4 py-3 bg-surface-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-gold transition-colors"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter admin password"
                    className="w-full px-4 py-3 bg-surface-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-gold transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {authError && (
                  <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                    <p className="text-red-400 text-center">{authError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-accent-gold text-bg-dark py-4 rounded-lg font-bold text-lg hover:bg-accent-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                >
                  {authLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/" className="text-gray-400 hover:text-accent-gold text-sm inline-flex items-center gap-2">
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        ) : (
        <>
          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-block bg-accent-gold text-bg-dark px-6 py-2 text-sm font-bold uppercase tracking-wider mb-4">
              Analytics Dashboard
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">ENTRY </span>
              <span className="text-accent-gold">ANALYTICS</span>
            </h1>
            <p className="text-gray-400 mb-6">Real-time entry status for all registered teams</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-2">
              <Link
                href="/entry"
                className="border-2 border-accent-gold text-accent-gold px-8 py-3 rounded-lg font-bold hover:bg-accent-gold hover:text-bg-dark transition-all duration-300 text-center uppercase"
              >
                Entry Management
              </Link>
              <Link
                href="/"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-bg-dark transition-all duration-300 text-center uppercase"
              >
                Home
              </Link>
              <button
                onClick={handleLogout}
                className="border-2 border-red-500 text-red-400 px-8 py-3 rounded-lg font-bold hover:bg-red-500 hover:text-white transition-all duration-300 text-center uppercase"
              >
                Logout
              </button>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Loading analytics...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 max-w-2xl mx-auto mb-8">
              <p className="text-red-400 text-center">{error}</p>
            </div>
          )}

          {data && (
            <div className="space-y-8">

              {/* Overview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Teams" value={data.totalTeams} color="white" icon="👥" />
                <StatCard label="Total Candidates" value={data.totalCandidates} color="gold" icon="🎫" />
                <StatCard label="Entered" value={data.totalEntered} sub={`${data.entryPercentage}% of total`} color="green" icon="✅" />
                <StatCard label="Pending" value={data.totalPending} sub={`${100 - data.entryPercentage}% of total`} color="red" icon="⏳" />
              </div>

              {/* Entry Progress */}
              <div
                className="border border-gray-800 rounded-2xl p-6 shadow-[0_0_30px_rgba(249,221,156,0.06)]"
                style={{ background: 'linear-gradient(135deg, #1c1c28, #141420)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg">Overall Entry Progress</h3>
                  <span className="text-accent-gold font-extrabold text-3xl tracking-tight">{data.entryPercentage}%</span>
                </div>
                <div className="w-full bg-[#1a1a22] rounded-full h-5 overflow-hidden border border-gray-800">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.3)]"
                    style={{ width: `${data.entryPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between mt-3 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />{data.totalEntered} entered</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-600 inline-block" />{data.totalPending} pending</span>
                </div>
              </div>

              {/* Team Status Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className="border border-emerald-500/25 rounded-2xl p-5 shadow-[0_0_20px_rgba(52,211,153,0.08)]"
                  style={{ background: 'linear-gradient(135deg, #0a2618, #061a10)' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                    <p className="text-emerald-300/70 text-xs font-bold uppercase tracking-wider">Fully Entered</p>
                  </div>
                  <p className="text-emerald-300 text-4xl font-extrabold">{data.teamsFullyEntered}</p>
                  <p className="text-emerald-600/60 text-xs mt-2">teams with all members entered</p>
                </div>
                <div
                  className="border border-amber-500/25 rounded-2xl p-5 shadow-[0_0_20px_rgba(245,158,11,0.08)]"
                  style={{ background: 'linear-gradient(135deg, #261c0a, #1a1206)' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                    <p className="text-amber-300/70 text-xs font-bold uppercase tracking-wider">Partially Entered</p>
                  </div>
                  <p className="text-amber-300 text-4xl font-extrabold">{data.teamsPartiallyEntered}</p>
                  <p className="text-amber-600/60 text-xs mt-2">teams with some members entered</p>
                </div>
                <div
                  className="border border-gray-600/25 rounded-2xl p-5 shadow-[0_0_20px_rgba(255,255,255,0.03)]"
                  style={{ background: 'linear-gradient(135deg, #1c1c28, #141420)' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-3 h-3 rounded-full bg-gray-500" />
                    <p className="text-gray-400/70 text-xs font-bold uppercase tracking-wider">Not Entered</p>
                  </div>
                  <p className="text-gray-300 text-4xl font-extrabold">{data.teamsNotEntered}</p>
                  <p className="text-gray-600 text-xs mt-2">teams with no entries yet</p>
                </div>
              </div>

              {/* Team List */}
              <div>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
                  <h3 className="text-accent-gold font-bold text-lg uppercase tracking-wider flex items-center gap-2">
                    <span className="opacity-70">📋</span> All Teams <span className="text-gray-500 text-sm font-normal">({filteredTeams.length})</span>
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <input
                      type="text"
                      placeholder="Search teams, leads, colleges..."
                      className="px-4 py-2.5 bg-[#141420] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-accent-gold/50 focus:shadow-[0_0_12px_rgba(249,221,156,0.1)] transition-all text-sm flex-1 md:w-64"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="flex gap-2">
                      {(['all', 'entered', 'partial', 'pending'] as const).map((f) => (
                        <button
                          key={f}
                          onClick={() => setFilter(f)}
                          className={`px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                            filter === f
                              ? 'bg-accent-gold text-bg-dark shadow-[0_0_12px_rgba(249,221,156,0.25)]'
                              : 'border border-gray-800 text-gray-500 hover:border-accent-gold/40 hover:text-accent-gold/80'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredTeams.length === 0 ? (
                    <div
                      className="border border-gray-800 rounded-2xl p-10 text-center"
                      style={{ background: 'linear-gradient(135deg, #1c1c28, #141420)' }}
                    >
                      <p className="text-gray-600 text-lg">No teams match your filter</p>
                    </div>
                  ) : (
                    filteredTeams.map((team) => <TeamRow key={team.passId} team={team} />)
                  )}
                </div>
              </div>

              {/* Refresh */}
              <div className="text-center pt-4 pb-2">
                <button
                  onClick={loadAnalytics}
                  disabled={loading}
                  className="text-accent-gold hover:text-accent-hover font-bold inline-flex items-center gap-2 disabled:opacity-50 transition-all px-6 py-3 rounded-xl border border-accent-gold/20 hover:border-accent-gold/50 hover:shadow-[0_0_15px_rgba(249,221,156,0.1)]"
                >
                  🔄 Refresh Data
                </button>
              </div>
            </div>
          )}
        </>
        )}
      </div>
    </div>
  );
}
