export const emptyStringToNull = (value: string) =>
  value === "" ? null : value;

export function stringToNumberOrNull(value: string) {
  const parsed = Number(value);
  return value === "" || isNaN(parsed) ? null : parsed;
}
