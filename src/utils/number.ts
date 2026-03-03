export function parseLocaleNumber(value: string | number): number {
  if (typeof value === "number") return value;
  const trimmed = value.trim();
  const normalized = trimmed.includes(",")
    ? trimmed.replace(/\./g, "").replace(",", ".")
    : trimmed;
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : NaN;
}
