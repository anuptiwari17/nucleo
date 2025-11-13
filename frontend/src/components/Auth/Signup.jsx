import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_API_BASE_URL;

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organizationName: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.organizationName.trim()) newErrors.organizationName = "Organization name is required";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post(`${baseURL}/auth/signup`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        organizationName: formData.organizationName,
        password: formData.password,
        role: 'admin'
      });

      console.log("Signup successful:", response.data);
      navigate('/login');
    } catch (err) {
      console.error("Signup error:", err.response?.data);
      setErrors({
        ...errors,
        apiError: err.response?.data.message || 'Signup failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-violet-200/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl"></div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center space-x-2 text-slate-700 hover:text-slate-900 transition-colors z-10 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back</span>
      </button>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-8 lg:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black relative inline-block">
              <span 
                className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
                style={{ 
                  fontFamily: '"Orbitron", "Exo 2", "Rajdhani", "Space Grotesk", system-ui, sans-serif',
                  fontWeight: 900,
                  letterSpacing: '0.05em'
                }}
              >
                Nucleo
              </span>
            </h1>
            <h2 className="text-3xl font-bold text-slate-900 mt-3">Create Organization</h2>
            <p className="text-slate-600 mt-2">Set up your team in minutes</p>
          </div>

          {/* API Error */}
          {errors.apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700">{errors.apiError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={submitHandler} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white border ${errors.firstName ? 'border-red-400' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-slate-900 placeholder-slate-400 text-sm`}
                  type="text"
                  placeholder="John"
                />
                {errors.firstName && <p className="mt-1.5 text-xs text-red-600">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white border ${errors.lastName ? 'border-red-400' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-slate-900 placeholder-slate-400 text-sm`}
                  type="text"
                  placeholder="Doe"
                />
                {errors.lastName && <p className="mt-1.5 text-xs text-red-600">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white border ${errors.email ? 'border-red-400' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-slate-900 placeholder-slate-400 text-sm`}
                type="email"
                placeholder="john.doe@company.com"
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Organization Name</label>
              <input
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white border ${errors.organizationName ? 'border-red-400' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-slate-900 placeholder-slate-400 text-sm`}
                type="text"
                placeholder="Your Company Inc."
              />
              {errors.organizationName && <p className="mt-1.5 text-xs text-red-600">{errors.organizationName}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white border ${errors.password ? 'border-red-400' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-slate-900 placeholder-slate-400 text-sm`}
                  type="password"
                  placeholder="••••••••"
                />
                {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                <input
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white border ${errors.confirmPassword ? 'border-red-400' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-slate-900 placeholder-slate-400 text-sm`}
                  type="password"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Terms & Privacy Policy - Now Links to /legal */}
            <div className="flex items-start space-x-3">
              <input
                id="terms"
                type="checkbox"
                required
                className="w-4 h-4 text-violet-600 bg-white border-slate-300 rounded focus:ring-violet-500 mt-0.5"
              />
              <label htmlFor="terms" className="text-sm text-slate-600">
                I agree to the{' '}
                <Link 
                  to="/legal#terms" 
                  className="font-medium text-violet-600 hover:text-violet-700 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link 
                  to="/legal#privacy" 
                  className="font-medium text-violet-600 hover:text-violet-700 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 disabled:opacity-70 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Organization...</span>
                </>
              ) : (
                <>
                  <span>Create Organization</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-medium text-violet-600 hover:text-violet-700 hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;