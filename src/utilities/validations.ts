import { ModelType } from '../api/models/_ModelStore';

export function stringShorterThan(value: string, minLength: number): boolean {
  return value.length < minLength;
}

export function stringValidationError(
  value: string,
  name: string,
  minLength = 4
): string | undefined {
  const key = getErrorKey(name);
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
  const key = getErrorKey(name);

  return stringShorterThan(value, minLength) ? `${key}_TOO_SHORT` : undefined;
}

export function numberTypeError<T>(value: T, name: string): string | undefined {
  const key = getErrorKey(name);

  return typeof value !== 'number' ? `INVALID_NUMBER_${key}` : undefined;
}

export function optionalNumberTypeError<T>(
  value: T,
  name: string
): string | undefined {
  return !value ? undefined : numberTypeError(value, name);
}

export function requiredDataError<T extends ModelType>(
  data: Partial<T>,
  errorKey = 'DATA_REQUIRED'
): string | undefined {
  return !Object.values(data).length ? errorKey : undefined;
}

export function requiredTimestampError(
  value: Date | undefined,
  name: string
): string | undefined {
  const key = getErrorKey(name);
  if (!value) {
    return `${key}_REQUIRED`;
  }
  const validDate = !!value.getTime();
  return !validDate ? `INVALID_TIMESTAMP_${key}` : undefined;
}

function getErrorKey(name: string | undefined): string {
  return name ? name.toUpperCase() : '';
}

export function getOptionalString(
  value: string | undefined | null
): string | undefined | null {
  if (value === undefined) {
    return;
  }
  return value !== null ? value.toString().trim() : null;
}
