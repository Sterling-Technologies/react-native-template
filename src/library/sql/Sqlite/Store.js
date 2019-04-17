import AbstractStore from '../AbstractStore';
import SqlException from '../SqlException';

import QueryInterface from '../contracts/QueryInterface';

import QueryAlter from './QueryAlter';
import QueryCreate from './QueryCreate';
import QueryDelete from './QueryDelete';
import QueryInsert from './QueryInsert';
import QuerySelect from './QuerySelect';
import QueryUpdate from './QueryUpdate';
import QueryUtility from './QueryUtility';

import Schema from './Schema';

export default class Store extends AbstractStore {
  /**
   * Set the resource
   *
   * @param {Resource} resource
   */
  constructor(resource) {
    super();

    this.resource = resource;
    this.primaries = {};
  }

  /**
   * Class loader
   *
   * @param {Resource} resource
   *
   * @return {Store}
   */
  static load(resource) {
    //singleton pattern
    if (typeof Store.instance === 'undefined') {
      Store.instance = new Store(resource)
    }

    return Store.instance;
  }

  /**
   * Drops a table
   *
   * @param {String} table
   *
   * @return {Store}
   */
  async dropTable(table) {
    let utility = new QueryUtility();
    let query = utility.dropTable(table).getQuery();
    await this.query(query);
    return this;
  }

  /**
   * Returns alter query expression
   *
   * @param {String} table
   *
   * @return {QueryAlter}
   */
  getAlterQuery(table) {
    return new QueryAlter(table);
  }

  /**
   * Returns the column information of a table
   *
   * @param {String} table
   *
   * @return {Array}
   */
  async getColumns(table) {
    let utility = new QueryUtility();
    let query = utility.showColumns(table).getQuery();
    let results = await this.query(query);

    let columns = [];
    results.forEach(column => {
      let key = null;
      if (column.pk == 1) {
        key = 'PRI';
      }

      columns.push({
        field: column.name,
        type: column.type,
        initial: column.dflt_value,
        notnull: column.notnull,
        key: key
      });
    });

    return columns
  }

  /**
   * Returns create query expression
   *
   * @param {String} table
   *
   * @return {QueryCreate}
   */
  getCreateQuery(table) {
    return new QueryCreate(table);
  }

  /**
   * Returns delete query expression
   *
   * @param {String} table
   *
   * @return {QueryDelete}
   */
  getDeleteQuery(table) {
    return new QueryDelete(table);
  }

  /**
   * Returns insert query expression
   *
   * @param {String} table
   *
   * @return {QueryInsert}
   */
  getInsertQuery(table) {
    return new QueryInsert(table);
  }

  /**
   * Returns a schema attached to the store
   *
   * @param {String} table
   *
   * @return {Schema}
   */
  getSchema(table) {
    return Schema.load(table, this);
  }

  /**
   * Returns select query expression
   *
   * @param {String} [select='*']
   *
   * @return {QuerySelect}
   */
  getSelectQuery(select = '*') {
    return new QuerySelect(select);
  }

  /**
   * Returns the tables in the database
   *
   * @return {Array}
   */
  async getTables() {
    let utility = new QueryUtility();
    let query = utility.showTables().getQuery();
    return await this.query(query);
  }

  /**
   * Returns update query expression
   *
   * @param {String} table
   *
   * @return {QueryUpdate}
   */
  getUpdateQuery(table) {
    return new QueryUpdate(table);
  }

  /**
   * Raw query maker
   *
   * @param {String} expression
   * @param {Array} [bind]
   * @param {Function} [callback]
   *
   * @return {*}
   */
  async query(expression, bind, callback) {
    return await this.resource.query(expression, bind, callback);
  }

  /**
   * Renames a table
   *
   * @param {String} table
   * @param {String} name
   *
   * @return {Store}
   */
  async rename(table, name) {
    let utility = new QueryUtility();
    let query = utility.renameTable(table, name).getQuery();
    await this.query(query);
    return this;
  }

  /**
   * Flushes a table
   *
   * @param {String} table
   *
   * @return {Store}
   */
  async truncate(table) {
    let utility = new QueryUtility();
    let query = utility.truncate(table).getQuery();
    await this.query(query);
    return this;
  }
}
