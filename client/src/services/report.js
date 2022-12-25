import auth from "@utils/auth";
import { downloadXLSXFromData } from "@utils/xlsx";

export async function downloadInventoryReport(month) {
  const {
    data: { fileName, sheets },
  } = await auth.get("/reports/inventory" + createMonthParam(month));

  downloadXLSXFromData(sheets, fileName);
}

export async function downloadSalesReport(month) {
  const {
    data: { fileName, sheets },
  } = await auth.get("/reports/sales" + createMonthParam(month));

  downloadXLSXFromData(sheets, fileName);
}

export async function downloadEmployeeReport() {
  const {
    data: { fileName, sheets },
  } = await auth.get("/reports/employee");

  downloadXLSXFromData(sheets, fileName);
}

function createMonthParam(month) {
  return month ? "?month=" + month : "";
}
