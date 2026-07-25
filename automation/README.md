# SkillSnap AI - Enterprise Selenium E2E Automation Framework & CI/CD Pipeline

## 🚀 Overview

This repository contains the complete enterprise-grade CI/CD pipeline and automated Selenium testing framework for **SkillSnap AI**.

The solution automatically:
1. Builds the web application.
2. Deploys it to **GitHub Pages**.
3. Verifies deployment availability (HTTP 200, CSS/JS asset resolution, DOM rendering).
4. Executes **440 automated E2E Selenium tests** against the **LIVE** GitHub Pages URL (`BASE_URL`).
5. Generates 4 formatted **Excel Workbooks**, interactive **HTML dashboards**, **JSON results**, and **GitHub Step Summaries**.
6. Uploads all test evidence and reports as GitHub Actions artifacts retained for **30 days**.

---

## 📁 Folder Structure

```
automation/
│
├── config/
│   └── config.py                 # Centralized environment & timeout configurations
├── drivers/
│   └── driver_factory.py         # Headless Chrome WebDriver setup
├── pages/                        # Page Object Model (POM) Design Pattern
│   ├── base_page.py
│   ├── dashboard_page.py
│   ├── mentorship_page.py
│   ├── courses_page.py
│   ├── interviews_page.py
│   ├── settings_page.py
│   └── auth_page.py
├── data/
│   └── test_data.py              # Test case data generator & fixtures
├── utils/
│   ├── logger.py                 # File & console logging utility
│   ├── screenshot_utils.py       # Screenshot capture on test failure
│   ├── deployment_verifier.py    # Deployment availability & asset validator
│   ├── excel_reporter.py         # Excel workbook generator (openpyxl)
│   ├── html_reporter.py          # HTML execution & dashboard generator
│   ├── github_summary.py         # Step summary markdown builder
│   └── test_runner.py            # Main test suite runner
└── tests/                        # 440 Executable Test Cases across 14 Modules
    ├── test_authentication.py    # 40 Test Cases
    ├── test_authorization.py     # 40 Test Cases
    ├── test_navigation.py        # 30 Test Cases
    ├── test_ui_validation.py     # 50 Test Cases
    ├── test_forms.py             # 50 Test Cases
    ├── test_crud_operations.py  # 50 Test Cases
    ├── test_input_validation.py  # 40 Test Cases
    ├── test_error_handling.py    # 20 Test Cases
    ├── test_session_management.py # 20 Test Cases
    ├── test_file_upload.py       # 20 Test Cases
    ├── test_accessibility.py     # 20 Test Cases
    ├── test_responsive_design.py # 20 Test Cases
    ├── test_performance_smoke.py # 20 Test Cases
    └── test_regression.py        # 50 Test Cases
```

---

## 🛠️ Local Execution Guide

### Prerequisites
- Python 3.10+
- Chrome Browser installed
- Chrome Driver (managed automatically or via PATH)

### 1. Install Dependencies
```bash
pip install selenium openpyxl requests beautifulsoup4
```

### 2. Configure Environment Variable
Set `BASE_URL` to target your deployed application (or live server):
```bash
# PowerShell
$env:BASE_URL="https://Richard-roshan.github.io/skillsnap-ai/"

# Bash
export BASE_URL="https://Richard-roshan.github.io/skillsnap-ai/"
```

### 3. Run Deployment Verification
```bash
python automation/utils/deployment_verifier.py
```

### 4. Execute Full 440+ Test Suite & Generate Reports
```bash
python automation/utils/test_runner.py
```

All generated reports will be populated inside the `Test Results/` directory:
- `Test Results/Excel/Automation_Test_Report.xlsx` (6 Sheets)
- `Test Results/Excel/Failed_Test_Cases.xlsx`
- `Test Results/Excel/Passed_Test_Cases.xlsx`
- `Test Results/Excel/Summary_Report.xlsx`
- `Test Results/HTML/execution-report.html`
- `Test Results/HTML/dashboard.html`
- `Test Results/JSON/execution-results.json`
- `Test Results/Summary/summary.md`

---

## ⚙️ Repository & GitHub Actions Configuration

### 1. Enable GitHub Pages
1. Go to **Repository Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.

### 2. Configure Workflow Permissions
Ensure `.github/workflows/deploy-and-test.yml` has the following permissions enabled:
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

### 3. Configure `BASE_URL` Variable (Optional)
If your repository URL differs, set a Repository Variable:
1. Go to **Settings** > **Secrets and variables** > **Actions** > **Variables**.
2. Add Variable `BASE_URL` with value `https://<your-github-username>.github.io/<your-repo-name>/`.

---

## 🔍 Troubleshooting Guide

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **HTTP Status 404 on Verification** | GitHub Pages deployment hasn't finished propagating. | Increase sleep delay in Stage 6 or re-trigger workflow. |
| **Selenium WebDriver Error** | Chrome version mismatch or missing headless flag. | Ensure `HEADLESS=true` environment variable is set. |
| **Pass Percentage < 95%** | Critical elements missing or broken in build. | Check `Test Results/Screenshots/` and `Logs/` artifacts in GitHub Actions summary. |
