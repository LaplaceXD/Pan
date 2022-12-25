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

module.exports = {
  getMonthOrDefault,
  localeDateToISOString,
  getStartAndEndDates,
};