import QueryInterface from '../contracts/QueryInterface';

export default class QuerySelect extends QueryInterface {
  /**
   * Construct: Set the table, if any
   *
   * @param {String} [select='*']
   */
  constructor(select = '*') {
    super();

    this.table = null;
    this.joins = [];
    this.filters = [];
    this.have = [];
    this.sort = [];
    this.group = [];

    this.start = null;
    this.range = 0;

    this.select(select);
  }

  /**
   * Set the table name in which you want to select from
   *
   * @param {String}
   *
   * @return {QuerySelect}
   */
  from(table) {
    this.table = table;
    return this;
  }

  /**
   * Returns the string of the query expression
   *
   * @return {String}
   */
  getQuery() {
    let joins = '';
    let where = '';
    let sort = '';
    let limit = '';
    let group = '';
    let having = '';

    if (this.joins.length) {
      joins = this.joins.join(' ');
    }

    if (this.filters.length) {
      where = 'WHERE %s'.replace('%s', this.filters.join(' AND '));
    }

    if (this.sort.length) {
      sort = 'ORDER BY %s'.replace('%s', this.sort.join(', '));
    }

    if (typeof this.start === 'number' && this.range > 0) {
      limit = 'LIMIT %s, %s'.replace('%s', this.start).replace('%s', this.range);
    } else if (this.range > 0) {
      limit = 'LIMIT %s'.replace('%s', this.range);
    }

    if (this.group.length) {
      sort = 'GROUP BY %s'.replace('%s', this.group.join(', '));
    }

    if (this.have.length) {
      sort = 'HAVING %s'.replace('%s', this.have.join(', '));
    }

    return 'SELECT %s FROM %s %s %s %s %s %s %s;'
      .replace('%s', this.columns)
      .replace('%s', this.table)
      .replace('%s', joins)
      .replace('%s', where)
      .replace('%s', group)
      .replace('%s', having)
      .replace('%s', sort)
      .replace('%s', limit)
      .replace(/\s\s/ig, ' ');
  }

  /**
   * Group By clause
   *
   * @param {(Array|String)}
   *
   * @return {QuerySelect}
   */
  groupBy(group) {
    if (typeof group === 'string') {
      group = [group];
    }

    this.group = this.group.concat(group);

    return this;
  }

  /**
   * Having clause
   *
   * @param {(Array|String)}
   *
   * @return {QuerySelect}
   */
  having(have) {
    if (typeof have === 'string') {
      have = [have]
    }

    this.have = this.have.concat(have);

    return this;
  }

  /**
   * Allows you to add joins of different types
   * to the query
   *
   * @param {String} type
   * @param {String} table
   * @param {String} where
   * @param {Boolean} [using = false]
   *
   * @return {QuerySelect}
   */
  join(type, table, where, using = false) {
    let linkage = using ? 'USING (%s)' : ' ON (%s)';

    this.joins.push('%s JOIN %s %s'
      .replace('%s', type)
      .replace('%s', table)
      .replace('%s', linkage)
      .replace('%s', where)
    );

    return this
  }

  /**
   * Limit clause
   *
   * @param {Integer} start
   * @param {Integer} range
   *
   * @return {QuerySelect}
   */
  limit(start, range = 0) {
    this.start = start;
    this.range = range;

    return this;
  }

  /**
   * Select clause
   *
   * @param {(String|String[])} columns
   *
   * @return {QuerySelect}
   */
  select(columns) {
    //if select is an array
    if (columns instanceof Array) {
      //transform into a string
      columns = columns.join(', ');
    }

    this.columns = columns;

    return this;
  }

  /**
   * Order by clause
   *
   * @param {String} field
   * @param {String} [order='ASC']
   *
   * @return {QuerySelect}
   */
  sortBy(field, order = 'ASC') {
    this.sort.push('%s %s'
      .replace('%s', field)
      .replace('%s', order)
    );

    return this;
  }

  /**
   * Where clause
   *
   * @param {(String|String[])} filters
   *
   * @return {QuerySelect}
   */
  where(filters) {
    if (typeof filters === 'string') {
      filters = [filters];
    }

    this.filters = this.filters.concat(filters);

    return this;
  }
}
