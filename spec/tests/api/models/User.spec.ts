import { hasBasicMethods } from '../../../helpers/model-helper';
import { UserStore, User } from '../../../../src/api/models/User';


const store: UserStore = new UserStore();

describe('User Model', () => {
  hasBasicMethods<UserStore, User>(store);

});
