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
    const selectQuery = `SELECT id, username, firstname, lastname, role FROM store_user`;
    super('store_user', selectQuery);
  }

  private getUserRole(role: keyof typeof UserRole): UserRole {
    return UserRole[role] || UserRole.Customer;
  }

  public async create(data: Omit<User, 'id'>): Promise<User> {
    const newUserData: Omit<User, 'id'> = {
      username: data.username,
      firstname: data.firstname,
      lastname: data.lastname,
      role: this.getUserRole(data.role),
      password: data.password ? encryptPassword(data.password) : null
    };

    const { password, ...createdUser } = await super.create(newUserData);
    return createdUser;
  }

  public async update(updateData: Partial<User>): Promise<User> {
    if (updateData.password) {
      updateData.password = encryptPassword(updateData.password);
    }
    if (updateData.role) {
      updateData.role = this.getUserRole(updateData.role);
    }
    const { password, ...updated } = await super.update(updateData);
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
}
