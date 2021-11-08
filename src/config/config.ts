import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';

export const PORT = parseInt(process.env.PORT as unknown as string, 10);

export const dbConn = new Pool({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT as unknown as string, 10),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
});
