import {
  getCreationQuery,
  getUpdateQuery
} from '../../../../../src/api/models/models-utilities/query-helper';

describe('* query-helper functions *', () => {

  it('getCreationQuery: should return the correct creation query when params defined correctly', () => {
    expect(
      getCreationQuery(
        'table',
        ['column_name_1', 'column_name_2'],
        ['value1', 2]
      )
    ).toEqual(
      'INSERT INTO table (column_name_1, column_name_2) VALUES($1, $2) RETURNING *'
    );
  });

  it('getUpdateQuery: should return the correct update query when params defined correctly', () => {
    const where =  'id=($1)';
    expect(
      getUpdateQuery(
        'table',
        ['column_name_1', 'column_name_2'],
        where
      )
    ).toEqual(
      `UPDATE table SET column_name_1 = $1, column_name_2 = $2 WHERE ${where} RETURNING *`
    );
  });
});
