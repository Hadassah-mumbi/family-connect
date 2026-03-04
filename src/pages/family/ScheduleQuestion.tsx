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
  Clock,
  Repeat,
  Send
} from 'lucide-react';

const ScheduleQuestion: React.FC = () => {
  const navigate = useNavigate();
  
  // Form state
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [frequency, setFrequency] = useState('daily');
  const [startDate, setStartDate] = useState('2026-03-05');

  // Mock data - family members
  const familyMembers = [
    { id: 1, name: 'Kofi', relationship: 'Father' },
    { id: 2, name: 'Grace', relationship: 'Mother' },
    { id: 3, name: 'Auntie Mercy', relationship: 'Aunt' }
  ];

  // Mock data - questions from bank
  const questions = [
    { id: 1, text: 'How are you feeling today?', category: 'Mood' },
    { id: 2, text: 'Did you take your medicine today?', category: 'Health' },
    { id: 3, text: 'What did you have for breakfast?', category: 'Daily' },
    { id: 4, text: 'Tell me a happy memory', category: 'Memory' },
    { id: 5, text: 'Did you go for a walk today?', category: 'Health' },
    { id: 6, text: 'What made you smile today?', category: 'Mood' }
  ];

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would save to database
    console.log('Scheduled:', {
      member: selectedMember,
      question: selectedQuestion,
      time: selectedTime,
      frequency,
      startDate
    });
    
    // Show success message
    alert('Question scheduled successfully!');
    
    // Go back to dashboard
    navigate('/family/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex">
      
      {/* ===== SIDEBAR (same as before) ===== */}
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

            {/* Schedule (active) */}
            <button 
              onClick={() => navigate('/family/schedule')}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium"
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
        <div className="p-8 max-w-3xl">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-light text-primary mb-2">
              Schedule a Question
            </h1>
            <p className="text-secondary">
              Choose who to send to, what to ask, and when
            </p>
          </div>

          {/* Schedule Form */}
          <form onSubmit={handleSchedule} className="space-y-6">
            
            {/* Select Family Member */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Select Family Member
              </label>
              <div className="relative">
                <select
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  className="w-full appearance-none bg-card border border-gray-200 rounded-input px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  required
                >
                  <option value="">Choose a member...</option>
                  {familyMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.relationship})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
              </div>
            </div>

            {/* Select Question */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Select Question
              </label>
              <div className="relative">
                <select
                  value={selectedQuestion}
                  onChange={(e) => setSelectedQuestion(e.target.value)}
                  className="w-full appearance-none bg-card border border-gray-200 rounded-input px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  required
                >
                  <option value="">Choose a question...</option>
                  {questions.map(q => (
                    <option key={q.id} value={q.id}>
                      {q.text} ({q.category})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
              </div>
            </div>

            {/* Time and Frequency Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Time Picker */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Time
                </label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-card border border-gray-200 rounded-input px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  required
                />
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  <Repeat className="w-4 h-4 inline mr-1" />
                  Frequency
                </label>
                <div className="relative">
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full appearance-none bg-card border border-gray-200 rounded-input px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  >
                    <option value="once">One-time</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-card border border-gray-200 rounded-input px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-button text-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Schedule Question</span>
              </button>
            </div>

            {/* Note */}
            <p className="text-center text-sm text-secondary">
              The question will be sent at the scheduled time each day.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleQuestion;