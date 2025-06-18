export function formatDate(date: string = "") {
  const targetDate = date ? new Date(date) : new Date();
  return targetDate.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
}
