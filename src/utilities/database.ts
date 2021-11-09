import { Pool, PoolClient, QueryResult } from 'pg';
import { dbConf } from '../config/config';

export const dbConn: Pool = new Pool(dbConf);

// TODO: find a way to not pass any
export async function runQuery<T>(
  sql: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const conn: PoolClient = await dbConn.connect();
    const result: QueryResult = await conn.query(sql, params);
    conn.release();
    return result.rows;
  } catch (err) {
    console.log(err);
    throw new Error(`runQuery Error: ${err}`);
  }
}

export async function getAllFromTable<T>(table: string): Promise<T[]> {
  const sql = `SELECT * FROM ${table}`;
  return await runQuery<T>(sql);
}

export async function getById<T>(table: string, id: number): Promise<T> {
  const sql = `SELECT * FROM ${table} WHERE id=($1)`;
  const results = await runQuery<T>(sql, [id]);
  return results[0];
}

export async function createRecord<T>(table: string, data: T): Promise<T> {
  const sqlParams = Object.values(data);

  const properties = Object.keys(data).join(', ');
  const valuesString = sqlParams.map((_, index) => `$${index + 1}`).join(', ');

  const sql = `INSERT INTO ${table} (${properties}) VALUES(${valuesString}) RETURNING *`;
  const results = await runQuery<T>(sql, sqlParams);
  return results[0];
}

