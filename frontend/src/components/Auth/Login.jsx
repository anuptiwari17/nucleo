// Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const baseURL = import.meta.env.VITE_BACKEND_API_BASE_URL;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${baseURL}/auth/login`, {
        email,
        password,
      });

      const user = res.data;
      login(user, true);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 401) {
        setError(err.response.data.error || 'Invalid email or password');
      } else {
        setError('Something went wrong. Please try again.');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-52 h-52 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-30 blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-r from-pink-600 to-orange-600 rounded-full opacity-25 blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-r from-cyan-600 to-emerald-600 rounded-full opacity-20 blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 flex items-center space-x-1 text-white/80 hover:text-white transition-colors z-10 backdrop-blur-sm bg-white/10 px-3 py-1 rounded-full border border-white/20 text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back</span>
      </button>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 p-6 transform hover:scale-[1.01] transition-all duration-300">
          {/* Logo and header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black text-white tracking-wide relative pb-2">
              <span 
                className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
                style={{ 
                  fontFamily: '"Orbitron", "Exo 2", "Rajdhani", "Space Grotesk", system-ui, sans-serif',
                  fontWeight: 900,
                  letterSpacing: '0.1em'
                }}
              >
                Nucleo
              </span>
            </h1>
            <h2 className="text-3xl font-black text-white mb-1">
              Welcome <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Back</span>
            </h2>
            <p className="text-white/70 text-sm">Sign in to your Nucleo account</p>
          </div>

          {/* Login form */}
          <form className="space-y-4" onSubmit={submitHandler}>
            {error && (
              <div className="p-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-400/30 rounded-lg">
                <p className="text-red-300 text-xs">{error}</p>
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">Email Address</label>
              <div className="relative">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:border-purple-400/50 focus:ring-1 focus:ring-purple-500/30 focus:outline-none transition-all duration-300 text-white placeholder-white/40 text-sm"
                  type="email"
                  placeholder="Enter your email"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">Password</label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:border-purple-400/50 focus:ring-1 focus:ring-purple-500/30 focus:outline-none transition-all duration-300 text-white placeholder-white/40 text-sm"
                  type="password"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex items-center justify-end">
              <button 
                type="button" 
                onClick={() => navigate('/forgot-password')}
                className="text-xs text-white/70 hover:text-white transition-colors hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit button */}
            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-70 text-white py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center space-x-1 text-sm"
              type="submit"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-white/70 text-xs">
              Don't have an organization account?{' '}
              <button 
                onClick={() => navigate('/signup')} 
                className="text-white font-medium hover:text-purple-300 transition-colors hover:underline"
              >
                Create organization
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;