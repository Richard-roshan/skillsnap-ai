// API Service for SkillSnap AI
const BASE_URL = 'http://localhost:8000';

// Detailed, premium mock data to fall back on when server is offline
const MOCK_DATA = {
  user: {
    id: 1,
    full_name: 'John Jonson',
    email: 'johnjonson@email.com',
    avatar_url: '/assets/images/avatar.png',
  },
  skills: [
    { skill_name: 'Flutter & Dart', progress_percent: 80 },
    { skill_name: 'React & JS Web', progress_percent: 65 },
    { skill_name: 'Python (FastAPI)', progress_percent: 45 },
    { skill_name: 'UI/UX Design', progress_percent: 72 }
  ],
  stats: {
    lessons_completed: 18,
    hours_spent: 48,
  },
  courses: [
    {
      course_id: 1,
      title: 'Introduction to React',
      subtitle: 'Learn modern hooks, components, and state management.',
      image_url: '/assets/images/course1.jpg',
      lesson_count: 12,
      rating: '4.9',
      action_text: 'Resume',
      progress_percent: 45
    },
    {
      course_id: 2,
      title: 'Flutter for Beginners',
      subtitle: 'Build multiplatform native mobile applications.',
      image_url: '/assets/images/course2.jpg',
      lesson_count: 18,
      rating: '4.7',
      action_text: 'Start',
      progress_percent: 10
    }
  ],
  career_paths: [
    { title: 'Full Stack Web Developer', match_percent: 92, demand_level: 'High Demand' },
    { title: 'Mobile App Engineer', match_percent: 85, demand_level: 'High Demand' },
    { title: 'UI/UX Product Designer', match_percent: 74, demand_level: 'Medium Demand' }
  ],
  resume: {
    resume_name: 'John_Jonson_Resume.pdf',
    ats_score: 78
  },
  lessons: {
    1: [
      {
        id: 101,
        lesson_title: '1. Welcome & Setup',
        lesson_description: 'Initialize your Vite React project, explore node_modules, and configure styles.',
        youtube_video_id: 'Ke90Tje7VS0', // Standard helpful React tutorial ID
        duration: '8 mins'
      },
      {
        id: 102,
        lesson_title: '2. React Components',
        lesson_description: 'Understand functional components, composition, props, and standard clean code.',
        youtube_video_id: 'SqcY0GlETPk',
        duration: '12 mins'
      },
      {
        id: 103,
        lesson_title: '3. State and Hooks',
        lesson_description: 'Master useState, useEffect, and reactive rendering pipelines.',
        youtube_video_id: 'O6P86uwfdR0',
        duration: '15 mins'
      }
    ],
    2: [
      {
        id: 201,
        lesson_title: '1. Flutter Introduction',
        lesson_description: 'Learn why Flutter uses Dart and widgets for cross-platform layouts.',
        youtube_video_id: 'VPvVD8t02U8',
        duration: '10 mins'
      },
      {
        id: 202,
        lesson_title: '2. Building Layouts',
        lesson_description: 'Rows, Columns, Stack, and Container alignments.',
        youtube_video_id: 'jqy7F7t__oM',
        duration: '18 mins'
      },
      {
        id: 203,
        lesson_title: '3. State Management',
        lesson_description: 'Manage reactive states with ValueNotifiers and Providers.',
        youtube_video_id: '351_eP595m8',
        duration: '14 mins'
      }
    ]
  }
};

// Help log the connection status to the desktop side panel
let isConnectionOnline = true;
const listeners = [];

export const registerConnectionListener = (callback) => {
  listeners.push(callback);
  callback(isConnectionOnline);
};

const setConnectionStatus = (online) => {
  if (isConnectionOnline !== online) {
    isConnectionOnline = online;
    listeners.forEach(cb => cb(online));
  }
};

export const toggleConnectionMode = () => {
  setConnectionStatus(!isConnectionOnline);
  return isConnectionOnline;
};

export const getConnectionStatus = () => isConnectionOnline;

// API IMPLEMENTATIONS
const handleRequest = async (path, options = {}) => {
  if (!isConnectionOnline) {
    console.log(`[API Mock] Offline mode active for: ${path}`);
    throw new Error('Offline Mode Activated');
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    
    const data = await response.json();
    return {
      statusCode: response.status,
      data,
    };
  } catch (error) {
    console.warn(`[API Error] Request to ${path} failed:`, error.message);
    throw error;
  }
};

export const ApiService = {
  login: async (email, password) => {
    try {
      return await handleRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    } catch (e) {
      // Fallback
      if (email === 'johnjonson@email.com' && password === 'password') {
        return {
          statusCode: 200,
          data: { detail: 'Success', token: 'mock_token', user: MOCK_DATA.user },
        };
      }
      return {
        statusCode: 400,
        data: { detail: 'Invalid credentials. Try johnjonson@email.com / password' },
      };
    }
  },

  register: async (fullName, email, phone, password) => {
    try {
      return await handleRequest('/register', {
        method: 'POST',
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          phone_number: phone,
          password: password,
        }),
      });
    } catch (e) {
      return {
        statusCode: 201,
        data: { detail: 'Account created successfully (Mock Mode)' },
      };
    }
  },

  fetchHomeDashboard: async (userId) => {
    try {
      const response = await handleRequest(`/home/dashboard/${userId}`);
      return response.data;
    } catch (e) {
      // Fallback
      return {
        user: MOCK_DATA.user,
        skills: MOCK_DATA.skills,
        stats: MOCK_DATA.stats,
        courses: MOCK_DATA.courses,
        career_paths: MOCK_DATA.career_paths,
      };
    }
  },

  fetchMentorshipDashboard: async (userId) => {
    try {
      const response = await handleRequest(`/mentorship/dashboard/${userId}`);
      return response.data;
    } catch (e) {
      // Fallback
      return {
        resume: MOCK_DATA.resume,
        resume_analysis: { ats_score: MOCK_DATA.resume.ats_score },
        career_paths: MOCK_DATA.career_paths,
      };
    }
  },

  fetchMyCourses: async (userId) => {
    try {
      const response = await handleRequest(`/my-courses/${userId}`);
      return response.data;
    } catch (e) {
      // Fallback
      return {
        courses: MOCK_DATA.courses,
      };
    }
  },

  fetchCourseLessons: async (courseId) => {
    try {
      const response = await handleRequest(`/courses/${courseId}/lessons`);
      return response.data;
    } catch (e) {
      // Fallback
      const lessonsList = MOCK_DATA.lessons[courseId] || MOCK_DATA.lessons[1];
      return {
        lessons: lessonsList,
      };
    }
  },
};
