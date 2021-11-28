import { Category } from '../../../src/api/models/Category';
import { Product } from '../../../src/api/models/Product';

export const CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'accessoires'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    category_id: 1,
    name: 'accessoires',
    price: '13.5'
  }
];
