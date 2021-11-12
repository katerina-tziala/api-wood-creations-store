import { hasBasicMethods } from '../../../helpers/model-helpers/model-helper';
import { ProductStore, Product } from '../../../../src/api/models/Product';
import { clearData, createCategories, setData } from '../../../helpers/model-helpers/model-data-utils';

const METHODS = [
  'create',
  'getById',
  'getAll',
  'getAllByCategory',
  'update',
  'deleteById',
  'deleteAll'
];

const store: ProductStore = new ProductStore();

// CREATE TABLE product(
//   id SERIAL PRIMARY KEY,
//   category_id INTEGER REFERENCES category(id) ON DELETE RESTRICT,
//   name VARCHAR(100) NOT NULL,
//   price NUMERIC CONSTRAINT positive_price CHECK (price > 0),
//   description text
// );
// function runCreationTest() {
//   beforeAll(async (): Promise<void> => {
//     await store.deleteAll();
//   });

//   // it('should create a category using the create method', async () => {
//   //   const result: Category = await store.create(data);
//   //   expect(result?.id).toBeDefined();
//   // });

//   // it('should throw an error when name is not unique', async () => {
//   //   await expectAsync(store.create(data)).toBeRejected();
//   // });

//   it('should throw an error when name is not defined', async () => {
//     await expectAsync(store.create({})).toBeRejected();
//   });

//   it('should throw an error when price is not defined', async () => {
//     await expectAsync(store.create({
//       category_id: 1,

//     })).toBeRejected();
//   });


//   afterAll(async (): Promise<void> => {
//     await store.deleteAll();
//   });
// }


describe('* Product Model * ', () => {
  beforeAll(async (): Promise<void> => {
    await setData();
  });

  afterAll(async (): Promise<void> => {
    await clearData();
  });

  hasBasicMethods<ProductStore, Product>(store, METHODS);

  xdescribe('- Create Methods', () => {
    
  });

  xdescribe('- Read Methods', () => {
  
  });

  xdescribe('- Update Methods', () => {

  });

  xdescribe('- Delete Methods', () => {
    
  });

});
