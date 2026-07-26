import React, { useState, useEffect } from 'react';
import { Briefcase, Bell, Sparkles, Send, FileText, Search, Brain, Mic, Code } from 'lucide-react';
import { ApiService } from '../services/apiService';

export default function MentorshipScreen({
  userId,
  themeMode,
  onNavTap,
  onNavigateToSubpage,
  showToast,
}) {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ApiService.fetchMentorshipDashboard(userId);
      setDashboard(data);
    } catch (err) {
      setError(err.message || 'Failed to load mentorship dashboard');
      showToast('Error loading mentorship dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskMentor = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    showToast(`Mentor response: Let's focus on building your portfolio!`);
    setPrompt('');
  };

  if (isLoading) {
    return (
      <div className="mentorship-loading">
        <div className="loader" />
        <style>{`
          .mentorship-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: 100%;
          }
          .loader {
            width: 32px;
            height: 32px;
            border: 3px solid rgba(77, 141, 255, 0.1);
            border-top: 3px solid var(--primary);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="mentorship-error">
        <p className="error-text">{error || 'Something went wrong'}</p>
        <button className="retry-btn" onClick={loadDashboard}>Retry</button>
        <style>{`
          .mentorship-error {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            padding: 20px;
          }
          .error-text {
            color: var(--danger);
            margin-bottom: 12px;
            font-weight: 600;
          }
          .retry-btn {
            padding: 8px 16px;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  const { resume, resume_analysis, career_paths } = dashboard;
  const atsScore = resume_analysis?.ats_score || resume?.ats_score || 0;
  
  // Calculate dash offset for SVG circle progress
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (atsScore / 100) * circumference;

  return (
    <div className="screen-scroll-container mentorship-screen fade-in">
      {/* Top Header */}
      <div className="header-row">
        <div className="career-greet">
          <div className="career-icon-header">
            <Briefcase size={28} />
          </div>
          <div className="greet-text">
            <h3 className="greet-name">Career Builder</h3>
            <span className="greet-hello">Your AI Career Guide</span>
          </div>
        </div>

        <button className="circle-action-btn">
          <Bell size={18} />
        </button>
      </div>

      {/* Ask Box Form */}
      <form onSubmit={handleAskMentor} className="ask-box-container card-premium">
        <Sparkles size={18} className="spark-icon" />
        <input
          type="text"
          placeholder="Ask your Career Mentor...."
          className="ask-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit" className="ask-btn">
          <Sparkles size={13} fill="currentColor" />
          <span>Ask</span>
        </button>
      </form>

      {/* Resume score grid panel */}
      <div className="resume-panel-row">
        {/* Builder card */}
        <div className="card-premium resume-builder-card">
          <h4 className="panel-title">Resume Builder</h4>
          <p className="panel-subtitle text-truncate-2">
            {resume?.resume_name || 'Create ATS-friendly resumes that get you noticed.'}
          </p>
          <div className="btn-stack">
            <button className="btn-small-filled" type="button" onClick={() => onNavigateToSubpage('resume-builder')}>
              Create New Resume
            </button>
            <button className="btn-small-outlined" type="button" onClick={() => onNavigateToSubpage('resume-analyzer')}>
              Upload Resume
            </button>
          </div>
        </div>

        {/* Score widget */}
        <div className="card-premium resume-score-card">
          <h4 className="panel-title text-center">Resume Score</h4>
          
          <div className="svg-circle-wrapper">
            <svg className="progress-circle" width="70" height="70">
              <circle
                className="progress-circle-bg"
                cx="35"
                cy="35"
                r={radius}
                strokeWidth="6"
              />
              <circle
                className="progress-circle-fill"
                cx="35"
                cy="35"
                r={radius}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="progress-text-overlay">
              <span className="score-val">{atsScore}</span>
              <span className="score-denominator">/100</span>
            </div>
          </div>
          
          <div className="score-tag-text">
            ATS Friendly<br />Good Match
          </div>
        </div>
      </div>

      {/* Quick Actions Header & Grid */}
      <h3 className="section-title actions-title">Quick Actions</h3>
      <div className="quick-actions-grid">
        <div className="action-card" onClick={() => onNavigateToSubpage('resume-builder')}>
          <div className="action-icon-wrapper bg-indigo">
            <FileText size={20} />
          </div>
          <div className="action-info">
            <h4 className="action-title">Resume Builder</h4>
            <p className="action-desc">Create a professional resume in minutes</p>
          </div>
        </div>

        <div className="action-card" onClick={() => onNavigateToSubpage('resume-analyzer')}>
          <div className="action-icon-wrapper bg-cyan">
            <Search size={20} />
          </div>
          <div className="action-info">
            <h4 className="action-title">Resume Analyzer</h4>
            <p className="action-desc">Get AI feedback and improve resume</p>
          </div>
        </div>

        <div className="action-card" onClick={() => onNavigateToSubpage('career-roadmap')}>
          <div className="action-icon-wrapper bg-green">
            <Brain size={20} />
          </div>
          <div className="action-info">
            <h4 className="action-title">Career Roadmap</h4>
            <p className="action-desc">Personalized learning paths</p>
          </div>
        </div>

        <div className="action-card" onClick={() => onNavigateToSubpage('mock-interview')}>
          <div className="action-icon-wrapper bg-orange">
            <Mic size={20} />
          </div>
          <div className="action-info">
            <h4 className="action-title">Mock Interview</h4>
            <p className="action-desc">Practice interview with AI reviews</p>
          </div>
        </div>
      </div>

      {/* Recommended Career Paths Header & List */}
      <div className="section-header top-marg-24">
        <h3 className="section-title">Recommended Career Paths</h3>
        <span className="section-action" onClick={() => showToast('Viewing roadmaps...')}>View All</span>
      </div>

      <div className="career-list">
        {career_paths && career_paths.map((path, idx) => (
          <div key={idx} className="career-path-card">
            <div className="career-icon-box">
              <Code size={22} className="career-icon" />
            </div>
            <div className="career-info-box">
              <h4 className="career-path-title">{path.title}</h4>
              <p className="career-path-subtitle">{path.match_percent}% Match • {path.demand_level}</p>
            </div>
            <button className="career-roadmap-btn" onClick={() => onNavigateToSubpage('career-roadmap')}>
              View Roadmap
            </button>
          </div>
        ))}
      </div>

      <style>{`
        .career-icon-header {
          height: 52px;
          width: 52px;
          background-color: #5b67ff;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }
        
        .ask-box-container {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 28px;
          margin-bottom: 18px;
        }
        
        .spark-icon {
          color: var(--primary);
          margin-left: 6px;
        }
        
        .ask-input {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          font-size: 13px;
          color: var(--text-primary);
        }
        .ask-input::placeholder {
          color: var(--text-muted);
        }
        
        .ask-btn {
          background-color: #5b67ff;
          color: white;
          border: none;
          border-radius: 20px;
          height: 34px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
        }
        .ask-btn:hover {
          filter: brightness(0.95);
        }
        
        .resume-panel-row {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }
        
        .resume-builder-card {
          flex: 2;
          margin-bottom: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .resume-score-card {
          flex: 1;
          margin-bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 12px 6px;
        }
        
        .panel-title {
          font-size: 13px;
          font-weight: 800;
          margin-bottom: 4px;
        }
        .text-center { text-align: center; }
        
        .panel-subtitle {
          font-size: 11px;
          color: var(--text-secondary);
          line-height: 1.35;
          margin-bottom: 10px;
        }
        .text-truncate-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
        
        .btn-stack {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .btn-small-filled {
          background-color: #5b67ff;
          color: white;
          border: none;
          border-radius: 8px;
          height: 28px;
          font-size: 10px;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
        }
        .btn-small-filled:hover {
          filter: brightness(0.95);
        }
        
        .btn-small-outlined {
          background: transparent;
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          height: 28px;
          font-size: 10px;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
        }
        .btn-small-outlined:hover {
          background-color: rgba(0,0,0,0.02);
        }
        
        .svg-circle-wrapper {
          position: relative;
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 6px 0;
        }
        
        .progress-circle {
          transform: rotate(-90deg);
        }
        
        .progress-circle-bg {
          fill: none;
          stroke: rgba(0,0,0,0.05);
        }
        [data-theme="dark"] .progress-circle-bg {
          stroke: rgba(255, 255, 255, 0.08);
        }
        
        .progress-circle-fill {
          fill: none;
          stroke: #673ab7;
          stroke-linecap: round;
          transition: stroke-dashoffset 1s ease-out;
        }
        
        .progress-text-overlay {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        
        .score-val {
          font-size: 18px;
          font-weight: 800;
        }
        
        .score-denominator {
          font-size: 9px;
          color: var(--text-secondary);
          margin-top: 1px;
        }
        
        .score-tag-text {
          font-size: 8px;
          font-weight: 700;
          color: var(--success);
          text-align: center;
          line-height: 1.2;
        }
        [data-theme="dark"] .score-tag-text {
          color: #81c784;
        }
        
        .actions-title {
          margin-bottom: 12px;
        }
        
        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        
        .action-card {
          background-color: var(--bg-card);
          border-radius: 14px;
          border: 1px solid var(--border-color);
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: var(--transition);
        }
        .action-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }
        
        .action-icon-wrapper {
          height: 42px;
          width: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .bg-indigo { background-color: rgba(63, 81, 181, 0.15); color: #3f51b5; }
        .bg-cyan { background-color: rgba(0, 188, 212, 0.15); color: #00bcd4; }
        .bg-green { background-color: rgba(76, 175, 80, 0.15); color: #4caf50; }
        .bg-orange { background-color: rgba(255, 152, 0, 0.15); color: #ff9800; }
        
        .action-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        
        .action-title {
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .action-desc {
          font-size: 9px;
          color: var(--text-secondary);
          margin-top: 1px;
          line-height: 1.25;
        }
      `}</style>
    </div>
  );
}
