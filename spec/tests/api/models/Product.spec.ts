import { hasBasicMethods } from '../../../helpers/model-helper';
import { ProductStore, Product } from '../../../../src/api/models/Product';


const store: ProductStore = new ProductStore();

describe('Product Model', () => {
  hasBasicMethods<ProductStore, Product>(store);

});
