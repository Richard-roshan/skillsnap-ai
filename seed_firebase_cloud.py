import json
import urllib.request
import datetime

FIREBASE_URLS = [
    "http://localhost:8000/users.json",
    "https://skillsnap-ai-cloud-default-rtdb.firebaseio.com/users.json",
    "https://skillsnap-ai-cloud.firebaseio.com/users.json"
]

USERS_DATA = {
    "1": {
        "user_id": 1,
        "full_name": "John Jonson",
        "email": "johnjonson@email.com",
        "role": "Lead AI Engineer",
        "lessons_completed": 20,
        "hours_spent": 10.0,
        "ats_score": 94,
        "skills": {
            "UI/UX Design": 90,
            "FastAPI Backend": 80,
            "Flutter Mobile": 75
        },
        "profile": {
            "full_name": "John Jonson",
            "email": "johnjonson@email.com"
        },
        "chat_messages": [
            { "sender": "user", "text": "How do I optimize FastAPI backend endpoints?" },
            { "sender": "assistant", "text": "Utilize async def for I/O bound database & network calls in FastAPI." }
        ],
        "updated_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    },
    "2": {
        "user_id": 2,
        "full_name": "Sarah Chen",
        "email": "sarah.chen@tech.org",
        "role": "Mobile App Developer",
        "lessons_completed": 18,
        "hours_spent": 8.5,
        "ats_score": 91,
        "skills": {
            "UI/UX Design": 65,
            "FastAPI Backend": 50,
            "Flutter Mobile": 95
        },
        "profile": {
            "full_name": "Sarah Chen",
            "email": "sarah.chen@tech.org"
        },
        "updated_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    },
    "3": {
        "user_id": 3,
        "full_name": "Alex Rivera",
        "email": "alex.rivera@design.io",
        "role": "UI/UX Product Designer",
        "lessons_completed": 24,
        "hours_spent": 12.0,
        "ats_score": 96,
        "skills": {
            "UI/UX Design": 98,
            "FastAPI Backend": 30,
            "Flutter Mobile": 45
        },
        "profile": {
            "full_name": "Alex Rivera",
            "email": "alex.rivera@design.io"
        },
        "updated_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    },
    "4": {
        "user_id": 4,
        "full_name": "Michael Zhang",
        "email": "michael.z@backend.dev",
        "role": "Backend Specialist",
        "lessons_completed": 15,
        "hours_spent": 7.5,
        "ats_score": 88,
        "skills": {
            "UI/UX Design": 40,
            "FastAPI Backend": 95,
            "Flutter Mobile": 55
        },
        "updated_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    },
    "5": {
        "user_id": 5,
        "full_name": "Emily Watson",
        "email": "emily.watson@cloud.com",
        "role": "DevOps Engineer",
        "lessons_completed": 22,
        "hours_spent": 11.0,
        "ats_score": 95,
        "skills": {
            "UI/UX Design": 55,
            "FastAPI Backend": 85,
            "Flutter Mobile": 60
        },
        "updated_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    },
    "6": {
        "user_id": 6,
        "full_name": "David Patel",
        "email": "david.patel@ai.edu",
        "role": "AI / ML Engineer",
        "lessons_completed": 19,
        "hours_spent": 9.5,
        "ats_score": 92,
        "skills": {
            "UI/UX Design": 50,
            "FastAPI Backend": 90,
            "Flutter Mobile": 40
        },
        "updated_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    },
    "7": {
        "user_id": 7,
        "full_name": "Jessica Taylor",
        "email": "jessica.t@web.net",
        "role": "Frontend React Dev",
        "lessons_completed": 16,
        "hours_spent": 8.0,
        "ats_score": 89,
        "skills": {
            "UI/UX Design": 85,
            "FastAPI Backend": 45,
            "Flutter Mobile": 50
        },
        "updated_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    },
    "8": {
        "user_id": 8,
        "full_name": "Marcus Vance",
        "email": "marcus.v@sec.io",
        "role": "Cybersecurity Analyst",
        "lessons_completed": 12,
        "hours_spent": 6.0,
        "ats_score": 86,
        "skills": {
            "UI/UX Design": 35,
            "FastAPI Backend": 75,
            "Flutter Mobile": 30
        },
        "updated_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    },
    "9": {
        "user_id": 9,
        "full_name": "Priya Sharma",
        "email": "priya.s@data.ai",
        "role": "Data Engineer",
        "lessons_completed": 21,
        "hours_spent": 10.5,
        "ats_score": 93,
        "skills": {
            "UI/UX Design": 45,
            "FastAPI Backend": 92,
            "Flutter Mobile": 35
        },
        "updated_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    },
    "10": {
        "user_id": 10,
        "full_name": "Robert Garcia",
        "email": "robert.g@fullstack.dev",
        "role": "Full-Stack Dev",
        "lessons_completed": 17,
        "hours_spent": 8.5,
        "ats_score": 90,
        "skills": {
            "UI/UX Design": 70,
            "FastAPI Backend": 80,
            "Flutter Mobile": 75
        },
        "updated_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }
}

def seed_firebase():
    data_bytes = json.dumps(USERS_DATA).encode("utf-8")
    for url in FIREBASE_URLS:
        print(f"Attempting to seed database at: {url}...")
        req = urllib.request.Request(
            url,
            data=data_bytes,
            headers={"Content-Type": "application/json"},
            method="PUT"
        )
        try:
            with urllib.request.urlopen(req) as response:
                res_body = response.read().decode("utf-8")
                print(f"SUCCESS: Successfully seeded database at {url}!")
                print(f"Response Code: {response.status}")
        except Exception as e:
            print(f"Notice for {url}: {e}")

if __name__ == "__main__":
    seed_firebase()
