import { ModelStore, ModelType } from './_ModelStore';

export type Category = ModelType & {
  name: string;
};

export class CategoryStore extends ModelStore<Category> {
  constructor() {
    super('category');
  }
}
