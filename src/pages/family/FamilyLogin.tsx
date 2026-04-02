import React, { useState } from 'react';// the main toolbox for building our component and managing state
import { useNavigate, Link } from 'react-router-dom';// tool that allows us to navigate between pages and create links
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';//icons for hiding and showing password
import { signInWithEmailAndPassword } from 'firebase/auth';//firebase function to sign in users with email and password
import { auth } from '../../firebase/config';//connection to our firebase authentication
import { doc, setDoc, getDoc } from 'firebase/firestore';//tools to interact with our Firestore database, allowing us to create and retrieve user profiles
import { db } from '../../firebase/config';

const FamilyLogin: React.FC = () => {
  // State variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Hook to navigate between pages
  const navigate = useNavigate();// allows us to programmatically navigate to different routes in our app

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();//
    setLoading(true);//chaanges text from login to logging in and disables the button to prevent multiple submissions
    
    try {
      console.log('Attempting login...');
      
      // 🔥 FIREBASE LOGIN
      const userCredential = await signInWithEmailAndPassword(auth, email, password);//hey firebase check if this email and password match any user in your database and log them in if they do
      console.log('Login successful!', userCredential.user);
      
      // 🔥 CHECK FIRESTORE FOR USER PROFILE
      const userRef = doc(db, 'users', userCredential.user.uid);//reference to the user's document in the 'users' collection using their unique ID from Firebase Authentication
      const userSnap = await getDoc(userRef);//retrieves the user's document from Firestore to check if it exists
      
      if (!userSnap.exists()) {//if the user is logging in for the first time and doesn't have a profile in Firestore
        // New user - create profile in Firestore
        await setDoc(userRef, {//creates a new document in the 'users' collection with the user's UID as the document ID and sets the following fields
          email: userCredential.user.email,
          name: email.split('@')[0], // Use part before @ as temporary name
          role: 'Family Member',
          createdAt: new Date().toISOString(),
          familyId: 'family_' + Date.now()
        });
        console.log('New user profile created in Firestore!');
      } else {
        console.log('Welcome back!', userSnap.data());
      }
      
      // Navigate to dashboard
      navigate('/family/dashboard');
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      // User-friendly error messages
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';//
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Try again later.';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-button text-lg font-medium hover:bg-primary/90 transition-colors disabled:bg-gray-300"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-secondary text-sm">
            Don't have an account?{' '}
            <Link to="/family/signup" className="text-primary hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default FamilyLogin;