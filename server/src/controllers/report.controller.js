const { xlsx } = require("../providers");
const Report = require("../models/report.model");
const date = require("../../helpers/date");

function getHeaders(fileName) {
  return {
    "Content-Type": "application/vnd.ms-excel",
    "Content-Disposition": `attachment; filename=${fileName}.xlsx`,
  };
}

const salesReport = async (req, res) => {
  const month = date.getMonthOrDefault(req.query);
  const { startDate, endDate } = date.getStartAndEndDates(month);

  const data = await Report.getSalesReportData(startDate, endDate);
  const report = xlsx.generateExcelReport(data);

  res.writeHead(200, getHeaders(`Sales Report [${month}]`));
  res.end(report);
};

const employeeReport = async (_, res) => {
  const data = await Report.getEmployeeReportData();
  const report = xlsx.generateExcelReport(data);

  res.writeHead(200, getHeaders("Employee Report"));
  res.end(report);
};

const inventoryReport = async (req, res) => {
  const month = date.getMonthOrDefault(req.query);
  const { startDate, endDate } = date.getStartAndEndDates(month);

  const data = await Report.getInventoryReportData(startDate, endDate);
  const report = xlsx.generateExcelReport(data);

  res.writeHead(200, getHeaders(`Inventory Report [${month}]`));
  res.end(report);
};

module.exports = {
  salesReport,
  employeeReport,
  inventoryReport,
};
