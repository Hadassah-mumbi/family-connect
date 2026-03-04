import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home,
  Bookmark,
  Clock,
  Settings as SettingsIcon,
  Mic,
  Send,
  Calendar,
  ChevronRight,
  Check
} from 'lucide-react';

const SavedForLater: React.FC = () => {
  const navigate = useNavigate();
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [showResponseOptions, setShowResponseOptions] = useState(false);
  const [responseSent, setResponseSent] = useState(false);

  // Mock saved questions
  const savedQuestions = [
    {
      id: 1,
      question: "What's a happy memory from your childhood?",
      savedDate: "Mar 4, 2026",
      category: "Memory"
    },
    {
      id: 2,
      question: "Did you take your medicine today?",
      savedDate: "Mar 3, 2026",
      category: "Health"
    },
    {
      id: 3,
      question: "What would you like for dinner?",
      savedDate: "Mar 2, 2026",
      category: "Daily"
    },
    {
      id: 4,
      question: "Tell me about your favorite song",
      savedDate: "Mar 1, 2026",
      category: "Memory"
    }
  ];

  const handleQuestionClick = (id: number) => {
    setSelectedQuestion(id);
    setShowResponseOptions(true);
  };

  const handleVoiceResponse = () => {
    setShowResponseOptions(false);
    setSelectedQuestion(null);
    setResponseSent(true);
    setTimeout(() => setResponseSent(false), 2000);
  };

  const handleTextResponse = () => {
    setShowResponseOptions(false);
    setSelectedQuestion(null);
    setResponseSent(true);
    setTimeout(() => setResponseSent(false), 2000);
  };

  const handleEmojiResponse = () => {
    setShowResponseOptions(false);
    setSelectedQuestion(null);
    setResponseSent(true);
    setTimeout(() => setResponseSent(false), 2000);
  };

  const handleRemove = (id: number) => {
    // In real app, remove from saved list
    console.log('Remove question:', id);
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

          {/* Response Options Modal */}
          {showResponseOptions && (
            <div className="fixed inset-0 bg-black/50 flex items-end justify-center p-4 z-50">
              <div className="bg-card rounded-t-3xl w-full max-w-lg p-6 animate-slide-up">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-light text-primary mb-2">How would you like to respond?</h3>
                  <p className="text-secondary">Choose a response type</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleVoiceResponse}
                    className="w-full py-6 bg-primary text-white text-xl font-semibold rounded-2xl hover:bg-primary/90 transition-colors flex items-center justify-center space-x-4"
                  >
                    <Mic className="w-8 h-8" />
                    <span>🎤 Record Voice</span>
                  </button>

                  <button
                    onClick={handleTextResponse}
                    className="w-full py-6 bg-white text-primary text-xl font-semibold rounded-2xl border-2 border-primary hover:bg-primary/5 transition-colors flex items-center justify-center space-x-4"
                  >
                    <span>✏️</span>
                    <span>Type Answer</span>
                  </button>

                  <button
                    onClick={handleEmojiResponse}
                    className="w-full py-6 bg-white text-primary text-xl font-semibold rounded-2xl border-2 border-primary hover:bg-primary/5 transition-colors flex items-center justify-center space-x-4"
                  >
                    <span>😊</span>
                    <span>Choose Emoji</span>
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
            {savedQuestions.map((question) => (
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
                    {question.savedDate}
                  </span>
                </div>

                {/* Question */}
                <p className="text-2xl text-primary mb-4 leading-relaxed">
                  {question.question}
                </p>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleQuestionClick(question.id)}
                    className="flex-1 bg-primary text-white py-4 rounded-xl hover:bg-primary/90 transition-colors text-lg font-medium"
                  >
                    Answer Now
                  </button>
                  <button
                    onClick={() => handleRemove(question.id)}
                    className="px-6 bg-gray-200 text-secondary rounded-xl hover:bg-gray-300 transition-colors text-lg"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {savedQuestions.length === 0 && (
            <div className="text-center py-12">
              <Bookmark className="w-16 h-16 text-secondary mx-auto mb-4" />
              <p className="text-secondary text-lg">No saved questions</p>
              <p className="text-secondary text-sm mt-2">Questions you skip will appear here</p>
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