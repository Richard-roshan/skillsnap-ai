import 'package:flutter/material.dart';
import '../main.dart';
import '../services/api_service.dart';
import 'home_screen.dart';
import 'mentorship_screen.dart';
import 'quiz_mock_interview_screen.dart';
import 'my_courses_screen.dart';
import 'privacy_security_screen.dart';
import 'help_support_screen.dart';
import 'about_app_screen.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  int currentIndex = 4;

  bool notificationsEnabled = true;
  bool emailUpdatesEnabled = true;
  bool darkModeEnabled = false;

  void _showEditProfileDialog(BuildContext context) {
    final controller = TextEditingController(text: 'John Jonson');
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Edit Profile Name'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(
            labelText: 'Full Name',
            hintText: 'Enter new name',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              final newName = controller.text.trim();
              if (newName.isNotEmpty) {
                ApiService.broadcastLiveUpdate(
                  userId: 1,
                  eventType: 'PROFILE_UPDATE',
                  data: {
                    'action': 'PROFILE_UPDATE',
                    'full_name': newName,
                  },
                );
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('📱 Live Synced to website: $newName'),
                    backgroundColor: Colors.green,
                  ),
                );
              }
              Navigator.pop(ctx);
            },
            child: const Text('Save & Sync Live'),
          ),
        ],
      ),
    );
  }

  void _onNavTap(int index) {
    if (index == 4) return;

    Widget target;
    if (index == 0) {
      target = const HomeScreen();
    } else if (index == 1) {
      target = const MentorshipScreen();
    } else if (index == 2) {
      target = const QuizMockInterviewScreen();
    } else if (index == 3) {
      target = const MyCoursesScreen();
    } else {
      return;
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
      backgroundColor: isDark
          ? const Color(0xFF121624)
          : const Color(0xFFF8FAFC),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 4,
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
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // HEADER
                Row(
                  children: [
                    CircleAvatar(
                      radius: 30,
                      backgroundColor: const Color(0xFF5B67FF),
                      child: const Icon(
                        Icons.person,
                        color: Colors.white,
                        size: 32,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'John Jonson',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: isDark ? Colors.white : Colors.black,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'johnjonson@email.com',
                            style: TextStyle(
                              fontSize: 13,
                              color: isDark ? Colors.white70 : Colors.black54,
                            ),
                          ),
                        ],
                      ),
                    ),
                    GestureDetector(
                      onTap: () => _showEditProfileDialog(context),
                      child: Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: isDark ? Colors.grey.shade800 : Colors.white,
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          Icons.edit,
                          color: isDark ? Colors.white : Colors.black87,
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 24),

                Text(
                  'Account',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: isDark ? Colors.white : Colors.black,
                  ),
                ),

                const SizedBox(height: 12),

                _sectionTile(
                  isDark: isDark,
                  icon: Icons.person_outline,
                  title: 'Profile Details',
                  subtitle: 'Edit name, email and phone (Syncs Live)',
                  onTap: () => _showEditProfileDialog(context),
                ),
                _sectionTile(
                  isDark: isDark,
                  icon: Icons.lock_outline,
                  title: 'Change Password',
                  subtitle: 'Update your login password',
                  onTap: () => _showChangePasswordDialog(context),
                ),
                _sectionTile(
                  isDark: isDark,
                  icon: Icons.workspace_premium_outlined,
                  title: 'Resume & Career Data',
                  subtitle: 'Manage uploaded resumes and analysis',
                  onTap: () => _showResumeCareerDataDialog(context),
                ),

                const SizedBox(height: 20),

                Text(
                  'Preferences',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: isDark ? Colors.white : Colors.black,
                  ),
                ),

                const SizedBox(height: 12),

                _switchTile(
                  isDark: isDark,
                  icon: Icons.dark_mode_outlined,
                  title: 'Dark Mode',
                  subtitle: 'Switch between light and dark theme',
                  value: darkModeEnabled,
                  onChanged: (value) {
                    setState(() {
                      darkModeEnabled = value;
                    });
                    toggleThemeMode();
                  },
                ),
                _switchTile(
                  isDark: isDark,
                  icon: Icons.notifications_none,
                  title: 'Notifications',
                  subtitle: 'Receive app alerts and reminders',
                  value: notificationsEnabled,
                  onChanged: (value) {
                    setState(() {
                      notificationsEnabled = value;
                    });
                  },
                ),
                _switchTile(
                  isDark: isDark,
                  icon: Icons.email_outlined,
                  title: 'Email Updates',
                  subtitle: 'Receive course and career updates',
                  value: emailUpdatesEnabled,
                  onChanged: (value) {
                    setState(() {
                      emailUpdatesEnabled = value;
                    });
                  },
                ),
                _sectionTile(
                  isDark: isDark,
                  icon: Icons.refresh,
                  title: 'Reset All Progress to 0',
                  subtitle: 'Clear completed lessons, hours & skill metrics',
                  onTap: () async {
                    await ApiService.resetProgress();
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('🔄 All progress reset to 0 & Synced live!'),
                          backgroundColor: Colors.orange,
                        ),
                      );
                      Navigator.pushAndRemoveUntil(
                        context,
                        MaterialPageRoute(builder: (_) => const HomeScreen()),
                        (route) => false,
                      );
                    }
                  },
                ),

                const SizedBox(height: 20),

                Text(
                  'Support',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: isDark ? Colors.white : Colors.black,
                  ),
                ),

                const SizedBox(height: 12),

                _sectionTile(
                  isDark: isDark,
                  icon: Icons.privacy_tip_outlined,
                  title: 'Privacy & Security',
                  subtitle: 'Permissions, data and account safety',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const PrivacySecurityScreen(),
                      ),
                    );
                  },
                ),
                _sectionTile(
                  isDark: isDark,
                  icon: Icons.help_outline,
                  title: 'Help & Support',
                  subtitle: 'FAQs, contact support and feedback',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const HelpSupportScreen(),
                      ),
                    );
                  },
                ),
                _sectionTile(
                  isDark: isDark,
                  icon: Icons.info_outline,
                  title: 'About SkillSnap',
                  subtitle: 'App version, terms and policies',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const AboutAppScreen()),
                    );
                  },
                ),

                const SizedBox(height: 20),

                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pushAndRemoveUntil(
                        context,
                        MaterialPageRoute(builder: (_) => const HomeScreen()),
                        (route) => false,
                      );
                    },
                    icon: const Icon(Icons.logout),
                    label: const Text('Logout'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.redAccent,
                      foregroundColor: Colors.white,
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
        ),
      ),
    );
  }

  void _showResumeCareerDataDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.workspace_premium, color: Color(0xFF5B67FF)),
            SizedBox(width: 8),
            Text('Resume & Career Data'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('📄 Current Resume: John_Jonson_Resume.pdf', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text('🎯 ATS Score: 92/100 (Excellent Match)', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text('🔑 Top Keywords Matched: FastAPI, Flutter, Python, REST APIs, Microservices'),
            const SizedBox(height: 8),
            const Text('🚀 Target Role: Full-Stack AI Engineer'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Close'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('📄 Upload new resume dialog opened!'), backgroundColor: Color(0xFF5B67FF)),
              );
            },
            child: const Text('Upload New Resume'),
          ),
        ],
      ),
    );
  }

  void _showChangePasswordDialog(BuildContext context) {
    final passCtrl = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Change Password'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: passCtrl,
              obscureText: true,
              decoration: const InputDecoration(labelText: 'New Password'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('🔒 Password updated successfully!'), backgroundColor: Colors.green),
              );
            },
            child: const Text('Update Password'),
          ),
        ],
      ),
    );
  }

  Widget _sectionTile({
    required bool isDark,
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            children: [
              Container(
                height: 46,
                width: 46,
                decoration: BoxDecoration(
                  color: const Color(0xFF5B67FF).withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: const Color(0xFF5B67FF)),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        fontSize: 14,
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
                  ],
                ),
              ),
              Icon(
                Icons.arrow_forward_ios,
                size: 16,
                color: isDark ? Colors.white54 : Colors.black38,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _switchTile({
    required bool isDark,
    required IconData icon,
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          children: [
            Container(
              height: 46,
              width: 46,
              decoration: BoxDecoration(
                color: const Color(0xFF5B67FF).withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: const Color(0xFF5B67FF)),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 14,
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
                ],
              ),
            ),
            Switch(value: value, onChanged: onChanged),
          ],
        ),
      ),
    );
  }
}
