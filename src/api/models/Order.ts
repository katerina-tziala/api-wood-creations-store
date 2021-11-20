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
  comments?: string;
  total?: string;
  number_of_products?: string;
  items?: OrderItem[];
}

//SELECT customer_order.*, COUNT(order_item.id) as numberOfItems
//FROM customer_order LEFT JOIN order_item ON customer_order.id = order_item.order_id GROUP BY customer_order.id;

// SELECT customer_order.*, SUM(order_product.quantity) as number_of_products, SUM(total) as total FROM customer_order LEFT JOIN (SELECT order_item.*, product.name as name, product.price as price, product.price * order_item.quantity as total FROM order_item INNER JOIN product ON order_item.product_id = product.id ) as order_product ON customer_order.id = order_product.order_id GROUP BY customer_order.id;

export class OrderStore extends ModelStore<Order> {
  constructor() {
    super('customer_order');
  }

  public async create(
    newOrder: Partial<Order>
  ): Promise<Order> {
    // validate data
    newOrder.status = OrderStatus.Active;
    return super.create(newOrder);
  }



  
  // private async getOrdersOfUseBryStatus(
  //   userId: number,
  //   status: OrderStatus,
  //   options = 'ORDER BY id DESC'
  // ): Promise<Order[]> {
  //   const sql = `${this.selectQuery} WHERE customer_id=($1) AND status=($2) ${options}`;
  //   return await this.runQuery(sql, [userId, status]);
  // }

  // public async completeOrderById(id: number): Promise<Order> {
  //   const data: Partial<Order> = {
  //     id,
  //     status: OrderStatus.Complete,
  //     completed_at: new Date()
  //   };

  //   return super.update(data);
  // }

  // public async getOrdersOfUser(userId: number): Promise<Order[]> {
  //   const sql = `${this.selectQuery} WHERE customer_id=($1) ORDER BY created_at DESC`;
  //   return await this.runQuery(sql, [userId]);
  // }

  // public async getActiveOrdersOfUser(userId: number): Promise<Order[]> {
  //   return await this.getOrdersOfUseBryStatus(
  //     userId,
  //     OrderStatus.Active,
  //     'ORDER BY created_at DESC'
  //   );
  // }

  // public async getCompletedOrdersOfUser(
  //   userId: number,
  //   limit?: number
  // ): Promise<Order[]> {
  //   const options = limit ? `LIMIT ${limit}` : '';
  //   return await this.getOrdersOfUseBryStatus(
  //     userId,
  //     OrderStatus.Complete,
  //     `ORDER BY completed_at DESC ${options}`
  //   );
  // }

  // public async getCurrentOrderOfUser(
  //   userId: number
  // ): Promise<Order | undefined> {
  //   const results = await this.getOrdersOfUseBryStatus(
  //     userId,
  //     OrderStatus.Active,
  //     'ORDER BY created_at DESC LIMIT 1'
  //   );
  //   return results.length ? results[0] : undefined;
  // }
}
