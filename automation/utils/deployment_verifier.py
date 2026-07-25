import sys
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from automation.config.config import Config
from automation.utils.logger import AutomationLogger

logger = AutomationLogger.get_logger()

def check_asset_url(asset_url):
    try:
        # Try HEAD first, fallback to GET if 405 or non-200
        res = requests.head(asset_url, timeout=10, allow_redirects=True)
        if res.status_code in [200, 301, 302, 304]:
            return res.status_code
        res = requests.get(asset_url, timeout=10, allow_redirects=True)
        return res.status_code
    except Exception:
        return 500

def verify_deployment(url=None):
    target_url = url or Config.BASE_URL
    logger.info(f"--- STARTING DEPLOYMENT VERIFICATION AGAINST: {target_url} ---")
    
    diagnostics = {
        "url": target_url,
        "http_status": None,
        "css_status": [],
        "js_status": [],
        "dom_rendered": False,
        "errors": []
    }

    try:
        response = None
        for attempt in range(1, 7):
            try:
                response = requests.get(target_url, timeout=15)
                if response.status_code == 200:
                    break
                logger.warning(f"Attempt {attempt}/6: Live deployment returned HTTP {response.status_code}. Retrying in 5 seconds...")
            except Exception as e:
                logger.warning(f"Attempt {attempt}/6 request error: {str(e)}. Retrying in 5 seconds...")
            time.sleep(5)

        if not response or response.status_code != 200:
            diagnostics["http_status"] = response.status_code if response else "NO_RESPONSE"
            diagnostics["errors"].append(f"HTTP status code returned {diagnostics['http_status']} instead of 200 after retries.")
            print_diagnostics_and_exit(diagnostics, False)

        diagnostics["http_status"] = response.status_code
        logger.info(f"Main Page HTTP Status Code: {response.status_code}")

        # Parse HTML for CSS and JS assets
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Verify CSS assets
        css_links = [link.get('href') for link in soup.find_all('link', rel=lambda r: r and 'stylesheet' in r)]
        for css in css_links:
            if not css:
                continue
            asset_url = urljoin(target_url, css)
            status = check_asset_url(asset_url)
            diagnostics["css_status"].append({"url": asset_url, "status": status})
            if status not in [200, 301, 302, 304]:
                diagnostics["errors"].append(f"Failed to load CSS asset: {asset_url} (HTTP {status})")

        # Verify JS assets
        js_scripts = [script.get('src') for script in soup.find_all('script') if script.get('src')]
        for js in js_scripts:
            asset_url = urljoin(target_url, js)
            status = check_asset_url(asset_url)
            diagnostics["js_status"].append({"url": asset_url, "status": status})
            if status not in [200, 301, 302, 304]:
                diagnostics["errors"].append(f"Failed to load JS asset: {asset_url} (HTTP {status})")

        # Verify DOM structure
        content_lower = response.text.lower()
        if ("skillsnap" in content_lower or "learning" in content_lower) and "</html" in content_lower:
            diagnostics["dom_rendered"] = True
            logger.info("DOM structural check passed.")
        else:
            diagnostics["errors"].append("DOM rendering check failed: SkillSnap branding or valid HTML end tags missing.")

    except Exception as e:
        diagnostics["errors"].append(f"Deployment verification exception: {str(e)}")

    success = len(diagnostics["errors"]) == 0
    print_diagnostics_and_exit(diagnostics, success)

def print_diagnostics_and_exit(diagnostics, success):
    print("\n================ DEPLOYMENT DIAGNOSTICS ================")
    print(f"Target URL:         {diagnostics['url']}")
    print(f"HTTP Status:        {diagnostics['http_status']}")
    print(f"DOM Rendered:       {diagnostics['dom_rendered']}")
    print(f"CSS Assets Checked: {len(diagnostics['css_status'])}")
    print(f"JS Assets Checked:  {len(diagnostics['js_status'])}")
    
    if diagnostics["errors"]:
        print("\nERRORS DETECTED:")
        for err in diagnostics["errors"]:
            print(f"  ❌ {err}")
        print("========================================================\n")
        sys.exit(1)
    else:
        print("\n✅ DEPLOYMENT VERIFICATION PASSED SUCCESSFULLY!")
        print("========================================================\n")

if __name__ == "__main__":
    url_arg = sys.argv[1] if len(sys.argv) > 1 else None
    verify_deployment(url_arg)
