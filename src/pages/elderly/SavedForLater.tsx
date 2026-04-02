import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home,
  Bookmark,
  Clock,
  Settings as SettingsIcon,
  Mic,
  Send,
  Calendar,
  Check,
  X
} from 'lucide-react';
import { db } from '../../firebase/config';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy
} from 'firebase/firestore';

// Define SavedQuestion type
interface SavedQuestion {
  id: string;
  questionId: string;
  questionText: string;
  category: string;
  savedAt: any;
  fromDate: string;
}

const SavedForLater: React.FC = () => {
  const navigate = useNavigate();
  const [savedQuestions, setSavedQuestions] = useState<SavedQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<SavedQuestion | null>(null);
  const [showResponseOptions, setShowResponseOptions] = useState(false);
  const [responseSent, setResponseSent] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [elderlyData, setElderlyData] = useState<any>(null);
  const [recognition, setRecognition] = useState<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = 'en-US';
      recognitionInstance.interimResults = false;
      recognitionInstance.maxAlternatives = 1;
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Transcript:', transcript);
        handleAnswerQuestion('voice', transcript);
        setIsRecording(false);
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        alert('Sorry, I couldn\'t hear you. Please try again or type your answer.');
        setIsRecording(false);
      };
      
      recognitionInstance.onend = () => {
        setIsRecording(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  // Load elderly user data from localStorage
  useEffect(() => {
    const loadElderlyUser = async () => {
      try {
        const storedElderly = localStorage.getItem('elderlyUser');
        
        if (!storedElderly) {
          navigate('/elderly/login');
          return;
        }

        const elderly = JSON.parse(storedElderly);
        console.log('Logged in elderly user:', elderly);
        
        setElderlyData(elderly);
        setMemberId(elderly.memberId);
        setFamilyId(elderly.familyId);
        
        if (elderly.memberId && elderly.familyId) {
          await loadSavedQuestions(elderly.familyId, elderly.memberId);
        }
        
      } catch (error) {
        console.error('Error loading elderly user:', error);
        navigate('/elderly/login');
      } finally {
        setLoading(false);
      }
    };

    loadElderlyUser();
  }, [navigate]);

  // Load saved questions from Firestore
  const loadSavedQuestions = async (famId: string, memId: string) => {
    try {
      const savedRef = collection(db, 'users', famId, 'familyMembers', memId, 'saved_questions');
      const q = query(savedRef, orderBy('savedAt', 'desc'));
      const savedSnap = await getDocs(q);
      
      const questionsList: SavedQuestion[] = [];
      savedSnap.forEach((doc) => {
        const data = doc.data();
        questionsList.push({
          id: doc.id,
          questionId: data.questionId,
          questionText: data.questionText,
          category: data.category || 'General',
          savedAt: data.savedAt,
          fromDate: data.fromDate
        });
      });
      
      setSavedQuestions(questionsList);
      console.log('Saved questions loaded:', questionsList.length);
    } catch (error) {
      console.error('Error loading saved questions:', error);
    }
  };

  // Handle answering a saved question
  const handleAnswerQuestion = async (responseType: string, responseContent: string) => {
    if (!familyId || !memberId || !elderlyData || !selectedQuestion) return;

    try {
      // Save response to responses collection
      const responsesRef = collection(db, 'users', familyId, 'familyMembers', memberId, 'responses');
      
      const responseData = {
        memberName: elderlyData.name,
        memberId: elderlyData.id,
        relationship: elderlyData.relationship || 'Family Member',
        question: selectedQuestion.questionText,
        response: responseContent,
        type: responseType,
        timestamp: new Date(),
        questionId: selectedQuestion.questionId
      };

      await addDoc(responsesRef, responseData);
      
      // Delete the saved question
      const savedDocRef = doc(db, 'users', familyId, 'familyMembers', memberId, 'saved_questions', selectedQuestion.id);
      await deleteDoc(savedDocRef);
      
      // Remove from local state
      setSavedQuestions(savedQuestions.filter(q => q.id !== selectedQuestion.id));
      
      setResponseSent(true);
      setTimeout(() => setResponseSent(false), 2000);
      
      console.log('Answer saved and removed from saved list');
    } catch (error) {
      console.error('Error answering saved question:', error);
      alert('Failed to save answer. Please try again.');
    } finally {
      setShowResponseOptions(false);
      setSelectedQuestion(null);
      setShowTextInput(false);
      setTextInput('');
    }
  };

  // Handle remove (delete saved question without answering)
  const handleRemove = async (question: SavedQuestion) => {
    if (!familyId || !memberId) return;
    
    try {
      const savedDocRef = doc(db, 'users', familyId, 'familyMembers', memberId, 'saved_questions', question.id);
      await deleteDoc(savedDocRef);
      
      // Remove from local state
      setSavedQuestions(savedQuestions.filter(q => q.id !== question.id));
      
      console.log('Saved question removed:', question.questionText);
    } catch (error) {
      console.error('Error removing saved question:', error);
      alert('Failed to remove question. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Handle text send from modal
  const handleTextSend = () => {
    if (textInput.trim() && selectedQuestion) {
      handleAnswerQuestion('text', textInput);
      setTextInput('');
      setShowTextInput(false);
    }
  };

  // Start voice recording
  const startVoiceRecording = () => {
    if (recognition) {
      setIsRecording(true);
      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser. Please use text input instead.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary">Loading saved questions...</p>
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
            <h2 className="text-3xl font-light text-primary mb-2">Saved for Later</h2>
            <p className="text-secondary">Questions you skipped — answer them anytime</p>
          </div>

          {/* Success Message */}
          {responseSent && (
            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6 flex items-center justify-center space-x-2 animate-pulse">
              <Check className="w-6 h-6" />
              <span className="text-lg">Response sent! Thank you.</span>
            </div>
          )}

          {/* Voice Recording Indicator */}
          {isRecording && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-6 text-center animate-pulse">
              <Mic className="w-12 h-12 text-red-500 mx-auto mb-2" />
              <p className="text-red-600 text-lg font-medium">Listening... Speak now</p>
              <p className="text-red-400 text-sm mt-2">Your words will be converted to text</p>
            </div>
          )}

          {/* Text Input Modal */}
          {showTextInput && selectedQuestion && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-card rounded-card max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-light text-primary">Type Your Answer</h2>
                  <button onClick={() => setShowTextInput(false)}>
                    <X className="w-6 h-6 text-secondary hover:text-primary" />
                  </button>
                </div>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg text-xl focus:outline-none focus:border-primary"
                  autoFocus
                />
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={handleTextSend}
                    disabled={!textInput.trim()}
                    className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-300"
                  >
                    Send
                  </button>
                  <button
                    onClick={() => setShowTextInput(false)}
                    className="flex-1 bg-gray-200 text-secondary py-3 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Response Options Modal */}
          {showResponseOptions && selectedQuestion && (
            <div className="fixed inset-0 bg-black/50 flex items-end justify-center p-4 z-50">
              <div className="bg-card rounded-t-3xl w-full max-w-lg p-6 animate-slide-up">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-light text-primary mb-2">How would you like to respond?</h3>
                  <p className="text-secondary">Choose a response type</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={startVoiceRecording}
                    disabled={isRecording}
                    className={`w-full py-6 text-xl font-semibold rounded-2xl flex items-center justify-center space-x-4 transition-all
                      ${isRecording 
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : 'bg-primary text-white hover:bg-primary/90'
                      }`}
                  >
                    <Mic className="w-8 h-8" />
                    <span>🎤 Record Voice</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowResponseOptions(false);
                      setShowTextInput(true);
                    }}
                    className="w-full py-6 bg-white text-primary text-xl font-semibold rounded-2xl border-2 border-primary hover:bg-primary/5 transition-colors flex items-center justify-center space-x-4"
                  >
                    <span>✏️</span>
                    <span>Type Answer</span>
                  </button>

                  <button
                    onClick={() => setShowResponseOptions(false)}
                    className="w-full py-4 text-secondary hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Saved Questions List */}
          <div className="space-y-4">
            {savedQuestions.length > 0 ? (
              savedQuestions.map((question) => (
                <div 
                  key={question.id}
                  className="bg-card rounded-card p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    {/* Category Badge */}
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {question.category}
                    </span>
                    
                    {/* Saved Date */}
                    <span className="text-xs text-secondary flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      Saved on {formatDate(question.savedAt)}
                    </span>
                  </div>

                  {/* Question */}
                  <p className="text-2xl text-primary mb-4 leading-relaxed">
                    {question.questionText}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setSelectedQuestion(question);
                        setShowResponseOptions(true);
                      }}
                      className="flex-1 bg-primary text-white py-4 rounded-xl hover:bg-primary/90 transition-colors text-lg font-medium"
                    >
                      Answer Now
                    </button>
                    <button
                      onClick={() => handleRemove(question)}
                      className="px-6 bg-gray-200 text-secondary rounded-xl hover:bg-gray-300 transition-colors text-lg"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Bookmark className="w-16 h-16 text-secondary mx-auto mb-4" />
                <p className="text-secondary text-lg">No saved questions</p>
                <p className="text-secondary text-sm mt-2">Questions you skip will appear here</p>
              </div>
            )}
          </div>
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
              className="flex-1 py-3 bg-primary/10 text-primary rounded-full flex items-center justify-center space-x-2"
            >
              <Bookmark className="w-5 h-5" />
              <span className="text-sm">Saved</span>
            </button>
            <button 
              onClick={() => navigate('/elderly/history')}
              className="flex-1 py-3 text-secondary hover:bg-gray-50 rounded-full flex items-center justify-center space-x-2"
            >
              <Clock className="w-5 h-5" />
              <span className="text-sm">History</span>
            </button>
          </div>
        </div>
      </div>

      {/* CSS for animation */}
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SavedForLater;