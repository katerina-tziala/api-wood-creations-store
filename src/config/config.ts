import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';

export const PORT = parseInt(process.env.PORT as unknown as string, 10);

export const dbConn = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.POSTGRES_PORT as unknown as string, 10),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});
