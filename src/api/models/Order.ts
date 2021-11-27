import { OrderItem } from './OrderItem';
import { ModelStore, ModelType } from './_ModelStore';

export enum OrderStatus {
  Active = 'Active',
  Complete = 'Complete'
}

export interface Order extends ModelType {
  customer_id: number;
  status: OrderStatus;
  created_at: Date;
  completed_at?: Date;
  comments?: string | null;
  total?: string;
  number_of_products?: string;
  items?: OrderItem[];
}

export class OrderStore extends ModelStore<Order> {
  constructor() {
    const selectQuery =
      `SELECT * FROM (SELECT customer_order.*, SUM(order_product.quantity) as number_of_products, SUM(total) as total`
        .concat(` FROM customer_order LEFT JOIN`)
        .concat(
          ` (SELECT order_item.*, product.price * order_item.quantity as total FROM order_item INNER JOIN product ON order_item.product_id = product.id) as order_product`
        )
        .concat(
          ` ON customer_order.id = order_product.order_id GROUP BY customer_order.id ORDER BY created_at DESC) as customer_order`
        );
    super('customer_order', selectQuery);
  }

  private async getOrdersOfUseByStatus(
    userId: number,
    status: OrderStatus,
    options = ''
  ): Promise<Order[]> {
    const sql = `${this.selectQuery} WHERE customer_id=($1) AND status=($2) ORDER BY completed_at DESC ${options}`;
    return await this.runQuery(sql, [userId, status]);
  }

  private getComments(comments: string | undefined): string | null {
    return !comments ? null : comments.length > 0 ? comments : null;
  }

  public async create(newOrder: Partial<Order>): Promise<Order> {
    newOrder.status = OrderStatus.Active;
    newOrder.comments = this.getComments(newOrder.comments as string);
    return super.create(newOrder);
  }

  public async completeOrderById(
    id: number,
    completed_at: Date,
    comments?: string
  ): Promise<Order> {
    const status = OrderStatus.Complete;
    const data: Partial<Order> = {
      id,
      status,
      completed_at
    };
    if (comments) {
      data.comments = this.getComments(comments);
    }
    return super.update(data);
  }

  public async getOrdersOfUser(userId: number): Promise<Order[]> {
    const sql = `${this.selectQuery} WHERE customer_id=($1) ORDER BY created_at DESC`;
    return await this.runQuery(sql, [userId]);
  }

  public async getCompletedOrdersOfUser(
    userId: number,
    limit?: number
  ): Promise<Order[]> {
    const options = limit ? `LIMIT ${limit}` : '';
    return await this.getOrdersOfUseByStatus(
      userId,
      OrderStatus.Complete,
      options
    );
  }

  public async getCurrentOrderOfUser(
    userId: number
  ): Promise<Order | undefined> {
    const results = await this.getOrdersOfUseByStatus(
      userId,
      OrderStatus.Active,
      'LIMIT 1'
    );
    return results[0];
  }
}
