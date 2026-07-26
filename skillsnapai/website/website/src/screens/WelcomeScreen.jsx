import React from 'react';

export default function WelcomeScreen({ onGetStarted }) {
  return (
    <div className="welcome-screen fade-in">
      <div className="welcome-content">
        {/* Top Section */}
        <div className="top-section">
          <img
            src="/assets/images/search.png"
            alt="Search Icon"
            className="search-img"
          />
          <h1 className="welcome-title">
            Start<br />Your<br />Career<br />Now
          </h1>
        </div>

        {/* Robot Image Section */}
        <div className="robot-container">
          <img
            src="/assets/images/robot.png"
            alt="Robot AI Guide"
            className="robot-img"
          />
        </div>

        {/* Get Started Button */}
        <div className="button-container">
          <button className="get-started-btn" onClick={onGetStarted}>
            Get Started →
          </button>
        </div>
      </div>

      <style>{`
        .welcome-screen {
          background-color: #8fb2e8;
          height: 100%;
          width: 100%;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
        }
        
        .welcome-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .top-section {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-top: 30px;
        }
        
        .search-img {
          height: 78px;
          width: 78px;
          object-fit: contain;
          animation: floatAnimation 3s infinite ease-in-out;
        }
        
        .welcome-title {
          font-size: 29px;
          font-weight: 800;
          line-height: 1.0;
          color: #ffffff;
          padding-top: 6px;
        }
        
        .robot-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 20px 0;
        }
        
        .robot-img {
          max-height: 380px;
          width: 100%;
          object-fit: contain;
          animation: robotFloat 4s infinite ease-in-out;
        }
        
        .button-container {
          margin-bottom: 12px;
        }
        
        .get-started-btn {
          width: 100%;
          height: 56px;
          border-radius: 30px;
          background-color: #4d8dff;
          color: #ffffff;
          border: none;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: 0 4px 14px rgba(77, 141, 255, 0.4);
        }
        
        .get-started-btn:hover {
          background-color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(77, 141, 255, 0.5);
        }
        
        .get-started-btn:active {
          transform: translateY(0);
        }
        
        @keyframes floatAnimation {
          0% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }
        
        @keyframes robotFloat {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
