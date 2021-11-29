import { Pool, PoolClient, QueryResult } from 'pg';
import { dbConf } from '../../config/config';
import { ErrorType } from '../../utilities/error-handling/error-type.enum';
import * as QUERY from './models-utilities/query-helper';

export interface ModelType {
  id: number;
}

export class ModelStore<T extends ModelType> {
  protected table = '';
  protected selectQuery: string;
  private dbConn: Pool = new Pool(dbConf);

  constructor(table: string, selectQuery?: string) {
    this.table = table;
    this.selectQuery = selectQuery ? selectQuery : `SELECT * FROM ${table}`;
  }

  private getKeysAndValues(data: Omit<Partial<T>, 'id'>): {
    keys: string[];
    values: unknown[];
  } {
    const keys = Object.keys(data);
    const values = Object.values(data);
    if (!values.length) {
      throw new Error(ErrorType.ValuesRequired);
    }
    return { keys, values };
  }

  protected returnOne(results: Array<T>): T {
    const record = results[0];
    if (!record) {
      throw new Error(ErrorType.NotFound);
    }
    return record;
  }

  protected getOptionalString(value: string | undefined | null): string | null {
    return !value ? null : value.length > 0 ? value : null;
  }

  protected async runQuery<U>(sql: string, params: U[] = []): Promise<T[]> {
    const conn: PoolClient = await this.dbConn.connect();
    const result: QueryResult = await conn.query(sql, params);
    conn.release();
    return result.rows;
  }

  protected async getBykey(id: number, key: string): Promise<T[]> {
    const sql = `${this.selectQuery} WHERE ${this.table}.${key}=($1) ORDER BY id ASC`;
    return await this.runQuery(sql, [id]);
  }

  public async create(data: Omit<Partial<T>, 'id'>): Promise<T> {
    const { keys, values } = this.getKeysAndValues(data);
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
    if (!id) {
      throw new Error(ErrorType.IdRequired);
    }
    const { keys, values } = this.getKeysAndValues(data);
    const where = `id=($${keys.length + 1})`;
    const sql = QUERY.getUpdateQuery(this.table, keys, where);
    const results = await this.runQuery(sql, [...values, id]);
    return results[0];
  }

  public async deleteById(id: number): Promise<T> {
    const sql = `DELETE FROM ${this.table} WHERE id=($1) RETURNING *`;
    const results = await this.runQuery(sql, [id]);
    return this.returnOne(results);
  }
}
