const { xlsx, DateTime } = require("../providers");
const Report = require("../models/report.model");
const { role } = require("../constants/employee");

function getHeaders(fileName) {
  return {
    "Content-Type": "application/vnd.ms-excel",
    "Content-Disposition": `attachment; filename=${fileName}.xlsx`,
  };
}

const salesReport = async (req, res) => {
  const month = req.query.month || new DateTime().previousMonth().toISODate();
  const [y, m] = month.split("-");

  const startDate = new DateTime(y, m).startOfMonth().toSQLDate();
  const endDate = new DateTime(y, m).endOfMonth().toSQLDate();

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
  const month = req.query.month || new DateTime().previousMonth().toISODate();
  const [y, m] = month.split("-");

  const startDate = new DateTime(y, m).startOfMonth().toSQLDate();
  const endDate = new DateTime(y, m).endOfMonth().toSQLDate();

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
  const date = DateTime.now().toISODate();

  const data = await Report.getSalesReportData(date, date, isEmployee ? req.auth.id : null);
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
  const month = req.query.month || new DateTime().previousMonth().toISODate();
  const [y, m] = month.split("-");

  const startDate = new DateTime(y, m).startOfMonth().toSQLDate();
  const endDate = new DateTime(y, m).endOfMonth().toSQLDate();

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
