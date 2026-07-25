from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

class AuthPage(BasePage):
    USER_AVATAR = (By.CLASS_NAME, "user-avatar")
    USER_GREETING = (By.CLASS_NAME, "user-greeting")
    USER_NAME = (By.CLASS_NAME, "user-name")

    def get_logged_in_user(self):
        return self.get_text(self.USER_NAME)
