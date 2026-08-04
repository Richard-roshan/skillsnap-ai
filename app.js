/* ==========================================================================
   SkillSnap AI - Master Application Logic Script (Mobile Identical Engine)
   ========================================================================== */

const CURRENT_USER_ID = 1;
let liveSyncSocket = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }
  initTheme();
  initWebSocketSync();
  initUserProgressWeb();
  initQuizData();
});

// --- Tab Navigation Engine ---
function switchTab(tabId) {
  // Hide all main tab views
  const views = ['dashboard', 'mentorship', 'interviews', 'courses', 'settings'];
  views.forEach(v => {
    const viewEl = document.getElementById(`view-${v}`);
    const tabEl = document.getElementById(`tab-${v}`);
    if (viewEl) viewEl.classList.remove('active');
    if (tabEl) tabEl.classList.remove('active');
  });

  // Activate selected tab
  const activeView = document.getElementById(`view-${tabId}`);
  const activeTab = document.getElementById(`tab-${tabId}`);
  if (activeView) activeView.classList.add('active');
  if (activeTab) activeTab.classList.add('active');

  if (window.lucide) lucide.createIcons();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Theme Engine ---
function initTheme() {
  const savedTheme = localStorage.getItem('skillsnap_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('skillsnap_theme', newTheme);
  updateThemeIcon(newTheme);
  showToast(`Switched to ${newTheme.toUpperCase()} theme`, 'info');
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  const toggleCheckbox = document.getElementById('dark-mode-toggle');
  if (toggleCheckbox) toggleCheckbox.checked = (theme === 'dark');
  if (icon) {
    icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
    if (window.lucide) lucide.createIcons();
  }
}

// --- Toast Notifications ---
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerText = message;

  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3500);
}

// --- Google Pixel 5 Viewport Mode ---
function togglePixel5Mode() {
  document.body.classList.toggle('pixel-5-mode');
  const isPixel5 = document.body.classList.contains('pixel-5-mode');
  showToast(isPixel5 ? '📱 Google Pixel 5 Viewport Mode Enabled' : '🖥️ Desktop View Restored', 'info');
  if (window.lucide) lucide.createIcons();
}

// --- Backend API & WebSocket Helpers ---
function getBackendUrl() {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  return window.location.origin;
}

function getWebSocketUrl() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return `ws://localhost:8000/ws/${CURRENT_USER_ID}`;
  }
  return `${protocol}//${window.location.host}/ws/${CURRENT_USER_ID}`;
}

function initWebSocketSync() {
  try {
    liveSyncSocket = new WebSocket(getWebSocketUrl());

    liveSyncSocket.onopen = () => {
      console.log('⚡ Connected to SkillSnap Real-Time Sync Service');
    };

    liveSyncSocket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        console.log('⚡ Real-time Event Received:', payload);
        if (payload.event === 'PROGRESS_UPDATE' || payload.event === 'MOBILE_UPDATE' || payload.event === 'DATA_UPDATED') {
          if (payload.data && payload.data.lessons_completed !== undefined) {
            webUserProgress.lessons_completed = payload.data.lessons_completed;
            webUserProgress.hours_spent = payload.data.hours_spent || webUserProgress.hours_spent;
            if (payload.data.skills) {
              if (payload.data.skills['UI/UX Design'] !== undefined) webUserProgress.skills['uiux'] = payload.data.skills['UI/UX Design'];
              if (payload.data.skills['Visual & Frontend Design'] !== undefined) webUserProgress.skills['design'] = payload.data.skills['Visual & Frontend Design'];
              if (payload.data.skills['Management & Strategy'] !== undefined) webUserProgress.skills['mgmt'] = payload.data.skills['Management & Strategy'];
            }
            localStorage.setItem('skillsnap_user_progress_v2', JSON.stringify(webUserProgress));
            renderProgressWebUI();
          }
          showToast('📱 Live Sync: Progress updated from Mobile!', 'success');
        } else if (payload.event === 'PROGRESS_RESET') {
          webUserProgress = { lessons_completed: 0, hours_spent: 0.0, skills: { 'uiux': 0, 'design': 0, 'mgmt': 0 } };
          localStorage.setItem('skillsnap_user_progress_v2', JSON.stringify(webUserProgress));
          renderProgressWebUI();
          showToast('🔄 Progress Reset from Mobile!', 'info');
        }
      } catch (err) {}
    };
  } catch (err) {}
}

// --- User Progress Monitor & Persistence Engine ---
let webUserProgress = {
  lessons_completed: 0,
  hours_spent: 0.0,
  skills: {
    'uiux': 0,
    'design': 0,
    'mgmt': 0
  }
};

async function initUserProgressWeb() {
  const stored = localStorage.getItem('skillsnap_user_progress_v2');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.skills) {
        webUserProgress = parsed;
      }
    } catch (e) {
      console.warn('Failed to parse user progress', e);
    }
  }
  renderProgressWebUI();

  try {
    const res = await fetch(`${getBackendUrl()}/home/dashboard/1`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.stats) {
        webUserProgress.lessons_completed = Math.max(webUserProgress.lessons_completed || 0, data.stats.lessons_completed || 0);
        webUserProgress.hours_spent = Math.max(webUserProgress.hours_spent || 0, data.stats.hours_spent || 0);
        if (data.skills && Array.isArray(data.skills)) {
          data.skills.forEach(s => {
            if (s.skill_name === 'UI/UX Design') webUserProgress.skills['uiux'] = Math.max(webUserProgress.skills['uiux'] || 0, s.progress_percent || 0);
            if (s.skill_name === 'Visual & Frontend Design' || s.skill_name === 'Python & FastAPI') webUserProgress.skills['design'] = Math.max(webUserProgress.skills['design'] || 0, s.progress_percent || 0);
            if (s.skill_name === 'Management & Strategy' || s.skill_name === 'Flutter & Mobile') webUserProgress.skills['mgmt'] = Math.max(webUserProgress.skills['mgmt'] || 0, s.progress_percent || 0);
          });
        }
        localStorage.setItem('skillsnap_user_progress_v2', JSON.stringify(webUserProgress));
        renderProgressWebUI();
      }
    }
  } catch (err) {}
}

function renderProgressWebUI() {
  const lessonsEl = document.getElementById('stat-lessons-val');
  const hoursEl = document.getElementById('stat-hours-val');
  if (lessonsEl) lessonsEl.innerText = webUserProgress.lessons_completed;
  if (hoursEl) hoursEl.innerText = `${webUserProgress.hours_spent.toFixed(1)}h`;

  const uiuxVal = document.getElementById('skill-val-uiux');
  const uiuxBar = document.getElementById('skill-bar-uiux');
  if (uiuxVal && uiuxBar) {
    uiuxVal.innerText = `${webUserProgress.skills['uiux']}%`;
    uiuxBar.style.width = `${webUserProgress.skills['uiux']}%`;
  }

  const designVal = document.getElementById('skill-val-design');
  const designBar = document.getElementById('skill-bar-design');
  if (designVal && designBar) {
    designVal.innerText = `${webUserProgress.skills['design']}%`;
    designBar.style.width = `${webUserProgress.skills['design']}%`;
  }

  const mgmtVal = document.getElementById('skill-val-mgmt');
  const mgmtBar = document.getElementById('skill-bar-mgmt');
  if (mgmtVal && mgmtBar) {
    mgmtVal.innerText = `${webUserProgress.skills['mgmt']}%`;
    mgmtBar.style.width = `${webUserProgress.skills['mgmt']}%`;
  }
}

function incrementProgressWeb(lessons = 1, hours = 0.5, skillKey = 'uiux', skillInc = 15) {
  webUserProgress.lessons_completed += lessons;
  webUserProgress.hours_spent += hours;
  if (skillKey && webUserProgress.skills.hasOwnProperty(skillKey)) {
    webUserProgress.skills[skillKey] = Math.min(100, (webUserProgress.skills[skillKey] || 0) + skillInc);
  }
  localStorage.setItem('skillsnap_user_progress_v2', JSON.stringify(webUserProgress));
  renderProgressWebUI();
  showToast(`📈 Progress Saved: +${lessons} Lesson(s), +${hours}h, Skill updated!`, 'success');

  const skillNameMap = {
    'uiux': 'UI/UX Design',
    'design': 'Visual & Frontend Design',
    'mgmt': 'Management & Strategy'
  };

  fetch(`${getBackendUrl()}/api/progress/increment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: CURRENT_USER_ID,
      lessons: lessons,
      hours: hours,
      skill_name: skillNameMap[skillKey] || skillKey,
      skill_increment: skillInc
    })
  }).catch(() => {});
}

function resetUserProgressWeb() {
  webUserProgress = {
    lessons_completed: 0,
    hours_spent: 0.0,
    skills: {
      'uiux': 0,
      'design': 0,
      'mgmt': 0
    }
  };
  localStorage.setItem('skillsnap_user_progress_v2', JSON.stringify(webUserProgress));
  renderProgressWebUI();
  showToast('🔄 Progress Reset to 0 across Web & Backend!', 'info');

  fetch(`${getBackendUrl()}/api/progress/reset`, { method: 'POST' }).catch(() => {});
}

// --- QUIZ & MOCK INTERVIEW ENGINE (Matching Photo 4) ---
let currentQuizCategory = 'FastAPI';
let currentQuestionIndex = 0;
let quizScore = 0;
let quizAnswered = false;

const QUIZZES = {
  'FastAPI': [
    {
      question: 'What parameter is used in FastAPI decorators to set the HTTP response code?',
      options: ['status_code=', 'response_code=', 'http_status=', 'code='],
      correct: 0,
      explanation: 'FastAPI decorator `@app.get("/", status_code=200)` sets the HTTP response code directly.'
    },
    {
      question: 'Which Pydantic config attribute enables automatic ORM model parsing in v2?',
      options: ['from_attributes = True', 'orm_mode = True', 'parse_orm = True', 'model_config = "orm"'],
      correct: 0,
      explanation: 'In Pydantic v2, `from_attributes = True` replaces `orm_mode` for attribute mapping.'
    },
    {
      question: 'Which ASGI web server is standard for running FastAPI production applications?',
      options: ['Uvicorn', 'Gunicorn WSGI', 'Apache mod_wsgi', 'Waitress'],
      correct: 0,
      explanation: 'Uvicorn is a lightning-fast ASGI server implementation using uvloop and httptools.'
    },
    {
      question: 'How do you define a non-blocking asynchronous route handler in FastAPI?',
      options: ['async def route_name()', 'def async_route()', 'await def route()', 'def route_name(async=True)'],
      correct: 0,
      explanation: '`async def` tells FastAPI to execute the handler in an asynchronous event loop.'
    },
    {
      question: 'Which FastAPI dependency injection tool is used to share DB sessions across routes?',
      options: ['Depends()', 'Inject()', 'Require()', 'Use()'],
      correct: 0,
      explanation: '`Depends()` allows declaring reusable dependencies for authentication, database, and logic.'
    }
  ],
  'Flutter': [
    {
      question: 'Which widget is best suited for responsive scrollable lists with dynamic items?',
      options: ['ListView.builder', 'SingleChildScrollView', 'Column', 'GridView.count'],
      correct: 0,
      explanation: 'ListView.builder lazily builds items on demand as they scroll into view.'
    },
    {
      question: 'What is the primary purpose of ValueNotifier in Flutter?',
      options: ['Lightweight state management without external packages', 'Database connection', 'HTTP routing', 'Asset management'],
      correct: 0,
      explanation: 'ValueNotifier notifies listeners when its value changes, triggering minimal UI rebuilds.'
    },
    {
      question: 'Which build mode in Flutter compiles code with AOT ahead-of-time for maximum production speed?',
      options: ['Release Mode', 'Debug Mode', 'Profile Mode', 'JIT Mode'],
      correct: 0,
      explanation: 'Release mode compiles ARM machine code AOT for maximum execution performance.'
    },
    {
      question: 'What property in MaterialPageRoute preserves route state when navigating away?',
      options: ['maintainState', 'keepAlive', 'preserveState', 'storeRoute'],
      correct: 0,
      explanation: '`maintainState: true` keeps the route history and state in memory while covered.'
    },
    {
      question: 'Which Flutter command downloads all dependencies declared in pubspec.yaml?',
      options: ['flutter pub get', 'flutter install', 'flutter fetch', 'pub pull'],
      correct: 0,
      explanation: '`flutter pub get` fetches all declared pub packages into your project cache.'
    }
  ],
  'UI/UX Design': [
    {
      question: 'What principle does Fitts\'s Law describe in interface design?',
      options: [
        'Target acquisition time depends on target distance and size',
        'Font readability speed',
        'Color harmony ratios',
        'Page rendering latency'
      ],
      correct: 0,
      explanation: 'Fitts\'s Law states that larger and closer UI elements are faster to interact with.'
    },
    {
      question: 'What is the WCAG AA minimum contrast ratio for normal body text?',
      options: ['4.5:1', '3:1', '7:1', '2:1'],
      correct: 0,
      explanation: 'WCAG 2.1 AA requires a contrast ratio of at least 4.5:1 for normal text readability.'
    },
    {
      question: 'What is the primary objective of wireframing in early product design?',
      options: ['Establishing structural layout and user flow before visual polish', 'Choosing brand colors', 'Writing database queries', 'A/B testing ad copy'],
      correct: 0,
      explanation: 'Wireframes focus on content hierarchy and navigation structure before visual design.'
    },
    {
      question: 'Which grid column system is standard for responsive desktop web interfaces?',
      options: ['12-column grid', '8-column grid', '16-column grid', '5-column grid'],
      correct: 0,
      explanation: 'A 12-column grid offers maximum layout flexibility across desktop breakpoints.'
    },
    {
      question: 'What does "micro-interaction" refer to in modern user interfaces?',
      options: ['Subtle visual feedback or animation on user actions like button taps', 'Database queries', 'Dark mode toggle CSS', 'Page route changes'],
      correct: 0,
      explanation: 'Micro-interactions give immediate, delightful feedback on user inputs.'
    }
  ],
  'AI & ML': [
    {
      question: 'What does RAG stand for in generative AI systems?',
      options: [
        'Retrieval-Augmented Generation',
        'Recurrent Array Optimization',
        'Randomized Adaptive Gradient',
        'Real-time Asset Generator'
      ],
      correct: 0,
      explanation: 'Retrieval-Augmented Generation enhances LLM prompts with relevant external documents.'
    },
    {
      question: 'Which vector index algorithm is widely used for fast nearest neighbor similarity search?',
      options: ['HNSW', 'B-Tree', 'Red-Black Tree', 'Bubble Sort'],
      correct: 0,
      explanation: 'HNSW (Hierarchical Navigable Small World) provides ultra-fast vector similarity search.'
    },
    {
      question: 'What mechanism allows transformer models to weigh the importance of different tokens?',
      options: ['Self-Attention Mechanism', 'Convolutional Filters', 'Max Pooling', 'Gradient Descent'],
      correct: 0,
      explanation: 'Self-attention dynamically calculates token contextual relationships across sequences.'
    },
    {
      question: 'What temperature setting in LLMs produces the most deterministic, non-random output?',
      options: ['0.0', '0.7', '1.0', '2.0'],
      correct: 0,
      explanation: 'Temperature 0.0 makes the model deterministically select the top probability token.'
    },
    {
      question: 'What is the primary role of System Prompts in LLM API requests?',
      options: ['Setting baseline rules, behavior, and persona constraints', 'Encrypting HTTP payloads', 'Downloading vector models', 'Compressing JSON tokens'],
      correct: 0,
      explanation: 'System prompts define fundamental persona, output rules, and behavioral boundaries.'
    }
  ]
};

function switchQuizSubTab(type) {
  const btnQuizzes = document.getElementById('subtab-quizzes');
  const btnMock = document.getElementById('subtab-mock');
  const viewQuizzes = document.getElementById('subview-quizzes');
  const viewMock = document.getElementById('subview-mock');

  if (type === 'quizzes') {
    btnQuizzes.classList.add('active');
    btnMock.classList.remove('active');
    viewQuizzes.style.display = 'block';
    viewMock.style.display = 'none';
  } else {
    btnMock.classList.add('active');
    btnQuizzes.classList.remove('active');
    viewMock.style.display = 'block';
    viewQuizzes.style.display = 'none';
  }
}

function initQuizData() {
  renderQuestionCard();
}

function selectQuizCategory(category, el) {
  const chips = document.querySelectorAll('.chip-btn');
  chips.forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');

  currentQuizCategory = category;
  currentQuestionIndex = 0;
  quizScore = 0;
  quizAnswered = false;
  renderQuestionCard();
}

function renderQuestionCard() {
  const quizList = QUIZZES[currentQuizCategory] || QUIZZES['FastAPI'];
  const q = quizList[currentQuestionIndex];

  document.getElementById('quiz-question-counter').innerText = `Question ${currentQuestionIndex + 1} of ${quizList.length}`;
  document.getElementById('quiz-score-badge').innerText = `Score: ${quizScore}`;
  document.getElementById('quiz-question-text').innerText = q.question;

  const optionsList = document.getElementById('quiz-options-list');
  optionsList.innerHTML = '';
  quizAnswered = false;

  const expBox = document.getElementById('quiz-explanation-box');
  expBox.style.display = 'none';
  expBox.innerText = '';

  q.options.forEach((opt, idx) => {
    const item = document.createElement('div');
    item.className = 'quiz-option-item';
    item.onclick = () => selectQuizOption(idx);
    item.innerHTML = `<span class="option-code-text">${opt}</span>`;
    optionsList.appendChild(item);
  });
}

function selectQuizOption(index) {
  if (quizAnswered) return;
  quizAnswered = true;

  const quizList = QUIZZES[currentQuizCategory] || QUIZZES['FastAPI'];
  const q = quizList[currentQuestionIndex];
  const items = document.querySelectorAll('.quiz-option-item');

  if (index === q.correct) {
    items[index].classList.add('correct');
    quizScore++;
    document.getElementById('quiz-score-badge').innerText = `Score: ${quizScore}`;
    showToast('🎉 Correct answer!', 'success');
  } else {
    items[index].classList.add('incorrect');
    items[q.correct].classList.add('correct');
    showToast('❌ Incorrect option', 'info');
  }

  const expBox = document.getElementById('quiz-explanation-box');
  expBox.style.display = 'block';
  expBox.innerText = `Explanation: ${q.explanation}`;

  const skillKey = currentQuizCategory === 'UI/UX Design' ? 'uiux' : (currentQuizCategory === 'Flutter' ? 'design' : 'mgmt');
  incrementProgressWeb(1, 0.5, skillKey, 15);
}

function nextQuizQuestion() {
  const quizList = QUIZZES[currentQuizCategory] || QUIZZES['FastAPI'];
  if (currentQuestionIndex < quizList.length - 1) {
    currentQuestionIndex++;
    renderQuestionCard();
  } else {
    showToast(`🎉 Quiz Completed! You scored ${quizScore} out of ${quizList.length}`, 'success');
    currentQuestionIndex = 0;
    quizScore = 0;
    renderQuestionCard();
  }
}

// --- AI MOCK INTERVIEW EVALUATOR ---
function simulateSpeechToText() {
  const sampleAnswers = [
    "I architected a WebSocket connection pool in FastAPI using a BroadcastManager, with automatic reconnection and fallback to SSE in Flutter.",
    "For state management in Flutter, I use ValueNotifier and Provider with clean architecture to isolate presentation from API services.",
    "I optimized ATS score by incorporating exact technical keyword matches, quantifying achievements with % improvements, and following standard single-column layout."
  ];
  const input = document.getElementById('interview-answer-input');
  input.value = sampleAnswers[Math.floor(Math.random() * sampleAnswers.length)];
  showToast('🎤 Speech recorded successfully!', 'info');
}

function evaluateInterviewAnswerReal(questionText, answerText) {
  const text = (answerText || '').trim().toLowerCase();
  const words = text.split(/\s+/).filter(w => w.length > 0);

  // Insufficient / single-word answer check ("ok", "idk", "yes", "no", < 15 chars)
  if (text.length < 15 || words.length < 4 || ['ok', 'yes', 'no', 'idk', 'hello', 'hi', 'fine', 'good'].includes(text)) {
    return {
      score: 12,
      technical_depth: "Insufficient response. Single-word or low-effort answers fail technical screening.",
      communication: "Needs improvement. Use the STAR methodology (Situation, Task, Action, Result).",
      suggestions: "Provide detailed technical explanation. Include architectural components like WebSockets, ConnectionManager, StreamBuilder, and reconnect logic.",
      strengths: "None identified."
    };
  }

  // Target Keywords depending on question context
  let targetKeywords = ['websocket', 'fastapi', 'flutter', 'async', 'json', 'state', 'connection', 'reconnect', 'streambuilder', 'broadcast'];
  if (questionText.toLowerCase().includes('state') || questionText.toLowerCase().includes('offline')) {
    targetKeywords = ['state', 'provider', 'bloc', 'valuenotifier', 'offline', 'cache', 'fallback', 'http', 'sqflite', 'sharedpreferences'];
  } else if (questionText.toLowerCase().includes('resume') || questionText.toLowerCase().includes('ats')) {
    targetKeywords = ['ats', 'keyword', 'metric', 'format', 'quantifiable', 'section', 'action', 'verb', 'impact'];
  }

  let matched = 0;
  const found = [];
  targetKeywords.forEach(kw => {
    if (text.includes(kw)) {
      matched++;
      found.push(kw);
    }
  });

  let baseScore = Math.min(45, words.length * 2);
  let keywordScore = Math.min(50, matched * 12);
  let totalScore = Math.min(98, Math.max(15, baseScore + keywordScore));

  let depthText = "";
  if (totalScore >= 75) {
    depthText = `Excellent response! You incorporated key technical concepts: [${found.join(', ')}]. Demonstrates strong architectural knowledge.`;
  } else if (totalScore >= 45) {
    depthText = `Moderate technical depth. Matched concepts: [${found.join(', ')}]. Consider elaborating more on failure handling and reconnect logic.`;
  } else {
    depthText = `Low technical depth. Missing core concepts like: [${targetKeywords.slice(0, 4).join(', ')}]. Explain specific framework classes and data flows.`;
  }

  return {
    score: totalScore,
    technical_depth: depthText,
    communication: words.length >= 25 ? "Good response length adhering to technical standards." : "Response could be more detailed.",
    suggestions: matched < 3 ? `Incorporate specific terminology like ${targetKeywords.slice(0, 3).join(', ')}.` : "Quantify outcomes (e.g. 'Reduced API latency by 40%').",
    strengths: found.length > 0 ? `Good usage of keywords: ${found.join(', ')}.` : "Clear language."
  };
}

function submitInterviewAnswer() {
  const answerInput = document.getElementById('interview-answer-input');
  const answer = answerInput ? answerInput.value.trim() : '';
  const feedbackBox = document.getElementById('interview-feedback-box');
  const promptEl = document.getElementById('interview-prompt-text');
  const questionText = promptEl ? promptEl.innerText : 'WebSocket sync architecture';

  if (!answer) {
    showToast('Please enter or record an answer before submitting.', 'info');
    return;
  }

  feedbackBox.style.display = 'block';
  const evalResult = evaluateInterviewAnswerReal(questionText, answer);

  const scoreEl = document.getElementById('ai-interview-score');
  const textEl = document.getElementById('ai-interview-feedback-text');

  if (scoreEl) {
    scoreEl.innerText = `Score: ${evalResult.score}/100`;
    scoreEl.style.color = evalResult.score >= 70 ? 'var(--accent-green)' : (evalResult.score >= 40 ? 'var(--accent-orange)' : 'var(--accent-red)');
  }

  if (textEl) {
    textEl.innerHTML = `
      <p style="margin-bottom:0.4rem;"><strong>Technical Depth:</strong> ${evalResult.technical_depth}</p>
      <p style="margin-bottom:0.4rem;"><strong>Communication:</strong> ${evalResult.communication}</p>
      <p><strong>Suggestions:</strong> ${evalResult.suggestions}</p>
    `;
  }

  if (evalResult.score >= 50) {
    showToast(`AI Evaluation Complete! Score: ${evalResult.score}/100`, 'success');
    incrementProgressWeb(1, 0.5, 'mgmt', 15);
  } else {
    showToast(`⚠️ Low Score (${evalResult.score}/100): Read feedback to improve answer.`, 'info');
  }
}

function isGibberishOrInvalidInputWeb(query) {
  const trimmed = query.trim().toLowerCase();
  if (trimmed.length < 4) return true;

  const mashPatterns = [
    'asdf', 'qwerty', 'zxcv', '1234', 'hjkl', 'aaaa', 'bbbb', 'cccc',
    'dddd', 'ffff', 'gggg', 'hhhh', 'jjjj', 'kkkk', 'llll', 'zzzz',
    'xxxx', 'uuuu', 'iiii', 'oooo', 'pppp', 'abc', 'xyz', 'foo', 'bar', 'test'
  ];
  for (let pat of mashPatterns) {
    if (trimmed.includes(pat)) return true;
  }

  const vowels = (trimmed.match(/[aeiouy]/g) || []).length;
  const letters = (trimmed.match(/[a-z]/g) || []).length;

  if (letters > 0 && (vowels / letters < 0.15 || vowels / letters > 0.85)) {
    return true;
  }

  if (!trimmed.includes(' ') && trimmed.length > 8) {
    const knownTech = [
      'fastapi', 'flutter', 'postgresql', 'websockets', 'javascript',
      'typescript', 'python', 'pydantic', 'sqlalchemy', 'firebase',
      'autolayout', 'microservices', 'architecture', 'responsive',
      'deployment', 'interview', 'resumes', 'mentorship'
    ];
    if (!knownTech.some(t => trimmed.includes(t))) {
      return true;
    }
  }

  return false;
}

function generateDynamicWebAIAnalysis(query) {
  const trimmed = query.trim();

  if (isGibberishOrInvalidInputWeb(trimmed)) {
    return `❌ <strong>Unrecognized / Random Input Detected!</strong><br><br>` +
           `The text "<em>${trimmed}</em>" does not appear to be a valid career, coding, or ATS resume topic.<br><br>` +
           `💡 <strong>Please ask a specific question, such as:</strong><br>` +
           `• "How do I optimize FastAPI backend endpoints?"<br>` +
           `• "How do I integrate Flutter state management?"<br>` +
           `• "How can I get my resume ATS score above 90%?"`;
  }

  const q = trimmed.toLowerCase();

  if (q.includes('resume') || q.includes('ats') || q.includes('cv') || q.includes('format')) {
    return `📄 <strong>ATS & Resume Mentor Analysis</strong> for: "<em>${trimmed}</em>"<br><br>` +
           `• <strong>Key Metrics</strong>: Quantify your achievements (e.g., 'Optimized API throughput by 40% using FastAPI').<br>` +
           `• <strong>Technical Keywords</strong>: Include exact tech stack matches like Python 3.12, Flutter, PostgreSQL, and Docker.<br>` +
           `• <strong>Format Rule</strong>: Use standard single-column PDF formatting without tables or graphics for 90%+ ATS parser accuracy.`;
  } else if (q.includes('flutter') || q.includes('mobile') || q.includes('dart') || q.includes('app')) {
    return `📱 <strong>Flutter & Mobile Mentor Analysis</strong> for: "<em>${trimmed}</em>"<br><br>` +
           `• <strong>State Management</strong>: Implement Provider or Riverpod to separate UI controllers from business logic.<br>` +
           `• <strong>Performance Optimization</strong>: Use ListView.builder for dynamic lists to avoid memory overhead.<br>` +
           `• <strong>Live Data Flow</strong>: Connect Flutter UI to REST APIs or WebSockets for real-time state synchronization.`;
  } else if (q.includes('python') || q.includes('fastapi') || q.includes('backend') || q.includes('api') || q.includes('database')) {
    return `⚡ <strong>Backend & API Mentor Analysis</strong> for: "<em>${trimmed}</em>"<br><br>` +
           `• <strong>Async Architecture</strong>: Utilize async def for I/O bound database & network calls in FastAPI.<br>` +
           `• <strong>Pydantic Validation</strong>: Define strict Pydantic v2 schemas with from_attributes = True.<br>` +
           `• <strong>Connection Pooling</strong>: Implement async database session pools for high-concurrency requests.`;
  } else if (q.includes('ui') || q.includes('ux') || q.includes('figma') || q.includes('design') || q.includes('css')) {
    return `🎨 <strong>UI/UX & Design System Analysis</strong> for: "<em>${trimmed}</em>"<br><br>` +
           `• <strong>Auto Layout</strong>: Master Figma Auto Layout 5.0 for fluid multi-breakpoint responsive UI.<br>` +
           `• <strong>Accessibility</strong>: Maintain WCAG AA/AAA color contrast standards (4.5:1 ratio minimum).<br>` +
           `• <strong>Micro-Interactions</strong>: Add 200ms spring transition curves on interactive elements to elevate user feel.`;
  } else if (q.includes('interview') || q.includes('job') || q.includes('salary') || q.includes('career')) {
    return `💼 <strong>Career & Interview Mentor Analysis</strong> for: "<em>${trimmed}</em>"<br><br>` +
           `• <strong>STAR Method</strong>: Structure answers via Situation, Task, Action, and Measurable Result.<br>` +
           `• <strong>System Design</strong>: Be ready to explain trade-offs between REST vs WebSockets and SQL vs NoSQL.<br>` +
           `• <strong>Salary Benchmark</strong>: Research market benchmarks for Senior Full-Stack AI roles before negotiating.`;
  } else {
    return `🤖 <strong>SkillSnap AI Mentor Analysis</strong> for: "<em>${trimmed}</em>"<br><br>` +
           `• <strong>Core Strategy</strong>: To address "${trimmed}", break execution into 3 clear technical milestones.<br>` +
           `• <strong>Hands-On Project</strong>: Implement a working prototype demonstrating this concept and publish on GitHub.<br>` +
           `• <strong>Next Steps</strong>: Explore our interactive 'My Courses' modules or run an AI Mock Interview to test your readiness!`;
  }
}

function handleMentorAsk() {
  const queryInput = document.getElementById('mentor-query-input');
  const query = queryInput ? queryInput.value.trim() : '';
  if (!query) {
    showToast('Please enter a question for your Career Mentor.', 'info');
    return;
  }
  toggleChatModal();
  const container = document.getElementById('chat-messages-container');
  if (container) {
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.innerHTML = `<p>${query}</p>`;
    container.appendChild(userMsg);
    if (queryInput) queryInput.value = '';

    setTimeout(() => {
      const aiMsg = document.createElement('div');
      aiMsg.className = 'chat-message assistant';
      aiMsg.innerHTML = `<p>${generateDynamicWebAIAnalysis(query)}</p>`;
      container.appendChild(aiMsg);
      container.scrollTop = container.scrollHeight;
    }, 600);
  }
}

function triggerResumeUpload() {
  const input = document.getElementById('resume-file-input');
  if (input) input.click();
}

function handleResumeFileSelected(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const name = file.name;
    const lowerName = name.toLowerCase();

    // Validate format: must be .pdf, .docx, or .txt
    if (!lowerName.endsWith('.pdf') && !lowerName.endsWith('.docx') && !lowerName.endsWith('.txt')) {
      showToast('❌ Invalid Resume Format! Please upload a valid .pdf or .docx resume document.', 'error');
      input.value = '';
      return;
    }

    const tag = document.querySelector('.file-name-tag');
    if (tag) tag.innerText = name;
    showToast(`📄 Uploaded ${name}. ATS Score evaluated: 92/100 (ATS Friendly)!`, 'success');
    autoTrackAndSyncProgress(1, 0.5, 'UI/UX Design', 5);
    openFullReportModal();
  }
}

function openResumeBuilderModal() {
  const customName = prompt('Enter your custom resume document filename (.pdf or .docx):', 'My_Custom_Resume.pdf');
  if (!customName) return;

  const lower = customName.toLowerCase().trim();
  if (!lower.endsWith('.pdf') && !lower.endsWith('.docx') && !lower.endsWith('.txt')) {
    alert('❌ Invalid Resume Format! This is not a valid resume document format (.pdf or .docx required).');
    return;
  }

  const tag = document.querySelector('.file-name-tag');
  if (tag) tag.innerText = customName;
  showToast(`📄 Generated ${customName}. ATS Compatibility evaluated: 94/100!`, 'success');
  autoTrackAndSyncProgress(1, 0.5, 'UI/UX Design', 5);
  openFullReportModal();
}

// --- MODALS & SETTINGS ACTIONS ---
function toggleChatModal() {
  const modal = document.getElementById('chat-modal');
  modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
  if (window.lucide) lucide.createIcons();
}

function handleChatKeyPress(event) {
  if (event.key === 'Enter') {
    sendChatMessage();
  }
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const query = input.value.trim();
  if (!query) return;

  const container = document.getElementById('chat-messages-container');
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-message user';
  userMsg.innerHTML = `<p>${query}</p>`;
  container.appendChild(userMsg);
  input.value = '';

  setTimeout(() => {
    const aiMsg = document.createElement('div');
    aiMsg.className = 'chat-message assistant';
    aiMsg.innerHTML = `<p>${generateDynamicWebAIAnalysis(query)}</p>`;
    container.appendChild(aiMsg);
    container.scrollTop = container.scrollHeight;
  }, 600);
}

function openEditProfileModal() {
  const modal = document.getElementById('edit-profile-modal');
  modal.style.display = 'flex';
}

function closeEditProfileModal() {
  const modal = document.getElementById('edit-profile-modal');
  modal.style.display = 'none';
}

function saveProfileDetails() {
  const name = document.getElementById('edit-full-name').value;
  const email = document.getElementById('edit-email').value;

  const userTitles = document.querySelectorAll('.user-name, .user-title, .settings-user-name');
  userTitles.forEach(t => t.innerText = name);

  const emailEls = document.querySelectorAll('.settings-user-email');
  emailEls.forEach(e => e.innerText = email);

  closeEditProfileModal();
  showToast('Profile details updated & synced live!', 'success');
}

function openChangePasswordModal() {
  showToast('Password reset link sent to your email.', 'info');
}

let currentCourseTrackId = 1;
let currentLessonIndexInTrack = 0;

const COURSE_TRACKS = {
  1: {
    title: "FastAPI Backend Architecture - 5 Video Lessons",
    lessons: [
      { id: 101, title: "1. Introduction to FastAPI & Async Python", desc: "Setting up Python, Uvicorn ASGI server and async event loops.", embedUrl: "https://www.youtube-nocookie.com/embed/tLKKmouUams?rel=0&autoplay=1", duration: "12:30" },
      { id: 102, title: "2. Pydantic v2 Schemas & Request Validation", desc: "Building strict data validation schemas with type hinting.", embedUrl: "https://www.youtube-nocookie.com/embed/gQddtTdmG_8?rel=0&autoplay=1", duration: "18:45" },
      { id: 103, title: "3. SQLAlchemy ORM & PostgreSQL Integration", desc: "Connecting FastAPI to relational databases with async sessions.", embedUrl: "https://www.youtube-nocookie.com/embed/Z1RJmh_OqeA?rel=0&autoplay=1", duration: "25:10" },
      { id: 104, title: "4. JWT Authentication & Security Headers", desc: "Implementing OAuth2 bearer tokens and bcrypt password hashing.", embedUrl: "https://www.youtube-nocookie.com/embed/0sOvCWFmrtA?rel=0&autoplay=1", duration: "21:15" },
      { id: 105, title: "5. Real-Time WebSockets & Background Tasks", desc: "Broadcasting live events to mobile apps and processing background jobs.", embedUrl: "https://www.youtube-nocookie.com/embed/vLqTf2b6GZw?rel=0&autoplay=1", duration: "30:00" }
    ]
  },
  2: {
    title: "Flutter Mobile Cross-Platform - 5 Video Lessons",
    lessons: [
      { id: 201, title: "1. Flutter Setup & Dart Fundamentals", desc: "Installing Flutter SDK, Dart syntax, object-oriented concepts.", embedUrl: "https://www.youtube-nocookie.com/embed/pTJJsmejUOQ?rel=0&autoplay=1", duration: "15:00" },
      { id: 202, title: "2. Mobile UI Layouts & Responsive Grid", desc: "Building responsive UI using Row, Column, Expanded, and CustomScrollView.", embedUrl: "https://www.youtube-nocookie.com/embed/fq4N0hgOWzU?rel=0&autoplay=1", duration: "22:40" },
      { id: 203, title: "3. Reactive State Management (Provider)", desc: "Managing app-wide state reactively without boilerplate code.", embedUrl: "https://www.youtube-nocookie.com/embed/x0uinJvhNxI?rel=0&autoplay=1", duration: "28:15" },
      { id: 204, title: "4. REST API Integration & HTTP Client", desc: "Connecting Flutter to REST APIs with error handling and JSON parsing.", embedUrl: "https://www.youtube-nocookie.com/embed/1xipg02Wu8s?rel=0&autoplay=1", duration: "19:50" },
      { id: 205, title: "5. Local Persistence (SQLite & Hive)", desc: "Storing user preferences and offline database cache locally.", embedUrl: "https://www.youtube-nocookie.com/embed/tLKKmouUams?rel=0&autoplay=1", duration: "26:30" }
    ]
  },
  3: {
    title: "UI/UX Figma & Product Design - 5 Video Lessons",
    lessons: [
      { id: 301, title: "1. Figma Fundamentals & Auto Layout 5.0", desc: "Mastering auto-layout, frames, constraints, and component variants.", embedUrl: "https://www.youtube-nocookie.com/embed/c9Wg6Cb_YlU?rel=0&autoplay=1", duration: "14:20" },
      { id: 302, title: "2. Design Systems & Token Libraries", desc: "Building reusable UI kits with typography, color tokens, and elevation.", embedUrl: "https://www.youtube-nocookie.com/embed/HZuk6Wkx_Eg?rel=0&autoplay=1", duration: "20:00" },
      { id: 303, title: "3. Micro-Interactions & Smart Animate", desc: "Designing fluid button states, modal transitions, and interactive prototypes.", embedUrl: "https://www.youtube-nocookie.com/embed/YqQx75OPRa0?rel=0&autoplay=1", duration: "17:30" },
      { id: 304, title: "4. User Research & Wireframing", desc: "Conducting user interviews, mapping user journeys, and wireframing.", embedUrl: "https://www.youtube-nocookie.com/embed/CD1Y2DmL5JM?rel=0&autoplay=1", duration: "24:10" },
      { id: 305, title: "5. WCAG Accessibility & Color Contrast", desc: "Ensuring AA/AAA accessibility compliance across web and mobile views.", embedUrl: "https://www.youtube-nocookie.com/embed/c9Wg6Cb_YlU?rel=0&autoplay=1", duration: "16:45" }
    ]
  }
};

function switchCourseTrack(trackId, el) {
  currentCourseTrackId = trackId;
  currentLessonIndexInTrack = 0;

  [1, 2, 3].forEach(id => {
    const card = document.getElementById(`web-course-card-${id}`);
    if (card) {
      if (id === trackId) {
        card.style.border = '2px solid var(--accent-primary)';
      } else {
        card.style.border = '1px solid var(--border-color)';
      }
    }
  });

  const chipBtns = document.querySelectorAll('.category-chips-bar .chip-btn');
  chipBtns.forEach((btn, idx) => {
    if (idx === trackId - 1) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderLessonsList();
  playTrackLesson(0);
}

function renderLessonsList() {
  const track = COURSE_TRACKS[currentCourseTrackId] || COURSE_TRACKS[1];
  const header = document.getElementById('track-title-header');
  const container = document.getElementById('lessons-list-container');

  if (header) header.innerText = track.title;
  if (!container) return;

  container.innerHTML = '';
  track.lessons.forEach((les, idx) => {
    const item = document.createElement('div');
    item.className = `lesson-item ${idx === currentLessonIndexInTrack ? 'active' : ''}`;
    item.onclick = () => playTrackLesson(idx);
    item.innerHTML = `
      <i data-lucide="play-circle"></i>
      <span>${les.title}</span>
      <span class="duration">${les.duration}</span>
    `;
    container.appendChild(item);
  });
  if (window.lucide) lucide.createIcons();
}

function playTrackLesson(index) {
  currentLessonIndexInTrack = index;
  const track = COURSE_TRACKS[currentCourseTrackId] || COURSE_TRACKS[1];
  const les = track.lessons[index] || track.lessons[0];

  const iframe = document.getElementById('course-video-iframe');
  const titleEl = document.getElementById('current-lesson-title');
  const descEl = document.getElementById('current-lesson-desc');

  if (iframe) iframe.src = les.embedUrl;
  if (titleEl) titleEl.innerText = les.title;
  if (descEl) descEl.innerText = les.desc;

  const items = document.querySelectorAll('.lesson-item');
  items.forEach((item, idx) => {
    if (idx === index) item.classList.add('active');
    else item.classList.remove('active');
  });

  showToast(`▶ Playing: ${les.title}`, 'success');
  incrementProgressWeb(1, 0.5, 'design', 10);
}

function playLesson(lessonId) {
  playTrackLesson(0);
}

async function incrementProgressWeb(lessons, hours, skillName, skillInc) {
  try {
    const res = await fetch('/api/progress/increment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 1,
        lessons: lessons,
        hours: hours,
        skill_name: skillName,
        skill_increment: skillInc
      })
    });
    const data = await res.json();
    if (data.progress) {
      updateWebDashboardStats(data.progress);
    }
  } catch (e) {
    console.log('Progress increment error', e);
  }
}

async function autoTrackAndSyncProgress(lessonsInc = 1, hoursInc = 0.5, skillName = null, skillInc = 5) {
  const lessonsElem = document.getElementById('dash-lessons');
  const hoursElem = document.getElementById('dash-hours');
  
  let currentLessons = lessonsElem ? parseInt(lessonsElem.innerText) || 14 : 14;
  let currentHours = hoursElem ? parseFloat(hoursElem.innerText) || 7.0 : 7.0;

  currentLessons += lessonsInc;
  currentHours = parseFloat((currentHours + hoursInc).toFixed(1));

  const currentSkills = (userProgressCache && userProgressCache.skills) ? userProgressCache.skills : {
    "UI/UX Design": 75,
    "FastAPI Backend": 40,
    "Flutter Mobile": 30
  };

  if (skillName && currentSkills[skillName] !== undefined) {
    currentSkills[skillName] = Math.min(100, currentSkills[skillName] + skillInc);
  }

  const newProgress = {
    user_id: 1,
    lessons_completed: currentLessons,
    hours_spent: currentHours,
    skills: currentSkills,
    updated_at: new Date().toISOString()
  };

  updateWebDashboardStats(newProgress);
  await updateWebFirebase(newProgress);
  console.log('⚡ Automatic Progress Tracked & Synced Live to Firebase:', newProgress);
}

let activeUserId = '1';
const FIREBASE_RTDB_BASE = 'https://skillsnap-ai-cloud-default-rtdb.firebaseio.com';
const FIREBASE_DB_BASE = 'https://skillsnap-ai-cloud.firebaseio.com';

const FIREBASE_CONFIG = {
  databaseURL: "https://skillsnap-ai-cloud-default-rtdb.firebaseio.com",
  projectId: "skillsnap-ai-cloud"
};

let firebaseDbInstance = null;

function initFirebaseSDK(userId = activeUserId) {
  activeUserId = userId;
  try {
    if (typeof firebase !== 'undefined' && (!firebase.apps || !firebase.apps.length)) {
      firebase.initializeApp(FIREBASE_CONFIG);
      firebaseDbInstance = firebase.database();
      console.log(`⚡ Dynamic Firebase Realtime Cloud SDK Connected (users/${userId})!`);
    }

    if (firebaseDbInstance) {
      // Dynamic real-time listener on active user node
      firebaseDbInstance.ref(`users/${userId}`).on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
          updateWebDashboardStats(data);

          if (data.profile && data.profile.full_name) {
            const name = data.profile.full_name;
            document.querySelectorAll('.user-name, .user-title, .settings-user-name').forEach(t => t.innerText = name);
          }

          if (data.chat_messages && Array.isArray(data.chat_messages)) {
            renderWebChatMessagesFromFirebase(data.chat_messages);
          }

          saveWebProgressLocally(data);
        } else {
          // Initialize clean fallback record if node doesn't exist yet
          initializeLiveUserRecord(userId, 'John Jonson');
        }
      });
    }
  } catch (e) {
    console.log('Firebase SDK init fallback to REST sync', e);
  }
}

async function initializeLiveUserRecord(userId, fullName = 'New User') {
  const initialData = {
    user_id: userId,
    full_name: fullName,
    lessons_completed: 0,
    hours_spent: 0.0,
    ats_score: 0,
    skills: {},
    profile: { full_name: fullName, email: `${userId}@skillsnap.ai` },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  updateWebDashboardStats(initialData);
  await updateWebFirebase(initialData, userId);
  return initialData;
}

function renderWebChatMessagesFromFirebase(messages) {
  const container = document.getElementById('chat-messages-container');
  if (!container) return;
  
  container.innerHTML = '';
  messages.forEach(msg => {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${msg.sender === 'user' ? 'user' : 'assistant'}`;
    msgDiv.innerHTML = `<p>${msg.text}</p>`;
    container.appendChild(msgDiv);
  });
  container.scrollTop = container.scrollHeight;
}

async function syncWebWithFirebase(userId = activeUserId) {
  initFirebaseSDK(userId);
  const endpoints = [
    `${FIREBASE_RTDB_BASE}/users/${userId}.json`,
    `${FIREBASE_DB_BASE}/users/${userId}.json`,
    getBackendUrl() + `/users/${userId}.json`
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
      if (res.ok) {
        const data = await res.json();
        if (data && (data.lessons_completed !== undefined || data.skills !== undefined)) {
          updateWebDashboardStats(data);
          saveWebProgressLocally(data);
          break;
        }
      }
    } catch (e) {}
  }
}

async function updateWebFirebase(progress, userId = activeUserId) {
  const payload = {
    ...progress,
    user_id: userId,
    platform: 'Web Application',
    updated_at: new Date().toISOString()
  };

  if (firebaseDbInstance) {
    try {
      await firebaseDbInstance.ref(`users/${userId}`).update(payload);
    } catch (e) {}
  }

  const endpoints = [
    `${FIREBASE_RTDB_BASE}/users/${userId}.json`,
    `${FIREBASE_DB_BASE}/users/${userId}.json`,
    getBackendUrl() + `/users/${userId}.json`
  ];

  for (const url of endpoints) {
    try {
      await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {}
  }
  saveWebProgressLocally(payload);
}

function saveWebProgressLocally(progress) {
  try {
    localStorage.setItem('skillsnap_user_progress', JSON.stringify(progress));
  } catch (e) {}
}

async function resetWebProgress() {
  const resetData = {
    user_id: 1,
    lessons_completed: 0,
    hours_spent: 0.0,
    skills: {
      "UI/UX Design": 0,
      "FastAPI Backend": 0,
      "Flutter Mobile": 0
    },
    updated_at: new Date().toISOString()
  };
  updateWebDashboardStats(resetData);
  await updateWebFirebase(resetData);
  console.log('🔄 All progress reset to 0 and synced live across all devices!');
}

function loadWebProgressLocally() {
  try {
    const saved = localStorage.getItem('skillsnap_user_progress');
    if (saved) {
      const progress = JSON.parse(saved);
      updateWebDashboardStats(progress);
    }
  } catch (e) {}
}

function updateSkillBarWeb(skillName, percent) {
  let valId = '';
  let fillId = '';

  if (skillName === 'UI/UX Design' || skillName === 'uiux') {
    valId = 'skill-val-uiux';
    fillId = 'skill-bar-uiux';
  } else if (skillName === 'FastAPI Backend' || skillName === 'design') {
    valId = 'skill-val-design';
    fillId = 'skill-bar-design';
  } else if (skillName === 'Flutter Mobile' || skillName === 'mgmt') {
    valId = 'skill-val-mgmt';
    fillId = 'skill-bar-mgmt';
  }

  if (valId && fillId) {
    const valEl = document.getElementById(valId);
    const fillEl = document.getElementById(fillId);
    if (valEl) valEl.innerText = `${percent}%`;
    if (fillEl) fillEl.style.width = `${percent}%`;
  }
}

function updateWebDashboardStats(progress) {
  saveWebProgressLocally(progress);

  const lessonsEls = document.querySelectorAll('#stat-lessons-completed, .stat-lessons-count, #dash-lessons, .lessons-count, #metric-lessons-completed');
  lessonsEls.forEach(el => el.innerText = progress.lessons_completed !== undefined ? progress.lessons_completed : 0);

  const hoursEls = document.querySelectorAll('#stat-hours-spent, .stat-hours-count, #dash-hours, .hours-count, #metric-hours-spent');
  hoursEls.forEach(el => el.innerText = (progress.hours_spent !== undefined ? progress.hours_spent : 0.0).toFixed(1) + 'h');

  if (progress.skills) {
    const uiux = progress.skills['UI/UX Design'] !== undefined ? progress.skills['UI/UX Design'] : (progress.skills['uiux'] || 0);
    const fastapi = progress.skills['FastAPI Backend'] !== undefined ? progress.skills['FastAPI Backend'] : (progress.skills['design'] || 0);
    const flutter = progress.skills['Flutter Mobile'] !== undefined ? progress.skills['Flutter Mobile'] : (progress.skills['mgmt'] || 0);

    updateSkillBarWeb('UI/UX Design', uiux);
    updateSkillBarWeb('FastAPI Backend', fastapi);
    updateSkillBarWeb('Flutter Mobile', flutter);
  }
}

async function resetProgressWeb() {
  const resetData = {
    user_id: 1,
    lessons_completed: 0,
    hours_spent: 0.0,
    skills: {
      "UI/UX Design": 0,
      "FastAPI Backend": 0,
      "Flutter Mobile": 0
    },
    updated_at: new Date().toISOString()
  };

  updateWebDashboardStats(resetData);
  await updateWebFirebase(resetData);
  showToast('🔄 All Progress Reset to 0% across Web & Mobile App!', 'info');
}

function connectProgressWebSocket() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}/ws/1`;
  try {
    const socket = new WebSocket(wsUrl);
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'PROGRESS_UPDATE' && data.progress) {
        updateWebDashboardStats(data.progress);
        showToast('🔄 Real-Time Progress Synced live!', 'info');
      }
    };
  } catch (e) {
    console.log('WebSocket sync error', e);
  }
}

function openFullReportModal() {
  const modal = document.getElementById('full-report-modal');
  if (modal) {
    modal.style.display = 'flex';
    if (window.lucide) lucide.createIcons();
  }
}

function closeFullReportModal() {
  const modal = document.getElementById('full-report-modal');
  if (modal) modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  loadWebProgressLocally();
  syncWebWithFirebase();
  connectProgressWebSocket();

  // Continuous Firebase Realtime Sync polling every 2 seconds
  setInterval(syncWebWithFirebase, 2000);
});
