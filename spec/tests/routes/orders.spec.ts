import supertest from 'supertest';
import { Order, OrderStatus } from '../../../src/api/models/Order';
import app from '../../../src/index';
import { TOKEN } from '../../helpers/mock-data';
import { OrderController } from '../../../src/api/controllers/order-controller';
const request = supertest(app);
const baseRoute = '/api/orders';

const COMPLETED_ORDER: Order = {
  id: 1,
  customer_id: 1,
  status: OrderStatus.Complete,
  comments: null,
  created_at: '2021-11-29T14:32:57.556Z',
  completed_at: '2021-11-29T14:33:01.515Z',
  number_of_products: '1',
  total: '12.50',
  items: [
    {
      id: 1,
      order_id: 1,
      product_id: 1,
      quantity: 1,
      engraving: 'custom engraving',
      name: 'earrings dark wood',
      price: '12.50',
      category_id: 1,
      description: 'dark wood earrings for women'
    }
  ]
};

const CURRENT_ORDER: Order = {
  id: 2,
  customer_id: 1,
  status: OrderStatus.Active,
  comments: 'new order',
  created_at: '2021-11-29T14:33:08.435Z',
  completed_at: null,
  number_of_products: '1',
  total: '15.00',
  items: [
    {
      id: 2,
      order_id: 2,
      product_id: 2,
      quantity: 1,
      engraving: 'custom engraving',
      name: 'bracelet',
      price: '15.00',
      category_id: 1,
      description: 'dark wood bracelet for men'
    }
  ]
};

describe('--> Orders Endpoints <--', () => {
  beforeAll(() => {
    spyOn(OrderController.prototype, 'createOrder').and.returnValue(
      Promise.resolve({ ...CURRENT_ORDER })
    );

    spyOn(OrderController.prototype, 'getOrdersOfUser').and.returnValue(
      Promise.resolve([{ ...COMPLETED_ORDER }, { ...CURRENT_ORDER }])
    );

    spyOn(OrderController.prototype, 'getCurrentOrder').and.returnValue(
      Promise.resolve({ ...CURRENT_ORDER })
    );

    spyOn(
      OrderController.prototype,
      'getCompletedOrdersOfUser'
    ).and.returnValue(Promise.resolve([{ ...COMPLETED_ORDER }]));

    spyOn(OrderController.prototype, 'deleteCurrentOrder').and.returnValue(
      Promise.resolve({ ...CURRENT_ORDER })
    );

    spyOn(OrderController.prototype, 'completeCurrentOrder').and.returnValue(
      Promise.resolve({ ...COMPLETED_ORDER })
    );

    spyOn(OrderController.prototype, 'addItemInCurrentOrder').and.returnValue(
      Promise.resolve({ ...CURRENT_ORDER })
    );

    spyOn(
      OrderController.prototype,
      'updateItemInCurrentOrder'
    ).and.returnValue(Promise.resolve({ ...CURRENT_ORDER }));

    spyOn(
      OrderController.prototype,
      'deleteItemFromCurrentOrder'
    ).and.returnValue(Promise.resolve(null));
  });

  it(`POST ${baseRoute} creates a new order`, async () => {
    const res = await request
      .post(baseRoute)
      .set('Authorization', 'Bearer ' + TOKEN)
      .send({
        item: {
          product_id: 2,
          quantity: 1,
          engraving: 'custom engraving'
        },
        comments: 'new order',
        calledAt: Date.now()
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(CURRENT_ORDER);
  });

  it(`GET ${baseRoute} returns all orders of the user`, async () => {
    const res = await request
      .get(baseRoute)
      .set('Authorization', 'Bearer ' + TOKEN);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ ...COMPLETED_ORDER }, { ...CURRENT_ORDER }]);
  });

  it(`GET ${baseRoute}/current returns the current order of the user`, async () => {
    const res = await request
      .get(`${baseRoute}/current`)
      .set('Authorization', 'Bearer ' + TOKEN);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(CURRENT_ORDER);
  });

  it(`GET ${baseRoute}/completed returns the completed orders of the user`, async () => {
    const res = await request
      .get(`${baseRoute}/completed`)
      .set('Authorization', 'Bearer ' + TOKEN);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([COMPLETED_ORDER]);
  });

  it(`POST ${baseRoute}/current/item adds a new item in the current order`, async () => {
    const res = await request
      .post(`${baseRoute}/current/item`)
      .set('Authorization', 'Bearer ' + TOKEN)
      .send({ product_id: 2, quantity: 1 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(CURRENT_ORDER);
  });

  it(`PATCH ${baseRoute}/current/item/:id updates an item in the current order`, async () => {
    const res = await request
      .patch(`${baseRoute}/current/item/1`)
      .set('Authorization', 'Bearer ' + TOKEN)
      .send({ quantity: 4 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(CURRENT_ORDER);
  });

  it(`DELETE ${baseRoute}/current/item/:id deletes an item from the current order of the user`, async () => {
    const res = await request
      .delete(`${baseRoute}/current/item/1`)
      .set('Authorization', 'Bearer ' + TOKEN);

    expect(res.status).toBe(200);
    expect(res.body).toBe(null);
  });

  it(`PATCH ${baseRoute}/current/complete completes current order of the user`, async () => {
    const res = await request
      .patch(`${baseRoute}/current/complete`)
      .set('Authorization', 'Bearer ' + TOKEN)
      .send({ calledAt: Date.now() });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(COMPLETED_ORDER);
  });

  it(`DELETE ${baseRoute}/current deletes the current order of the user`, async () => {
    const res = await request
      .delete(`${baseRoute}/current`)
      .set('Authorization', 'Bearer ' + TOKEN);

    expect(res.status).toBe(204);
  });
});
