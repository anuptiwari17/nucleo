import React from 'react';
import axios from "axios";

function Login({ onNavigate, onLogin }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const submitHandler = async (e) => {
  e.preventDefault();
  if (!email || !password) {
    setError("Please fill in all fields");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });

    const user = res.data;
    localStorage.setItem("user", JSON.stringify(user)); // Save user to localStorage

    // Call your onLogin function to update app state if needed
    if (onLogin) {
      onLogin(user); // pass full user object
    }

    // Navigate to dashboard based on user role
    if (user.role) {
      onNavigate(`${user.role}-dashboard`);
    } else {
      onNavigate("dashboard"); // fallback
    }

  } catch (err) {
    if (err.response && err.response.status === 401) {
      setError(err.response.data.error || "Invalid email or password");
    } else {
      setError("Something went wrong. Please try again.");
    }
  }

  setLoading(false);
};


  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4'>
    
      <button 
        onClick={() => onNavigate('landing')}
        className="absolute top-4 left-4 flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Home</span>
      </button>

      <div className='w-full max-w-md'>
        <div className='bg-white rounded-2xl shadow-xl p-8'>
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">N</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to your Nucleo account</p>
          </div>

          {/* Demo Credentials */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
            <div className="text-xs text-blue-700 space-y-1">
              <div><strong>Admin:</strong> admin@nucleo.com / admin123</div>
              <div><strong>Employee:</strong> john.doe@nucleo.com / emp123</div>
            </div>
          </div>

          <div className='space-y-6'>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors' 
                type="email" 
                placeholder='Enter your email' 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors' 
                type="password" 
                placeholder='Enter your password' 
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </div>
              <button type="button" className="text-sm text-red-600 hover:text-red-700">
                Forgot password?
              </button>
            </div>

            <button 
              onClick={submitHandler}
              disabled={loading}
              className='w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2'
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an organization account?{' '}
              <button 
                onClick={() => onNavigate('signup')}
                className="text-red-600 hover:text-red-700 font-medium"
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