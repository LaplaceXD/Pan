import auth from "@utils/auth";
import { downloadXLSXfromBuffer } from "@utils/xlsx";

export async function downloadInventoryReport({ start, end } = {}) {
  const res = await auth.get("/reports/inventory" + createDateSearchParams(start, end), { parsed: false });
  const buffer = await res.arrayBuffer();
  downloadXLSXfromBuffer(buffer, parseFilenameFromResponse(res));
}

export async function downloadSalesReport({ start, end } = {}) {
  const res = await auth.get("/reports/sales" + createDateSearchParams(start, end), { parsed: false });
  const buffer = await res.arrayBuffer();
  downloadXLSXfromBuffer(buffer, parseFilenameFromResponse(res));
}

export async function downloadEmployeeReport({ start, end } = {}) {
  const res = await auth.get("/reports/employee" + createDateSearchParams(start, end), { parsed: false });
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

function createDateSearchParams(start, end) {
  const startDate = start ? ["start_date", start] : null;
  const endDate = end ? ["end_date", end] : null;

  const query = new URLSearchParams([startDate, endDate].filter(Boolean));
  return (query === "" ? "" : "?") + query;
}
