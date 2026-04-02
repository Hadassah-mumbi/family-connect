import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home,
  Bookmark,
  Clock,
  Settings as SettingsIcon,
  Mic,
  Send,
  SkipForward,
  Check
} from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';

// Declare SpeechRecognition for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const DailyQuestion: React.FC = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [responseSent, setResponseSent] = useState(false);
  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [elderlyData, setElderlyData] = useState<any>(null);
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [elderlyId, setElderlyId] = useState<string | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [recognition, setRecognition] = useState<any>(null);

  // Helper: Get today's date as string (YYYY-MM-DD)
  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Helper: Get the key for tracking today's question
  const getTrackingKey = () => {
    return `daily_question_${familyId}_${memberId}`;
  };

  // 🆕 Save skipped question to Firestore
  const saveSkippedQuestion = async () => {
    if (!question || !familyId || !memberId) return;

    try {
      const savedRef = collection(db, 'users', familyId, 'familyMembers', memberId, 'saved_questions');
      
      await addDoc(savedRef, {
        questionId: question.id,
        questionText: question.text,
        category: question.category,
        savedAt: new Date(),
        fromDate: getTodayString(),
        originalOrder: question.createdAt || null
      });
      
      console.log('Question saved for later:', question.text);
    } catch (error) {
      console.error('Error saving question for later:', error);
    }
  };

  // Load today's question from localStorage or pick next in order
  const loadTodaysQuestion = async (questionsList: any[]) => {
    if (questionsList.length === 0) {
      setQuestion(null);
      return;
    }

    const today = getTodayString();
    const trackingKey = getTrackingKey();
    
    // Check localStorage for today's question
    const stored = localStorage.getItem(trackingKey);
    
    if (stored) {
      const parsed = JSON.parse(stored);
      
      // If it's from today, use it
      if (parsed.date === today && parsed.questionId) {
        const foundQuestion = questionsList.find(q => q.id === parsed.questionId);
        if (foundQuestion) {
          console.log('Loading today\'s question from localStorage:', foundQuestion.text);
          setQuestion(foundQuestion);
          return;
        }
      }
    }
    
    // No question for today yet — pick next in order (FIFO)
    // Get the last shown index from localStorage
    const lastIndexKey = `last_question_index_${familyId}_${memberId}`;
    const lastIndexStored = localStorage.getItem(lastIndexKey);
    let nextIndex = 0;
    
    if (lastIndexStored) {
      const lastIndex = parseInt(lastIndexStored, 10);
      nextIndex = (lastIndex + 1) % questionsList.length;
    }
    
    const nextQuestion = questionsList[nextIndex];
    
    // Save to localStorage
    localStorage.setItem(trackingKey, JSON.stringify({
      questionId: nextQuestion.id,
      date: today,
      index: nextIndex
    }));
    
    // Save the last index for next time
    localStorage.setItem(lastIndexKey, nextIndex.toString());
    
    console.log('New question for today (FIFO order):', nextQuestion.text);
    setQuestion(nextQuestion);
  };

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
        handleSendResponse('voice', transcript);
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
        setElderlyId(elderly.id);
        setMemberId(elderly.memberId);
        setFamilyId(elderly.familyId);
        
        if (elderly.memberId) {
          await loadElderlyQuestions(elderly.familyId, elderly.id, elderly.memberId);
        } else {
          console.error('No memberId found for elderly user');
          setQuestion(null);
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

  // Load questions for this specific elderly person
  const loadElderlyQuestions = async (famId: string, eldId: string, memId: string) => {
    try {
      const questionsRef = collection(db, 'users', famId, 'familyMembers', memId, 'questions');
      const questionsSnap = await getDocs(questionsRef);
      
      const questionsList: any[] = [];
      questionsSnap.forEach((doc) => {
        const data = doc.data();
        questionsList.push({
          id: doc.id,
          text: data.text || '',
          category: data.category || 'General',
          usedCount: data.usedCount || 0,
          favorite: data.favorite || false,
          createdAt: data.createdAt || new Date().toISOString()
        });
      });
      
      // Sort by createdAt (oldest first) for FIFO
      questionsList.sort((a, b) => {
        if (a.createdAt < b.createdAt) return -1;
        if (a.createdAt > b.createdAt) return 1;
        return 0;
      });
      
      setAllQuestions(questionsList);
      
      // Use FIFO logic instead of random
      await loadTodaysQuestion(questionsList);
      
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const handleSendResponse = async (responseType: string, responseContent: string) => {
    if (!elderlyId || !familyId || !elderlyData || !memberId) return;

    try {
      const responsesRef = collection(db, 'users', familyId, 'familyMembers', memberId, 'responses');
      
      const responseData = {
        memberName: elderlyData.name,
        memberId: elderlyId,
        relationship: elderlyData.relationship || 'Family Member',
        question: question?.text || "No question",
        response: responseContent,
        type: responseType,
        timestamp: new Date(),
        questionId: question?.id
      };

      await addDoc(responsesRef, responseData);
      
      setResponseSent(true);
      setTimeout(() => setResponseSent(false), 2000);
      
      console.log('Response saved:', responseData);
    } catch (error) {
      console.error('Error saving response:', error);
    }
  };

  // 🆕 Handle skip (save question for later, then move to next day)
  const handleSkip = async () => {
    await saveSkippedQuestion();
    // Clear today's question so a new one loads tomorrow
    const trackingKey = getTrackingKey();
    localStorage.removeItem(trackingKey);
    navigate('/elderly/saved');
  };

  // 🆕 Handle save for later (same as skip for now)
  const handleSaveLater = async () => {
    await saveSkippedQuestion();
    const trackingKey = getTrackingKey();
    localStorage.removeItem(trackingKey);
    navigate('/elderly/saved');
  };

  // Handle voice recording
  const startVoiceRecording = () => {
    if (recognition) {
      setIsRecording(true);
      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser. Please use text input instead.');
    }
  };

  // Handle text send
  const handleTextSend = () => {
    if (textInput.trim()) {
      handleSendResponse('text', textInput);
      setTextInput('');
      setShowTextInput(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary">Loading your questions...</p>
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
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          
          {/* Welcome Message */}
          <div className="text-center mb-4">
            <p className="text-xl text-primary">
              Hello, {elderlyData?.name} 👋
            </p>
          </div>

          {/* Question Card */}
          <div className="bg-card rounded-card shadow-xl p-8 mb-6">
            
            {/* Date */}
            <p className="text-secondary text-center mb-4">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>

            {/* Question */}
            {question ? (
              <h2 className="text-4xl font-light text-primary text-center mb-8 leading-relaxed">
                {question.text}
              </h2>
            ) : (
              <div className="text-center mb-8">
                <p className="text-2xl text-secondary">No questions available</p>
                <p className="text-secondary mt-2">Your family hasn't added any questions for you yet.</p>
              </div>
            )}

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

            {/* Text Input (when shown) */}
            {showTextInput && (
              <div className="mb-6">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg text-xl focus:outline-none focus:border-primary"
                  autoFocus
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={handleTextSend}
                    disabled={!textInput.trim()}
                    className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-300 flex items-center justify-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Send</span>
                  </button>
                  <button
                    onClick={() => setShowTextInput(false)}
                    className="flex-1 bg-gray-200 text-secondary py-3 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Response Options - Large Buttons */}
            {question && (
              <div className="space-y-4">
                
                {/* Voice Button */}
                <button
                  onClick={startVoiceRecording}
                  disabled={isRecording}
                  className={`w-full py-6 text-2xl font-semibold rounded-2xl flex items-center justify-center space-x-4 transition-all
                    ${isRecording 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                >
                  <Mic className="w-8 h-8" />
                  <span>🎤 Record Voice</span>
                </button>

                {/* Text Button */}
                <button
                  onClick={() => setShowTextInput(true)}
                  className="w-full py-6 bg-white text-primary text-2xl font-semibold rounded-2xl border-2 border-primary hover:bg-primary/5 transition-colors flex items-center justify-center space-x-4"
                >
                  <span>✏️</span>
                  <span>Type Answer</span>
                </button>

                {/* Action Row - Skip and Save */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button
                    onClick={handleSkip}
                    className="py-4 bg-gray-200 text-secondary text-xl font-medium rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
                  >
                    <SkipForward className="w-5 h-5" />
                    <span>Skip</span>
                  </button>
                  <button
                    onClick={handleSaveLater}
                    className="py-4 bg-gray-200 text-secondary text-xl font-medium rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Bookmark className="w-5 h-5" />
                    <span>Save for Later</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="bg-card rounded-full shadow-lg p-2 flex justify-around">
            <button 
              onClick={() => navigate('/elderly/daily-question')}
              className="flex-1 py-3 bg-primary/10 text-primary rounded-full flex items-center justify-center space-x-2"
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
              className="flex-1 py-3 text-secondary hover:bg-gray-50 rounded-full flex items-center justify-center space-x-2"
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

export default DailyQuestion;