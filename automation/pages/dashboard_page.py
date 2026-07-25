from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

class DashboardPage(BasePage):
    # Locators
    BRAND_LOGO = (By.CLASS_NAME, "brand-logo")
    BRAND_TITLE = (By.CLASS_NAME, "brand-title")
    GLOBAL_SEARCH = (By.ID, "global-search")
    ASSISTANT_BTN = (By.CLASS_NAME, "assistant-btn")
    THEME_TOGGLE_BTN = (By.ID, "theme-toggle-btn")
    NOTIFICATION_BTN = (By.CSS_SELECTOR, "button[title='Notifications']")
    USER_NAME = (By.CLASS_NAME, "user-name")
    
    # Navigation Tabs
    TAB_DASHBOARD = (By.ID, "tab-dashboard")
    TAB_MENTORSHIP = (By.ID, "tab-mentorship")
    TAB_COURSES = (By.ID, "tab-courses")
    TAB_INTERVIEWS = (By.ID, "tab-interviews")
    TAB_SETTINGS = (By.ID, "tab-settings")
    
    # Content Cards
    VIEW_DASHBOARD = (By.ID, "view-dashboard")
    TAKE_QUIZ_BTN = (By.XPATH, "//button[contains(text(),'Take Skill Quiz')]")
    SKILL_UIUX_VAL = (By.ID, "skill-val-uiux")
    SKILL_MGMT_VAL = (By.ID, "skill-val-mgmt")
    LESSONS_STAT = (By.ID, "stat-lessons-val")
    HOURS_CHART = (By.ID, "hoursChart")
    
    # Assistant Chat Modal
    CHAT_MODAL = (By.ID, "chat-modal")
    CHAT_INPUT = (By.ID, "chat-input")
    CHAT_SEND_BTN = (By.XPATH, "//button[contains(text(),'Send')]")
    CHAT_MESSAGES = (By.ID, "chat-messages-container")

    def toggle_theme(self):
        self.click(self.THEME_TOGGLE_BTN)

    def search(self, query):
        self.send_keys(self.GLOBAL_SEARCH, query)

    def switch_to_tab(self, tab_name):
        tabs = {
            "dashboard": self.TAB_DASHBOARD,
            "mentorship": self.TAB_MENTORSHIP,
            "courses": self.TAB_COURSES,
            "interviews": self.TAB_INTERVIEWS,
            "settings": self.TAB_SETTINGS
        }
        if tab_name in tabs:
            self.click(tabs[tab_name])

    def open_assistant(self):
        self.click(self.ASSISTANT_BTN)

    def send_chat_message(self, message):
        self.send_keys(self.CHAT_INPUT, message)
        self.click(self.CHAT_SEND_BTN)

    def take_skill_quiz(self):
        self.click(self.TAKE_QUIZ_BTN)
