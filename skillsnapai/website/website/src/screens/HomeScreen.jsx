import React, { useState, useEffect } from 'react';
import { Sun, Moon, Bell, Search, Bot, Star, Code, ArrowRight } from 'lucide-react';
import { ApiService } from '../services/apiService';

export default function HomeScreen({
  userId,
  themeMode,
  onToggleTheme,
  onNavTap,
  onStartCourse,
  showToast,
}) {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ApiService.fetchHomeDashboard(userId);
      setDashboard(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      showToast('Error loading dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="home-loading">
        <div className="loader" />
        <style>{`
          .home-loading {
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
      <div className="home-error">
        <p className="error-text">{error || 'Something went wrong'}</p>
        <button className="retry-btn" onClick={loadDashboard}>Retry</button>
        <style>{`
          .home-error {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            padding: 20px;
            text-align: center;
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
            font-weight: 700;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  const { user, skills, stats, courses, career_paths } = dashboard;
  const isDark = themeMode === 'dark';

  return (
    <div className="screen-scroll-container home-screen-content fade-in">
      {/* Top Header Section */}
      <div className="header-row">
        <div className="user-greet">
          <img
            src={user.avatar_url || '/assets/images/avatar.png'}
            alt={user.full_name}
            className="avatar-img"
            onError={(e) => { e.target.src = '/assets/images/avatar.png'; }}
          />
          <div className="greet-text">
            <span className="greet-hello">Hello</span>
            <h3 className="greet-name">{user.full_name || 'User'}</h3>
          </div>
        </div>

        <div className="actions-cluster">
          <button className="circle-action-btn" onClick={onToggleTheme}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="circle-action-btn">
            <Bell size={18} />
          </button>
        </div>
      </div>

      {/* Search & Assistant Row */}
      <div className="search-assistant-row">
        <div className="search-box-mock">
          <Search size={18} className="search-icon" />
          <span className="search-placeholder">Search</span>
        </div>
        
        <div className="assistant-btn-gradient">
          <div className="assistant-inner">
            <span className="assistant-label">Assistant</span>
            <Bot size={16} />
          </div>
        </div>
      </div>

      {/* Skills Progress Card */}
      <div className="card-premium">
        <h3 className="card-title">Skills</h3>
        
        <div className="skills-list">
          {skills && skills.length > 0 ? (
            skills.map((skill, index) => {
              const value = (skill.progress_percent || 0) / 100;
              return (
                <div key={index} className="skill-item">
                  <div className="skill-info">
                    <span className="skill-name">{skill.skill_name}</span>
                    <span className="skill-percent">{skill.progress_percent}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${skill.progress_percent}%`, backgroundColor: '#3b82f6' }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-data-text">No skills registered.</p>
          )}
        </div>
        
        <div className="card-footer-action">
          <span>View Full Report</span>
        </div>
      </div>

      {/* Lessons Completed & Hours Spent Cards */}
      <div className="stats-row">
        {/* Completed Lessons */}
        <div className="card-premium stats-half-card">
          <div className="stat-percentage-badge badge-red">
            <span className="bullet red" />
            <span>7%</span>
          </div>
          <div className="stat-big-number">{stats?.lessons_completed || 0}</div>
          <div className="stat-label">Lessons Completed</div>
        </div>

        {/* Hours Spent */}
        <div className="card-premium stats-half-card">
          <div className="stat-hours-header">
            <span className="stat-big-number">{stats?.hours_spent || 0}h</span>
            <span className="trend-badge">↑12%</span>
          </div>
          <div className="stat-label marg-bottom">Hours spent on classes</div>
          
          <div className="stats-progress-label">Design</div>
          <div className="progress-bar-bg height-6">
            <div className="progress-bar-fill bg-green" style={{ width: '50%' }} />
          </div>

          <div className="stats-progress-label top-marg">Management</div>
          <div className="progress-bar-bg height-6">
            <div className="progress-bar-fill bg-purple" style={{ width: '12%' }} />
          </div>
        </div>
      </div>

      {/* Courses Header & Scroll */}
      <div className="section-header">
        <h3 className="section-title">Courses</h3>
        <span className="section-action" onClick={() => onNavTap(2)}>View all</span>
      </div>

      <div className="courses-grid">
        {courses && courses.map((course, idx) => (
          <div key={idx} className="course-item-card card-premium">
            <div className="course-img-wrapper">
              <img
                src={course.image_url || `/assets/images/course${idx + 1}.jpg`}
                alt={course.title}
                className="course-cover-img"
                onError={(e) => { e.target.src = `/assets/images/course${idx + 1}.jpg`; }}
              />
            </div>
            <div className="course-details">
              <span className="ai-badge">AI Suggested</span>
              <h4 className="course-item-title">{course.title}</h4>
              <p className="course-item-subtitle">{course.subtitle}</p>
              
              <div className="course-ratings">
                <span className="course-lessons-count">{course.lesson_count} Lessons</span>
                <div className="rating-star-group">
                  <Star size={14} fill="#fbbc05" stroke="none" />
                  <span className="rating-val">{course.rating}</span>
                </div>
              </div>

              <button
                className="course-action-btn"
                onClick={() => onStartCourse(course)}
              >
                {course.action_text || 'Start'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended Career Paths Header & List */}
      <div className="section-header top-marg-24">
        <h3 className="section-title">Recommended Career Paths</h3>
        <span className="section-action" onClick={() => onNavTap(1)}>View All</span>
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
            <button className="career-roadmap-btn" onClick={() => onNavTap(1)}>
              View Roadmap
            </button>
          </div>
        ))}
      </div>

      <style>{`
        .home-screen-content {
          padding-top: 10px;
        }
        
        .header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        
        .user-greet {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .avatar-img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid var(--border-color);
        }
        
        .greet-text {
          display: flex;
          flex-direction: column;
        }
        
        .greet-hello {
          font-size: 13px;
          color: var(--text-secondary);
        }
        
        .greet-name {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-primary);
        }
        
        .actions-cluster {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .circle-action-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.05);
          border: none;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }
        [data-theme="dark"] .circle-action-btn {
          background-color: rgba(255, 255, 255, 0.08);
        }
        .circle-action-btn:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
        
        .search-assistant-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        
        .search-box-mock {
          flex: 1;
          height: 46px;
          border-radius: 23px;
          background-color: rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 8px;
          color: var(--text-muted);
        }
        [data-theme="dark"] .search-box-mock {
          background-color: rgba(255, 255, 255, 0.08);
        }
        
        .search-placeholder {
          font-size: 0.95rem;
        }
        
        .assistant-btn-gradient {
          padding: 3px;
          border-radius: 23px;
          background: linear-gradient(135deg, #34a853, #ec407a, #8e24aa);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }
        .assistant-btn-gradient:hover {
          transform: translateY(-2px);
        }
        
        .assistant-inner {
          background-color: var(--bg-card);
          padding: 8px 12px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--text-primary);
        }
        
        .card-title {
          font-size: 18px;
          font-weight: 800;
          margin-bottom: 12px;
        }
        
        .skills-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .skill-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .skill-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 600;
        }
        
        .progress-bar-bg {
          width: 100%;
          height: 10px;
          background-color: rgba(0, 0, 0, 0.08);
          border-radius: 5px;
          overflow: hidden;
        }
        [data-theme="dark"] .progress-bar-bg {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .progress-bar-fill {
          height: 100%;
          border-radius: 5px;
          transition: width 1s ease-in-out;
        }
        
        .card-footer-action {
          text-align: right;
          margin-top: 14px;
          font-size: 13px;
          color: var(--text-muted);
          cursor: pointer;
        }
        .card-footer-action:hover {
          color: var(--text-primary);
        }
        
        .stats-row {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }
        
        .stats-half-card {
          flex: 1;
          margin-bottom: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .stat-percentage-badge {
          align-self: flex-start;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        
        .badge-red {
          background-color: rgba(234, 67, 53, 0.15);
          color: var(--danger);
        }
        
        .bullet {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .bullet.red { background-color: var(--danger); }
        
        .stat-big-number {
          font-size: 38px;
          font-weight: 800;
          line-height: 1.1;
          margin: 10px 0;
        }
        
        .stat-label {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.3;
        }
        
        .stat-hours-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .trend-badge {
          background-color: rgba(52, 168, 83, 0.15);
          color: var(--success);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
        }
        
        .marg-bottom { margin-bottom: 10px; }
        
        .stats-progress-label {
          font-size: 11px;
          font-weight: 600;
          margin-bottom: 3px;
        }
        
        .top-marg { margin-top: 8px; }
        
        .height-6 { height: 6px; }
        
        .bg-green { background-color: var(--success); }
        .bg-purple { background-color: var(--accent-purple); }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .section-title {
          font-size: 20px;
          font-weight: 800;
        }
        
        .section-action {
          font-size: 14px;
          font-weight: 700;
          color: var(--primary);
          cursor: pointer;
        }
        
        .top-marg-24 { margin-top: 24px; }
        
        .courses-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .course-item-card {
          margin-bottom: 0;
          padding: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .course-img-wrapper {
          height: 100px;
          width: 100%;
          overflow: hidden;
          background-color: #e0e0e0;
        }
        
        .course-cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .course-details {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .ai-badge {
          font-size: 11px;
          color: var(--text-muted);
        }
        
        .course-item-title {
          font-size: 15px;
          font-weight: 800;
          color: var(--text-primary);
        }
        
        .course-item-subtitle {
          font-size: 11px;
          color: var(--text-secondary);
          line-height: 1.3;
        }
        
        .course-ratings {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 600;
          margin-top: 4px;
        }
        
        .rating-star-group {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        
        .rating-val {
          padding-top: 1px;
        }
        
        .course-action-btn {
          margin-top: 8px;
          width: 100%;
          height: 34px;
          border-radius: 8px;
          background-color: rgba(0,0,0,0.05);
          color: var(--text-primary);
          border: none;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
        }
        [data-theme="dark"] .course-action-btn {
          background-color: rgba(255,255,255,0.08);
        }
        .course-action-btn:hover {
          background-color: rgba(77, 141, 255, 0.15);
          color: var(--primary);
        }
        
        .career-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .career-path-card {
          background: #ffffff;
          border-radius: 14px;
          padding: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: var(--shadow-sm);
        }
        [data-theme="dark"] .career-path-card {
          background: var(--bg-card);
        }
        
        .career-icon-box {
          height: 48px;
          width: 48px;
          border-radius: 12px;
          background-color: rgba(77, 141, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          flex-shrink: 0;
        }
        
        .career-info-box {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        
        .career-path-title {
          font-size: 13px;
          font-weight: 800;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .career-path-subtitle {
          font-size: 11px;
          color: var(--text-secondary);
          margin-top: 2px;
        }
        
        .career-roadmap-btn {
          background-color: #e8e7ff;
          color: #5b67ff;
          border: none;
          border-radius: 12px;
          padding: 8px 10px;
          font-size: 10px;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
          flex-shrink: 0;
        }
        [data-theme="dark"] .career-roadmap-btn {
          background-color: rgba(91, 103, 255, 0.2);
          color: #a8b2ff;
        }
        .career-roadmap-btn:hover {
          filter: brightness(0.95);
        }
      `}</style>
    </div>
  );
}
