import {
  hasBasicMethods,
  testGetMethods,
  testDeleteMethods
} from '../../../helpers/model-helper';
import { CategoryStore, Category } from '../../../../src/api/models/Category';
import { createCategories } from '../../../helpers/model-data-utils';

const data = { name: 'accessoires' };
const category: CategoryStore = new CategoryStore();

async function initGetTest() {
  let categories = await createCategories();
  categories = categories.sort((recordA, recordB) => recordA.id - recordB.id);
  return categories;
}

function testCreation() {
  beforeAll(async (): Promise<void> => {
    await category.deleteAll();
  });

  it('should create a category using the create method', async () => {
    const result: Category = await category.create(data);
    expect(result?.id).toBeDefined();
  });

  it('should throw an error when name is not unique', async () => {
    await expectAsync(category.create(data)).toBeRejected();
  });

  it('should throw an error when name is not defined', async () => {
    await expectAsync(category.create({})).toBeRejected();
  });

  afterAll(async (): Promise<void> => {
    await category.deleteAll();
  });
}

function testUpdate() {
  let selectedRecord: Category;
  const name = 'test category';
  const namePass = 'another category';

  beforeAll(async (): Promise<void> => {
    await category.deleteAll();
    await category.create({ name });
    selectedRecord = await category.create(data);
  });

  it('should update a category using the updateById method', async () => {
    const result: Category = await category.updateById(selectedRecord.id, {
      name: namePass
    });
    expect(result?.name).toEqual(namePass);
  });

  it('should throw an error when name is not unique', async () => {
    await expectAsync(
      category.updateById(selectedRecord.id, { name })
    ).toBeRejected();
  });

  it('should throw an error when name is not defined', async () => {
    await expectAsync(
      category.updateById(selectedRecord.id, {})
    ).toBeRejected();
  });

  it('should throw an error when id is not defined', async () => {
    await expectAsync(
      category.updateById(selectedRecord.id + 1, { name })
    ).toBeRejected();
  });

  afterAll(async (): Promise<void> => {
    await category.deleteAll();
  });
}

describe('Category Store', () => {
  hasBasicMethods<CategoryStore, Category>(category);

  describe('create category', () => {
    testCreation();
  });

  describe('get category', () => {
    testGetMethods<CategoryStore, Category>(category, initGetTest);
  });

  describe('delete category', () => {
    testDeleteMethods<CategoryStore, Category>(category, initGetTest);
  });

  describe('update category', () => {
    testUpdate();
  });
});
