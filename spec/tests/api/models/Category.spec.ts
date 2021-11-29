import {
  hasBasicMethods,
  runDeleteByIdSuccessTest
} from '../../../../spec/helpers/model-helpers/model-helper';
import { CategoryStore, Category } from '../../../../src/api/models/Category';
import { ErrorType } from '../../../../src/utilities/error-handling/error-type.enum';
import { CATEGORIES } from '../../../helpers/mock-data';

// MOCK DATA
const MockData: Category[] = CATEGORIES;
const MockItem: Category = CATEGORIES[0];

const store: CategoryStore = new CategoryStore();

describe('* Category Model *', () => {
  hasBasicMethods<CategoryStore, Category>(store);
  describe('- Method create', () => runCreateTest());
  describe('- Method getAll', () => runGetAllTest());
  describe('- Method getById', () => runGetByIdTest());
  describe('- Method update', () => runUpdateTest());
  describe('- Method deleteById', () => runDeleteByIdTest());
});

function runCreateTest(): void {
  it('should create a new category with the specified data when data valid', async () => {
    const name = 'various';
    const category: Category = await store.create({ name });

    expect(category).toBeDefined();
    expect(category.id).toBeDefined();
    expect(category.name).toBe(name);

    MockData.push({ ...category });
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

    it('name is not unique', async () => {
      await expectAsync(store.create({ name: MockItem.name })).toBeRejected();
    });

    it('name is shorter than 3 characters', async () => {
      await expectAsync(store.create({ name: 'na' })).toBeRejected();
    });
  });
}

function runGetByIdTest(): void {
  it(`should throw an error when category with the specified id does not exist`, async () => {
    await expectAsync(store.getById(0)).toBeRejectedWithError(
      ErrorType.NotFound
    );
  });
  it(`should return the category with the specified id when it exists`, async () => {
    const result: Category = await store.getById(MockItem.id);
    expect(result).toEqual(MockItem);
  });
}

function runGetAllTest(): void {
  it(`should return a list of all categories`, async () => {
    await expectAsync(store.getAll()).toBeResolvedTo(MockData);
  });
}

function runDeleteByIdTest(): void {
  it('should delete the correct category with the specified id when it exists', async () => {
    const toDelete = [...MockData].pop() as Category;
    await runDeleteByIdSuccessTest<CategoryStore, Category>(store, toDelete);
  });
  runDeleteFailTest();
}

function runDeleteFailTest(): void {
  describe('> should throw an error when:', () => {
    it('trying to delete a category that does not exist', async () => {
      await expectAsync(store.deleteById(0)).toBeRejectedWithError(
        ErrorType.NotFound
      );
    });

    it('trying to delete a category that relates to a product', async () => {
      await expectAsync(store.deleteById(MockItem.id)).toBeRejected();
    });
  });
}

function runUpdateTest(): void {
  const name = 'various updated';
  it('should update correctly a category when data valid', async () => {
    const toUpdate = [...MockData].pop() as Category;
    const updateData = { ...toUpdate, name };
    const result: Category = await store.update(updateData);
    expect(result).toEqual(updateData);
    MockData.pop();
    MockData.push({ ...result });
  });
  runUpdateFailTest(name);
}

function runUpdateFailTest(name: string): void {
  describe('> should throw an error when:', () => {
    it('id is not present in data', async () => {
      await expectAsync(store.update({ name })).toBeRejectedWithError(
        ErrorType.IdRequired
      );
    });

    it('name is not defined', async () => {
      await expectAsync(
        store.update({ id: MockItem.id })
      ).toBeRejectedWithError(ErrorType.ValuesRequired);
    });

    it('when name is not unique', async () => {
      const toUpdate = [...MockData].pop() as Category;
      const updateData = { ...toUpdate, name: MockItem.name };
      await expectAsync(store.update(updateData)).toBeRejected();
    });

    it('name is shorter than 3 characters', async () => {
      const toUpdate = [...MockData].pop() as Category;
      const updateData = { ...toUpdate, name: 'na' };
      await expectAsync(store.update(updateData)).toBeRejected();
    });
  });
}
