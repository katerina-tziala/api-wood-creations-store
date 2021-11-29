import {
  hasBasicMethods,
  runDeleteByIdSuccessTest
} from '../../helpers/model-helpers/model-helper';
import {
  OrderStore,
  Order,
  OrderStatus
} from '../../../src/api/models/Order';
import { USERS } from '../../helpers/mock-data';
import { ErrorType } from '../../../src/utilities/error-handling/error-type.enum';
import {
  createCurrentOrderWithoutItems,
  deleteOrder
} from '../../helpers/test-data';

const METHODS = [
  'create',
  'getAll',
  'getById',
  'getOrdersOfUser',
  'getCurrentOrderOfUser',
  'completeOrderById',
  'getCompletedOrdersOfUser',
  'deleteById'
];

const store: OrderStore = new OrderStore();

let MockData: Order[] = [];

describe('* Order Model * ', () => {
  hasBasicMethods<OrderStore, Order>(store, METHODS);
  describe('- Method create', () => runCreateTest());
  describe('- Method getAll', () => runGetAllTest());
  describe('- Method getById', () => runGetByIdTest());
  describe('- Method getOrdersOfUser', () => runGetUserOrdersTest());
  describe('- Method getCurrentOrderOfUser', () =>
    runGetCurrentOrderOfUserTest());
  describe('- Method completeOrderById', () => runCompleteOrderTest());
  describe('- Method getCompletedOrdersOfUser', () => runCompletedOrdersTest());
  describe('- Method deleteById', () => runDeleteByIdTest());
});

function runCreateTest(): void {
  it('should create a new order with the specified data when data valid', async () => {
    const comments = 'order comments';
    const customer_id = USERS[0].id;
    const created_at = new Date();
    const order: Order = await store.create({
      customer_id,
      comments,
      created_at
    });

    expect(order).toBeDefined();
    expect(order.id).toBeDefined();
    expect(order.comments).toBe(comments);
    expect(order.created_at).toEqual(created_at);
    expect(order.status).toBe(OrderStatus.Active);

    MockData.push({ ...order, number_of_products: null, total: null });
  });
  runCreateFailTest();
}

function runCreateFailTest(): void {
  describe('> should throw an error when:', () => {
    it('no data passed', async () => {
      await expectAsync(store.create({})).toBeRejectedWithError(
        ErrorType.ValuesRequired
      );
    });

    it('customer_id is not defined', async () => {
      await expectAsync(
        store.create({ created_at: new Date() })
      ).toBeRejected();
    });

    it('created_at is not defined', async () => {
      await expectAsync(
        store.create({ customer_id: USERS[0].id })
      ).toBeRejected();
    });
  });
}

function runGetAllTest(): void {
  it(`should return a list of all orders`, async () => {
    await expectAsync(store.getAll()).toBeResolvedTo(MockData);
  });
}

function runGetByIdTest(): void {
  it(`should throw an error when order with the specified id does not exist`, async () => {
    await expectAsync(store.getById(0)).toBeRejectedWithError(
      ErrorType.NotFound
    );
  });
  it(`should return the order with the specified id when it exists`, async () => {
    await expectAsync(store.getById(MockData[0].id)).toBeResolvedTo(MockData[0]);
  });
}

function runGetUserOrdersTest(): void {
  it(`return an empty array when user does not exist`, async () => {
    await expectAsync(store.getOrdersOfUser(0)).toBeResolvedTo([]);
  });
  it(`should return the orders of the user with the specified id`, async () => {
    const result: Order[] = await store.getOrdersOfUser(
      MockData[0].customer_id
    );
    expect(result).toEqual(MockData);
  });
}

function runGetCurrentOrderOfUserTest(): void {
  it(`should return the active order of the user with the specified id`, async () => {
    const result: Order | undefined = await store.getCurrentOrderOfUser(
      MockData[0].customer_id
    );
    expect(result).toEqual(MockData[0]);
  });

  it(`return undefined when user does not exist`, async () => {
    const currentOrder: Order | undefined = await store.getCurrentOrderOfUser(
      0
    );
    expect(currentOrder).toBeUndefined();
  });

  it(`return undefined when current order does not exist`, async () => {
    await deleteOrder(MockData[0].id);
    const currentOrder: Order | undefined = await store.getCurrentOrderOfUser(
      0
    );
    expect(currentOrder).toBeUndefined();
  });
}

function runCompleteOrderTest(): void {
  it(`should throw an error when current active order does not exist`, async () => {
    await expectAsync(
      store.completeOrderById(1, new Date())
    ).toBeRejectedWithError(ErrorType.NotFound);
  });

  it('should complete the current active order when it exists and data correct', async () => {
    const order: Order = await createCurrentOrderWithoutItems();
    const completedOrder: Order = await store.completeOrderById(
      order.id,
      new Date()
    );
    expect(completedOrder.status).toBe(OrderStatus.Complete);
    MockData = [{ ...completedOrder, number_of_products: null, total: null }];
  });
}

function runCompletedOrdersTest(): void {
  it('should return the completed orders of the user', async () => {
    await expectAsync(
      store.getCompletedOrdersOfUser(USERS[0].id)
    ).toBeResolvedTo(MockData);
  });

  it(`return an empty array when user does not exist`, async () => {
    await expectAsync(store.getCompletedOrdersOfUser(0)).toBeResolvedTo([]);
  });

  it(`return an empty array when complete orders do not exist`, async () => {
    await deleteOrder(MockData[0].id);
    await expectAsync(
      store.getCompletedOrdersOfUser(USERS[0].id)
    ).toBeResolvedTo([]);
  });
}

function runDeleteByIdTest(): void {
  it('should delete the correct category with the specified id when it exists', async () => {
    const order: Order = await createCurrentOrderWithoutItems();
    await runDeleteByIdSuccessTest<OrderStore, Order>(store, order);
  });

  it('should throw an error when trying to delete an order that does not exist', async () => {
    await expectAsync(store.deleteById(2)).toBeRejectedWithError(
      ErrorType.NotFound
    );
  });
}
