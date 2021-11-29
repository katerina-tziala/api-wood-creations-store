import { OrderStore, Order, OrderStatus } from '../../src/api/models/Order';
import { OrderItemStore, OrderItem } from '../../src/api/models/OrderItem';
import { USERS, PRODUCTS } from './mock-data';

const orderStore: OrderStore = new OrderStore();
const itemStore: OrderItemStore = new OrderItemStore();

export async function createCompletedOrder() {
  const order: Order = await orderStore.create({
    customer_id: USERS[0].id,
    created_at: new Date()
  });
  const completeOrder = await orderStore.completeOrderById(
    order.id,
    new Date()
  );
  const orderItems = getRandomItems(order.id);
  const items = await createOrderItems(orderItems);
  return { ...completeOrder, items };
}

export async function deleteOrder(id: number) {
  return await orderStore.deleteById(id);
}

export async function createCurrentOrder() {
  const order: Order = await orderStore.create({
    customer_id: USERS[0].id,
    status: OrderStatus.Active,
    created_at: new Date()
  });
  const orderItems = getRandomItems(order.id, 5, 7);
  const items = await createOrderItems(orderItems);
  return { ...order, items };
}

function getRandomItems(
  order_id: number,
  startIndex = 0,
  endIndex = 6
): Array<Omit<OrderItem, 'id'>> {
  const orderItems: Omit<OrderItem, 'id'>[] = PRODUCTS.slice(
    startIndex,
    endIndex
  ).map(product => {
    return { product_id: product.id, quantity: 1, order_id };
  });
  const sameItem = { ...orderItems[0] };
  orderItems.push(sameItem);
  return orderItems;
}

async function createOrderItems(
  items: Array<Omit<OrderItem, 'id'>>
): Promise<OrderItem[]> {
  const requests = items.map(item => itemStore.create(item));
  return Promise.all(requests);
}
