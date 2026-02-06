'use client';

import { useState } from 'react';
import { createTeamRegistration, type TeamRegistrationInput } from '@/app/actions/teamRegistration';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const [formData, setFormData] = useState<TeamRegistrationInput>({
    teamLeadFullName: '',
    email: '',
    phone: '',
    college: '',
    year: '1st',
    teamName: '',
    numberOfTeamMembers: 1,
    teamMembers: [],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'numberOfTeamMembers' ? parseInt(value) || 1 : value,
    }));

    if (name === 'numberOfTeamMembers' && parseInt(value) === 1) {
      setFormData((prev) => ({ ...prev, teamMembers: [] }));
    }
  };

  const handleTeamMemberChange = (index: number, field: 'fullName' | 'email' | 'phone' | 'college', value: string) => {
    const updatedMembers = [...(formData.teamMembers || [])];
    if (!updatedMembers[index]) {
      updatedMembers[index] = { fullName: '', email: '', phone: '', college: '' };
    }
    updatedMembers[index][field] = value;
    setFormData((prev) => ({ ...prev, teamMembers: updatedMembers }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await createTeamRegistration(formData);

    if (result.success) {
      setMessage({ type: 'success', text: 'Registration successful! You can check your pass details on the same website' });
      setFormData({
        teamLeadFullName: '',
        email: '',
        phone: '',
        college: '',
        year: '1st',
        teamName: '',
        numberOfTeamMembers: 1,
        teamMembers: [],
      });
    } else {
      setMessage({ type: 'error', text: result.message });
    }

    setLoading(false);
  };

  const renderTeamMemberFields = () => {
    const memberCount = formData.numberOfTeamMembers - 1;
    const members = [];

    for (let i = 0; i < memberCount; i++) {
      members.push(
        <div key={i} className="mt-6">
          <h4 className="text-white font-semibold mb-4">Team Member {i + 1}</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Enter member's full name"
                className="w-full px-4 py-3 bg-surface-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-gold transition-colors"
                value={formData.teamMembers?.[i]?.fullName || ''}
                onChange={(e) => handleTeamMemberChange(i, 'fullName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Email *</label>
              <input
                type="email"
                required
                placeholder="member.email@example.com"
                className="w-full px-4 py-3 bg-surface-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-gold transition-colors"
                value={formData.teamMembers?.[i]?.email || ''}
                onChange={(e) => handleTeamMemberChange(i, 'email', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Phone *</label>
              <input
                type="tel"
                required
                placeholder="10-digit mobile number"
                className="w-full px-4 py-3 bg-surface-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-gold transition-colors"
                value={formData.teamMembers?.[i]?.phone || ''}
                onChange={(e) => handleTeamMemberChange(i, 'phone', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">College/University *</label>
              <input
                type="text"
                required
                placeholder="Your college"
                className="w-full px-4 py-3 bg-surface-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-gold transition-colors"
                value={formData.teamMembers?.[i]?.college || ''}
                onChange={(e) => handleTeamMemberChange(i, 'college', e.target.value)}
              />
            </div>
          </div>
        </div>
      );
    }
    return members;
  };

  return (
    <div className="min-h-screen bg-bg-dark py-8 px-4">
      <div className="max-w-7xl mx-auto">
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
              className="bg-accent-gold text-bg-dark px-8 py-3 rounded-lg font-bold hover:bg-accent-hover transition-all duration-300 text-center uppercase"
            >
              Confirmation Form
            </Link>
            <Link
              href="/pass"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-bg-dark transition-all duration-300 text-center uppercase"
            >
              Retrieve Pass
            </Link>
          </div>
        </div>

        {/* Alert Banner */}
        <div className="mb-6 bg-red-900/20 border-l-4 border-red-500 p-4 rounded max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-xl">⚠</span>
            <p className="text-red-400 font-semibold uppercase text-sm">
              Only Team Leaders Fill The Details To Get The Pass. 
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mb-6 bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 text-xl">💡</span>
            <p className="text-yellow-400 font-semibold text-sm">
              Please note that only one pass/QR is sufficient for the entire team.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-surface-light border border-gray-700 rounded-lg p-6 md:p-8">
              {/* Section Badge */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-accent-gold text-bg-dark flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <h2 className="text-white text-xl font-bold">Team Leader Details</h2>
              </div>

              {/* Error/Success Message */}
              {message && (
                <div
                  className={`mb-6 p-4 rounded-lg border-2 ${
                    message.type === 'success'
                      ? 'bg-green-900/20 border-green-500'
                      : 'bg-red-900/20 border-red-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`text-2xl ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                      {message.type === 'success' ? '✓' : '✕'}
                    </span>
                    <div>
                      <p className={`font-bold mb-1 ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {message.type === 'success' ? 'Success!' : 'Registration Failed'}
                      </p>
                      <p className={message.type === 'success' ? 'text-green-300' : 'text-red-300'}>
                        {message.text}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Team Leader Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Full Name <span className="text-gray-500">(Max 25 chars)</span>
                    </label>
                    <input
                      type="text"
                      name="teamLeadFullName"
                      required
                      maxLength={25}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 bg-surface-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-gold transition-colors"
                      value={formData.teamLeadFullName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 bg-surface-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-gold transition-colors"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="10-digit mobile number"
                      className="w-full px-4 py-3 bg-surface-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-gold transition-colors"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">College/University</label>
                    <input
                      type="text"
                      name="college"
                      required
                      placeholder="Your college"
                      className="w-full px-4 py-3 bg-surface-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-gold transition-colors"
                      value={formData.college}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Year</label>
                    <select
                      name="year"
                      required
                      className="w-full px-4 py-3 bg-surface-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-gold transition-colors appearance-none cursor-pointer [&>option]:bg-surface-dark [&>option]:text-white"
                      style={{ colorScheme: 'dark' }}
                      value={formData.year}
                      onChange={handleInputChange}
                    >
                      <option value="1st" className="bg-surface-dark text-white">1st Year</option>
                      <option value="2nd" className="bg-surface-dark text-white">2nd Year</option>
                      <option value="3rd" className="bg-surface-dark text-white">3rd Year</option>
                      <option value="4th" className="bg-surface-dark text-white">4th Year</option>
                      <option value="PG" className="bg-surface-dark text-white">PG</option>
                    </select>
                  </div>
                </div>

                {/* Team Details */}
                <div className="pt-6 border-t border-gray-700">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Team Name *</label>
                      <input
                        type="text"
                        name="teamName"
                        required
                        placeholder="Your team name"
                        className="w-full px-4 py-3 bg-surface-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-gold transition-colors"
                        value={formData.teamName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Number of Team Members *</label>
                      <select
                        name="numberOfTeamMembers"
                        required
                        className="w-full px-4 py-3 bg-surface-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-gold transition-colors appearance-none cursor-pointer [&>option]:bg-surface-dark [&>option]:text-white"
                        style={{ colorScheme: 'dark' }}
                        value={formData.numberOfTeamMembers}
                        onChange={handleInputChange}
                      >
                        <option value="1" className="bg-surface-dark text-white">Solo (1 member)</option>
                        <option value="2" className="bg-surface-dark text-white">2 Members</option>
                        <option value="3" className="bg-surface-dark text-white">3 Members</option>
                        <option value="4" className="bg-surface-dark text-white">4 Members</option>
                        <option value="5" className="bg-surface-dark text-white">5 Members</option>
                      </select>
                      <p className="text-gray-500 text-xs mt-1">Maximum 5 members per team</p>
                    </div>
                  </div>
                </div>

                {/* Additional Team Members */}
                {formData.numberOfTeamMembers >= 2 && (
                  <div className="pt-6 border-t border-gray-700">
                    <h3 className="text-white text-lg font-semibold mb-4">Additional Team Members</h3>
                    {renderTeamMemberFields()}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent-gold text-bg-dark py-4 rounded-lg font-bold text-lg hover:bg-accent-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase flex items-center justify-center gap-2"
                >
                  {loading ? 'Submitting...' : (
                    <>
                      Submit RSVP
                      <span>→</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Info Cards */}
          <div className="space-y-6">
            {/* Event Details */}
            <div className="bg-surface-light border border-accent-gold rounded-lg p-6">
              <h2 className="text-accent-gold text-lg font-bold mb-4 uppercase">Event Details</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent-gold text-sm">📅</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase">Date</p>
                    <p className="text-white text-sm font-semibold">07 February 2026</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent-gold text-sm">⏰</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase">Reporting Time</p>
                    <p className="text-white text-sm font-semibold">9:00 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent-gold text-sm">🕐</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase">Timing</p>
                    <p className="text-white text-sm font-semibold">10:00 AM - 4:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent-gold text-sm">⏱️</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase">Duration</p>
                    <p className="text-white text-sm font-semibold">6 Hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent-gold text-sm">📍</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase">Venue</p>
                    <p className="text-white text-sm font-semibold">R.V. College of Engineering (RVCE), Bengaluru</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent-gold text-sm">💰</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase">Prize Pool</p>
                    <p className="text-accent-gold text-lg font-bold">₹10,000</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why RSVP */}
            <div className="bg-surface-light border border-gray-700 rounded-lg p-6">
              <h2 className="text-accent-gold text-lg font-bold mb-4 uppercase">Why RSVP?</h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-accent-gold text-sm">✓</span>
                  <span className="text-gray-300 text-sm">Secure your spot at the event</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-gold text-sm">✓</span>
                  <span className="text-gray-300 text-sm">Get event updates via email</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-gold text-sm">✓</span>
                  <span className="text-gray-300 text-sm">Fast-track entry on event day</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-gold text-sm">✓</span>
                  <span className="text-gray-300 text-sm">Receive participation certificate</span>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="bg-surface-light border border-gray-700 rounded-lg p-6 text-center">
              <p className="text-gray-400 text-xs uppercase mb-3">For Queries</p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <div>
                  <p className="text-gray-300 text-xs mb-1">Samkit Samsukha</p>
                  <a
                    href="tel:9239089089"
                    className="text-accent-gold text-lg font-bold hover:text-accent-hover transition-colors"
                  >
                    9239089089
                  </a>
                </div>
                <div className="hidden sm:block w-px h-10 bg-gray-700"></div>
                <div>
                  <p className="text-gray-300 text-xs mb-1">Vijesh</p>
                  <a
                    href="tel:7795639998"
                    className="text-accent-gold text-lg font-bold hover:text-accent-hover transition-colors"
                  >
                    7795639998
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
