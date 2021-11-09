import {
  hasBasicMethods,
  testGetMethods,
  testDeleteMethods
} from '../../../helpers/model-helper';
import { CategoryStore, Category } from '../../../../src/api/models/Category';
import { createCategories } from '../../../helpers/model-data-utils';

const store: CategoryStore = new CategoryStore();

const data = { name: 'accessoires' };
async function initGetTest() {
  let categories = await createCategories();
  categories = categories.sort((recordA, recordB) => recordA.id - recordB.id);
  return categories;
}

function testCreation() {
  beforeAll(async (): Promise<void> => {
    await store.deleteAll();
  });

  it('should create a category using the create method', async () => {
    const result: Category = await store.create(data);
    expect(result?.id).toBeDefined();
  });

  it('should throw an error when name is not unique', async () => {
    await expectAsync(store.create(data)).toBeRejected();
  });

  it('should throw an error when name is not defined', async () => {
    await expectAsync(store.create({})).toBeRejected();
  });

  afterAll(async (): Promise<void> => {
    await store.deleteAll();
  });
}

function testUpdate() {
  let selectedRecord: Category;
  const name = 'test category';
  const namePass = 'another category';

  beforeAll(async (): Promise<void> => {
    await store.deleteAll();
    await store.create({ name });
    selectedRecord = await store.create(data);
  });

  it('should update a category using the updateById method', async () => {
    const result: Category = await store.updateById(selectedRecord.id, {
      name: namePass
    });
    expect(result?.name).toEqual(namePass);
  });

  it('should throw an error when name is not unique', async () => {
    await expectAsync(
      store.updateById(selectedRecord.id, { name })
    ).toBeRejected();
  });

  it('should throw an error when name is not defined', async () => {
    await expectAsync(store.updateById(selectedRecord.id, {})).toBeRejected();
  });

  it('should throw an error when id is not defined', async () => {
    await expectAsync(
      store.updateById(selectedRecord.id + 1, { name })
    ).toBeRejected();
  });

  afterAll(async (): Promise<void> => {
    await store.deleteAll();
  });
}

describe('Category Model', () => {
  hasBasicMethods<CategoryStore, Category>(store);

  describe('create category', () => {
    testCreation();
  });

  describe('get category', () => {
    testGetMethods<CategoryStore, Category>(store, initGetTest);
  });

  describe('delete category', () => {
    testDeleteMethods<CategoryStore, Category>(store, initGetTest);
  });

  describe('update category', () => {
    testUpdate();
  });
});
