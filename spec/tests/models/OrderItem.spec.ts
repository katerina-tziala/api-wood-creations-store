import {
  hasBasicMethods,
  runCreationFailureForOmittedKey,
  runDeleteByIdSuccessTest
} from '../../helpers/model-helpers/model-helper';
import {
  OrderItemStore,
  OrderItem
} from '../../../src/api/models/OrderItem';
import {
  createCurrentOrderWithoutItems,
  deleteOrder
} from '../../helpers/test-data';
import { PRODUCTS } from '../../helpers/mock-data';
import { Order } from '../../../src/api/models/Order';
import { ErrorType } from '../../../src/utilities/error-handling/error-type.enum';
const store: OrderItemStore = new OrderItemStore();
const METHODS = [
  'create',
  'getAll',
  'getById',
  'getItemsByOrderId',
  'getByIdAndOrderId',
  'update',
  'deleteById',
  'deleteByIdAndOrderId'
];

let order: Order;
let MockData: OrderItem[] = [];

describe('* OrderItem Model * ', () => {
  beforeAll(async () => {
    order = await createCurrentOrderWithoutItems();
  });

  afterAll(async () => {
    await deleteOrder(order.id);
  });

  hasBasicMethods<OrderItemStore, OrderItem>(store, METHODS);
  describe('- Method create', () => runCreateTest());
  describe('- Method getAll', () => runGetAllTest());
  describe('- Method getById', () => runGetByIdTest());
  describe('- Method getItemsByOrderId', () => runGetByOrderIdTest());
  describe('- Method getByIdAndOrderId', () => runGetByIdAndOrderIdTest());
  describe('- Method update', () => runUpdateTest());
  describe('- Method deleteById', () => runDeleteByIdTest());
  describe('- Method deleteByIdAndOrderId', () =>
    runDeleteByIdAndOrderIdTest());
});

function runCreateTest() {
  const product = PRODUCTS[0];
  const product_id = product.id;
  const quantity = 1;
  const engraving = 'custom engraving';

  describe('> should create a new order item:', () => {
    it('with the specified data', async () => {
      const data = { order_id: order.id, product_id, quantity, engraving };
      const item: OrderItem = await store.create(data);

      expect(item).toBeDefined();
      expect(item.id).toBeDefined();
      expect(item.order_id).toBe(order.id);
      expect(item.product_id).toBe(product_id);
      expect(item.quantity).toBe(quantity);
      expect(item.engraving).toBe(engraving);

      MockData.push({
        ...item,
        name: product.name,
        price: product.price,
        category_id: product.category_id,
        description: product.description
      });
    });
  });

  runCreateFailTest({ product_id, quantity, engraving });
}

function runCreateFailTest(data: Partial<OrderItem>): void {
  const { product_id, quantity, engraving } = data;

  describe('> should throw an error when:', () => {
    it('no data passed', async () => {
      await expectAsync(store.create({})).toBeRejectedWithError(
        ErrorType.ValuesRequired
      );
    });

    runCreationFailureForOmittedKey<OrderItemStore, OrderItem>(
      store,
      { product_id, quantity, engraving },
      'order_id'
    );

    runCreationFailureForOmittedKey<OrderItemStore, OrderItem>(
      store,
      { order_id: 1, quantity, engraving },
      'product_id'
    );

    runCreationFailureForOmittedKey<OrderItemStore, OrderItem>(
      store,
      { order_id: 1, product_id, engraving },
      'quantity'
    );

    it('quantity is 0', async () => {
      await expectAsync(
        store.create({ order_id: 1, product_id, quantity: 0, engraving })
      ).toBeRejected();
    });

    it('quantity is negative', async () => {
      await expectAsync(
        store.create({ order_id: 1, product_id, quantity: -2, engraving })
      ).toBeRejected();
    });
  });
}

function runGetAllTest(): void {
  it(`should return a list of all order items`, async () => {
    await expectAsync(store.getAll()).toBeResolvedTo(MockData);
  });
}

function runGetByIdTest(): void {
  it(`should throw an error when order item with the specified id does not exist`, async () => {
    await expectAsync(store.getById(0)).toBeRejectedWithError(
      ErrorType.NotFound
    );
  });
  it(`should return the order item with the specified id when it exists`, async () => {
    await expectAsync(store.getById(MockData[0].id)).toBeResolvedTo(
      MockData[0]
    );
  });
}

function runGetByOrderIdTest(): void {
  it(`should return the order items of an order that exists`, async () => {
    await expectAsync(store.getItemsByOrderId(order.id)).toBeResolvedTo(
      MockData
    );
  });

  it(`return an empty array when order not exist`, async () => {
    await expectAsync(store.getItemsByOrderId(100)).toBeResolvedTo([]);
  });
}

function runGetByIdAndOrderIdTest(): void {
  it(`should throw an error when order item with the specified id does not exist in order`, async () => {
    await expectAsync(
      store.getByIdAndOrderId(order.id, 12)
    ).toBeRejectedWithError(ErrorType.NotFound);
  });

  it(`should throw an error when order item does not exist`, async () => {
    await expectAsync(
      store.getByIdAndOrderId(100, MockData[0].id)
    ).toBeRejectedWithError(ErrorType.NotFound);
  });

  it(`should return the order item with the specified id`, async () => {
    await expectAsync(
      store.getByIdAndOrderId(MockData[0].id, order.id)
    ).toBeResolvedTo(MockData[0]);
  });
}

function runDeleteByIdTest(): void {
  it('should delete the correct order item  with the specified id when it exists', async () => {
    const { name, price, description, category_id, ...toDelete } = MockData[0];
    await runDeleteByIdSuccessTest<OrderItemStore, OrderItem>(store, toDelete);
  });
  it('should throw an error when trying to delete an order item that does not exist', async () => {
    await expectAsync(store.deleteById(100)).toBeRejectedWithError(
      ErrorType.NotFound
    );
  });
}

function runDeleteByIdAndOrderIdTest(): void {
  it('should delete the correct order item  with the specified id when it exists in the specified order', async () => {
    const item: OrderItem = await store.create({
      order_id: order.id,
      product_id: PRODUCTS[0].id,
      quantity: 1
    });
    await expectAsync(store.deleteById(item.id)).toBeResolvedTo(item);
    const result: OrderItem[] = await store.getAll();
    expect(result.find(record => record.id === item.id)).not.toBeDefined();
  });

  it('should throw an error when trying to delete an order item that does not exist', async () => {
    await expectAsync(
      store.deleteByIdAndOrderId(100, order.id)
    ).toBeRejectedWithError(ErrorType.NotFound);
  });

  it('should throw an error when trying to delete an order item when order does not exist', async () => {
    await expectAsync(
      store.deleteByIdAndOrderId(MockData[0].id, 100)
    ).toBeRejectedWithError(ErrorType.NotFound);
  });
}

function runUpdateTest(): void {
  it('should update correctly a product when data valid', async () => {
    const itemToUpdate = MockData[0];
    const { name, price, description, category_id, id, ...data } = MockData[0];
    const updateData = {
      id,
      quantity: 4,
      engraving: ' - '
    };

    const result: OrderItem = await store.update(updateData);
    expect(result).toEqual({ ...data, ...updateData });
    MockData[0] = { ...itemToUpdate, ...updateData };
  });
  runUpdateFailTest();
}

function runUpdateFailTest(): void {
  describe('> should throw an error when:', () => {
    it('id is not present in data', async () => {
      const { id, ...data } = MockData[0];
      await expectAsync(store.update(data)).toBeRejectedWithError(
        ErrorType.IdRequired
      );
    });

    it('update data not defined', async () => {
      const { id, ...data } = MockData[0];
      await expectAsync(store.update({ id })).toBeRejectedWithError(
        ErrorType.ValuesRequired
      );
    });

    it('quantity is negative', async () => {
      const { name, price, description, category_id, ...data } = MockData[0];
      await expectAsync(store.update({ ...data, quantity: -2 })).toBeRejected();
    });
  });
}
