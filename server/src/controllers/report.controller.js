const { xlsx } = require("../providers");
const Report = require("../models/report.model");

// Default is the previous month, which contains the latest report
function getMonthOrDefault(query) {
  let { month } = query;

  if (!month) {
    const [year, month] = new Date().toISOString().split("T")[0].split("-");
    month = [year, month - 1].join("-");
  }

  return month;
}

function localeDateToISOString(date) {
  const [month, day, year] = new Date(date).toLocaleDateString().split("/");
  return [year, month.padStart(2, "0"), day.padStart(2, "0")].join("-");
}

function getStartAndEndDates(monthString) {
  const [year, month] = monthString.split("-");

  const startDate = localeDateToISOString(new Date(year, month - 1, 1));
  const endDate = localeDateToISOString(new Date(year, month, 0));

  return { startDate, endDate };
}

const salesReport = async (req, res) => {
  const month = getMonthOrDefault(req.query);
  const { startDate, endDate } = getStartAndEndDates(month);

  const data = await Report.productReport(startDate, endDate);
  const fileName = `Sales Report [${month}]`;
  const report = xlsx.generateExcelReport(data);

  res.writeHead(200, {
    "Content-Type": "application/vnd.ms-excel",
    "Content-Disposition": `attachment; filename=${fileName}.xlsx`,
  });
  res.end(report);
};
const employeeReport = async (req, res) => {
  const month = getMonthOrDefault(req.query);
  const { startDate, endDate } = getStartAndEndDates(month);

  const data = await Report.employeeReport(startDate, endDate);
  const fileName = `Employee Report [${month}]`;
  const report = xlsx.generateExcelReport(data);

  res.writeHead(200, {
    "Content-Type": "application/vnd.ms-excel",
    "Content-Disposition": `attachment; filename=${fileName}.xlsx`,
  });
  res.end(report);
};
const inventoryReport = async (req, res) => {
  const month = getMonthOrDefault(req.query);
  const { startDate, endDate } = getStartAndEndDates(month);

  const data = await Report.inventoryReport(startDate, endDate);
  const fileName = `Inventory Report [${month}]`;
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
