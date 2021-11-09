import express, { Response } from 'express';

import { CategoryStore } from './models/Category';
import { SubCategoryStore } from './models/SubCategory';

const api = express.Router();

const category: CategoryStore = new CategoryStore();
const subcategory: SubCategoryStore = new SubCategoryStore();

api.get('/', async (_, res: Response): Promise<void> => {
  console.log('sss');

  try {
    const name = 'accessoires';
    // seasonally
    //'office supplies'
    // const test = await category.create({ name });

    // const test = await category.getAll();
    // const test = await category.getById(1);

    // const test = await category.deleteById(9);

    // const test = await category.updateById(8, { name: 'accessoires' });

    const test = await subcategory.getAll();

    // const test = await subcategory.create({ name: 'er', category_id: 12 });

    console.log(test);
  } catch (err) {
    console.log(err);
    //
  }

  res.status(200).send('API is listening...');
});

export default api;
