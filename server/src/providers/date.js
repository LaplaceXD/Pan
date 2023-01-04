const { DateTime: luxon } = require("luxon");
const config = require("config");

class DateTime {
  constructor(year = DateTime.now().get("year"), month = DateTime.now().get("month")) {
    this.luxon = luxon
      .local(parseInt(year), parseInt(month))
      .setLocale(config.get("date.locale"))
      .setZone(config.get("date.zone"));
  }

  static now() {
    return luxon.local().setLocale(config.get("date.locale")).setZone(config.get("date.zone"));
  }

  startOfMonth() {
    return this.luxon.startOf("month");
  }

  endOfMonth() {
    return this.luxon.endOf("month");
  }

  previousMonth() {
    return this.luxon.minus({ month: 1 }).startOf("month");
  }
}

module.exports = DateTime;
