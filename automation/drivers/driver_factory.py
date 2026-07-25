from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from automation.config.config import Config
from automation.utils.logger import AutomationLogger

logger = AutomationLogger.get_logger()

class DriverFactory:
    @staticmethod
    def get_driver(headless=None):
        if headless is None:
            headless = Config.HEADLESS
            
        options = ChromeOptions()
        if headless:
            options.add_argument("--headless=new")
        
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--disable-notifications")
        options.add_argument("--disable-extensions")
        options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        
        # Logging capability for browser console logs
        options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})
        
        driver = webdriver.Chrome(options=options)
        driver.set_page_load_timeout(Config.PAGE_LOAD_TIMEOUT)
        driver.implicitly_wait(Config.IMPLICIT_WAIT)
        driver.maximize_window()
        
        logger.info(f"Initialized Chrome Driver (Headless: {headless})")
        return driver
