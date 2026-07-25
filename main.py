from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import mysql.connector

app = FastAPI()

# CORS for Flutter
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MySQL Connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root123",
    database="skillsnap_db"
)

cursor = db.cursor(dictionary=True)

# Request Models
class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    phone_number: str
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# REGISTER API
@app.post("/register")
def register(request: RegisterRequest):

    # Check existing email
    check_query = "SELECT * FROM users WHERE email=%s"
    cursor.execute(check_query, (request.email,))
    existing_user = cursor.fetchone()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    # Insert user
    insert_query = """
    INSERT INTO users(full_name, email, phone_number, password)
    VALUES(%s, %s, %s, %s)
    """

    values = (
        request.full_name,
        request.email,
        request.phone_number,
        request.password
    )

    cursor.execute(insert_query, values)
    db.commit()

    return {
        "message": "User registered successfully"
    }


# LOGIN API
@app.post("/login")
def login(request: LoginRequest):

    query = """
    SELECT * FROM users
    WHERE email=%s AND password=%s
    """

    values = (
        request.email,
        request.password
    )

    cursor.execute(query, values)

    user = cursor.fetchone()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "message": "Login successful",
        "user": {
            "id": user["id"],
            "full_name": user["full_name"],
            "email": user["email"],
            "phone_number": user["phone_number"]
        }
    }


def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root123",
        database="skillsnap_db"
    )

@app.get("/home/dashboard/{user_id}")
def get_home_dashboard(user_id: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    # User profile
    cursor.execute(
        "SELECT id, full_name, avatar_url FROM users WHERE id = %s",
        (user_id,)
    )
    user = cursor.fetchone()
    if not user:
        cursor.close()
        db.close()
        raise HTTPException(status_code=404, detail="User not found")

    # Stats
    cursor.execute(
        """
        SELECT lessons_completed, hours_spent
        FROM user_stats
        WHERE user_id = %s
        ORDER BY updated_at DESC
        LIMIT 1
        """,
        (user_id,)
    )
    stats = cursor.fetchone() or {"lessons_completed": 0, "hours_spent": 0}

    # Skills
    cursor.execute(
        """
        SELECT s.skill_name, us.progress_percent
        FROM user_skills us
        JOIN skills s ON us.skill_id = s.id
        WHERE us.user_id = %s
        ORDER BY us.id ASC
        """,
        (user_id,)
    )
    skills = cursor.fetchall()

    # Courses
    cursor.execute(
        """
        SELECT id, title, subtitle, image_url, lesson_count, rating, action_text
        FROM courses
        ORDER BY id DESC
        LIMIT 2
        """
    )
    courses = cursor.fetchall()

    # Career paths
    cursor.execute(
        """
        SELECT cp.id, cp.title, cp.match_percent, cp.demand_level, cp.icon_url
        FROM user_career_matches ucm
        JOIN career_paths cp ON ucm.career_path_id = cp.id
        WHERE ucm.user_id = %s
        ORDER BY ucm.match_percent DESC
        LIMIT 3
        """,
        (user_id,)
    )
    career_paths = cursor.fetchall()

    cursor.close()
    db.close()

    return {
        "user": user,
        "stats": stats,
        "skills": skills,
        "courses": courses,
        "career_paths": career_paths
    }


@app.get("/mentorship/dashboard/{user_id}")
def get_mentorship_dashboard(user_id: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    # User
    cursor.execute(
        "SELECT id, full_name, avatar_url FROM users WHERE id = %s",
        (user_id,)
    )
    user = cursor.fetchone()
    if not user:
        cursor.close()
        db.close()
        raise HTTPException(status_code=404, detail="User not found")

    # Latest resume
    cursor.execute(
        """
        SELECT id, resume_name, resume_file_url, ats_score
        FROM resumes
        WHERE user_id = %s
        ORDER BY uploaded_at DESC
        LIMIT 1
        """,
        (user_id,)
    )
    resume = cursor.fetchone()

    # Latest resume analysis
    resume_analysis = None
    if resume:
        cursor.execute(
            """
            SELECT ats_score, grammar_score, keyword_score, formatting_score,
                   strengths, weaknesses, suggestions
            FROM resume_analysis
            WHERE resume_id = %s
            ORDER BY analyzed_at DESC
            LIMIT 1
            """,
            (resume["id"],)
        )
        resume_analysis = cursor.fetchone()

    # Recommended career paths
    cursor.execute(
        """
        SELECT cp.id, cp.title, cp.match_percent, cp.demand_level, cp.icon_url
        FROM user_career_matches ucm
        JOIN career_paths cp ON ucm.career_path_id = cp.id
        WHERE ucm.user_id = %s
        ORDER BY ucm.match_percent DESC
        LIMIT 3
        """,
        (user_id,)
    )
    career_paths = cursor.fetchall()

    # Mock interview summary
    cursor.execute(
        """
        SELECT score, feedback, created_at
        FROM mock_interviews
        WHERE user_id = %s
        ORDER BY created_at DESC
        LIMIT 1
        """,
        (user_id,)
    )
    mock_interview = cursor.fetchone()

    # Mentor chat count
    cursor.execute(
        """
        SELECT COUNT(*) AS chat_count
        FROM mentor_chats
        WHERE user_id = %s
        """,
        (user_id,)
    )
    mentor_chat_count = cursor.fetchone()

    cursor.close()
    db.close()

    return {
        "user": user,
        "resume": resume if resume else {
            "resume_name": "No resume uploaded",
            "resume_file_url": None,
            "ats_score": 0
        },
        "resume_analysis": resume_analysis if resume_analysis else {
            "ats_score": 0,
            "grammar_score": 0,
            "keyword_score": 0,
            "formatting_score": 0,
            "strengths": "",
            "weaknesses": "",
            "suggestions": ""
        },
        "career_paths": career_paths,
        "mock_interview": mock_interview,
        "mentor_chat_count": mentor_chat_count["chat_count"] if mentor_chat_count else 0
    }


@app.get("/my-courses/{user_id}")
def get_my_courses(user_id: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT 
            uc.id AS user_course_id,
            uc.user_id,
            uc.course_id,
            uc.status,
            uc.progress_percent,
            c.title,
            c.subtitle,
            c.description,
            c.image_url,
            c.lesson_count,
            c.rating
        FROM user_courses uc
        JOIN courses c ON uc.course_id = c.id
        WHERE uc.user_id = %s
        ORDER BY uc.updated_at DESC
        """,
        (user_id,)
    )

    courses = cursor.fetchall()
    cursor.close()
    db.close()

    return {"courses": courses}


@app.get("/courses/{course_id}/lessons")
def get_course_lessons(course_id: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            id,
            course_id,
            lesson_title,
            lesson_description,
            video_url,
            thumbnail_url,
            duration,
            lesson_order,
            is_free
        FROM course_lessons
        WHERE course_id = %s
        ORDER BY lesson_order ASC
        """,
        (course_id,)
    )

    lessons = cursor.fetchall()
    cursor.close()
    db.close()

    return {"lessons": lessons}