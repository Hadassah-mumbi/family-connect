import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home,
  Bookmark,
  Clock,
  Settings as SettingsIcon,
  Calendar,
  Play,
  ChevronDown,
  ChevronUp,
  Smile,
  Frown,
  Meh
} from 'lucide-react';

const History: React.FC = () => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState('all');

  // Mock history data
  const historyData = [
    {
      id: 1,
      date: 'Today, 9:30 AM',
      question: 'How are you feeling today?',
      response: 'Feeling good! Went for a short walk this morning.',
      responseType: 'voice',
      mood: 'happy',
      duration: '0:12',
      category: 'Mood'
    },
    {
      id: 2,
      date: 'Today, 8:15 AM',
      question: 'Did you take your medicine?',
      response: 'Yes, took it with breakfast.',
      responseType: 'text',
      mood: 'neutral',
      category: 'Health'
    },
    {
      id: 3,
      date: 'Yesterday, 10:00 AM',
      question: 'What did you have for breakfast?',
      response: 'Tea and bread',
      responseType: 'emoji',
      emoji: '🍞',
      mood: 'neutral',
      category: 'Daily'
    },
    {
      id: 4,
      date: 'Yesterday, 8:30 AM',
      question: 'How did you sleep?',
      response: 'Slept well, thank you.',
      responseType: 'voice',
      mood: 'happy',
      duration: '0:08',
      category: 'Health'
    },
    {
      id: 5,
      date: 'Mar 3, 2026',
      question: 'Any pain today?',
      response: 'A little in my knees',
      responseType: 'text',
      mood: 'sad',
      category: 'Health'
    },
    {
      id: 6,
      date: 'Mar 2, 2026',
      question: 'What made you smile today?',
      response: 'Talked to granddaughter on phone',
      responseType: 'voice',
      mood: 'happy',
      duration: '0:45',
      category: 'Mood'
    }
  ];

  // Filter data
  const filteredData = historyData.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'voice') return item.responseType === 'voice';
    if (filter === 'text') return item.responseType === 'text';
    if (filter === 'emoji') return item.responseType === 'emoji';
    return true;
  });

  // Group by date
  const groupedData = filteredData.reduce((groups: any, item) => {
    const date = item.date.includes('Today') ? 'Today' : 
                 item.date.includes('Yesterday') ? 'Yesterday' : 
                 'Earlier';
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
    return groups;
  }, {});

  const getMoodIcon = (mood: string) => {
    switch(mood) {
      case 'happy': return <Smile className="w-5 h-5 text-green-500" />;
      case 'sad': return <Frown className="w-5 h-5 text-orange-500" />;
      default: return <Meh className="w-5 h-5 text-gray-400" />;
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      {/* ===== TOP BAR ===== */}
      <div className="bg-card shadow-sm p-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-light text-primary">Family Connect</h1>
          <button 
            onClick={() => navigate('/elderly/settings')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <SettingsIcon className="w-6 h-6 text-primary" />
          </button>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-lg mx-auto">
          
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-light text-primary mb-2">History</h2>
            <p className="text-secondary">Your past questions and responses</p>
          </div>

          {/* Filter Chips */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            {['all', 'voice', 'text', 'emoji'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                  ${filter === f 
                    ? 'bg-primary text-white' 
                    : 'bg-card text-secondary hover:bg-gray-100'
                  }`}
              >
                {f === 'all' ? 'All' : 
                 f === 'voice' ? '🎤 Voice' : 
                 f === 'text' ? '✏️ Text' : '😊 Emoji'}
              </button>
            ))}
          </div>

          {/* History by Date */}
          {Object.entries(groupedData).map(([date, items]: [string, any]) => (
            <div key={date} className="mb-6">
              <h3 className="text-lg font-medium text-primary mb-3">{date}</h3>
              
              <div className="space-y-3">
                {(items as any[]).map((item) => (
                  <div 
                    key={item.id}
                    className="bg-card rounded-card shadow-sm overflow-hidden"
                  >
                    {/* Question Summary - Always Visible */}
                    <div 
                      onClick={() => toggleExpand(item.id)}
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs text-secondary flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {item.date}
                            </span>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              {item.category}
                            </span>
                            {getMoodIcon(item.mood)}
                          </div>
                          <p className="text-lg text-primary">{item.question}</p>
                        </div>
                        <div className="ml-4">
                          {expandedId === item.id ? (
                            <ChevronUp className="w-5 h-5 text-secondary" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-secondary" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Response */}
                    {expandedId === item.id && (
                      <div className="border-t border-gray-100 p-4 bg-gray-50">
                        <p className="text-sm text-secondary mb-2">Your response:</p>
                        
                        {item.responseType === 'voice' && (
                          <div className="flex items-center space-x-3 bg-white rounded-lg p-3">
                            <button className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                              <Play className="w-5 h-5 text-white ml-0.5" />
                            </button>
                            <div className="flex-1">
                              <div className="h-2 bg-gray-200 rounded-full w-full overflow-hidden">
                                <div className="h-2 bg-primary rounded-full w-2/3"></div>
                              </div>
                              <p className="text-xs text-secondary mt-1">{item.duration}</p>
                            </div>
                          </div>
                        )}

                        {item.responseType === 'text' && (
                          <div className="bg-white rounded-lg p-4">
                            <p className="text-primary">{item.response}</p>
                          </div>
                        )}

                        {item.responseType === 'emoji' && (
                          <div className="bg-white rounded-lg p-4 flex items-center space-x-2">
                            <span className="text-4xl">{item.emoji}</span>
                            <span className="text-secondary">(Emoji response)</span>
                          </div>
                        )}

                        {/* Transcript for voice */}
                        {item.responseType === 'voice' && (
                          <div className="mt-3 text-sm text-secondary border-t border-gray-200 pt-3">
                            <span className="font-medium">Transcript:</span> {item.response}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-secondary mx-auto mb-4" />
              <p className="text-secondary text-lg">No history found</p>
              <p className="text-secondary text-sm mt-2">Your responses will appear here</p>
            </div>
          )}
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
              className="flex-1 py-3 bg-primary/10 text-primary rounded-full flex items-center justify-center space-x-2"
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

export default History;