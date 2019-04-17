import { SqliteSchema, SqliteStore } from '@library/sql';
import SqlResource from '@library/sql/resources/MemoryResource';
import app from '@library/AppHandler';

test('raw sqlite query test', async () => {
  let database = SqliteStore.load(new SqlResource());

  await database.query(
    'CREATE TABLE IF NOT EXISTS "table_1" ( \
      "wallet_id" INTEGER PRIMARY KEY, \
      "wallet_address" TEXT, \
      "wallet_amount" INTEGER DEFAULT 0, \
      UNIQUE ("wallet_address") \
    );'
  );

  let id = await database.query(
    'INSERT INTO table_1 (wallet_address) VALUES ("John");'
  );

  let rows1 = await database.query(
    'SELECT * FROM table_1'
  );

  expect(rows1[0].wallet_id).toBe(1);
  expect(rows1[0].wallet_address).toBe('John');
});

test('store/schema/search/collection/model test', async () => {
  let store = SqliteStore.load(new SqlResource());

  let schema = SqliteSchema
    .load('table_2', store)
    .addField('wallet_id', 'primary')
    .addField('wallet_address', 'unique')
    .addField('wallet_amount', 'float', 0)
    .addValidation('wallet_amount', function(value, errors) {
      if (value < 0) {
        errors['wallet_amount'] = 'Cannot be less than 0'
      }
    });

  //creates the table in the database
  await schema.build();

  //stores the schema into a collection that
  //validates before writing to database
  let collection = schema.getCollection();

  let model1 = store.getModel({
    wallet_address: '0x1234567890',
    wallet_amount: 10.0006
  });

  //insert test
  await model1.save(collection);
  let rows2 = await store.search('table_2', []);
  expect(rows2[0].wallet_id).toBe(1);
  expect(rows2[0].wallet_address).toBe('0x1234567890');

  //update test
  let search = store
    .getSearch('table_2')
    .where('wallet_address = ?', '0x1234567890');

  model1 = await search.getModel();
  model1.set('wallet_amount', 9.002);
  await model1.save(collection);
  rows2 = await store.search('table_2', []);
  expect(rows2[0].wallet_id).toBe(1);
  expect(rows2[0].wallet_amount).toBe(9.002);

  //update validation test
  try {
    await model1.set('wallet_amount', -3).save(collection);
  } catch(e) {
    expect(e.name).toBe('SqlException');
  }

  //insert validation test
  let model2 = store.getModel({
    wallet_address: '0x1234567890',
    wallet_amount: -3
  });

  try {
    await model2.save(collection);
  } catch(e) {
    expect(e.name).toBe('SqlException');
  }

  //remove test
  await model1.remove(collection);
  rows2 = await store.search('table_2', []);
  expect(rows2.length).toBe(0);
});

test('factory test', async () => {
  app.setDatabase(new SqlResource());
  let store = app.database;
  let schema = store
    .getSchema('table_1')
    .addField('wallet_id', 'primary')
    .addField('wallet_address', 'unique')
    .addField('wallet_amount', 'float', 0)
    .addValidation('wallet_amount', function(value, errors) {
      if (value < 0) {
        errors['wallet_amount'] = 'Cannot be less than 0'
      }
    });

  let collection = store.getCollection(schema);

  let model = collection.getModel({
    wallet_address: '0x2345678901',
    wallet_amount: 11.0006
  });

  await model.save();

  expect(model.get('wallet_id')).toBe(2);
});
