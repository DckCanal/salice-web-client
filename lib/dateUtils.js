const month = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

export function italianMonth(monthNumber) {
  return month[monthNumber];
}

export function italianDate(date) {
  const d = new Date(date);
  return `${d.getDate()} ${italianMonth(d.getMonth())} ${d.getFullYear()}`;
}

export function italianShortDate(date) {
  const d = new Date(date);
  return `${d.getDate()} ${getShortMonths()[d.getMonth()]} ${d.getFullYear()}`;
}

export function sortDate(a, b) {
  return Date.parse(a) > Date.parse(b) ? -1 : 1;
}

export function sortDateFunction() {
  return sortDate;
}

export const getMonths = () => [...month];
export const getShortMonths = () => [...month].map((m) => m.slice(0, 3));
