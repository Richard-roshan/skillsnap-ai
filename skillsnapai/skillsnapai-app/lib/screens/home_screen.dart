import 'package:flutter/material.dart';
import '../main.dart';
import '../services/api_service.dart';
import 'mentorship_screen.dart';
import 'my_courses_screen.dart';
import 'settings_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int currentIndex = 0;
  bool isLoading = true;
  String? errorMessage;
  Map<String, dynamic>? dashboard;

  @override
  void initState() {
    super.initState();
    loadDashboard();
  }

  Future<void> loadDashboard() async {
    try {
      setState(() {
        isLoading = true;
        errorMessage = null;
      });

      // Replace 1 with logged-in user id from shared preferences later
      final data = await ApiService.fetchHomeDashboard(1);

      setState(() {
        dashboard = data;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
        isLoading = false;
      });
    }
  }

  void _onNavTap(int index) {
    if (index == 0) return;

    if (index == 1) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const MentorshipScreen()),
      );
      return;
    }

    if (index == 2) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const MyCoursesScreen()),
      );
      return;
    }

    if (index == 3) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const SettingsScreen()),
      );
      return;
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark
          ? const Color(0xFF121212)
          : const Color(0xFFF5F5F5),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: currentIndex,
        selectedItemColor: Colors.blue,
        unselectedItemColor: Colors.grey,
        backgroundColor: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        type: BottomNavigationBarType.fixed,
        onTap: _onNavTap,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(
            icon: Icon(Icons.school),
            label: 'mentorship',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.menu_book),
            label: 'my courses',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
      ),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: loadDashboard,
          child: isLoading
              ? const Center(child: CircularProgressIndicator())
              : errorMessage != null
              ? ListView(
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Text(
                        errorMessage!,
                        style: const TextStyle(color: Colors.red),
                      ),
                    ),
                  ],
                )
              : SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  child: Padding(
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // TOP SECTION
                        Row(
                          children: [
                            CircleAvatar(
                              radius: 24,
                              backgroundImage:
                                  (dashboard!['user']['avatar_url'] != null &&
                                      dashboard!['user']['avatar_url']
                                          .toString()
                                          .isNotEmpty)
                                  ? NetworkImage(
                                      dashboard!['user']['avatar_url'],
                                    )
                                  : const AssetImage('assets/images/avatar.png')
                                        as ImageProvider,
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Hello',
                                    style: TextStyle(
                                      color: isDark
                                          ? Colors.white70
                                          : Colors.grey,
                                      fontSize: 13,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    dashboard!['user']['full_name'] ?? 'User',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                      color: isDark
                                          ? Colors.white
                                          : Colors.black,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            IconButton(
                              icon: Icon(
                                isDark ? Icons.light_mode : Icons.dark_mode,
                              ),
                              onPressed: toggleThemeMode,
                            ),
                            const SizedBox(width: 4),
                            _circleIcon(Icons.notifications_none, isDark),
                          ],
                        ),

                        const SizedBox(height: 20),

                        // SEARCH + ASSISTANT
                        Row(
                          children: [
                            Expanded(
                              child: Container(
                                height: 46,
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 14,
                                ),
                                decoration: BoxDecoration(
                                  color: isDark
                                      ? Colors.grey.shade800
                                      : Colors.grey.shade300,
                                  borderRadius: BorderRadius.circular(25),
                                ),
                                child: Row(
                                  children: [
                                    const Icon(
                                      Icons.search,
                                      color: Colors.grey,
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      'Search',
                                      style: TextStyle(
                                        color: isDark
                                            ? Colors.white70
                                            : Colors.grey,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 10,
                              ),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(25),
                                gradient: const LinearGradient(
                                  colors: [
                                    Colors.green,
                                    Colors.pink,
                                    Colors.purple,
                                  ],
                                ),
                              ),
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 8,
                                ),
                                decoration: BoxDecoration(
                                  color: isDark ? Colors.black : Colors.white,
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: Row(
                                  children: [
                                    Text(
                                      'Assistant',
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        color: isDark
                                            ? Colors.white
                                            : Colors.black,
                                      ),
                                    ),
                                    const SizedBox(width: 4),
                                    Icon(
                                      Icons.smart_toy,
                                      size: 18,
                                      color: isDark
                                          ? Colors.white
                                          : Colors.black,
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 24),

                        // SKILLS CARD
                        _card(
                          isDark,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Skills',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18,
                                  color: isDark ? Colors.white : Colors.black,
                                ),
                              ),
                              const SizedBox(height: 12),
                              ..._buildSkills(
                                dashboard?['skills'] ?? [],
                                isDark,
                              ),
                              const SizedBox(height: 16),
                              Align(
                                alignment: Alignment.centerRight,
                                child: Text(
                                  'View Full Report',
                                  style: TextStyle(
                                    color: isDark
                                        ? Colors.white70
                                        : Colors.black54,
                                    fontSize: 13,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),

                        const SizedBox(height: 18),

                        // LESSONS + HOURS
                        IntrinsicHeight(
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              Expanded(
                                child: _smallCard(
                                  subtitle: 'Lessons Completed',
                                  value:
                                      '${dashboard?['stats']?['lessons_completed'] ?? 0}',
                                  percentage: '7%',
                                  color: Colors.red,
                                  isDark: isDark,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: _card(
                                  isDark,
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Text(
                                            '${dashboard?['stats']?['hours_spent'] ?? 0}h',
                                            style: TextStyle(
                                              fontSize: 28,
                                              fontWeight: FontWeight.bold,
                                              color: isDark
                                                  ? Colors.white
                                                  : Colors.black,
                                            ),
                                          ),
                                          const SizedBox(width: 6),
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 6,
                                              vertical: 2,
                                            ),
                                            decoration: BoxDecoration(
                                              color: Colors.green.withOpacity(
                                                0.15,
                                              ),
                                              borderRadius:
                                                  BorderRadius.circular(10),
                                            ),
                                            child: const Text(
                                              '↑12%',
                                              style: TextStyle(
                                                color: Colors.green,
                                                fontSize: 12,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      Text(
                                        'Hours spent on classes',
                                        style: TextStyle(
                                          color: isDark
                                              ? Colors.white70
                                              : Colors.grey,
                                          fontSize: 12,
                                        ),
                                      ),
                                      const SizedBox(height: 12),
                                      Text(
                                        'Design',
                                        style: TextStyle(
                                          color: isDark
                                              ? Colors.white
                                              : Colors.black,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      LinearProgressIndicator(
                                        value: 0.50,
                                        minHeight: 6,
                                        backgroundColor: Colors.grey.shade300,
                                        color: Colors.green,
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        'Management',
                                        style: TextStyle(
                                          color: isDark
                                              ? Colors.white
                                              : Colors.black,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      LinearProgressIndicator(
                                        value: 0.12,
                                        minHeight: 6,
                                        backgroundColor: Colors.grey.shade300,
                                        color: Colors.purple,
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),

                        const SizedBox(height: 24),

                        // COURSES HEADER
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Courses',
                              style: TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                                color: isDark ? Colors.white : Colors.black,
                              ),
                            ),
                            TextButton(
                              onPressed: () {},
                              child: const Text(
                                'View all',
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 10),

                        // COURSE CARDS
                        Row(
                          children: [
                            Expanded(
                              child: _courseCardFromApi(
                                course:
                                    (dashboard?['courses'] != null &&
                                        dashboard!['courses'].isNotEmpty)
                                    ? dashboard!['courses'][0]
                                    : null,
                                fallbackImage: 'assets/images/course1.jpg',
                                isDark: isDark,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: _courseCardFromApi(
                                course:
                                    (dashboard?['courses'] != null &&
                                        dashboard!['courses'].length > 1)
                                    ? dashboard!['courses'][1]
                                    : null,
                                fallbackImage: 'assets/images/course2.jpg',
                                isDark: isDark,
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 24),

                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Recommended Career Paths',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: isDark ? Colors.white : Colors.black,
                              ),
                            ),
                            TextButton(
                              onPressed: () {},
                              child: const Text('View All'),
                            ),
                          ],
                        ),

                        const SizedBox(height: 4),

                        ..._buildCareerPaths(
                          dashboard?['career_paths'] ?? [],
                          isDark,
                        ),
                      ],
                    ),
                  ),
                ),
        ),
      ),
    );
  }

  List<Widget> _buildSkills(List skills, bool isDark) {
    if (skills.isEmpty) {
      return [
        Text(
          'No skills found',
          style: TextStyle(color: isDark ? Colors.white70 : Colors.black54),
        ),
      ];
    }

    return skills.map((item) {
      final name = item['skill_name']?.toString() ?? '';
      final percent = (item['progress_percent'] ?? 0) as num;
      final value = (percent / 100).clamp(0.0, 1.0);

      return Padding(
        padding: const EdgeInsets.only(bottom: 10),
        child: _skillRow(name, value, Colors.blue, isDark),
      );
    }).toList();
  }

  List<Widget> _buildCareerPaths(List paths, bool isDark) {
    if (paths.isEmpty) {
      return [
        Text(
          'No career paths found',
          style: TextStyle(color: isDark ? Colors.white70 : Colors.black54),
        ),
      ];
    }

    return paths.map((item) {
      final title = item['title']?.toString() ?? '';
      final match = item['match_percent']?.toString() ?? '0';
      final demand = item['demand_level']?.toString() ?? '';
      final subtitle = '$match% Match  •  $demand';

      return Padding(
        padding: const EdgeInsets.only(bottom: 10),
        child: _pathCard(
          iconColor: Colors.blue,
          icon: Icons.code,
          title: title,
          subtitle: subtitle,
          buttonText: 'View Roadmap',
          buttonColor: const Color(0xFFE8E7FF),
        ),
      );
    }).toList();
  }

  static Widget _circleIcon(IconData icon, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: isDark ? Colors.grey.shade800 : Colors.grey.shade200,
        shape: BoxShape.circle,
      ),
      child: Icon(icon, size: 22, color: isDark ? Colors.white : Colors.black),
    );
  }

  static Widget _card(bool isDark, {required Widget child}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(18),
      ),
      child: child,
    );
  }

  static Widget _skillRow(
    String title,
    double value,
    Color color,
    bool isDark,
  ) {
    return Row(
      children: [
        SizedBox(
          width: 90,
          child: Text(
            title,
            style: TextStyle(color: isDark ? Colors.white : Colors.black),
          ),
        ),
        Expanded(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: LinearProgressIndicator(
              value: value,
              minHeight: 10,
              backgroundColor: Colors.grey.shade300,
              color: color,
            ),
          ),
        ),
        const SizedBox(width: 8),
        Text(
          '${(value * 100).toInt()}%',
          style: TextStyle(color: isDark ? Colors.white : Colors.black),
        ),
      ],
    );
  }

  static Widget _smallCard({
    required String subtitle,
    required String value,
    required String percentage,
    required Color color,
    required bool isDark,
  }) {
    return _card(
      isDark,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 10,
                height: 10,
                decoration: BoxDecoration(color: color, shape: BoxShape.circle),
              ),
              const SizedBox(width: 4),
              Text(percentage, style: TextStyle(color: color)),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            value,
            style: TextStyle(
              fontSize: 40,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : Colors.black,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            subtitle,
            style: TextStyle(
              color: isDark ? Colors.white70 : Colors.grey,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  static Widget _courseCardFromApi({
    required Map<String, dynamic>? course,
    required String fallbackImage,
    required bool isDark,
  }) {
    final imageUrl = course?['image_url']?.toString() ?? '';
    final title = course?['title']?.toString() ?? 'Course';
    final subtitle = course?['subtitle']?.toString() ?? '';
    final lessons = '${course?['lesson_count'] ?? 0} Lessons';
    final rating = course?['rating']?.toString() ?? '0.0';
    final actionText = course?['action_text']?.toString() ?? 'Start';

    return Container(
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(18),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
            child: SizedBox(
              height: 100,
              width: double.infinity,
              child: (imageUrl.isNotEmpty)
                  ? Image.network(
                      imageUrl,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) =>
                          Image.asset(fallbackImage, fit: BoxFit.cover),
                    )
                  : Image.asset(fallbackImage, fit: BoxFit.cover),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'AI Suggested',
                  style: TextStyle(
                    color: isDark ? Colors.white70 : Colors.grey,
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  title,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: isDark ? Colors.white : Colors.black,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 11,
                    color: isDark ? Colors.white70 : Colors.black54,
                  ),
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Text(
                      lessons,
                      style: TextStyle(
                        fontSize: 12,
                        color: isDark ? Colors.white : Colors.black,
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Icon(Icons.star, color: Colors.orange, size: 16),
                    Text(
                      rating,
                      style: TextStyle(
                        fontSize: 12,
                        color: isDark ? Colors.white : Colors.black,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                SizedBox(
                  width: double.infinity,
                  height: 34,
                  child: ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isDark
                          ? Colors.grey.shade800
                          : Colors.grey.shade200,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: Text(
                      actionText,
                      style: TextStyle(
                        color: isDark ? Colors.white : Colors.black,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  static Widget _pathCard({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    required String buttonText,
    required Color buttonColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        children: [
          Container(
            height: 50,
            width: 50,
            decoration: BoxDecoration(
              color: iconColor.withOpacity(0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: iconColor, size: 28),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: const TextStyle(fontSize: 11, color: Colors.black54),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
            decoration: BoxDecoration(
              color: buttonColor,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              buttonText,
              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }
}
