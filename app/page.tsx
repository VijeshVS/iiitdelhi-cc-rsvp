import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-6 mb-4">
            <Image src="/rvce.png" alt="RVCE Logo" width={80} height={80} className="object-contain" />
            <Image src="/cc.png" alt="Coding Club Logo" width={80} height={80} className="object-contain" />
          </div>
          <span className="inline-block bg-accent-gold text-bg-dark px-6 py-2 text-sm font-bold uppercase tracking-wider">
            IIIT DELHI X Coding Club RVCE RSVP
          </span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-white">CONFIRM YOUR </span>
            <span className="text-accent-gold">SPOT</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Register for Innovate For Impact - E-Summit 2026 Zonals
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/register"
            className="bg-accent-gold text-bg-dark px-8 py-4 rounded-lg font-bold text-lg hover:bg-accent-hover transition-all duration-300 text-center uppercase"
          >
            New Registration
          </Link>
          <Link
            href="/pass"
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-bg-dark transition-all duration-300 text-center uppercase"
          >
            Retrieve Pass
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Event Details Card */}
          <div className="bg-surface-light border border-accent-gold rounded-lg p-6">
            <h2 className="text-accent-gold text-xl font-bold mb-6 uppercase">Event Details</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent-gold">📅</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm uppercase">Date</p>
                  <p className="text-white font-semibold">07 February 2026</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent-gold">⏰</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm uppercase">Reporting Time</p>
                  <p className="text-white font-semibold">9:00 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent-gold">🕐</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm uppercase">Timing</p>
                  <p className="text-white font-semibold">10:00 AM - 4:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent-gold">⏱️</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm uppercase">Duration</p>
                  <p className="text-white font-semibold">6 Hours</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent-gold">📍</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm uppercase">Venue</p>
                  <p className="text-white font-semibold">R.V. College of Engineering (RVCE), Bengaluru</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent-gold">💰</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm uppercase">Prize Pool</p>
                  <p className="text-accent-gold font-bold text-xl">₹10,000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Why RSVP Card */}
          <div className="bg-surface-light border border-gray-700 rounded-lg p-6">
            <h2 className="text-accent-gold text-xl font-bold mb-6 uppercase">Why RSVP?</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-accent-gold text-lg">✓</span>
                <span className="text-gray-300">Secure your spot at the event</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-gold text-lg">✓</span>
                <span className="text-gray-300">Get event updates via email</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-gold text-lg">✓</span>
                <span className="text-gray-300">Fast-track entry on event day</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-gold text-lg">✓</span>
                <span className="text-gray-300">Receive participation certificate</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 bg-surface-light border border-gray-700 rounded-lg p-6 text-center">
          <p className="text-gray-400 mb-4 uppercase text-sm">For Queries</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <div>
              <p className="text-gray-300 text-sm mb-1">Samkit Samsukha</p>
              <a
                href="tel:9239089089"
                className="text-accent-gold text-xl font-bold hover:text-accent-hover transition-colors"
              >
                9239089089
              </a>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gray-700"></div>
            <div>
              <p className="text-gray-300 text-sm mb-1">Vijesh</p>
              <a
                href="tel:7795639998"
                className="text-accent-gold text-xl font-bold hover:text-accent-hover transition-colors"
              >
                7795639998
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}