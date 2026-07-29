import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class FirebaseService {
  static const String firebaseDbUrl = 'https://skillsnap-ai-cloud.firebaseio.com/users/1.json';
  static const List<String> fallbackUrls = [
    'http://10.0.2.2:8000/users/1.json',
    'http://localhost:8000/users/1.json',
    firebaseDbUrl,
  ];

  static bool isConnected = false;
  static DateTime? lastSyncedAt;

  /// Fetch user progress from Firebase Realtime Cloud Database
  static Future<Map<String, dynamic>?> fetchProgressFromFirebase() async {
    for (final url in fallbackUrls) {
      try {
        final response = await http
            .get(Uri.parse(url))
            .timeout(const Duration(seconds: 3));

        if (response.statusCode == 200 && response.body != 'null') {
          final data = jsonDecode(response.body) as Map<String, dynamic>;
          isConnected = true;
          lastSyncedAt = DateTime.now();
          await _saveToLocalCache(data);
          return data;
        }
      } catch (e) {
        // Continue to fallback endpoint
      }
    }
    isConnected = false;
    return await _loadFromLocalCache();
  }

  /// Push updated user progress to Firebase Realtime Cloud Database
  static Future<bool> pushProgressToFirebase({
    required int lessonsCompleted,
    required double hoursSpent,
    required Map<String, int> skills,
  }) async {
    final payload = {
      'user_id': 1,
      'lessons_completed': lessonsCompleted,
      'hours_spent': hoursSpent,
      'skills': skills,
      'platform': 'Flutter Mobile App',
      'updated_at': DateTime.now().toIso8601String(),
    };

    bool success = false;
    for (final url in fallbackUrls) {
      try {
        final response = await http
            .put(
              Uri.parse(url),
              headers: {'Content-Type': 'application/json'},
              body: jsonEncode(payload),
            )
            .timeout(const Duration(seconds: 3));

        if (response.statusCode == 200) {
          success = true;
          isConnected = true;
          lastSyncedAt = DateTime.now();
          break;
        }
      } catch (e) {
        // Continue to fallback
      }
    }

    await _saveToLocalCache(payload);
    return success;
  }

  static Future<void> _saveToLocalCache(Map<String, dynamic> data) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('firebase_sync_cache', jsonEncode(data));
    } catch (_) {}
  }

  static Future<Map<String, dynamic>?> _loadFromLocalCache() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final str = prefs.getString('firebase_sync_cache');
      if (str != null) {
        return jsonDecode(str) as Map<String, dynamic>;
      }
    } catch (_) {}
    return null;
  }
}
