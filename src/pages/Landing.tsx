import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {/* Main Card */}
      <div className="w-full max-w-4xl bg-card rounded-card shadow-xl p-12">
        
        {/* Logo & Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light text-primary mb-4">
            Family Connect
          </h1>
          <p className="text-xl text-secondary">
            Stay connected with the ones you love
          </p>
        </div>

        {/* Two Column Layout for User Types */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          
          {/* Family Member Card */}
          <div 
            onClick={() => navigate('/family/login')}
            className="bg-background rounded-card p-8 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-semibold text-primary mb-3">
                Family Member
              </h2>
              <p className="text-secondary text-lg mb-6">
                Send daily questions, view responses, and stay connected
              </p>
              <button className="bg-primary text-white px-8 py-3 rounded-button text-lg font-medium hover:bg-primary/90 transition-colors">
                Continue as Family
              </button>
            </div>
          </div>

          {/* Elderly User Card */}
          <div 
            onClick={() => navigate('/elderly/login')}
            className="bg-background rounded-card p-8 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Heart className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-semibold text-primary mb-3">
                Elderly User
              </h2>
              <p className="text-secondary text-lg mb-6">
                Answer daily questions with simple voice, text, or emoji
              </p>
              <button className="bg-primary text-white px-8 py-3 rounded-button text-lg font-medium hover:bg-primary/90 transition-colors">
                Continue as Elderly
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-secondary text-sm">
          Secure • Private • Family-Centered
        </p>
      </div>
    </div>
  );
};

// THIS LINE IS IMPORTANT — it exports the component so other files can use it
export default Landing;