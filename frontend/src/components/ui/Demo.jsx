import React from 'react';
import { Link } from 'react-router-dom';

const ShowcaseDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <h1 className="text-3xl font-black">
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
                style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 800 }}>
                Nucleo
              </span>
            </h1>
          </Link>
          <Link to="/" className="text-slate-700 hover:text-slate-900 font-medium">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          

          <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
            Want to walk through Nucleo <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">live</span>?
          </h1>

          <p className="mt-6 text-xl text-slate-600 max-w-3xl mx-auto">
            I’d love to give you a 15-minute tour of the entire platform — from auth to task assignment to analytics — and show you the code, architecture decisions, and UX details behind it.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: What We’ll Cover */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-900">In 15 minutes you’ll see:</h2>
            <ul className="space-y-5">
              {[
                "Full-stack architecture (Vite + React + Node.js + your stack)",
                "Authentication & role-based access (Admin vs Employee)",
                "Real-time task flow with state management",
                "Clean, production-ready UI system (Tailwind + components)",
                "Responsive design & accessibility details",
                "How I made it feel premium without heavy libraries",
                "Code structure, naming, and scalability decisions",
                "Deployment, environment vars, and future roadmap",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

          </div>

          {/* Right: Booking + Contact */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 sticky top-24">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              Pick a 15-min slot
            </h3>

            {/* Real Calendly (or just your contact) */}
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-slate-600 mb-6">
                  I’m usually free weekdays 9 AM – 6 PM IST
                </p>
                <a
                  href="https://calendly.com/your-name/15min"  // ← put your real Calendly or remove
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full py-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-xl transition"
                >
                  Open My Calendar
                </a>
              </div>

              <div className="text-center text-sm text-slate-600">
                <p>Or reach me directly:</p>
                <div className="mt-4 space-y-3 font-medium">
                  <p>✉️ anuptiwari050@gmail.com</p>
                  <p>LinkedIn: linkedin.com/in/-anuptiwari</p>
                  <p>GitHub: github.com/anuptiwari17</p>
                </div>
              </div>

              
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-20">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-violet-600 font-medium hover:underline"
          >
            ← Back to the app
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ShowcaseDemo;