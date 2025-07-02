export function formatDate(
  date: string = "",
  locale: string = "en-US"
): string {
  const targetDate = date ? new Date(date) : new Date();
  return targetDate.toLocaleDateString(locale, {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
}
