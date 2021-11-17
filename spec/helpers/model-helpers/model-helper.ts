import { ModelStore, ModelType } from '../../../src/api/models/_ModelStore';

const DEFAULT_METHODS = [
  'create',
  'getById',
  'getAll',
  'update',
  'deleteById',
  'deleteAll'
];

export function hasBasicMethods<T extends ModelStore<U>, U extends ModelType>(
  store: T,
  expectedMethods: string[] = DEFAULT_METHODS
): void {
  expectedMethods.forEach(method =>
    testHasMethod(store, method as keyof typeof store)
  );
}

export function testHasMethod<T extends ModelStore<U>, U extends ModelType>(
  store: T,
  method: keyof typeof store
): void {
  it(`should have method: ${method}`, () => {
    expect(store[method]).toBeDefined();
  });
}

export function testGetlMethods<T extends ModelStore<U>, U extends ModelType>(
  store: T,
  mockData: U[],
  text: { singular: string; plural: string }
) {
  it(`getAll: should return a list of all ${text.plural}`, async () => {
    await expectAsync(store.getAll()).toBeResolvedTo(mockData);
  });

  it(`getById: should return the correct ${text.singular}`, async () => {
    const result: Partial<ModelType> = await store.getById(mockData[0].id);
    expect(result).toEqual(mockData[0]);
  });

  it(`getById: should throw an error when trying to get a ${text.singular} that does not exist`, async () => {
    await expectAsync(store.getById(0)).toBeRejected();
  });
}

export function testDeletelOneError<
  T extends ModelStore<U>,
  U extends ModelType
>(store: T, id: number, reason: string) {
  it(`deleteById: should throw an error when trying to delete ${reason}`, async () => {
    await expectAsync(store.deleteById(id)).toBeRejected();
  });
}

export function testDeletelOneSuccess<
  T extends ModelStore<U>,
  U extends ModelType
>(store: T, item: U, reason: string) {
  it(`deleteById: should delete the correct ${reason}`, async () => {
    await expectAsync(store.deleteById(item.id)).toBeResolvedTo(item);
    const result: Array<Partial<ModelType>> = await store.getAll();
    expect(result.find(record => record.id === item.id)).not.toBeDefined();
  });
}

export function testDeletelAllFailure<
  T extends ModelStore<U>,
  U extends ModelType
>(store: T, reason: string) {
  it(`deleteAll: should throw an error when trying to delete all ${reason}`, async () => {
    await expectAsync(store.deleteById(3)).toBeRejected();
  });
}

export async function runDeleteAllSuccess<
  T extends ModelStore<U>,
  U extends ModelType
>(store: T): Promise<void> {
  await expectAsync(store.deleteAll()).toBeResolved();
  const result: Array<Partial<ModelType>> = await store.getAll();
  expect(result.length).toBe(0);
  return;
}

//   it('should delete all records', async () => {
//     const result: Array<Partial<ModelType>> = await store.deleteAll();
//     expect(result.length).toEqual(expectedData.length);
//   });
