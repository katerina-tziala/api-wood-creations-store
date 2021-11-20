import { Order, OrderStore } from '../models/Order';
import { OrderItem, OrderItemStore } from '../models/OrderItem';

export class OrderController {
  private OrderStore = new OrderStore();
  private OrderItemStore = new OrderItemStore();

  public async createOrder(
    newOrder: Partial<Order>,
    orderItem: OrderItem
  ): Promise<Order> {
    if (!orderItem) {
      throw new Error('NO_ITEMS_IN_ORDER');
    }
    // validate data
    // if active order do not create a new one
    const order = await this.OrderStore.create(newOrder);
    const items: OrderItem[] = await this.createOrderItem(
      order.id as number,
      orderItem
    );
    return { ...order, items };
  }

  private async createOrderItem(
    order_id: number,
    orderItem: OrderItem
  ): Promise<OrderItem[]> {
    try {
      const itemData = { ...orderItem, order_id };
      const item: OrderItem = await this.OrderItemStore.create(itemData);
      return [item];
    } catch (error) {
      //   console.log(error);
      //   console.log('delete order!!!!');
      throw new Error('ORDER_ITEM_NOT_CREATED');
    }
  }
}
