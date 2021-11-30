import { ModelStore, ModelType } from './_ModelStore';
import {
  encryptPassword,
  passwordsMatch
} from '../../utilities/password-encryption';
import { Order } from './Order';

export enum UserRole {
  Admin = 'Admin',
  Customer = 'Customer'
}

export interface User extends ModelType {
  username: string;
  firstname: string;
  lastname: string;
  role: UserRole;
  password?: string | null;
  recentOrders?: Order[];
  currentOrder?: Order;
}

export class UserStore extends ModelStore<User> {
  constructor() {
    const selectQuery =
      'SELECT id, username, firstname, lastname, role FROM store_user';
    super('store_user', selectQuery);
  }

  private getUserRole(role: keyof typeof UserRole): UserRole {
    return UserRole[role] || UserRole.Customer;
  }

  public async create(data: Omit<Partial<User>, 'id'>): Promise<User> {
    if (Object.values(data).length) {
      data.role = this.getUserRole(data.role as UserRole);
      data.password = data.password ? encryptPassword(data.password) : null;
    }
    // prettier-ignore
    // eslint-disable-next-line
    const { password, ...createdUser } = await super.create(data);
    return createdUser;
  }

  public async update(data: Partial<User>): Promise<User> {
    if (data.password) {
      data.password = encryptPassword(data.password);
    }
    if (data.role) {
      data.role = this.getUserRole(data.role);
    }
    // prettier-ignore
    // eslint-disable-next-line
    const { password, ...updated } = await super.updateModel(data);
    return updated;
  }

  public async authenticate(
    username: string,
    password: string
  ): Promise<User | null> {
    const sql = `SELECT * from ${this.table} WHERE username=($1)`;
    const results = await this.runQuery(sql, [username]);
    const user = results[0];
    return user && passwordsMatch(password, user.password as string)
      ? user
      : null;
  }

  public async deleteById(id: number): Promise<User> {
    // prettier-ignore
    // eslint-disable-next-line
    const { password, ...updated } = await super.deleteById(id);
    return updated;
  }
}
