# Troubleshooting Guide — SkillSnap AI Selenium Framework & CI/CD

## 🔍 Common Issues & Solutions

### 1. Deployment Verification Fails (HTTP Status != 200)
- **Symptom**: `deployment_verifier.py` outputs HTTP status 404 or connection error.
- **Cause**: GitHub Pages build has not finished propagating or DNS is taking time.
- **Solution**: Re-run the workflow or increase the propagation wait time in Stage 6 of `.github/workflows/deploy-and-test.yml`.

---

### 2. Chrome WebDriver Launch Error
- **Symptom**: `selenium.common.exceptions.WebDriverException: Message: unknown error: cannot find Chrome binary`.
- **Cause**: Google Chrome or ChromeDriver is not installed in the local environment.
- **Solution**: Install Google Chrome or ensure `HEADLESS=true` is set. On GitHub Actions `ubuntu-latest`, Chrome is pre-installed.

---

### 3. Workflow Fails due to Pass Percentage < 95%
- **Symptom**: `E2ETestRunner` outputs `Pass rate is below required threshold (95.0%). Failing run.`
- **Cause**: One or more critical page elements failed visibility or interaction assertions.
- **Solution**: Inspect the uploaded `live-e2e-test-reports` artifact in GitHub Actions. Check `Test Results/Screenshots/` and `Test Results/Logs/` to identify the failing test case and reason.

---

### 4. Excel File Format Error or Missing openpyxl
- **Symptom**: `ModuleNotFoundError: No module named 'openpyxl'`.
- **Cause**: Python package dependencies were not installed.
- **Solution**: Execute `pip install openpyxl requests beautifulsoup4 selenium`.

---

### 5. Permission Denied on GitHub Pages Deployment
- **Symptom**: `Error: Deployment to GitHub Pages failed with HTTP 403 Forbidden`.
- **Cause**: Missing `pages: write` or `id-token: write` permissions in workflow permissions block.
- **Solution**: Verify permissions in `.github/workflows/deploy-and-test.yml`.
