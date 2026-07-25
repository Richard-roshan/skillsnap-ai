# CI/CD Execution Guide — SkillSnap AI GitHub Actions Pipeline

## ⚡ Pipeline Architecture & Triggers
The CI/CD pipeline for **SkillSnap AI** is defined in `.github/workflows/deploy-and-test.yml`.

### Triggers:
- **`push`**: Runs automatically when code is pushed to `main` or `master` branch.
- **`pull_request`**: Runs on pull requests targeting `main` or `master` branch.
- **`workflow_dispatch`**: Allows manual trigger from the GitHub Actions tab.

---

## 🔄 13 Pipeline Stages Breakdown

| Stage | Name | Action / Purpose |
| :--- | :--- | :--- |
| **Stage 1** | Repository Checkout | Checks out repository code (`actions/checkout@v4`). |
| **Stage 2** | Dependency Installation | Sets up Python 3.11 and installs `selenium`, `openpyxl`, `requests`, `bs4`. |
| **Stage 3** | Build Application | Packages application artifacts into `dist/`. |
| **Stage 4** | Static Analysis | Runs Python compilation syntax checks (`py_compile`). |
| **Stage 5** | Deploy to GitHub Pages | Deploys static site to GitHub Pages (`actions/deploy-pages@v4`). |
| **Stage 6** | Wait for Deployment | Pauses for propagation delay (15 seconds). |
| **Stage 7** | Deployment Verification | Executes `deployment_verifier.py` to confirm HTTP 200 & asset loading. |
| **Stage 8-10**| Selenium E2E & Reports | Executes 440+ Selenium test cases against live URL and generates Excel & HTML reports. |
| **Stage 11** | Upload Artifacts | Uploads `Test Results/` folder as a GitHub Actions artifact (30 days retention). |
| **Stage 12** | Publish Summary | Appends `summary.md` content to `$GITHUB_STEP_SUMMARY`. |
| **Stage 13** | Store Historical Results | Logs completion timestamp for audit trail. |

---

## 🔒 Required GitHub Repository Settings

1. **Enable GitHub Pages**:
   - Go to **Settings > Pages**.
   - Under **Build and deployment**, select **GitHub Actions** as source.

2. **Workflow Permissions**:
   - Ensure the workflow has `pages: write`, `id-token: write`, `contents: read`.

3. **Repository Variables (Optional)**:
   - Variable Name: `BASE_URL`
   - Value: `https://<github-username>.github.io/<repository-name>/`
