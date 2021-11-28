import { hasBasicMethods } from '../../../helpers/model-helpers/model-helper';
import { OrderItemStore, OrderItem } from '../../../../src/api/models/OrderItem';

const store: OrderItemStore = new OrderItemStore();
const METHODS = [
  'create',
  'getById',
  'getItemsByOrderId',
  'getByIdAndOrderId',
  'update',
  'deleteById',
  'deleteByIdAndOrderId'
];

describe('* OrderItem Model * ', () => {

  hasBasicMethods<OrderItemStore, OrderItem>(store, METHODS);

  xdescribe('- Create Methods', () => {
    
  });

  xdescribe('- Read Methods', () => {
  
  });

  xdescribe('- Update Methods', () => {

  });

  xdescribe('- Delete Methods', () => {
    
  });

});