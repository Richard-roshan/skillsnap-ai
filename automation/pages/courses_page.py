from selenium.webdriver.common.by import By
from automation.pages.base_page import BasePage

class CoursesPage(BasePage):
    PLAYER_TITLE = (By.ID, "player-title")
    PLAY_ICON = (By.ID, "play-icon")
    PLAY_BTN = (By.XPATH, "//button[contains(@onclick, 'toggleVideoPlayback')]")
    COMPLETE_BTN = (By.XPATH, "//button[contains(text(),'Mark Lesson Complete')]")
    LESSON_ITEMS = (By.CLASS_NAME, "lesson-item")
    LESSON_HEADER_TITLE = (By.ID, "lesson-header-title")
    LESSON_DESC = (By.ID, "lesson-desc")

    def toggle_play(self):
        self.click(self.PLAY_BTN)

    def mark_complete(self):
        self.click(self.COMPLETE_BTN)

    def select_lesson_by_index(self, index):
        lessons = self.find_all(self.LESSON_ITEMS)
        if 0 <= index < len(lessons):
            lessons[index].click()
