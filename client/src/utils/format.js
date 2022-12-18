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

export default {
  currency,
  date,
  datetime,
  id,
};
