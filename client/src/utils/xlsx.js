import { read, writeFile } from "xlsx";

export function downloadXLSXfromBuffer(buffer, fileName) {
  const workbook = read(new Uint8Array(buffer), { type: "array" });
  writeFile(workbook, fileName);
}
