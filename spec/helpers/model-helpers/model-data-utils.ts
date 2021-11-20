import { Category, CategoryStore } from '../../../src/api/models/Category';
import { Product, ProductStore } from '../../../src/api/models/Product';
import { ModelStore, ModelType } from '../../../src/api/models/_ModelStore';
import { CATEGORIES, PRODUCTS } from './dummy-data';

export async function createCategories(): Promise<Category[]> {
  const store: CategoryStore = new CategoryStore();
  return await createAll<CategoryStore, Category>(store, CATEGORIES);
}

export async function createProducts(): Promise<Product[]> {
  const store: ProductStore = new ProductStore();
  return await createAll<ProductStore, Product>(store, PRODUCTS);
}

export async function deleteProducts(): Promise<void> {
  const store: ProductStore = new ProductStore();
  // await store.deleteAll();
  return;
}

async function deleteCategories(): Promise<void> {
  const store: CategoryStore = new CategoryStore();
  // await store.deleteAll();
  return;
}

export async function clearData(): Promise<void> {
  await deleteProducts();
  await deleteCategories();
  return;
}

export async function setData(): Promise<void> {
  await clearData();
  await createCategories();
  await createProducts();
  return;
}

async function createAll<T extends ModelStore<U>, U extends ModelType>(
  store: T,
  data: Array<U>
): Promise<U[]> {
  const records = await data.map(async item => {
    const resut = await store.create(item);
    return resut;
  });
  return await Promise.all(records);
}
