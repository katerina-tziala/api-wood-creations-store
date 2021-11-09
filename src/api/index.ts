import express, { Response } from 'express';

import { CategoryStore } from './models/Category';
import { ProductStore } from './models/Product';

import { UserStore } from './models/User';

const api = express.Router();

const category: CategoryStore = new CategoryStore();

const product: ProductStore = new ProductStore();
const user: UserStore = new UserStore();

api.get('/', async (_, res: Response): Promise<void> => {
  console.log('sss');

  try {
    const name = 'accessoires';
    // seasonally
    //'office supplies'
    //  const test = await category.create({ name });

    // const test = await category.getAll();
    // const test = await category.getById(1);

    // const test = await category.deleteById(9);

    // const test = await category.updateById(8, { name: 'accessoires' });


    
    // const test = await product.getAll();
    // const test = await product.updateById(1, { category: 'accessoires' });

    const test = await product.getAllByCategory(1);
    // const test = await user.create({
    //   username: 'angie',
    //   first_name: 'Angela',
    //   last_name: 'Tziala',
    //   password: 'asdad'
    // });

    console.log(test);
  } catch (err) {
    console.log(err);
    //
  }

  res.status(200).send('API is listening...');
});

export default api;
