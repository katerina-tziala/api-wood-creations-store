import { DEFAULT_METHODS, hasBasicMethods } from '../../../helpers/model-helpers/model-helper';
import { UserStore, User } from '../../../../src/api/models/User';

const store: UserStore = new UserStore();
const METHODS = [
  ...DEFAULT_METHODS,
  'authenticate'
];

describe('* User Model * ', () => {

  hasBasicMethods<UserStore, User>(store, METHODS);

  xdescribe('- Create Methods', () => {
    
  });

  xdescribe('- Read Methods', () => {
  
  });

  xdescribe('- Update Methods', () => {

  });

  xdescribe('- Delete Methods', () => {
    
  });

});
