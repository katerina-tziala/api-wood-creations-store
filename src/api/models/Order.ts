import { ModelStore, ModelType } from './_ModelStore';

export enum OrderStatus {
  Active = 'active',
  Complete = 'complete'
}

export interface Order extends ModelType {
  customer_id: number;
  status: OrderStatus;
  created_at: Date;
  completed_at?: Date;
  comments?: string;
  total?: string;
}

export class OrderStore extends ModelStore<Order> {
  constructor() {
    super('customer_order');
  }

  private async getOrdersOfUseBryStatus(
    userId: number,
    status: OrderStatus,
    options = 'ORDER BY id DESC'
  ): Promise<Order[]> {
    const sql = `${this.selectQuery} WHERE customer_id=($1) AND status=($2) ${options}`;
    return await this.runQuery(sql, [userId, status]);
  }

  public async create(data: Partial<Order>): Promise<Order> {
    const { total, ...newOrder } = data;
    newOrder.status = OrderStatus.Active;
    newOrder.created_at = new Date();
    return super.create(newOrder);
  }

  public async completeOrderById(id: number): Promise<Order> {
    const data: Partial<Order> = {
      id,
      status: OrderStatus.Complete,
      completed_at: new Date()
    };

    return super.update(data);
  }

  public async getOrdersOfUser(userId: number): Promise<Order[]> {
    const sql = `${this.selectQuery} WHERE customer_id=($1) ORDER BY created_at DESC`;
    return await this.runQuery(sql, [userId]);
  }

  public async getActiveOrdersOfUser(userId: number): Promise<Order[]> {
    return await this.getOrdersOfUseBryStatus(
      userId,
      OrderStatus.Active,
      'ORDER BY created_at DESC'
    );
  }

  public async getCompletedOrdersOfUser(
    userId: number,
    limit?: number
  ): Promise<Order[]> {
    const options = limit ? `LIMIT ${limit}` : '';
    return await this.getOrdersOfUseBryStatus(
      userId,
      OrderStatus.Complete,
      `ORDER BY completed_at DESC ${options}`
    );
  }

  public async getCurrentOrderOfUser(
    userId: number
  ): Promise<Order | undefined> {
    const results = await this.getOrdersOfUseBryStatus(
      userId,
      OrderStatus.Active,
      'ORDER BY created_at DESC LIMIT 1'
    );
    return results.length ? results[0] : undefined;
  }
}
