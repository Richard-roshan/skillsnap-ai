from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

class SettingsPage(BasePage):
    BACKEND_URL_INPUT = (By.ID, "setting-backend-url")
    TEST_BACKEND_BTN = (By.XPATH, "//button[contains(text(),'Test API Connection')]")
    BACKEND_STATUS_TEXT = (By.ID, "backend-status-text")
    PRIMARY_COLOR_PICKER = (By.ID, "setting-primary-color")
    RESET_SETTINGS_BTN = (By.XPATH, "//button[contains(text(),'Reset Settings')]")

    def test_backend_connection(self, url=None):
        if url:
            self.send_keys(self.BACKEND_URL_INPUT, url)
        self.click(self.TEST_BACKEND_BTN)

    def get_backend_status(self):
        return self.get_text(self.BACKEND_STATUS_TEXT)
