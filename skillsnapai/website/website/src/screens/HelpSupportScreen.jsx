import React from 'react';
import { ChevronLeft, HelpCircle, Contact, Bug, MessageSquare, ShieldAlert } from 'lucide-react';

export default function HelpSupportScreen({ onBack, showToast }) {
  return (
    <div className="sub-screen HelpSupportScreen fade-in">
      {/* App Bar */}
      <div className="app-bar">
        <button className="back-btn" onClick={onBack}>
          <ChevronLeft size={22} />
        </button>
        <h3 className="app-bar-title">Help & Support</h3>
        <div style={{ width: 22 }} />
      </div>

      <div className="sub-screen-content">
        <div className="support-tiles-stack">
          {/* FAQ */}
          <div className="support-tile" onClick={() => showToast('Opening FAQs...')}>
            <div className="tile-icon">
              <HelpCircle size={20} />
            </div>
            <div className="tile-details">
              <h5 className="tile-headline">Frequently Asked Questions</h5>
              <p className="tile-subtext">Find answers to common app and learning questions.</p>
            </div>
          </div>

          {/* Contact Support */}
          <div className="support-tile" onClick={() => showToast('Connecting to support email...')}>
            <div className="tile-icon">
              <Contact size={20} />
            </div>
            <div className="tile-details">
              <h5 className="tile-headline">Contact Support</h5>
              <p className="tile-subtext">Reach out to the support team for help.</p>
            </div>
          </div>

          {/* Report problem */}
          <div className="support-tile" onClick={() => showToast('Opening bug reporter...')}>
            <div className="tile-icon">
              <Bug size={20} />
            </div>
            <div className="tile-details">
              <h5 className="tile-headline">Report a Problem</h5>
              <p className="tile-subtext">Let us know if something is not working properly.</p>
            </div>
          </div>

          {/* Send feedback */}
          <div className="support-tile" onClick={() => showToast('Opening feedback form...')}>
            <div className="tile-icon">
              <MessageSquare size={20} />
            </div>
            <div className="tile-details">
              <h5 className="tile-headline">Send Feedback</h5>
              <p className="tile-subtext">Share suggestions to improve SkillSnap.</p>
            </div>
          </div>

          {/* Privacy Questions */}
          <div className="support-tile" onClick={() => showToast('Opening privacy panel...')}>
            <div className="tile-icon">
              <ShieldAlert size={20} />
            </div>
            <div className="tile-details">
              <h5 className="tile-headline">Privacy Questions</h5>
              <p className="tile-subtext">Learn how your data is used and protected.</p>
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
        
        .support-tiles-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .support-tile {
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
        [data-theme="dark"] .support-tile {
          background-color: var(--bg-card);
        }
        .support-tile:hover {
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
