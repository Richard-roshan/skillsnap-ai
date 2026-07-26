import React, { useState } from 'react';
import { ChevronLeft, FileText, Upload, RefreshCw, Check, AlertTriangle, Play } from 'lucide-react';

export default function ResumeAnalyzerScreen({ onBack, showToast }) {
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  const [report, setReport] = useState(null);

  const startScan = (name = 'Pasted Resume Text') => {
    setFileName(name);
    setAnalyzing(true);
    setReport(null);
    
    const statuses = [
      'Reading resume elements...',
      'Extracting section tags...',
      'Running keyword alignment queries...',
      'Assessing ATS styling standards...',
      'Calculating final scorecard metrics...'
    ];

    let current = 0;
    setScanStatus(statuses[0]);
    
    const interval = setInterval(() => {
      current += 1;
      if (current < statuses.length) {
        setScanStatus(statuses[current]);
      } else {
        clearInterval(interval);
        setAnalyzing(false);
        setReport({
          score: 84,
          strengths: [
            'Clean chronological section structure matches parser defaults.',
            'Strong density of frontend development keywords (React, JavaScript, CSS).',
            'Solid bullet action verb starters ("Collaborated", "Improved", "Ported").'
          ],
          improvements: [
            'Add LinkedIn or GitHub hyperlinks to header to boost contact scorecard.',
            'Missing database keywords. Consider adding "SQL", "Postgres", or "MongoDB" context if applicable.',
            'Shorten summary bio block to 3 sentences max for improved parsing readability.'
          ]
        });
        showToast('Resume analysis completed!');
      }
    }, 800);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      startScan(file.name);
    }
  };

  const handleScanText = (e) => {
    e.preventDefault();
    if (!resumeText.trim()) return;
    startScan();
  };

  // Dash offset for score circle
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = report ? circumference - (report.score / 100) * circumference : circumference;

  return (
    <div className="sub-screen fade-in">
      {/* App Bar */}
      <div className="app-bar">
        <button className="back-btn" onClick={onBack}>
          <ChevronLeft size={22} />
        </button>
        <h3 className="app-bar-title">AI Resume Analyzer</h3>
        <div style={{ width: 22 }} />
      </div>

      <div className="sub-screen-content analyzer-scroll">
        {!analyzing && !report && (
          <div className="analyzer-upload-panel">
            {/* Drag & drop */}
            <div className="upload-dropzone">
              <Upload size={38} className="upload-icon" />
              <h4>Upload PDF or Docx Resume</h4>
              <p>Drag and drop your file here, or click to browse</p>
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                id="file-select"
                className="hidden-file-input"
                onChange={handleFileUpload}
              />
              <label htmlFor="file-select" className="browse-btn">
                Browse Files
              </label>
            </div>

            <div className="or-divider">
              <span>OR PASTE TEXT</span>
            </div>

            {/* Paste text form */}
            <form onSubmit={handleScanText} className="paste-text-form">
              <textarea
                placeholder="Paste the plain text of your resume here to scan..."
                rows="6"
                className="paste-textarea"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
              <button
                type="submit"
                className="btn-primary scan-submit-btn"
                disabled={!resumeText.trim()}
              >
                <Play size={16} fill="currentColor" />
                <span>Scan Resume Text</span>
              </button>
            </form>
          </div>
        )}

        {/* Loading Scanner Animation */}
        {analyzing && (
          <div className="scanner-loading-view">
            <div className="scanner-graphic-box">
              <FileText size={48} className="scanner-file-icon" />
              <div className="scanning-laser-bar" />
            </div>
            <h4 className="scanning-label">Scanning {fileName}...</h4>
            <p className="scanner-status-text">{scanStatus}</p>
          </div>
        )}

        {/* Audit Report Result */}
        {report && (
          <div className="analyzer-report-view fade-in">
            {/* Scorecard row */}
            <div className="card-premium score-overview-card">
              <div className="score-radial-group">
                <svg width="110" height="110" className="radial-score-svg">
                  <circle
                    cx="55"
                    cy="55"
                    r={radius}
                    className="radial-score-bg"
                    strokeWidth="8"
                  />
                  <circle
                    cx="55"
                    cy="55"
                    r={radius}
                    className="radial-score-fill"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className="score-text-overlay">
                  <span className="big-score">{report.score}</span>
                  <span className="max-score">/100</span>
                </div>
              </div>
              
              <div className="score-metadata">
                <h4>ATS Compatibility Score</h4>
                <p>Great match! Your resume structure is highly compatible with industry-standard applicant tracking system formats.</p>
                <button className="re-scan-btn" onClick={() => setReport(null)}>
                  <RefreshCw size={14} /> Re-scan Resume
                </button>
              </div>
            </div>

            {/* Strengths card */}
            <div className="card-premium strengths-card">
              <h4 className="audit-section-title green-text">
                <Check size={18} /> Strengths
              </h4>
              <ul className="audit-list">
                {report.strengths.map((str, idx) => (
                  <li key={idx}>{str}</li>
                ))}
              </ul>
            </div>

            {/* Improvements card */}
            <div className="card-premium improvements-card">
              <h4 className="audit-section-title orange-text">
                <AlertTriangle size={18} /> Improvements Needed
              </h4>
              <ul className="audit-list">
                {report.improvements.map((imp, idx) => (
                  <li key={idx}>{imp}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .analyzer-scroll {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .analyzer-upload-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .upload-dropzone {
          background-color: var(--bg-card);
          border: 2px dashed var(--input-border);
          border-radius: var(--radius-lg);
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 8px;
          transition: var(--transition);
        }
        .upload-dropzone:hover {
          border-color: var(--primary);
          background-color: rgba(77, 141, 255, 0.02);
        }
        
        .upload-icon {
          color: var(--text-muted);
        }
        
        .hidden-file-input {
          display: none;
        }
        
        .browse-btn {
          margin-top: 10px;
          padding: 10px 24px;
          background-color: var(--primary);
          color: white;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: 0 4px 10px rgba(77,141,255,0.15);
        }
        .browse-btn:hover {
          transform: translateY(-1px);
        }
        
        .or-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 1px;
        }
        .or-divider::before, .or-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background-color: var(--border-color);
          margin: 0 12px;
        }
        
        .paste-text-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .paste-textarea {
          width: 100%;
          padding: 14px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-card);
          color: var(--text-primary);
          border-radius: var(--radius-md);
          outline: none;
          font-size: 0.88rem;
          resize: vertical;
        }
        .paste-textarea:focus {
          border-color: var(--primary);
        }
        
        .scan-submit-btn {
          align-self: flex-end;
        }
        
        /* SCANNING LOADER */
        .scanner-loading-view {
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 60px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
        }
        
        .scanner-graphic-box {
          position: relative;
          width: 100px;
          height: 120px;
          border: 1px solid var(--border-color);
          background-color: var(--input-bg);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }
        
        .scanner-file-icon {
          color: var(--text-muted);
        }
        
        .scanning-laser-bar {
          position: absolute;
          width: 100%;
          height: 4px;
          background-color: #ea4335;
          box-shadow: 0 0 8px #ea4335, 0 0 16px #ea4335;
          animation: scanVertical 2s infinite ease-in-out;
        }
        
        @keyframes scanVertical {
          0% { top: 0; }
          50% { top: calc(100% - 4px); }
          100% { top: 0; }
        }
        
        .scanning-label {
          font-size: 1.1rem;
          font-weight: 800;
        }
        
        .scanner-status-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        
        /* REPORT VIEW */
        .analyzer-report-view {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .score-overview-card {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        @media (max-width: 480px) {
          .score-overview-card {
            flex-direction: column;
            text-align: center;
          }
        }
        
        .score-radial-group {
          position: relative;
          width: 110px;
          height: 110px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .radial-score-svg {
          transform: rotate(-90deg);
        }
        
        .radial-score-bg {
          fill: none;
          stroke: rgba(0,0,0,0.05);
        }
        [data-theme="dark"] .radial-score-bg {
          stroke: rgba(255,255,255,0.08);
        }
        
        .radial-score-fill {
          fill: none;
          stroke: #8b5cf6;
          stroke-linecap: round;
          transition: stroke-dashoffset 1s ease-out;
        }
        
        .score-text-overlay {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 1;
        }
        
        .big-score {
          font-size: 26px;
          font-weight: 800;
        }
        
        .max-score {
          font-size: 11px;
          color: var(--text-secondary);
          margin-top: 2px;
        }
        
        .score-metadata {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }
        @media (max-width: 480px) {
          .score-metadata {
            align-items: center;
          }
        }
        
        .score-metadata h4 {
          font-size: 1.1rem;
          font-weight: 800;
        }
        
        .score-metadata p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
        
        .re-scan-btn {
          margin-top: 4px;
          background: none;
          border: 1px solid var(--border-color);
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: var(--transition);
        }
        .re-scan-btn:hover {
          background-color: var(--input-bg);
        }
        
        .audit-section-title {
          font-size: 1rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .green-text { color: var(--success); }
        .orange-text { color: var(--warning); }
        
        .audit-list {
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .audit-list li {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }
      `}</style>
    </div>
  );
}
