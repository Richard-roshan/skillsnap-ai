import React, { useEffect } from 'react';

export default function SplashScreen({ onFinished }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinished();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div className="splash-screen fade-in">
      <div className="splash-content">
        <img
          src="/assets/images/logo.png"
          alt="SkillSnap AI Logo"
          className="splash-logo"
        />
        <div className="logo-text">
          <span className="grey">Skill</span>
          <span className="blue">Snap</span>
          <span className="indigo"> AI</span>
        </div>
      </div>

      <style>{`
        .splash-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
          background-color: #ffffff;
        }
        
        .splash-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }
        
        .splash-logo {
          height: 90px;
          object-fit: contain;
          animation: logoPulse 2s infinite ease-in-out;
        }
        
        .logo-text {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        
        .logo-text .grey { color: #757575; }
        .logo-text .blue { color: #3b82f6; }
        .logo-text .indigo { color: #4f46e5; }
        
        @keyframes logoPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
