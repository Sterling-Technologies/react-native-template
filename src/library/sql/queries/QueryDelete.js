import QueryInterface from '../contracts/QueryInterface';

export default class QueryDelete extends QueryInterface {
  /**
   * Construct: Set the table, if any
   *
   * @param {String} [table]
   */
  constructor(table = null) {
    super();
    this.from(table);
    this.filters = [];
  }

  /**
   * Set the table name in which you want to delete from
   *
   * @param {String} table
   *
   * @return {QueryDelete}
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
    return 'DELETE FROM %s WHERE %s;'
      .replace('%s', this.table)
      .replace('%s', this.filters.join(' AND '));
  }

  /**
   * Where clause
   *
   * @param {(Array|String)} filter
   *
   * @return {QueryDelete}
   */
  where(filter) {
    if (typeof filter === 'string') {
      filter = [filter];
    }

    this.filters = this.filters.concat(filter);

    return this;
  }
}
