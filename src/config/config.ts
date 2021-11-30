import dotenv from 'dotenv';
dotenv.config();

import { PoolConfig } from 'pg';

export const PORT = parseInt(process.env.PORT as unknown as string, 10);

export const SALT_ROUNDS = parseInt(
  process.env.SALT_ROUNDS as unknown as string,
  10
);

export const BCRYPT_PASSWORD: string = process.env
  .BCRYPT_PASSWORD as unknown as string;

export const TOKEN_SECRET: string = process.env
  .TOKEN_SECRET as unknown as string;

const database =
  process.env.NODE_ENV === 'test'
    ? process.env.POSTGRES_DB_TEST
    : process.env.POSTGRES_DB;

export const dbConf: PoolConfig = {
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT as unknown as string, 10),
  database,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
};
