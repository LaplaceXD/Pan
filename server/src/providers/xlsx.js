const xlsx = require("json-as-xlsx");

function generateExcelReport(data) {
  const settings = {
    writeOptions: {
      type: "buffer",
      bookType: "xlsx",
    },
  };

  return xlsx(data, settings);
}

module.exports = {
  generateExcelReport,
};
