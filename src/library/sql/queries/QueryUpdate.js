import QueryDelete from './QueryDelete';

export default class QueryUpdate extends QueryDelete {
  /**
   * Construct: Set the table, if any
   *
   * @param {String} table
   */
  constructor(table) {
    super(table)
    this.data = {}
  }

  /**
   * Returns the string of the query expression
   *
   * @return {String}
   */
  getQuery() {
    let set = []
    Object.keys(this.data).forEach(name => {
      set.push('%s = %s'.replace('%s', name).replace('%s', this.data[name]))
    })

    return 'UPDATE %s SET %s WHERE %s;'
      .replace('%s', this.table)
      .replace('%s', set.join(', '))
      .replace('%s', this.filters.join(' AND '))
  }

  /**
   * Set clause that assigns a given field name to a given value.
   * You can also use this to add multiple rows in one call
   *
   * @param {String} key
   * @param {*} value
   *
   * @return {QueryUpdate}
   */
  set(key, value) {
    if (value === null)
      value = 'null'
    else if (typeof value === 'boolean')
      value = value ? 1 : 0

    this.data[key] = value

    return this
  }
}
