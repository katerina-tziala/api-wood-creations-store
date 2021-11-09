import express, { Response } from 'express';

import { CategoryStore } from './models/Category';
import { OrderStatus, OrderStore } from './models/Order';
import { ProductStore } from './models/Product';

import { UserStore } from './models/User';

const api = express.Router();

const category: CategoryStore = new CategoryStore();

const product: ProductStore = new ProductStore();
const user: UserStore = new UserStore();
const order: OrderStore = new OrderStore();

api.get('/', async (_, res: Response): Promise<void> => {
  console.log('sss');

  try {
    // const test = await category.getAll();

    // const test = await category.create({
    //   name: 'test'
    // });

    // const test = await category.getById(1);

    // const test = await category.deleteById(10);

    // const test = await category.updateById(1, { name: 'acessoires' });

    // const test = await product.getAll();
    // const test = await product.updateById(1, { category: 'accessoires' });

    // const test = await product.getAllByCategory(1);
    // const test = await user.create({
    //   username: 'angie',
    //   first_name: 'Angela',
    //   last_name: 'Tziala',
    //   password: 'asdad'
    // });
    const test = await order.create({
      customer_id: 1,
      // status: OrderStatus.active,
      // created_at: new Date()
    });
    console.log(test);
  } catch (err) {
    console.log(err);
    //
  }

  res.status(200).send('API is listening...');
});

export default api;
