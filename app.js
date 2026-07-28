// SkillSnap AI Application JavaScript Controller

// Real-time WebSocket Connection Handle
let liveSyncSocket = null;
const CURRENT_USER_ID = 1;

// Initialize Lucide Icons, Components & Live Sync
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }
  initHoursChart();
  initTheme();
  initWebSocketSync();
});

// --- Real-Time WebSocket Live Sync (Website <-> Mobile) ---
function initWebSocketSync() {
  const wsHost = window.location.hostname || 'localhost';
  const wsUrl = `ws://${wsHost}:8000/ws/${CURRENT_USER_ID}`;

  try {
    liveSyncSocket = new WebSocket(wsUrl);

    liveSyncSocket.onopen = () => {
      console.log('⚡ Connected to SkillSnap Real-Time Sync Service');
    };

    liveSyncSocket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        console.log('⚡ Real-time Event Received from Mobile:', payload);
        if (payload.event === 'MOBILE_UPDATE' || payload.event === 'DATA_UPDATED') {
          showToast(`📱 Live Sync: ${payload.data.message || 'Data updated on Mobile!'}`, 'success');
        }
      } catch (err) {
        console.warn('Failed to parse WebSocket message', err);
      }
    };

    liveSyncSocket.onerror = (err) => {
      console.warn('WebSocket sync notice: Local server connecting...', err);
    };

    liveSyncSocket.onclose = () => {
      setTimeout(initWebSocketSync, 5000); // Auto reconnect
    };
  } catch (e) {
    console.warn('WebSocket init exception:', e);
  }
}

function emitLiveSyncUpdate(eventType, data) {
  const payload = {
    user_id: CURRENT_USER_ID,
    event: eventType,
    data: data,
    timestamp: new Date().toISOString()
  };

  if (liveSyncSocket && liveSyncSocket.readyState === WebSocket.OPEN) {
    liveSyncSocket.send(JSON.stringify(payload));
  } else {
    // Fallback HTTP POST broadcast
    const apiHost = window.location.hostname || 'localhost';
    fetch(`http://${apiHost}:8000/sync/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: CURRENT_USER_ID,
        event_type: eventType,
        data: data
      })
    }).catch(err => console.warn('Sync broadcast fallback error:', err));
  }
}

// --- Toast Notification System ---
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}" style="width:18px; height:18px;"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// --- Theme Switcher ---
function initTheme() {
  const savedTheme = localStorage.getItem('skillsnap_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('skillsnap_theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) {
    themeIcon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
    if (window.lucide) lucide.createIcons();
  }
}

// --- Tab Router ---
function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`tab-${tabId}`);
  if (activeBtn) activeBtn.classList.add('active');

  document.querySelectorAll('.tab-content').forEach(view => view.classList.remove('active'));
  const activeView = document.getElementById(`view-${tabId}`);
  if (activeView) activeView.classList.add('active');

  if (window.lucide) lucide.createIcons();
}

// --- Global Search Filter ---
function handleSearch(query) {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return;

  if (cleanQuery.includes('resume') || cleanQuery.includes('ats') || cleanQuery.includes('builder')) {
    switchTab('mentorship');
  } else if (cleanQuery.includes('course') || cleanQuery.includes('full stack') || cleanQuery.includes('lesson')) {
    switchTab('courses');
  } else if (cleanQuery.includes('interview') || cleanQuery.includes('mock')) {
    switchTab('interviews');
  }
}

// --- Analytics Chart (Chart.js) ---
let hoursChartInstance = null;

function initHoursChart() {
  const ctx = document.getElementById('hoursChart');
  if (!ctx) return;

  if (hoursChartInstance) {
    hoursChartInstance.destroy();
  }

  hoursChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Design (Hours)',
          data: [4, 6, 8, 5, 9, 7, 11],
          backgroundColor: '#10b981',
          borderRadius: 6
        },
        {
          label: 'Management (Hours)',
          data: [2, 1, 3, 2, 4, 3, 5],
          backgroundColor: '#a855f7',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#94a3b8',
            font: { family: 'Plus Jakarta Sans', size: 12 }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8' }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8' }
        }
      }
    }
  });
}

// --- Subpill Tab Switcher for Resume Hub ---
function switchResumeMode(mode) {
  document.getElementById('subpill-ats').classList.remove('active');
  document.getElementById('subpill-builder').classList.remove('active');
  document.getElementById(`subpill-${mode}`).classList.add('active');

  if (mode === 'ats') {
    document.getElementById('mode-resume-ats').style.display = 'grid';
    document.getElementById('mode-resume-builder').style.display = 'none';
  } else {
    document.getElementById('mode-resume-ats').style.display = 'none';
    document.getElementById('mode-resume-builder').style.display = 'grid';
    updateResumePreview();
  }
}

// --- Resume Builder Studio Logic ---
function updateResumePreview() {
  const name = document.getElementById('builder-name').value;
  const title = document.getElementById('builder-title').value;
  const contact = document.getElementById('builder-contact').value;
  const summary = document.getElementById('builder-summary').value;
  const experience = document.getElementById('builder-experience').value;
  const skills = document.getElementById('builder-skills').value;

  if (document.getElementById('pv-name')) document.getElementById('pv-name').innerText = name || 'John Jonson';
  if (document.getElementById('pv-title')) document.getElementById('pv-title').innerText = title || 'Target Title';
  if (document.getElementById('pv-contact')) document.getElementById('pv-contact').innerText = contact || 'Email & Phone';
  if (document.getElementById('pv-summary')) document.getElementById('pv-summary').innerText = summary || 'Summary...';
  if (document.getElementById('pv-experience')) document.getElementById('pv-experience').innerText = experience || 'Experience...';
  if (document.getElementById('pv-skills')) document.getElementById('pv-skills').innerText = skills || 'Skills...';
}

function generateAISummary() {
  const title = document.getElementById('builder-title').value;
  const aiSummaries = [
    `Results-driven ${title || 'Software Engineer'} specializing in high-performance Web applications, RESTful APIs, and cloud services. Proven track record of improving system uptime by 30% and leading user-centric feature rollouts.`,
    `Creative ${title || 'UI/UX Designer'} with expertise in design systems, interactive prototypes, and WCAG accessibility standards. Experienced in delivering seamless digital products.`,
    `Strategic ${title || 'Product Lead'} skilled in cross-functional team leadership, product roadmap prioritization, and data-driven engagement optimization.`
  ];
  const summaryText = aiSummaries[Math.floor(Math.random() * aiSummaries.length)];
  document.getElementById('builder-summary').value = summaryText;
  updateResumePreview();
  showToast('AI Professional Summary Generated!', 'success');
}

function printResumePDF() {
  showToast('Preparing PDF document for print/download...', 'info');
  setTimeout(() => {
    window.print();
  }, 500);
}

// --- ATS Resume Analyzer Engine ---
function handleResumeUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('resume-text-input').value = `[Uploaded File: ${file.name}]\n` + e.target.result.slice(0, 500);
      analyzeResumeText();
    };
    reader.readAsText(file);
  }
}

function analyzeResumeText() {
  const text = document.getElementById('resume-text-input').value.trim();
  let atsScore = 85;
  let grammarScore = 92;
  let keywordScore = 78;
  let formattingScore = 90;

  if (text.length > 50) {
    const containsTech = /react|python|flutter|fastapi|sql|node|aws|docker|ui|ux/i.test(text);
    const containsMetrics = /\d+%|\$\d+|\d+x|improved|built|managed/i.test(text);

    atsScore = containsTech && containsMetrics ? 94 : containsTech ? 88 : 76;
    keywordScore = containsTech ? 90 : 65;
    grammarScore = 95;
    formattingScore = 88;
  }

  document.getElementById('score-ats').innerText = `${atsScore}%`;
  document.getElementById('score-grammar').innerText = `${grammarScore}%`;
  document.getElementById('score-keywords').innerText = `${keywordScore}%`;
  document.getElementById('score-formatting').innerText = `${formattingScore}%`;

  document.getElementById('overall-ats-badge').innerText = `Score: ${atsScore}/100`;

  if (atsScore >= 90) {
    document.getElementById('ats-strengths').innerText = 'Exceptional resume! Highly optimized for ATS scanners with strong keywords and quantified impacts.';
    document.getElementById('ats-suggestions').innerText = 'Minor recommendation: Ensure your LinkedIn URL and GitHub project links are hyperlinked cleanly.';
  } else {
    document.getElementById('ats-strengths').innerText = 'Good foundational structure, clear contact header, and technical skills listed.';
    document.getElementById('ats-suggestions').innerText = 'Include more high-impact metric statistics (e.g. "Increased engagement by 25%") and explicit frameworks like React, FastAPI, or Flutter.';
  }

  showToast(`ATS Analysis Complete! Score: ${atsScore}/100`, 'success');
}

// --- Interactive Skill Assessment Quiz ---
function startSkillQuiz() {
  const scoreGained = Math.floor(Math.random() * 5) + 3; // 3-7% increase
  const currentVal = parseInt(document.getElementById('skill-val-mgmt').innerText) || 30;
  const newVal = Math.min(100, currentVal + scoreGained);

  document.getElementById('skill-val-mgmt').innerText = `${newVal}%`;
  document.getElementById('skill-bar-mgmt').style.width = `${newVal}%`;

  const lessonVal = parseInt(document.getElementById('stat-lessons-val').innerText) || 10;
  document.getElementById('stat-lessons-val').innerText = lessonVal + 1;

  showToast(`Quiz Passed! Management Skill increased by +${scoreGained}%`, 'success');
}

// --- Course Video Player Engine ---
function toggleVideoPlayback() {
  const video = document.getElementById('main-course-video');
  if (!video) return;

  if (video.paused) {
    video.play().then(() => {
      showToast('Video Playing...', 'info');
    }).catch(err => console.warn('Video play deferred:', err));
  } else {
    video.pause();
    showToast('Video Paused', 'info');
  }
}

function handleVideoPlayState(isPlaying) {
  showToast(isPlaying ? 'Video Playing' : 'Video Paused', 'info');
}

function updateVideoTimeTracker() {
  const video = document.getElementById('main-course-video');
  const playerTime = document.getElementById('player-time');
  if (!video || !playerTime) return;

  const currentMins = Math.floor(video.currentTime / 60);
  const currentSecs = Math.floor(video.currentTime % 60).toString().padStart(2, '0');
  const durationMins = Math.floor((video.duration || 750) / 60);
  const durationSecs = Math.floor((video.duration || 750) % 60).toString().padStart(2, '0');

  playerTime.innerText = `${currentMins}:${currentSecs} / ${durationMins}:${durationSecs}`;
}

function openCoursePlayer(courseId) {
  switchTab('courses');
  if (courseId === 1) {
    selectLesson(1, '1. Introduction to Full Stack Architecture', '12:30', 'Learn modern architecture patterns and client-server setups.', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  } else if (courseId === 2) {
    selectLesson(2, '2. Database Modeling & Fast APIs', '18:45', 'Design relational schemas, SQL queries, and FastAPI endpoints.', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  }
}

function selectLesson(index, title, duration, description, videoUrl) {
  document.querySelectorAll('.lesson-item').forEach((item, idx) => {
    if (idx === index - 1) {
      item.classList.add('active');
      const icon = item.querySelector('i');
      if (icon) {
        icon.setAttribute('data-lucide', 'play-circle');
        icon.style.color = 'var(--accent-primary)';
      }
    } else {
      item.classList.remove('active');
    }
  });

  const video = document.getElementById('main-course-video');
  const playerTitle = document.getElementById('player-title');
  const playerTime = document.getElementById('player-time');
  const lessonHeader = document.getElementById('lesson-header-title');
  const lessonDesc = document.getElementById('lesson-desc');

  if (playerTitle) playerTitle.innerText = title;
  if (playerTime) playerTime.innerText = `00:00 / ${duration}`;
  if (lessonHeader) lessonHeader.innerText = title;
  if (lessonDesc) lessonDesc.innerText = description;

  if (video && videoUrl) {
    video.src = videoUrl;
    video.load();
    video.play().catch(err => console.log('Autoplay deferred:', err));
  }

  if (window.lucide) lucide.createIcons();
  showToast(`Loaded Lesson: ${title}`, 'success');
}

function markLessonComplete() {
  const lessonVal = parseInt(document.getElementById('stat-lessons-val').innerText) || 10;
  document.getElementById('stat-lessons-val').innerText = lessonVal + 1;
  showToast('Lesson marked as complete! +1 Lesson Progress', 'success');
}

// --- AI Mock Interview Studio ---
const interviewQuestions = {
  'Full Stack Engineer': [
    "How do you optimize database query performance for high-traffic API endpoints?",
    "Explain the difference between SQL transactions and NoSQL eventual consistency.",
    "How do you handle state management across large frontend applications?"
  ],
  'UI/UX Designer': [
    "Walk me through your design system creation process from scratch.",
    "How do you balance user accessibility standards (WCAG) with modern aesthetics?",
    "How do you evaluate micro-interactions and usability testing feedback?"
  ],
  'Product Manager': [
    "How do you prioritize feature roadmaps when technical debt competes with business demands?",
    "Describe how you define key performance metrics for an AI-based product.",
    "How do you resolve conflict between engineering and executive stakeholders?"
  ]
};

let currentRole = 'Full Stack Engineer';
let currentQuestionIndex = 0;

function selectInterviewRole(roleName, category) {
  currentRole = roleName;
  currentQuestionIndex = 0;

  document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');

  document.getElementById('interview-role-badge').innerText = roleName;
  updateQuestionText();
}

function updateQuestionText() {
  const qList = interviewQuestions[currentRole] || interviewQuestions['Full Stack Engineer'];
  document.getElementById('interview-question-text').innerText = `"${qList[currentQuestionIndex]}"`;
}

function simulateSpeechInput() {
  const sampleAnswers = [
    "I optimize database performance by adding indexes on frequently queried columns, using Redis caching for GET requests, and implementing pagination.",
    "I focus on establishing clear color contrast tokens, semantic HTML elements, and conducting iterative user usability testing.",
    "I prioritize features by measuring ROI, user retention impact, and engineering complexity using the RICE framework."
  ];

  const answerInput = document.getElementById('interview-answer-input');
  answerInput.value = sampleAnswers[Math.floor(Math.random() * sampleAnswers.length)];
  showToast('Speech recorded successfully!', 'info');
}

function submitInterviewAnswer() {
  const answer = document.getElementById('interview-answer-input').value.trim();
  const feedbackBox = document.getElementById('interview-feedback-box');

  if (!answer) {
    showToast('Please enter or record an answer before submitting.', 'info');
    return;
  }

  feedbackBox.style.display = 'block';
  
  const score = Math.floor(Math.random() * 15) + 85;
  document.getElementById('ai-interview-score').innerText = `Score: ${score}/100`;
  document.getElementById('ai-interview-feedback-text').innerText = 
    `Great structured response! You clearly articulated your technical reasoning. Score: ${score}/100. Key strength: Excellent terminology usage.`;

  showToast(`Interview Evaluation Completed! Score: ${score}/100`, 'success');
}

// --- Floating AI Assistant Chatbot ---
function toggleChatModal() {
  const chatModal = document.getElementById('chat-modal');
  if (chatModal) {
    chatModal.classList.toggle('open');
  }
}

function sendChatMessage() {
  const chatInput = document.getElementById('chat-input');
  const text = chatInput.value.trim();
  if (!text) return;

  const container = document.getElementById('chat-messages-container');

  const userMsg = document.createElement('div');
  userMsg.className = 'msg user';
  userMsg.innerText = text;
  container.appendChild(userMsg);

  chatInput.value = '';
  container.scrollTop = container.scrollHeight;

  setTimeout(() => {
    const aiMsg = document.createElement('div');
    aiMsg.className = 'msg ai';
    
    let reply = "That's a great question! SkillSnap AI recommends taking the Full Stack Developer Masterclass and practicing ATS optimization in the Mentorship tab.";
    if (text.toLowerCase().includes('resume') || text.toLowerCase().includes('ats') || text.toLowerCase().includes('builder')) {
      reply = "You can use our brand-new AI Resume Builder tab to generate a professional PDF resume or analyze your ATS score in seconds!";
    } else if (text.toLowerCase().includes('course') || text.toLowerCase().includes('skill')) {
      reply = "Based on your current skill profile (UI/UX 90%, Management 30%), I recommend expanding into API architecture to become a Full Stack Product Lead.";
    }

    aiMsg.innerText = reply;
    container.appendChild(aiMsg);
    container.scrollTop = container.scrollHeight;
  }, 600);
}

// --- FastAPI Backend Integration Test ---
async function testBackendConnection() {
  const backendUrl = document.getElementById('setting-backend-url').value.trim();
  const statusText = document.getElementById('backend-status-text');

  try {
    statusText.innerText = '● Connecting...';
    statusText.style.color = 'var(--accent-orange)';

    const res = await fetch(`${backendUrl}/docs`, { method: 'GET' });
    if (res.ok || res.status === 200) {
      statusText.innerText = '● Online (Connected to FastAPI backend!)';
      statusText.style.color = 'var(--accent-green)';
      showToast('Connected to FastAPI Backend!', 'success');
    } else {
      throw new Error('Endpoint not responding');
    }
  } catch (err) {
    statusText.innerText = '● Offline (Using Client-Side Data Engine)';
    statusText.style.color = 'var(--accent-green)';
    showToast('Backend offline - fallback client engine active.', 'info');
  }
}
