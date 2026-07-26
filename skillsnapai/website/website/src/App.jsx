import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';

// Screens
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import MentorshipScreen from './screens/MentorshipScreen';
import MyCoursesScreen from './screens/MyCoursesScreen';
import SettingsScreen from './screens/SettingsScreen';
import AboutAppScreen from './screens/AboutAppScreen';
import HelpSupportScreen from './screens/HelpSupportScreen';
import PrivacySecurityScreen from './screens/PrivacySecurityScreen';
import ResumeBuilderScreen from './screens/ResumeBuilderScreen';
import ResumeAnalyzerScreen from './screens/ResumeAnalyzerScreen';
import CareerRoadmapScreen from './screens/CareerRoadmapScreen';
import MockInterviewScreen from './screens/MockInterviewScreen';

// Service & Icons
import { registerConnectionListener, toggleConnectionMode, getConnectionStatus } from './services/apiService';
import { 
  Wifi, WifiOff, Sun, Moon, Bell, LogOut, 
  Home, Award, BookOpen, Settings, Info, Sparkles 
} from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [themeMode, setThemeMode] = useState('light');
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('skillsnap_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [activeCourseId, setActiveCourseId] = useState(null);
  
  // Toast notifications state
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  
  // Connection status state
  const [isApiOnline, setIsApiOnline] = useState(true);

  // Sync theme setting on the document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  // If user is already logged in (from localStorage), go straight to home
  useEffect(() => {
    if (user) {
      setCurrentScreen('home');
    }
  }, []);

  // Subscribe to connection service updates
  useEffect(() => {
    registerConnectionListener((status) => {
      setIsApiOnline(status);
    });
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setIsToastVisible(true);
    
    // Auto hide after 3 seconds
    const timer = setTimeout(() => {
      setIsToastVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  };

  const handleToggleTheme = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleToggleConnection = () => {
    const nextStatus = toggleConnectionMode();
    triggerToast(nextStatus ? 'Switched to Online API Mode' : 'Switched to Offline Mock Mode');
  };

  const handleLoginSuccess = (userData) => {
    const resolvedUser = userData || { full_name: 'John Jonson', email: 'johnjonson@email.com' };
    setUser(resolvedUser);
    localStorage.setItem('skillsnap_user', JSON.stringify(resolvedUser));
    setCurrentScreen('home');
  };

  const handleSignupSuccess = () => {
    setCurrentScreen('login');
  };

  const handleStartCourse = (course) => {
    setActiveCourseId(course.course_id);
    setCurrentScreen('courses');
    triggerToast(`Loaded course: ${course.title}`);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('skillsnap_user');
    setActiveCourseId(null);
    setCurrentScreen('welcome');
    triggerToast('Logged out successfully');
  };

  const handleNavTap = (index) => {
    if (index === 0) setCurrentScreen('home');
    if (index === 1) setCurrentScreen('mentorship');
    if (index === 2) setCurrentScreen('courses');
    if (index === 3) setCurrentScreen('settings');
  };

  // Check if onboarding screens
  const isOnboarding = ['splash', 'welcome', 'login', 'signup'].includes(currentScreen);

  // Determine bottom navigation tab index
  const getNavIndex = () => {
    if (currentScreen === 'home') return 0;
    if (currentScreen === 'mentorship') return 1;
    if (currentScreen === 'courses') return 2;
    if (currentScreen === 'settings') return 3;
    return -1;
  };

  const getPageTitle = () => {
    switch (currentScreen) {
      case 'home': return 'Dashboard';
      case 'mentorship': return 'Career Mentorship';
      case 'courses': return 'My Learning';
      case 'settings': return 'App Settings';
      case 'about': return 'About SkillSnap';
      case 'help': return 'Help & Support';
      case 'privacy': return 'Privacy & Security';
      case 'resume-builder': return 'Resume Builder';
      case 'resume-analyzer': return 'Resume Analyzer';
      case 'career-roadmap': return 'Career Roadmap';
      case 'mock-interview': return 'Mock Interview';
      default: return 'SkillSnap AI';
    }
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinished={() => setCurrentScreen('welcome')} />;
      case 'welcome':
        return <WelcomeScreen onGetStarted={() => setCurrentScreen('login')} />;
      case 'login':
        return (
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onNavigateToSignup={() => setCurrentScreen('signup')}
            showToast={triggerToast}
          />
        );
      case 'signup':
        return (
          <SignupScreen
            onSignupSuccess={handleSignupSuccess}
            onNavigateToLogin={() => setCurrentScreen('login')}
            showToast={triggerToast}
          />
        );
      case 'home':
        return (
          <HomeScreen
            userId={user?.id || 1}
            themeMode={themeMode}
            onToggleTheme={handleToggleTheme}
            onNavTap={handleNavTap}
            onStartCourse={handleStartCourse}
            onNavigateToSubpage={(page) => setCurrentScreen(page)}
            showToast={triggerToast}
          />
        );
      case 'mentorship':
        return (
          <MentorshipScreen
            userId={user?.id || 1}
            themeMode={themeMode}
            onNavTap={handleNavTap}
            onNavigateToSubpage={(page) => setCurrentScreen(page)}
            showToast={triggerToast}
          />
        );
      case 'courses':
        return (
          <MyCoursesScreen
            userId={user?.id || 1}
            activeCourseId={activeCourseId}
            showToast={triggerToast}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            themeMode={themeMode}
            onToggleTheme={handleToggleTheme}
            onNavigateToSubpage={(page) => setCurrentScreen(page)}
            onLogout={handleLogout}
            showToast={triggerToast}
          />
        );
      case 'about':
        return <AboutAppScreen onBack={() => setCurrentScreen('settings')} showToast={triggerToast} />;
      case 'help':
        return <HelpSupportScreen onBack={() => setCurrentScreen('settings')} showToast={triggerToast} />;
      case 'privacy':
        return <PrivacySecurityScreen onBack={() => setCurrentScreen('settings')} showToast={triggerToast} />;
      case 'resume-builder':
        return <ResumeBuilderScreen onBack={() => setCurrentScreen('mentorship')} showToast={triggerToast} />;
      case 'resume-analyzer':
        return <ResumeAnalyzerScreen onBack={() => setCurrentScreen('mentorship')} showToast={triggerToast} />;
      case 'career-roadmap':
        return <CareerRoadmapScreen onBack={() => setCurrentScreen('mentorship')} showToast={triggerToast} />;
      case 'mock-interview':
        return <MockInterviewScreen onBack={() => setCurrentScreen('mentorship')} showToast={triggerToast} />;
      default:
        return <SplashScreen onFinished={() => setCurrentScreen('welcome')} />;
    }
  };

  const navIndex = getNavIndex();
  const showNavBar = navIndex !== -1;

  // Onboarding full-screen card view
  if (isOnboarding) {
    return (
      <div className={`full-screen-overlay ${currentScreen === 'splash' ? 'splash-mode' : ''}`}>
        {/* Animated Snackbar / Toast */}
        <div className={`toast-container ${isToastVisible ? 'show' : ''}`}>
          <span>{toastMessage}</span>
        </div>
        
        <div className="onboarding-device-mock">
          {renderActiveScreen()}
        </div>
      </div>
    );
  }

  // Dashboard desktop/mobile grid view
  return (
    <div className="app-container">
      {/* Animated Snackbar / Toast */}
      <div className={`toast-container ${isToastVisible ? 'show' : ''}`}>
        <span>{toastMessage}</span>
      </div>

      {/* Left Sidebar Navigation (Desktop only) */}
      <aside className="sidebar-nav">
        <div className="sidebar-logo-section">
          <img src="/assets/images/logo.png" alt="SkillSnap" className="sidebar-logo" />
          <h2 className="sidebar-brand-name">
            <span className="grey">Skill</span>
            <span className="blue">Snap</span>
            <span className="indigo">AI</span>
          </h2>
        </div>

        <nav className="sidebar-menu">
          <button 
            className={`sidebar-item ${currentScreen === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('home')}
          >
            <Home size={18} />
            <span>Dashboard</span>
          </button>
          
          <button 
            className={`sidebar-item ${currentScreen === 'mentorship' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('mentorship')}
          >
            <Award size={18} />
            <span>Mentorship</span>
          </button>

          <button 
            className={`sidebar-item ${currentScreen === 'courses' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('courses')}
          >
            <BookOpen size={18} />
            <span>My Learning</span>
          </button>

          <button 
            className={`sidebar-item ${['settings', 'about', 'help', 'privacy'].includes(currentScreen) ? 'active' : ''}`}
            onClick={() => setCurrentScreen('settings')}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </nav>

        {/* User Card & Logout at bottom */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <img 
              src={user?.avatar_url || '/assets/images/avatar.png'} 
              alt={user?.full_name} 
              className="sidebar-user-avatar"
            />
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.full_name || 'John Jonson'}</span>
              <span className="sidebar-user-email">{user?.email || 'johnjonson@email.com'}</span>
            </div>
          </div>
          <button className="sidebar-item" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Page Content wrapper */}
      <div className="main-content-wrapper">
        {/* Top Header Bar */}
        <header className="top-header-bar">
          <div className="header-title-section">
            <h2 className="header-page-title">{getPageTitle()}</h2>
          </div>

          <div className="header-controls">
            {/* Connection Toggle indicator */}
            <button 
              className="circle-action-btn" 
              onClick={handleToggleConnection} 
              title={isApiOnline ? "Online Tunnel Active (Click to go offline)" : "Offline Mode Active (Click to go online)"}
            >
              {isApiOnline ? <Wifi size={18} color="var(--success)" /> : <WifiOff size={18} color="var(--danger)" />}
            </button>

            {/* Light / Dark Mode Toggle */}
            <button className="circle-action-btn" onClick={handleToggleTheme} title="Toggle Theme">
              {themeMode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button className="circle-action-btn" title="Notifications">
              <Bell size={18} />
            </button>
          </div>
        </header>

        {/* Page Scrolling Workspace */}
        <main className="page-scroll-container">
          {renderActiveScreen()}
        </main>

        {/* Bottom Tabs Navigation (Visible on mobile viewports only) */}
        {showNavBar && (
          <NavBar currentIndex={navIndex} onTap={handleNavTap} />
        )}
      </div>
    </div>
  );
}
