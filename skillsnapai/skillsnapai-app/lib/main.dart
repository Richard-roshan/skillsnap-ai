
import 'package:flutter/material.dart';
import 'screens/splash_screen.dart';

final ValueNotifier<ThemeMode> themeModeNotifier = ValueNotifier(
  ThemeMode.dark,
);

void toggleThemeMode() {
  themeModeNotifier.value = themeModeNotifier.value == ThemeMode.light
      ? ThemeMode.dark
      : ThemeMode.light;
}

void main() {
  runApp(const SkillSnapAI());
}

class SkillSnapAI extends StatelessWidget {
  const SkillSnapAI({super.key});

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<ThemeMode>(
      valueListenable: themeModeNotifier,

      builder: (context, currentMode, child) {
        return MaterialApp(
          debugShowCheckedModeBanner: false,

          // LIGHT THEME
          theme: ThemeData(
            brightness: Brightness.light,
            primarySwatch: Colors.blue,
            scaffoldBackgroundColor: const Color(0xFFF8FAFC),
            cardColor: Colors.white,

            appBarTheme: const AppBarTheme(
              backgroundColor: Colors.white,
              foregroundColor: Colors.black,
              elevation: 0,
            ),

            bottomNavigationBarTheme: const BottomNavigationBarThemeData(
              backgroundColor: Colors.white,
              selectedItemColor: Color(0xFF3B82F6),
              unselectedItemColor: Color(0xFF64748B),
            ),
          ),

          // DARK THEME
          darkTheme: ThemeData(
            brightness: Brightness.dark,
            primarySwatch: Colors.blue,
            scaffoldBackgroundColor: const Color(0xFF121624),
            cardColor: const Color(0xFF1B2136),

            appBarTheme: const AppBarTheme(
              backgroundColor: Color(0xFF1B2136),
              foregroundColor: Colors.white,
              elevation: 0,
            ),

            bottomNavigationBarTheme: const BottomNavigationBarThemeData(
              backgroundColor: Color(0xFF1B2136),
              selectedItemColor: Color(0xFF3B82F6),
              unselectedItemColor: Color(0xFF94A3B8),
            ),
          ),

          themeMode: currentMode,

          home: const SplashScreen(),
        );
      },
    );
  }
}
