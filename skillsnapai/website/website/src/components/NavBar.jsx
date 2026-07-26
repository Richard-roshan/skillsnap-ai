import React from 'react';
import { Home, Award, BookOpen, Settings } from 'lucide-react';

export default function NavBar({ currentIndex, onTap }) {
  const navItems = [
    { label: 'Home', icon: Home },
    { label: 'Mentorship', icon: Award }, // Replaces Flutter school/mentorship icon
    { label: 'My Courses', icon: BookOpen }, // Replaces Flutter menu_book icon
    { label: 'Settings', icon: Settings },
  ];

  return (
    <div className="bottom-nav-bar">
      {navItems.map((item, index) => {
        const IconComponent = item.icon;
        const isActive = currentIndex === index;
        return (
          <button
            key={index}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onTap(index)}
          >
            <div className="nav-icon-wrapper">
              <IconComponent size={20} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
      
      <style>{`
        .bottom-nav-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 68px;
          background-color: var(--bg-card);
          border-top: 1px solid var(--border-color);
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding-bottom: 12px; /* safe area offset */
          z-index: 100;
          box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.03);
          transition: var(--transition);
        }
        
        .nav-item {
          background: none;
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          cursor: pointer;
          flex: 1;
          gap: 4px;
          height: 100%;
          transition: var(--transition);
        }
        
        .nav-item:hover {
          color: var(--primary);
        }
        
        .nav-item.active {
          color: var(--primary);
        }
        
        .nav-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px 12px;
          border-radius: 16px;
          transition: var(--transition);
        }
        
        .nav-item.active .nav-icon-wrapper {
          background-color: rgba(77, 141, 255, 0.12);
        }
        
        .nav-label {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: capitalize;
          letter-spacing: 0.2px;
        }
      `}</style>
    </div>
  );
}
