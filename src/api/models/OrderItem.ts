import { ModelStore, ModelType } from './_ModelStore';

export interface OrderItem extends ModelType {
  order_id: number;
  product_id: number;
  quantity: number;
  engraving?: string;
  name?: string;
  price?: string;
}

export class OrderItemStore extends ModelStore<OrderItem> {
  constructor() {
    const selectQuery =
      `SELECT order_item.*, product.name as name, product.price as price`
        .concat(` FROM order_item`)
        .concat(` INNER JOIN product`)
        .concat(` ON order_item.product_id = product.id`);
    super('order_item', selectQuery);
  }

  public async create(data: Partial<OrderItem>): Promise<OrderItem> {
    // data validation
    const { name, price, ...properties } = data;
    return super.create(properties);
  }

  public async update(data: Partial<OrderItem>): Promise<OrderItem> {
    // data validation
    const { name, price, ...properties } = data;
    return super.update(properties);
  }

  public async getItemsByOrderId(order_id: number): Promise<OrderItem[]> {
    return await this.getBykey(order_id, 'order_id');
  }
}

