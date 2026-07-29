import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import '../services/api_service.dart';
import 'home_screen.dart';
import 'mentorship_screen.dart';
import 'quiz_mock_interview_screen.dart';
import 'settings_screen.dart';

class MyCoursesScreen extends StatefulWidget {
  const MyCoursesScreen({super.key});

  @override
  State<MyCoursesScreen> createState() => _MyCoursesScreenState();
}

class _MyCoursesScreenState extends State<MyCoursesScreen> {
  int currentIndex = 3;

  bool isLoading = true;
  bool isLessonsLoading = false;

  String? errorMessage;

  List<dynamic> courses = [];
  List<dynamic> lessons = [];

  Map<String, dynamic>? selectedCourse;
  Map<String, dynamic>? selectedLesson;

  late final WebViewController _webViewController;

  @override
  void initState() {
    super.initState();
    _webViewController = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setUserAgent('Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36')
      ..setBackgroundColor(const Color(0xFF000000));
    loadCourses();
  }

  int _toInt(dynamic value) {
    if (value is int) return value;
    if (value is String) return int.tryParse(value) ?? 0;
    if (value is num) return value.toInt();
    return 0;
  }

  Future<void> loadCourses() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final res = await ApiService.fetchMyCourses(1);
      final loadedCourses = res['courses'] as List<dynamic>;

      setState(() {
        courses = loadedCourses;
        isLoading = false;
      });

      if (courses.isNotEmpty) {
        selectCourse(Map<String, dynamic>.from(courses[0]));
      }
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
        isLoading = false;
      });
    }
  }

  Future<void> selectCourse(Map<String, dynamic> course) async {
    setState(() {
      selectedCourse = course;
      isLessonsLoading = true;
      lessons = [];
    });

    final courseId = _toInt(course['id']);

    try {
      final data = await ApiService.fetchCourseLessons(courseId);
      final loadedLessons = data['lessons'] as List<dynamic>;

      setState(() {
        lessons = loadedLessons;
        isLessonsLoading = false;
      });

      if (lessons.isNotEmpty) {
        selectLesson(Map<String, dynamic>.from(lessons[0]));
      } else {
        setState(() {
          selectedLesson = null;
        });
      }
    } catch (e) {
      setState(() {
        isLessonsLoading = false;
      });
    }
  }

  void selectLesson(Map<String, dynamic> lesson) {
    final rawUrl = lesson['video_url'] as String? ?? 'tLKKmouUams';
    String videoId = rawUrl;
    if (videoId.contains('v=')) {
      videoId = videoId.split('v=').last.split('&').first;
    } else if (videoId.contains('/')) {
      videoId = videoId.split('/').last;
    }
    if (videoId.isEmpty) videoId = 'tLKKmouUams';

    final htmlContent = '''
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: #000; overflow: hidden; display: flex; align-items: center; justify-content: center; }
    iframe { width: 100%; height: 100%; border: 0; }
  </style>
</head>
<body>
  <iframe 
    src="https://www.youtube-nocookie.com/embed/$videoId?autoplay=1&playsinline=1&rel=0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    allowfullscreen>
  </iframe>
</body>
</html>
''';

    _webViewController.loadHtmlString(
      htmlContent,
      baseUrl: 'https://skillsnap-ai.surge.sh',
    );

    setState(() {
      selectedLesson = lesson;
    });
  }

  void _onNavTap(int index) {
    if (index == 3) return;

    Widget target;
    if (index == 0) {
      target = const HomeScreen();
    } else if (index == 1) {
      target = const MentorshipScreen();
    } else if (index == 2) {
      target = const QuizMockInterviewScreen();
    } else {
      target = const SettingsScreen();
    }

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => target),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF121624) : const Color(0xFFF8FAFC),

      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 3,
        type: BottomNavigationBarType.fixed,
        selectedItemColor: const Color(0xFF3B82F6),
        unselectedItemColor: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
        backgroundColor: isDark ? const Color(0xFF1B2136) : Colors.white,
        onTap: _onNavTap,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.school), label: 'Mentorship'),
          BottomNavigationBarItem(icon: Icon(Icons.quiz), label: 'Quiz & Mock'),
          BottomNavigationBarItem(icon: Icon(Icons.menu_book), label: 'My Courses'),
          BottomNavigationBarItem(icon: Icon(Icons.settings), label: 'Settings'),
        ],
      ),

      body: SafeArea(
        child: isLoading
            ? const Center(child: CircularProgressIndicator())
            : errorMessage != null
            ? Center(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Text(
                    errorMessage!,
                    style: const TextStyle(color: Colors.red),
                    textAlign: TextAlign.center,
                  ),
                ),
              )
            : SingleChildScrollView(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // HEADER
                    Row(
                      children: [
                        Container(
                          height: 70,
                          width: 70,
                          decoration: BoxDecoration(
                            color: const Color(0xFF5B67FF),
                            borderRadius: BorderRadius.circular(18),
                          ),
                          child: const Icon(
                            Icons.menu_book_rounded,
                            color: Colors.white,
                            size: 38,
                          ),
                        ),

                        const SizedBox(width: 14),

                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "My Courses",
                                style: TextStyle(
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              SizedBox(height: 4),
                              Text(
                                "Watch and track your learning",
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.black54,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),

                    // ENROLLED COURSES
                    const Text(
                      "Enrolled Courses",
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 14),

                    SizedBox(
                      height: 255,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: courses.length,
                        separatorBuilder: (_, _) => const SizedBox(width: 14),
                        itemBuilder: (context, index) {
                          final course = courses[index];

                          final isSelected =
                              selectedCourse?['course_id'] ==
                              course['course_id'];

                          return GestureDetector(
                            onTap: () async {
                              await selectCourse(Map<String, dynamic>.from(course));
                            },
                              child: Container(
                                width: 250,
                                padding: const EdgeInsets.all(14),
                                decoration: BoxDecoration(
                                  color: isSelected
                                      ? (isDark ? const Color(0xFF1E293B) : const Color(0xFFEFF6FF))
                                      : (isDark ? const Color(0xFF1B2136) : Colors.white),
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(
                                    color: isSelected
                                        ? const Color(0xFF3B82F6)
                                        : (isDark ? const Color(0xFF334155) : Colors.grey.shade300),
                                    width: isSelected ? 2 : 1,
                                  ),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(16),
                                      child: SizedBox(
                                        height: 110,
                                        width: double.infinity,
                                        child: Container(
                                          decoration: BoxDecoration(
                                            gradient: LinearGradient(
                                              colors: index == 0
                                                  ? [const Color(0xFF3B82F6), const Color(0xFF1D4ED8)]
                                                  : (index == 1
                                                      ? [const Color(0xFF10B981), const Color(0xFF047857)]
                                                      : [const Color(0xFF8B5CF6), const Color(0xFF6D28D9)]),
                                              begin: Alignment.topLeft,
                                              end: Alignment.bottomRight,
                                            ),
                                          ),
                                          child: Center(
                                            child: Icon(
                                              index == 0
                                                  ? Icons.code_rounded
                                                  : (index == 1 ? Icons.phone_android_rounded : Icons.palette_rounded),
                                              color: Colors.white,
                                              size: 44,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),

                                  const SizedBox(height: 14),

                                  Text(
                                    course['title']?.toString() ?? '',
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),

                                  const SizedBox(height: 6),

                                  Text(
                                    course['subtitle']?.toString() ?? '',
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      fontSize: 12,
                                      color: Colors.black54,
                                    ),
                                  ),

                                  const Spacer(),

                                  LinearProgressIndicator(
                                    value:
                                        (_toInt(course['progress_percent']) /
                                                100)
                                            .clamp(0.0, 1.0),
                                    minHeight: 7,
                                    backgroundColor: Colors.grey.shade300,
                                    color: Colors.blue,
                                  ),

                                  const SizedBox(height: 8),

                                  Text(
                                    "${course['progress_percent'] ?? 0}% completed",
                                    style: const TextStyle(fontSize: 12),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),

                    const SizedBox(height: 24),

                    // VIDEO PLAYER
                    const Text(
                      "Lesson Player",
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 12),

                    AspectRatio(
                      aspectRatio: 16 / 9,
                      child: Container(
                        decoration: BoxDecoration(
                          color: Colors.black,
                          borderRadius: BorderRadius.circular(18),
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(18),
                          child: WebViewWidget(controller: _webViewController),
                        ),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // LESSONS
                    const Text(
                      "Lessons",
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 12),

                    if (isLessonsLoading)
                      const Center(child: CircularProgressIndicator())
                    else if (lessons.isEmpty)
                      const Center(
                        child: Padding(
                          padding: EdgeInsets.symmetric(vertical: 30),
                          child: Text("No lessons found"),
                        ),
                      )
                    else
                      ListView.separated(
                        itemCount: lessons.length,
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        separatorBuilder: (_, _) => const SizedBox(height: 12),
                        itemBuilder: (context, index) {
                          final lesson = Map<String, dynamic>.from(
                            lessons[index],
                          );

                          final isSelected =
                              selectedLesson?['id'] == lesson['id'];

                          return GestureDetector(
                            onTap: () => selectLesson(lesson),
                            child: Container(
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: isSelected
                                    ? (isDark ? const Color(0xFF1E293B) : const Color(0xFFEFF6FF))
                                    : (isDark ? const Color(0xFF1B2136) : Colors.white),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: isSelected
                                      ? const Color(0xFF3B82F6)
                                      : (isDark ? const Color(0xFF334155) : Colors.grey.shade300),
                                  width: isSelected ? 2 : 1,
                                ),
                              ),
                              child: Row(
                                children: [
                                  Container(
                                    height: 55,
                                    width: 55,
                                    decoration: BoxDecoration(
                                      color: const Color(0xFF3B82F6).withValues(alpha: 0.15),
                                      borderRadius: BorderRadius.circular(14),
                                    ),
                                    child: const Icon(
                                      Icons.play_circle_fill,
                                      color: Color(0xFF3B82F6),
                                      size: 30,
                                    ),
                                  ),

                                  const SizedBox(width: 12),

                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          lesson['lesson_title']?.toString() ??
                                              '',
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                          style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 15,
                                            color: isDark ? Colors.white : Colors.black,
                                          ),
                                        ),

                                        const SizedBox(height: 4),

                                        Text(
                                          lesson['lesson_description']
                                                  ?.toString() ??
                                              '',
                                          maxLines: 2,
                                          overflow: TextOverflow.ellipsis,
                                          style: TextStyle(
                                            fontSize: 12,
                                            color: isDark ? Colors.white70 : Colors.black54,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),

                                  const SizedBox(width: 10),

                                  Text(
                                    lesson['duration']?.toString() ?? '',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: isDark ? Colors.white70 : Colors.black54,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                  ],
                ),
              ),
      ),
    );
  }
}
