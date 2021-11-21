import { Order, OrderStore } from '../models/Order';
import { OrderItem, OrderItemStore } from '../models/OrderItem';

export class OrderController {
  private OrderStore = new OrderStore();
  private OrderItemStore = new OrderItemStore();

  private async createOrderItem(
    order_id: number,
    orderItem: OrderItem
  ): Promise<OrderItem[]> {
    try {
      const itemData = { ...orderItem, order_id };
      const item: OrderItem = await this.OrderItemStore.create(itemData);
      return [item];
    } catch (error) {
      await this.OrderStore.deleteById(order_id);
      throw new Error('ORDER_NOT_CREATED_COULD_NOT_CREATE_ORDER_ITEMS');
    }
  }

  private async getCurrentOrderOfUser(userId: number): Promise<Order> {
    const order = await this.OrderStore.getCurrentOrderOfUser(userId);
    if (!order) {
      throw new Error('CURRENT_ORDER_DOES_NOT_EXIST');
    }
    return order;
  }

  private async checkCurrentOrderExistence(userId: number): Promise<undefined> {
    const order = await this.OrderStore.getCurrentOrderOfUser(userId);
    if (order) {
      throw new Error('CURRENT_ORDER_EXISTS_CANNOT_CREATE_NEW');
    }
    return;
  }

  private async getOrderById(id: number): Promise<Order> {
    const order: Order = await this.OrderStore.getById(id);
    const items: OrderItem[] = await this.OrderItemStore.getItemsByOrderId(
      order.id as number
    );
    return { ...order, items };
  }

  public async createOrder(
    newOrder: Partial<Order>,
    orderItem: OrderItem
  ): Promise<Order> {
    if (!orderItem) {
      throw new Error('NO_ITEMS_IN_ORDER');
    }
    // validate data
    // if there is a current order, then the user cannot create a new one
    await this.checkCurrentOrderExistence(newOrder.customer_id as number);

    const order = await this.OrderStore.create(newOrder);
    const items: OrderItem[] = await this.createOrderItem(
      order.id as number,
      orderItem
    );
    return { ...order, items };
  }

  public async getCurrentOrder(userId: number): Promise<Order> {
    const order: Order = await this.getCurrentOrderOfUser(userId);
    const items: OrderItem[] = await this.OrderItemStore.getItemsByOrderId(
      order.id as number
    );
    return { ...order, items };
  }

  public async deleteCurrentOrder(userId: number): Promise<Order> {
    const order: Order = await this.getCurrentOrderOfUser(userId);
    return await this.OrderStore.deleteById(order.id as number);
  }

  public async completeCurrentOrder(
    userId: number,
    completed_at: Date,
    comments?: string
  ): Promise<Order> {
    const order: Order = await this.getCurrentOrderOfUser(userId);
    await this.OrderStore.completeOrderById(
      order.id as number,
      completed_at,
      comments
    );
    return this.getOrderById(order.id as number);
  }

  public async addItemInCurrentOrder(
    userId: number,
    orderItem: OrderItem
  ): Promise<Order> {
    const order: Order = await this.getCurrentOrderOfUser(userId);
    await this.OrderItemStore.create({
      ...orderItem,
      order_id: order.id
    });
    return this.getCurrentOrder(userId);
  }

  public async updateItemInCurrentOrder(
    userId: number,
    itemId: number,
    updateData: Partial<OrderItem>
  ): Promise<Order> {
    const order: Order = await this.getCurrentOrderOfUser(userId);
    const orderId = order.id as number;
    // check if item in order
    await this.OrderItemStore.getByIdAndOrderId(itemId, orderId);
    await this.OrderItemStore.update({...updateData, id: itemId});
    return this.getCurrentOrder(userId);
  }

  public async deleteItemFromCurrentOrder(
    userId: number,
    itemId: number
  ): Promise<Order | null> {
    const order: Order = await this.getCurrentOrderOfUser(userId);
    const orderId = order.id as number;
    await this.OrderItemStore.deleteByIdAndOrderId(itemId, orderId);

    const items: OrderItem[] = await this.OrderItemStore.getItemsByOrderId(orderId);
    if (items.length) {
      return { ...order, items };
    }
    await this.OrderStore.deleteById(order.id as number);
    return null;
  }
}
