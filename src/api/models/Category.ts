import { ModelStore, ModelType } from './_ModelStore';

export interface Category extends ModelType {
  name: string;
}

export class CategoryStore extends ModelStore<Category> {
  constructor() {
    super('category');
  }

}
