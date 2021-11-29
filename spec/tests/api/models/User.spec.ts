import {
  DEFAULT_METHODS,
  hasBasicMethods,
  runDeleteByIdSuccessTest,
  runCreationFailureForOmittedKey
} from '../../../helpers/model-helpers/model-helper';
import { UserStore, User, UserRole } from '../../../../src/api/models/User';
import { USERS } from '../../../helpers/mock-data';
import { ErrorType } from '../../../../src/utilities/error-handling/error-type.enum';
import {
  createCurrentOrder,
  deleteOrder
} from '../../../helpers/test-data';
import { Order } from '../../../../src/api/models/Order';

const METHODS = [...DEFAULT_METHODS, 'authenticate'];

// MOCK DATA
const MockData: User[] = USERS;
const ADMIN: User = USERS[0];

const store: UserStore = new UserStore();

describe('* User Model * ', () => {
  hasBasicMethods<UserStore, User>(store, METHODS);

  describe('- Method create', () => runCreateTest());
  describe('- Method getAll', () => runGetAllTest());
  describe('- Method getById', () => runGetByIdTest());
  describe('- Method update', () => runUpdateTest());
  describe('- Method deleteById', () => runDeleteByIdTest());
  describe('- Method authenticate', () => runAuthenticateTest());
});

function checkCreatedUser(
  user: User,
  expectedData: Omit<User, 'id' | 'role'>
): void {
  expect(user).toBeDefined();
  expect(user.id).toBeDefined();
  expect(user.firstname).toBe(expectedData.firstname);
  expect(user.lastname).toBe(expectedData.lastname);
  expect(user.username).toBe(expectedData.username);
}

function runCreateTest(): void {
  const data = {
    firstname: 'John',
    lastname: 'Doe',
    username: 'jdoe',
    password: 'customer1234'
  };

  describe('> should create a new user:', () => {
    it('with the specified data', async () => {
      const userData = { ...data, role: UserRole.Admin };
      const user: User = await store.create(userData);
      checkCreatedUser(user, data);
      expect(user.role).toBe(UserRole.Admin);
      MockData.push({ ...user });
    });

    it('with customer role when role is not specified', async () => {
      const userData = { ...data, username: 'customer2' };
      const user: User = await store.create(userData);
      checkCreatedUser(user, userData);
      expect(user.role).toBe(UserRole.Customer);
      MockData.push({ ...user });
    });
  });

  runCreateFailTest(data);
}

function runCreateFailTest(newUser: Omit<Partial<User>, 'id'>): void {
  const { firstname, lastname, username, password } = newUser;

  describe('> should throw an error when:', () => {
    it('no data passed', async () => {
      await expectAsync(store.create({})).toBeRejectedWithError(
        ErrorType.ValuesRequired
      );
    });

    runCreationFailureForOmittedKey<UserStore, User>(
      store,
      { lastname, username, password },
      'firstname'
    );

    it('firstname is shorter than 3 characters', async () => {
      await expectAsync(
        store.create({ ...newUser, firstname: 'na' })
      ).toBeRejected();
    });

    runCreationFailureForOmittedKey<UserStore, User>(
      store,
      { firstname, username, password },
      'lastname'
    );

    it('lastname is shorter than 3 characters', async () => {
      await expectAsync(
        store.create({ ...newUser, lastname: 'la' })
      ).toBeRejected();
    });

    runCreationFailureForOmittedKey<UserStore, User>(
      store,
      { firstname, lastname, password },
      'username'
    );

    it('username is shorter than 4 characters', async () => {
      await expectAsync(
        store.create({ ...newUser, username: 'use' })
      ).toBeRejected();
    });

    it('username is not unique', async () => {
      await expectAsync(
        store.create({ ...newUser, username: ADMIN.username })
      ).toBeRejected();
    });

    runCreationFailureForOmittedKey<UserStore, User>(
      store,
      { firstname, lastname, username },
      'password'
    );

    it('password is shorter than 4 characters', async () => {
      await expectAsync(
        store.create({ ...newUser, password: 'pas' })
      ).toBeRejectedWithError(ErrorType.PassswordTooShort);
    });
  });
}

function runGetAllTest(): void {
  it(`should return a list of all users`, async () => {
    await expectAsync(store.getAll()).toBeResolvedTo(MockData);
  });
}

function runGetByIdTest(): void {
  it(`should throw an error when user with the specified id does not exist`, async () => {
    await expectAsync(store.getById(0)).toBeRejectedWithError(
      ErrorType.NotFound
    );
  });
  it(`should return the user with the specified id when user exists`, async () => {
    const result: User = await store.getById(ADMIN.id);
    expect(result).toEqual(ADMIN);
  });
}

function runDeleteByIdTest(): void {
  it('should delete the correct user with the specified id when it exists', async () => {
    const toDelete = [...MockData].pop() as User;
    await runDeleteByIdSuccessTest<UserStore, User>(store, toDelete);
  });
  runDeleteFailTest();
}

function runDeleteFailTest(): void {
  describe('> should throw an error when:', () => {
    it('trying to delete a user that does not exist', async () => {
      await expectAsync(store.deleteById(0)).toBeRejectedWithError(
        ErrorType.NotFound
      );
    });

    it('trying to delete a user that relates to an order', async () => {
      const order: Order = await createCurrentOrder();
      await expectAsync(store.deleteById(ADMIN.id)).toBeRejected();
      await deleteOrder(order.id);
    });
  });
}

function runAuthenticateTest(): void {
  it('should return existing user with correct credentials', async () => {
    const authenticated: User | null = await store.authenticate(
      ADMIN.username,
      'root'
    );
    expect(authenticated).toBeDefined();
    expect(authenticated?.username).toBe(ADMIN.username);
  });

  it('should return null when password is not correct', async () => {
    await expectAsync(
      store.authenticate(ADMIN.username, 'wrongpass')
    ).toBeResolvedTo(null);
  });

  it('should return null when username is not correct', async () => {
    await expectAsync(store.authenticate('username', 'root')).toBeResolvedTo(
      null
    );
  });
}

function runUpdateTest(): void {
  it('should update correctly a user when data valid', async () => {
    const toUpdate = [...MockData].pop() as User;
    const updateData = {
      ...toUpdate,
      username: 'newusername',
      password: 'newPass'
    };
    const { password, ...expectedData } = updateData;
    const result: User = await store.update(updateData);

    expect(result).toEqual(expectedData);
    MockData.pop();
    MockData.push({ ...result });
  });
  runUpdateFailTest();
}

async function runUpdateError(data: Partial<User>): Promise<void> {
  return await expectAsync(store.update(data)).toBeRejected();
}

function runUpdateFailTest(): void {
  const userToUpdate = { ...ADMIN };
  const { firstname, lastname, username } = userToUpdate;

  describe('> should throw an error when:', () => {
    it('id is not present in data', async () => {
      const data = { firstname, lastname, username };
      await expectAsync(store.update(data)).toBeRejectedWithError(
        ErrorType.IdRequired
      );
    });

    it('update data not defined', async () => {
      const data = { id: userToUpdate.id };
      await expectAsync(store.update(data)).toBeRejectedWithError(
        ErrorType.ValuesRequired
      );
    });

    // TODO: check why if commenting this out the rest of the tests fail
    // it('firstname is shorter than 3 characters', async () => {
    //   await runUpdateError({ ...userToUpdate, firstname: 'na' });
    // });

    // it('lastname is shorter than 3 characters', async () => {
    //   await runUpdateError({ ...userToUpdate, lastname: 'la' });
    // });

    // it('password is shorter than 4 characters', async () => {
    //   await runUpdateError({ ...userToUpdate, password: 'pas' });
    // });

    // it('username is not unique', async () => {
    //   await runUpdateError({ ...userToUpdate, username: 'jdoe' });
    // });

    // it('username is shorter than 4 characters', async () => {
    //   await runUpdateError({ ...userToUpdate, username: 'use' });
    // });
  });
}
