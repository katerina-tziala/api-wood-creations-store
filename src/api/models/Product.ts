import { ModelStore, ModelType } from './_ModelStore';

export interface Product extends ModelType {
  name: string;
  price: string;
  category_id: number;
  category?: string;
  description?: string;
}

export class ProductStore extends ModelStore<Product> {
  constructor() {
    const selectQuery =
      `SELECT product.*, category.name as category`
        .concat(` FROM product`)
        .concat(` INNER JOIN category`)
        .concat(` ON category.id = product.category_id`);
    super('product', selectQuery);
  }

  public async getAllByCategory(id: number): Promise<Product[]> {
    return await this.getByRelationId(id, 'category_id');
  }

}
