import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

      {/* Signup card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 p-6 transform hover:scale-[1.005] transition-all duration-300">
          {/* Decorative gradient */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full filter blur-lg"></div>
          
          {/* Header */}
          <div className="text-center mb-6 relative z-10">
            <h2 className="text-3xl font-black text-white mb-2">
              Create <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Organization</span>
            </h2>
            <p className="text-white/70 text-sm">Register your organization with Nucleo</p>
          </div>

          {/* Form */}
          <form className="space-y-4 relative z-10" onSubmit={submitHandler}>
            {errors.apiError && (
              <div className="p-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-400/30 rounded-lg">
                <p className="text-red-300 text-xs">{errors.apiError}</p>
              </div>
            )}

            {/* Name fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/80 mb-1">First Name</label>
                <div className="relative">
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg focus:outline-none transition-all duration-300 text-white placeholder-white/40 text-sm ${
                      errors.firstName ? 'border border-red-400/50' : 'border border-white/10 focus:border-purple-400/50 focus:ring-1 focus:ring-purple-500/30'
                    }`}
                    type="text"
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-red-300 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/80 mb-1">Last Name</label>
                <div className="relative">
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg focus:outline-none transition-all duration-300 text-white placeholder-white/40 text-sm ${
                      errors.lastName ? 'border border-red-400/50' : 'border border-white/10 focus:border-purple-400/50 focus:ring-1 focus:ring-purple-500/30'
                    }`}
                    type="text"
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-red-300 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">Email Address</label>
              <div className="relative">
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg focus:outline-none transition-all duration-300 text-white placeholder-white/40 text-sm ${
                    errors.email ? 'border border-red-400/50' : 'border border-white/10 focus:border-purple-400/50 focus:ring-1 focus:ring-purple-500/30'
                  }`}
                  type="email"
                  placeholder="john.doe@company.com"
                />
                {errors.email && (
                  <p className="text-red-300 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Organization */}
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">Organization Name</label>
              <div className="relative">
                <input
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg focus:outline-none transition-all duration-300 text-white placeholder-white/40 text-sm ${
                    errors.organizationName ? 'border border-red-400/50' : 'border border-white/10 focus:border-purple-400/50 focus:ring-1 focus:ring-purple-500/30'
                  }`}
                  type="text"
                  placeholder="Your Company Name"
                />
                {errors.organizationName && (
                  <p className="text-red-300 text-xs mt-1">{errors.organizationName}</p>
                )}
              </div>
            </div>

            {/* Password fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/80 mb-1">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg focus:outline-none transition-all duration-300 text-white placeholder-white/40 text-sm ${
                      errors.password ? 'border border-red-400/50' : 'border border-white/10 focus:border-purple-400/50 focus:ring-1 focus:ring-purple-500/30'
                    }`}
                    type="password"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="text-red-300 text-xs mt-1">{errors.password}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/80 mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg focus:outline-none transition-all duration-300 text-white placeholder-white/40 text-sm ${
                      errors.confirmPassword ? 'border border-red-400/50' : 'border border-white/10 focus:border-purple-400/50 focus:ring-1 focus:ring-purple-500/30'
                    }`}
                    type="password"
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-300 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start">
              <div className="flex items-center h-4">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="w-3 h-3 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-offset-purple-500/20"
                />
              </div>
              <div className="ml-2 text-xs">
                <label htmlFor="terms" className="text-white/70">
                  I agree to the <a href="#" className="text-purple-300 hover:underline">Terms</a> and <a href="#" className="text-purple-300 hover:underline">Privacy Policy</a>
                </label>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-70 text-white py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center space-x-1 relative overflow-hidden group text-sm"
            >
              <span className="relative z-10">
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Organization</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center relative z-10">
            <p className="text-white/70 text-xs">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-white font-medium hover:text-purple-300 transition-colors hover:underline"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;