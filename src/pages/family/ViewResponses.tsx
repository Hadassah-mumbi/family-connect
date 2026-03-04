import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  Users, 
  Settings,
  ChevronDown,
  Play,
  Download,
  Filter,
  Smile,
  Frown,
  Clock
} from 'lucide-react';

// Define types for our data
interface Response {
  id: number;
  memberName: string;
  memberId: number;
  relationship: string;
  question: string;
  response: string;
  responseType: 'voice' | 'text' | 'emoji';
  time: string;
  mood: 'happy' | 'neutral' | 'sad';
  duration?: string;
  emoji?: string;
  avatar: string;
}

interface Member {
  id: number;
  name: string;
}

const ViewResponses: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('today');

  // Mock data - responses from elderly users
  const responses: Response[] = [
    {
      id: 1,
      memberName: 'Kofi',
      memberId: 1,
      relationship: 'Father',
      question: 'How are you feeling today?',
      response: 'Feeling good! Went for a short walk this morning.',
      responseType: 'voice',
      time: 'Today, 9:30 AM',
      mood: 'happy',
      duration: '0:12',
      avatar: 'K'
    },
    {
      id: 2,
      memberName: 'Kofi',
      memberId: 1,
      relationship: 'Father',
      question: 'Did you take your medicine?',
      response: 'Yes, took it with breakfast.',
      responseType: 'text',
      time: 'Today, 9:32 AM',
      mood: 'neutral',
      avatar: 'K'
    },
    {
      id: 3,
      memberName: 'Grace',
      memberId: 2,
      relationship: 'Mother',
      question: 'How did you sleep?',
      response: 'Slept well, thank you for asking.',
      responseType: 'voice',
      time: 'Today, 8:15 AM',
      mood: 'happy',
      duration: '0:08',
      avatar: 'G'
    },
    {
      id: 4,
      memberName: 'Auntie Mercy',
      memberId: 3,
      relationship: 'Aunt',
      question: 'What did you have for breakfast?',
      response: 'Tea and bread',
      responseType: 'emoji',
      time: 'Yesterday, 10:00 AM',
      mood: 'neutral',
      emoji: '🍞',
      avatar: 'M'
    },
    {
      id: 5,
      memberName: 'Grace',
      memberId: 2,
      relationship: 'Mother',
      question: 'Any pain today?',
      response: 'A little in my knees',
      responseType: 'text',
      time: 'Yesterday, 8:30 AM',
      mood: 'sad',
      avatar: 'G'
    }
  ];

  // Filter responses based on selected member and date
  const filteredResponses = responses.filter(r => {
    const memberMatch = selectedMember === 'all' || r.memberId.toString() === selectedMember;
    // Simple date filter for demo
    const dateMatch = selectedDate === 'all' || 
      (selectedDate === 'today' && r.time.includes('Today')) ||
      (selectedDate === 'yesterday' && r.time.includes('Yesterday'));
    return memberMatch && dateMatch;
  });

  // Get mood icon
  const getMoodIcon = (mood: string) => {
    switch(mood) {
      case 'happy': return <Smile className="w-5 h-5 text-green-500" />;
      case 'sad': return <Frown className="w-5 h-5 text-orange-500" />;
      default: return <Smile className="w-5 h-5 text-gray-400" />;
    }
  };

  // Get unique members for filter - fixed with proper typing
  const memberMap = new Map<number, string>();
  responses.forEach(r => {
    if (!memberMap.has(r.memberId)) {
      memberMap.set(r.memberId, r.memberName);
    }
  });
  
  const members: Member[] = Array.from(memberMap, ([id, name]) => ({ id, name }));
  members.unshift({ id: 0, name: 'All Members' });

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

            {/* Responses (active) */}
            <button 
              onClick={() => navigate('/family/responses')}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium"
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
        <div className="p-8">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-light text-primary mb-2">
                Responses
              </h1>
              <p className="text-secondary">
                View all answers from your family members
              </p>
            </div>
            
            {/* Export Button */}
            <button 
              onClick={() => alert('Export responses as PDF')}
              className="flex items-center space-x-2 bg-card text-primary px-6 py-3 rounded-button border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Export</span>
            </button>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-card p-6 shadow-sm mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-medium text-primary">Filter Responses</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Member Filter */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Family Member
                </label>
                <div className="relative">
                  <select
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    className="w-full appearance-none bg-background border border-gray-200 rounded-input px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id === 0 ? 'all' : m.id.toString()}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary w-4 h-4" />
                </div>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Date
                </label>
                <div className="relative">
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full appearance-none bg-background border border-gray-200 rounded-input px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="all">All Time</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Responses List */}
          <div className="space-y-4">
            {filteredResponses.map((response) => (
              <div 
                key={response.id}
                className="bg-card rounded-card p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Response Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">{response.avatar}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-primary">{response.memberName}</h3>
                        <span className="text-sm text-secondary">({response.relationship})</span>
                        {getMoodIcon(response.mood)}
                      </div>
                      <p className="text-sm text-secondary">{response.time}</p>
                    </div>
                  </div>
                </div>

                {/* Question */}
                <div className="bg-background rounded-lg p-4 mb-4">
                  <p className="text-sm text-secondary mb-1">Question:</p>
                  <p className="text-primary font-medium">{response.question}</p>
                </div>

                {/* Response */}
                <div className="mb-3">
                  <p className="text-sm text-secondary mb-2">Response:</p>
                  
                  {response.responseType === 'voice' && (
                    <div className="flex items-center space-x-3 bg-background rounded-lg p-3">
                      <button className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      </button>
                      <div className="flex-1">
                        <div className="h-2 bg-gray-200 rounded-full w-full overflow-hidden">
                          <div className="h-2 bg-primary rounded-full w-1/3"></div>
                        </div>
                        <p className="text-xs text-secondary mt-1">{response.duration}</p>
                      </div>
                    </div>
                  )}

                  {response.responseType === 'text' && (
                    <div className="bg-background rounded-lg p-4">
                      <p className="text-primary">{response.response}</p>
                    </div>
                  )}

                  {response.responseType === 'emoji' && (
                    <div className="bg-background rounded-lg p-4 flex items-center space-x-2">
                      <span className="text-4xl">{response.emoji}</span>
                      <span className="text-secondary">(Emoji response)</span>
                    </div>
                  )}
                </div>

                {/* Transcript (for voice) */}
                {response.responseType === 'voice' && (
                  <div className="text-sm text-secondary border-t border-gray-100 pt-3">
                    <span className="font-medium">Transcript:</span> {response.response}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredResponses.length === 0 && (
            <div className="text-center py-12 bg-card rounded-card">
              <p className="text-secondary text-lg">No responses found</p>
              <p className="text-secondary text-sm mt-2">Try changing your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewResponses;