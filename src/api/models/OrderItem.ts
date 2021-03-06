import { ModelStore, ModelType } from './_ModelStore';

export interface OrderItem extends ModelType {
  order_id: number;
  product_id: number;
  quantity: number;
  engraving?: string | null;
  name?: string;
  price?: string;
  category_id?: number;
  description?: string | null;
}

export class OrderItemStore extends ModelStore<OrderItem> {
  constructor() {
    const selectQuery =
      'SELECT order_item.*, product.name as name, product.price as price, product.category_id as category_id, product.description as description'
        .concat(' FROM order_item  INNER JOIN product')
        .concat(' ON order_item.product_id = product.id');
    super('order_item', selectQuery);
  }

  private getCreationData(data: Partial<OrderItem>): Partial<OrderItem> {
    const { order_id, product_id, quantity, engraving } = data;
    return {
      order_id,
      product_id,
      quantity,
      engraving: this.getOptionalString(engraving as string)
    };
  }

  private getUpdateData(data: Partial<OrderItem>): Partial<OrderItem> {
    const { id, quantity, engraving } = data;
    const updateData: Partial<OrderItem> = { id };
    if (quantity) {
      updateData.quantity = quantity;
    }
    if (engraving !== undefined) {
      updateData.engraving = this.getOptionalString(engraving);
    }
    return updateData;
  }

  public async create(
    data: Omit<Partial<OrderItem>, 'id'>
  ): Promise<OrderItem> {
    const creationData = !Object.values(data).length
      ? data
      : this.getCreationData(data);
    return super.create(creationData);
  }

  public async update(data: Partial<OrderItem>): Promise<OrderItem> {
    const updateData = !Object.values(data).length
      ? data
      : this.getUpdateData(data);
    return super.updateModel(updateData);
  }

  public async getItemsByOrderId(order_id: number): Promise<OrderItem[]> {
    return await this.getBykey(order_id, 'order_id');
  }

  public async getByIdAndOrderId(
    id: number,
    orderId: number
  ): Promise<OrderItem> {
    const sql = `${this.selectQuery} WHERE ${this.table}.id=($1) AND ${this.table}.order_id=($2)`;
    const results = await this.runQuery(sql, [id, orderId]);
    return this.returnOne(results);
  }

  public async deleteByIdAndOrderId(
    id: number,
    orderId: number
  ): Promise<OrderItem> {
    const sql = `DELETE FROM ${this.table} WHERE id=($1) AND order_id=($2) RETURNING *`;
    const results = await this.runQuery(sql, [id, orderId]);
    return this.returnOne(results);
  }
}
