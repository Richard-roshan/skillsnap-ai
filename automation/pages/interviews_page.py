from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

class InterviewsPage(BasePage):
    ROLE_FULLSTACK_BTN = (By.XPATH, "//button[contains(text(),'Full Stack Engineer')]")
    ROLE_DESIGNER_BTN = (By.XPATH, "//button[contains(text(),'UI/UX Designer')]")
    ROLE_PM_BTN = (By.XPATH, "//button[contains(text(),'Product Manager')]")
    ROLE_BADGE = (By.ID, "interview-role-badge")
    QUESTION_TEXT = (By.ID, "interview-question-text")
    ANSWER_INPUT = (By.ID, "interview-answer-input")
    SIMULATE_SPEECH_BTN = (By.XPATH, "//button[contains(text(),'Simulate Speech')]")
    SUBMIT_ANSWER_BTN = (By.XPATH, "//button[contains(text(),'Submit Answer')]")
    FEEDBACK_BOX = (By.ID, "interview-feedback-box")
    AI_SCORE = (By.ID, "ai-interview-score")
    AI_FEEDBACK_TEXT = (By.ID, "ai-interview-feedback-text")

    def select_role(self, role):
        roles = {
            "fullstack": self.ROLE_FULLSTACK_BTN,
            "designer": self.ROLE_DESIGNER_BTN,
            "pm": self.ROLE_PM_BTN
        }
        if role in roles:
            self.click(roles[role])

    def record_speech(self):
        self.click(self.SIMULATE_SPEECH_BTN)

    def submit_answer(self, text=None):
        if text:
            self.send_keys(self.ANSWER_INPUT, text)
        self.click(self.SUBMIT_ANSWER_BTN)
