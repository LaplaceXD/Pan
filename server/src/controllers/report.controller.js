const { xlsx } = require("../providers");
const Report = require("../models/report.model");

function encloseWithBrackets(str) {
  return !str ? null : str.padStart(str.length + 1, "[").padEnd(str.length + 2, "]");
}

function getFileName(fileName, startDate, endDate) {
  let datePart = [startDate, endDate].map(encloseWithBrackets).filter(Boolean).join("");
  datePart = datePart !== "" ? " " + datePart : datePart;
  return `${fileName}${datePart}`;
}

const salesReport = async (req, res) => {
  const { start_date, end_date } = req.query;

  const data = await Report.productReport(start_date, end_date);
  const fileName = getFileName("Sales Report", start_date, end_date);
  const report = xlsx.generateExcelReport(data);

  res.writeHead(200, {
    "Content-Type": "application/vnd.ms-excel",
    "Content-Disposition": `attachment; filename=${fileName}.xlsx`,
  });
  res.end(report);
};
const employeeReport = async (req, res) => {
  const { start_date, end_date } = req.query;

  const data = await Report.employeeReport(start_date, end_date);
  const fileName = getFileName("Employee Report", start_date, end_date);
  const report = xlsx.generateExcelReport(data);

  res.writeHead(200, {
    "Content-Type": "application/vnd.ms-excel",
    "Content-Disposition": `attachment; filename=${fileName}.xlsx`,
  });
  res.end(report);
};
const inventoryReport = async (req, res) => {
  const { start_date, end_date } = req.query;

  const data = await Report.inventoryReport(start_date, end_date);
  const fileName = getFileName("Inventory Report", start_date, end_date);
  const report = xlsx.generateExcelReport(data);

  res.writeHead(200, {
    "Content-Type": "application/vnd.ms-excel",
    "Content-Disposition": `attachment; filename=${fileName}.xlsx`,
  });
  res.end(report);
};

module.exports = {
  salesReport,
  employeeReport,
  inventoryReport,
};
