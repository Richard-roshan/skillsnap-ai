@echo off
echo Starting SkillSnap AI Server and Permanent Tunnel...
start /b python main.py
timeout /t 2 >nul
npx -y localtunnel --port 8000 --subdomain skillsnap-ai
