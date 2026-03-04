import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  Users, 
  Settings,
  ChevronRight,
  Send,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const FamilyDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock data - pretend this comes from a database
  const familyMembers = [
    {
      id: 1,
      name: 'Kofi',
      relationship: 'Father',
      status: 'responded',
      latestResponse: 'Feeling good today! Went for a walk.',
      time: '10:30 AM',
      mood: '😊'
    },
    {
      id: 2,
      name: 'Grace',
      relationship: 'Mother',
      status: 'pending',
      latestResponse: 'No response yet',
      time: null,
      mood: '⏳'
    },
    {
      id: 3,
      name: 'Auntie Mercy',
      relationship: 'Aunt',
      status: 'responded',
      latestResponse: 'Lovely weather, thinking of you.',
      time: '9:15 AM',
      mood: '😊'
    }
  ];

  const stats = {
    totalMembers: 3,
    respondedToday: 2,
    pendingResponses: 1
  };

  return (
    <div className="min-h-screen bg-background flex">
      
      {/* ===== SIDEBAR ===== */}
      <div className="w-64 bg-card shadow-lg flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-light text-primary">Family Connect</h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {/* Dashboard (active) */}
            <button 
              onClick={() => navigate('/family/dashboard')}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium"
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

            {/* View Responses */}
            <button 
              onClick={() => navigate('/family/responses')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Responses</span>
            </button>

            {/* Manage Members */}
            <button 
              onClick={() => navigate('/family/members')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Users className="w-5 h-5" />
              <span>Members</span>
            </button>

            {/* Settings */}
            <button 
              onClick={() => navigate('/family/settings')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </div>
        </nav>

        {/* User Profile at Bottom */}
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
        <div className="p-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-light text-primary mb-2">
              Hello, Sarah 👋
            </h1>
            <p className="text-secondary">
              Here's your family overview for today
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Total Members Card */}
            <div className="bg-card rounded-card p-6 shadow-sm">
              <p className="text-secondary text-sm mb-1">Total Members</p>
              <p className="text-3xl font-semibold text-primary">{stats.totalMembers}</p>
            </div>

            {/* Responded Today Card */}
            <div className="bg-card rounded-card p-6 shadow-sm">
              <p className="text-secondary text-sm mb-1">Responded Today</p>
              <div className="flex items-center space-x-2">
                <p className="text-3xl font-semibold text-green-600">{stats.respondedToday}</p>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>

            {/* Pending Card */}
            <div className="bg-card rounded-card p-6 shadow-sm">
              <p className="text-secondary text-sm mb-1">Pending</p>
              <div className="flex items-center space-x-2">
                <p className="text-3xl font-semibold text-orange-500">{stats.pendingResponses}</p>
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Family Members Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-primary">Your Family Members</h2>
              <button className="text-primary hover:underline text-sm flex items-center">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Member Cards */}
            <div className="space-y-4">
              {familyMembers.map((member) => (
                <div key={member.id} className="bg-card rounded-card p-6 shadow-sm">
                  
                  {/* Member Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xl text-primary">{member.mood}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-primary">{member.name}</h3>
                        <p className="text-secondary text-sm">{member.relationship}</p>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    {member.status === 'responded' ? (
                      <span className="flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Responded</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                        <Clock className="w-4 h-4" />
                        <span>Pending</span>
                      </span>
                    )}
                  </div>

                  {/* Latest Response */}
                  <div className="bg-background rounded-lg p-4 mb-4">
                    <p className="text-sm text-secondary mb-1">Latest response:</p>
                    <p className="text-primary">{member.latestResponse}</p>
                    {member.time && (
                      <p className="text-xs text-secondary mt-2">{member.time}</p>
                    )}
                  </div>

                  {/* Action Button */}
                  <button className="w-full flex items-center justify-center space-x-2 bg-primary/10 text-primary py-2 rounded-lg hover:bg-primary/20 transition-colors">
                    <Send className="w-4 h-4" />
                    <span>Send Question</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div>
            <h2 className="text-xl font-semibold text-primary mb-4">Recent Activity</h2>
            <div className="bg-card rounded-card p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-secondary">Kofi responded 2 hours ago</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-secondary">Auntie Mercy responded 3 hours ago</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <p className="text-sm text-secondary">Grace hasn't responded today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyDashboard;