import { ModelStore, ModelType } from './_ModelStore';

export interface OrderItem extends ModelType {
  order_id: number;
  product_id: number;
  quantity: number;
  engraving?: string | null;
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

  private getEngraving(engraving: string | undefined): string | null {
    return !engraving ? null : engraving.length > 0 ? engraving : null;
  }

  private getCreationData(data: Partial<OrderItem>): Partial<OrderItem> {
    const { order_id, product_id, quantity, engraving } = data;
    return {
      order_id,
      product_id,
      quantity,
      engraving: this.getEngraving(engraving as string)
    };
  }

  private getUpdateData(data: Partial<OrderItem>): Partial<OrderItem> {
    const { id, quantity, engraving } = data;
    const updateData: Partial<OrderItem> = { id };
    if (quantity) {
      updateData.quantity = quantity;
    }
    if (engraving) {
      updateData.engraving = this.getEngraving(engraving);
    }
    return updateData;
  }

  public async create(data: Partial<OrderItem>): Promise<OrderItem> {
    return super.create(this.getCreationData(data));
  }

  public async update(data: Partial<OrderItem>): Promise<OrderItem> {
    return super.update(this.getUpdateData(data));
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
