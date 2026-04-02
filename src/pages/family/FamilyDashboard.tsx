import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { auth, db } from '../../firebase/config';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const FamilyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Family Member');
  const [userInitial, setUserInitial] = useState('U');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  
  const [stats, setStats] = useState({
    totalMembers: 0,
    respondedToday: 0,
    pendingResponses: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Get current user data from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const name = userData.name || 'Family Member';
          setUserName(name);
          setUserInitial(name.charAt(0).toUpperCase());
          console.log('User name loaded:', name);
        } else {
          const emailName = user.email?.split('@')[0] || 'Family Member';
          setUserName(emailName);
          setUserInitial(emailName.charAt(0).toUpperCase());
        }
        
        await loadFamilyMembers(user.uid);
        await loadStats(user.uid);
        await loadRecentActivity(user.uid);
      } else {
        navigate('/family/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadFamilyMembers = async (userId: string) => {
    try {
      const membersRef = collection(db, 'users', userId, 'familyMembers');
      const membersSnap = await getDocs(membersRef);
      
      const membersList: any[] = [];
      membersSnap.forEach((doc) => {
        membersList.push({
          id: doc.id,
          ...doc.data(),
          status: doc.data().name === 'Kofi' ? 'responded' : 'pending',
          latestResponse: doc.data().name === 'Kofi' ? 'Feeling good today!' : 'No response yet',
          time: doc.data().name === 'Kofi' ? '10:30 AM' : null,
          mood: doc.data().name === 'Kofi' ? '😊' : '⏳'
        });
      });
      
      setFamilyMembers(membersList);
      console.log('Family members loaded:', membersList);
    } catch (error) {
      console.error('Error loading family members:', error);
    }
  };

  const loadStats = async (userId: string) => {
    try {
      const membersRef = collection(db, 'users', userId, 'familyMembers');
      const membersSnap = await getDocs(membersRef);
      const totalMembers = membersSnap.size;
      
      const respondedToday = membersSnap.docs.filter(doc => 
        doc.data().name === 'Kofi' || doc.data().name === 'Auntie Mercy'
      ).length;
      
      const pendingResponses = totalMembers - respondedToday;
      
      setStats({
        totalMembers,
        respondedToday,
        pendingResponses
      });
      
      console.log('Stats loaded:', { totalMembers, respondedToday, pendingResponses });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadRecentActivity = async (userId: string) => {
    try {
      const responsesRef = collection(db, 'users', userId, 'responses');
      const responsesSnap = await getDocs(responsesRef);
      
      const activityList: any[] = [];
      responsesSnap.forEach((doc) => {
        const data = doc.data();
        activityList.push({
          id: doc.id,
          memberName: data.memberName,
          response: data.response,
          timestamp: data.timestamp?.toDate?.() || new Date(),
          type: data.type
        });
      });
      
      activityList.sort((a, b) => b.timestamp - a.timestamp);
      setRecentActivity(activityList.slice(0, 5));
      console.log('Recent activity loaded:', activityList);
    } catch (error) {
      console.error('Error loading recent activity:', error);
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'yesterday';
    return `${diffDays} days ago`;
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary">Loading your dashboard...</p>
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
              className="w-full flex items-center space-x-3 px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium"
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
            <button 
              onClick={() => navigate('/family/responses')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors"
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

        {/* ===== USER PROFILE - NOW DYNAMIC ===== */}
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
          
          <div className="mb-8">
            <h1 className="text-3xl font-light text-primary mb-2">
              Hello, {userName} 👋
            </h1>
            <p className="text-secondary">
              Here's your family overview for today
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-card rounded-card p-6 shadow-sm">
              <p className="text-secondary text-sm mb-1">Total Members</p>
              <p className="text-3xl font-semibold text-primary">{stats.totalMembers}</p>
            </div>
            <div className="bg-card rounded-card p-6 shadow-sm">
              <p className="text-secondary text-sm mb-1">Responded Today</p>
              <div className="flex items-center space-x-2">
                <p className="text-3xl font-semibold text-green-600">{stats.respondedToday}</p>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="bg-card rounded-card p-6 shadow-sm">
              <p className="text-secondary text-sm mb-1">Pending</p>
              <div className="flex items-center space-x-2">
                <p className="text-3xl font-semibold text-orange-500">{stats.pendingResponses}</p>
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-primary">Your Family Members</h2>
              <button className="text-primary hover:underline text-sm flex items-center">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {familyMembers.map((member) => (
                <div key={member.id} className="bg-card rounded-card p-6 shadow-sm">
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

                  <div className="bg-background rounded-lg p-4 mb-4">
                    <p className="text-sm text-secondary mb-1">Latest response:</p>
                    <p className="text-primary">{member.latestResponse}</p>
                    {member.time && (
                      <p className="text-xs text-secondary mt-2">{member.time}</p>
                    )}
                  </div>

                  <button className="w-full flex items-center justify-center space-x-2 bg-primary/10 text-primary py-2 rounded-lg hover:bg-primary/20 transition-colors">
                    <Send className="w-4 h-4" />
                    <span>Send Question</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-primary mb-4">Recent Activity</h2>
            <div className="bg-card rounded-card p-6 shadow-sm">
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-sm text-secondary">
                        {activity.memberName} responded {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-secondary">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyDashboard;