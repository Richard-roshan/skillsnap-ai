import os

class Config:
    """
    Centralized configuration management for SkillSnap AI Selenium Automation Framework.
    """
    BASE_URL = os.getenv("BASE_URL", "https://Richard-roshan.github.io/skillsnap-ai/").rstrip("/") + "/"
    HEADLESS = os.getenv("HEADLESS", "true").lower() == "true"
    BROWSER = os.getenv("BROWSER", "chrome").lower()
    IMPLICIT_WAIT = int(os.getenv("IMPLICIT_WAIT", "10"))
    EXPLICIT_WAIT = int(os.getenv("EXPLICIT_WAIT", "15"))
    PAGE_LOAD_TIMEOUT = int(os.getenv("PAGE_LOAD_TIMEOUT", "30"))
    
    ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    REPORTS_DIR = os.path.join(ROOT_DIR, "..", "Test Results")
    EXCEL_REPORTS_DIR = os.path.join(REPORTS_DIR, "Excel")
    HTML_REPORTS_DIR = os.path.join(REPORTS_DIR, "HTML")
    SCREENSHOTS_DIR = os.path.join(REPORTS_DIR, "Screenshots")
    LOGS_DIR = os.path.join(REPORTS_DIR, "Logs")
    JSON_REPORTS_DIR = os.path.join(REPORTS_DIR, "JSON")
    SUMMARY_DIR = os.path.join(REPORTS_DIR, "Summary")
    
    @classmethod
    def ensure_directories(cls):
        for directory in [
            cls.REPORTS_DIR, cls.EXCEL_REPORTS_DIR, cls.HTML_REPORTS_DIR,
            cls.SCREENSHOTS_DIR, cls.LOGS_DIR, cls.JSON_REPORTS_DIR, cls.SUMMARY_DIR
        ]:
            os.makedirs(directory, exist_ok=True)
