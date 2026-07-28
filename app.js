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

// --- Interactive Skill Assessment Quiz Engine ---
const skillQuizData = [
  {
    category: "Management & Strategy",
    question: "1. How do you prioritize project deliverables when technical debt competes with tight feature deadlines?",
    options: [
      "Use the RICE framework to weigh reach, impact, and effort against tech debt risk.",
      "Ignore technical debt completely and only ship new user features.",
      "Halt all feature development for 6 months to rewrite the backend codebase.",
      "Let individual developers choose tasks randomly without team alignment."
    ],
    correctIndex: 0
  },
  {
    category: "Full Stack Architecture",
    question: "2. What is the primary benefit of caching GET requests with Redis or CDN edge nodes?",
    options: [
      "Drastically reduces database query load and decreases API latency to <20ms.",
      "Replaces relational SQL database schemas with client local storage.",
      "Eliminates the need for API authentication tokens.",
      "Automatically writes unit test cases for frontend components."
    ],
    correctIndex: 0
  },
  {
    category: "UI/UX Design Systems",
    question: "3. Which principle ensures your application maintains high visual contrast and accessibility (WCAG compliance)?",
    options: [
      "Maintaining minimum 4.5:1 color contrast ratio for normal body text.",
      "Using low-contrast light grey text on white backgrounds.",
      "Disabling screen reader ARIA labels on interactive buttons.",
      "Removing focus outlines from form inputs."
    ],
    correctIndex: 0
  },
  {
    category: "Backend & FastAPI",
    question: "4. Why should async route handlers (`async def`) be used for I/O-bound tasks in FastAPI?",
    options: [
      "Allows the event loop to handle thousands of concurrent requests without blocking execution.",
      "Automatically encrypts all outgoing JSON HTTP response payloads.",
      "Prevents database connections from ever timing out.",
      "Converts Python backend code into native C++ binaries."
    ],
    correctIndex: 0
  },
  {
    category: "Database & SQL Optimization",
    question: "5. What database optimization technique prevents full table scans on large tables?",
    options: [
      "Creating B-Tree indexes on frequently queried search & foreign key columns.",
      "Deleting all primary keys from relational tables.",
      "Storing every column as a long un-indexed TEXT blob.",
      "Disabling SQL transactions and foreign key constraints."
    ],
    correctIndex: 0
  },
  {
    category: "Frontend & React",
    question: "6. How do `useMemo` and `useCallback` improve React application performance?",
    options: [
      "They memoize expensive calculation values and function references across re-renders.",
      "They automatically convert CSS flexbox layouts into CSS grid.",
      "They replace HTTP API requests with local storage variables.",
      "They prevent browsers from downloading images."
    ],
    correctIndex: 0
  },
  {
    category: "Mobile App Development",
    question: "7. In Flutter, what is the key advantage of using `const` constructors for static widgets?",
    options: [
      "Tells Flutter to reuse widget instances and avoid rebuilding unchanged subtrees.",
      "Enables background location tracking when the app is closed.",
      "Automatically translates Dart code into Swift and Kotlin UI.",
      "Increases the maximum memory allocated to the engine."
    ],
    correctIndex: 0
  },
  {
    category: "Cloud & DevOps",
    question: "8. What is the main goal of a CI/CD automated pipeline in GitHub Actions?",
    options: [
      "Automate building, testing, linting, and deploying code on every push.",
      "Generate synthetic database users for load testing.",
      "Replace local Git version control with cloud storage.",
      "Prevent developers from committing code to feature branches."
    ],
    correctIndex: 0
  },
  {
    category: "API Security",
    question: "9. How does JWT (JSON Web Token) authentication secure client-server API requests?",
    options: [
      "Cryptographically signs token payloads so servers can verify client identity statelessly.",
      "Encrypts local Wi-Fi router signals to protect against physical tampering.",
      "Stores plain-text user passwords inside browser cookies.",
      "Blocks all incoming GET requests from mobile devices."
    ],
    correctIndex: 0
  },
  {
    category: "System Design & Resilience",
    question: "10. What does the Circuit Breaker pattern accomplish in microservice architecture?",
    options: [
      "Prevents cascading failures by stopping calls to a failing service until it recovers.",
      "Doubles CPU server frequency during high network traffic bursts.",
      "Automatically merges duplicate user accounts in MySQL.",
      "Deletes old log files when hard drive storage is full."
    ],
    correctIndex: 0
  },
  {
    category: "Real-Time Systems",
    question: "11. Why are WebSockets preferred over standard HTTP polling for real-time live sync?",
    options: [
      "Provides persistent, low-overhead bidirectional streaming between client and server.",
      "Allows browsers to load web pages without an internet connection.",
      "Compresses JPEG images into PNG files automatically.",
      "Disables CORS security restrictions on cross-domain servers."
    ],
    correctIndex: 0
  },
  {
    category: "Test Automation",
    question: "12. What is the primary purpose of end-to-end (E2E) testing with Selenium and Appium?",
    options: [
      "Simulates real user interactions on Web & Mobile to verify complete user flows.",
      "Measures compiler execution speed for Python & C++ scripts.",
      "Generates artificial user profile avatars and names.",
      "Replaces unit tests with manual regression testing."
    ],
    correctIndex: 0
  }
];

let activeQuizQuestions = [];
let currentQuizIndex = 0;
let selectedQuizAnswer = null;
let userQuizScore = 0;

function startSkillQuiz() {
  // Select 5 randomized questions from 12-question pool
  activeQuizQuestions = [...skillQuizData].sort(() => 0.5 - Math.random()).slice(0, 5);
  currentQuizIndex = 0;
  selectedQuizAnswer = null;
  userQuizScore = 0;

  const modal = document.getElementById('quiz-modal');
  const body = document.getElementById('quiz-body');
  const results = document.getElementById('quiz-results');

  if (body) body.style.display = 'block';
  if (results) results.style.display = 'none';

  renderQuizQuestion();

  if (modal) {
    modal.style.display = 'flex';
  }
}

function renderQuizQuestion() {
  const qData = activeQuizQuestions[currentQuizIndex];
  if (!qData) return;

  selectedQuizAnswer = null;

  const stepIndicator = document.getElementById('quiz-step-indicator');
  const catBadge = document.getElementById('quiz-category-badge');
  const qTitle = document.getElementById('quiz-question-title');

  if (stepIndicator) stepIndicator.innerText = `Question ${currentQuizIndex + 1} of ${activeQuizQuestions.length}`;
  if (catBadge) catBadge.innerText = qData.category;
  if (qTitle) qTitle.innerText = qData.question;

  const optionsContainer = document.getElementById('quiz-options-container');
  if (!optionsContainer) return;
  optionsContainer.innerHTML = '';

  qData.options.forEach((optText, optIdx) => {
    const optDiv = document.createElement('div');
    optDiv.className = 'quiz-option-item';
    optDiv.style.cssText = 'padding:0.9rem 1rem; border:1px solid var(--border-color); border-radius:var(--radius-md); background:var(--bg-input); cursor:pointer; transition:all 0.2s ease; display:flex; align-items:center; gap:0.75rem;';
    optDiv.innerHTML = `
      <input type="radio" name="quiz-opt" id="opt-${optIdx}" value="${optIdx}" style="accent-color:var(--accent-primary); cursor:pointer;">
      <label for="opt-${optIdx}" style="cursor:pointer; font-size:0.92rem; line-height:1.4; flex:1; color:var(--text-primary);">${optText}</label>
    `;
    optDiv.onclick = () => {
      document.querySelectorAll('.quiz-option-item').forEach(el => {
        el.style.borderColor = 'var(--border-color)';
        el.style.background = 'var(--bg-input)';
      });
      optDiv.style.borderColor = 'var(--accent-primary)';
      optDiv.style.background = 'rgba(99,102,241,0.12)';
      const radio = optDiv.querySelector('input');
      if (radio) radio.checked = true;
      selectedQuizAnswer = optIdx;
    };
    optionsContainer.appendChild(optDiv);
  });

  const nextBtn = document.getElementById('quiz-next-btn');
  if (nextBtn) {
    nextBtn.innerHTML = currentQuizIndex === activeQuizQuestions.length - 1 ? 'Submit Assessment ✓' : 'Next Question <i data-lucide="arrow-right"></i>';
    if (window.lucide) lucide.createIcons();
  }
}

function submitQuizAnswer() {
  if (selectedQuizAnswer === null) {
    showToast('Please select an answer option to proceed.', 'info');
    return;
  }

  const qData = activeQuizQuestions[currentQuizIndex];
  if (selectedQuizAnswer === qData.correctIndex) {
    userQuizScore++;
  }

  currentQuizIndex++;

  if (currentQuizIndex < activeQuizQuestions.length) {
    renderQuizQuestion();
  } else {
    // Show Quiz Results Screen
    const body = document.getElementById('quiz-body');
    const results = document.getElementById('quiz-results');

    if (body) body.style.display = 'none';
    if (results) results.style.display = 'block';

    const percent = Math.round((userQuizScore / activeQuizQuestions.length) * 100);
    const scoreGained = Math.floor(Math.random() * 5) + 5; // 5-9% increase

    const currentVal = parseInt(document.getElementById('skill-val-mgmt').innerText) || 34;
    const newVal = Math.min(100, currentVal + scoreGained);

    document.getElementById('skill-val-mgmt').innerText = `${newVal}%`;
    document.getElementById('skill-bar-mgmt').style.width = `${newVal}%`;

    const lessonVal = parseInt(document.getElementById('stat-lessons-val').innerText) || 10;
    document.getElementById('stat-lessons-val').innerText = lessonVal + 1;

    document.getElementById('quiz-result-score-text').innerText = `You scored ${userQuizScore}/${skillQuizData.length} (${percent}%)!`;
    document.getElementById('quiz-bonus-text').innerText = `+${scoreGained}% Management & Strategy Skill`;

    showToast(`Quiz Completed! Score: ${percent}%. Skill increased to ${newVal}%!`, 'success');
  }
}

function closeSkillQuizModal() {
  const modal = document.getElementById('quiz-modal');
  if (modal) {
    modal.style.display = 'none';
  }
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

// --- Multi-Course Catalog & Video Stream Routing Engine ---
const COURSE_CATALOG = {
  1: {
    title: "Full Stack Developer Masterclass",
    desc: "Learn modern full-stack web application architecture, REST API design, state management, and real-time database synchronization with hands-on practice.",
    lessons: [
      { id: 1, title: "1. Introduction to Full Stack Architecture", duration: "12:30", badge: "Free Preview", desc: "Learn modern architecture patterns and client-server setups.", videoId: "Ke90Tje7VS0" },
      { id: 2, title: "2. Database Modeling & Fast APIs", duration: "18:45", badge: "Core", desc: "Design relational schemas, SQL queries, and FastAPI endpoints.", videoId: "SqcY0GlETPk" },
      { id: 3, title: "3. Frontend State & UI Components", duration: "22:10", badge: "Advanced", desc: "Build dynamic UI components, state stores, and glassmorphism styling.", videoId: "O6P86uwfdR0" },
      { id: 4, title: "4. Deployment & Cloud CI/CD", duration: "15:00", badge: "Master", desc: "Deploy full-stack applications with automated testing and HTTPS.", videoId: "VPvVD8t02U8" }
    ]
  },
  2: {
    title: "Digital Marketing & Growth Hacking",
    desc: "Master SEO strategies, funnel conversion metrics, social media algorithms, content marketing, and Google Analytics to scale digital products.",
    lessons: [
      { id: 1, title: "1. Modern Digital Marketing Foundations", duration: "14:20", badge: "Free Preview", desc: "Understand SEO, funnel conversion metrics, and content strategy.", videoId: "nU-IIXBWlS4" },
      { id: 2, title: "2. SEO & Funnel Optimization", duration: "16:35", badge: "Core", desc: "Optimize target keywords, technical SEO, and conversion funnels.", videoId: "xsVT_-46C3g" },
      { id: 3, title: "3. Growth Hacking & Analytics", duration: "19:10", badge: "Advanced", desc: "Analyze user retention metrics, A/B experiments, and growth loops.", videoId: "v7V_18M-WJ0" },
      { id: 4, title: "4. Content Strategy & Social Ads", duration: "15:45", badge: "Master", desc: "Build scalable social ad campaigns and organic content funnels.", videoId: "bixR-KIJKYM" }
    ]
  },
  3: {
    title: "UI/UX & Mobile Design Masterclass",
    desc: "Learn wireframing, Figma design systems, visual hierarchy, responsive layout components, and Flutter UI integration.",
    lessons: [
      { id: 1, title: "1. Figma Fundamentals & Design Systems", duration: "11:15", badge: "Free Preview", desc: "Master component variants, auto layout, and color design tokens.", videoId: "c9Wg6Cb_YlU" },
      { id: 2, title: "2. User Research & Information Architecture", duration: "15:40", badge: "Core", desc: "Conduct user interviews, map user flows, and wireframe interfaces.", videoId: "jqy7F7t__oM" },
      { id: 3, title: "3. Micro-Interactions & Prototyping", duration: "13:50", badge: "Advanced", desc: "Create interactive glassmorphic micro-animations and transitions.", videoId: "351_eP595m8" },
      { id: 4, title: "4. Design Hand-off to Developers", duration: "14:10", badge: "Master", desc: "Export clean asset tokens and integrate Figma designs with Flutter.", videoId: "3rK7-nK_g7E" }
    ]
  }
};

let currentActiveCourseId = 1;

function openCoursePlayer(courseId) {
  currentActiveCourseId = courseId || 1;
  switchTab('courses');
  loadCourseDetails(currentActiveCourseId);
}

function loadCourseDetails(courseId) {
  const course = COURSE_CATALOG[courseId] || COURSE_CATALOG[1];

  const headerTitle = document.getElementById('lesson-header-title');
  const mainDesc = document.getElementById('lesson-desc');
  const syllabusContainer = document.querySelector('.lesson-list');

  if (headerTitle) headerTitle.innerText = course.title;
  if (mainDesc) mainDesc.innerText = course.desc;

  if (syllabusContainer) {
    syllabusContainer.innerHTML = '';
    course.lessons.forEach((les, idx) => {
      const lesDiv = document.createElement('div');
      lesDiv.className = `lesson-item ${idx === 0 ? 'active' : ''}`;
      lesDiv.innerHTML = `
        <div>
          <h5 style="font-size:0.9rem; font-weight:700;">${les.title}</h5>
          <span style="font-size:0.78rem; color:var(--text-secondary);">${les.duration} • ${les.badge}</span>
        </div>
        <i data-lucide="${idx === 0 ? 'play-circle' : 'lock'}" style="${idx === 0 ? 'color:var(--accent-primary);' : 'font-size:14px; color:var(--text-muted);'}"></i>
      `;
      lesDiv.onclick = () => {
        selectCourseLesson(courseId, les.id);
      };
      syllabusContainer.appendChild(lesDiv);
    });
    if (window.lucide) lucide.createIcons();
  }

  // Load first lesson of selected course
  if (course.lessons.length > 0) {
    const firstLes = course.lessons[0];
    updateActiveVideoPlayer(firstLes.title, firstLes.duration, firstLes.desc, firstLes.videoId);
  }

  showToast(`Loaded Course: ${course.title}`, 'success');
}

function selectCourseLesson(courseId, lessonId) {
  const course = COURSE_CATALOG[courseId] || COURSE_CATALOG[1];
  const lesson = course.lessons.find(l => l.id === lessonId) || course.lessons[0];

  document.querySelectorAll('.lesson-item').forEach((item, idx) => {
    if (idx === lessonId - 1) {
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

  updateActiveVideoPlayer(lesson.title, lesson.duration, lesson.desc, lesson.videoId);
  showToast(`Loaded Lesson: ${lesson.title}`, 'info');
}

function selectLesson(index, title, duration, description, videoId) {
  selectCourseLesson(currentActiveCourseId, index);
}

function updateActiveVideoPlayer(title, duration, description, videoId) {
  const iframe = document.getElementById('main-course-iframe');
  const playerTitle = document.getElementById('player-title');
  const playerTime = document.getElementById('player-time');
  const lessonDesc = document.getElementById('lesson-desc');

  if (playerTitle) playerTitle.innerText = title;
  if (playerTime) playerTime.innerText = `Duration: ${duration}`;
  if (lessonDesc) lessonDesc.innerText = description;

  if (iframe && videoId) {
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
  }
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
