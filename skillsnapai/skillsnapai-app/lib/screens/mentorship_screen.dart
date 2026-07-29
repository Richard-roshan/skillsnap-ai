import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import '../services/api_service.dart';
import 'home_screen.dart';
import 'quiz_mock_interview_screen.dart';
import 'my_courses_screen.dart';
import 'settings_screen.dart';

class MentorshipScreen extends StatefulWidget {
  const MentorshipScreen({super.key});

  @override
  State<MentorshipScreen> createState() => _MentorshipScreenState();
}

class _MentorshipScreenState extends State<MentorshipScreen> {
  int currentIndex = 1;
  bool isLoading = true;
  String? errorMessage;
  Map<String, dynamic>? dashboard;
  List<Map<String, String>> uploadedAppFiles = [];

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

      // Replace 1 with real logged-in user id later
      final data = await ApiService.fetchMentorshipDashboard(1);

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
    if (index == 1) return;

    Widget target;
    if (index == 0) {
      target = const HomeScreen();
    } else if (index == 2) {
      target = const QuizMockInterviewScreen();
    } else if (index == 3) {
      target = const MyCoursesScreen();
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
    final resume = dashboard?['resume'] ?? {};
    final analysis = dashboard?['resume_analysis'] ?? {};
    final atsScore = (analysis['ats_score'] ?? resume['ats_score'] ?? 0) as num;

    return Scaffold(
      backgroundColor: isDark
          ? const Color(0xFF121624)
          : const Color(0xFFF8FAFC),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 1,
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
        child: RefreshIndicator(
          onRefresh: loadDashboard,
          child: isLoading
              ? ListView(
                  children: [
                    SizedBox(height: 300),
                    Center(child: CircularProgressIndicator()),
                  ],
                )
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
                        // TOP BAR
                        Row(
                          children: [
                            Container(
                              height: 52,
                              width: 52,
                              decoration: BoxDecoration(
                                color: const Color(0xFF5B67FF),
                                borderRadius: BorderRadius.circular(14),
                              ),
                              child: const Icon(
                                Icons.work_outline_rounded,
                                color: Colors.white,
                                size: 30,
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Career Builder',
                                    style: TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                      color: isDark
                                          ? Colors.white
                                          : Colors.black,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    'Your AI Career Guide',
                                    style: TextStyle(
                                      fontSize: 13,
                                      color: isDark
                                          ? Colors.white70
                                          : Colors.black87,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: isDark
                                    ? Colors.grey.shade800
                                    : Colors.white,
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.05),
                                    blurRadius: 8,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: const Icon(
                                Icons.notifications_none,
                                size: 26,
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 16),

                        // ASK BOX
                        GestureDetector(
                          onTap: () => _showAskMentorDialog(context),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 8,
                            ),
                            decoration: BoxDecoration(
                              color: isDark
                                  ? const Color(0xFF1E1E1E)
                                  : Colors.white,
                              borderRadius: BorderRadius.circular(28),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.04),
                                  blurRadius: 10,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: Row(
                              children: [
                                const SizedBox(width: 8),
                                const Icon(
                                  Icons.auto_awesome,
                                  color: Colors.blue,
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    'Ask your Career Mentor....',
                                    style: TextStyle(
                                      color: isDark
                                          ? Colors.white70
                                          : Colors.grey,
                                      fontSize: 13,
                                    ),
                                  ),
                                ),
                                ElevatedButton(
                                  onPressed: () => _showAskMentorDialog(context),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF5B67FF),
                                    elevation: 0,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(20),
                                    ),
                                  ),
                                  child: const Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Icon(
                                        Icons.auto_awesome,
                                        size: 16,
                                        color: Colors.white,
                                      ),
                                      SizedBox(width: 4),
                                      Text(
                                        'Ask',
                                        style: TextStyle(color: Colors.white),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),

                        const SizedBox(height: 16),

                        // RESUME SCORE SECTION
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Expanded(
                              flex: 2,
                              child: Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: isDark
                                      ? const Color(0xFF1E1E1E)
                                      : Colors.white,
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      'Resume Builder',
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 13,
                                        color: isDark
                                            ? Colors.white
                                            : Colors.black,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      resume['resume_name']?.toString() ??
                                          'Create ATS-friendly resumes\nthat get you noticed',
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: isDark
                                            ? Colors.white70
                                            : Colors.black87,
                                      ),
                                    ),
                                    const SizedBox(height: 10),
                                    SizedBox(
                                      height: 28,
                                      width: double.infinity,
                                      child: ElevatedButton(
                                        onPressed: () => _showChooseDocumentBottomSheet(context),
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: const Color(
                                            0xFF5B67FF,
                                          ),
                                          elevation: 0,
                                          padding: EdgeInsets.zero,
                                          shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.circular(
                                              8,
                                            ),
                                          ),
                                        ),
                                        child: const Text(
                                          'Create New Resume',
                                          style: TextStyle(
                                            fontSize: 10,
                                            color: Colors.white,
                                          ),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: 6),
                                    SizedBox(
                                      height: 28,
                                      width: double.infinity,
                                      child: OutlinedButton(
                                        onPressed: () => _showChooseDocumentBottomSheet(context),
                                        style: OutlinedButton.styleFrom(
                                          side: BorderSide(
                                            color: isDark
                                                ? Colors.grey.shade600
                                                : Colors.grey.shade400,
                                          ),
                                          shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.circular(
                                              8,
                                            ),
                                          ),
                                          padding: EdgeInsets.zero,
                                        ),
                                        child: const Text(
                                          'Upload Resume',
                                          style: TextStyle(fontSize: 10),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              flex: 1,
                              child: Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: isDark
                                      ? const Color(0xFF1E1E1E)
                                      : Colors.white,
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                child: Column(
                                  children: [
                                    Text(
                                      'Resume Score',
                                      style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.bold,
                                        color: isDark
                                            ? Colors.white
                                            : Colors.black,
                                      ),
                                    ),
                                    const SizedBox(height: 6),
                                    SizedBox(
                                      height: 80,
                                      child: Stack(
                                        alignment: Alignment.center,
                                        children: [
                                          SizedBox(
                                            height: 60,
                                            width: 60,
                                            child: CircularProgressIndicator(
                                              value: (atsScore / 100).clamp(
                                                0.0,
                                                1.0,
                                              ),
                                              strokeWidth: 8,
                                              backgroundColor:
                                                  Colors.grey.shade200,
                                              color: Colors.deepPurple,
                                            ),
                                          ),
                                          Column(
                                            mainAxisAlignment:
                                                MainAxisAlignment.center,
                                            children: [
                                              Text(
                                                atsScore.toInt().toString(),
                                                style: const TextStyle(
                                                  fontSize: 18,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                              const Text(
                                                '/100',
                                                style: TextStyle(fontSize: 10),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      'ATS Friendly  Good Match',
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                        fontSize: 8,
                                        color: isDark
                                            ? Colors.greenAccent
                                            : Colors.green,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 18),

                        const Text(
                          'Quick Actions',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),

                        const SizedBox(height: 12),

                        GridView.count(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          crossAxisCount: 2,
                          childAspectRatio: 1.35,
                          crossAxisSpacing: 10,
                          mainAxisSpacing: 10,
                          children: [
                            _actionCard(
                              icon: Icons.description_outlined,
                              iconColor: Colors.indigo,
                              title: 'Resume Builder',
                              subtitle:
                                  'Create a professional\nresume in minutes',
                              onTap: () => _showCreateResumeDialog(context),
                            ),
                            _actionCard(
                              icon: Icons.manage_search,
                              iconColor: Colors.cyan,
                              title: 'Resume Analyzer',
                              subtitle:
                                  'Get AI feedback and\nimprove your resume',
                              onTap: () => _showResumeAnalyzerModal(context),
                            ),
                            _actionCard(
                              icon: Icons.psychology_alt_outlined,
                              iconColor: Colors.green,
                              title: 'Career Roadmap',
                              subtitle:
                                  'Personalized learning path\nfor your dream career',
                              onTap: () => _showCareerRoadmapModal(context, "Full-Stack AI Engineer"),
                            ),
                            _actionCard(
                              icon: Icons.mic_none,
                              iconColor: Colors.orange,
                              title: 'Mock Interview',
                              subtitle:
                                  'Practice interview and\nget AI-powered feedback',
                              onTap: () => Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => const QuizMockInterviewScreen(),
                                ),
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 18),

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
          onTap: () => _showCareerRoadmapModal(context, title),
        ),
      );
    }).toList();
  }

  Widget _actionCard({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.grey.shade200),
        ),
        child: Row(
          children: [
            Container(
              height: 42,
              width: 42,
              decoration: BoxDecoration(
                color: iconColor.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: iconColor),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: const TextStyle(fontSize: 10, color: Colors.black54),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _pathCard({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    required String buttonText,
    required Color buttonColor,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
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
                color: iconColor.withValues(alpha: 0.15),
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
                      color: Colors.black,
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
                style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.indigo),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showAskMentorDialog(BuildContext context) {
    final controller = TextEditingController();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(bottom: MediaQuery.of(ctx).viewInsets.bottom),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Theme.of(context).brightness == Brightness.dark
                ? const Color(0xFF1B2136)
                : Colors.white,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Row(
                children: [
                  Icon(Icons.auto_awesome, color: Color(0xFF5B67FF)),
                  SizedBox(width: 8),
                  Text('Ask AI Career Mentor', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                ],
              ),
              const SizedBox(height: 12),
              TextField(
                controller: controller,
                maxLines: 3,
                decoration: const InputDecoration(
                  hintText: 'Ask about FastAPI, Flutter, ATS resume tips, or mock interviews...',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 14),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () {
                    final q = controller.text.trim();
                    Navigator.pop(ctx);
                    if (q.isNotEmpty) {
                      _showAIAnswerModal(context, q);
                    }
                  },
                  icon: const Icon(Icons.send, color: Colors.white),
                  label: const Text('Get AI Guidance', style: TextStyle(color: Colors.white)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF5B67FF),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _showAIAnswerModal(BuildContext context, String question) async {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: isDark ? const Color(0xFF1E2130) : Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        content: const Padding(
          padding: EdgeInsets.all(12),
          child: Row(
            children: [
              SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(strokeWidth: 2.5, color: Color(0xFF5B67FF)),
              ),
              SizedBox(width: 16),
              Text('SkillSnap AI Analyzing Prompt...', style: TextStyle(fontWeight: FontWeight.w600)),
            ],
          ),
        ),
      ),
    );

    final aiReply = await ApiService.fetchAIMentorReply(question);

    if (context.mounted) {
      Navigator.pop(context);

      showModalBottomSheet(
        context: context,
        isScrollControlled: true,
        backgroundColor: Colors.transparent,
        builder: (ctx) => DraggableScrollableSheet(
          initialChildSize: 0.85,
          maxChildSize: 0.95,
          minChildSize: 0.5,
          builder: (_, scrollController) => Container(
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF151928) : const Color(0xFFF8FAFC),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
            ),
            child: Column(
              children: [
                // Drag handle
                Container(
                  margin: const EdgeInsets.only(top: 10, bottom: 6),
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey.withValues(alpha: 0.4),
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),

                // Top Header Bar
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [Color(0xFF5B67FF), Color(0xFF7C3AED)],
                              ),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.auto_awesome, color: Colors.white, size: 20),
                          ),
                          const SizedBox(width: 10),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'AI CAREER ADVISORY',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF5B67FF),
                                  letterSpacing: 1.2,
                                ),
                              ),
                              Text(
                                'Executive Analysis Report',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: isDark ? Colors.white : Colors.black,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      IconButton(
                        onPressed: () => Navigator.pop(ctx),
                        icon: Icon(Icons.close, color: isDark ? Colors.white70 : Colors.black54),
                      ),
                    ],
                  ),
                ),

                const Divider(height: 1),

                // Content List
                Expanded(
                  child: ListView(
                    controller: scrollController,
                    padding: const EdgeInsets.all(20),
                    children: [
                      // User Prompt Card
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: isDark ? const Color(0xFF1E2136) : Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: isDark ? const Color(0xFF2E3552) : const Color(0xFFE2E8F0),
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(Icons.help_outline, size: 16, color: isDark ? Colors.white60 : Colors.black54),
                                const SizedBox(width: 6),
                                Text(
                                  'YOUR SUBMITTED PROMPT',
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    color: isDark ? Colors.white60 : Colors.black54,
                                    letterSpacing: 0.8,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Text(
                              '"$question"',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: isDark ? Colors.white : Colors.black87,
                                fontStyle: FontStyle.italic,
                              ),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 20),

                      // Professional AI Analysis Cards
                      _buildStructuredAIOutputCards(isDark, aiReply),

                      const SizedBox(height: 24),

                      // Action Done Button
                      SizedBox(
                        width: double.infinity,
                        height: 48,
                        child: ElevatedButton.icon(
                          onPressed: () => Navigator.pop(ctx),
                          icon: const Icon(Icons.check, color: Colors.white),
                          label: const Text(
                            'Apply Recommendations',
                            style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF5B67FF),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }
  }

  Widget _buildStructuredAIOutputCards(bool isDark, String aiReply) {
    if (aiReply.contains('Unrecognized / Random Input Detected')) {
      return Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: Colors.red.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: Colors.red.withValues(alpha: 0.4), width: 1.5),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.error_outline, color: Colors.red, size: 24),
                SizedBox(width: 8),
                Text(
                  'Invalid / Random Prompt',
                  style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 16),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              aiReply.replaceAll('❌ **Unrecognized / Random Input Detected!**', '').trim(),
              style: TextStyle(
                fontSize: 13,
                height: 1.4,
                color: isDark ? Colors.white : Colors.black87,
              ),
            ),
          ],
        ),
      );
    }

    final lines = aiReply.split('\n').where((l) => l.trim().isNotEmpty).toList();
    final headerTitle = lines.isNotEmpty ? lines.first.replaceAll('*', '').trim() : 'AI Career Guidance';
    final bulletPoints = lines.where((l) => l.trim().startsWith('•')).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: const Color(0xFF5B67FF).withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.verified, size: 14, color: Color(0xFF5B67FF)),
              const SizedBox(width: 6),
              Text(
                headerTitle.toUpperCase(),
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF5B67FF),
                  letterSpacing: 0.5,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),
        if (bulletPoints.isNotEmpty)
          ...bulletPoints.asMap().entries.map((entry) {
            final idx = entry.key;
            final pt = entry.value.replaceFirst('•', '').trim();
            final parts = pt.split(':');
            final cardTitle = parts.isNotEmpty ? parts.first.replaceAll('*', '').trim() : 'Recommendation ${idx + 1}';
            final cardBody = parts.length > 1 ? parts.sublist(1).join(':').trim() : pt;

            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E2136) : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isDark ? const Color(0xFF2E3552) : const Color(0xFFE2E8F0),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.02),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      color: const Color(0xFF5B67FF).withValues(alpha: 0.12),
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Text(
                        '${idx + 1}',
                        style: const TextStyle(
                          color: Color(0xFF5B67FF),
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          cardTitle,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: isDark ? Colors.white : Colors.black,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          cardBody,
                          style: TextStyle(
                            fontSize: 12,
                            height: 1.4,
                            color: isDark ? Colors.white70 : Colors.black87,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          })
        else
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E2136) : Colors.white,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Text(
              aiReply,
              style: TextStyle(
                fontSize: 13,
                height: 1.4,
                color: isDark ? Colors.white : Colors.black87,
              ),
            ),
          ),
      ],
    );
  }

  void _showChooseDocumentBottomSheet(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (ctx) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1E2130) : const Color(0xFF1C1C1E),
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Choose document',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Send original files up to 2 GB in size.',
                      style: TextStyle(
                        color: Colors.grey.shade400,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
                GestureDetector(
                  onTap: () => Navigator.pop(ctx),
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.15),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.close,
                      color: Colors.white,
                      size: 20,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Container(
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  _documentOptionTile(
                    icon: Icons.insert_drive_file_outlined,
                    title: 'Choose from files',
                    onTap: () {
                      Navigator.pop(ctx);
                      _pickFilesFromStorage(context);
                    },
                    showDivider: true,
                  ),
                  _documentOptionTile(
                    icon: Icons.photo_library_outlined,
                    title: 'Choose photo or video',
                    onTap: () {
                      Navigator.pop(ctx);
                      _handlePhotoOrVideoPicked(context);
                    },
                    showDivider: true,
                  ),
                  _documentOptionTile(
                    icon: Icons.document_scanner_outlined,
                    title: 'Scan document',
                    onTap: () {
                      Navigator.pop(ctx);
                      _handleScanDocument(context);
                    },
                    showDivider: false,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _documentOptionTile({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
    required bool showDivider,
  }) {
    return Column(
      children: [
        InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            child: Row(
              children: [
                Icon(icon, color: Colors.white, size: 24),
                const SizedBox(width: 16),
                Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ),
        if (showDivider)
          Divider(
            height: 1,
            thickness: 1,
            color: Colors.white.withValues(alpha: 0.1),
            indent: 16,
            endIndent: 16,
          ),
      ],
    );
  }

  void _handlePhotoOrVideoPicked(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.error_outline, color: Colors.red, size: 28),
            SizedBox(width: 8),
            Text('Invalid Resume Format', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
          ],
        ),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '❌ Images and Videos (e.g. .png, .jpg, .mp4) are NOT valid resume document formats!',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 12),
            Text(
              'Please select "Choose from files" and choose a valid PDF (.pdf) or Word (.docx) resume document.',
              style: TextStyle(fontSize: 13, color: Colors.black87),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              _showChooseDocumentBottomSheet(context);
            },
            child: const Text('Try Again / Pick PDF File'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
        ],
      ),
    );
  }

  void _handleScanDocument(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.document_scanner, color: Color(0xFF5B67FF)),
            SizedBox(width: 8),
            Text('Scanning Document...'),
          ],
        ),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text('Converting scanned pages into ATS Resume PDF (Scanned_Resume.pdf)...'),
          ],
        ),
      ),
    );

    Future.delayed(const Duration(seconds: 2), () {
      if (context.mounted) {
        Navigator.pop(context);
        setState(() {
          if (dashboard != null) {
            dashboard!['resume'] = {
              'resume_name': 'Scanned_ATS_Resume.pdf',
              'ats_score': 90,
            };
          }
        });
        _showResumeAnalyzerModal(context, 'Scanned_ATS_Resume.pdf');
      }
    });
  }

  void _showStorageUploadOptionsDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.folder_special, color: Color(0xFF5B67FF)),
            SizedBox(width: 8),
            Text('Add Storage Folder & Files'),
          ],
        ),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Select how you want to import your files or folder from device storage:'),
            SizedBox(height: 12),
          ],
        ),
        actions: [
          ElevatedButton.icon(
            onPressed: () {
              Navigator.pop(ctx);
              _pickFilesFromStorage(context);
            },
            icon: const Icon(Icons.file_present),
            label: const Text('Add Files from Storage'),
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF5B67FF), foregroundColor: Colors.white),
          ),
          ElevatedButton.icon(
            onPressed: () {
              Navigator.pop(ctx);
              _pickFolderFromStorage(context);
            },
            icon: const Icon(Icons.create_new_folder),
            label: const Text('Upload Folder from Storage'),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.indigo, foregroundColor: Colors.white),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
        ],
      ),
    );
  }

  Future<void> _pickFolderFromStorage(BuildContext context) async {
    try {
      String? selectedDirectory = await FilePicker.platform.getDirectoryPath();
      if (selectedDirectory != null && selectedDirectory.isNotEmpty) {
        final folderName = selectedDirectory.split('\\').last.split('/').last;

        FilePickerResult? result = await FilePicker.platform.pickFiles(
          allowMultiple: true,
          type: FileType.any,
        );

        if (result != null && result.files.isNotEmpty) {
          _processAddedStorageFiles(context, result.files, folderName);
        } else {
          _processAddedStorageFiles(context, [
            PlatformFile(name: '$folderName.pdf', size: 2048, path: '$selectedDirectory/$folderName.pdf')
          ], folderName);
        }
      }
    } catch (e) {
      _pickFilesFromStorage(context);
    }
  }

  Future<void> _pickFilesFromStorage(BuildContext context) async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        allowMultiple: true,
        type: FileType.any,
      );

      if (result != null && result.files.isNotEmpty) {
        _processAddedStorageFiles(context, result.files, "Device Storage");
      }
    } catch (e) {
      _showUploadFallbackDialog(context);
    }
  }

  void _processAddedStorageFiles(BuildContext context, List<PlatformFile> files, String sourceFolder) {
    bool foundValidResume = false;
    String validResumeName = '';

    for (var f in files) {
      final name = f.name;
      final ext = (f.extension ?? name.split('.').last).toLowerCase();

      setState(() {
        uploadedAppFiles.add({
          'name': name,
          'ext': ext,
          'size': '${(f.size / 1024).toStringAsFixed(1)} KB',
          'source': sourceFolder,
        });
      });

      if (!foundValidResume && (ext == 'pdf' || ext == 'docx' || ext == 'doc' || ext == 'txt')) {
        foundValidResume = true;
        validResumeName = name;
      }
    }

    if (!foundValidResume) {
      final firstInvalidName = files.first.name;
      final firstInvalidExt = (files.first.extension ?? firstInvalidName.split('.').last).toLowerCase();
      _showInvalidFormatDialog(context, firstInvalidName, firstInvalidExt);
    } else {
      setState(() {
        if (dashboard != null) {
          dashboard!['resume'] = {
            'resume_name': validResumeName,
            'ats_score': 92,
          };
        }
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('📁 Added ${files.length} file(s) from $sourceFolder to app!'),
          backgroundColor: Colors.green,
        ),
      );
      _showResumeAnalyzerModal(context, validResumeName);
    }
  }

  void _showInvalidFormatDialog(BuildContext context, String filename, String ext) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.error_outline, color: Colors.red, size: 28),
            SizedBox(width: 8),
            Text('Invalid Resume Format', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '❌ The selected file "$filename" (${ext.isEmpty ? "unknown format" : ".$ext"}) is not a valid resume document format!',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            const Text(
              'Resume ATS Evaluation requires a document containing text structure:\n\n'
              '• Allowed formats: PDF (.pdf), Word (.docx)\n'
              '• Unsupported formats: Images (.png, .jpg), Videos (.mp4), Archives (.zip), Executables (.exe)',
              style: TextStyle(fontSize: 13, color: Colors.black87),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              _showChooseDocumentBottomSheet(context);
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.blue),
            child: const Text('Pick PDF or DOCX Resume', style: TextStyle(color: Colors.white)),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
        ],
      ),
    );
  }

  void _showUploadFallbackDialog(BuildContext context) {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Provide Resume Document'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Enter document filename to evaluate:'),
            const SizedBox(height: 8),
            TextField(
              controller: controller,
              decoration: const InputDecoration(
                labelText: 'Filename (.pdf / .docx)',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              final name = controller.text.trim();
              final ext = name.split('.').last.toLowerCase();
              Navigator.pop(ctx);
              if (ext != 'pdf' && ext != 'docx' && ext != 'txt') {
                _showInvalidFormatDialog(context, name, ext);
              } else {
                _showResumeAnalyzerModal(context, name);
              }
            },
            child: const Text('Evaluate ATS'),
          ),
        ],
      ),
    );
  }

  void _showCreateResumeDialog(BuildContext context) {
    _showChooseDocumentBottomSheet(context);
  }

  void _showUploadResumeDialog(BuildContext context) {
    _showChooseDocumentBottomSheet(context);
  }

  void _showResumeAnalyzerModal(BuildContext context, [String? customFilename]) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final filename = customFilename ?? dashboard?['resume']?['resume_name']?.toString() ?? 'Uploaded_Resume.pdf';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1B2136) : Colors.white,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.analytics, color: Colors.cyan),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'ATS Report: $filename',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Overall ATS Score:', style: TextStyle(fontWeight: FontWeight.bold)),
                Text('92 / 100', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 16)),
              ],
            ),
            const SizedBox(height: 10),
            const Text('Strengths:', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blue)),
            const Text('• Valid ATS Document Structure (.pdf / .docx format verified)'),
            const Text('• Matched Keywords: FastAPI, Flutter, Python, REST APIs, Microservices'),
            const SizedBox(height: 8),
            const Text('Suggestions:', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.orange)),
            const Text('• Add live production links for Surge web apps & Play Store builds'),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text('Done'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showCareerRoadmapModal(BuildContext context, String title) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final roleTitle = title.isEmpty ? "Full-Stack AI Engineer" : title;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.85,
        maxChildSize: 0.95,
        minChildSize: 0.5,
        builder: (_, scrollController) => Container(
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF151928) : const Color(0xFFF8FAFC),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: Column(
            children: [
              // Top Drag handle
              Container(
                margin: const EdgeInsets.only(top: 10, bottom: 6),
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey.withValues(alpha: 0.4),
                  borderRadius: BorderRadius.circular(10),
                ),
              ),

              // Header Bar
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF3B82F6).withValues(alpha: 0.15),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Text(
                                  '🎯 95% MATCH  •  HIGH DEMAND',
                                  style: TextStyle(
                                    color: Color(0xFF3B82F6),
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Text(
                            roleTitle,
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: isDark ? Colors.white : Colors.black,
                            ),
                          ),
                          Text(
                            'Estimated Salary: \$120,000 - \$165,000 / yr',
                            style: TextStyle(
                              fontSize: 12,
                              color: isDark ? Colors.white70 : Colors.black54,
                            ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      onPressed: () => Navigator.pop(ctx),
                      icon: Icon(Icons.close, color: isDark ? Colors.white70 : Colors.black54),
                    ),
                  ],
                ),
              ),

              const Divider(height: 1),

              // Main Roadmap Content List
              Expanded(
                child: ListView(
                  controller: scrollController,
                  padding: const EdgeInsets.all(20),
                  children: [
                    // Overview Banner Card
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF4F46E5), Color(0xFF7C3AED)],
                        ),
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF4F46E5).withValues(alpha: 0.3),
                            blurRadius: 12,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '🚀 Senior AI Engineering Roadmap',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 6),
                          Text(
                            'Personalized 4-Phase Career Path curated by AI Senior Tech Leads & Industry Benchmarks.',
                            style: TextStyle(color: Colors.white70, fontSize: 12),
                          ),
                          SizedBox(height: 12),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Overall Completion:', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600)),
                              Text('65% (Phase 2 Active)', style: TextStyle(color: Colors.amberAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    Text(
                      'Phase Milestone Architecture',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: isDark ? Colors.white : Colors.black,
                      ),
                    ),

                    const SizedBox(height: 14),

                    // PHASE 1
                    _roadmapPhaseTile(
                      isDark: isDark,
                      phaseNum: 'PHASE 1',
                      status: 'COMPLETED',
                      statusColor: Colors.green,
                      title: 'Backend Architecture & ASGI APIs',
                      subtitle: 'FastAPI, Uvicorn, Async Python, PostgreSQL, JWT Auth',
                      progress: 1.0,
                      progressText: '100% Mastered (5/5 Modules)',
                      icon: Icons.check_circle,
                      skills: ['FastAPI', 'Python 3.12', 'Pydantic v2', 'PostgreSQL'],
                    ),

                    const SizedBox(height: 14),

                    // PHASE 2
                    _roadmapPhaseTile(
                      isDark: isDark,
                      phaseNum: 'PHASE 2',
                      status: 'IN PROGRESS',
                      statusColor: Colors.blue,
                      title: 'Cross-Platform Mobile Engineering',
                      subtitle: 'Flutter SDK, Dart 3, Provider State, WebSockets',
                      progress: 0.4,
                      progressText: '40% Completed (2/5 Modules)',
                      icon: Icons.play_circle_fill,
                      skills: ['Flutter', 'Dart', 'Provider', 'WebSocket Sync'],
                    ),

                    const SizedBox(height: 14),

                    // PHASE 3
                    _roadmapPhaseTile(
                      isDark: isDark,
                      phaseNum: 'PHASE 3',
                      status: 'UP NEXT',
                      statusColor: Colors.purple,
                      title: 'AI Models & LLM Integration',
                      subtitle: 'PyTorch, HuggingFace, LangChain, Vector Search',
                      progress: 0.0,
                      progressText: '0% (Unlocks after Phase 2)',
                      icon: Icons.lock_clock,
                      skills: ['PyTorch', 'LangChain', 'Vector DB', 'OpenAI API'],
                    ),

                    const SizedBox(height: 14),

                    // PHASE 4
                    _roadmapPhaseTile(
                      isDark: isDark,
                      phaseNum: 'PHASE 4',
                      status: 'UPCOMING',
                      statusColor: Colors.grey,
                      title: 'Production DevOps & Cloud Scaling',
                      subtitle: 'Docker, Surge CDN, Firebase Realtime Sync, CI/CD',
                      progress: 0.0,
                      progressText: '0% (Final Production Tier)',
                      icon: Icons.cloud_done,
                      skills: ['Docker', 'Surge', 'Firebase', 'GitHub Actions'],
                    ),

                    const SizedBox(height: 20),

                    // Action Button
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton.icon(
                        onPressed: () => Navigator.pop(ctx),
                        icon: const Icon(Icons.school, color: Colors.white),
                        label: const Text(
                          'Continue Learning Phase 2',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF3B82F6),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _roadmapPhaseTile({
    required bool isDark,
    required String phaseNum,
    required String status,
    required Color statusColor,
    required String title,
    required String subtitle,
    required double progress,
    required String progressText,
    required IconData icon,
    required List<String> skills,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E2136) : Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: statusColor.withValues(alpha: 0.3),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                phaseNum,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.white54 : Colors.grey.shade600,
                  letterSpacing: 1.0,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: statusColor.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(icon, size: 14, color: statusColor),
                    const SizedBox(width: 4),
                    Text(
                      status,
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: statusColor,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            title,
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : Colors.black,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: TextStyle(
              fontSize: 12,
              color: isDark ? Colors.white70 : Colors.black54,
            ),
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: LinearProgressIndicator(
              value: progress,
              minHeight: 6,
              backgroundColor: isDark ? Colors.grey.shade800 : Colors.grey.shade200,
              valueColor: AlwaysStoppedAnimation<Color>(statusColor),
            ),
          ),
          const SizedBox(height: 6),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                progressText,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: statusColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: skills.map((s) {
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF2A314D) : const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  s,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w500,
                    color: isDark ? Colors.white70 : Colors.black87,
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}
