import React, { useState } from 'react';
import { User, Edit, Lock, Award, Moon, Bell, Mail, Shield, HelpCircle, Info, LogOut, ChevronRight } from 'lucide-react';

export default function SettingsScreen({
  themeMode,
  onToggleTheme,
  onNavigateToSubpage,
  onLogout,
  showToast,
}) {
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  const isDark = themeMode === 'dark';

  return (
    <div className="screen-scroll-container settings-screen fade-in">
      {/* Profile Details Header */}
      <div className="settings-profile-header">
        <div className="settings-avatar-circle">
          <User size={32} />
        </div>
        <div className="profile-info">
          <h3 className="profile-name">John Jonson</h3>
          <span className="profile-email">johnjonson@email.com</span>
        </div>
        <button className="settings-edit-btn" onClick={() => showToast('Editing Profile...')}>
          <Edit size={16} />
        </button>
      </div>

      {/* Account Section */}
      <h3 className="settings-section-title">Account</h3>
      
      <div className="settings-list">
        <div className="settings-tile" onClick={() => showToast('Profile details...')}>
          <div className="tile-icon-box">
            <User size={20} />
          </div>
          <div className="tile-content">
            <h4 className="tile-title">Profile Details</h4>
            <span className="tile-desc">Edit name, email and phone</span>
          </div>
          <ChevronRight size={16} className="tile-arrow" />
        </div>

        <div className="settings-tile" onClick={() => showToast('Change password...')}>
          <div className="tile-icon-box">
            <Lock size={20} />
          </div>
          <div className="tile-content">
            <h4 className="tile-title">Change Password</h4>
            <span className="tile-desc">Update your login password</span>
          </div>
          <ChevronRight size={16} className="tile-arrow" />
        </div>

        <div className="settings-tile" onClick={() => showToast('Resume & Career Data details...')}>
          <div className="tile-icon-box">
            <Award size={20} />
          </div>
          <div className="tile-content">
            <h4 className="tile-title">Resume & Career Data</h4>
            <span className="tile-desc">Manage uploaded resumes and analysis</span>
          </div>
          <ChevronRight size={16} className="tile-arrow" />
        </div>
      </div>

      {/* Preferences Section */}
      <h3 className="settings-section-title">Preferences</h3>
      
      <div className="settings-list">
        {/* Dark Mode Switch */}
        <div className="settings-tile no-hover">
          <div className="tile-icon-box">
            <Moon size={20} />
          </div>
          <div className="tile-content">
            <h4 className="tile-title">Dark Mode</h4>
            <span className="tile-desc">Switch between light and dark theme</span>
          </div>
          <div className="switch-container">
            <input
              type="checkbox"
              id="theme-switch"
              checked={isDark}
              onChange={onToggleTheme}
              className="switch-input"
            />
            <label htmlFor="theme-switch" className="switch-label">
              <span className="switch-button" />
            </label>
          </div>
        </div>

        {/* Notifications Switch */}
        <div className="settings-tile no-hover">
          <div className="tile-icon-box">
            <Bell size={20} />
          </div>
          <div className="tile-content">
            <h4 className="tile-title">Notifications</h4>
            <span className="tile-desc">Receive app alerts and reminders</span>
          </div>
          <div className="switch-container">
            <input
              type="checkbox"
              id="notify-switch"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="switch-input"
            />
            <label htmlFor="notify-switch" className="switch-label">
              <span className="switch-button" />
            </label>
          </div>
        </div>

        {/* Email Updates Switch */}
        <div className="settings-tile no-hover">
          <div className="tile-icon-box">
            <Mail size={20} />
          </div>
          <div className="tile-content">
            <h4 className="tile-title">Email Updates</h4>
            <span className="tile-desc">Receive course and career updates</span>
          </div>
          <div className="switch-container">
            <input
              type="checkbox"
              id="email-switch"
              checked={emailUpdates}
              onChange={(e) => setEmailUpdates(e.target.checked)}
              className="switch-input"
            />
            <label htmlFor="email-switch" className="switch-label">
              <span className="switch-button" />
            </label>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <h3 className="settings-section-title">Support</h3>
      
      <div className="settings-list">
        <div className="settings-tile" onClick={() => onNavigateToSubpage('privacy')}>
          <div className="tile-icon-box">
            <Shield size={20} />
          </div>
          <div className="tile-content">
            <h4 className="tile-title">Privacy & Security</h4>
            <span className="tile-desc">Permissions, data and account safety</span>
          </div>
          <ChevronRight size={16} className="tile-arrow" />
        </div>

        <div className="settings-tile" onClick={() => onNavigateToSubpage('help')}>
          <div className="tile-icon-box">
            <HelpCircle size={20} />
          </div>
          <div className="tile-content">
            <h4 className="tile-title">Help & Support</h4>
            <span className="tile-desc">FAQs, contact support and feedback</span>
          </div>
          <ChevronRight size={16} className="tile-arrow" />
        </div>

        <div className="settings-tile" onClick={() => onNavigateToSubpage('about')}>
          <div className="tile-icon-box">
            <Info size={20} />
          </div>
          <div className="tile-content">
            <h4 className="tile-title">About SkillSnap</h4>
            <span className="tile-desc">App version, terms and policies</span>
          </div>
          <ChevronRight size={16} className="tile-arrow" />
        </div>
      </div>

      {/* Logout Button */}
      <button className="settings-logout-btn" onClick={onLogout}>
        <LogOut size={18} />
        <span>Logout</span>
      </button>

      <style>{`
        .settings-profile-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
        }
        
        .settings-avatar-circle {
          height: 60px;
          width: 60px;
          border-radius: 50%;
          background-color: #5b67ff;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .profile-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .profile-name {
          font-size: 20px;
          font-weight: 800;
        }
        
        .profile-email {
          font-size: 13px;
          color: var(--text-secondary);
          margin-top: 2px;
        }
        
        .settings-edit-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--bg-card);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }
        .settings-edit-btn:hover {
          background-color: rgba(0,0,0,0.05);
        }
        
        .settings-section-title {
          font-size: 18px;
          font-weight: 800;
          margin-top: 20px;
          margin-bottom: 12px;
        }
        
        .settings-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .settings-tile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          background-color: var(--bg-card);
          border-radius: 16px;
          border: 1px solid var(--border-color);
          cursor: pointer;
          transition: var(--transition);
        }
        .settings-tile:not(.no-hover):hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
        }
        .settings-tile.no-hover {
          cursor: default;
        }
        
        .tile-icon-box {
          height: 46px;
          width: 46px;
          border-radius: 12px;
          background-color: rgba(91, 103, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #5b67ff;
          flex-shrink: 0;
        }
        
        .tile-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        
        .tile-title {
          font-size: 14px;
          font-weight: 800;
        }
        
        .tile-desc {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .tile-arrow {
          color: var(--text-muted);
          flex-shrink: 0;
        }
        
        .settings-logout-btn {
          width: 100%;
          height: 50px;
          border-radius: 14px;
          background-color: var(--danger);
          color: #ffffff;
          border: none;
          font-size: 15px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
          margin-bottom: 24px;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: 0 4px 10px rgba(234, 67, 53, 0.2);
        }
        .settings-logout-btn:hover {
          filter: brightness(0.95);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
