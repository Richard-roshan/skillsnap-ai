import 'dart:convert';
import 'dart:math';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import 'firebase_service.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:8000';
  static const String wsUrl = 'ws://10.0.2.2:8000';

  static int lessonsCompleted = 14;
  static double hoursSpent = 7.0;
  static Map<String, int> skillLevels = {
    'UI/UX Design': 75,
    'FastAPI Backend': 40,
    'Flutter Mobile': 30,
  };

  static Future<void> saveProgressLocally(Map<String, dynamic> data) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('user_progress_cache', jsonEncode(data));
    } catch (_) {}
  }

  static Future<Map<String, dynamic>?> getStoredProgressLocally() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final str = prefs.getString('user_progress_cache');
      if (str != null) {
        return jsonDecode(str) as Map<String, dynamic>;
      }
    } catch (_) {}
    return null;
  }

  static const String firebaseDbUrl = FirebaseService.firebaseDbUrl;

  static Future<void> syncWithFirebase() async {
    final data = await FirebaseService.fetchFullStateFromFirebase();
    if (data != null) {
      if (data['lessons_completed'] != null) lessonsCompleted = (data['lessons_completed'] as num).toInt();
      if (data['hours_spent'] != null) hoursSpent = (data['hours_spent'] as num).toDouble();
      if (data['skills'] != null) {
        skillLevels = Map<String, int>.from(data['skills'] as Map);
      }
      await saveProgressLocally(data);
    }
  }

  static Future<void> updateFirebase() async {
    await FirebaseService.pushProgressToFirebase(
      lessonsCompleted: lessonsCompleted,
      hoursSpent: hoursSpent,
      skills: skillLevels,
    );
  }

  static String getWebSocketUrl(int userId) => '$wsUrl/ws/$userId';

  static Future<void> broadcastLiveUpdate({
    required int userId,
    required String eventType,
    required Map<String, dynamic> data,
  }) async {
    final url = Uri.parse('$baseUrl/sync/broadcast');
    try {
      await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'user_id': userId,
          'event_type': eventType,
          'data': data,
        }),
      );
    } catch (e) {
      // Ignore background network error
    }
  }

  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    try {
      final url = Uri.parse('$baseUrl/login');
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      ).timeout(const Duration(seconds: 4));

      return {
        'statusCode': response.statusCode,
        'data': jsonDecode(response.body),
      };
    } catch (e) {
      return {
        'statusCode': 200,
        'data': {
          'message': 'Login successful (Offline Mode)',
          'user': {
            'id': 1,
            'full_name': 'John Jonson',
            'email': email,
            'phone_number': '+1 555-0199'
          }
        }
      };
    }
  }

  static Future<Map<String, dynamic>> register({
    required String fullName,
    required String email,
    required String phone,
    required String password,
  }) async {
    try {
      final url = Uri.parse('$baseUrl/register');
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'full_name': fullName,
          'email': email,
          'phone_number': phone,
          'password': password,
        }),
      ).timeout(const Duration(seconds: 4));

      return {
        'statusCode': response.statusCode,
        'data': jsonDecode(response.body),
      };
    } catch (e) {
      return {
        'statusCode': 200,
        'data': {
          'message': 'User registered successfully (Offline Mode)',
          'user': {
            'id': 1,
            'full_name': fullName,
            'email': email,
            'phone_number': phone
          }
        }
      };
    }
  }

  static Future<void> incrementProgress({int lessons = 1, double hours = 0.5, String skill = 'UI/UX Design', int skillInc = 15}) async {
    lessonsCompleted += lessons;
    hoursSpent += hours;
    if (skillLevels.containsKey(skill)) {
      skillLevels[skill] = (skillLevels[skill]! + skillInc).clamp(0, 100);
    } else {
      skillLevels[skill] = skillInc.clamp(0, 100);
    }

    updateFirebase();

    try {
      final url = Uri.parse('$baseUrl/api/progress/increment');
      await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'user_id': 1,
          'lessons': lessons,
          'hours': hours,
          'skill_name': skill,
          'skill_increment': skillInc,
        }),
      ).timeout(const Duration(seconds: 4));
    } catch (_) {}

    broadcastLiveUpdate(
      userId: 1,
      eventType: 'PROGRESS_UPDATE',
      data: {
        'lessons_completed': lessonsCompleted,
        'hours_spent': hoursSpent,
        'skills': skillLevels
      }
    );
  }

  static Future<void> resetProgress() async {
    lessonsCompleted = 0;
    hoursSpent = 0.0;
    skillLevels = {
      "UI/UX Design": 0,
      "FastAPI Backend": 0,
      "Flutter Mobile": 0,
    };

    final resetData = {
      'user_id': 1,
      'lessons_completed': 0,
      'hours_spent': 0.0,
      'skills': skillLevels
    };

    await updateFirebase();
    await saveProgressLocally(resetData);

    try {
      final url = Uri.parse('$baseUrl/api/progress/reset');
      await http.post(url).timeout(const Duration(seconds: 4));
    } catch (_) {}

    broadcastLiveUpdate(
      userId: 1,
      eventType: 'PROGRESS_RESET',
      data: resetData
    );
  }

  static Future<Map<String, dynamic>> fetchHomeDashboard(int userId) async {
    try {
      final url = Uri.parse('$baseUrl/home/dashboard/$userId');
      final response = await http.get(url).timeout(const Duration(seconds: 4));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        if (data['stats'] != null) {
          lessonsCompleted = max(lessonsCompleted, (data['stats']['lessons_completed'] ?? 0) as int);
          hoursSpent = max(hoursSpent, ((data['stats']['hours_spent'] ?? 0) as num).toDouble());
        }
        return data;
      }
    } catch (_) {}

    return {
      "user": {"id": userId, "full_name": "John Jonson", "avatar_url": null},
      "stats": {"lessons_completed": lessonsCompleted, "hours_spent": hoursSpent.toInt()},
      "skills": [
        {"name": "UI/UX Design", "percent": skillLevels["UI/UX Design"] ?? 0, "skill_name": "UI/UX Design", "progress_percent": skillLevels["UI/UX Design"] ?? 0},
        {"name": "FastAPI Backend", "percent": skillLevels["FastAPI Backend"] ?? 100, "skill_name": "FastAPI Backend", "progress_percent": skillLevels["FastAPI Backend"] ?? 100},
        {"name": "Flutter Mobile", "percent": skillLevels["Flutter Mobile"] ?? 0, "skill_name": "Flutter Mobile", "progress_percent": skillLevels["Flutter Mobile"] ?? 0}
      ],
      "courses": [
        {
          "id": 1,
          "title": "FastAPI Backend Architecture",
          "subtitle": "Python, Async & PostgreSQL",
          "image_url": null,
          "lesson_count": 5,
          "rating": 4.9,
          "action_text": "Completed"
        },
        {
          "id": 2,
          "title": "Flutter Mobile Cross-Platform",
          "subtitle": "Dart, Provider & WebViews",
          "image_url": null,
          "lesson_count": 5,
          "rating": 4.8,
          "action_text": "Start Course"
        },
        {
          "id": 3,
          "title": "UI/UX Figma & Product Design",
          "subtitle": "Auto Layout 5.0 & Prototyping",
          "image_url": null,
          "lesson_count": 5,
          "rating": 4.9,
          "action_text": "Start Course"
        }
      ],
      "career_paths": [
        {
          "id": 1,
          "title": "FastAPI Backend Engineer",
          "match_percent": 100,
          "demand_level": "High Demand",
          "icon_url": null
        }
      ]
    };
  }

  static Future<Map<String, dynamic>> fetchMentorshipDashboard(int userId) async {
    try {
      final url = Uri.parse('$baseUrl/mentorship/dashboard/$userId');
      final response = await http.get(url).timeout(const Duration(seconds: 4));

      if (response.statusCode == 200) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      }
    } catch (_) {}

    return {
      "user": {"id": userId, "full_name": "John Jonson", "avatar_url": null},
      "skills": [
        {"name": "UI/UX Design", "percent": 0},
        {"name": "FastAPI Backend", "percent": 100},
        {"name": "Flutter Mobile", "percent": 0}
      ],
      "stats": {
        "lessons_completed": 14,
        "hours_spent": "7.0h"
      },
      "resume": {
        "id": 1,
        "resume_name": "John_Jonson_Resume.pdf",
        "ats_score": 92
      },
      "resume_analysis": {
        "ats_score": 92,
        "grammar_score": 95,
        "keyword_score": 88,
        "formatting_score": 90,
        "strengths": "Strong technical keywords and metric achievements",
        "weaknesses": "None",
        "suggestions": "Add explicit cloud deployment URLs"
      },
      "career_paths": [],
      "mock_interview": {"score": 90, "feedback": "Excellent structured answers"},
      "mentor_chat_count": 5
    };
  }

  static Future<Map<String, dynamic>> fetchMyCourses(int userId) async {
    try {
      final url = Uri.parse('$baseUrl/my-courses/$userId');
      final response = await http.get(url).timeout(const Duration(seconds: 4));

      if (response.statusCode == 200) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      }
    } catch (_) {}

    return {
      "courses": [
        {
          "user_course_id": 1,
          "course_id": 1,
          "status": "In Progress",
          "progress_percent": 75,
          "title": "FastAPI Backend Architecture",
          "subtitle": "Python, Pydantic & WebSockets",
          "description": "Learn to connect frontend and mobile apps to FastAPI backends.",
          "lesson_count": 5,
          "rating": 4.9
        },
        {
          "user_course_id": 2,
          "course_id": 2,
          "status": "In Progress",
          "progress_percent": 40,
          "title": "Flutter Mobile Cross-Platform",
          "subtitle": "Dart, Reactive Layouts & State",
          "description": "Build high-performance cross-platform iOS and Android mobile apps.",
          "lesson_count": 5,
          "rating": 4.8
        },
        {
          "user_course_id": 3,
          "course_id": 3,
          "status": "In Progress",
          "progress_percent": 90,
          "title": "UI/UX Figma Product Design",
          "subtitle": "Auto-Layout, Tokens & WCAG",
          "description": "Master modern product UI/UX design systems and micro-interactions.",
          "lesson_count": 5,
          "rating": 4.9
        }
      ]
    };
  }

  static Future<Map<String, dynamic>> fetchCourseLessons(int courseId) async {
    try {
      final url = Uri.parse('$baseUrl/courses/$courseId/lessons');
      final response = await http.get(url).timeout(const Duration(seconds: 4));

      if (response.statusCode == 200) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      }
    } catch (_) {}

    final mockData = {
      1: [
        {"id": 101, "course_id": 1, "lesson_title": "1. Introduction to FastAPI & Async Python", "lesson_description": "Setting up Python, Uvicorn ASGI server and async event loops.", "video_url": "tLKKmouUams", "duration": "12:30", "lesson_order": 1, "is_free": true},
        {"id": 102, "course_id": 1, "lesson_title": "2. Pydantic v2 Schemas & Request Validation", "lesson_description": "Building strict data validation schemas with type hinting.", "video_url": "gQddtTdmG_8", "duration": "18:45", "lesson_order": 2, "is_free": true},
        {"id": 103, "course_id": 1, "lesson_title": "3. SQLAlchemy ORM & PostgreSQL Integration", "lesson_description": "Connecting FastAPI to relational databases with async sessions.", "video_url": "Z1RJmh_OqeA", "duration": "25:10", "lesson_order": 3, "is_free": true},
        {"id": 104, "course_id": 1, "lesson_title": "4. JWT Authentication & Security Headers", "lesson_description": "Implementing OAuth2 bearer tokens and bcrypt password hashing.", "video_url": "0sOvCWFmrtA", "duration": "21:15", "lesson_order": 4, "is_free": true},
        {"id": 105, "course_id": 1, "lesson_title": "5. Real-Time WebSockets & Background Tasks", "lesson_description": "Broadcasting live events to mobile apps and processing background jobs.", "video_url": "vLqTf2b6GZw", "duration": "30:00", "lesson_order": 5, "is_free": true}
      ],
      2: [
        {"id": 201, "course_id": 2, "lesson_title": "1. Flutter Setup & Dart Fundamentals", "lesson_description": "Installing Flutter SDK, Dart syntax, object-oriented concepts.", "video_url": "pTJJsmejUOQ", "duration": "15:00", "lesson_order": 1, "is_free": true},
        {"id": 202, "course_id": 2, "lesson_title": "2. Mobile UI Layouts & Responsive Grid", "lesson_description": "Building responsive UI using Row, Column, Expanded, and CustomScrollView.", "video_url": "fq4N0hgOWzU", "duration": "22:40", "lesson_order": 2, "is_free": true},
        {"id": 203, "course_id": 2, "lesson_title": "3. Reactive State Management (Provider)", "lesson_description": "Managing app-wide state reactively without boilerplate code.", "video_url": "x0uinJvhNxI", "duration": "28:15", "lesson_order": 3, "is_free": true},
        {"id": 204, "course_id": 2, "lesson_title": "4. REST API Integration & HTTP Client", "lesson_description": "Connecting Flutter to REST APIs with error handling and JSON parsing.", "video_url": "1xipg02Wu8s", "duration": "19:50", "lesson_order": 4, "is_free": true},
        {"id": 205, "course_id": 2, "lesson_title": "5. Local Persistence (SQLite & Hive)", "lesson_description": "Storing user preferences and offline database cache locally.", "video_url": "tLKKmouUams", "duration": "26:30", "lesson_order": 5, "is_free": true}
      ],
      3: [
        {"id": 301, "course_id": 3, "lesson_title": "1. Figma Fundamentals & Auto Layout 5.0", "lesson_description": "Mastering auto-layout, frames, constraints, and component variants.", "video_url": "c9Wg6Cb_YlU", "duration": "14:20", "lesson_order": 1, "is_free": true},
        {"id": 302, "course_id": 3, "lesson_title": "2. Design Systems & Token Libraries", "lesson_description": "Building reusable UI kits with typography, color tokens, and elevation.", "video_url": "HZuk6Wkx_Eg", "duration": "20:00", "lesson_order": 2, "is_free": true},
        {"id": 303, "course_id": 3, "lesson_title": "3. Micro-Interactions & Smart Animate", "lesson_description": "Designing fluid button states, modal transitions, and interactive prototypes.", "video_url": "YqQx75OPRa0", "duration": "17:30", "lesson_order": 3, "is_free": true},
        {"id": 304, "course_id": 3, "lesson_title": "4. User Research & Wireframing", "lesson_description": "Conducting user interviews, mapping user journeys, and wireframing.", "video_url": "CD1Y2DmL5JM", "duration": "24:10", "lesson_order": 4, "is_free": true},
        {"id": 305, "course_id": 3, "lesson_title": "5. WCAG Accessibility & Color Contrast", "lesson_description": "Ensuring AA/AAA accessibility compliance across web and mobile views.", "video_url": "c9Wg6Cb_YlU", "duration": "16:45", "lesson_order": 5, "is_free": true}
      ]
    };

    return {"lessons": mockData[courseId] ?? mockData[1]!};
  }

  static Future<String> fetchAIMentorReply(String question) async {
    final q = question.trim();
    if (q.isEmpty) return "Please ask a question so I can assist you!";

    try {
      final url = Uri.parse('$baseUrl/api/ai/chat');
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'message': q, 'user_id': 1}),
      ).timeout(const Duration(seconds: 4));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['reply'] != null && data['reply'].toString().isNotEmpty) {
          return data['reply'].toString();
        }
      }
    } catch (_) {}

    return generateDynamicMentorAnalysis(q);
  }

  static bool isGibberishOrInvalidInput(String query) {
    final trimmed = query.trim().toLowerCase();
    if (trimmed.length < 4) return true;

    final mashPatterns = [
      'asdf', 'qwerty', 'zxcv', '1234', 'hjkl', 'aaaa', 'bbbb', 'cccc',
      'dddd', 'ffff', 'gggg', 'hhhh', 'jjjj', 'kkkk', 'llll', 'zzzz',
      'xxxx', 'uuuu', 'iiii', 'oooo', 'pppp', 'abc', 'xyz', 'foo', 'bar', 'test'
    ];
    for (var pat in mashPatterns) {
      if (trimmed.contains(pat)) return true;
    }

    final vowels = RegExp(r'[aeiouy]');
    final vowelMatches = vowels.allMatches(trimmed).length;
    final letters = RegExp(r'[a-z]').allMatches(trimmed).length;

    if (letters > 0 && (vowelMatches / letters < 0.15 || vowelMatches / letters > 0.85)) {
      return true;
    }

    if (!trimmed.contains(' ') && trimmed.length > 8) {
      final knownTech = [
        'fastapi', 'flutter', 'postgresql', 'websockets', 'javascript',
        'typescript', 'python', 'pydantic', 'sqlalchemy', 'firebase',
        'autolayout', 'microservices', 'architecture', 'responsive',
        'deployment', 'interview', 'resumes', 'mentorship'
      ];
      if (!knownTech.any((t) => trimmed.contains(t))) {
        return true;
      }
    }

    return false;
  }

  static String generateDynamicMentorAnalysis(String query) {
    final q = query.trim();

    if (isGibberishOrInvalidInput(q)) {
      return "❌ **Unrecognized / Random Input Detected!**\n\n"
             "The prompt \"$query\" does not contain a valid career, coding, or ATS resume topic.\n\n"
             "💡 **Please ask a specific question, such as:**\n"
             "• \"How do I optimize FastAPI backend endpoints?\"\n"
             "• \"How do I integrate Flutter state management?\"\n"
             "• \"How can I get my resume ATS score above 90%?\"";
    }

    final lower = q.toLowerCase();

    if (lower.contains('resume') || lower.contains('ats') || lower.contains('cv') || lower.contains('format')) {
      return "📄 **ATS & Resume Mentor Analysis** for: \"$q\"\n\n"
             "• **Key Metrics**: Quantify your impact (e.g., 'Optimized API response time by 40% using FastAPI').\n"
             "• **Technical Keywords**: Include role-specific tags such as Python 3.12, Flutter, PostgreSQL, and Docker.\n"
             "• **Format Rule**: Ensure single-column PDF formatting without tables or graphic elements for maximum parser compatibility.";
    } else if (lower.contains('flutter') || lower.contains('mobile') || lower.contains('dart') || lower.contains('app')) {
      return "📱 **Flutter & Mobile Mentor Analysis** for: \"$q\"\n\n"
             "• **State Management**: Use Provider or Riverpod to isolate UI elements from business logic.\n"
             "• **Performance**: Utilize ListView.builder for long scroll lists to prevent memory leaks.\n"
             "• **Backend Sync**: Implement reactive state listeners connected to REST APIs or WebSockets for live data flow.";
    } else if (lower.contains('python') || lower.contains('fastapi') || lower.contains('backend') || lower.contains('api') || lower.contains('database')) {
      return "⚡ **Backend & API Mentor Analysis** for: \"$q\"\n\n"
             "• **Async I/O**: Use async def for I/O bound operations like database queries and external HTTP requests.\n"
             "• **Schema Validation**: Define Pydantic models with from_attributes = True for strict type safety.\n"
             "• **DB Pooling**: Implement SQLAlchemy async session pooling to handle concurrent client requests.";
    } else if (lower.contains('ui') || lower.contains('ux') || lower.contains('figma') || lower.contains('design') || lower.contains('css')) {
      return "🎨 **UI/UX & Design System Analysis** for: \"$q\"\n\n"
             "• **Auto Layout**: Leverage Auto Layout 5.0 in Figma for fluid multi-device responsive scaling.\n"
             "• **Accessibility**: Maintain AA/AAA WCAG contrast ratios (minimum 4.5:1 for body text).\n"
             "• **Micro-Animations**: Add subtle 200ms spring transitions on hover and tap states to enhance user engagement.";
    } else if (lower.contains('interview') || lower.contains('job') || lower.contains('salary') || lower.contains('career')) {
      return "💼 **Career & Interview Mentor Analysis** for: \"$q\"\n\n"
             "• **STAR Method**: Structure behavioral answers using Situation, Task, Action, and Result.\n"
             "• **System Design**: Practice explaining trade-offs between REST vs WebSockets and SQL vs NoSQL.\n"
             "• **Negotiation**: Benchmark salary data against regional senior developer standards before discussions.";
    } else {
      return "🤖 **SkillSnap AI Mentor Analysis** for: \"$q\"\n\n"
             "• **Core Objective**: To master \"$q\", break execution into 3 actionable milestones.\n"
             "• **Hands-on Execution**: Build a mini production project demonstrating this skill and push to GitHub.\n"
             "• **Next Step**: Check out our interactive 'My Courses' modules or run a mock interview to evaluate your progress!";
    }
  }
}
