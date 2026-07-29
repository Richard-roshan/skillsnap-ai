import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

/// WhatsApp-style Bidirectional Firebase Realtime Cloud Synchronization Engine
class FirebaseService {
  static const String firebaseDbUrl = 'https://skillsnap-ai-cloud.firebaseio.com/users/1.json';
  static const List<String> fallbackUrls = [
    'http://10.0.2.2:8000/users/1.json',
    'http://localhost:8000/users/1.json',
    firebaseDbUrl,
  ];

  static bool isConnected = false;
  static DateTime? lastSyncedAt;
  static List<Map<String, dynamic>> chatMessages = [];
  static String profileName = 'John Jonson';

  /// Fetch full state (Progress + Profile + Live Chat Messages) from Firebase Realtime Cloud Database
  static Future<Map<String, dynamic>?> fetchFullStateFromFirebase() async {
    for (final url in fallbackUrls) {
      try {
        final response = await http
            .get(Uri.parse(url))
            .timeout(const Duration(seconds: 3));

        if (response.statusCode == 200 && response.body != 'null') {
          final data = jsonDecode(response.body) as Map<String, dynamic>;
          isConnected = true;
          lastSyncedAt = DateTime.now();

          // Sync Profile Name
          if (data['profile'] != null && data['profile']['full_name'] != null) {
            profileName = data['profile']['full_name'].toString();
          }

          // Sync Chat Messages like WhatsApp Web <-> Mobile
          if (data['chat_messages'] != null && data['chat_messages'] is List) {
            chatMessages = List<Map<String, dynamic>>.from(
              (data['chat_messages'] as List).map((x) => Map<String, dynamic>.from(x as Map)),
            );
          }

          await _saveToLocalCache(data);
          return data;
        }
      } catch (_) {}
    }
    isConnected = false;
    return await _loadFromLocalCache();
  }

  /// Send a WhatsApp-style live chat message to Firebase Realtime Database
  static Future<bool> sendChatMessage({
    required String messageText,
    required String sender, // 'user' or 'assistant'
  }) async {
    chatMessages.add({
      'sender': sender,
      'text': messageText,
      'timestamp': DateTime.now().toIso8601String(),
    });

    final currentData = await _loadFromLocalCache() ?? {};
    currentData['chat_messages'] = chatMessages;

    return await _pushRawStateToFirebase(currentData);
  }

  /// Update Profile Name live in Firebase Realtime Database
  static Future<bool> updateProfileName(String newName) async {
    profileName = newName;
    final currentData = await _loadFromLocalCache() ?? {};
    if (currentData['profile'] == null) {
      currentData['profile'] = {};
    }
    currentData['profile']['full_name'] = newName;
    return await _pushRawStateToFirebase(currentData);
  }

  /// Push progress metrics to Firebase Realtime Database
  static Future<bool> pushProgressToFirebase({
    required int lessonsCompleted,
    required double hoursSpent,
    required Map<String, int> skills,
  }) async {
    final currentData = await _loadFromLocalCache() ?? {};
    currentData['user_id'] = 1;
    currentData['lessons_completed'] = lessonsCompleted;
    currentData['hours_spent'] = hoursSpent;
    currentData['skills'] = skills;
    currentData['platform'] = 'Flutter Mobile App';
    currentData['updated_at'] = DateTime.now().toIso8601String();

    return await _pushRawStateToFirebase(currentData);
  }

  static Future<bool> _pushRawStateToFirebase(Map<String, dynamic> payload) async {
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
      } catch (_) {}
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
