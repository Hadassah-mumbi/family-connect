import React, { useState, useEffect } from 'react';
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
import { auth, db } from '../../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Define types for our data
interface Response {
  id: string;
  memberName: string;
  memberId: string;
  relationship: string;
  question: string;
  response: string;
  responseType: 'voice' | 'text';
  timestamp: any;
  avatar: string;
}

interface Member {
  id: string;
  name: string;
  relationship: string;
}

const ViewResponses: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
const [userName, setUserName] = useState('Family Member');
const [userInitial, setUserInitial] = useState('U');
  // Load user and responses
  useEffect(() => {
  const loadUser = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const name = userSnap.data().name || 'Family Member';
        setUserName(name);
        setUserInitial(name.charAt(0).toUpperCase());
      }
    }
  };
  loadUser();
}, []);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await loadFamilyMembers(user.uid);
        await loadAllResponses(user.uid);
      } else {
        navigate('/family/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadFamilyMembers = async (uid: string) => {
    try {
      const membersRef = collection(db, 'users', uid, 'familyMembers');
      const membersSnap = await getDocs(membersRef);
      
      const membersList: Member[] = [];
      membersSnap.forEach((doc) => {
        membersList.push({
          id: doc.id,
          name: doc.data().name,
          relationship: doc.data().relationship
        });
      });
      
      setMembers(membersList);
      console.log('Family members loaded:', membersList);
    } catch (error) {
      console.error('Error loading family members:', error);
    }
  };

  // Load ALL responses from ALL family members
  const loadAllResponses = async (uid: string) => {
    try {
      // First, get all family members
      const membersRef = collection(db, 'users', uid, 'familyMembers');
      const membersSnap = await getDocs(membersRef);
      
      let allResponses: Response[] = [];
      
      // For each family member, load their responses
      for (const memberDoc of membersSnap.docs) {
        const memberId = memberDoc.id;
        const memberData = memberDoc.data();
        
        const responsesRef = collection(db, 'users', uid, 'familyMembers', memberId, 'responses');
        const responsesSnap = await getDocs(responsesRef);
        
        responsesSnap.forEach((responseDoc) => {
          const data = responseDoc.data();
          allResponses.push({
            id: responseDoc.id,
            memberName: memberData.name,
            memberId: memberId,
            relationship: memberData.relationship || 'Family Member',
            question: data.question || 'No question',
            response: data.response || '',
            responseType: data.type || 'text',
            timestamp: data.timestamp?.toDate?.() || new Date(),
            avatar: memberData.name?.charAt(0) || '?'
          });
        });
      }
      
      // Sort by most recent first
      allResponses.sort((a, b) => b.timestamp - a.timestamp);
      setResponses(allResponses);
      console.log('All responses loaded:', allResponses);
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

  // Filter responses based on selected member and date
  const filteredResponses = responses.filter(r => {
    const memberMatch = selectedMember === 'all' || r.memberId === selectedMember;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const responseDate = new Date(r.timestamp);
    responseDate.setHours(0, 0, 0, 0);
    
    const dateMatch = selectedDate === 'all' || 
      (selectedDate === 'today' && responseDate.getTime() === today.getTime()) ||
      (selectedDate === 'yesterday' && responseDate.getTime() === yesterday.getTime());
    
    return memberMatch && dateMatch;
  });

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary">Loading responses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      
      {/* ===== SIDEBAR ===== */}
      <div className="w-64 bg-card shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-light text-primary">Family Connect</h1>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <button 
              onClick={() => navigate('/family/dashboard')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => navigate('/family/question-bank')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span>Question Bank</span>
            </button>
            { /*<button 
              onClick={() => navigate('/family/schedule')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Calendar className="w-5 h-5" />
              <span>Schedule</span>
            </button> */}
            <button 
              onClick={() => navigate('/family/responses')}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Responses</span>
            </button>
            <button 
              onClick={() => navigate('/family/members')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Users className="w-5 h-5" />
              <span>Members</span>
            </button>
            <button 
              onClick={() => navigate('/family/settings')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100">
  <div className="flex items-center space-x-3">
    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
      <span className="text-primary font-semibold">{userInitial}</span>
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-primary">{userName}</p>
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
                    <option value="all">All Members</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.relationship})
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
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Responses List */}
          <div className="space-y-4">
            {filteredResponses.length > 0 ? (
              filteredResponses.map((response) => (
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
                        </div>
                        <p className="text-sm text-secondary">{formatDate(response.timestamp)}</p>
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
    <p className="text-xs text-secondary mt-1">Voice message</p>
  </div>
</div> 
                    )}

                    {response.responseType === 'text' && (
                      <div className="bg-background rounded-lg p-4">
                        <p className="text-primary">{response.response}</p>
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
              ))
            ) : (
              <div className="text-center py-12 bg-card rounded-card">
                <p className="text-secondary text-lg">No responses found</p>
                <p className="text-secondary text-sm mt-2">When your family members answer questions, their responses will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewResponses;