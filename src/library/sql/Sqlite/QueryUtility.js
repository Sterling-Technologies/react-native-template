import QueryInterface from '../contracts/QueryInterface';

export default class QueryUtility extends QueryInterface {
  /**
   * Query for dropping a table
   *
   * @param {String} table
   *
   * @return {QueryUtility}
   */
  dropTable(table) {
    this.query = 'DROP TABLE IF EXISTS "%s";'.replace('%s', table);
    return this;
  }

  /**
   * Returns the string version of the query
   *
   * @return {String}
   */
  getQuery() {
    return this.query;
  }

  /**
   * Query for renaming a table
   *
   * @param {String} table - The name of the table
   * @param {String} name  - The new name of the table
   *
   * @return {QueryUtility}
   */
  renameTable(table, name) {
    this.query = 'RENAME TABLE "%s" TO "%s"'.replace('%s', table).replace('%s', name);
    return this;
  }

  /**
   * Query for showing all columns of a table
   *
   * @param {String} table - The name of the table
   *
   * @return {QueryUtility}
   */
  showColumns(table) {
    this.query = 'PRAGMA table_info(%s)'.replace('%s', table);
    return this;
  }

  /**
   * Query for showing all tables
   *
   * @return {QueryUtility}
   */
  showTables() {
    this.query = "SELECT * FROM sqlite_master WHERE type='table'";
    return this;
  }

  /**
   * Query for truncating a table
   *
   * @param {String} table - The name of the table
   *
   * @return {QueryUtility}
   */
  truncate(table) {
    this.query = 'TRUNCATE "%s"'.replace('%s', table);
    return this;
  }
}
