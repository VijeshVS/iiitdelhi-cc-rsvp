'use client';

import { useState } from 'react';
import { getPassDetails, type PassDetailsResponse } from '@/app/actions/passDetails';
import Link from 'next/link';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';

export default function PassPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [passDetails, setPassDetails] = useState<PassDetailsResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPassDetails(null);

    const result = await getPassDetails(email);

    if (result.success && result.data) {
      setPassDetails(result.data);
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-6 mb-4">
            <Image src="/rvce.png" alt="RVCE Logo" width={80} height={80} className="object-contain" />
            <Image src="/cc.png" alt="Coding Club Logo" width={80} height={80} className="object-contain" />
          </div>
          <span className="inline-block bg-accent-gold text-bg-dark px-6 py-2 text-sm font-bold uppercase tracking-wider mb-4">
            IIIT DELHI X Coding Club RVCE RSVP
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">CONFIRM YOUR </span>
            <span className="text-accent-gold">SPOT</span>
          </h1>
          <p className="text-gray-400 mb-6">
            Register for Innovate For Impact - E-Summit 2026 Zonals
          </p>
          
          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-bg-dark transition-all duration-300 text-center uppercase"
            >
              New Registration
            </Link>
            <Link
              href="/pass"
              className="bg-accent-gold text-bg-dark px-8 py-3 rounded-lg font-bold hover:bg-accent-hover transition-all duration-300 text-center uppercase"
            >
              Retrieve Pass
            </Link>
          </div>
        </div>

        {/* Search Form */}
        {!passDetails && (
          <div className="bg-surface-light border border-gray-700 rounded-lg p-8 max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-accent-gold/10 flex items-center justify-center">
                <span className="text-accent-gold text-3xl">🔍</span>
              </div>
            </div>
            
            <h2 className="text-white text-2xl font-bold text-center mb-2">
              Retrieve Your Pass
            </h2>
            <p className="text-gray-400 text-center mb-6">
              Enter your Email to get your pass details
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="Enter your registered Email"
                  className="w-full px-4 py-3 bg-surface-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-gold transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                  <p className="text-red-400 text-center">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent-gold text-bg-dark py-4 rounded-lg font-bold text-lg hover:bg-accent-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
              >
                {loading ? 'Searching...' : 'Find My Pass'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-400 mb-3">Haven't registered yet?</p>
              <Link
                href="/register"
                className="text-accent-gold hover:text-accent-hover font-semibold inline-flex items-center gap-2"
              >
                Register Now
                <span>→</span>
              </Link>
            </div>
          </div>
        )}

        {/* Pass Details Display */}
        {passDetails && (
          <div className="space-y-6">
            {/* Pass ID Banner with QR Code */}
            <div className="bg-accent-gold rounded-lg p-8 text-center">
              <p className="text-bg-dark text-sm font-bold mb-4 uppercase">Your Pass QR Code</p>
              <div className="flex justify-center mb-4">
                <div className="bg-white p-4 rounded-lg">
                  <QRCodeSVG 
                    value={passDetails.passId}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>
              <p className="text-bg-dark text-sm font-mono">{passDetails.passId}</p>
            </div>

            {/* Team Information */}
            <div className="bg-surface-light border border-gray-700 rounded-lg p-6">
              <h3 className="text-accent-gold text-xl font-bold mb-4 uppercase">Team Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-surface-dark border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-xs uppercase mb-1">Team Name</p>
                  <p className="text-white text-lg font-semibold">{passDetails.teamName}</p>
                </div>
                <div className="bg-surface-dark border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-xs uppercase mb-1">Team Members</p>
                  <p className="text-white text-lg font-semibold">{passDetails.numberOfTeamMembers}</p>
                </div>
                <div className="bg-surface-dark border border-gray-700 rounded-lg p-4 md:col-span-2">
                  <p className="text-gray-400 text-xs uppercase mb-1">Registration Date</p>
                  <p className="text-white text-lg font-semibold">{formatDate(passDetails.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Team Leader Information */}
            <div className="bg-surface-light border border-gray-700 rounded-lg p-6">
              <h3 className="text-accent-gold text-xl font-bold mb-4 uppercase">Team Leader Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-surface-dark border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-xs uppercase mb-1">Full Name</p>
                  <p className="text-white font-semibold">{passDetails.teamLeadFullName}</p>
                </div>
                <div className="bg-surface-dark border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-xs uppercase mb-1">Email</p>
                  <p className="text-white font-semibold break-all">{passDetails.email}</p>
                </div>
                <div className="bg-surface-dark border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-xs uppercase mb-1">Phone</p>
                  <p className="text-white font-semibold">{passDetails.phone}</p>
                </div>
                <div className="bg-surface-dark border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-xs uppercase mb-1">College</p>
                  <p className="text-white font-semibold">{passDetails.college}</p>
                </div>
                <div className="bg-surface-dark border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-xs uppercase mb-1">Year</p>
                  <p className="text-white font-semibold">{passDetails.year}</p>
                </div>
              </div>
            </div>

            {/* Team Members Information */}
            {passDetails.teamMembers && passDetails.teamMembers.length > 0 && (
              <div className="bg-surface-light border border-gray-700 rounded-lg p-6">
                <h3 className="text-accent-gold text-xl font-bold mb-4 uppercase">Team Members</h3>
                <div className="space-y-4">
                  {passDetails.teamMembers.map((member, index) => (
                    <div
                      key={index}
                      className="bg-surface-dark border border-gray-700 rounded-lg p-4"
                    >
                      <h4 className="text-accent-gold font-bold mb-3">Member {index + 1}</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-gray-400 text-xs uppercase">Name</p>
                          <p className="text-white">{member.fullName}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs uppercase">Email</p>
                          <p className="text-white break-all">{member.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs uppercase">Phone</p>
                          <p className="text-white">{member.phone}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs uppercase">College</p>
                          <p className="text-white">{member.college}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Event Information */}
            <div className="bg-accent-gold/10 border-2 border-accent-gold rounded-lg p-6">
              <h3 className="text-accent-gold text-xl font-bold mb-4 uppercase">Event Details</h3>
              <div className="grid md:grid-cols-2 gap-3 text-white">
                <p><span className="text-gray-400">📅 Date:</span> 07 February 2026</p>
                <p><span className="text-gray-400">⏱️ Time:</span> 6 Hours</p>
                <p><span className="text-gray-400">📍 Venue:</span> R.V. College of Engineering (RVCE), Bengaluru</p>
                <p><span className="text-gray-400">💰 Prize Pool:</span> ₹10,000</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-orange-900/20 border-l-4 border-orange-500 p-4 rounded">
              <div className="flex items-start gap-2">
                <span className="text-orange-500 text-xl">📌</span>
                <p className="text-orange-400">
                  <span className="font-bold">Important:</span> Please save your Pass ID and bring it with you on event day for fast-track entry!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
