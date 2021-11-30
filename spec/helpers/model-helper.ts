import { ModelStore, ModelType } from '../../src/api/models/_ModelStore';

export const DEFAULT_METHODS = [
  'create',
  'getAll',
  'getById',
  'update',
  'deleteById'
];

export function hasBasicMethods<T extends ModelStore<U>, U extends ModelType>(
  store: T,
  expectedMethods: string[] = DEFAULT_METHODS
): void {
  expectedMethods.forEach(method =>
    testHasMethod(store, method as keyof typeof store)
  );
}

function testHasMethod<T extends ModelStore<U>, U extends ModelType>(
  store: T,
  method: keyof typeof store
): void {
  it(`should have method: ${method}`, () => {
    expect(store[method]).toBeDefined();
  });
}

export async function runDeleteByIdSuccessTest<
  T extends ModelStore<U>,
  U extends ModelType
>(store: T, mockItem: U): Promise<void> {
  await expectAsync(store.deleteById(mockItem.id)).toBeResolvedTo(mockItem);
  const result: Array<Partial<ModelType>> = await store.getAll();
  expect(result.find(record => record.id === mockItem.id)).not.toBeDefined();
  return;
}

export function runCreationFailureForOmittedKey<
  T extends ModelStore<U>,
  U extends ModelType
>(store: T, data: Partial<U>, omittedKey: string) {
  it(`${omittedKey} is not specified`, async () => {
    await expectAsync(store.create(data)).toBeRejected();
  });
}
