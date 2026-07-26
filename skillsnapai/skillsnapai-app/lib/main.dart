import 'package:flutter/material.dart';
import 'screens/splash_screen.dart';

final ValueNotifier<ThemeMode> themeModeNotifier = ValueNotifier(
  ThemeMode.light,
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
            scaffoldBackgroundColor: const Color(0xFFF5F5F5),

            appBarTheme: const AppBarTheme(
              backgroundColor: Colors.white,
              foregroundColor: Colors.black,
              elevation: 0,
            ),

            bottomNavigationBarTheme: const BottomNavigationBarThemeData(
              backgroundColor: Colors.white,
              selectedItemColor: Colors.blue,
              unselectedItemColor: Colors.grey,
            ),
          ),

          // DARK THEME
          darkTheme: ThemeData(
            brightness: Brightness.dark,
            primarySwatch: Colors.blue,
            scaffoldBackgroundColor: const Color(0xFF121212),

            appBarTheme: const AppBarTheme(
              backgroundColor: Color(0xFF1E1E1E),
              foregroundColor: Colors.white,
              elevation: 0,
            ),

            bottomNavigationBarTheme: const BottomNavigationBarThemeData(
              backgroundColor: Color(0xFF1E1E1E),
              selectedItemColor: Colors.blue,
              unselectedItemColor: Colors.grey,
            ),
          ),

          themeMode: currentMode,

          home: const SplashScreen(),
        );
      },
    );
  }
}
