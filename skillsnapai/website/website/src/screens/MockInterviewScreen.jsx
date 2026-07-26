import React, { useState } from 'react';
import { ChevronLeft, Send, Mic, Sparkles, AlertCircle, PlayCircle } from 'lucide-react';

const QUESTIONS = {
  react: [
    "What is the virtual DOM in React and how does it optimize rendering performance?",
    "Explain the difference between state and props, and how data flows in a React tree.",
    "What is the hook dependency array? What happens if you omit it in useEffect?"
  ],
  flutter: [
    "What is the difference between StatefulWidget and StatelessWidget?",
    "How does Flutter render graphics onto canvas sheets? (Skia/Impeller)",
    "Explain Provider state management and context.read vs context.watch."
  ]
};

export default function MockInterviewScreen({ onBack, showToast }) {
  const [role, setRole] = useState('react');
  const [difficulty, setDifficulty] = useState('mid');
  const [started, setStarted] = useState(false);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [scoreReport, setScoreReport] = useState(null);
  const [messages, setMessages] = useState([]);

  const activeQuestions = QUESTIONS[role] || QUESTIONS.react;

  const handleStart = () => {
    setStarted(true);
    setCurrentQuestionIndex(0);
    setScoreReport(null);
    setUserAnswer('');
    
    // Set first AI message
    setMessages([
      {
        sender: 'ai',
        text: `Welcome to the ${role.toUpperCase()} Mock Interview. I am your AI Recruiter. Let's start with the first question: \n\n"${activeQuestions[0]}"`
      }
    ]);
  };

  const handleMicSimulate = () => {
    showToast('Simulating microphone transcription...');
    setTimeout(() => {
      setUserAnswer('Virtual DOM is a lightweight copy of the real DOM. When state changes, React updates the virtual DOM first, compares it with the previous snapshot (diffing), and then batch-updates only the changed elements in the real DOM, avoiding heavy layout repaints.');
    }, 1500);
  };

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    // Add user message
    const updatedMessages = [
      ...messages,
      { sender: 'user', text: userAnswer }
    ];
    setMessages(updatedMessages);
    setAnalyzing(true);

    // Mock AI analysis
    setTimeout(() => {
      setAnalyzing(false);
      
      const score = userAnswer.toLowerCase().includes('diffing') && userAnswer.toLowerCase().includes('real dom') ? 9.2 : 7.5;
      const report = {
        score: score,
        strengths: score >= 9.0 
          ? 'Clear technical understanding of DOM virtual structures, layout paint savings, and diffing algorithms.'
          : 'Good high-level definition of state copies, though missing references to the reconciliation/diffing processes.',
        improvement: 'Incorporate references to "Reconciliation" and "Batch Updates" to show senior-level depth.',
        sampleAnswer: 'The Virtual DOM is an in-memory representation of the Real DOM. React uses it to compute minimum difference sets (Reconciliation) and batch updates the screen, reducing expensive repaint operations.'
      };

      setScoreReport(report);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Analysis complete. You scored ${report.score}/10. Review your feedback below, and click Next to proceed.`
        }
      ]);
    }, 1800);
  };

  const handleNext = () => {
    const nextIdx = currentQuestionIndex + 1;
    if (nextIdx < activeQuestions.length) {
      setCurrentQuestionIndex(nextIdx);
      setScoreReport(null);
      setUserAnswer('');
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Question ${nextIdx + 1}: \n\n"${activeQuestions[nextIdx]}"`
        }
      ]);
    } else {
      showToast('Interview completed!');
      setStarted(false);
    }
  };

  return (
    <div className="sub-screen fade-in">
      {/* App Bar */}
      <div className="app-bar">
        <button className="back-btn" onClick={onBack}>
          <ChevronLeft size={22} />
        </button>
        <h3 className="app-bar-title">AI Mock Interview</h3>
        <div style={{ width: 22 }} />
      </div>

      <div className="sub-screen-content interview-scroll">
        {!started ? (
          /* Configuration Setup */
          <div className="interview-setup card-premium fade-in">
            <h4 className="setup-title">Setup Mock Interview</h4>
            <p className="setup-desc">Practice answering technical questions and receive detailed evaluation scores.</p>
            
            <div className="form-grid-vertical">
              <div className="input-group-vertical">
                <label>Target Language/Role</label>
                <select className="roadmap-select" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="react">React Developer</option>
                  <option value="flutter">Flutter Developer</option>
                </select>
              </div>

              <div className="input-group-vertical">
                <label>Difficulty Tier</label>
                <select className="roadmap-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="junior">Junior (Entry)</option>
                  <option value="mid">Mid-Level (Intermediate)</option>
                  <option value="senior">Senior (Advanced)</option>
                </select>
              </div>

              <button className="btn-primary start-interview-btn" onClick={handleStart}>
                <PlayCircle size={18} fill="currentColor" />
                <span>Start Practice Interview</span>
              </button>
            </div>
          </div>
        ) : (
          /* Conversational Interface */
          <div className="interview-chat-view fade-in">
            {/* Messages box */}
            <div className="chat-log-box">
              {messages.map((msg, idx) => (
                <div key={idx} className={`chat-bubble-row ${msg.sender}`}>
                  <div className={`chat-bubble ${msg.sender}`}>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
              
              {analyzing && (
                <div className="chat-bubble-row ai">
                  <div className="chat-bubble ai pulse">
                    <span className="spinner-dots">Evaluating response...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Answer Score Card */}
            {scoreReport && (
              <div className="card-premium feedback-report-card fade-in">
                <div className="feedback-score-header">
                  <Sparkles size={16} className="feedback-spark" />
                  <h4>Feedback (Score: {scoreReport.score}/10)</h4>
                </div>
                <div className="feedback-content">
                  <p><strong>Strengths:</strong> {scoreReport.strengths}</p>
                  <p className="marg-t-4"><strong>Key Improvements:</strong> {scoreReport.improvement}</p>
                  <p className="sample-ans-block marg-t-8">
                    <strong>Model Answer:</strong> {scoreReport.sampleAnswer}
                  </p>
                </div>
                
                <button className="btn-primary next-question-btn" onClick={handleNext}>
                  Next Question
                </button>
              </div>
            )}

            {/* Form Input footer */}
            {!scoreReport && !analyzing && (
              <form onSubmit={handleSubmitAnswer} className="chat-input-bar">
                <input
                  type="text"
                  placeholder="Type your answer here..."
                  className="chat-text-input"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                />
                
                <button type="button" className="chat-mic-btn" onClick={handleMicSimulate} title="Simulate Speech-to-Text">
                  <Mic size={18} />
                </button>

                <button type="submit" className="chat-send-btn" disabled={!userAnswer.trim()}>
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      <style>{`
        .interview-scroll {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 126px); /* subtract header height */
          overflow: hidden;
          padding: 24px;
        }
        
        .interview-setup {
          max-width: 450px;
          margin: 40px auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .setup-title {
          font-size: 1.2rem;
          font-weight: 800;
        }
        
        .setup-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }
        
        .form-grid-vertical {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        
        .start-interview-btn {
          margin-top: 10px;
        }
        
        /* CHAT VIEW */
        .interview-chat-view {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }
        
        .chat-log-box {
          flex: 1;
          overflow-y: auto;
          padding-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          scrollbar-width: thin;
        }
        .chat-log-box::-webkit-scrollbar {
          width: 4px;
        }
        
        .chat-bubble-row {
          display: flex;
          width: 100%;
        }
        .chat-bubble-row.ai { justify-content: flex-start; }
        .chat-bubble-row.user { justify-content: flex-end; }
        
        .chat-bubble {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          font-size: 0.88rem;
          line-height: 1.45;
          white-space: pre-line;
        }
        .chat-bubble.ai {
          background-color: var(--bg-card);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          border-bottom-left-radius: 2px;
        }
        .chat-bubble.user {
          background-color: var(--primary);
          color: #ffffff;
          border-bottom-right-radius: 2px;
        }
        
        .chat-bubble.pulse {
          animation: pulseAnimate 1.5s infinite alternate;
        }
        
        @keyframes pulseAnimate {
          from { opacity: 0.6; }
          to { opacity: 1; }
        }
        
        .spinner-dots {
          color: var(--text-muted);
          font-style: italic;
        }
        
        /* FEEDBACK CARD */
        .feedback-report-card {
          margin-top: 10px;
          margin-bottom: 10px;
          border-left: 4px solid var(--accent-purple);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .feedback-score-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .feedback-score-header h4 {
          font-size: 0.95rem;
          font-weight: 800;
        }
        .feedback-spark {
          color: var(--accent-purple);
        }
        
        .feedback-content {
          font-size: 0.8rem;
          line-height: 1.45;
          color: var(--text-secondary);
        }
        
        .sample-ans-block {
          background-color: var(--input-bg);
          padding: 10px;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
        }
        
        .next-question-btn {
          height: 38px;
          font-size: 0.85rem;
          align-self: flex-end;
        }
        
        /* INPUT PANEL FOOTER */
        .chat-input-bar {
          height: 52px;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 26px;
          padding: 0 8px 0 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: var(--shadow-sm);
          flex-shrink: 0;
        }
        
        .chat-text-input {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          height: 100%;
          font-size: 0.88rem;
          color: var(--text-primary);
        }
        
        .chat-mic-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }
        .chat-mic-btn:hover {
          color: var(--primary);
          background-color: var(--input-bg);
        }
        
        .chat-send-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: var(--primary);
          border: none;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }
        .chat-send-btn:hover {
          transform: scale(1.05);
        }
        .chat-send-btn:disabled {
          background-color: var(--border-color);
          cursor: not-allowed;
          transform: none;
        }
      `}</style>
    </div>
  );
}
