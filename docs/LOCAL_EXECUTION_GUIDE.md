# Local Execution Guide — SkillSnap AI Selenium E2E Automation Framework

## 📋 Overview
This guide explains how to set up, configure, and execute the **440+ automated Selenium E2E test cases** on a local developer machine.

---

## 🛠️ Prerequisites
- **Python**: 3.10 or higher
- **Browser**: Google Chrome installed
- **Chrome Driver**: Managed automatically by Selenium or accessible via `PATH`
- **Git**: Installed and configured

---

## 🚀 Setup Instructions

### Step 1: Clone the Repository
```bash
git clone https://github.com/Richard-roshan/skillsnap-ai.git
cd skillsnap-ai
```

### Step 2: Install Required Dependencies
Install the required Python packages:
```bash
pip install selenium openpyxl requests beautifulsoup4
```

### Step 3: Configure Environment Variables
Set the `BASE_URL` environment variable targeting the live application deployment:

**On PowerShell (Windows):**
```powershell
$env:BASE_URL="https://Richard-roshan.github.io/skillsnap-ai/"
$env:HEADLESS="true"
```

**On Bash (Linux/macOS):**
```bash
export BASE_URL="https://Richard-roshan.github.io/skillsnap-ai/"
export HEADLESS="true"
```

---

## 🧪 Execution Steps

### 1. Run Deployment Health Verification
Verify that the target URL, CSS assets, JavaScript files, and HTML DOM render properly:
```bash
python automation/utils/deployment_verifier.py
```

### 2. Execute 440+ Selenium E2E Test Suite
Run the full automated E2E test suite and generate all reports:
```bash
python automation/utils/test_runner.py
```

---

## 📊 Viewing Test Results
After execution completes, all test evidence will be generated in `Test Results/`:

- **Excel Reports**: `Test Results/Excel/Automation_Test_Report.xlsx` (6 sheets)
- **HTML Reports**: `Test Results/HTML/execution-report.html` & `dashboard.html`
- **JSON Data**: `Test Results/JSON/execution-results.json`
- **Markdown Summary**: `Test Results/Summary/summary.md`
- **Screenshots**: `Test Results/Screenshots/` (captured automatically on failure)
- **Execution Logs**: `Test Results/Logs/`
