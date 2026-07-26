import 'package:flutter/material.dart';
import 'login_screen.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF8FB2E8),

      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            children: [
              const SizedBox(height: 35),

              // TOP SECTION
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Search Image
                  Image.asset(
                    'assets/images/search.png',
                    height: 78,
                    width: 78,
                  ),

                  const SizedBox(width: 10),

                  // Text
                  const Padding(
                    padding: EdgeInsets.only(top: 6),
                    child: Text(
                      'Start\nYour\nCareer\nNow',
                      style: TextStyle(
                        fontSize: 29,
                        fontWeight: FontWeight.w800,
                        height: 1.0,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 25),

              // ROBOT IMAGE
              Expanded(
                child: Center(
                  child: Image.asset(
                    'assets/images/robot.png',
                    fit: BoxFit.contain,
                  ),
                ),
              ),

              // BUTTON
              Padding(
                padding: const EdgeInsets.only(bottom: 22, left: 2, right: 2),
                child: SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const LoginScreen(),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF4D8DFF),
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                    ),

                    child: const Text(
                      'Get Started →',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
