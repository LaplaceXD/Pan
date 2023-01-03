const { xlsx } = require("../providers");
const Report = require("../models/report.model");
const date = require("../../helpers/date");
const { role } = require("../constants/employee");

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

const supplierStocksReport = async (req, res) => {
  const month = date.getMonthOrDefault(req.query);
  const { startDate, endDate } = date.getStartAndEndDates(month);

  const data = await Report.getSupplierStocksReportData(startDate, endDate);
  const fileName = `Supplier Stocks Report [${month}]`;

  if (req.query?.type && req.query?.type === "xlsx") {
    const report = xlsx.generateExcelReport(data);
    res.writeHead(200, getHeaders(fileName));
    res.end(report);
  } else {
    res.status(200).send({ fileName, sheets: data });
  }
};

const dailySalesReport = async (req, res) => {
  const isEmployee = req.auth.role === role.EMPLOYEE;

  const [m, d, y] = new Date().toLocaleDateString().split("/");
  const date = [y, m.padStart(2, "0"), d.padStart(2, "0")].join("-");

  const data = await Report.getDailySalesReportData(date, isEmployee ? req.auth.id : null);
  let fileName = `Daily Sales Report [${date}]`;
  if (isEmployee) fileName += `[${req.auth.last_name}]`;

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
  dailySalesReport,
  supplierStocksReport,
};
