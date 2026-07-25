from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

class MentorshipPage(BasePage):
    # Subpills
    SUBPILL_ATS = (By.ID, "subpill-ats")
    SUBPILL_BUILDER = (By.ID, "subpill-builder")
    
    # ATS Mode Elements
    RESUME_TEXT_INPUT = (By.ID, "resume-text-input")
    RESUME_FILE_INPUT = (By.ID, "resume-file-input")
    ANALYZE_BTN = (By.XPATH, "//button[contains(text(),'Analyze Resume')]")
    SCORE_ATS = (By.ID, "score-ats")
    SCORE_GRAMMAR = (By.ID, "score-grammar")
    SCORE_KEYWORDS = (By.ID, "score-keywords")
    SCORE_FORMATTING = (By.ID, "score-formatting")
    OVERALL_ATS_BADGE = (By.ID, "overall-ats-badge")
    
    # Builder Mode Elements
    BUILDER_NAME = (By.ID, "builder-name")
    BUILDER_TITLE = (By.ID, "builder-title")
    BUILDER_CONTACT = (By.ID, "builder-contact")
    BUILDER_SUMMARY = (By.ID, "builder-summary")
    GENERATE_SUMMARY_BTN = (By.XPATH, "//button[contains(text(),'AI Generate')]")
    PRINT_PDF_BTN = (By.XPATH, "//button[contains(text(),'Export Resume PDF')]")
    
    # Preview Elements
    PV_NAME = (By.ID, "pv-name")
    PV_TITLE = (By.ID, "pv-title")
    PV_SUMMARY = (By.ID, "pv-summary")

    def switch_mode(self, mode="ats"):
        if mode == "ats":
            self.click(self.SUBPILL_ATS)
        else:
            self.click(self.SUBPILL_BUILDER)

    def analyze_text(self, text):
        self.send_keys(self.RESUME_TEXT_INPUT, text)
        self.click(self.ANALYZE_BTN)

    def upload_resume_file(self, filepath):
        file_input = self.find(self.RESUME_FILE_INPUT)
        file_input.send_keys(filepath)

    def fill_builder_form(self, name, title, contact, summary):
        self.send_keys(self.BUILDER_NAME, name)
        self.send_keys(self.BUILDER_TITLE, title)
        self.send_keys(self.BUILDER_CONTACT, contact)
        self.send_keys(self.BUILDER_SUMMARY, summary)

    def generate_ai_summary(self):
        self.click(self.GENERATE_SUMMARY_BTN)
