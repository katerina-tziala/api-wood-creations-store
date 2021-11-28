import { hasBasicMethods } from '../../../helpers/model-helpers/model-helper';
import {
  OrderStore,
  Order,
  OrderStatus
} from '../../../../src/api/models/Order';

const store: OrderStore = new OrderStore();
const METHODS = [
  'create',
  'getById',
  'getOrdersOfUser',
  'getCompletedOrdersOfUser',
  'getCurrentOrderOfUser',
  'update',
  'completeOrderById',
  'deleteById'
];
describe('* Order Model * ', () => {
  hasBasicMethods<OrderStore, Order>(store, METHODS);

  xdescribe('- Create Methods', () => {});

  xdescribe('- Read Methods', () => {});

  xdescribe('- Update Methods', () => {});

  xdescribe('- Delete Methods', () => {});
});
