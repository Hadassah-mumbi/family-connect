import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Mic,
  HelpCircle,
  Check
} from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const ElderlyLogin: React.FC = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState<string[]>([]);
  const [showVoiceHelp, setShowVoiceHelp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle number pad click
  const handleNumberClick = (num: number) => {
    if (pin.length < 4) {
      setPin([...pin, num.toString()]);
      setError(''); // Clear error when user types
    }
  };

  // Handle delete
  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError('');
  };

  // Handle clear all
  const handleClear = () => {
    setPin([]);
    setError('');
  };

  // Handle submit
  const handleSubmit = async () => {
    if (pin.length !== 4) return;
    
    const enteredPin = pin.join('');
    console.log('Searching for PIN:', enteredPin);
    setLoading(true);
    setError('');
    
    try {
      const elderlyRef = collection(db, 'elderly_users');
      
      // 🔴 TEMPORARY TEST: Get ALL documents
      const allDocs = await getDocs(elderlyRef);
      console.log('ALL elderly users in collection:', allDocs.size);
      
      allDocs.forEach(doc => {
        console.log('Document ID:', doc.id);
        console.log('Document data:', doc.data());
        console.log('PIN in database:', doc.data().pin);
        console.log('Type of PIN:', typeof doc.data().pin);
      });
      
      // Now try the specific query
      const q = query(elderlyRef, where('pin', '==', enteredPin));
      const querySnap = await getDocs(q);
      console.log('Query results:', querySnap.size, 'documents found');
      
      if (!querySnap.empty) {
        const userDoc = querySnap.docs[0];
        const userData = userDoc.data();
        
        console.log('Login successful:', userData);
        
        localStorage.setItem('elderlyUser', JSON.stringify({
          id: userDoc.id,
          memberId: userData.memberId,
          familyId: userData.familyId,   // ← MAKE SURE THIS IS HERE!
          name: userData.name,
          pin: userData.pin,
          relationship: userData.relationship
        }));
        
        navigate('/elderly/daily-question');
      } else {
        console.log('No user found with PIN:', enteredPin);
        setError('Invalid PIN. Please try again.');
        setPin([]);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle voice login
  const handleVoiceLogin = () => {
    setShowVoiceHelp(true);
    // In real app, this would trigger speech recognition
    setTimeout(() => {
      setShowVoiceHelp(false);
      // For demo, use a test PIN
      setPin(['1', '2', '3', '4']);
      setTimeout(() => handleSubmit(), 500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      
      {/* Main Card */}
      <div className="w-full max-w-md bg-card rounded-card shadow-xl p-8">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-secondary hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>Back</span>
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-primary mb-2">
            Family Connect
          </h1>
          <p className="text-xl text-secondary">
            Enter your 4-digit PIN
          </p>
        </div>

        {/* PIN Dots */}
        <div className="flex justify-center space-x-6 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-16 h-16 border-4 border-primary rounded-2xl flex items-center justify-center bg-white"
            >
              <span className="text-4xl font-bold text-primary">
                {pin[i] ? '●' : ''}
              </span>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {/* Voice Login Indicator */}
        {showVoiceHelp && (
          <div className="bg-primary/10 rounded-lg p-4 mb-6 text-center animate-pulse">
            <Mic className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-primary">Listening... Say your PIN</p>
          </div>
        )}

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              disabled={loading}
              className="h-20 bg-primary text-white text-3xl font-bold rounded-2xl shadow-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/50 disabled:opacity-50"
              aria-label={`Number ${num}`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            disabled={loading}
            className="h-20 bg-gray-200 text-secondary text-xl font-semibold rounded-2xl shadow-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50"
          >
            Clear
          </button>
          <button
            onClick={() => handleNumberClick(0)}
            disabled={loading}
            className="h-20 bg-primary text-white text-3xl font-bold rounded-2xl shadow-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/50 disabled:opacity-50"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="h-20 bg-gray-200 text-secondary text-xl font-semibold rounded-2xl shadow-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50"
          >
            ⌫
          </button>
        </div>

        {/* Login Button */}
        <button
          onClick={handleSubmit}
          disabled={pin.length !== 4 || loading}
          className={`w-full py-4 text-xl font-semibold rounded-2xl mb-4 transition-colors flex items-center justify-center space-x-2
            ${pin.length === 4 && !loading
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
        >
          {loading ? (
            <>
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Logging in...</span>
            </>
          ) : (
            <>
              <Check className="w-6 h-6" />
              <span>Login</span>
            </>
          )}
        </button>

        {/* Voice Login Button */}
        <button
          onClick={handleVoiceLogin}
          disabled={loading}
          className="w-full py-4 bg-primary text-white text-xl font-semibold rounded-2xl hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2 mb-4 disabled:opacity-50"
        >
          <Mic className="w-6 h-6" />
          <span>Use Voice Login</span>
        </button>

        {/* Forgot PIN */}
        <button
          onClick={() => alert('Your family member can reset your PIN')}
          disabled={loading}
          className="w-full text-center text-primary hover:underline py-2 flex items-center justify-center space-x-1 disabled:opacity-50"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Forgot PIN? Ask family to reset</span>
        </button>

        {/* Accessibility Note */}
        <p className="text-center text-xs text-secondary mt-6">
          Large buttons • High contrast • Voice option available
        </p>
      </div>
    </div>
  );
};

export default ElderlyLogin;