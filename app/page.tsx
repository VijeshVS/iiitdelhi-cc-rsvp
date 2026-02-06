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
            Confirmation Form
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
                  <p className="text-white font-semibold">9:30 AM - 10:30 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent-gold">🕐</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm uppercase">Timing</p>
                  <p className="text-white font-semibold">10:30 AM - 5:00 PM</p>
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
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent-gold">🌐</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm uppercase">Mode</p>
                  <p className="text-white font-semibold">Offline</p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Instructions */}
          <div className="bg-surface-light border border-gray-700 rounded-lg p-6">
            <h2 className="text-accent-gold text-xl font-bold mb-6 uppercase">Important Instructions</h2>
            <ol className="space-y-3 list-none">
              <li className="flex items-start gap-3">
                <span className="text-accent-gold font-bold shrink-0">1.</span>
                <span className="text-gray-300">All ideas must be original.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-gold font-bold shrink-0">2.</span>
                <span className="text-gray-300">Participants must carry their college ID cards.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-gold font-bold shrink-0">3.</span>
                <span className="text-gray-300">Travel, food, or stay allowances will not be provided by the organising team.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-gold font-bold shrink-0">4.</span>
                <span className="text-gray-300">Problem statements will be provided on-site.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-gold font-bold shrink-0">5.</span>
                <span className="text-gray-300">Teams must strictly adhere to the event timeline.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-gold font-bold shrink-0">6.</span>
                <span className="text-gray-300">Any form of plagiarism or misconduct will result in immediate disqualification.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-gold font-bold shrink-0">7.</span>
                <span className="text-gray-300">The decision of the organising committee and judges will be final.</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Event Schedule */}
        <div className="mt-8 bg-surface-light border border-accent-gold rounded-lg p-6">
          <h2 className="text-accent-gold text-xl font-bold mb-6 uppercase text-center">Event Schedule</h2>
          <div className="relative pl-6 space-y-0 max-w-lg mx-auto">
            {/* Timeline line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-accent-gold/20" />

            {/* Reporting */}
            <div className="relative flex items-start gap-4 pb-5">
              <div className="absolute left-[-17px] top-1.5 w-3 h-3 rounded-full bg-accent-gold/30 border-2 border-accent-gold" />
              <div className="flex-1 bg-surface-dark border border-gray-700 rounded-lg px-4 py-3">
                <p className="text-accent-gold text-xs font-mono font-bold tracking-wider">9:30 AM — 10:30 AM</p>
                <p className="text-white font-semibold mt-0.5">Reporting &amp; Registration</p>
              </div>
            </div>

            {/* Inauguration */}
            <div className="relative flex items-start gap-4 pb-5">
              <div className="absolute left-[-17px] top-1.5 w-3 h-3 rounded-full bg-accent-gold/30 border-2 border-accent-gold" />
              <div className="flex-1 bg-surface-dark border border-gray-700 rounded-lg px-4 py-3">
                <p className="text-accent-gold text-xs font-mono font-bold tracking-wider">10:30 AM — 11:00 AM</p>
                <p className="text-white font-semibold mt-0.5">Inauguration</p>
              </div>
            </div>

            {/* Ideathon */}
            <div className="relative flex items-start gap-4">
              <div className="absolute left-[-17px] top-1.5 w-3 h-3 rounded-full bg-accent-gold border-2 border-accent-gold shadow-[0_0_8px_rgba(249,221,156,0.5)]" />
              <div className="flex-1 bg-accent-gold/5 border border-accent-gold/30 rounded-lg px-4 py-3">
                <p className="text-accent-gold text-xs font-mono font-bold tracking-wider">11:00 AM — 5:00 PM</p>
                <p className="text-white font-semibold mt-0.5">Ideathon 💡</p>
                <p className="text-gray-500 text-xs mt-1">Main event — 6 hours of building &amp; pitching</p>
              </div>
            </div>
          </div>
        </div>

        {/* Venue Map */}
        <div className="mt-8 bg-surface-light border border-gray-700 rounded-lg p-6">
          <h2 className="text-accent-gold text-xl font-bold mb-4 uppercase text-center">📍 Venue Location</h2>
          <div className="rounded-lg overflow-hidden border border-gray-700">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5965885498387!2d77.49633827484038!3d12.923710487390275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3e468d8b1fc7%3A0x1524e1e735a7a1c3!2sR.V.%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1707206400000!5m2!1sen!2sin"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="RVCE Bangalore Location"
            />
          </div>
          <div className="mt-3 text-center">
            <a
              href="https://maps.google.com/?q=R.V.+College+of+Engineering,+Bengaluru"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-gold hover:text-accent-hover text-sm font-semibold inline-flex items-center gap-1"
            >
              Open in Google Maps →
            </a>
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