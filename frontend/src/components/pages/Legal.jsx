import { Link, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../layout/Footer';

const Legal = () => {
  const location = useLocation();
  const isTerms = location.hash === '#terms' || !location.hash;
  const isPrivacy = location.hash === '#privacy';
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <nav className="relative z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="group cursor-pointer">
                <h1 className="text-2xl font-black relative transition-all duration-300 group-hover:scale-105">
                  <span 
                    className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
                    style={{ 
                      fontFamily: '"Orbitron", "Exo 2", "Rajdhani", "Space Grotesk", system-ui, sans-serif',
                      fontWeight: 900,
                      letterSpacing: '0.05em'
                    }}
                    onClick={() => navigate('/')}
                  >
                    Nucleo
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 via-purple-400/20 to-blue-400/20 
                              rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </h1>
              </div>
            </div>
            
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Sign in
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Legal</h1>
          <p className="text-lg text-slate-600">Terms of Service & Privacy Policy</p>
          <p className="text-sm text-slate-500 mt-3">Last updated: November 13, 2025</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center gap-1 mb-10 bg-slate-100 p-1 rounded-xl w-fit mx-auto">
          <a
            href="#terms"
            className={`px-8 py-3 rounded-lg font-medium transition ${
              isTerms
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Terms of Service
          </a>
          <a
            href="#privacy"
            className={`px-8 py-3 rounded-lg font-medium transition ${
              isPrivacy
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Privacy Policy
          </a>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 prose prose-slate max-w-none">
          {/* Terms of Service */}
          <section id="terms">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Terms of Service</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Welcome to <strong>Nucleo</strong> — a modern task management platform built for teams and individuals who value clarity, speed, and simplicity.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">1. Acceptance of Terms</h3>
            <p className="text-slate-600 leading-relaxed">
              By accessing or using Nucleo, you agree to be bound by these Terms of Service and all applicable laws. If you do not agree, please do not use our service.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">2. Use of Service</h3>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>You must be at least 13 years old to use Nucleo.</li>
              <li>You are responsible for maintaining the confidentiality of your account.</li>
              <li>You agree not to use Nucleo for any unlawful or prohibited activities.</li>
              <li>Do not share your login credentials with others.</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">3. User Content</h3>
            <p className="text-slate-600 leading-relaxed">
              You retain ownership of your tasks, notes, and data. By using Nucleo, you grant us a limited license to store, display, and back up your content.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">4. Termination</h3>
            <p className="text-slate-600 leading-relaxed">
              We reserve the right to suspend or terminate your account if you violate these terms or engage in harmful behavior.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">5. Limitation of Liability</h3>
            <p className="text-slate-600 leading-relaxed">
              Nucleo is provided "as-is". We do not guarantee 100% uptime or data recovery in case of catastrophic failure.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">6. Changes to Terms</h3>
            <p className="text-slate-600 leading-relaxed">
              We may update these terms from time to time. Continued use of Nucleo after changes constitutes acceptance.
            </p>
          </section>

          <div className="my-16 border-t border-slate-200"></div>

          {/* Privacy Policy */}
          <section id="privacy">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Your privacy is critically important to us. This policy explains how we collect, use, and protect your data.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">1. Information We Collect</h3>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>Account information (name, email, role)</li>
              <li>Tasks, notes, and activity logs</li>
              <li>Usage data (login time, features used)</li>
              <li>Cookies for authentication and preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">2. How We Use Your Data</h3>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>To provide and improve Nucleo</li>
              <li>To send important notifications</li>
              <li>To analyze usage and fix bugs</li>
              <li>To prevent abuse and ensure security</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">3. Data Security</h3>
            <p className="text-slate-600 leading-relaxed">
              We use industry-standard encryption (HTTPS, secure cookies) and regular backups. However, no system is 100% secure.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">4. Data Retention</h3>
            <p className="text-slate-600 leading-relaxed">
              We keep your data as long as your account is active. Upon account deletion, data is permanently removed within 30 days.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">5. Your Rights</h3>
            <p className="text-slate-600 leading-relaxed">
              You can request to export or delete your data at any time by contacting us.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">6. Contact Us</h3>
            <p className="text-slate-600 leading-relaxed">
              For privacy concerns: <a href="mailto:privacy@nucleo.app" className="text-violet-600 underline">privacy@nucleo.app</a>
            </p>
          </section>
        </div>

      </main>
        <Footer />
    </div>
  );
};

export default Legal;