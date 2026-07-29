import 'package:flutter/material.dart';

class PrivacySecurityScreen extends StatelessWidget {
  const PrivacySecurityScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Privacy & Security')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _tile(
            icon: Icons.lock_outline,
            title: 'Password Protection',
            subtitle: 'Change your password anytime to keep your account safe.',
          ),
          _tile(
            icon: Icons.verified_user_outlined,
            title: 'Account Privacy',
            subtitle: 'Control who can view your profile and activity.',
          ),
          _tile(
            icon: Icons.delete_outline,
            title: 'Delete Account',
            subtitle: 'Request account deletion and data removal.',
          ),
          _tile(
            icon: Icons.file_download_outlined,
            title: 'Download My Data',
            subtitle: 'Export your profile, courses and resume history.',
          ),
          _tile(
            icon: Icons.shield_outlined,
            title: 'Security Tips',
            subtitle: 'Use a strong password and do not share login details.',
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
