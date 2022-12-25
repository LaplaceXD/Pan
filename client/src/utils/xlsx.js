import xlsx from "json-as-xlsx";

export function downloadXLSXFromData(data, fileName) {
  const settings = { fileName };

  xlsx(data, settings);
}
