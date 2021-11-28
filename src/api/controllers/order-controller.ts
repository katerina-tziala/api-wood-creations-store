import { ErrorType } from '../../utilities/error-handling/error-type.enum';
import { Order, OrderStore } from '../models/Order';
import { OrderItem, OrderItemStore } from '../models/OrderItem';

export class OrderController {
  private OrderStore = new OrderStore();
  private OrderItemStore = new OrderItemStore();

  private async createOrderItem(
    order_id: number,
    orderItem: OrderItem
  ): Promise<OrderItem> {
    try {
      const itemData = { ...orderItem, order_id };
      const item: OrderItem = await this.OrderItemStore.create(itemData);
      return item;
    } catch (error) {
      await this.OrderStore.deleteById(order_id);
      throw new Error(ErrorType.OrderCreationFailed);
    }
  }

  private async getCurrentOrderOfUser(userId: number): Promise<Order> {
    const order = await this.OrderStore.getCurrentOrderOfUser(userId);
    if (!order) {
      throw new Error(ErrorType.CurrentOrderNotFound);
    }
    return order;
  }

  private async checkCurrentOrderExistence(userId: number): Promise<undefined> {
    const order = await this.OrderStore.getCurrentOrderOfUser(userId);
    if (order) {
      throw new Error(ErrorType.CurrentOrderExists);
    }
    return;
  }

  private async getOrderById(id: number): Promise<Order> {
    const order: Order = await this.OrderStore.getById(id);
    return this.fetchItemsListForOrder(order);
  }

  private async fetchItemsListForOrder(order: Order): Promise<Order> {
    const items: OrderItem[] = await this.OrderItemStore.getItemsByOrderId(
      order.id
    );
    return { ...order, items };
  }

  private async fetchItemsForOrders(orders: Order[]): Promise<Order[]> {
    if (!orders.length) {
      return orders;
    }
    const requests = orders.map(order => this.fetchItemsListForOrder(order));
    return Promise.all(requests);
  }

  private async orderHasItems(orderId: number): Promise<boolean> {
    const items: OrderItem[] = await this.OrderItemStore.getItemsByOrderId(
      orderId
    );
    return !!items.length;
  }

  public async createOrder(
    newOrder: Partial<Order>,
    orderItem: OrderItem
  ): Promise<Order> {
    // if there is a current order, then the user cannot create a new one
    await this.checkCurrentOrderExistence(newOrder.customer_id as number);
    const order = await this.OrderStore.create(newOrder);
    await this.createOrderItem(order.id, orderItem);
    return this.getOrderById(order.id);
  }

  public async getCurrentOrder(userId: number): Promise<Order | null> {
    const order = await this.OrderStore.getCurrentOrderOfUser(userId);
    if (!order) {
      return null;
    }
    return this.fetchItemsListForOrder(order);
  }

  public async completeCurrentOrder(
    userId: number,
    completed_at: Date,
    comments?: string
  ): Promise<Order> {
    const order: Order = await this.getCurrentOrderOfUser(userId);
    await this.OrderStore.completeOrderById(order.id, completed_at, comments);
    return this.getOrderById(order.id);
  }

  public async deleteCurrentOrder(userId: number): Promise<Order> {
    const order: Order = await this.getCurrentOrderOfUser(userId);
    return await this.OrderStore.deleteById(order.id);
  }

  public async getOrdersOfUser(userId: number): Promise<Order[]> {
    const orders: Order[] = await this.OrderStore.getOrdersOfUser(userId);
    return this.fetchItemsForOrders(orders);
  }

  public async getCompletedOrdersOfUser(
    userId: number,
    limit?: number
  ): Promise<Order[]> {
    const orders: Order[] = await this.OrderStore.getCompletedOrdersOfUser(
      userId,
      limit
    );
    return this.fetchItemsForOrders(orders);
  }

  public async addItemInCurrentOrder(
    userId: number,
    orderItem: OrderItem
  ): Promise<Order> {
    const order: Order = await this.getCurrentOrderOfUser(userId);
    const order_id = order.id;
    await this.OrderItemStore.create({
      ...orderItem,
      order_id
    });
    return this.getOrderById(order_id);
  }

  public async updateItemInCurrentOrder(
    userId: number,
    itemId: number,
    updateData: Partial<OrderItem>
  ): Promise<Order> {
    const order: Order = await this.getCurrentOrderOfUser(userId);
    const order_id = order.id;
    // check if item in order
    await this.OrderItemStore.getByIdAndOrderId(itemId, order_id);
    await this.OrderItemStore.update({ ...updateData, id: itemId });
    return this.getOrderById(order_id);
  }

  public async deleteItemFromCurrentOrder(
    userId: number,
    itemId: number
  ): Promise<Order | null> {
    const order: Order = await this.getCurrentOrderOfUser(userId);
    const orderId = order.id;

    await this.OrderItemStore.deleteByIdAndOrderId(itemId, orderId);

    const hasItems = await this.orderHasItems(orderId);
    if (hasItems) {
      return this.getOrderById(orderId);
    }

    await this.OrderStore.deleteById(orderId);
    return null;
  }
}
