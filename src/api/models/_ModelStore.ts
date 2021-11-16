import { DatabaseError, Pool, PoolClient, QueryResult } from 'pg';
import { dbConf } from '../../config/config';
import {QueryErrorType, extractQueryErorrMessage} from './models-utilities/query-error';
import * as QUERY from './models-utilities/query-helper';

export interface ModelType {
  id?: number;
}

export class ModelStore<T extends ModelType> {
  protected table = '';
  protected selectQuery: string;
  private dbConn: Pool = new Pool(dbConf);

  constructor(table: string, selectQuery?: string) {
    this.table = table;
    this.selectQuery = selectQuery ? selectQuery : `SELECT * FROM ${table}`;
  }

  protected async runQuery<U>(sql: string, params: U[] = []): Promise<T[]> {
    try {
      const conn: PoolClient = await this.dbConn.connect();
      const result: QueryResult = await conn.query(sql, params);
      conn.release();
      return result.rows;
    } catch (error) {
      const errorMessage = extractQueryErorrMessage(
        error as DatabaseError
      );
      // TODO get details
      throw new Error(errorMessage);
    }
  }

  protected async getBykey(id: number, key: string): Promise<T[]> {
    const sql = `${this.selectQuery} WHERE ${key}=($1) ORDER BY id ASC`;
    return await this.runQuery(sql, [id]);
  }

  protected returnOne(results: Array<T>): T {
    const record = results[0];
    if (!record) {
      const message = QueryErrorType.NotFound;
      throw new Error(message);
    }
    return record;
  }

  public async create(data: Partial<T>): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);

    if (!keys.length || !values.length) {
      const errorMessage = QueryErrorType.NoValuesCreate;
      throw new Error(errorMessage);
    }

    const sql = QUERY.getCreationQuery(this.table, keys, values);
    const results = await this.runQuery(sql, values);
    return results[0];
  }

  public async getAll(): Promise<T[]> {
    const sql = `${this.selectQuery} ORDER BY id ASC`;
    return await this.runQuery(sql);
  }

  public async getById(id: number): Promise<T> {
    const results = await this.getBykey(id, 'id');
    return this.returnOne(results);
  }

  public async update(model: Partial<T>): Promise<T> {
    const { id, ...data } = model;
    const keys = Object.keys(data);
    const values = Object.values(data);

    if (!keys.length || !values.length) {
      const errorMessage = QueryErrorType.NoValuesUpdate;
      throw new Error(errorMessage);
    }

    const sql = QUERY.getUpdateQuery(this.table, data);
    const results = await this.runQuery(sql, [id]);
    return results[0];
  }

  // public async deleteAll(): Promise<T[]> {
  //   const sql = `DELETE FROM ${this.table} RETURNING id`;
  //   const results: T[] = await this.runQuery(sql);
  //   return results;
  // }

  public async deleteById(id: number): Promise<T> {
    const sql = `DELETE FROM ${this.table} WHERE id=($1) RETURNING *`;
    const results = await this.runQuery(sql, [id]);
    return this.returnOne(results);
  }

}
