import 'package:flutter/material.dart';
import 'package:youtube_player_iframe/youtube_player_iframe.dart';
import '../services/api_service.dart';
import 'home_screen.dart';
import 'mentorship_screen.dart';
import 'settings_screen.dart';

class MyCoursesScreen extends StatefulWidget {
  const MyCoursesScreen({super.key});

  @override
  State<MyCoursesScreen> createState() => _MyCoursesScreenState();
}

class _MyCoursesScreenState extends State<MyCoursesScreen> {
  int currentIndex = 2;

  bool isLoading = true;
  bool isLessonsLoading = false;

  String? errorMessage;

  List<dynamic> courses = [];
  List<dynamic> lessons = [];

  Map<String, dynamic>? selectedCourse;
  Map<String, dynamic>? selectedLesson;

  YoutubePlayerController? _ytController;

  @override
  void initState() {
    super.initState();
    loadCourses();
  }

  @override
  void dispose() {
    _ytController?.close();
    super.dispose();
  }

  int _toInt(dynamic value) {
    if (value is int) return value;
    if (value is String) return int.tryParse(value) ?? 0;
    if (value is num) return value.toInt();
    return 0;
  }

  Future<void> loadCourses() async {
    try {
      setState(() {
        isLoading = true;
        errorMessage = null;
      });

      final data = await ApiService.fetchMyCourses(1);

      final loadedCourses = data['courses'] as List<dynamic>;

      setState(() {
        courses = loadedCourses;
        isLoading = false;
      });

      if (courses.isNotEmpty) {
        selectedCourse = Map<String, dynamic>.from(courses[0]);

        await loadLessons(_toInt(courses[0]['course_id']));
      }
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
        isLoading = false;
      });
    }
  }

  Future<void> loadLessons(int courseId) async {
    try {
      setState(() {
        isLessonsLoading = true;
      });

      final data = await ApiService.fetchCourseLessons(courseId);

      final loadedLessons = data['lessons'] as List<dynamic>;

      setState(() {
        lessons = loadedLessons;
        isLessonsLoading = false;
      });

      if (lessons.isNotEmpty) {
        selectLesson(Map<String, dynamic>.from(lessons[0]));
      } else {
        _ytController?.close();
        _ytController = null;

        setState(() {
          selectedLesson = null;
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
        isLessonsLoading = false;
      });
    }
  }

  String _extractYoutubeVideoId(String input) {
    final value = input.trim();

    if (value.isEmpty) return '';

    if (!value.contains('http') && value.length >= 11) {
      return value;
    }

    final uri = Uri.tryParse(value);

    if (uri == null) return '';

    if (uri.host.contains('youtu.be')) {
      return uri.pathSegments.isNotEmpty ? uri.pathSegments.first : '';
    }

    if (uri.host.contains('youtube.com')) {
      if (uri.pathSegments.contains('watch')) {
        return uri.queryParameters['v'] ?? '';
      }

      if (uri.pathSegments.contains('embed') && uri.pathSegments.length >= 2) {
        return uri.pathSegments[1];
      }

      if (uri.pathSegments.contains('shorts') && uri.pathSegments.length >= 2) {
        return uri.pathSegments[1];
      }
    }

    return '';
  }

  void selectLesson(Map<String, dynamic> lesson) {
    final rawVideo =
        lesson['youtube_video_id']?.toString() ??
        lesson['video_url']?.toString() ??
        '';

    final videoId = _extractYoutubeVideoId(rawVideo);

    if (videoId.isEmpty) return;

    _ytController?.close();

    _ytController = YoutubePlayerController.fromVideoId(
      videoId: videoId,
      params: const YoutubePlayerParams(
        showControls: true,
        showFullscreenButton: true,
        playsInline: true,
        mute: false,
      ),
    );

    setState(() {
      selectedLesson = lesson;
    });
  }

  void _onNavTap(int index) {
    if (index == 2) return;

    if (index == 0) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const HomeScreen()),
      );
    } else if (index == 1) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const MentorshipScreen()),
      );
    } else if (index == 3) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const SettingsScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F7FB),

      bottomNavigationBar: BottomNavigationBar(
        currentIndex: currentIndex,
        type: BottomNavigationBarType.fixed,
        selectedItemColor: Colors.blue,
        unselectedItemColor: Colors.grey,
        onTap: _onNavTap,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(
            icon: Icon(Icons.school),
            label: 'Mentorship',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.menu_book),
            label: 'My Courses',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: 'Settings',
          ),
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
                        separatorBuilder: (_, __) => const SizedBox(width: 14),
                        itemBuilder: (context, index) {
                          final course = courses[index];

                          final isSelected =
                              selectedCourse?['course_id'] ==
                              course['course_id'];

                          return GestureDetector(
                            onTap: () async {
                              setState(() {
                                selectedCourse = Map<String, dynamic>.from(
                                  course,
                                );
                              });

                              await loadLessons(_toInt(course['course_id']));
                            },
                            child: Container(
                              width: 250,
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: isSelected
                                    ? const Color(0xFFE9E8FF)
                                    : Colors.white,
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: isSelected
                                      ? Colors.blue
                                      : Colors.grey.shade300,
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
                                      child:
                                          (course['image_url'] != null &&
                                              course['image_url']
                                                  .toString()
                                                  .isNotEmpty)
                                          ? Image.network(
                                              course['image_url'],
                                              fit: BoxFit.cover,
                                              errorBuilder: (_, __, ___) {
                                                return Container(
                                                  color: Colors.grey.shade300,
                                                  child: const Icon(
                                                    Icons.image,
                                                  ),
                                                );
                                              },
                                            )
                                          : Container(
                                              color: Colors.grey.shade300,
                                              child: const Icon(Icons.image),
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
                          child: _ytController != null
                              ? YoutubePlayer(controller: _ytController!)
                              : const Center(
                                  child: Text(
                                    "Select a lesson",
                                    style: TextStyle(color: Colors.white),
                                  ),
                                ),
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
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
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
                                    ? const Color(0xFFE9E8FF)
                                    : Colors.white,
                                borderRadius: BorderRadius.circular(18),
                                border: Border.all(
                                  color: isSelected
                                      ? Colors.blue
                                      : Colors.grey.shade300,
                                ),
                              ),
                              child: Row(
                                children: [
                                  Container(
                                    height: 55,
                                    width: 55,
                                    decoration: BoxDecoration(
                                      color: Colors.blue.withOpacity(0.12),
                                      borderRadius: BorderRadius.circular(14),
                                    ),
                                    child: const Icon(
                                      Icons.play_circle_fill,
                                      color: Colors.blue,
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
                                          style: const TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 15,
                                          ),
                                        ),

                                        const SizedBox(height: 4),

                                        Text(
                                          lesson['lesson_description']
                                                  ?.toString() ??
                                              '',
                                          maxLines: 2,
                                          overflow: TextOverflow.ellipsis,
                                          style: const TextStyle(
                                            fontSize: 12,
                                            color: Colors.black54,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),

                                  const SizedBox(width: 10),

                                  Text(
                                    lesson['duration']?.toString() ?? '',
                                    style: const TextStyle(
                                      fontSize: 12,
                                      color: Colors.black54,
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
