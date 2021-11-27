export function stringShorterThan(value: string, minLength: number): boolean {
  return value.length < minLength;
}

export function stringValidationError(
  value: string,
  name: string,
  minLength = 4
): string | undefined {
  const key = name.toUpperCase();
  if (!value) {
    return `${key}_REQUIRED`;
  }
  return stringShorterThan(value, minLength) ? `${key}_TOO_SHORT` : undefined;
}

export function optionalStringValidationError(
  value: string,
  name: string,
  minLength = 4
): string | undefined {
  if (!value) {
    return undefined;
  }
  return stringShorterThan(value, minLength) ? `${name.toUpperCase()}_TOO_SHORT` : undefined;
}