import { hasBasicMethods } from '../../../helpers/model-helpers/model-helper';
import { OrderStore, Order, OrderStatus } from '../../../../src/api/models/Order';


const store: OrderStore = new OrderStore();

describe('* Order Model * ', () => {

  hasBasicMethods<OrderStore, Order>(store);

  xdescribe('- Create Methods', () => {
    
  });

  xdescribe('- Read Methods', () => {
  
  });

  xdescribe('- Update Methods', () => {

  });

  xdescribe('- Delete Methods', () => {
    
  });

});