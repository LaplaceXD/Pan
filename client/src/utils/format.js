function currency(currency) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    currencyDisplay: "code",
    maximumFractionDigits: 2,
  }).format(currency);
}

function date(iso) {
  return new Date(iso).toLocaleDateString();
}

function datetime(iso) {
  return new Date(iso).toLocaleString();
}

function id(id, prefix = "ID", pad = 4) {
  return `${prefix}-${String(id).padStart(pad, "0")}`;
}

function capitalize(item) {
  const components = String(item).split(" ");
  const capitalizedComponents = components.map((component) => {
    return component.charAt(0).toUpperCase() + component.slice(1).toLowerCase();
  });

  return capitalizedComponents.join(" ");
}

function decimal(num, places = 2) {
  const value = (Math.round(num * 100) / 100).toFixed(places);
  return value;
}

function address({ street_no, street_name, building, city, zip_code }) {
  const b = building ? building + ", " : "";

  // Only show street number when there is a street name
  const sno = street_no ? street_no + " " : "";
  const sname = street_name ? sno + street_name + ", " : "";

  return `${b}${sname}${city} ${zip_code}`;
}

function error(err) {
  return typeof err === "object" ? Object.entries(err)[0][1].replaceAll('"', "") : err;
}

export default {
  currency,
  date,
  datetime,
  id,
  capitalize,
  decimal,
  address,
  error,
};
