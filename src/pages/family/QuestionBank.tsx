import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  Users, 
  Settings,
  Plus,
  Search,
  Star,
  Edit2,
  Trash2,
  Heart,
  Brain,
  Clock,
  Smile
} from 'lucide-react';

const QuestionBank: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Mock data - sample questions
  const questions = [
    {
      id: 1,
      text: 'How are you feeling today?',
      category: 'Mood',
      used: '3 days ago',
      favorite: true
    },
    {
      id: 2,
      text: 'Did you take your medicine today?',
      category: 'Health',
      used: 'Yesterday',
      favorite: true
    },
    {
      id: 3,
      text: 'What did you have for breakfast?',
      category: 'Daily',
      used: '2 days ago',
      favorite: false
    },
    {
      id: 4,
      text: 'Tell me a happy memory',
      category: 'Memory',
      used: 'Last week',
      favorite: false
    },
    {
      id: 5,
      text: 'Did you go for a walk today?',
      category: 'Health',
      used: '3 days ago',
      favorite: true
    },
    {
      id: 6,
      text: 'What made you smile today?',
      category: 'Mood',
      used: 'Never',
      favorite: false
    }
  ];

  // Filter questions based on search and category
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'Health': return <Heart className="w-4 h-4 text-red-400" />;
      case 'Mood': return <Smile className="w-4 h-4 text-yellow-500" />;
      case 'Memory': return <Brain className="w-4 h-4 text-purple-400" />;
      default: return <Clock className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      
      {/* ===== SIDEBAR (same as dashboard) ===== */}
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

            {/* Question Bank (active) */}
            <button 
              onClick={() => navigate('/family/question-bank')}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium"
            >
              <BookOpen className="w-5 h-5" />
              <span>Question Bank</span>
            </button>

            {/* Schedule */}
            <button 
  onClick={() => navigate('/family/schedule')}  // ✅ This makes it work
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
          
          {/* Header with New Question Button */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-light text-primary mb-2">
                Question Bank
              </h1>
              <p className="text-secondary">
                Create and manage questions for your family
              </p>
            </div>
            
            {/* New Question Button */}
            <button 
              onClick={() => alert('New question form would open')}
              className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-button hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Question</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-12 pr-4 py-3 bg-card border border-gray-200 rounded-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            {['All', 'Health', 'Mood', 'Memory', 'Daily'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                  ${selectedCategory === category 
                    ? 'bg-primary text-white' 
                    : 'bg-card text-secondary hover:bg-gray-100'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Questions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuestions.map((question) => (
              <div 
                key={question.id}
                className="bg-card rounded-card p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(question.category)}
                    <span className="text-xs font-medium text-secondary bg-background px-2 py-1 rounded-full">
                      {question.category}
                    </span>
                  </div>
                  
                  {/* Action Icons */}
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <Star className={`w-4 h-4 ${question.favorite ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <Edit2 className="w-4 h-4 text-secondary" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <p className="text-primary text-lg mb-3">{question.text}</p>

                {/* Last Used */}
                <p className="text-xs text-secondary">
                  Last used: {question.used}
                </p>
              </div>
            ))}
          </div>

          {/* Empty State (if no questions match search) */}
          {filteredQuestions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-secondary text-lg">No questions found</p>
              <p className="text-secondary text-sm mt-2">Try a different search or create a new question</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;