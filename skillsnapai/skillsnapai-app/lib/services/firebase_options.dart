import 'package:flutter/foundation.dart';

/// Centralized Firebase Options configuration for SkillSnap AI Mobile & Web platforms
class DefaultFirebaseOptions {
  static const String databaseUrl = 'https://skillsnap-ai-cloud.firebaseio.com';
  static const String projectId = 'skillsnap-ai-cloud';
  static const String apiKey = 'AIzaSyYOUR_FIREBASE_API_KEY';
  static const String appId = '1:123456789012:android:abcdef1234567890';
  static const String messagingSenderId = '123456789012';

  static Map<String, dynamic> get currentOptions => {
        'databaseURL': databaseUrl,
        'projectId': projectId,
        'apiKey': apiKey,
        'appId': appId,
        'messagingSenderId': messagingSenderId,
      };
}
