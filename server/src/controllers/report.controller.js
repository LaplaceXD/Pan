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
  const fileName = `Sales Report [${month}]`;

  if (req.query?.type && req.query?.type === "xlsx") {
    const report = xlsx.generateExcelReport(data);
    res.writeHead(200, getHeaders(fileName));
    res.end(report);
  } else {
    res.status(200).send({ fileName, sheets: data });
  }
};

const employeeReport = async (req, res) => {
  const data = await Report.getEmployeeReportData();
  const fileName = "Employee Report";

  if (req.query?.type && req.query?.type === "xlsx") {
    const report = xlsx.generateExcelReport(data);
    res.writeHead(200, getHeaders(fileName));
    res.end(report);
  } else {
    res.status(200).send({ fileName, sheets: data });
  }
};

const inventoryReport = async (req, res) => {
  const month = date.getMonthOrDefault(req.query);
  const { startDate, endDate } = date.getStartAndEndDates(month);

  const data = await Report.getInventoryReportData(startDate, endDate);
  const fileName = `Inventory Report [${month}]`;

  if (req.query?.type && req.query?.type === "xlsx") {
    const report = xlsx.generateExcelReport(data);
    res.writeHead(200, getHeaders(fileName));
    res.end(report);
  } else {
    res.status(200).send({ fileName, sheets: data });
  }
};

module.exports = {
  salesReport,
  employeeReport,
  inventoryReport,
};
