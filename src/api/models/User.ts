import { ModelStore, ModelType } from './_ModelStore';

export interface User extends ModelType {
  username: string;
  first_name: string;
  last_name: string;
  password?: string;
}

export class UserStore extends ModelStore<User> {
  constructor() {
    const selectQuery = `SELECT store_user.id, store_user.username, store_user.first_name, store_user.last_name  FROM store_user`;
    super('store_user', selectQuery);
  }

  public async create(data: Partial<User>): Promise<User> {
    console.log('encrypt password');

    return super.create(data);
  }

  public async update(data: Partial<User>): Promise<User> {
    console.log('encrypt password');

    return super.update(data);
  }
}
