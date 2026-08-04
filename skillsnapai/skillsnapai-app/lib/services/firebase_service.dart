import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

/// Dynamic Multi-Tenant Firebase Realtime Cloud Synchronization Engine
class FirebaseService {
  static const String rtdbBaseUrl = 'https://skillsnap-ai-cloud-default-rtdb.firebaseio.com';
  static const String firebaseDbBaseUrl = 'https://skillsnap-ai-cloud.firebaseio.com';

  static String activeUserId = '1';
  static bool isConnected = false;
  static DateTime? lastSyncedAt;
  static List<Map<String, dynamic>> chatMessages = [];
  static String profileName = 'John Jonson';

  /// Get fallback endpoints for dynamic userId
  static List<String> getEndpointsForUser(String userId) {
    return [
      'http://localhost:8000/users/$userId.json',
      '$rtdbBaseUrl/users/$userId.json',
      '$firebaseDbBaseUrl/users/$userId.json',
      'http://172.20.10.3:8000/users/$userId.json',
      'http://10.0.2.2:8000/users/$userId.json',
    ];
  }

  static String get firebaseDbUrl => '$rtdbBaseUrl/users/$activeUserId.json';

  /// Initialize dynamic user session with automated clean record fallback
  static Future<Map<String, dynamic>> initializeUserSession({
    String userId = '1',
    String fullName = 'John Jonson',
  }) async {
    activeUserId = userId;
    final endpoints = getEndpointsForUser(userId);

    for (final url in endpoints) {
      try {
        final res = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 3));
        if (res.statusCode == 200 && res.body != 'null') {
          final data = jsonDecode(res.body) as Map<String, dynamic>;
          isConnected = true;
          lastSyncedAt = DateTime.now();
          if (data['profile'] != null && data['profile']['full_name'] != null) {
            profileName = data['profile']['full_name'].toString();
          }
          await _saveToLocalCache(data);
          return data;
        }
      } catch (_) {}
    }

    // Dynamic initial record fallback
    final initialRecord = {
      'user_id': userId,
      'full_name': fullName,
      'lessons_completed': 0,
      'hours_spent': 0.0,
      'ats_score': 0,
      'skills': <String, int>{},
      'profile': {'full_name': fullName, 'email': '$userId@skillsnap.ai'},
      'created_at': DateTime.now().toUtc().toIso8601String(),
      'updated_at': DateTime.now().toUtc().toIso8601String(),
    };

    await _pushRawStateToFirebase(initialRecord, userId: userId);
    return initialRecord;
  }

  /// Fetch full state dynamically for active user
  static Future<Map<String, dynamic>?> fetchFullStateFromFirebase({String? userId}) async {
    final targetUserId = userId ?? activeUserId;
    final endpoints = getEndpointsForUser(targetUserId);

    for (final url in endpoints) {
      try {
        final response = await http
            .get(Uri.parse(url))
            .timeout(const Duration(seconds: 3));

        if (response.statusCode == 200 && response.body != 'null') {
          final data = jsonDecode(response.body) as Map<String, dynamic>;
          isConnected = true;
          lastSyncedAt = DateTime.now();

          if (data['profile'] != null && data['profile']['full_name'] != null) {
            profileName = data['profile']['full_name'].toString();
          }

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

  /// Stream live updates for dynamic user node
  static Stream<Map<String, dynamic>> streamUser(String userId) async* {
    while (true) {
      final state = await fetchFullStateFromFirebase(userId: userId);
      if (state != null) {
        yield state;
      }
      await Future.delayed(const Duration(seconds: 2));
    }
  }

  /// Send live chat message to dynamic user node
  static Future<bool> sendChatMessage({
    required String messageText,
    required String sender,
    String? userId,
  }) async {
    chatMessages.add({
      'sender': sender,
      'text': messageText,
      'timestamp': DateTime.now().toIso8601String(),
    });

    final currentData = await _loadFromLocalCache() ?? {};
    currentData['chat_messages'] = chatMessages;

    return await _pushRawStateToFirebase(currentData, userId: userId ?? activeUserId);
  }

  /// Update Profile Name live in Firebase Realtime Database
  static Future<bool> updateProfileName(String newName, {String? userId}) async {
    profileName = newName;
    final currentData = await _loadFromLocalCache() ?? {};
    if (currentData['profile'] == null) {
      currentData['profile'] = {};
    }
    currentData['profile']['full_name'] = newName;
    currentData['full_name'] = newName;
    return await _pushRawStateToFirebase(currentData, userId: userId ?? activeUserId);
  }

  /// Push progress metrics dynamically
  static Future<bool> pushProgressToFirebase({
    required int lessonsCompleted,
    required double hoursSpent,
    required Map<String, int> skills,
    String? userId,
  }) async {
    final targetId = userId ?? activeUserId;
    final currentData = await _loadFromLocalCache() ?? {};
    currentData['user_id'] = targetId;
    currentData['lessons_completed'] = lessonsCompleted;
    currentData['hours_spent'] = hoursSpent;
    currentData['skills'] = skills;
    currentData['platform'] = 'Flutter Mobile App';
    currentData['updated_at'] = DateTime.now().toUtc().toIso8601String();

    return await _pushRawStateToFirebase(currentData, userId: targetId);
  }

  static Future<bool> _pushRawStateToFirebase(Map<String, dynamic> payload, {String? userId}) async {
    final targetId = userId ?? activeUserId;
    final endpoints = getEndpointsForUser(targetId);
    bool success = false;

    for (final url in endpoints) {
      try {
        final res = await http.put(
          Uri.parse(url),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode(payload),
        ).timeout(const Duration(seconds: 3));

        if (res.statusCode == 200 || res.statusCode == 201) {
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
      await prefs.setString('rtdb_user_cache_${data['user_id'] ?? activeUserId}', jsonEncode(data));
    } catch (_) {}
  }

  static Future<Map<String, dynamic>?> _loadFromLocalCache() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final str = prefs.getString('rtdb_user_cache_$activeUserId');
      if (str != null) {
        return jsonDecode(str) as Map<String, dynamic>;
      }
    } catch (_) {}
    return null;
  }
}
