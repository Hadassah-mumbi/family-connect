import React, { useState, useEffect } from 'react';
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
  Smile,
  User
} from 'lucide-react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

// Define types
interface Member {
  id: string;
  name: string;
  relationship: string;
}

interface Question {
  id: string;
  text: string;
  category: string;
  usedCount?: number;
  favorite?: boolean;
  createdAt?: string;
}

const QuestionBank: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [familyMembers, setFamilyMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [userName, setUserName] = useState('Family Member');
  const [userInitial, setUserInitial] = useState('U');
  // Modal state for new question
  const [showModal, setShowModal] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionCategory, setNewQuestionCategory] = useState('Mood');
  const [saving, setSaving] = useState(false);

  // Modal state for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);

  // Edit state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [editText, setEditText] = useState('');
  const [editCategory, setEditCategory] = useState('Mood');
  const [updating, setUpdating] = useState(false);

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
  // Load user and family members
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await loadFamilyMembers(user.uid);
      } else {
        navigate('/family/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  // Load family members (elderly users)
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
      
      setFamilyMembers(membersList);
      
      // Auto-select first member if available
      if (membersList.length > 0) {
        setSelectedMember(membersList[0].id);
      }
      
      console.log('Family members loaded:', membersList);
    } catch (error) {
      console.error('Error loading family members:', error);
    }
  };

  // Load questions for selected elderly member
  useEffect(() => {
    if (userId && selectedMember) {
      loadQuestions(userId, selectedMember);
    }
  }, [userId, selectedMember]);

  const loadQuestions = async (uid: string, memberId: string) => {
    try {
      setLoading(true);
      const questionsRef = collection(db, 'users', uid, 'familyMembers', memberId, 'questions');
      const questionsSnap = await getDocs(questionsRef);
      
      const questionsList: Question[] = [];
      questionsSnap.forEach((doc) => {
        questionsList.push({
          id: doc.id,
          ...doc.data() as Omit<Question, 'id'>
        });
      });
      
      setQuestions(questionsList);
      console.log(`Questions loaded for member ${memberId}:`, questionsList);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuestion = async () => {
    if (!newQuestionText.trim()) {
      alert('Please enter a question');
      return;
    }
    if (!selectedMember) {
      alert('Please select a family member');
      return;
    }

    setSaving(true);
    
    try {
      const questionsRef = collection(db, 'users', userId!, 'familyMembers', selectedMember, 'questions');
      await addDoc(questionsRef, {
        text: newQuestionText,
        category: newQuestionCategory,
        createdAt: new Date().toISOString(),
        usedCount: 0,
        favorite: false
      });
      
      // Refresh questions list
      await loadQuestions(userId!, selectedMember);
      
      // Close modal and reset form
      setShowModal(false);
      setNewQuestionText('');
      setNewQuestionCategory('Mood');
      
      console.log('Question saved successfully!');
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Failed to save question. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (question: Question) => {
    setQuestionToDelete(question);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!questionToDelete || !userId || !selectedMember) return;
    
    try {
      const questionRef = doc(db, 'users', userId!, 'familyMembers', selectedMember, 'questions', questionToDelete.id);
      await deleteDoc(questionRef);
      
      // Remove from local state
      setQuestions(questions.filter(q => q.id !== questionToDelete.id));
      setShowDeleteModal(false);
      setQuestionToDelete(null);
      
      console.log('Question deleted successfully');
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Failed to delete question');
    }
  };

  const handleEditClick = (question: Question) => {
    setEditQuestion(question);
    setEditText(question.text);
    setEditCategory(question.category);
    setShowEditModal(true);
  };

  const handleUpdateQuestion = async () => {
    if (!editText.trim() || !editQuestion || !userId || !selectedMember) return;

    setUpdating(true);
    
    try {
      const questionRef = doc(db, 'users', userId!, 'familyMembers', selectedMember, 'questions', editQuestion.id);
      await updateDoc(questionRef, {
        text: editText,
        category: editCategory
      });
      
      // Update local state
      setQuestions(questions.map(q => 
        q.id === editQuestion.id 
          ? { ...q, text: editText, category: editCategory }
          : q
      ));
      
      // Close modal
      setShowEditModal(false);
      setEditQuestion(null);
      
      console.log('Question updated successfully');
    } catch (error) {
      console.error('Error updating question:', error);
      alert('Failed to update question');
    } finally {
      setUpdating(false);
    }
  };

  // Filter questions based on search and category
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.text?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
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

  // Get member name by ID
  const getSelectedMemberName = () => {
    const member = familyMembers.find(m => m.id === selectedMember);
    return member ? member.name : 'Select a member';
  };

  // Show loading state
  if (loading && !familyMembers.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary">Loading...</p>
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
              className="w-full flex items-center space-x-3 px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium"
            >
              <BookOpen className="w-5 h-5" />
              <span>Question Bank</span>
            </button>
           {/* <button 
              onClick={() => navigate('/family/schedule')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Calendar className="w-5 h-5" />
              <span>Schedule</span>
            </button> */}
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-light text-primary mb-2">
                Question Bank
              </h1>
              <p className="text-secondary">
                Create and manage questions for each family member
              </p>
            </div>
          </div>

          {/* Member Tabs */}
          {familyMembers.length > 0 ? (
            <div className="mb-8 border-b border-gray-200">
              <div className="flex space-x-1">
                {familyMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => setSelectedMember(member.id)}
                    className={`px-6 py-3 text-lg font-medium rounded-t-lg transition-colors flex items-center space-x-2
                      ${selectedMember === member.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-secondary hover:bg-gray-200'
                      }`}
                  >
                    <User className="w-5 h-5" />
                    <span>{member.name}</span>
                    <span className="text-sm opacity-75">({member.relationship})</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-700">
                No family members found. Please add members first.
              </p>
            </div>
          )}

          {selectedMember && (
            <>
              {/* Header with New Question Button */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-light text-primary">
                  Questions for {getSelectedMemberName()}
                </h2>
                
                {/* New Question Button */}
                <button 
                  onClick={() => setShowModal(true)}
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
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-secondary">Loading questions...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((question) => (
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
                            <button 
                              onClick={() => handleEditClick(question)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              <Edit2 className="w-4 h-4 text-secondary" />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(question)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </div>

                        {/* Question Text */}
                        <p className="text-primary text-lg mb-3">{question.text}</p>

                        {/* Last Used */}
                        <p className="text-xs text-secondary">
                          Last used: {question.usedCount ? `${question.usedCount} times` : 'Never'}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12 bg-card rounded-card">
                      <p className="text-secondary text-lg">No questions found for {getSelectedMemberName()}</p>
                      <p className="text-secondary text-sm mt-2">Click "New Question" to add one</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {!selectedMember && familyMembers.length > 0 && (
            <div className="text-center py-12 bg-card rounded-card">
              <p className="text-secondary text-lg">Please select a family member above</p>
            </div>
          )}
        </div>
      </div>

      {/* New Question Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-card max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-light text-primary">
                New Question for {getSelectedMemberName()}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <span className="text-2xl text-secondary hover:text-primary">×</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Question</label>
                <textarea
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Enter your question..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  rows={3}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {['Mood', 'Health', 'Memory', 'Daily'].map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setNewQuestionCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                        ${newQuestionCategory === category 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-secondary hover:bg-gray-200'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSaveQuestion}
                  disabled={saving || !selectedMember}
                  className="flex-1 bg-primary text-white py-3 rounded-button hover:bg-primary/90 transition-colors disabled:bg-gray-300"
                >
                  {saving ? 'Saving...' : 'Save Question'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 text-secondary py-3 rounded-button hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && questionToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-card max-w-md w-full p-6">
            <div className="flex items-center space-x-2 text-red-500 mb-4">
              <Trash2 className="w-6 h-6" />
              <h2 className="text-2xl font-light">Delete Question</h2>
            </div>

            <p className="text-secondary mb-2">
              Are you sure you want to delete this question?
            </p>
            <p className="text-primary font-medium mb-6">
              "{questionToDelete.text}"
            </p>
            <p className="text-sm text-red-500 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 text-white py-3 rounded-button hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setQuestionToDelete(null);
                }}
                className="flex-1 bg-gray-100 text-secondary py-3 rounded-button hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Question Modal */}
      {showEditModal && editQuestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-card max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-light text-primary">Edit Question</h2>
              <button onClick={() => setShowEditModal(false)}>
                <span className="text-2xl text-secondary hover:text-primary">×</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Question</label>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Enter your question..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  rows={3}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {['Mood', 'Health', 'Memory', 'Daily'].map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setEditCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                        ${editCategory === category 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-secondary hover:bg-gray-200'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleUpdateQuestion}
                  disabled={updating}
                  className="flex-1 bg-primary text-white py-3 rounded-button hover:bg-primary/90 transition-colors disabled:bg-gray-300"
                >
                  {updating ? 'Updating...' : 'Update Question'}
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-100 text-secondary py-3 rounded-button hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;