import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home,
  BookOpen,
  Clock,
  Settings as SettingsIcon,
  Mic,
  MicOff,
  Send,
  SkipForward,
  Bookmark,
  Check,
  Smile,
  Frown,
  Meh,
  Heart,
  ThumbsUp
} from 'lucide-react';

const DailyQuestion: React.FC = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [responseSent, setResponseSent] = useState(false);

  // Mock question - in real app, this comes from backend
  const todaysQuestion = {
    question: "How are you feeling today?",
    date: "Thursday, March 5, 2026"
  };

  // Handle voice recording
  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording and send
      setIsRecording(false);
      setResponseSent(true);
      setTimeout(() => setResponseSent(false), 2000);
    } else {
      setIsRecording(true);
      // Auto-stop after 30 seconds
      setTimeout(() => {
        setIsRecording(false);
        setResponseSent(true);
        setTimeout(() => setResponseSent(false), 2000);
      }, 30000);
    }
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    console.log('Selected emoji:', emoji);
    setShowEmojis(false);
    setResponseSent(true);
    setTimeout(() => setResponseSent(false), 2000);
  };

  // Handle text send
  const handleTextSend = () => {
    if (textInput.trim()) {
      console.log('Text response:', textInput);
      setTextInput('');
      setShowTextInput(false);
      setResponseSent(true);
      setTimeout(() => setResponseSent(false), 2000);
    }
  };

  // Handle skip
  const handleSkip = () => {
    navigate('/elderly/saved');
  };

  // Handle save for later
  const handleSaveLater = () => {
    navigate('/elderly/saved');
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
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          
          {/* Question Card */}
          <div className="bg-card rounded-card shadow-xl p-8 mb-6">
            
            {/* Date */}
            <p className="text-secondary text-center mb-4">
              {todaysQuestion.date}
            </p>

            {/* Question */}
            <h2 className="text-4xl font-light text-primary text-center mb-8 leading-relaxed">
              {todaysQuestion.question}
            </h2>

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
                <p className="text-red-600 text-lg font-medium">Recording... Speak now</p>
                <p className="text-red-400 text-sm mt-2">Click microphone to stop</p>
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

            {/* Emoji Picker (when shown) */}
            {showEmojis && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-center text-secondary mb-4">How are you feeling?</p>
                <div className="grid grid-cols-5 gap-4">
                  <button
                    onClick={() => handleEmojiSelect('😊')}
                    className="text-4xl hover:bg-gray-200 p-2 rounded-lg transition-colors"
                  >
                    😊
                  </button>
                  <button
                    onClick={() => handleEmojiSelect('😐')}
                    className="text-4xl hover:bg-gray-200 p-2 rounded-lg transition-colors"
                  >
                    😐
                  </button>
                  <button
                    onClick={() => handleEmojiSelect('😢')}
                    className="text-4xl hover:bg-gray-200 p-2 rounded-lg transition-colors"
                  >
                    😢
                  </button>
                  <button
                    onClick={() => handleEmojiSelect('❤️')}
                    className="text-4xl hover:bg-gray-200 p-2 rounded-lg transition-colors"
                  >
                    ❤️
                  </button>
                  <button
                    onClick={() => handleEmojiSelect('👍')}
                    className="text-4xl hover:bg-gray-200 p-2 rounded-lg transition-colors"
                  >
                    👍
                  </button>
                </div>
              </div>
            )}

            {/* Response Options - Large Buttons */}
            <div className="space-y-4">
              
              {/* Voice Button */}
              <button
                onClick={toggleRecording}
                className={`w-full py-6 text-2xl font-semibold rounded-2xl flex items-center justify-center space-x-4 transition-all
                  ${isRecording 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-primary text-white hover:bg-primary/90'
                  }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-8 h-8" />
                    <span>Stop Recording</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-8 h-8" />
                    <span>🎤 Record Voice</span>
                  </>
                )}
              </button>

              {/* Text Button */}
              <button
                onClick={() => setShowTextInput(true)}
                className="w-full py-6 bg-white text-primary text-2xl font-semibold rounded-2xl border-2 border-primary hover:bg-primary/5 transition-colors flex items-center justify-center space-x-4"
              >
                <span>✏️</span>
                <span>Type Answer</span>
              </button>

              {/* Emoji Button */}
              <button
                onClick={() => setShowEmojis(!showEmojis)}
                className="w-full py-6 bg-white text-primary text-2xl font-semibold rounded-2xl border-2 border-primary hover:bg-primary/5 transition-colors flex items-center justify-center space-x-4"
              >
                <span>😊</span>
                <span>Choose Emoji</span>
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