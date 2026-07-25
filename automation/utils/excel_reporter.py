import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from automation.config.config import Config
from automation.utils.logger import AutomationLogger

logger = AutomationLogger.get_logger()

class ExcelReporter:
    @staticmethod
    def generate_excel_reports(test_results, summary_metrics):
        Config.ensure_directories()
        
        # 1. Generate Automation_Test_Report.xlsx (6 Sheets)
        main_file = os.path.join(Config.EXCEL_REPORTS_DIR, "Automation_Test_Report.xlsx")
        wb = openpyxl.Workbook()
        
        # Setup styles
        header_fill = PatternFill(start_color="1F2937", end_color="1F2937", fill_type="solid")
        header_font = Font(name="Arial", size=11, bold=True, color="FFFFFF")
        
        pass_fill = PatternFill(start_color="D1FAE5", end_color="D1FAE5", fill_type="solid")
        pass_font = Font(color="065F46", bold=True)
        
        fail_fill = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid")
        fail_font = Font(color="991B1B", bold=True)
        
        skip_fill = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")
        skip_font = Font(color="92400E", bold=True)
        
        thin_border = Border(
            left=Side(style='thin', color='E5E7EB'),
            right=Side(style='thin', color='E5E7EB'),
            top=Side(style='thin', color='E5E7EB'),
            bottom=Side(style='thin', color='E5E7EB')
        )

        # --- Sheet 1: Executed Test Cases ---
        ws1 = wb.active
        ws1.title = "Executed Test Cases"
        headers1 = ["Test ID", "Module", "Test Name", "Status", "Execution Time", "Priority"]
        ws1.append(headers1)
        
        for case in test_results:
            ws1.append([
                case["test_id"],
                case["module"],
                case["test_name"],
                case["status"],
                f"{case.get('execution_time', 0.05):.3f}s",
                case["priority"]
            ])

        # --- Sheet 2: Passed Tests ---
        ws2 = wb.create_sheet(title="Passed Tests")
        ws2.append(headers1)
        for case in test_results:
            if case["status"] == "PASSED":
                ws2.append([case["test_id"], case["module"], case["test_name"], case["status"], f"{case.get('execution_time', 0.05):.3f}s", case["priority"]])

        # --- Sheet 3: Failed Tests ---
        ws3 = wb.create_sheet(title="Failed Tests")
        headers3 = ["Test ID", "Module", "Test Name", "Failure Reason", "Screenshot", "Priority"]
        ws3.append(headers3)
        for case in test_results:
            if case["status"] == "FAILED":
                ws3.append([case["test_id"], case["module"], case["test_name"], case.get("failure_reason", "Assertion Failed"), case.get("screenshot", ""), case["priority"]])

        # --- Sheet 4: Skipped Tests ---
        ws4 = wb.create_sheet(title="Skipped Tests")
        ws4.append(headers1)
        for case in test_results:
            if case["status"] in ["SKIPPED", "BLOCKED"]:
                ws4.append([case["test_id"], case["module"], case["test_name"], case["status"], "0.00s", case["priority"]])

        # --- Sheet 5: Execution Metrics ---
        ws5 = wb.create_sheet(title="Execution Metrics")
        ws5.append(["Metric Name", "Metric Value"])
        metrics = [
            ("Total Test Cases", summary_metrics["total"]),
            ("Passed Test Cases", summary_metrics["passed"]),
            ("Failed Test Cases", summary_metrics["failed"]),
            ("Skipped Test Cases", summary_metrics["skipped"]),
            ("Pass Rate (%)", f"{summary_metrics['pass_rate']:.2f}%"),
            ("Total Execution Time (s)", f"{summary_metrics['duration']:.2f}s"),
            ("Target BASE_URL", summary_metrics["base_url"])
        ]
        for item in metrics:
            ws5.append(list(item))

        # --- Sheet 6: Defect Summary ---
        ws6 = wb.create_sheet(title="Defect Summary")
        ws6.append(["Defect ID", "Test ID", "Module", "Description", "Severity", "Status"])
        defect_idx = 1
        for case in test_results:
            if case["status"] == "FAILED":
                ws6.append([
                    f"DEF_{defect_idx:03d}",
                    case["test_id"],
                    case["module"],
                    case.get("failure_reason", "Functional failure detected during live E2E run."),
                    case["priority"],
                    "OPEN"
                ])
                defect_idx += 1
        if defect_idx == 1:
            ws6.append(["N/A", "N/A", "N/A", "No defects reported during test run.", "LOW", "CLOSED"])

        # Format sheets
        for sheet in wb.worksheets:
            for cell in sheet[1]:
                cell.fill = header_fill
                cell.font = header_font
                cell.alignment = Alignment(horizontal="center", vertical="center")
            
            for row in sheet.iter_rows(min_row=2):
                for cell in row:
                    cell.border = thin_border
                    if cell.value == "PASSED":
                        cell.fill = pass_fill
                        cell.font = pass_font
                    elif cell.value == "FAILED":
                        cell.fill = fail_fill
                        cell.font = fail_font
                    elif cell.value in ["SKIPPED", "BLOCKED"]:
                        cell.fill = skip_fill
                        cell.font = skip_font

            # Auto-fit columns
            for col in sheet.columns:
                max_len = max(len(str(cell.value or '')) for cell in col)
                col_letter = get_column_letter(col[0].column)
                sheet.column_dimensions[col_letter].width = max(max_len + 3, 12)

        wb.save(main_file)
        logger.info(f"Generated Excel Report: {main_file}")

        # 2. Generate Passed_Test_Cases.xlsx
        wb_pass = openpyxl.Workbook()
        ws = wb_pass.active
        ws.title = "Passed Tests"
        ws.append(headers1)
        for case in test_results:
            if case["status"] == "PASSED":
                ws.append([case["test_id"], case["module"], case["test_name"], case["status"], f"{case.get('execution_time', 0.05):.3f}s", case["priority"]])
        wb_pass.save(os.path.join(Config.EXCEL_REPORTS_DIR, "Passed_Test_Cases.xlsx"))

        # 3. Generate Failed_Test_Cases.xlsx
        wb_fail = openpyxl.Workbook()
        ws = wb_fail.active
        ws.title = "Failed Tests"
        ws.append(headers3)
        for case in test_results:
            if case["status"] == "FAILED":
                ws.append([case["test_id"], case["module"], case["test_name"], case.get("failure_reason", "Assertion Failure"), case.get("screenshot", ""), case["priority"]])
        wb_fail.save(os.path.join(Config.EXCEL_REPORTS_DIR, "Failed_Test_Cases.xlsx"))

        # 4. Generate Summary_Report.xlsx
        wb_sum = openpyxl.Workbook()
        ws = wb_sum.active
        ws.title = "Summary"
        ws.append(["Metric", "Value"])
        for item in metrics:
            ws.append(list(item))
        wb_sum.save(os.path.join(Config.EXCEL_REPORTS_DIR, "Summary_Report.xlsx"))
        
        logger.info("Successfully generated all 4 Excel workbooks!")
