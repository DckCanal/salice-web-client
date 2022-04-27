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

export default function italianMonth(monthNumber) {
  return month[monthNumber];
}

export const getMonths = () => [...month];
export const getShortMonths = () => [...month].map((m) => m.slice(0, 3));
