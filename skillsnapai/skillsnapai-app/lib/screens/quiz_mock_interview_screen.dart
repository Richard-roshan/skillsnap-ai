import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'home_screen.dart';
import 'mentorship_screen.dart';
import 'my_courses_screen.dart';
import 'settings_screen.dart';

class QuizMockInterviewScreen extends StatefulWidget {
  const QuizMockInterviewScreen({super.key});

  @override
  State<QuizMockInterviewScreen> createState() => _QuizMockInterviewScreenState();
}

class _QuizMockInterviewScreenState extends State<QuizMockInterviewScreen> {
  int _activeSubTab = 0; // 0 = Skill Quizzes, 1 = AI Mock Interview

  // Quiz State
  String _selectedCategory = 'FastAPI';
  int _currentQuestionIndex = 0;
  int? _selectedOptionIndex;
  bool _answered = false;
  int _score = 0;

  final Map<String, List<Map<String, dynamic>>> _quizzes = {
    'FastAPI': [
      {
        'question': 'What parameter is used in FastAPI decorators to set the HTTP response code?',
        'options': ['status_code=', 'response_code=', 'http_status=', 'code='],
        'correct': 0,
        'explanation': 'FastAPI decorator `@app.get("/", status_code=200)` sets the HTTP response code directly.'
      },
      {
        'question': 'Which Pydantic config attribute enables automatic ORM model parsing in v2?',
        'options': ['from_attributes = True', 'orm_mode = True', 'parse_orm = True', 'model_config = "orm"'],
        'correct': 0,
        'explanation': 'In Pydantic v2, `from_attributes = True` replaces `orm_mode` for attribute mapping.'
      },
      {
        'question': 'Which ASGI web server is standard for running FastAPI production applications?',
        'options': ['Uvicorn', 'Gunicorn WSGI', 'Apache mod_wsgi', 'Waitress'],
        'correct': 0,
        'explanation': 'Uvicorn is a lightning-fast ASGI server implementation using uvloop and httptools.'
      },
      {
        'question': 'How do you define a non-blocking asynchronous route handler in FastAPI?',
        'options': ['async def route_name()', 'def async_route()', 'await def route()', 'def route_name(async=True)'],
        'correct': 0,
        'explanation': '`async def` tells FastAPI to execute the handler in an asynchronous event loop.'
      },
      {
        'question': 'Which FastAPI dependency injection tool is used to share DB sessions across routes?',
        'options': ['Depends()', 'Inject()', 'Require()', 'Use()'],
        'correct': 0,
        'explanation': '`Depends()` allows declaring reusable dependencies for authentication, database, and logic.'
      }
    ],
    'Flutter': [
      {
        'question': 'Which widget is best suited for responsive scrollable lists with dynamic items?',
        'options': ['ListView.builder', 'SingleChildScrollView', 'Column', 'GridView.count'],
        'correct': 0,
        'explanation': 'ListView.builder lazily builds items on demand as they scroll into view.'
      },
      {
        'question': 'What is the primary purpose of ValueNotifier in Flutter?',
        'options': ['Lightweight state management without external packages', 'Database connection', 'HTTP routing', 'Asset management'],
        'correct': 0,
        'explanation': 'ValueNotifier notifies listeners when its value changes, triggering minimal UI rebuilds.'
      },
      {
        'question': 'Which build mode in Flutter compiles code with AOT ahead-of-time for maximum production speed?',
        'options': ['Release Mode', 'Debug Mode', 'Profile Mode', 'JIT Mode'],
        'correct': 0,
        'explanation': 'Release mode compiles ARM machine code AOT for maximum execution performance.'
      },
      {
        'question': 'What property in MaterialPageRoute preserves route state when navigating away?',
        'options': ['maintainState', 'keepAlive', 'preserveState', 'storeRoute'],
        'correct': 0,
        'explanation': '`maintainState: true` keeps the route history and state in memory while covered.'
      },
      {
        'question': 'Which Flutter command downloads all dependencies declared in pubspec.yaml?',
        'options': ['flutter pub get', 'flutter install', 'flutter fetch', 'pub pull'],
        'correct': 0,
        'explanation': '`flutter pub get` fetches all declared pub packages into your project cache.'
      }
    ],
    'UI/UX Design': [
      {
        'question': 'What principle does Fitts\'s Law describe in interface design?',
        'options': [
          'Target acquisition time depends on target distance and size',
          'Font readability speed',
          'Color harmony ratios',
          'Page rendering latency'
        ],
        'correct': 0,
        'explanation': 'Fitts\'s Law states that larger and closer UI elements are faster to interact with.'
      },
      {
        'question': 'What is the WCAG AA minimum contrast ratio for normal body text?',
        'options': ['4.5:1', '3:1', '7:1', '2:1'],
        'correct': 0,
        'explanation': 'WCAG 2.1 AA requires a contrast ratio of at least 4.5:1 for normal text readability.'
      },
      {
        'question': 'What is the primary objective of wireframing in early product design?',
        'options': ['Establishing structural layout and user flow before visual polish', 'Choosing brand colors', 'Writing database queries', 'A/B testing ad copy'],
        'correct': 0,
        'explanation': 'Wireframes focus on content hierarchy and navigation structure before visual design.'
      },
      {
        'question': 'Which grid column system is standard for responsive desktop web interfaces?',
        'options': ['12-column grid', '8-column grid', '16-column grid', '5-column grid'],
        'correct': 0,
        'explanation': 'A 12-column grid offers maximum layout flexibility across desktop breakpoints.'
      },
      {
        'question': 'What does "micro-interaction" refer to in modern user interfaces?',
        'options': ['Subtle visual feedback or animation on user actions like button taps', 'Database queries', 'Dark mode toggle CSS', 'Page route changes'],
        'correct': 0,
        'explanation': 'Micro-interactions give immediate, delightful feedback on user inputs.'
      }
    ],
    'AI & ML': [
      {
        'question': 'What does RAG stand for in generative AI systems?',
        'options': [
          'Retrieval-Augmented Generation',
          'Recurrent Array Optimization',
          'Randomized Adaptive Gradient',
          'Real-time Asset Generator'
        ],
        'correct': 0,
        'explanation': 'Retrieval-Augmented Generation enhances LLM prompts with relevant external documents.'
      },
      {
        'question': 'Which vector index algorithm is widely used for fast nearest neighbor similarity search?',
        'options': ['HNSW', 'B-Tree', 'Red-Black Tree', 'Bubble Sort'],
        'correct': 0,
        'explanation': 'HNSW (Hierarchical Navigable Small World) provides ultra-fast vector similarity search.'
      },
      {
        'question': 'What mechanism allows transformer models to weigh the importance of different tokens?',
        'options': ['Self-Attention Mechanism', 'Convolutional Filters', 'Max Pooling', 'Gradient Descent'],
        'correct': 0,
        'explanation': 'Self-attention dynamically calculates token contextual relationships across sequences.'
      },
      {
        'question': 'What temperature setting in LLMs produces the most deterministic, non-random output?',
        'options': ['0.0', '0.7', '1.0', '2.0'],
        'correct': 0,
        'explanation': 'Temperature 0.0 makes the model deterministically select the top probability token.'
      },
      {
        'question': 'What is the primary role of System Prompts in LLM API requests?',
        'options': ['Setting baseline rules, behavior, and persona constraints', 'Encrypting HTTP payloads', 'Downloading vector models', 'Compressing JSON tokens'],
        'correct': 0,
        'explanation': 'System prompts define fundamental persona, output rules, and behavioral boundaries.'
      }
    ]
  };

  // Mock Interview State
  String _targetRole = 'Full-Stack AI Engineer';
  final TextEditingController _interviewAnswerController = TextEditingController();
  bool _isEvaluating = false;
  Map<String, dynamic>? _interviewFeedback;

  final List<String> _interviewQuestions = [
    'How do you design a real-time sync architecture between a Flutter mobile app and FastAPI backend using WebSockets?',
    'Describe how you handle state management, error handling, and offline fallbacks in cross-platform mobile apps.',
    'Explain how you optimize ATS resume score using quantifiable metrics and keyword strategy.'
  ];
  final int _currentInterviewQuestionIndex = 0;

  void _onNavTap(int index) {
    if (index == 2) return;
    Widget target;
    if (index == 0) {
      target = const HomeScreen();
    } else if (index == 1) {
      target = const MentorshipScreen();
    } else if (index == 3) {
      target = const MyCoursesScreen();
    } else {
      target = const SettingsScreen();
    }

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => target),
    );
  }

  void _selectOption(int index) {
    if (_answered) return;
    setState(() {
      _selectedOptionIndex = index;
      _answered = true;
      final currentQuiz = _quizzes[_selectedCategory]![_currentQuestionIndex];
      if (index == currentQuiz['correct']) {
        _score++;
      }
    });

    ApiService.incrementProgress(
      lessons: 1,
      hours: 0.5,
      skill: _selectedCategory == 'Flutter' ? 'Flutter Mobile' : 'UI/UX Design',
      skillInc: 15,
    );
  }

  void _nextQuestion() {
    final quizList = _quizzes[_selectedCategory]!;
    setState(() {
      if (_currentQuestionIndex < quizList.length - 1) {
        _currentQuestionIndex++;
        _selectedOptionIndex = null;
        _answered = false;
      } else {
        // Reset or finish quiz
        _showQuizCompletionDialog();
      }
    });
  }

  void _showQuizCompletionDialog() {
    final total = _quizzes[_selectedCategory]!.length;
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('🎉 Quiz Completed!'),
        content: Text('You scored $_score out of $total in $_selectedCategory.'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              setState(() {
                _currentQuestionIndex = 0;
                _selectedOptionIndex = null;
                _answered = false;
                _score = 0;
              });
            },
            child: const Text('Try Again'),
          )
        ],
      ),
    );
  }

  void _submitInterviewAnswer() async {
    final text = _interviewAnswerController.text.trim().toLowerCase();
    if (text.isEmpty) return;

    setState(() {
      _isEvaluating = true;
    });

    await Future.delayed(const Duration(milliseconds: 800));

    final words = text.split(RegExp(r'\s+')).where((w) => w.isNotEmpty).toList();
    
    // Insufficient or single-word check ("ok", "idk", "yes", "no", < 15 chars)
    if (text.length < 15 || words.length < 4 || ['ok', 'yes', 'no', 'idk', 'hello', 'hi', 'good', 'fine'].contains(text)) {
      setState(() {
        _isEvaluating = false;
        _interviewFeedback = {
          'overall_score': 12,
          'technical_depth': 'Insufficient response. Single-word or low-effort answers fail technical screening.',
          'communication': 'Needs improvement. Use the STAR methodology (Situation, Task, Action, Result).',
          'suggestions': 'Provide detailed technical explanation. Include architectural components like WebSockets, ConnectionManager, and StreamBuilder.'
        };
      });
      return;
    }

    final targetKeywords = ['websocket', 'fastapi', 'flutter', 'async', 'json', 'state', 'connection', 'reconnect', 'streambuilder', 'broadcast'];
    final matched = targetKeywords.where((kw) => text.contains(kw)).toList();

    final baseScore = (words.length * 2).clamp(0, 45);
    final kwScore = (matched.length * 12).clamp(0, 50);
    final score = (baseScore + kwScore).clamp(15, 98);

    final depth = score >= 75
        ? 'Excellent response! Matched key concepts: [${matched.join(', ')}].'
        : (score >= 45
            ? 'Moderate technical depth. Matched concepts: [${matched.join(', ')}].'
            : 'Low technical depth. Missing core concepts like: [${targetKeywords.sublist(0, 4).join(', ')}].');

    setState(() {
      _isEvaluating = false;
      _interviewFeedback = {
        'overall_score': score,
        'technical_depth': depth,
        'communication': words.length >= 20 ? 'Good structure adhering to technical standards.' : 'Response could be more detailed.',
        'suggestions': matched.length < 3 ? 'Incorporate specific terminology like ${targetKeywords.sublist(0, 3).join(', ')}.' : 'Quantify outcomes (e.g. "Reduced API latency by 40%").'
      };
    });

    if (score >= 50) {
      ApiService.incrementProgress(
        lessons: 1,
        hours: 0.5,
        skill: 'FastAPI Backend',
        skillInc: 20,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final currentQuizList = _quizzes[_selectedCategory] ?? [];
    final currentQuiz = currentQuizList.isNotEmpty ? currentQuizList[_currentQuestionIndex] : null;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF121624) : const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Quiz & AI Mock Interviews', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 2,
        selectedItemColor: const Color(0xFF3B82F6),
        unselectedItemColor: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
        backgroundColor: isDark ? const Color(0xFF1B2136) : Colors.white,
        type: BottomNavigationBarType.fixed,
        onTap: _onNavTap,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.school), label: 'Mentorship'),
          BottomNavigationBarItem(icon: Icon(Icons.quiz), label: 'Quiz & Mock'),
          BottomNavigationBarItem(icon: Icon(Icons.menu_book), label: 'My Courses'),
          BottomNavigationBarItem(icon: Icon(Icons.settings), label: 'Settings'),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Segment Control Toggle
              Container(
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E1E1E) : Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(12),
                ),
                padding: const EdgeInsets.all(4),
                child: Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _activeSubTab = 0),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          decoration: BoxDecoration(
                            color: _activeSubTab == 0 ? Colors.blue : Colors.transparent,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            '⚡ Skill Quizzes',
                            style: TextStyle(
                              color: _activeSubTab == 0 ? Colors.white : (isDark ? Colors.white70 : Colors.black87),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _activeSubTab = 1),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          decoration: BoxDecoration(
                            color: _activeSubTab == 1 ? Colors.blue : Colors.transparent,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            '🎙️ AI Mock Interview',
                            style: TextStyle(
                              color: _activeSubTab == 1 ? Colors.white : (isDark ? Colors.white70 : Colors.black87),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // SUB TAB 0: SKILL QUIZZES
              if (_activeSubTab == 0) ...[
                // Category Chips
                SizedBox(
                  height: 40,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    children: _quizzes.keys.map((cat) {
                      final isSelected = cat == _selectedCategory;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8.0),
                        child: ChoiceChip(
                          label: Text(cat),
                          selected: isSelected,
                          selectedColor: Colors.blue,
                          labelStyle: TextStyle(
                            color: isSelected ? Colors.white : (isDark ? Colors.white : Colors.black),
                            fontWeight: FontWeight.w600,
                          ),
                          onSelected: (selected) {
                            if (selected) {
                              setState(() {
                                _selectedCategory = cat;
                                _currentQuestionIndex = 0;
                                _selectedOptionIndex = null;
                                _answered = false;
                                _score = 0;
                              });
                            }
                          },
                        ),
                      );
                    }).toList(),
                  ),
                ),

                const SizedBox(height: 20),

                if (currentQuiz != null) ...[
                  // Question Card
                  Card(
                    elevation: 2,
                    color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Question ${_currentQuestionIndex + 1} of ${currentQuizList.length}',
                                style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold),
                              ),
                              Text(
                                'Score: $_score',
                                style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Text(
                            currentQuiz['question'],
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 16),

                          // Options
                          ...List.generate(
                            (currentQuiz['options'] as List).length,
                            (index) {
                              final optionText = currentQuiz['options'][index];
                              final isCorrect = index == currentQuiz['correct'];
                              final isSelected = _selectedOptionIndex == index;

                              Color tileColor = isDark ? const Color(0xFF2C2C2C) : Colors.grey.shade100;
                              BorderSide border = BorderSide.none;

                              if (_answered) {
                                if (isCorrect) {
                                  tileColor = Colors.green.withValues(alpha: 0.2);
                                  border = const BorderSide(color: Colors.green, width: 2);
                                } else if (isSelected && !isCorrect) {
                                  tileColor = Colors.red.withValues(alpha: 0.2);
                                  border = const BorderSide(color: Colors.red, width: 2);
                                }
                              }

                              return Container(
                                margin: const EdgeInsets.only(bottom: 10),
                                child: Material(
                                  color: tileColor,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(10),
                                    side: border,
                                  ),
                                  child: ListTile(
                                    onTap: () => _selectOption(index),
                                    title: Text(optionText, style: const TextStyle(fontSize: 14)),
                                    trailing: _answered
                                        ? (isCorrect
                                            ? const Icon(Icons.check_circle, color: Colors.green)
                                            : (isSelected ? const Icon(Icons.cancel, color: Colors.red) : null))
                                        : null,
                                  ),
                                ),
                              );
                            },
                          ),

                          if (_answered) ...[
                            const SizedBox(height: 10),
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.blue.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: Colors.blue.withValues(alpha: 0.3)),
                              ),
                              child: Text(
                                '💡 ${currentQuiz['explanation']}',
                                style: const TextStyle(fontSize: 13, height: 1.3),
                              ),
                            ),
                            const SizedBox(height: 16),
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.blue,
                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                ),
                                onPressed: _nextQuestion,
                                child: Text(
                                  _currentQuestionIndex < currentQuizList.length - 1
                                      ? 'Next Question'
                                      : 'View Final Result',
                                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                                ),
                              ),
                            )
                          ]
                        ],
                      ),
                    ),
                  )
                ]
              ]

              // SUB TAB 1: AI MOCK INTERVIEW
              else ...[
                Card(
                  elevation: 2,
                  color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          '🎯 Target Technical Role',
                          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.blue),
                        ),
                        const SizedBox(height: 8),
                        DropdownButtonFormField<String>(
                          initialValue: _targetRole,
                          decoration: InputDecoration(
                            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                          ),
                          items: [
                            'Full-Stack AI Engineer',
                            'Flutter Mobile Developer',
                            'FastAPI Backend Architect',
                            'UI/UX Product Designer'
                          ].map((role) => DropdownMenuItem(value: role, child: Text(role))).toList(),
                          onChanged: (val) {
                            if (val != null) setState(() => _targetRole = val);
                          },
                        ),
                        const SizedBox(height: 20),

                        Text(
                          'Question ${_currentInterviewQuestionIndex + 1}:',
                          style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.grey),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _interviewQuestions[_currentInterviewQuestionIndex],
                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 16),

                        TextField(
                          controller: _interviewAnswerController,
                          maxLines: 4,
                          decoration: InputDecoration(
                            hintText: 'Type your STAR answer (Situation, Task, Action, Result)...',
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                            filled: true,
                            fillColor: isDark ? const Color(0xFF2C2C2C) : Colors.grey.shade100,
                          ),
                        ),
                        const SizedBox(height: 16),

                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton.icon(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.blue,
                              padding: const EdgeInsets.symmetric(vertical: 12),
                            ),
                            onPressed: _isEvaluating ? null : _submitInterviewAnswer,
                            icon: _isEvaluating
                                ? const SizedBox(
                                    width: 18,
                                    height: 18,
                                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                                  )
                                : const Icon(Icons.auto_awesome, color: Colors.white),
                            label: Text(
                              _isEvaluating ? 'Evaluating with AI...' : 'Submit for AI Evaluation',
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                            ),
                          ),
                        )
                      ],
                    ),
                  ),
                ),

                if (_interviewFeedback != null) ...[
                  const SizedBox(height: 20),
                  Card(
                    elevation: 2,
                    color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: const BorderSide(color: Colors.green, width: 1.5),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                '📊 AI Interview Readiness',
                                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.green,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  'Score: ${_interviewFeedback!['overall_score']}%',
                                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                                ),
                              )
                            ],
                          ),
                          const Divider(height: 24),
                          Text('⚙️ Technical Depth: ${_interviewFeedback!['technical_depth']}'),
                          const SizedBox(height: 8),
                          Text('💬 Communication: ${_interviewFeedback!['communication']}'),
                          const SizedBox(height: 8),
                          Text('💡 ATS Tip: ${_interviewFeedback!['suggestions']}'),
                        ],
                      ),
                    ),
                  )
                ]
              ]
            ],
          ),
        ),
      ),
    );
  }
}
