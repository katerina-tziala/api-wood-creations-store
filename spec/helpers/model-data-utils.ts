import { Category, CategoryStore } from '../../src/api/models/Category';

export async function createCategories(): Promise<Category[]> {
  const categoriesNames = [
    'accessoires',
    'office supplies',
    'seasonally',
    'decorations'
  ];
  const category: CategoryStore = new CategoryStore();
  
  const records = categoriesNames.map(async name => {
    const resut = await category.create({ name });
    return resut;
  });

  return await Promise.all(records);
}
