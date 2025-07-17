export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatNumber(value: number | undefined, locale: string = 'fr-FR'): string {
  if (typeof value !== 'number' || isNaN(value)) return 'N/A';
  return value.toLocaleString(locale);
}

export function formatDate(date: Date | string, locale: string = 'fr-FR'): string {
  const d = new Date(date);
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
