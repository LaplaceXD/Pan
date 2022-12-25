import auth from "@utils/auth";
import { downloadXLSXfromBuffer } from "@utils/xlsx";

export async function downloadInventoryReport(month) {
  const res = await auth.get("/reports/inventory" + createMonthParam(month), { parsed: false });
  const buffer = await res.arrayBuffer();
  downloadXLSXfromBuffer(buffer, parseFilenameFromResponse(res));
}

export async function downloadSalesReport(month) {
  const res = await auth.get("/reports/sales" + createMonthParam(month), { parsed: false });
  const buffer = await res.arrayBuffer();
  downloadXLSXfromBuffer(buffer, parseFilenameFromResponse(res));
}

export async function downloadEmployeeReport(month) {
  const res = await auth.get("/reports/employee" + createMonthParam(month), { parsed: false });
  const buffer = await res.arrayBuffer();
  downloadXLSXfromBuffer(buffer, parseFilenameFromResponse(res));
}

function parseFilenameFromResponse(res) {
  const contentDisposition = res.headers.get("Content-Disposition");
  const fileNameRegex = /filename=(?<fileName>.*)$/;

  const {
    groups: { fileName },
  } = fileNameRegex.exec(contentDisposition);
  return fileName;
}

function createMonthParam(month) {
  return month ? "?month=" + month : "";
}
