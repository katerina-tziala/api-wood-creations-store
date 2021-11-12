import { hasBasicMethods } from '../../../helpers/model-helpers/model-helper';
import { UserStore, User } from '../../../../src/api/models/User';

const store: UserStore = new UserStore();

describe('* User Model * ', () => {

  hasBasicMethods<UserStore, User>(store);

  xdescribe('- Create Methods', () => {
    
  });

  xdescribe('- Read Methods', () => {
  
  });

  xdescribe('- Update Methods', () => {

  });

  xdescribe('- Delete Methods', () => {
    
  });

});
