import { DatabaseError } from 'pg';

import { ErrorType } from './error-type.enum';
import { PG_ERROR_INDEX } from './pg-error-index';

import { PG_STATUS_CODES, StatusCodeIndex } from './pg-status-codes';

export interface ResponseError {
  statusCode: number;
  error: string;
  details?: string;
}

function getQueryErorrKey(code: string): string | undefined {
  const codeKeys: string[] = Object.keys(PG_ERROR_INDEX);
  return codeKeys.find(key => PG_ERROR_INDEX[key].includes(code));
}

function getStatusCode(errorKey: string): number {
  const codeIndex: StatusCodeIndex | undefined = PG_STATUS_CODES.find(item =>
    item.errorTypes.includes(errorKey)
  );
  return codeIndex ? codeIndex.statusCode : 500;
}

function getResponseErrorFromSimpleError(message: string): ResponseError {
  const statusCode = getStatusCode(message);
  const errorTypes: string[] = Object.values(ErrorType);
  const errorKey = errorTypes.includes(message) ? message : 'UNEXPECTED_ERROR';
  const details = errorTypes.includes(message) ? undefined : message;
  return { statusCode, error: errorKey, details };
}

function getDatabaseResponseError(
  dbError: DatabaseError
): ResponseError | undefined {
  const errorKey = getQueryErorrKey(dbError.code as string);
  if (!errorKey) {
    return;
  }
  const statusCode = getStatusCode(errorKey);
  return { statusCode, error: errorKey, details: dbError.message };
}

export function getResponseError(error: Error | DatabaseError): ResponseError {
  const responseError =
    getDatabaseResponseError(error as DatabaseError) ||
    getResponseErrorFromSimpleError(error.message);
  return responseError;
}
