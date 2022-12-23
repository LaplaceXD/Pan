const { InternalServerError, NotFound } = require("../../helpers/errors");
const Report = require("../models/report.model");

const salesReport = async (req, res) => {
  const data = await Report.productReport(req.query.start_date, req.query.end_date);

  res.writeHead(200, {
    "Content-Type": "application/octet-stream",
    "Content-disposition": "attachment; filename=MySheet.xlsx",
  })
  res.end(data)
};
const employeeReport = async (req, res) => {
  const data = await Report.emplyReport();

  res.writeHead(200, {
    "Content-Type": "application/octet-stream",
    "Content-disposition": "attachment; filename=MySheet.xlsx",
  })
  res.end(data)
};
const stockReport = async (req, res) => {
  const data = await Report.inventoryReport();

  res.writeHead(200, {
    "Content-Type": "application/octet-stream",
    "Content-disposition": "attachment; filename=MySheet.xlsx",
  })
  res.end(data)
};

module.exports = {
  salesReport,
  employeeReport,
  stockReport,
};