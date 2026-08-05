import urllib.request
import urllib.error
import json

data = {
    'user_id': 1,
    'full_name': 'John Jonson',
    'email': 'johnjonson@email.com',
    'lessons_completed': 31,
    'hours_spent': 15.0,
    'ats_score': 98,
    'skills': {
        'UI/UX Design': 100,
        'FastAPI Backend': 60,
        'Flutter Mobile': 50
    },
    'updated_at': '2026-08-05T12:23:00Z'
}
raw = json.dumps(data).encode('utf-8')

urls = [
    'https://skillsnap-ai-cloud-default-rtdb.firebaseio.com/users/1.json',
    'https://skillsnap-ai-cloud.firebaseio.com/users/1.json',
    'https://skillsnap-ai-cloud-default-rtdb.asia-southeast1.firebasedatabase.app/users/1.json',
    'http://localhost:8000/users/1.json'
]

for url in urls:
    try:
        req = urllib.request.Request(url, data=raw, headers={'Content-Type': 'application/json'}, method='PUT')
        res = urllib.request.urlopen(req)
        print(f"SUCCESS {res.getcode()} for {url}")
        print("   Body:", res.read().decode('utf-8')[:100])
    except urllib.error.HTTPError as e:
        print(f"HTTPError {e.code} for {url}: {e.reason}")
    except Exception as e:
        print(f"Error for {url}: {e}")
