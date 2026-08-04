-- ============================================================
-- SkillSnap AI - Complete Production MySQL Database Schema
-- Run this script in MySQL Workbench or MySQL Command Line
-- ============================================================

CREATE DATABASE IF NOT EXISTS skillsnap_db;
USE skillsnap_db;

-- 1. USERS TABLE
DROP TABLE IF EXISTS user_skills;
DROP TABLE IF EXISTS user_courses;
DROP TABLE IF EXISTS user_progress;
DROP TABLE IF EXISTS mentor_chats;
DROP TABLE IF EXISTS mock_interviews;
DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(80) DEFAULT 'Student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. USER PROGRESS TABLE
CREATE TABLE user_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lessons_completed INT DEFAULT 0,
    hours_spent DECIMAL(5,2) DEFAULT 0.0,
    ats_score INT DEFAULT 90,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. USER SKILLS TABLE
CREATE TABLE user_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    proficiency_percent INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. COURSES TABLE
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    subtitle VARCHAR(200),
    description TEXT,
    lesson_count INT DEFAULT 5,
    rating DECIMAL(3,2) DEFAULT 4.9,
    image_url VARCHAR(255)
);

-- 5. LESSONS TABLE
CREATE TABLE lessons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    lesson_order INT NOT NULL,
    lesson_title VARCHAR(200) NOT NULL,
    lesson_description TEXT,
    video_url VARCHAR(100) NOT NULL,
    duration VARCHAR(20) DEFAULT '15:00',
    is_free TINYINT(1) DEFAULT 1,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 6. USER COURSES ENROLLMENT TABLE
CREATE TABLE user_courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    status VARCHAR(50) DEFAULT 'In Progress',
    progress_percent INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ============================================================
-- SEED DATA INSERTIONS (10 Active Registered Users)
-- ============================================================

INSERT INTO users (id, full_name, email, password, phone_number, role) VALUES
(1, 'John Jonson', 'johnjonson@email.com', 'password123', '+1 555-0199', 'Lead AI Engineer'),
(2, 'Sarah Chen', 'sarah.chen@tech.org', 'password123', '+1 555-0200', 'Mobile App Developer'),
(3, 'Alex Rivera', 'alex.rivera@design.io', 'password123', '+1 555-0201', 'UI/UX Product Designer'),
(4, 'Michael Zhang', 'michael.z@backend.dev', 'password123', '+1 555-0202', 'Backend Specialist'),
(5, 'Emily Watson', 'emily.watson@cloud.com', 'password123', '+1 555-0203', 'DevOps Engineer'),
(6, 'David Patel', 'david.patel@ai.edu', 'password123', '+1 555-0204', 'AI / ML Engineer'),
(7, 'Jessica Taylor', 'jessica.t@web.net', 'password123', '+1 555-0205', 'Frontend React Dev'),
(8, 'Marcus Vance', 'marcus.v@sec.io', 'password123', '+1 555-0206', 'Cybersecurity Analyst'),
(9, 'Priya Sharma', 'priya.s@data.ai', 'password123', '+1 555-0207', 'Data Engineer'),
(10, 'Robert Garcia', 'robert.g@fullstack.dev', 'password123', '+1 555-0208', 'Full-Stack Dev');

INSERT INTO user_progress (user_id, lessons_completed, hours_spent, ats_score) VALUES
(1, 20, 10.0, 94),
(2, 18, 8.5, 91),
(3, 24, 12.0, 96),
(4, 15, 7.5, 88),
(5, 22, 11.0, 95),
(6, 19, 9.5, 92),
(7, 16, 8.0, 89),
(8, 12, 6.0, 86),
(9, 21, 10.5, 93),
(10, 17, 8.5, 90);

INSERT INTO user_skills (user_id, skill_name, proficiency_percent) VALUES
(1, 'UI/UX Design', 75), (1, 'FastAPI Backend', 40), (1, 'Flutter Mobile', 30),
(2, 'UI/UX Design', 65), (2, 'FastAPI Backend', 50), (2, 'Flutter Mobile', 95),
(3, 'UI/UX Design', 98), (3, 'FastAPI Backend', 30), (3, 'Flutter Mobile', 45),
(4, 'UI/UX Design', 40), (4, 'FastAPI Backend', 95), (4, 'Flutter Mobile', 55),
(5, 'UI/UX Design', 55), (5, 'FastAPI Backend', 85), (5, 'Flutter Mobile', 60),
(6, 'UI/UX Design', 50), (6, 'FastAPI Backend', 90), (6, 'Flutter Mobile', 40),
(7, 'UI/UX Design', 85), (7, 'FastAPI Backend', 45), (7, 'Flutter Mobile', 50),
(8, 'UI/UX Design', 35), (8, 'FastAPI Backend', 75), (8, 'Flutter Mobile', 30),
(9, 'UI/UX Design', 45), (9, 'FastAPI Backend', 92), (9, 'Flutter Mobile', 35),
(10, 'UI/UX Design', 70), (10, 'FastAPI Backend', 80), (10, 'Flutter Mobile', 75);

INSERT INTO courses (id, title, subtitle, description, lesson_count, rating, image_url) VALUES
(1, 'FastAPI Backend Architecture', 'Python, Pydantic & WebSockets', 'Learn to connect frontend and mobile apps to FastAPI backends.', 5, 4.90, 'assets/images/course1.png'),
(2, 'Flutter Mobile Cross-Platform', 'Dart, Reactive Layouts & State', 'Build high-performance cross-platform iOS and Android mobile apps.', 5, 4.80, 'assets/images/course2.png'),
(3, 'UI/UX Figma Product Design', 'Auto-Layout, Tokens & WCAG', 'Master modern product UI/UX design systems and micro-interactions.', 5, 4.90, 'assets/images/course3.png');

INSERT INTO lessons (course_id, lesson_order, lesson_title, lesson_description, video_url, duration) VALUES
(1, 1, '1. Introduction to FastAPI & Async Python Event Loops', 'Setting up Python, Uvicorn ASGI server, async def, and event loop execution.', 'tLKKmouUams', '12:30'),
(1, 2, '2. Pydantic v2 Schemas & Request Data Validation', 'Building strict BaseModel data validation schemas with Field and from_attributes.', 'Vj-iLBl7nAc', '18:45'),
(1, 3, '3. SQLAlchemy 2.0 ORM & Async PostgreSQL Integration', 'Connecting FastAPI to relational databases using AsyncSession and Alembic.', '0sOvCWFmrtA', '25:10'),
(1, 4, '4. JWT OAuth2 Authentication & Security Middleware', 'Implementing OAuth2 bearer tokens, bcrypt password hashing, and CORS headers.', 'gQddtTdmG_8', '21:15'),
(1, 5, '5. Real-Time WebSockets & Background Worker Tasks', 'Broadcasting live WebSocket events to mobile clients and processing Celery jobs.', 'vLqTf2b6GZw', '30:00'),

(2, 1, '1. Flutter SDK Setup & Advanced Dart Fundamentals', 'Dart OOP, extension methods, records, patterns, and async/await Futures.', 'pTJJsmejUOQ', '15:00'),
(2, 2, '2. Mobile UI Layouts, Slivers & Custom Scroll View', 'Building complex responsive mobile layouts using SliverAppBar and CustomScrollView.', 'fq4N0hgOWzU', '22:40'),
(2, 3, '3. Reactive State Management with Provider & Riverpod', 'Managing app-wide reactive state using ChangeNotifier and Consumer widgets.', 'x0uinJvhNxI', '28:15'),
(2, 4, '4. REST API Integration, HTTP Client & Networking', 'Connecting Flutter to backend REST endpoints with JSON parsing and error handling.', '1xipg02Wu8s', '19:50'),
(2, 5, '5. Local Persistence with SQLite, Room & Hive DB', 'Storing user preferences and offline database cache using sqflite and Hive.', 'VPvVD8t02U8', '26:30'),

(3, 1, '1. Figma Fundamentals & Auto Layout 5.0 Masterclass', 'Mastering auto-layout gap, padding, wrap layout, and responsive constraints.', 'c9Wg6Cb_YlU', '14:20'),
(3, 2, '2. Design Systems, Color Tokens & Typography Scale', 'Building reusable UI component libraries with Figma Variables and design tokens.', 'HZuk6Wkx_Eg', '20:00'),
(3, 3, '3. Micro-Interactions, Smart Animate & Variants', 'Designing fluid button hover states, modal spring transitions, and interactive prototypes.', 'YqQx75OPRa0', '17:30'),
(3, 4, '4. User Research, Wireframing & Information Architecture', 'Conducting user interviews, mapping user journeys, and building low-fi wireframes.', 'CD1Y2DmL5JM', '24:10'),
(3, 5, '5. WCAG 2.2 Accessibility, Color Contrast & Guidelines', 'Ensuring WCAG AA/AAA accessibility compliance across web and mobile viewports.', 'b24m2nB7b4k', '16:45');

INSERT INTO user_courses (user_id, course_id, status, progress_percent) VALUES
(1, 1, 'In Progress', 75), (1, 2, 'In Progress', 40), (1, 3, 'In Progress', 90),
(2, 1, 'In Progress', 50), (2, 2, 'In Progress', 95), (2, 3, 'In Progress', 65),
(3, 1, 'In Progress', 30), (3, 2, 'In Progress', 45), (3, 3, 'In Progress', 98);

SELECT '✅ SkillSnap AI MySQL Database Schema & Seed Data Successfully Created!' AS Status;
