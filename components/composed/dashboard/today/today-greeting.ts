export function greetingFor(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function formatToday(date: Date): string {
  return date.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
}
