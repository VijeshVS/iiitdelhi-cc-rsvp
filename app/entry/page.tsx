'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  searchTeamForEntry,
  undoEntry,
  bulkMarkEntry,
  type TeamEntryData,
} from '@/app/actions/entryManagement';
import { verifyAdminCredentials, checkAdminSession, logoutAdmin } from '@/app/actions/adminAuth';
import Link from 'next/link';

const QrScanner = dynamic(() => import('./QrScanner'), { ssr: false });

export default function EntryPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Entry state
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [teamData, setTeamData] = useState<TeamEntryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Check existing session on mount
  useEffect(() => {
    checkAdminSession().then((result) => {
      if (result.success) {
        setIsAuthenticated(true);
      }
      setAuthChecking(false);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    const result = await verifyAdminCredentials(username, password);

    if (result.success) {
      setIsAuthenticated(true);
    } else {
      setAuthError(result.message);
    }

    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
    setTeamData(null);
    setQuery('');
  };

  // Selection helpers
  const toggleSelect = (key: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(key);
      else next.delete(key);
      return next;
    });
  };

  // Compute all pending (not entered) keys
  const allPendingKeys: string[] = [];
  if (teamData) {
    if (!teamData.entered) allPendingKeys.push('lead');
    teamData.teamMembers.forEach((m) => {
      if (!m.entered) allPendingKeys.push(`member-${m.index}`);
    });
  }

  const refreshTeamData = async () => {
    if (!teamData) return;
    const refreshed = await searchTeamForEntry(teamData.passId);
    if (refreshed.success && refreshed.data) {
      setTeamData(refreshed.data);
      setSelected(new Set());
    }
  };

  const handleMarkSelected = async () => {
    if (!teamData || selected.size === 0) return;
    setActionLoading('bulk');
    setSuccessMsg(null);
    setError(null);

    const selections = Array.from(selected).map((key) => {
      if (key === 'lead') return { type: 'lead' as const };
      const idx = parseInt(key.replace('member-', ''));
      return { type: 'member' as const, memberIndex: idx };
    });

    const result = await bulkMarkEntry(teamData.passId, selections);
    if (result.success) {
      setSuccessMsg(result.message);
      await refreshTeamData();
    } else {
      setError(result.message);
    }
    setActionLoading(null);
  };

  const handleMarkAll = async () => {
    if (!teamData || allPendingKeys.length === 0) return;
    setActionLoading('bulk-all');
    setSuccessMsg(null);
    setError(null);

    const selections = allPendingKeys.map((key) => {
      if (key === 'lead') return { type: 'lead' as const };
      const idx = parseInt(key.replace('member-', ''));
      return { type: 'member' as const, memberIndex: idx };
    });

    const result = await bulkMarkEntry(teamData.passId, selections);
    if (result.success) {
      setSuccessMsg(result.message);
      await refreshTeamData();
    } else {
      setError(result.message);
    }
    setActionLoading(null);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTeamData(null);
    setSuccessMsg(null);
    setSelected(new Set());

    const result = await searchTeamForEntry(query);

    if (result.success && result.data) {
      setTeamData(result.data);
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const handleUndoEntry = async (personType: 'lead' | 'member', memberIndex?: number) => {
    if (!teamData) return;
    const key = personType === 'lead' ? 'lead' : `member-${memberIndex}`;
    setActionLoading(key);
    setSuccessMsg(null);

    const result = await undoEntry(teamData.passId, personType, memberIndex);

    if (result.success) {
      setSuccessMsg(result.message);
      const refreshed = await searchTeamForEntry(teamData.passId);
      if (refreshed.success && refreshed.data) {
        setTeamData(refreshed.data);
      }
    } else {
      setError(result.message);
    }

    setActionLoading(null);
  };

  const searchByValue = async (value: string) => {
    setLoading(true);
    setError(null);
    setTeamData(null);
    setSuccessMsg(null);
    setQuery(value);

    const result = await searchTeamForEntry(value);

    if (result.success && result.data) {
      setTeamData(result.data);
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const searchByValueRef = useRef(searchByValue);
  useEffect(() => {
    searchByValueRef.current = searchByValue;
  });

  const handleQrScan = useCallback((scannedText: string) => {
    setShowScanner(false);
    // Use setTimeout to ensure scanner is fully unmounted before search
    setTimeout(() => {
      searchByValueRef.current(scannedText);
    }, 100);
  }, []);

  const totalEntered = teamData
    ? (teamData.entered ? 1 : 0) + teamData.teamMembers.filter((m) => m.entered).length
    : 0;
  const totalMembers = teamData ? 1 + teamData.teamMembers.length : 0;

  return (
    <div className="min-h-screen bg-bg-dark py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Loading session check */}
        {authChecking ? (
          <div className="flex items-center justify-center mt-32">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
                <span className="text-white">PASS </span>
                <span className="text-accent-gold">ENTRY</span>
              </h1>
              <p className="text-gray-400">Sign in to manage event entries</p>
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
                <Link
                  href="/"
                  className="text-gray-400 hover:text-accent-gold text-sm inline-flex items-center gap-2"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        ) : (
        <>
        {/* Header */}
        <div className="text-center mb-6">
          <span className="inline-block bg-accent-gold text-bg-dark px-6 py-2 text-sm font-bold uppercase tracking-wider mb-4">
            Entry Management
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">PASS </span>
            <span className="text-accent-gold">ENTRY</span>
          </h1>
          <p className="text-gray-400 mb-6">
            Search by Pass ID or Email to mark entry for each candidate
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/analytics"
              className="border-2 border-accent-gold text-accent-gold px-8 py-3 rounded-lg font-bold hover:bg-accent-gold hover:text-bg-dark transition-all duration-300 text-center uppercase"
            >
              Analytics
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

        {/* Search Form */}
        <div className="bg-surface-light border border-gray-700 rounded-lg p-8 max-w-2xl mx-auto mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-accent-gold/10 flex items-center justify-center">
              <span className="text-accent-gold text-3xl">🎫</span>
            </div>
          </div>

          <h2 className="text-white text-2xl font-bold text-center mb-2">
            Search Registration
          </h2>
          <p className="text-gray-400 text-center mb-6">
            Scan a QR code or enter a Pass ID / Email
          </p>

          {/* Scan QR Button (prominent) */}
          <button
            type="button"
            onClick={() => setShowScanner(true)}
            className="w-full bg-accent-gold text-bg-dark py-4 rounded-lg font-bold text-lg hover:bg-accent-hover transition-all duration-300 uppercase mb-4 flex items-center justify-center gap-3"
          >
            <span className="text-2xl">📷</span>
            Scan Pass QR Code
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-gray-500 text-sm uppercase">or search manually</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Enter Pass ID or Email"
                className="flex-1 px-4 py-3 bg-surface-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-gold transition-colors"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowScanner(true)}
                className="px-4 py-3 bg-surface-dark border border-gray-700 rounded-lg text-accent-gold hover:bg-accent-gold hover:text-bg-dark transition-all text-xl"
                title="Scan QR Code"
              >
                📷
              </button>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                <p className="text-red-400 text-center">{error}</p>
              </div>
            )}

            {successMsg && (
              <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
                <p className="text-green-400 text-center">{successMsg}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-gold text-bg-dark py-4 rounded-lg font-bold text-lg hover:bg-accent-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Team Entry Management */}
        {teamData && (
          <div className="space-y-6">
            {/* Summary Banner */}
            <div className="bg-accent-gold rounded-lg p-4 md:p-6 text-center">
              <p className="text-bg-dark text-xs md:text-sm font-bold uppercase mb-1">Team: {teamData.teamName}</p>
              <p className="text-bg-dark text-[10px] md:text-xs font-mono mb-2 md:mb-3">{teamData.passId}</p>
              <div className="inline-flex items-center gap-2 bg-bg-dark/20 rounded-full px-4 py-2">
                <span className="text-bg-dark font-bold text-lg">
                  {totalEntered} / {totalMembers}
                </span>
                <span className="text-bg-dark text-sm">entered</span>
              </div>
            </div>

            {/* Bulk Action Bar */}
            <div className="bg-surface-light border border-gray-700 rounded-lg p-3 md:p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 md:gap-3">
                <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={allPendingKeys.length > 0 && allPendingKeys.every(k => selected.has(k))}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelected(new Set(allPendingKeys));
                      } else {
                        setSelected(new Set());
                      }
                    }}
                    disabled={allPendingKeys.length === 0}
                    className="w-5 h-5 accent-accent-gold rounded"
                  />
                  <span className="text-white text-xs md:text-sm font-medium truncate">
                    {allPendingKeys.length > 0 ? `Select All Pending (${allPendingKeys.length})` : 'All entered ✅'}
                  </span>
                </label>
                {selected.size > 0 && (
                  <span className="text-accent-gold text-xs md:text-sm font-bold shrink-0">
                    {selected.size} selected
                  </span>
                )}
              </div>
              <div className="flex gap-2 md:gap-3 w-full">
                <button
                  onClick={handleMarkSelected}
                  disabled={selected.size === 0 || actionLoading === 'bulk'}
                  className="bg-green-600 text-white px-3 md:px-5 py-2 md:py-2.5 rounded-lg font-bold hover:bg-green-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed uppercase text-xs md:text-sm flex-1"
                >
                  {actionLoading === 'bulk' ? '...' : `Mark (${selected.size})`}
                </button>
                <button
                  onClick={handleMarkAll}
                  disabled={allPendingKeys.length === 0 || actionLoading === 'bulk-all'}
                  className="bg-accent-gold text-bg-dark px-3 md:px-5 py-2 md:py-2.5 rounded-lg font-bold hover:bg-accent-hover transition-all disabled:opacity-40 disabled:cursor-not-allowed uppercase text-xs md:text-sm flex-1"
                >
                  {actionLoading === 'bulk-all' ? '...' : 'Mark All Entry'}
                </button>
              </div>
            </div>

            {/* All People List */}
            <div className="bg-surface-light border border-gray-700 rounded-lg p-3 md:p-6">
              <h3 className="text-accent-gold text-lg md:text-xl font-bold mb-3 md:mb-4 uppercase">Team Members</h3>
              <div className="space-y-3">
                {/* Team Lead */}
                {(() => {
                  const key = 'lead';
                  return (
                    <div className={`bg-surface-dark border rounded-lg p-3 md:p-4 transition-all ${
                      selected.has(key) ? 'border-accent-gold' : teamData.entered ? 'border-green-800' : 'border-gray-700'
                    }`}>
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={teamData.entered || selected.has(key)}
                          disabled={teamData.entered}
                          onChange={(e) => toggleSelect(key, e.target.checked)}
                          className="w-5 h-5 accent-accent-gold rounded shrink-0 mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`w-3 h-3 rounded-full shrink-0 ${teamData.entered ? 'bg-green-500' : 'bg-gray-500'}`} />
                            <p className="text-white text-base md:text-lg font-semibold break-words">{teamData.teamLeadFullName}</p>
                            <span className="text-accent-gold text-[10px] md:text-xs font-bold uppercase bg-accent-gold/10 px-2 py-0.5 rounded">Lead</span>
                            {teamData.entered && (
                              <span className="text-green-400 text-[10px] md:text-xs font-bold uppercase bg-green-900/30 px-2 py-0.5 md:py-1 rounded">✅ Entered</span>
                            )}
                          </div>
                          <div className="space-y-0.5 text-xs md:text-sm">
                            <p className="text-gray-400 break-all">📧 {teamData.email}</p>
                            <p className="text-gray-400">📱 {teamData.phone}</p>
                            <p className="text-gray-400 break-words">🏫 {teamData.college}</p>
                          </div>
                          {teamData.entered && (
                            <button
                              onClick={() => handleUndoEntry('lead')}
                              disabled={actionLoading === 'lead'}
                              className="text-red-400 hover:text-red-300 text-[10px] md:text-xs font-bold uppercase mt-1.5 disabled:opacity-50"
                            >
                              {actionLoading === 'lead' ? '...' : 'Undo Entry'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Team Members */}
                {teamData.teamMembers.map((member) => {
                  const key = `member-${member.index}`;
                  return (
                    <div
                      key={member.index}
                      className={`bg-surface-dark border rounded-lg p-3 md:p-4 transition-all ${
                        selected.has(key) ? 'border-accent-gold' : member.entered ? 'border-green-800' : 'border-gray-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={member.entered || selected.has(key)}
                          disabled={member.entered}
                          onChange={(e) => toggleSelect(key, e.target.checked)}
                          className="w-5 h-5 accent-accent-gold rounded shrink-0 mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`w-3 h-3 rounded-full shrink-0 ${member.entered ? 'bg-green-500' : 'bg-gray-500'}`} />
                            <p className="text-white text-base md:text-lg font-semibold break-words">{member.fullName}</p>
                            <span className="text-gray-500 text-[10px] md:text-xs">Member {member.index + 1}</span>
                            {member.entered && (
                              <span className="text-green-400 text-[10px] md:text-xs font-bold uppercase bg-green-900/30 px-2 py-0.5 md:py-1 rounded">✅ Entered</span>
                            )}
                          </div>
                          <div className="space-y-0.5 text-xs md:text-sm">
                            <p className="text-gray-400 break-all">📧 {member.email}</p>
                            <p className="text-gray-400">📱 {member.phone}</p>
                            <p className="text-gray-400 break-words">🏫 {member.college}</p>
                          </div>
                          {member.entered && (
                            <button
                              onClick={() => handleUndoEntry('member', member.index)}
                              disabled={actionLoading === key}
                              className="text-red-400 hover:text-red-300 text-[10px] md:text-xs font-bold uppercase mt-1.5 disabled:opacity-50"
                            >
                              {actionLoading === key ? '...' : 'Undo Entry'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Search Again */}
            <div className="text-center">
              <button
                onClick={() => {
                  setTeamData(null);
                  setQuery('');
                  setError(null);
                  setSuccessMsg(null);
                  setSelected(new Set());
                }}
                className="text-accent-gold hover:text-accent-hover font-semibold inline-flex items-center gap-2"
              >
                ← Search Another Team
              </button>
            </div>
          </div>
        )}
        {/* QR Scanner Modal */}
        {showScanner && (
          <QrScanner
            onScan={handleQrScan}
            onClose={() => setShowScanner(false)}
          />
        )}
        </>
        )}
      </div>
    </div>
  );
}
