import supertest from 'supertest';
import { Product, ProductStore } from '../../../src/api/models/Product';
import app from '../../../src/index';
import { TOKEN, PRODUCTS } from '../../helpers/mock-data';

const request = supertest(app);
const baseRoute = '/api/products';

const testProduct: Product = {
  id: 20,
  name: 'product name',
  price: '15.85',
  category_id: 4,
  description: ' - '
};

const FIVE_PRODUCTS = [...PRODUCTS].slice(0, 5);
const CATEGORY_PRODUCTS = [...PRODUCTS].filter(
  product => product.category_id === 4
);

describe('--> Products Endpoints <--', () => {
  beforeAll(() => {
    spyOn(ProductStore.prototype, 'create').and.returnValue(
      Promise.resolve(testProduct)
    );

    spyOn(ProductStore.prototype, 'getAll').and.returnValue(
      Promise.resolve(PRODUCTS)
    );

    spyOn(ProductStore.prototype, 'getById').and.returnValue(
      Promise.resolve(PRODUCTS[3])
    );

    spyOn(ProductStore.prototype, 'getByCategory').and.returnValue(
      Promise.resolve(CATEGORY_PRODUCTS)
    );

    spyOn(ProductStore.prototype, 'getTopFive').and.returnValue(
      Promise.resolve(FIVE_PRODUCTS)
    );

    spyOn(ProductStore.prototype, 'update').and.returnValue(
      Promise.resolve({
        ...testProduct,
        name: 'updated category',
        price: '17.75'
      })
    );

    spyOn(ProductStore.prototype, 'deleteById').and.returnValue(
      Promise.resolve(testProduct)
    );
  });

  it(`POST ${baseRoute} creates a product`, async () => {
    const res = await request
      .post(baseRoute)
      .set('Authorization', 'Bearer ' + TOKEN)
      .send({
        name: 'product name',
        price: '15.85',
        category_id: 4,
        description: ' - '
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(testProduct);
  });

  it(`GET ${baseRoute} returns all the products`, async () => {
    const res = await request.get(baseRoute);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(PRODUCTS);
  });

  it(`GET ${baseRoute}/:id returns the product with the specified id`, async () => {
    const res = await request.get(`${baseRoute}/4`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(PRODUCTS[3]);
  });

  it(`GET ${baseRoute}/category/:id returns the products of the specified category`, async () => {
    const res = await request.get(`${baseRoute}/category/4`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(CATEGORY_PRODUCTS);
  });

  it(`GET ${baseRoute}/top-five returns the 5 most popular products (most commonly ordered)`, async () => {
    const res = await request.get(`${baseRoute}/top-five`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(FIVE_PRODUCTS);
  });

  it(`PATCH ${baseRoute}:id updates a product`, async () => {
    const res = await request
      .patch(`${baseRoute}/${testProduct.id}`)
      .set('Authorization', 'Bearer ' + TOKEN)
      .send({ name: 'updated product', price: '17.75' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      ...testProduct,
      name: 'updated category',
      price: '17.75'
    });
  });

  it(`DELETE ${baseRoute}/:id deletes a product`, async () => {
    const res = await request
      .delete(`${baseRoute}/${testProduct.id}`)
      .set('Authorization', 'Bearer ' + TOKEN);
    expect(res.status).toBe(204);
  });
});

// ### CREATE PRODUCT
// # @name new_product
// POST {{api}}/products
// Content-Type: application/json
// Authorization: Bearer {{authenticate.response.body.accessToken}}

// {
//     "name": "standing photo frame",
//     "price": "15.8",
//     "category_id": 4,
//     "description": "standing photo frame to attach photos"
// }

// ### UPDATE PRODUCT
// PATCH {{api}}/products/{{new_product.response.body.id}}
// Content-Type: application/json
// Authorization: Bearer {{authenticate.response.body.accessToken}}

// {
//     "name": "standing photo frame for lovers",
//     "price": "17.75",
//     "description": " - "
// }

// ### DELETE PRODUCT
// DELETE {{api}}/products/{{new_product.response.body.id}}
// Content-Type: application/json
// Authorization: Bearer {{authenticate.response.body.accessToken}}
