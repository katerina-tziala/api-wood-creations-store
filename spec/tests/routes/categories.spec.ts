import supertest from 'supertest';
import { Category, CategoryStore } from '../../../src/api/models/Category';
import app from '../../../src/index';
import { TOKEN, CATEGORIES } from '../../helpers/mock-data';

const request = supertest(app);
const baseRoute = '/api/categories';

const testCategory: Category = {
  id: 20,
  name: 'category'
};

describe('--> Categories Endpoints <--', () => {
  beforeAll(() => {
    spyOn(CategoryStore.prototype, 'create').and.returnValue(
      Promise.resolve(testCategory)
    );
    spyOn(CategoryStore.prototype, 'getAll').and.returnValue(
      Promise.resolve(CATEGORIES)
    );
    spyOn(CategoryStore.prototype, 'update').and.returnValue(
      Promise.resolve({ ...testCategory, name: 'updated category' })
    );
    spyOn(CategoryStore.prototype, 'getById').and.returnValue(
      Promise.resolve(CATEGORIES[3])
    );
    spyOn(CategoryStore.prototype, 'deleteById').and.returnValue(
      Promise.resolve(CATEGORIES[3])
    );
  });

  it(`POST ${baseRoute} creates a category`, async () => {
    const res = await request
      .post(baseRoute)
      .set('Authorization', 'Bearer ' + TOKEN)
      .send({
        name: 'category'
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(testCategory);
  });

  it(`GET ${baseRoute} returns all the categories`, async () => {
    const res = await request
      .get(baseRoute)
      .set('Authorization', 'Bearer ' + TOKEN);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(CATEGORIES);
  });

  it(`GET ${baseRoute}/:id returns the category with the specified id`, async () => {
    const res = await request
      .get(`${baseRoute}/4`)
      .set('Authorization', 'Bearer ' + TOKEN);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(CATEGORIES[3]);
  });

  it(`PATCH ${baseRoute}/:id updates a category`, async () => {
    const res = await request
      .patch(`${baseRoute}/${testCategory.id}`)
      .set('Authorization', 'Bearer ' + TOKEN)
      .send({ name: 'updated category' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      ...testCategory,
      name: 'updated category'
    });
  });

  it(`DELETE ${baseRoute}/:id deletes a category`, async () => {
    const res = await request
      .delete(`${baseRoute}/${testCategory.id}`)
      .set('Authorization', 'Bearer ' + TOKEN);

    expect(res.status).toBe(204);
  });
});
