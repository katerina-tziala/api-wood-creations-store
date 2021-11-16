import { ModelStore, ModelType } from './_ModelStore';
import {
  encryptPassword,
  passwordsMatch
} from '../../utilities/password-encryption';

export enum UserRole {
  Admin = 'Admin',
  Customer = 'Customer'
}

export interface User extends ModelType {
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  password?: string;
}

export class UserStore extends ModelStore<User> {
  constructor() {
    const selectQuery = `SELECT store_user.id, store_user.username, store_user.firstName, store_user.lastName, store_user.role FROM store_user`;
    super('store_user', selectQuery);
  }

  public async create(data: Exclude<User, 'id'>): Promise<User> {
    const { username, firstName, lastName, password, role } = data;
    const userPassword = encryptPassword(password as string);
    // validate data before running query
    return super.create({
      username,
      firstName,
      lastName,
      password: userPassword,
      role: UserRole[role] || UserRole.Customer
    });
  }

  public async update(data: Partial<User>): Promise<User> {
    const { password, ...updated } = await super.update(data);

    console.log('encrypt password');
    // validate data before running query
    return updated;
  }

  public async authenticate(
    username: string,
    password: string
  ): Promise<User | null> {
    const sql = `SELECT * from ${this.table} WHERE username=($1) ORDER BY id ASC`;
    const results = await this.runQuery(sql, [username]);
    const user = results[0];
    return user && passwordsMatch(password, user.password as string)
      ? user
      : null;
  }
}
