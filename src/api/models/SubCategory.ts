import { ModelStore } from './_ModelStore';
import { Category } from './Category';

export type SubCategory = Category & {
  category_id: number;
};

export class SubCategoryStore extends ModelStore<SubCategory> {
  constructor() {
    super('sub_category');
  }
}
