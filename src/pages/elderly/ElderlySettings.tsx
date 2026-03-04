import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home,
  Bookmark,
  Clock,
  Settings as SettingsIcon,
  ArrowLeft,
  Moon,
  Sun,
  Languages,
  Type,
  Eye,
  LogOut,
  HelpCircle,
  Info,
  ChevronRight,
  Check
} from 'lucide-react';

const ElderlySettings: React.FC = () => {
  const navigate = useNavigate();
  
  // Settings state
  const [textSize, setTextSize] = useState('large'); // small, medium, large
  const [highContrast, setHighContrast] = useState(false);
  const [language, setLanguage] = useState('english'); // english, kiswahili
  const [autoPlay, setAutoPlay] = useState(true);
  
  // Show success message
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
    console.log('Settings saved:', { textSize, highContrast, language, autoPlay });
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      {/* ===== TOP BAR ===== */}
      <div className="bg-card shadow-sm p-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/elderly/daily-question')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <h1 className="text-2xl font-light text-primary">Settings</h1>
          <button 
            onClick={() => navigate('/elderly/settings')}
            className="p-2 bg-primary/10 rounded-full"
          >
            <SettingsIcon className="w-6 h-6 text-primary" />
          </button>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-lg mx-auto">
          
          {/* Success Message */}
          {showSaved && (
            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6 flex items-center justify-center space-x-2 animate-pulse">
              <Check className="w-6 h-6" />
              <span className="text-lg">Settings saved!</span>
            </div>
          )}

          {/* Settings Sections */}
          <div className="space-y-6">
            
            {/* ===== DISPLAY SETTINGS ===== */}
            <div className="bg-card rounded-card p-6 shadow-sm">
              <h2 className="text-xl font-light text-primary mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Display Settings
              </h2>

              {/* Text Size */}
              <div className="mb-6">
                <label className="block text-secondary mb-3 text-lg">Text Size</label>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setTextSize('small')}
                    className={`flex-1 py-4 rounded-xl text-lg font-medium transition-colors
                      ${textSize === 'small' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-secondary hover:bg-gray-200'
                      }`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setTextSize('medium')}
                    className={`flex-1 py-4 rounded-xl text-xl font-medium transition-colors
                      ${textSize === 'medium' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-secondary hover:bg-gray-200'
                      }`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setTextSize('large')}
                    className={`flex-1 py-4 rounded-xl text-2xl font-medium transition-colors
                      ${textSize === 'large' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-secondary hover:bg-gray-200'
                      }`}
                  >
                    A
                  </button>
                </div>
                <p className="text-sm text-secondary mt-2">
                  {textSize === 'small' && 'Small text (for smaller screens)'}
                  {textSize === 'medium' && 'Medium text (recommended)'}
                  {textSize === 'large' && 'Large text (easier to read)'}
                </p>
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-lg text-primary">High Contrast</p>
                  <p className="text-sm text-secondary">Makes text easier to see</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            {/* ===== LANGUAGE SETTINGS ===== */}
            <div className="bg-card rounded-card p-6 shadow-sm">
              <h2 className="text-xl font-light text-primary mb-4 flex items-center">
                <Languages className="w-5 h-5 mr-2" />
                Language
              </h2>

              <div className="space-y-3">
                <button
                  onClick={() => setLanguage('english')}
                  className={`w-full p-4 rounded-xl text-left text-lg transition-colors flex items-center justify-between
                    ${language === 'english' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-primary hover:bg-gray-200'
                    }`}
                >
                  <span>English</span>
                  {language === 'english' && <Check className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setLanguage('kiswahili')}
                  className={`w-full p-4 rounded-xl text-left text-lg transition-colors flex items-center justify-between
                    ${language === 'kiswahili' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-primary hover:bg-gray-200'
                    }`}
                >
                  <span>Kiswahili</span>
                  {language === 'kiswahili' && <Check className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* ===== AUDIO SETTINGS ===== */}
            <div className="bg-card rounded-card p-6 shadow-sm">
              <h2 className="text-xl font-light text-primary mb-4">Audio</h2>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-lg text-primary">Auto-play voice notes</p>
                  <p className="text-sm text-secondary">Play recordings automatically</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPlay}
                    onChange={(e) => setAutoPlay(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            {/* ===== HELP & SUPPORT ===== */}
            <div className="bg-card rounded-card p-6 shadow-sm">
              <h2 className="text-xl font-light text-primary mb-4">Help & Support</h2>

              <div className="space-y-2">
                <button className="w-full p-4 bg-gray-50 rounded-xl flex items-center justify-between hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    <span className="text-lg text-primary">How to use this app</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-secondary" />
                </button>
                <button className="w-full p-4 bg-gray-50 rounded-xl flex items-center justify-between hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Info className="w-5 h-5 text-primary" />
                    <span className="text-lg text-primary">About Family Connect</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-secondary" />
                </button>
              </div>
            </div>

            {/* ===== SAVE BUTTON ===== */}
            <button
              onClick={handleSave}
              className="w-full bg-primary text-white py-5 rounded-2xl text-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Save Settings
            </button>

            {/* ===== LOGOUT ===== */}
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-5 rounded-2xl text-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>

            {/* App Version */}
            <p className="text-center text-secondary text-sm py-4">
              Family Connect v1.0.0
            </p>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM NAVIGATION ===== */}
      <div className="bg-card border-t border-gray-100 p-2">
        <div className="max-w-lg mx-auto">
          <div className="bg-card rounded-full shadow-lg p-2 flex justify-around">
            <button 
              onClick={() => navigate('/elderly/daily-question')}
              className="flex-1 py-3 text-secondary hover:bg-gray-50 rounded-full flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span className="text-sm">Today</span>
            </button>
            <button 
              onClick={() => navigate('/elderly/saved')}
              className="flex-1 py-3 text-secondary hover:bg-gray-50 rounded-full flex items-center justify-center space-x-2"
            >
              <Bookmark className="w-5 h-5" />
              <span className="text-sm">Saved</span>
            </button>
            <button 
              onClick={() => navigate('/elderly/history')}
              className="flex-1 py-3 text-secondary hover:bg-gray-50 rounded-full flex items-center justify-center space-x-2"
            >
              <Clock className="w-5 h-5" />
              <span className="text-sm">History</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElderlySettings;