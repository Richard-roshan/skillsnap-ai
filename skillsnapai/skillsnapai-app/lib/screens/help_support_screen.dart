import 'package:flutter/material.dart';

class HelpSupportScreen extends StatelessWidget {
  const HelpSupportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Help & Support')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _tile(
            icon: Icons.question_answer_outlined,
            title: 'Frequently Asked Questions',
            subtitle: 'Find answers to common app and learning questions.',
          ),
          _tile(
            icon: Icons.contact_support_outlined,
            title: 'Contact Support',
            subtitle: 'Reach out to the support team for help.',
          ),
          _tile(
            icon: Icons.bug_report_outlined,
            title: 'Report a Problem',
            subtitle: 'Let us know if something is not working properly.',
          ),
          _tile(
            icon: Icons.feedback_outlined,
            title: 'Send Feedback',
            subtitle: 'Share suggestions to improve SkillSnap.',
          ),
          _tile(
            icon: Icons.privacy_tip_outlined,
            title: 'Privacy Questions',
            subtitle: 'Learn how your data is used and protected.',
          ),
        ],
      ),
    );
  }

  Widget _tile({
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Container(
            height: 44,
            width: 44,
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
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: const TextStyle(fontSize: 12, color: Colors.black54),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
