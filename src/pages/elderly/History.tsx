import React, { useState, useEffect } from 'react';
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
import { db } from '../../firebase/config';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy 
} from 'firebase/firestore';

// Define Response type
interface ResponseItem {
  id: string;
  question: string;
  response: string;
  type: 'voice' | 'text';
  timestamp: any;
  category?: string;
  mood?: string;
  duration?: string;
}

const History: React.FC = () => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [responses, setResponses] = useState<ResponseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);

  // Load elderly user data and responses
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedElderly = localStorage.getItem('elderlyUser');
        
        if (!storedElderly) {
          navigate('/elderly/login');
          return;
        }

        const elderly = JSON.parse(storedElderly);
        console.log('Logged in elderly user:', elderly);
        
        setMemberId(elderly.memberId);
        setFamilyId(elderly.familyId);
        
        if (elderly.memberId && elderly.familyId) {
          await loadResponses(elderly.familyId, elderly.memberId);
        }
        
      } catch (error) {
        console.error('Error loading data:', error);
        navigate('/elderly/login');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  // Load responses from Firestore
  const loadResponses = async (famId: string, memId: string) => {
    try {
      const responsesRef = collection(db, 'users', famId, 'familyMembers', memId, 'responses');
      const q = query(responsesRef, orderBy('timestamp', 'desc'));
      const responsesSnap = await getDocs(q);
      
      const responsesList: ResponseItem[] = [];
      responsesSnap.forEach((doc) => {
        const data = doc.data();
        const timestamp = data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp);
        
        responsesList.push({
          id: doc.id,
          question: data.question || 'No question',
          response: data.response || '',
          type: data.type || 'text',
          timestamp: timestamp,
          category: data.category || 'General',
          mood: data.mood || 'neutral'
        });
      });
      
      setResponses(responsesList);
      console.log('Responses loaded:', responsesList.length);
    } catch (error) {
      console.error('Error loading responses:', error);
    }
  };

  // Format date for display
  const formatDate = (timestamp: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const responseDate = new Date(timestamp);
    
    if (responseDate >= today) {
      return `Today, ${responseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (responseDate >= yesterday) {
      return `Yesterday, ${responseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return responseDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  // Filter data
  const filteredData = responses.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'voice') return item.type === 'voice';
    if (filter === 'text') return item.type === 'text';
    return true;
  });

  // Group by date
  const groupedData = filteredData.reduce((groups: any, item) => {
    const date = new Date(item.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let groupKey = '';
    if (date >= today) {
      groupKey = 'Today';
    } else if (date >= yesterday) {
      groupKey = 'Yesterday';
    } else {
      groupKey = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(item);
    return groups;
  }, {});

  const getMoodIcon = (mood: string) => {
    switch(mood) {
      case 'happy': return <Smile className="w-5 h-5 text-green-500" />;
      case 'sad': return <Frown className="w-5 h-5 text-orange-500" />;
      default: return <Meh className="w-5 h-5 text-gray-400" />;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary">Loading history...</p>
        </div>
      </div>
    );
  }

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
            {['all', 'voice', 'text'].map((f) => (
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
                 f === 'voice' ? '🎤 Voice' : '✏️ Text'}
              </button>
            ))}
          </div>

          {/* History by Date */}
          {Object.keys(groupedData).length > 0 ? (
            Object.entries(groupedData).map(([date, items]: [string, any]) => (
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
                                {formatDate(item.timestamp)}
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
                          
                          {item.type === 'voice' && (
                            <div className="flex items-center space-x-3 bg-white rounded-lg p-3">
                              <button className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                                <Play className="w-5 h-5 text-white ml-0.5" />
                              </button>
                              <div className="flex-1">
                                <div className="h-2 bg-gray-200 rounded-full w-full overflow-hidden">
                                  <div className="h-2 bg-primary rounded-full w-2/3"></div>
                                </div>
                                <p className="text-xs text-secondary mt-1">Voice message</p>
                              </div>
                            </div>
                          )}

                          {item.type === 'text' && (
                            <div className="bg-white rounded-lg p-4">
                              <p className="text-primary">{item.response}</p>
                            </div>
                          )}

                          {/* Transcript for voice */}
                          {item.type === 'voice' && (
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
            ))
          ) : (
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