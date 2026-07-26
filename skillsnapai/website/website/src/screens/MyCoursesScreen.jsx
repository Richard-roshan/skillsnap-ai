import React, { useState, useEffect } from 'react';
import { BookOpen, PlayCircle } from 'lucide-react';
import { ApiService } from '../services/apiService';

export default function MyCoursesScreen({
  userId,
  activeCourseId,
  showToast,
}) {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isLessonsLoading, setIsLessonsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ApiService.fetchMyCourses(userId);
      const loadedCourses = data.courses || [];
      setCourses(loadedCourses);
      
      if (loadedCourses.length > 0) {
        // Decide which course to auto-select
        let courseToSelect = loadedCourses[0];
        if (activeCourseId) {
          const found = loadedCourses.find(c => Number(c.course_id) === Number(activeCourseId));
          if (found) courseToSelect = found;
        }
        
        setSelectedCourse(courseToSelect);
        await loadLessons(courseToSelect.course_id);
      }
    } catch (err) {
      setError(err.message || 'Failed to load courses');
      showToast('Error loading courses');
    } finally {
      setIsLoading(false);
    }
  };

  const loadLessons = async (courseId) => {
    setIsLessonsLoading(true);
    try {
      const data = await ApiService.fetchCourseLessons(courseId);
      const loadedLessons = data.lessons || [];
      setLessons(loadedLessons);
      
      if (loadedLessons.length > 0) {
        setSelectedLesson(loadedLessons[0]);
      } else {
        setSelectedLesson(null);
      }
    } catch (err) {
      showToast('Error loading lessons');
    } finally {
      setIsLessonsLoading(false);
    }
  };

  const handleSelectCourse = async (course) => {
    setSelectedCourse(course);
    await loadLessons(course.course_id);
  };

  const extractYoutubeId = (urlOrId) => {
    if (!urlOrId) return '';
    const trimmed = urlOrId.trim();
    if (!trimmed.includes('http') && trimmed.length >= 11) {
      return trimmed;
    }
    
    try {
      const url = new URL(trimmed);
      if (url.hostname.includes('youtu.be')) {
        return url.pathname.slice(1);
      }
      if (url.hostname.includes('youtube.com')) {
        if (url.pathname.includes('/watch')) {
          return url.searchParams.get('v') || '';
        }
        if (url.pathname.includes('/embed/')) {
          return url.pathname.split('/embed/')[1] || '';
        }
        if (url.pathname.includes('/shorts/')) {
          return url.pathname.split('/shorts/')[1] || '';
        }
      }
    } catch (e) {
      // Fallback manual regex
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = trimmed.match(regExp);
      return (match && match[2].length === 11) ? match[2] : '';
    }
    return '';
  };

  if (isLoading) {
    return (
      <div className="courses-loading">
        <div className="loader" />
        <style>{`
          .courses-loading {
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

  if (error) {
    return (
      <div className="courses-error">
        <p className="error-text">{error}</p>
        <button className="retry-btn" onClick={loadCourses}>Retry</button>
      </div>
    );
  }

  const videoId = selectedLesson ? extractYoutubeId(selectedLesson.youtube_video_id || selectedLesson.video_url) : '';

  return (
    <div className="screen-scroll-container my-courses-screen fade-in">
      {/* Header Banner */}
      <div className="courses-header-banner">
        <div className="icon-badge-box">
          <BookOpen size={36} />
        </div>
        <div className="greet-text">
          <h3 className="banner-title">My Courses</h3>
          <span className="banner-subtitle">Watch and track your learning</span>
        </div>
      </div>

      {/* Enrolled Courses Horizontal Slider */}
      <h3 className="section-title text-black">Enrolled Courses</h3>
      
      <div className="courses-slider">
        {courses.map((course, index) => {
          const isSelected = selectedCourse?.course_id === course.course_id;
          return (
            <div
              key={index}
              className={`slider-card ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSelectCourse(course)}
            >
              <div className="slider-img-wrapper">
                <img
                  src={course.image_url || `/assets/images/course${index + 1}.jpg`}
                  alt={course.title}
                  className="slider-cover-img"
                  onError={(e) => { e.target.src = `/assets/images/course${index + 1}.jpg`; }}
                />
              </div>
              
              <div className="slider-card-body">
                <h4 className="slider-card-title">{course.title}</h4>
                <p className="slider-card-desc">{course.subtitle}</p>
                
                <div className="slider-progress-wrapper">
                  <div className="slider-progress-bar-bg">
                    <div
                      className="slider-progress-bar-fill"
                      style={{ width: `${course.progress_percent || 0}%` }}
                    />
                  </div>
                  <span className="slider-progress-text">
                    {course.progress_percent || 0}% completed
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Learning split container */}
      <div className="learning-layout-split">
        {/* Left Column: Player */}
        <div className="player-column">
          <h3 className="section-title text-black">Lesson Player</h3>
          
          <div className="video-player-aspect">
            {videoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autohide=1`}
                title={selectedLesson.lesson_title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="iframe-player"
              />
            ) : (
              <div className="no-lesson-selected">
                <span>Select a lesson</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Lessons List */}
        <div className="lessons-column">
          <h3 className="section-title text-black">Lessons</h3>
          
          <div className="lessons-stack">
            {isLessonsLoading ? (
              <div className="lessons-list-loading">
                <div className="small-loader" />
              </div>
            ) : lessons.length > 0 ? (
              lessons.map((lesson, idx) => {
                const isSelected = selectedLesson?.id === lesson.id;
                return (
                  <div
                    key={idx}
                    className={`lesson-list-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedLesson(lesson)}
                  >
                    <div className="play-icon-box">
                      <PlayCircle size={26} className="play-icon" />
                    </div>
                    
                    <div className="lesson-list-info">
                      <h4 className="lesson-item-title">{lesson.lesson_title}</h4>
                      <p className="lesson-item-desc">{lesson.lesson_description}</p>
                    </div>
                    
                    <span className="lesson-item-duration">{lesson.duration}</span>
                  </div>
                );
              })
            ) : (
              <div className="no-data-card">
                <span>No lessons found</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .my-courses-screen {
          background-color: #f7f7fb;
        }
        [data-theme="dark"] .my-courses-screen {
          background-color: #121212;
        }
        
        .courses-header-banner {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
        }
        
        .icon-badge-box {
          height: 70px;
          width: 70px;
          border-radius: 18px;
          background-color: #5b67ff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        
        .banner-title {
          font-size: 22px;
          font-weight: 800;
        }
        
        .banner-subtitle {
          font-size: 14px;
          color: var(--text-secondary);
        }
        
        .text-black {
          color: #000000;
          margin-bottom: 14px;
        }
        [data-theme="dark"] .text-black {
          color: #ffffff;
        }
        
        .courses-slider {
          display: flex;
          gap: 14px;
          overflow-x: auto;
          padding-bottom: 8px;
          scrollbar-width: none;
        }
        .courses-slider::-webkit-scrollbar {
          display: none;
        }
        
        .slider-card {
          width: 250px;
          background-color: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 14px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          cursor: pointer;
          transition: var(--transition);
        }
        [data-theme="dark"] .slider-card {
          background-color: var(--bg-card);
        }
        
        .slider-card.selected {
          background-color: #e9e8ff;
          border-color: var(--primary);
        }
        [data-theme="dark"] .slider-card.selected {
          background-color: #2d2e42;
        }
        
        .slider-img-wrapper {
          height: 110px;
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          background-color: #e0e0e0;
        }
        
        .slider-cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .slider-card-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }
        
        .slider-card-title {
          font-size: 16px;
          font-weight: 800;
          color: #000000;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        [data-theme="dark"] .slider-card-title {
          color: #ffffff;
        }
        
        .slider-card-desc {
          font-size: 12px;
          color: #555555;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
        [data-theme="dark"] .slider-card-desc {
          color: #b0b0b0;
        }
        
        .slider-progress-wrapper {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .slider-progress-bar-bg {
          width: 100%;
          height: 7px;
          background-color: rgba(0,0,0,0.1);
          border-radius: 4px;
          overflow: hidden;
        }
        [data-theme="dark"] .slider-progress-bar-bg {
          background-color: rgba(255,255,255,0.15);
        }
        
        .slider-progress-bar-fill {
          height: 100%;
          background-color: var(--primary);
          border-radius: 4px;
        }
        
        .slider-progress-text {
          font-size: 12px;
          color: var(--text-secondary);
        }
        
        .video-player-aspect {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 Aspect Ratio */
          background-color: #000000;
          border-radius: 18px;
          overflow: hidden;
        }
        
        .iframe-player {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .no-lesson-selected {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 600;
        }
        
        .lessons-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .lesson-list-item {
          background-color: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: 18px;
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: var(--transition);
        }
        [data-theme="dark"] .lesson-list-item {
          background-color: var(--bg-card);
        }
        
        .lesson-list-item.selected {
          background-color: #e9e8ff;
          border-color: var(--primary);
        }
        [data-theme="dark"] .lesson-list-item.selected {
          background-color: #2d2e42;
        }
        
        .play-icon-box {
          height: 55px;
          width: 55px;
          border-radius: 14px;
          background-color: rgba(77, 141, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          flex-shrink: 0;
        }
        
        .lesson-list-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        
        .lesson-item-title {
          font-size: 15px;
          font-weight: 800;
          color: #000000;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        [data-theme="dark"] .lesson-item-title {
          color: #ffffff;
        }
        
        .lesson-item-desc {
          font-size: 12px;
          color: #555555;
          margin-top: 4px;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
        [data-theme="dark"] .lesson-item-desc {
          color: #b0b0b0;
        }
        
        .lesson-item-duration {
          font-size: 12px;
          color: var(--text-secondary);
          flex-shrink: 0;
          font-weight: 600;
        }
        
        .small-loader {
          width: 24px;
          height: 24px;
          border: 2px solid rgba(0, 0, 0, 0.05);
          border-top: 2px solid var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 20px auto;
        }
        
        .no-data-card {
          background-color: #ffffff;
          border-radius: 18px;
          padding: 30px;
          text-align: center;
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
        }
        [data-theme="dark"] .no-data-card {
          background-color: var(--bg-card);
        }
      `}</style>
    </div>
  );
}
