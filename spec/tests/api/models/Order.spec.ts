import { hasBasicMethods } from '../../../helpers/model-helper';
import { OrderStore, Order, OrderStatus } from '../../../../src/api/models/Order';


const store: OrderStore = new OrderStore();

describe('Order Model', () => {
  hasBasicMethods<OrderStore, Order>(store);

});
