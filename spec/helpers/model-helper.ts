import { ModelStore, ModelType } from '../../src/api/models/_ModelStore';

function selectId(data: Array<Partial<ModelType>>): number {
  const ids: number[] = data.map(record => record.id || 0);
  return Math.max(...ids) || 0;
}

export function hasBasicMethods<T, U>(
  model: T extends ModelStore<U> ? any : any
): void {
  describe('should have methods for basic CRUD operations', () => {
    const methodNames = [
      'create',
      'getById',
      'getAll',
      'updateById',
      'deleteById',
      'deleteAll'
    ];

    methodNames.forEach(method => {
      it(`should have a ${method} method`, () => {
        expect(model[method]).toBeDefined();
      });
    });
  });
  0;
}

export function testGetMethods<T, U>(
  model: T extends ModelStore<U> ? any : any,
  initTest: Function
) {
  let expectedData: Array<Partial<ModelType>> = [];
  let id = 0;

  beforeAll(async (): Promise<void> => {
    await model.deleteAll();
    expectedData = await initTest();
    id = selectId(expectedData);
  });

  it('should return a list of all records using getAll method', async () => {
    await expectAsync(model.getAll()).toBeResolvedTo(expectedData);
  });

  it(`should return the correct record when using getById method`, async () => {
    const result: Partial<ModelType> = await model.getById(id);
    expect(result).toBeDefined();
    expect(result.id).toBe(id);
  });

  it('should throw an error when using the getById method with an id that does not exist', async () => {
    await expectAsync(model.getById(id + 1)).toBeRejected();
  });

  afterAll(async (): Promise<void> => await model.deleteAll());
}

export function testDeleteMethods<T, U>(
  model: T extends ModelStore<U> ? any : any,
  initTest: Function
) {
  let expectedData: Array<Partial<ModelType>> = [];
  let id = 0;

  beforeAll(async (): Promise<void> => {
    await model.deleteAll();
    const data = await initTest();
    id = selectId(data);
    expectedData = data.filter(
      (record: Partial<ModelType>) => record.id !== id
    );
  });

  it(`should delete and return the correct record when using deleteById method`, async () => {
    const result: Partial<ModelType> = await model.deleteById(id);
    expect(result).toBeDefined();
    expect(result.id).toBe(id);
    expect(
      expectedData.find(existingRecord => existingRecord.id === id)
    ).not.toBeDefined();
  });

  it('should throw an error when using the deleteById method with an id that does not exist', async () => {
    await expectAsync(model.deleteById(id + 1)).toBeRejected();
  });

  it('should delete all records', async () => {
    const result: Array<Partial<ModelType>> = await model.deleteAll();
    expect(result.length).toEqual(expectedData.length);
  });
}
