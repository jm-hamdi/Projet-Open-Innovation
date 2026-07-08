const currencyFmt = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const numberFmt = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number): string {
  return currencyFmt.format(value);
}

export function formatNumber(value: number): string {
  return numberFmt.format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  const abs = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(value));
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${abs} %`;
}

export function formatConversion(rate: number): string {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rate) + " %";
}

export function formatDate(dateStr: string): string {
  const [day, month] = dateStr.split("/");
  const months = [
    "janv.", "févr.", "mars", "avr.", "mai", "juin",
    "juil.", "août", "sept.", "oct.", "nov.", "déc.",
  ];
  return `${parseInt(day)} ${months[parseInt(month) - 1]}`;
}
