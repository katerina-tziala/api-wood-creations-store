import dotenv from 'dotenv';
dotenv.config();

import { PoolConfig } from 'pg';

export const PORT = parseInt(process.env.PORT as unknown as string, 10);

const database =
  process.env.ENV === 'test'
    ? process.env.POSTGRES_DB_TEST
    : process.env.POSTGRES_DB;

export const dbConf: PoolConfig = {
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT as unknown as string, 10),
  database,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
};
