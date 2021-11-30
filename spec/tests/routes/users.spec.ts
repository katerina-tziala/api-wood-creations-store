import supertest from 'supertest';
import { User, UserRole, UserStore } from '../../../src/api/models/User';
import app from '../../../src/index';
import { USERS, TOKEN } from '../../helpers/mock-data';

const request = supertest(app);

const testUser: User = {
  id: 20,
  firstname: 'John',
  lastname: 'Doe',
  username: 'jdoe',
  password: 'customer1234',
  role: UserRole.Customer
};

const baseRoute = '/api/users';

describe('--> Users Endpoints <--', () => {
  beforeAll(() => {
    spyOn(UserStore.prototype, 'create').and.returnValue(
      Promise.resolve(testUser)
    );
    spyOn(UserStore.prototype, 'authenticate').and.returnValue(
      Promise.resolve(testUser)
    );
    spyOn(UserStore.prototype, 'getById').and.returnValue(
      Promise.resolve(testUser)
    );
    spyOn(UserStore.prototype, 'getAll').and.returnValue(
      Promise.resolve(USERS)
    );
    spyOn(UserStore.prototype, 'deleteById').and.returnValue(
      Promise.resolve(testUser)
    );
    spyOn(UserStore.prototype, 'update').and.returnValue(
      Promise.resolve({
        ...USERS[0],
        firstname: 'firstname',
        lastname: 'lastname'
      })
    );
  });

  it(`POST ${baseRoute}/authenticate returns the accessToken`, async () => {
    const res = await request
      .post(`${baseRoute}/authenticate`)
      .send({ username: 'admin', password: 'root' });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it(`POST ${baseRoute} creates a user`, async () => {
    const res = await request
      .post(baseRoute)
      .send(testUser);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(testUser);
  });

  it(`GET ${baseRoute} returns all users`, async () => {
    const res = await request
      .get(baseRoute)
      .set('Authorization', 'Bearer ' + TOKEN);
    
    expect(res.status).toBe(200);
    expect(res.body).toEqual(USERS);
  });

  it(`GET ${baseRoute}/:id returns the user with the specified id`, async () => {
    const res = await request
      .get(`${baseRoute}/20`)
      .set('Authorization', 'Bearer ' + TOKEN);
    
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      ...testUser,
      recentOrders: [],
      currentOrder: null
    });
  });

  it(`PATCH ${baseRoute} updates the user`, async () => {
    const res = await request
      .patch(baseRoute)
      .set('Authorization', 'Bearer ' + TOKEN)
      .send({ firstname: 'testinguser' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      ...USERS[0],
      firstname: 'firstname',
      lastname: 'lastname'
    });
  });

  it(`DELETE ${baseRoute} deletes a customer`, async () => {
    const res = await request
      .delete(`${baseRoute}/${testUser.id}`)
      .set('Authorization', 'Bearer ' + TOKEN);
    
    expect(res.status).toBe(204);
  });
});
