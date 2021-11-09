import { hasBasicMethods } from '../../../helpers/model-helper';
import { OrderItemStore, OrderItem } from '../../../../src/api/models/OrderItem';


const store: OrderItemStore = new OrderItemStore();

describe('Order Item Model', () => {
  hasBasicMethods<OrderItemStore, OrderItem>(store);

});
