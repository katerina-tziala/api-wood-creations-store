import {
  hasBasicMethods,
  testGetlMethods,
  testDeletelOneError,
  testDeletelOneSuccess,
  testDeletelAllFailure,
  runDeleteAllSuccess
} from '../../../../spec/helpers/model-helpers/model-helper';

import { CategoryStore, Category } from '../../../../src/api/models/Category';
import { CATEGORIES } from '../../../helpers/model-helpers/dummy-data';
import {
  setData,
  deleteProducts,
  clearData
} from '../../../helpers/model-helpers/model-data-utils';

const MockData: Category[] = CATEGORIES;
const MockItem: Category = CATEGORIES[0];
const MockNewItem: Category = {
  id: 224,
  name: 'office supplies'
};
const store: CategoryStore = new CategoryStore();

describe('* Category Model *', () => {
  beforeAll(async (): Promise<void> => {
    await setData();
  });

  afterAll(async (): Promise<void> => {
    await clearData();
  });

  hasBasicMethods<CategoryStore, Category>(store);

  describe('- Create Methods', () => runCreationTest());

  describe('- Read Methods', () => {
    testGetlMethods<CategoryStore, Category>(store, MockData, {
      singular: 'category',
      plural: 'categories'
    });
  });

  describe('- Update Methods', () => runUpdateTest());

  describe('- Delete Methods', () => runDeletionTest());
});

function creationSuccess() {
  it('create: should create a new category when passing name only', async () => {
    const created: Category = await store.create({ name: 'test' });
    expect(created).toBeDefined();
    expect(created.id).toBeDefined();
    expect(created.name).toBe('test');
    MockData.push({ ...created });
  });

  it('create: should create a new category when passing id and name', async () => {
    await expectAsync(store.create(MockNewItem)).toBeResolvedTo(MockNewItem);
    MockData.push(MockNewItem);
  });
}

function runCreationTest() {
  it('create: should throw an error when no data passed', async () => {
    await expectAsync(store.create({})).toBeRejected();
  });

  it('create: should throw an error when id is not unique', async () => {
    await expectAsync(
      store.create({ id: MockItem.id, name: 'test' })
    ).toBeRejected();
  });

  it('create: should throw an error when name is not defined', async () => {
    await expectAsync(store.create({ id: 4 })).toBeRejected();
  });

  it('create: should throw an error when name is not unique', async () => {
    await expectAsync(store.create({ name: MockItem.name })).toBeRejected();
  });
  creationSuccess();
}

function runUpdateTest() {
  it('update: should throw an error when id is not present in data', async () => {
    await expectAsync(store.update({ name: 'update test' })).toBeRejected();
  });

  it('update: should throw an error when name is not defined', async () => {
    await expectAsync(store.update({ id: MockItem.id })).toBeRejected();
  });

  it('update: should throw an error when name is not unique', async () => {
    const updateData = { ...MockItem, name: MockNewItem.name };
    await expectAsync(store.update(updateData)).toBeRejected();
  });

  it('update: should update correctly a category when data is passed', async () => {
    const updateData = { ...MockItem, name: 'update test' };
    const result: Category = await store.update(updateData);
    expect(result).toEqual(updateData);
  });
}

function runDeletionTest() {
  testDeletelOneError<CategoryStore, Category>(
    store,
    0,
    'category that does not exist'
  );

  testDeletelOneError<CategoryStore, Category>(
    store,
    1,
    'category that relates to a product'
  );

  testDeletelOneSuccess<CategoryStore, Category>(
    store,
    MockNewItem,
    'category'
  );

  testDeletelAllFailure<CategoryStore, Category>(
    store,
    'categories and there are related products'
  );

  it(`deleteAll: should delete all categories`, async () => {
    await deleteProducts();
    await runDeleteAllSuccess<CategoryStore, Category>(store);
  });
}
