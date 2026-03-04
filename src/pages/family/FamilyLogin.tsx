import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const FamilyLogin: React.FC = () => {
  // State variables to store what user types
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Hook to navigate between pages
  const navigate = useNavigate();

  // What happens when form is submitted
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page from refreshing
    console.log('Login attempted with:', { email, password, rememberMe });
    // Later we'll add real login logic here
    // For now, just go to dashboard
    navigate('/family/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {/* Login Card */}
      <div className="w-full max-w-md bg-card rounded-card shadow-xl p-8">
        
        {/* Logo and Back Link */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/')}
            className="text-secondary hover:text-primary transition-colors mb-4"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl font-light text-primary">Family Connect</h1>
          <p className="text-secondary">Sign in to your family account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-secondary">Remember me</span>
            </label>
            <button 
              type="button"
              onClick={() => alert('Password reset would go here')}
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-button text-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Login
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-secondary text-sm">
            Don't have an account?{' '}
            <button 
              type="button"
              onClick={() => alert('Sign up would go here')}
              className="text-primary hover:underline"
            >
              Create one
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default FamilyLogin;