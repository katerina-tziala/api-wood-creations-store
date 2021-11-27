import { ModelType } from '../api/models/_ModelStore';

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
  return stringShorterThan(value, minLength)
    ? `${name.toUpperCase()}_TOO_SHORT`
    : undefined;
}

export function numberTypeError(value: any, name: string): string | undefined {
  return typeof value !== 'number'
    ? `${name.toUpperCase()}_MUST_BE_A_NUMBER`
    : undefined;
}

export function optionalNumberTypeError(
  value: any,
  name: string
): string | undefined {
  return !value ? undefined : numberTypeError(value, name);
}

export function requiredDataError<T extends ModelType>(
  data: T
): string | undefined {
  return !Object.values(data).length ? 'DATA_REQUIRED' : undefined;
}
