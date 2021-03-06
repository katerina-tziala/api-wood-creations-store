import { OrderStatus } from './Order';
import { ModelStore, ModelType } from './_ModelStore';

export interface Product extends ModelType {
  name: string;
  price: string;
  category_id: number;
  category?: string;
  description?: string | null;
}

export class ProductStore extends ModelStore<Product> {
  constructor() {
    const selectQuery =
      'SELECT product.*, category.name as category FROM product'
        .concat(' INNER JOIN category')
        .concat(' ON product.category_id = category.id');
    super('product', selectQuery);
  }

  public async create(data: Omit<Partial<Product>, 'id'>): Promise<Product> {
    if (Object.values(data).length) {
      data.description = this.getOptionalString(data.description as string);
    }
    return super.create(data);
  }

  public async update(data: Partial<Product>): Promise<Product> {
    if (Object.values(data).length && data.description !== undefined) {
      data.description = this.getOptionalString(data.description);
    }
    return super.updateModel(data);
  }

  public async getByCategory(id: number): Promise<Product[]> {
    return await this.getBykey(id, 'category_id');
  }

  public async getTopFive(): Promise<Product[]> {
    const distinct_products =
      'SELECT DISTINCT order_id, product_id FROM order_item'
        .concat(
          ' INNER JOIN customer_order ON customer_order.id = order_item.order_id'
        )
        .concat(` WHERE customer_order.status='${OrderStatus.Complete}'`);

    const popular =
      'SELECT ordered_products.product_id, COUNT(ordered_products.order_id) as times_ordered'.concat(
        ` FROM (${distinct_products}) as ordered_products GROUP BY ordered_products.product_id`
      );
    const sql =
      `${this.selectQuery} INNER JOIN (${popular}) as popular ON popular.product_id = product.id`
        .concat(' ORDER BY times_ordered DESC, product_id ASC')
        .concat(' LIMIT 5');
    return this.runQuery(sql);
  }
}
