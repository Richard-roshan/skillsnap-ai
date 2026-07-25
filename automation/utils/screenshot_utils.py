import os
from datetime import datetime
from automation.config.config import Config
from automation.utils.logger import AutomationLogger

logger = AutomationLogger.get_logger()

class ScreenshotUtils:
    @staticmethod
    def capture_screenshot(driver, test_name):
        """
        Captures screenshot and returns relative or absolute path.
        """
        try:
            Config.ensure_directories()
            clean_test_name = "".join([c if c.isalnum() else "_" for c in test_name])
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:20]
            filename = f"FAIL_{clean_test_name}_{timestamp}.png"
            filepath = os.path.join(Config.SCREENSHOTS_DIR, filename)
            
            driver.save_screenshot(filepath)
            logger.info(f"Screenshot captured for test '{test_name}': {filepath}")
            return filepath
        except Exception as e:
            logger.error(f"Failed to capture screenshot for '{test_name}': {str(e)}")
            return ""
