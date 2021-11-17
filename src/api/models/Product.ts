import { ModelStore, ModelType } from './_ModelStore';

export interface Product extends ModelType {
  name: string;
  price: string;
  category_id: number;
  // category?: string;
  description?: string;
}

export class ProductStore extends ModelStore<Product> {
  constructor() {
    const selectQuery = `SELECT product.*, category.name as category`
      .concat(` FROM product`)
      .concat(` INNER JOIN category`)
      .concat(` ON category.id = product.category_id`);
    super('product');
  }

  public async create(data: Partial<Product>): Promise<Product> {
    // const { category, ...properties } = data;
    //validate data
    return super.create(data);
  }

  public async update(data: Partial<Product>): Promise<Product> {
    // const { category, ...properties } = data;
    //validate data
    return super.update(data);
  }

  public async getByCategory(id: number): Promise<Product[]> {
    return await this.getBykey(id, 'category_id');
  }
}
