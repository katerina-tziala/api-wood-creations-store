import { Pool, PoolClient, QueryResult } from 'pg';
import { dbConf } from '../../config/config';

export interface ModelType {
  id: number;
}

export class ModelStore<T> {
  protected table = '';
  protected selectQuery: string;
  private dbConn: Pool = new Pool(dbConf);

  constructor(table: string, selectQuery?: string) {
    this.table = table;
    this.selectQuery = selectQuery ? selectQuery : `SELECT * FROM ${table}`;
  }

  private getCommaSeparatedValues(values: string[]): string {
    return values.join(', ');
  }

  private extractUpdateProperties(data: Partial<T>): string[] {
    let updateProperties = [];

    for (const [key, value] of Object.entries(data)) {
      const setValue = typeof value === 'string' ? `'${value}'` : `${value}`;
      updateProperties.push(`${key} = ${setValue}`);
    }
    return updateProperties;
  }

  private returnOne(results: Array<T>, id: number): T {
    const record = results[0];
    if (!record) {
      // TODO: error handling
      throw Error(`record with id ${id} does not exist`);
    }
    return record;
  }

  protected async runQuery<U>(sql: string, params: U[] = []): Promise<T[]> {
    try {
      const conn: PoolClient = await this.dbConn.connect();
      const result: QueryResult = await conn.query(sql, params);
      conn.release();
      return result.rows;
    } catch (err) {
      // TODO: error handling
      // console.log(err);
      throw new Error(`runQuery Error: ${err}`);
    }
  }

  protected async getByRelationId(
    id: number,
    relatedTable: string
  ): Promise<T[]> {
    const sql = `${this.selectQuery} WHERE ${relatedTable}=($1) ORDER BY id ASC`;
    return await this.runQuery(sql, [id]);
  }

  public async getAll(): Promise<T[]> {
    const sql = `${this.selectQuery} ORDER BY id ASC`;
    return await this.runQuery(sql);
  }

  public async getById(id: number): Promise<T> {
    const sql = `${this.selectQuery} WHERE id=($1)`;
    const results = await this.runQuery(sql, [id]);
    return this.returnOne(results, id);
  }

  public async create(data: Partial<T>): Promise<T> {
    const sqlParams = Object.values(data);

    const properties = Object.keys(data).join(', ');
    const valuesIndexes = sqlParams.map((_, index) => `$${index + 1}`);
    const valuesString = this.getCommaSeparatedValues(valuesIndexes);

    const sql = `INSERT INTO ${this.table} (${properties}) VALUES(${valuesString}) RETURNING *`;
    const results = await this.runQuery(sql, sqlParams);
    return results[0];
  }

  public async updateById(id: number, data: Partial<T>): Promise<T> {
    const queryParams = this.extractUpdateProperties(data);
    const setQuery = this.getCommaSeparatedValues(queryParams);

    const sql = `UPDATE ${this.table} SET ${setQuery} WHERE id=($1) RETURNING *`;
    const results = await this.runQuery(sql, [id]);
    return this.returnOne(results, id);
  }

  public async deleteById(id: number): Promise<T> {
    const sql = `DELETE FROM ${this.table} WHERE id=($1) RETURNING *`;
    const results = await this.runQuery(sql, [id]);
    return this.returnOne(results, id);
  }

  public async deleteAll(): Promise<T[]> {
    const sql = `DELETE FROM ${this.table} RETURNING *`;
    const results = await this.runQuery(sql);
    return results;
  }
}
