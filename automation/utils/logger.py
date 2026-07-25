import logging
import os
import sys
from datetime import datetime
from automation.config.config import Config

class AutomationLogger:
    _logger = None

    @classmethod
    def get_logger(cls, name="SkillSnapAutomation"):
        if cls._logger is None:
            Config.ensure_directories()
            cls._logger = logging.getLogger(name)
            cls._logger.setLevel(logging.INFO)
            
            # File Handler (UTF-8)
            log_filename = datetime.now().strftime("execution_%Y%m%d_%H%M%S.log")
            log_path = os.path.join(Config.LOGS_DIR, log_filename)
            file_handler = logging.FileHandler(log_path, encoding='utf-8')
            file_handler.setLevel(logging.INFO)
            
            # Console Handler
            if hasattr(sys.stdout, 'reconfigure'):
                try:
                    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
                except Exception:
                    pass
            console_handler = logging.StreamHandler(sys.stdout)
            console_handler.setLevel(logging.INFO)
            
            # Formatter
            formatter = logging.Formatter(
                '[%(asctime)s] [%(levelname)s] [%(name)s]: %(message)s',
                datefmt='%Y-%m-%d %H:%M:%S'
            )
            file_handler.setFormatter(formatter)
            console_handler.setFormatter(formatter)
            
            cls._logger.addHandler(file_handler)
            cls._logger.addHandler(console_handler)
            
        return cls._logger
