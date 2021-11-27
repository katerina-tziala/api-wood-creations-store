import { ModelStore, ModelType } from './_ModelStore';

export interface Category extends ModelType {
  name: string;
}

export class CategoryStore extends ModelStore<Category> {
  constructor() {
    super('category');
  }

  public async create(data: Omit<Category, 'id'>): Promise<Category> {
    return super.create(data);
  }

  public async update(data: Category): Promise<Category> {
    return super.update(data);
  }
}
