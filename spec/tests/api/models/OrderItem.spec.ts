import { hasBasicMethods } from '../../../helpers/model-helpers/model-helper';
import { OrderItemStore, OrderItem } from '../../../../src/api/models/OrderItem';

const store: OrderItemStore = new OrderItemStore();

describe('* OrderItem Model * ', () => {

  hasBasicMethods<OrderItemStore, OrderItem>(store);

  xdescribe('- Create Methods', () => {
    
  });

  xdescribe('- Read Methods', () => {
  
  });

  xdescribe('- Update Methods', () => {

  });

  xdescribe('- Delete Methods', () => {
    
  });

});