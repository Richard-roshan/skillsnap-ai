import React, { useState } from 'react';
import { ChevronLeft, Download, FileText, Plus, Trash2, CheckCircle } from 'lucide-react';

export default function ResumeBuilderScreen({ onBack, showToast }) {
  const [personal, setPersonal] = useState({
    name: 'John Jonson',
    title: 'Junior React Developer',
    email: 'johnjonson@email.com',
    phone: '+1 (555) 019-2834',
    website: 'github.com/johnjonson',
    summary: 'Enthusiastic front-end developer with a passion for building interactive, responsive, and pixel-perfect web applications using React, JavaScript, and CSS.',
  });

  const [experience, setExperience] = useState([
    {
      id: 1,
      company: 'SkillSnap Tech',
      role: 'Frontend Intern',
      duration: 'Jan 2026 - Present',
      bullets: 'Collaborated on porting mobile screen layouts to responsive React web components. Improved rendering speeds by 15%.',
    }
  ]);

  const [education, setEducation] = useState([
    {
      id: 1,
      school: 'State Tech University',
      degree: 'B.S. in Computer Science',
      duration: '2022 - 2026',
    }
  ]);

  const [skills, setSkills] = useState(['React', 'JavaScript', 'HTML5 & CSS3', 'Git', 'Flutter', 'Dart']);
  const [newSkill, setNewSkill] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePersonalChange = (field, val) => {
    setPersonal(prev => ({ ...prev, [field]: val }));
  };

  const addExperience = () => {
    setExperience(prev => [
      ...prev,
      {
        id: Date.now(),
        company: 'New Company',
        role: 'Software Engineer',
        duration: '2026',
        bullets: 'Describe your accomplishments here.',
      }
    ]);
  };

  const removeExperience = (id) => {
    setExperience(prev => prev.filter(item => item.id !== id));
  };

  const editExperience = (id, field, val) => {
    setExperience(prev => prev.map(item => item.id === id ? { ...prev.find(x => x.id === id), [field]: val } : item));
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (!skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()]);
    }
    setNewSkill('');
  };

  const removeSkill = (skillToRemove) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      showToast('Resume PDF downloaded successfully!');
    }, 2000);
  };

  return (
    <div className="sub-screen fade-in">
      {/* Header */}
      <div className="app-bar">
        <button className="back-btn" onClick={onBack}>
          <ChevronLeft size={22} />
        </button>
        <h3 className="app-bar-title">Interactive Resume Builder</h3>
        <button className="download-btn-header" onClick={handleDownload} disabled={isDownloading}>
          {isDownloading ? <div className="mini-spinner" /> : <Download size={18} />}
        </button>
      </div>

      <div className="builder-split-container">
        {/* Left Form Panel */}
        <div className="builder-form-panel">
          <h4 className="panel-section-title">Personal Details</h4>
          
          <div className="form-grid">
            <div className="input-group-vertical">
              <label>Full Name</label>
              <input
                type="text"
                className="builder-input"
                value={personal.name}
                onChange={(e) => handlePersonalChange('name', e.target.value)}
              />
            </div>
            
            <div className="input-group-vertical">
              <label>Job Title</label>
              <input
                type="text"
                className="builder-input"
                value={personal.title}
                onChange={(e) => handlePersonalChange('title', e.target.value)}
              />
            </div>

            <div className="input-group-vertical">
              <label>Email</label>
              <input
                type="email"
                className="builder-input"
                value={personal.email}
                onChange={(e) => handlePersonalChange('email', e.target.value)}
              />
            </div>

            <div className="input-group-vertical">
              <label>Phone</label>
              <input
                type="text"
                className="builder-input"
                value={personal.phone}
                onChange={(e) => handlePersonalChange('phone', e.target.value)}
              />
            </div>

            <div className="input-group-vertical full-width">
              <label>Professional Bio Summary</label>
              <textarea
                className="builder-textarea"
                rows="3"
                value={personal.summary}
                onChange={(e) => handlePersonalChange('summary', e.target.value)}
              />
            </div>
          </div>

          <div className="section-divider" />

          {/* Work Experience */}
          <div className="section-header-row">
            <h4 className="panel-section-title">Work Experience</h4>
            <button className="add-btn-small" onClick={addExperience}>
              <Plus size={14} /> Add
            </button>
          </div>

          <div className="experience-list-builder">
            {experience.map((exp) => (
              <div key={exp.id} className="builder-card-item">
                <button className="delete-btn-card" onClick={() => removeExperience(exp.id)}>
                  <Trash2 size={14} />
                </button>
                <div className="form-grid">
                  <div className="input-group-vertical">
                    <label>Company</label>
                    <input
                      type="text"
                      className="builder-input"
                      value={exp.company}
                      onChange={(e) => editExperience(exp.id, 'company', e.target.value)}
                    />
                  </div>
                  <div className="input-group-vertical">
                    <label>Role</label>
                    <input
                      type="text"
                      className="builder-input"
                      value={exp.role}
                      onChange={(e) => editExperience(exp.id, 'role', e.target.value)}
                    />
                  </div>
                  <div className="input-group-vertical">
                    <label>Duration</label>
                    <input
                      type="text"
                      className="builder-input"
                      value={exp.duration}
                      onChange={(e) => editExperience(exp.id, 'duration', e.target.value)}
                    />
                  </div>
                  <div className="input-group-vertical full-width">
                    <label>Responsibilities</label>
                    <textarea
                      className="builder-textarea"
                      rows="2"
                      value={exp.bullets}
                      onChange={(e) => editExperience(exp.id, 'bullets', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="section-divider" />

          {/* Skills tags */}
          <h4 className="panel-section-title">Skills & Competencies</h4>
          <form onSubmit={addSkill} className="skill-input-row">
            <input
              type="text"
              placeholder="Add skill (e.g. TypeScript)"
              className="builder-input"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <button type="submit" className="add-btn-filled">Add</button>
          </form>
          
          <div className="skills-tags-container">
            {skills.map((skill, index) => (
              <span key={index} className="skill-tag-builder">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)}>×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Right Live Preview Panel */}
        <div className="builder-preview-panel">
          <div className="preview-label">LIVE PREVIEW</div>
          
          <div className="resume-sheet">
            {/* Sheet header */}
            <div className="sheet-header">
              <h2 className="sheet-name">{personal.name || 'Your Name'}</h2>
              <h4 className="sheet-title">{personal.title || 'Job Title'}</h4>
              <div className="sheet-contact">
                {personal.email && <span>{personal.email}</span>}
                {personal.phone && <span> • {personal.phone}</span>}
                {personal.website && <span> • {personal.website}</span>}
              </div>
            </div>

            {/* Profile Bio */}
            {personal.summary && (
              <div className="sheet-section">
                <h5 className="sheet-section-title">Professional Summary</h5>
                <p className="sheet-text">{personal.summary}</p>
              </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <div className="sheet-section">
                <h5 className="sheet-section-title">Experience</h5>
                {experience.map((exp) => (
                  <div key={exp.id} className="sheet-item">
                    <div className="sheet-item-header">
                      <span className="sheet-bold">{exp.role}</span>
                      <span className="sheet-italic">{exp.duration}</span>
                    </div>
                    <div className="sheet-company">{exp.company}</div>
                    <p className="sheet-text marg-t-4">{exp.bullets}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div className="sheet-section">
                <h5 className="sheet-section-title">Skills</h5>
                <div className="sheet-skills-row">
                  {skills.join(' • ')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .builder-split-container {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
          background-color: var(--bg-device);
        }
        
        @media (max-width: 900px) {
          .builder-split-container {
            grid-template-columns: 1fr;
            overflow-y: auto;
          }
          .builder-preview-panel {
            border-left: none;
            border-top: 1px solid var(--border-color);
            padding: 20px 16px;
          }
        }
        
        .builder-form-panel {
          padding: 24px;
          overflow-y: auto;
          scrollbar-width: thin;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .builder-preview-panel {
          padding: 24px;
          background-color: #f1f5f9;
          border-left: 1px solid var(--border-color);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        [data-theme="dark"] .builder-preview-panel {
          background-color: #0b0f19;
        }
        
        .preview-label {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 1px;
        }
        
        .download-btn-header {
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          padding: 6px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }
        .download-btn-header:hover {
          background-color: rgba(0,0,0,0.05);
        }
        
        .panel-section-title {
          font-size: 1rem;
          font-weight: 800;
          color: var(--primary);
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        
        .input-group-vertical {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .input-group-vertical.full-width {
          grid-column: span 2;
        }
        
        .input-group-vertical label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-secondary);
        }
        
        .builder-input {
          height: 38px;
          padding: 0 12px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-card);
          color: var(--text-primary);
          border-radius: var(--radius-sm);
          outline: none;
          font-size: 0.88rem;
        }
        .builder-input:focus {
          border-color: var(--primary);
        }
        
        .builder-textarea {
          padding: 10px 12px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-card);
          color: var(--text-primary);
          border-radius: var(--radius-sm);
          outline: none;
          resize: vertical;
          font-size: 0.88rem;
        }
        .builder-textarea:focus {
          border-color: var(--primary);
        }
        
        .section-divider {
          height: 1px;
          background-color: var(--border-color);
          margin: 8px 0;
        }
        
        .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .add-btn-small {
          background: none;
          border: 1px solid var(--primary);
          color: var(--primary);
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: var(--transition);
        }
        .add-btn-small:hover {
          background-color: rgba(77, 141, 255, 0.08);
        }
        
        .builder-card-item {
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 14px;
          position: relative;
          margin-bottom: 12px;
        }
        
        .delete-btn-card {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }
        .delete-btn-card:hover {
          color: var(--danger);
        }
        
        .skill-input-row {
          display: flex;
          gap: 8px;
        }
        .skill-input-row .builder-input {
          flex: 1;
        }
        
        .add-btn-filled {
          background-color: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius-sm);
          padding: 0 16px;
          font-weight: 700;
          cursor: pointer;
        }
        
        .skills-tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }
        
        .skill-tag-builder {
          background-color: var(--input-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 4px 10px;
          font-size: 0.78rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .skill-tag-builder button {
          background: none;
          border: none;
          color: var(--text-muted);
          font-weight: 800;
          cursor: pointer;
          font-size: 0.9rem;
          line-height: 1;
        }
        
        .skill-tag-builder button:hover {
          color: var(--danger);
        }
        
        /* RESUME SHEET PAPER */
        .resume-sheet {
          background-color: #ffffff;
          box-shadow: 0 10px 25px rgba(0,0,0,0.06);
          border: 1px solid #cbd5e1;
          width: 100%;
          max-width: 500px;
          aspect-ratio: 1 / 1.414; /* Standard A4 ratio */
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          color: #1e293b;
        }
        
        .sheet-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          border-bottom: 2px solid #475569;
          padding-bottom: 12px;
        }
        
        .sheet-name {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
        }
        
        .sheet-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #3b82f6;
          margin-top: 2px;
        }
        
        .sheet-contact {
          font-size: 0.72rem;
          color: #64748b;
          margin-top: 4px;
        }
        
        .sheet-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .sheet-section-title {
          font-size: 0.8rem;
          font-weight: 800;
          color: #475569;
          text-transform: uppercase;
          border-bottom: 1px solid #cbd5e1;
          padding-bottom: 3px;
          letter-spacing: 0.5px;
        }
        
        .sheet-text {
          font-size: 0.78rem;
          line-height: 1.4;
          color: #334155;
          text-align: justify;
        }
        
        .sheet-item {
          display: flex;
          flex-direction: column;
          margin-bottom: 4px;
        }
        
        .sheet-item-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
        }
        
        .sheet-bold { font-weight: 700; color: #0f172a; }
        .sheet-italic { font-style: italic; color: #64748b; }
        
        .sheet-company {
          font-size: 0.72rem;
          font-weight: 600;
          color: #475569;
        }
        
        .sheet-skills-row {
          font-size: 0.78rem;
          color: #334155;
          text-align: center;
          font-weight: 500;
        }
        
        .marg-t-4 { margin-top: 4px; }
        
        .mini-spinner {
          width: 14px;
          height: 14px;
          border: 1.5px solid rgba(0,0,0,0.1);
          border-top: 1.5px solid currentColor;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
}
