import bcrypt from 'bcrypt';
import { SALT_ROUNDS, BCRYPT_PASSWORD } from '../config/config';
import { ErrorType } from './error-handling/error-type.enum';

export function encryptPassword(password: string): string {
  if (password.length < 4) {
    throw Error(ErrorType.PassswordTooShort);
  }
  const pepper: string = BCRYPT_PASSWORD;
  const salt: number = SALT_ROUNDS;
  return bcrypt.hashSync(password + pepper, salt);
}

export function passwordsMatch(
  passwordToCheck: string,
  password: string
): boolean {
  const pepper: string = BCRYPT_PASSWORD;
  return bcrypt.compareSync(passwordToCheck + pepper, password);
}
