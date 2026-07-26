import React from 'react';
import { ChevronLeft, Lock, Eye, Trash2, Download, Shield } from 'lucide-react';

export default function PrivacySecurityScreen({ onBack, showToast }) {
  return (
    <div className="sub-screen PrivacySecurityScreen fade-in">
      {/* App Bar */}
      <div className="app-bar">
        <button className="back-btn" onClick={onBack}>
          <ChevronLeft size={22} />
        </button>
        <h3 className="app-bar-title">Privacy & Security</h3>
        <div style={{ width: 22 }} />
      </div>

      <div className="sub-screen-content">
        <div className="privacy-tiles-stack">
          {/* Password protection */}
          <div className="privacy-tile" onClick={() => showToast('Redirecting to password protection...')}>
            <div className="tile-icon">
              <Lock size={20} />
            </div>
            <div className="tile-details">
              <h5 className="tile-headline">Password Protection</h5>
              <p className="tile-subtext">Change your password anytime to keep your account safe.</p>
            </div>
          </div>

          {/* Account privacy */}
          <div className="privacy-tile" onClick={() => showToast('Opening account privacy...')}>
            <div className="tile-icon">
              <Eye size={20} />
            </div>
            <div className="tile-details">
              <h5 className="tile-headline">Account Privacy</h5>
              <p className="tile-subtext">Control who can view your profile and activity.</p>
            </div>
          </div>

          {/* Delete account */}
          <div className="privacy-tile" onClick={() => showToast('Delete account requested...')}>
            <div className="tile-icon icon-danger">
              <Trash2 size={20} />
            </div>
            <div className="tile-details">
              <h5 className="tile-headline">Delete Account</h5>
              <p className="tile-subtext">Request account deletion and data removal.</p>
            </div>
          </div>

          {/* Download Data */}
          <div className="privacy-tile" onClick={() => showToast('Downloading user data archive...')}>
            <div className="tile-icon">
              <Download size={20} />
            </div>
            <div className="tile-details">
              <h5 className="tile-headline">Download My Data</h5>
              <p className="tile-subtext">Export your profile, courses and resume history.</p>
            </div>
          </div>

          {/* Security Tips */}
          <div className="privacy-tile" onClick={() => showToast('Showing security checklist...')}>
            <div className="tile-icon">
              <Shield size={20} />
            </div>
            <div className="tile-details">
              <h5 className="tile-headline">Security Tips</h5>
              <p className="tile-subtext">Use a strong password and do not share login details.</p>
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
        
        .privacy-tiles-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .privacy-tile {
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
        [data-theme="dark"] .privacy-tile {
          background-color: var(--bg-card);
        }
        .privacy-tile:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
        }
        
        .tile-icon {
          height: 44px;
          width: 44px;
          border-radius: 12px;
          background-color: rgba(91, 103, 255, 0.12);
          color: #5b67ff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .tile-icon.icon-danger {
          background-color: rgba(234, 67, 53, 0.12);
          color: var(--danger);
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
