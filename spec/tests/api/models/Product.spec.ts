import {
  hasBasicMethods,
  runCreationFailureForOmittedKey,
  runDeleteByIdSuccessTest
} from '../../../helpers/model-helpers/model-helper';
import { ProductStore, Product } from '../../../../src/api/models/Product';
import { ErrorType } from '../../../../src/utilities/error-handling/error-type.enum';
import { PRODUCTS } from '../../../helpers/mock-data';
import { CATEGORIES } from '../../../helpers/mock-data';
import { Category } from '../../../../src/api/models/Category';
import { Order } from '../../../../src/api/models/Order';
import {
  createCompletedOrder,
  createCurrentOrder,
  deleteOrder
} from '../../../helpers/test-data';

const METHODS = [
  'create',
  'getAll',
  'getById',
  'getByCategory',
  'getTopFive',
  'update',
  'deleteById'
];
// MOCK DATA
const MockData: Product[] = PRODUCTS;
const MockItem: Product = PRODUCTS[0];
const CATEGORY: Category = CATEGORIES[0];

const store: ProductStore = new ProductStore();

describe('* Product Model * ', () => {
  hasBasicMethods<ProductStore, Product>(store, METHODS);
  describe('- Method create', () => runCreateTest());
  describe('- Method getAll', () => runGetAllTest());
  describe('- Method getById', () => runGetByIdTest());
  describe('- Method getByCategory', () => runGetByCategoryTest());
  describe('- Method getTopFive', () => runGetTopFiveTest());
  describe('- Method update', () => runUpdateTest());
  describe('- Method deleteById', () => runDeleteByIdTest());
});

function runCreateTest() {
  const name = 'test product';
  const price = '12.75';
  const category_id = CATEGORY.id;
  const description = 'product description';

  describe('> should create a new product:', () => {
    it('with the specified data', async () => {
      const data = { category_id, name, price, description };
      const product: Product = await store.create(data);
      checkCreatedProduct(product, data);
      expect(product.description).toBe(description);
      MockData.push({ ...product, category: CATEGORY.name });
    });

    it('with description = null when description not specified', async () => {
      const data = { category_id, name, price };
      const product: Product = await store.create(data);
      checkCreatedProduct(product, data);
      expect(product.description).toBe(null);
      MockData.push({ ...product, category: CATEGORY.name });
    });

    it('with description = null when description is an empty string', async () => {
      const data = { category_id, name, price, description: '' };
      const product: Product = await store.create(data);
      checkCreatedProduct(product, data);
      expect(product.description).toBe(null);
      MockData.push({ ...product, category: CATEGORY.name });
    });
  });

  runCreateFailTest({ name, category_id, price, description });
}

function checkCreatedProduct(
  product: Product,
  expectedData: Omit<Product, 'id'>
): void {
  expect(product).toBeDefined();
  expect(product.id).toBeDefined();
  expect(product.name).toBe(expectedData.name);
  expect(product.category_id).toBe(expectedData.category_id);
  expect(product.price).toBe(expectedData.price);
}

function runCreateFailTest(data: Partial<Product>): void {
  const { name, category_id, price, description } = data;
  describe('> should throw an error when:', () => {
    it('no data passed', async () => {
      await expectAsync(store.create({})).toBeRejectedWithError(
        ErrorType.ValuesRequired
      );
    });

    runCreationFailureForOmittedKey<ProductStore, Product>(
      store,
      { name, price, description },
      'category_id'
    );

    it('category_id does not exist', async () => {
      const data = { category_id: 1000, name, price, description };
      await expectAsync(store.create(data)).toBeRejected();
    });

    runCreationFailureForOmittedKey<ProductStore, Product>(
      store,
      { category_id, price, description },
      'name'
    );

    it('name is shorter than 3 characters', async () => {
      const data = { category_id, name: 'na', price, description };
      await expectAsync(store.create(data)).toBeRejected();
    });

    runCreationFailureForOmittedKey<ProductStore, Product>(
      store,
      { category_id, name, description },
      'price'
    );

    it('price is not a positive value', async () => {
      const data = { category_id, name, price: '-5', description };
      await expectAsync(store.create(data)).toBeRejected();
    });
  });
}

function runGetAllTest(): void {
  it(`should return a list of all products`, async () => {
    await expectAsync(store.getAll()).toBeResolvedTo(MockData);
  });
}

function runGetByIdTest(): void {
  it(`should throw an error when product with the specified id does not exist`, async () => {
    await expectAsync(store.getById(0)).toBeRejectedWithError(
      ErrorType.NotFound
    );
  });
  it(`should return the product with the specified id when it exists`, async () => {
    const result: Product = await store.getById(MockItem.id);
    expect(result).toEqual(MockItem);
  });
}

function runGetByCategoryTest(): void {
  it(`should return an empty array when category does not exist`, async () => {
    await expectAsync(store.getByCategory(0)).toBeResolvedTo([]);
  });

  it(`should return all the products with the specified category id`, async () => {
    const expectedProducts = PRODUCTS.filter(
      product => product.category_id === CATEGORY.id
    );
    await expectAsync(store.getByCategory(CATEGORY.id)).toBeResolvedTo(
      expectedProducts
    );
  });
}

function runUpdateTest(): void {
  it('should update correctly a product when data valid', async () => {
    const itemToUpdate = [...MockData].pop() as Product;

    const { category, ...data } = itemToUpdate;
    const updateData = {
      ...data,
      name: 'updated product',
      price: '11.20',
      description: 'new description'
    };
    const result: Product = await store.update(updateData);
    expect(result).toEqual(updateData);
    MockData.pop();
    MockData.push({ ...result });
  });
  runUpdateFailTest();
}

function runUpdateFailTest(): void {
  describe('> should throw an error when:', () => {
    const itemToUpdate = [...MockData].pop() as Product;

    it('id is not present in data', async () => {
      const { id, ...data } = itemToUpdate;
      await expectAsync(store.update(data)).toBeRejectedWithError(
        ErrorType.IdRequired
      );
    });

    it('update data not defined', async () => {
      await expectAsync(
        store.update({ id: itemToUpdate.id })
      ).toBeRejectedWithError(ErrorType.ValuesRequired);
    });

    it('name is shorter than 3 characters', async () => {
      await expectAsync(
        store.update({ ...itemToUpdate, name: 'na' })
      ).toBeRejected();
    });

    it('category_id does not exist', async () => {
      await expectAsync(
        store.update({ ...itemToUpdate, category_id: 1000 })
      ).toBeRejected();
    });

    it('price is not a positive value', async () => {
      await expectAsync(
        store.update({ ...itemToUpdate, price: '-5' })
      ).toBeRejected();
    });
  });
}

function runGetTopFiveTest(): void {
  it(`should return an empty array when no orders`, async () => {
    await expectAsync(store.getTopFive()).toBeResolvedTo([]);
  });

  it(`should return 5 most popular products`, async () => {
    const completedOrder = await createCompletedOrder();
    const currentOrder = await createCurrentOrder();

    const expectedProductsIds = [1, 2, 3, 4, 5];
    const expectedProducts = PRODUCTS.filter(product =>
      expectedProductsIds.includes(product.id)
    );

    await expectAsync(store.getTopFive()).toBeResolvedTo(expectedProducts);
    await deleteOrder(completedOrder.id);
    await deleteOrder(currentOrder.id);
  });
}

function runDeleteByIdTest(): void {
  it('should delete the correct product with the specified id when it exists', async () => {
    const toDelete = [...MockData].pop() as Product;
    const { category, ...data } = toDelete;
    await runDeleteByIdSuccessTest<ProductStore, Product>(store, data);
  });
  runDeleteFailTest();
}

function runDeleteFailTest(): void {
  describe('> should throw an error when:', () => {
    let order: Order;
    beforeAll(async () => {
      order = await createCompletedOrder();
    });

    afterAll(async () => {
      await deleteOrder(order.id);
    });

    it('trying to delete a product that does not exist', async () => {
      await expectAsync(store.deleteById(0)).toBeRejectedWithError(
        ErrorType.NotFound
      );
    });
    it('trying to delete a product that relates to an ordered item', async () => {
      const orderItems = order.items || [];
      const productId = orderItems[0]?.product_id || 0;
      await expectAsync(store.deleteById(productId)).toBeRejected();
    });
  });
}
