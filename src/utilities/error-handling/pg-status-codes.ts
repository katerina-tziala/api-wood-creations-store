export interface StatusCodeIndex {
  statusCode: number;
  errorTypes: string[];
}

import { ErrorType } from './error-type.enum';
export const PG_STATUS_CODES: StatusCodeIndex[] = [
  {
    statusCode: 503,
    errorTypes: [
      'CONNECTION_EXCEPTION',
      'CONNECTION_DOES_NOT_EXIST',
      'CONNECTION_FAILURE',
      'SQLCLIENT_UNABLE_TO_ESTABLISH_SQLCONNECTION',
      'SQLSERVER_REJECTED_ESTABLISHMENT_OF_SQLCONNECTION',
      'PROTOCOL_VIOLATION',
      'INVALID_GRANTOR',
      'INVALID_ROLE_SPECIFICATION',
      'INVALID_AUTHORIZATION_SPECIFICATION',
      'INVALID_PASSWORD',
      'SRF_PROTOCOL_VIOLATED',
      'INSUFFICIENT_PRIVILEGE',
      'ADMIN_SHUTDOWN',
      'CRASH_SHUTDOWN',
      'CANNOT_CONNECT_NOW',
      'DATABASE_DROPPED',
      'SYSTEM_ERROR',
      'IO_ERROR',
      'PLPGSQL_ERROR'
    ]
  },
  {
    statusCode: 404,
    errorTypes: [ErrorType.NotFound, ErrorType.CurrentOrderNotFound]
  },
  {
    statusCode: 403,
    errorTypes: [
      ErrorType.CurrentOrderExists,
      'CARDINALITY_VIOLATION',
      'DATA_EXCEPTION',
      'ERROR_IN_ASSIGNMENT',
      'ESCAPE_CHARACTER_CONFLICT',
      'INVALID_INDICATOR_PARAMETER_VALUE',
      'INVALID_PARAMETER_VALUE',
      'INVALID_REGULAR_EXPRESSION',
      'NULL_VALUE_NOT_ALLOWED',
      'NULL_VALUE_NO_INDICATOR_PARAMETER',
      'NUMERIC_VALUE_OUT_OF_RANGE',
      'STRING_DATA_LENGTH_MISMATCH',
      'SUBSTRING_ERROR',
      'TRIM_ERROR',
      'UNTERMINATED_C_STRING',
      'ZERO_LENGTH_CHARACTER_STRING',
      'FLOATING_POINT_EXCEPTION',
      'INVALID_TEXT_REPRESENTATION',
      'INVALID_BINARY_REPRESENTATION',
      'BAD_COPY_FILE_FORMAT',
      'UNTRANSLATABLE_CHARACTER',
      'NOT_AN_XML_DOCUMENT',
      'INTEGRITY_CONSTRAINT_VIOLATION',
      'RESTRICT_VIOLATION',
      'NOT_NULL_VIOLATION',
      'FOREIGN_KEY_VIOLATION',
      'UNIQUE_VIOLATION',
      'CHECK_VIOLATION',
      'SYNTAX_ERROR_OR_ACCESS_RULE_VIOLATION',
      'SYNTAX_ERROR',
      'INVALID_FOREIGN_KEY',
      'INVALID_NAME',
      'NAME_TOO_LONG',
      'RESERVED_NAME',
      'DATATYPE_MISMATCH',
      'UNDEFINED_PARAMETER',
      'WITH_CHECK_OPTION_VIOLATION'
    ]
  },
  {
    statusCode: 400,
    errorTypes: [
      ErrorType.IdRequired,
      ErrorType.ValuesRequired,
      ErrorType.PassswordTooShort
    ]
  }
];
