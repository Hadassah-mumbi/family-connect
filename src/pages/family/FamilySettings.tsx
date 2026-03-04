import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  Users, 
  Settings,
  User,
  Bell,
  Lock,
  Moon,
  Sun,
  Mail,
  Phone,
  LogOut,
  ChevronRight,
  Save
} from 'lucide-react';

const FamilySettings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    emailResponses: true,
    pushResponses: false,
    dailyDigest: true,
    weeklySummary: true,
    memberReminders: true
  });

  // Profile form state
  const [profile, setProfile] = useState({
    name: 'Sarah Williams',
    email: 'sarah.williams@family.com',
    phone: '+254 712 345 678',
    role: 'Family Organizer'
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSaveProfile = () => {
    console.log('Profile saved:', profile);
    alert('Profile updated successfully!');
  };

  const handleChangePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('New passwords do not match');
      return;
    }
    if (passwordData.new.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    console.log('Password changed');
    alert('Password changed successfully!');
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handleLogout = () => {
    // In a real app, you'd clear auth tokens here
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex">
      
      {/* ===== SIDEBAR ===== */}
      <div className="w-64 bg-card shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-light text-primary">Family Connect</h1>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {/* Dashboard */}
            <button 
              onClick={() => navigate('/family/dashboard')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </button>

            {/* Question Bank */}
            <button 
              onClick={() => navigate('/family/question-bank')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span>Question Bank</span>
            </button>

            {/* Schedule */}
            <button 
              onClick={() => navigate('/family/schedule')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Calendar className="w-5 h-5" />
              <span>Schedule</span>
            </button>

            {/* Responses */}
            <button 
              onClick={() => navigate('/family/responses')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Responses</span>
            </button>

            {/* Members */}
            <button 
              onClick={() => navigate('/family/members')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Users className="w-5 h-5" />
              <span>Members</span>
            </button>

            {/* Settings (active) */}
            <button 
              onClick={() => navigate('/family/settings')}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-primary font-semibold">S</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-primary">Sarah Williams</p>
              <p className="text-xs text-secondary">Family Organizer</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-4xl">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-light text-primary mb-2">
              Settings
            </h1>
            <p className="text-secondary">
              Manage your account and preferences
            </p>
          </div>

          {/* Settings Tabs */}
          <div className="bg-card rounded-card shadow-sm overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors
                  ${activeTab === 'profile' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-secondary hover:text-primary'
                  }`}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors
                  ${activeTab === 'notifications' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-secondary hover:text-primary'
                  }`}
              >
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors
                  ${activeTab === 'security' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-secondary hover:text-primary'
                  }`}
              >
                <Lock className="w-4 h-4" />
                <span>Security</span>
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors
                  ${activeTab === 'preferences' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-secondary hover:text-primary'
                  }`}
              >
                <Moon className="w-4 h-4" />
                <span>Preferences</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              
              {/* ===== PROFILE TAB ===== */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-primary">Profile Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="w-full bg-background border border-gray-200 rounded-input px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 bg-background border border-gray-200 rounded-input focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 bg-background border border-gray-200 rounded-input focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        value={profile.role}
                        onChange={(e) => setProfile({...profile, role: e.target.value})}
                        className="w-full bg-background border border-gray-200 rounded-input px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center justify-center space-x-2 bg-primary text-white px-6 py-3 rounded-button hover:bg-primary/90 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ===== NOTIFICATIONS TAB ===== */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-primary">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <div>
                        <p className="font-medium text-primary">Email Responses</p>
                        <p className="text-sm text-secondary">Get email when someone responds</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.emailResponses}
                          onChange={(e) => setNotifications({...notifications, emailResponses: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <div>
                        <p className="font-medium text-primary">Push Notifications</p>
                        <p className="text-sm text-secondary">Browser notifications for responses</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.pushResponses}
                          onChange={(e) => setNotifications({...notifications, pushResponses: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <div>
                        <p className="font-medium text-primary">Daily Digest</p>
                        <p className="text-sm text-secondary">Daily summary of all responses</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.dailyDigest}
                          onChange={(e) => setNotifications({...notifications, dailyDigest: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <div>
                        <p className="font-medium text-primary">Weekly Summary</p>
                        <p className="text-sm text-secondary">Weekly report of family activity</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.weeklySummary}
                          onChange={(e) => setNotifications({...notifications, weeklySummary: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <div>
                        <p className="font-medium text-primary">Member Reminders</p>
                        <p className="text-sm text-secondary">Reminders for inactive members</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.memberReminders}
                          onChange={(e) => setNotifications({...notifications, memberReminders: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== SECURITY TAB ===== */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-primary">Change Password</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.current}
                        onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                        className="w-full bg-background border border-gray-200 rounded-input px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.new}
                        onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                        className="w-full bg-background border border-gray-200 rounded-input px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirm}
                        onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                        className="w-full bg-background border border-gray-200 rounded-input px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <button
                      onClick={handleChangePassword}
                      className="bg-primary text-white px-6 py-3 rounded-button hover:bg-primary/90 transition-colors"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              )}

              {/* ===== PREFERENCES TAB ===== */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-primary">Appearance</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <div className="flex items-center space-x-3">
                        {darkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                        <div>
                          <p className="font-medium text-primary">Dark Mode</p>
                          <p className="text-sm text-secondary">Switch between light and dark theme</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={darkMode}
                          onChange={(e) => setDarkMode(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Logout Section */}
          <div className="mt-8 bg-card rounded-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <LogOut className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-medium text-primary">Logout</p>
                  <p className="text-sm text-secondary">Sign out of your account</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2 rounded-button hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilySettings;