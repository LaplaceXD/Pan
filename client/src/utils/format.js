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

export default {
  currency,
  date,
  datetime,
};
