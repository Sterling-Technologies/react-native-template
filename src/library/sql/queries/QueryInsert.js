import QueryInterface from '../contracts/QueryInterface';

export default class QueryInsert extends QueryInterface {
  /**
   * Construct: Set the table, if any
   *
   * @param {String} [table]
   */
  constructor(table = null) {
    super();
    this.into(table);
    this.keys = [];
    this.values = {};
  }

  /**
   * Set the table name in which you want to delete from
   *
   * @param {String} table
   *
   * @return {QueryInsert}
   */
  into(table) {
    this.table = table;
    return this;
  }

  /**
   * Returns the string of the query expression
   *
   * @return {String}
   */
  getQuery() {
    let rows = [];
    Object.keys(this.values).forEach(index => {
      rows.push('(%s)'.replace('%s', this.values[index].join(', ')))
    });

    return 'INSERT INTO %s (%s) VALUES %s;'
      .replace('%s', this.table)
      .replace('%s', this.keys.join(', '))
      .replace('%s', rows.join(', '));
  }

  /**
   * Set clause that assigns a given field name to a given value.
   * You can also use this to add multiple rows in one call
   *
   * @param {String} key
   * @param {*} value
   * @param {Integer} index
   *
   * @return {QueryInsert}
   */
  set(key, value, index = 0) {
    if (this.keys.indexOf(key) === -1) {
      this.keys.push(key);
    }

    if (value === null) {
      value = 'null';
    } else if (typeof value === 'boolean') {
      value = value ? 1 : 0;
    }

    if (typeof this.values[index] === 'undefined') {
      this.values[index] = [];
    }

    this.values[index].push(value);
    return this;
  }
}
