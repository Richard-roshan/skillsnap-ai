import mysql.connector
import sqlite3
import os

SQL_FILE = "skillsnap_db_schema.sql"

def run_mysql_setup():
    print("Connecting to local MySQL server on localhost:3306...")
    try:
        # Try connecting to MySQL
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="password"  # Common default passwords: root, password, or empty
        )
        cursor = conn.cursor()
        print("Connected to MySQL Server! Executing schema script...")
        
        with open(SQL_FILE, "r", encoding="utf-8") as f:
            sql_statements = f.read().split(";")
            
        for stmt in sql_statements:
            stmt = stmt.strip()
            if stmt:
                try:
                    cursor.execute(stmt)
                except Exception as ex:
                    print(f"Executing statement notice: {ex}")
                    
        conn.commit()
        cursor.close()
        conn.close()
        print("SUCCESS: MySQL Database 'skillsnap_db' initialized successfully!")
        return True
    except Exception as e:
        print(f"MySQL Connection Notice: {e}")
        return False

def run_sqlite_setup():
    print("Setting up local SQLite fallback database (skillsnap.db)...")
    try:
        conn = sqlite3.connect("skillsnap.db")
        cursor = conn.cursor()
        
        cursor.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, full_name TEXT, email TEXT, role TEXT);")
        cursor.execute("CREATE TABLE IF NOT EXISTS user_progress (id INTEGER PRIMARY KEY, user_id INTEGER, lessons_completed INTEGER, hours_spent REAL, ats_score INTEGER);")
        
        # Populate SQLite users
        users = [
            (1, 'John Jonson', 'johnjonson@email.com', 'Lead AI Engineer'),
            (2, 'Sarah Chen', 'sarah.chen@tech.org', 'Mobile App Developer'),
            (3, 'Alex Rivera', 'alex.rivera@design.io', 'UI/UX Product Designer'),
            (4, 'Michael Zhang', 'michael.z@backend.dev', 'Backend Specialist'),
            (5, 'Emily Watson', 'emily.watson@cloud.com', 'DevOps Engineer'),
            (6, 'David Patel', 'david.patel@ai.edu', 'AI / ML Engineer'),
            (7, 'Jessica Taylor', 'jessica.t@web.net', 'Frontend React Dev'),
            (8, 'Marcus Vance', 'marcus.v@sec.io', 'Cybersecurity Analyst'),
            (9, 'Priya Sharma', 'priya.s@data.ai', 'Data Engineer'),
            (10, 'Robert Garcia', 'robert.g@fullstack.dev', 'Full-Stack Dev')
        ]
        
        for u in users:
            cursor.execute("INSERT OR REPLACE INTO users (id, full_name, email, role) VALUES (?, ?, ?, ?);", u)
            
        conn.commit()
        conn.close()
        print("SUCCESS: Local Database 'skillsnap.db' initialized with 10 user records!")
    except Exception as e:
        print(f"SQLite error: {e}")

if __name__ == "__main__":
    if not run_mysql_setup():
        run_sqlite_setup()
