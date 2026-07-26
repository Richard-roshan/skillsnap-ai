import React from 'react';
import { ChevronLeft, FileText, Shield, Award } from 'lucide-react';

export default function AboutAppScreen({ onBack, showToast }) {
  return (
    <div className="sub-screen AboutAppScreen fade-in">
      {/* App Bar */}
      <div className="app-bar">
        <button className="back-btn" onClick={onBack}>
          <ChevronLeft size={22} />
        </button>
        <h3 className="app-bar-title">About SkillSnap</h3>
        <div style={{ width: 22 }} /> {/* balance space */}
      </div>

      <div className="sub-screen-content">
        {/* Main Details Card */}
        <div className="card-premium about-main-card">
          <h4 className="app-name">SkillSnap</h4>
          <p className="app-description-text">
            AI-powered learning and career guidance app for students and job seekers.
          </p>
          <div className="version-info">
            <span>Version: 1.0.0</span>
            <span>Build: 1</span>
          </div>
        </div>

        {/* Legal Tiles */}
        <div className="legal-tiles-stack">
          <div className="legal-tile" onClick={() => showToast('Showing Terms...')}>
            <div className="tile-icon bg-blue">
              <FileText size={20} />
            </div>
            <div className="tile-details">
              <h5 className="tile-headline">Terms of Service</h5>
              <p className="tile-subtext">Read the rules for using SkillSnap.</p>
            </div>
          </div>

          <div className="legal-tile" onClick={() => showToast('Showing Privacy Policy...')}>
            <div className="tile-icon bg-blue">
              <Shield size={20} />
            </div>
            <div className="tile-details">
              <h5 className="tile-headline">Privacy Policy</h5>
              <p className="tile-subtext">Understand how your information is handled.</p>
            </div>
          </div>

          <div className="legal-tile" onClick={() => showToast('Showing Licenses...')}>
            <div className="tile-icon bg-blue">
              <Award size={20} />
            </div>
            <div className="tile-details">
              <h5 className="tile-headline">Licenses</h5>
              <p className="tile-subtext">Open-source packages and licenses used in the app.</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .sub-screen {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-device);
        }
        
        .app-bar {
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          border-bottom: 1px solid var(--border-color);
          background-color: var(--bg-card);
          z-index: 10;
        }
        
        .back-btn {
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 50%;
          transition: var(--transition);
        }
        .back-btn:hover {
          background-color: rgba(0,0,0,0.05);
        }
        
        .app-bar-title {
          font-size: 16px;
          font-weight: 800;
        }
        
        .sub-screen-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          scrollbar-width: none;
        }
        .sub-screen-content::-webkit-scrollbar {
          display: none;
        }
        
        .about-main-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .app-name {
          font-size: 24px;
          font-weight: 800;
          color: #000000;
        }
        [data-theme="dark"] .app-name {
          color: #ffffff;
        }
        
        .app-description-text {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.87);
          line-height: 1.5;
        }
        [data-theme="dark"] .app-description-text {
          color: var(--text-secondary);
        }
        
        .version-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 13px;
          color: var(--text-muted);
          margin-top: 8px;
        }
        
        .legal-tiles-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
        }
        
        .legal-tile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          background-color: #ffffff;
          border-radius: 16px;
          border: 1px solid var(--border-color);
          cursor: pointer;
          transition: var(--transition);
        }
        [data-theme="dark"] .legal-tile {
          background-color: var(--bg-card);
        }
        .legal-tile:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
        }
        
        .tile-icon {
          height: 44px;
          width: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .tile-icon.bg-blue {
          background-color: rgba(91, 103, 255, 0.12);
          color: #5b67ff;
        }
        
        .tile-details {
          display: flex;
          flex-direction: column;
        }
        
        .tile-headline {
          font-size: 14px;
          font-weight: 800;
          color: #000000;
        }
        [data-theme="dark"] .tile-headline {
          color: #ffffff;
        }
        
        .tile-subtext {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
}
