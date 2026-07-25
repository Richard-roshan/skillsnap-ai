from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from automation.config.config import Config
from automation.utils.logger import AutomationLogger

logger = AutomationLogger.get_logger()

class BasePage:
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, Config.EXPLICIT_WAIT)

    def navigate_to(self, url=None):
        target_url = url or Config.BASE_URL
        logger.info(f"Navigating to: {target_url}")
        self.driver.get(target_url)

    def find(self, locator):
        return self.wait.until(EC.presence_of_element_located(locator))

    def find_visible(self, locator):
        return self.wait.until(EC.visibility_of_element_located(locator))

    def find_all(self, locator):
        return self.driver.find_elements(*locator)

    def click(self, locator):
        element = self.wait.until(EC.element_to_be_clickable(locator))
        element.click()
        logger.info(f"Clicked element with locator: {locator}")

    def send_keys(self, locator, text):
        element = self.find_visible(locator)
        element.clear()
        element.send_keys(text)
        logger.info(f"Entered text into {locator}")

    def get_text(self, locator):
        element = self.find_visible(locator)
        return element.text.strip()

    def is_displayed(self, locator):
        try:
            return self.find_visible(locator).is_displayed()
        except TimeoutException:
            return False

    def get_page_title(self):
        return self.driver.title

    def get_current_url(self):
        return self.driver.current_url

    def get_browser_logs(self):
        try:
            logs = self.driver.get_log('browser')
            return [log['message'] for log in logs if 'SEVERE' in log.get('level', '') or 'ERROR' in log.get('level', '')]
        except Exception:
            return []
