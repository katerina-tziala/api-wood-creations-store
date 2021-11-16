import bcrypt from 'bcrypt';
import { SALT_ROUNDS, BCRYPT_PASSWORD } from '../config/config';

export function encryptPassword(password: string): string {
  const pepper: string = BCRYPT_PASSWORD;
  const salt: number = SALT_ROUNDS;
  return bcrypt.hashSync(password + pepper, salt);
}

export function passwordsMatch(passwordToCheck: string, password: string): boolean {
  const pepper: string = BCRYPT_PASSWORD;
  return bcrypt.compareSync(passwordToCheck + pepper, password);
}
