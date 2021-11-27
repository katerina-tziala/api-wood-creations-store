import { ModelStore, ModelType } from './_ModelStore';

export interface OrderItem extends ModelType {
  order_id: number;
  product_id: number;
  quantity: number;
  engraving?: string;
  name?: string;
  price?: string;
  category_id?: number;
  description?: string;
}

export class OrderItemStore extends ModelStore<OrderItem> {
  constructor() {
    const selectQuery =
      `SELECT order_item.*, product.name as name, product.price as price, product.category_id as category_id, product.description as description`
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
    const { id, quantity, engraving } = data;
    const updateData: Partial<OrderItem> = { id };
    if (quantity) {
      updateData.quantity = quantity;
    }
    if (engraving && engraving.length) {
      updateData.engraving = engraving;
    }

    return super.update(updateData);
  }

  public async getItemsByOrderId(order_id: number): Promise<OrderItem[]> {
    return await this.getBykey(order_id, 'order_id');
  }

  public async deleteByIdAndOrderId(
    id: number,
    orderId: number
  ): Promise<OrderItem> {
    const sql = `DELETE FROM ${this.table} WHERE id=($1) AND order_id=($2) RETURNING *`;
    const results = await this.runQuery(sql, [id, orderId]);
    return this.returnOne(results);
  }

  public async getByIdAndOrderId(
    id: number,
    orderId: number
  ): Promise<OrderItem> {
    const sql = `${this.selectQuery} WHERE ${this.table}.id=($1) AND ${this.table}.order_id=($2)`;
    const results = await this.runQuery(sql, [id, orderId]);
    return this.returnOne(results);
  }
}
