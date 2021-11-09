import { ModelStore, ModelType } from './_ModelStore';

export interface OrderItem extends ModelType {
  order_id: number;
  product_id: number;
  quantity: number;
  engraving?: string;
}

export class OrderItemStore extends ModelStore<OrderItem> {
  constructor() {
    const selectQuery = `SELECT order_item.*, product.name, product.price`
      .concat(` FROM order_item`)
      .concat(` INNER JOIN product`)
      .concat(` ON order_item.product_id = product.id`);
    super('order_item', selectQuery);
  }

  public async getOrderItems(order_id: number): Promise<OrderItem[]> {
    return await this.getByRelationId(order_id, 'order_id');
  }
}
