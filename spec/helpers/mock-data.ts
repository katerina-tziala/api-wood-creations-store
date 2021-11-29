import { Category } from '../../src/api/models/Category';
import { Product } from '../../src/api/models/Product';
import { User, UserRole } from '../../src/api/models/User';

export const CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'accessoires'
  },
  {
    id: 2,
    name: 'office supplies'
  },
  {
    id: 3,
    name: 'seasonally'
  },
  {
    id: 4,
    name: 'decorations'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    category_id: 1,
    name: 'earrings dark wood',
    price: '12.50',
    description: 'dark wood earrings for women',
    category: 'accessoires'
  },
  {
    id: 2,
    category_id: 1,
    name: 'bracelet',
    price: '15.00',
    description: 'dark wood bracelet for men',
    category: 'accessoires'
  },
  {
    id: 3,
    category_id: 1,
    name: 'bow tie',
    price: '18.00',
    description: 'light wood bow tie for men',
    category: 'accessoires'
  },
  {
    id: 4,
    category_id: 1,
    name: 'aviator watch',
    price: '120.00',
    description: 'light wood watch',
    category: 'accessoires'
  },
  {
    id: 5,
    category_id: 2,
    name: 'calendar',
    price: '20.00',
    description: null,
    category: 'office supplies'
  },
  {
    id: 6,
    category_id: 2,
    name: 'mousepad',
    price: '12.00',
    description: null,
    category: 'office supplies'
  },
  {
    id: 7,
    category_id: 2,
    name: 'pencil container',
    price: '8.60',
    description: 'pencil container for kids',
    category: 'office supplies'
  },
  {
    id: 8,
    category_id: 2,
    name: 'rule',
    price: '5.60',
    description: 'rule witm metrics in inches and cm',
    category: 'office supplies'
  },
  {
    id: 9,
    category_id: 2,
    name: 'bookmark',
    price: '9.00',
    description: null,
    category: 'office supplies'
  },
  {
    id: 10,
    category_id: 3,
    name: 'christmas ball',
    price: '12.00',
    description: 'christmas tree wooden ball',
    category: 'seasonally'
  },
  {
    id: 11,
    category_id: 4,
    name: 'photo frame',
    price: '20.00',
    description: null,
    category: 'decorations'
  },
  {
    id: 12,
    category_id: 4,
    name: 'memory box',
    price: '32.00',
    description: null,
    category: 'decorations'
  }
];

export const USERS: User[] = [
  {
    id: 1,
    username: 'admin',
    firstname: 'Admin',
    lastname: 'Root',
    role: UserRole.Admin
  }
];
