import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:8000';
  static const String wsUrl = 'ws://10.0.2.2:8000';

  static String getWebSocketUrl(int userId) => '$wsUrl/ws/$userId';

  static Future<void> broadcastLiveUpdate({
    required int userId,
    required String eventType,
    required Map<String, dynamic> data,
  }) async {
    final url = Uri.parse('$baseUrl/sync/broadcast');
    try {
      await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'user_id': userId,
          'event_type': eventType,
          'data': data,
        }),
      );
    } catch (e) {
      // Ignore background network error
    }
  }

  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final url = Uri.parse('$baseUrl/login');

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    return {
      'statusCode': response.statusCode,
      'data': jsonDecode(response.body),
    };
  }

  static Future<Map<String, dynamic>> register({
    required String fullName,
    required String email,
    required String phone,
    required String password,
  }) async {
    final url = Uri.parse('$baseUrl/register');

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'full_name': fullName,
        'email': email,
        'phone_number': phone,
        'password': password,
      }),
    );

    return {
      'statusCode': response.statusCode,
      'data': jsonDecode(response.body),
    };
  }

  static Future<Map<String, dynamic>> fetchHomeDashboard(int userId) async {
    final url = Uri.parse('$baseUrl/home/dashboard/$userId');

    final response = await http.get(url);

    if (response.statusCode == 200) {
      return jsonDecode(response.body) as Map<String, dynamic>;
    } else {
      throw Exception('Failed to load dashboard');
    }
  }

  static Future<Map<String, dynamic>> fetchMentorshipDashboard(
    int userId,
  ) async {
    final url = Uri.parse('$baseUrl/mentorship/dashboard/$userId');
    final response = await http.get(url);

    if (response.statusCode == 200) {
      return jsonDecode(response.body) as Map<String, dynamic>;
    } else {
      throw Exception('Failed to load mentorship dashboard');
    }
  }

  static Future<Map<String, dynamic>> fetchMyCourses(int userId) async {
    final url = Uri.parse('$baseUrl/my-courses/$userId');
    final response = await http.get(url);

    if (response.statusCode == 200) {
      return jsonDecode(response.body) as Map<String, dynamic>;
    } else {
      throw Exception('Failed to load courses');
    }
  }

  static Future<Map<String, dynamic>> fetchCourseLessons(int courseId) async {
    final url = Uri.parse('$baseUrl/courses/$courseId/lessons');
    final response = await http.get(url);

    if (response.statusCode == 200) {
      return jsonDecode(response.body) as Map<String, dynamic>;
    } else {
      throw Exception('Failed to load lessons');
    }
  }
}
