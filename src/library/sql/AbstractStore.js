import StoreInterface from './contracts/StoreInterface';
import SqlException from './SqlException';

import SqlSearch from './SqlSearch';
import SqlCollection from './SqlCollection';
import SqlModel from './SqlModel';

export default class AbstractStore extends StoreInterface {
  /**
   * Inserts data to the store
   *
   * @param {String} collection
   * @param {Object} data
   *
   * @return {StoreInterface}
   */
  async insert(collection, data) {
    let query = this.getInsertQuery(collection);
    let binds = [];

    for (let name in data) {
      query.set(name, '?');
      binds.push(data[name]);
    }

    let id = await this.query(query.getQuery(), binds);
    let key = await this.getPrimaryKey(collection);
    let detail = await this.detail(collection, key, id);

    return Object.assign({}, data, detail);
  }

  /**
   * Retrieves data from the store
   *
   * @param {String} collection
   * @param {String} key
   * @param {(String|Integer)} id
   *
   * @return hash
   */
  async detail(collection, key, id) {
    let search = this
      .getSearch(collection)
      .where(key + ' = ?', id);

    return await search.getRow();
  }

  /**
   * Returns a collection
   *
   * @param {Schema} schema
   *
   * @return {SqlCollection}
   */
  getCollection(schema) {
    return new SqlCollection(schema, this);
  }

  /**
   * Returns the column information of a table
   *
   * @param {String} table
   *
   * @return {Array}
   */
  async getColumns(table) {
    throw SqlException.forUndefinedAbstract('getColumns');
  }

  /**
   * Returns delete query expression
   *
   * @param {String} table
   *
   * @return {QueryDelete}
   */
  getDeleteQuery(table) {
    throw SqlException.forUndefinedAbstract('getDeleteQuery');
  }

  /**
   * Returns insert query expression
   *
   * @param {String} table
   *
   * @return {QueryInsert}
   */
  getInsertQuery(table) {
    throw SqlException.forUndefinedAbstract('getInsertQuery');
  }

  /**
   * Returns a model
   *
   * @param {Object} [data={}]
   *
   * @return {SqlModel}
   */
  getModel(data = {}) {
    return new SqlModel(data);
  }

  /**
   * Returns the primary key
   *
   * @param {String} table
   *
   * @return {String}
   */
  async getPrimaryKey(table) {
    if (typeof this.primaries[table] === 'undefined') {
      let columns = await this.getColumns(table);
      columns.forEach(column => {
        if (column.key === 'PRI') {
          this.primaries[table] = column.field;
        }
      });
    }

    return this.primaries[table] || null;
  }

  /**
   * Searches in the store
   *
   * @param {String} collection
   *
   * @return {Array}
   */
  getSearch(collection) {
    return new SqlSearch(this).from(collection);
  }

  /**
   * Returns select query expression
   *
   * @param {String} [select='*']
   *
   * @return {QuerySelect}
   */
  getSelectQuery(select = '*') {
    throw SqlException.forUndefinedAbstract('getSelectQuery');
  }

  /**
   * Returns update query expression
   *
   * @param {String} table
   *
   * @return {QueryUpdate}
   */
  getUpdateQuery(table) {
    throw SqlException.forUndefinedAbstract('getUpdateQuery');
  }

  /**
   * Removes data from the store
   *
   * @param {String} collection
   * @param {String} key
   * @param {(String|Integer)} id
   *
   * @return {Object}
   */
  async remove(collection, key, id) {
    let row = await this.detail(collection, key, id);
    let query = this.getDeleteQuery(collection).where(key + ' = ?');
    await this.query(query.getQuery(), [id]);
    return row;
  }

  /**
   * Searches in the store
   *
   * @param {String} collection
   * @param {*} [filters]
   *
   * @return array
   */
  async search(collection, filters) {
    let search = this.getSearch(collection);

    if (filters instanceof Array) {
      let [filtered, sort, start, range] = AbstractStore._getFilters(filters);
      AbstractStore._convertFilters(filtered).forEach(filter => {
        search.where(...filter);
      });

      for (let key in sort) {
        search.sortBy(key, sort[key]);
      }

      search.limit(start, range);
    }

    return await search.getRows();
  }

  /**
   * Updates data to the store
   *
   * @param {String} collection
   * @param {String} key
   * @param {(String|Integer)} id
   * @param {Object} data
   *
   * @return {Object}
   */
  async update(collection, key, id, data) {
    let primary = await this.getPrimaryKey(collection);
    let query = this.getUpdateQuery(collection).where(key + ' = ?');
    let binds = [];

    delete data[primary];

    for (let name in data) {
      query.set(name, '?');
      binds.push(data[name]);
    }

    binds.push(id);
    data[primary] = id;

    await this.query(query.getQuery(), binds);

    return await this.detail(collection, key, id);
  }

  /**
   * Converts array filter to SQL where clauses
   *
   * @private
   *
   * @param {Array} filters
   *
   * @return {Array}
   */
  static _convertFilters(filters) {
    // example filters
    // [
    //   ['eq', 'key', 'val'],
    //   ['lt', 'key', 'val'],
    //   ['null', 'key'],
    //   ['or', [
    //     ['eq', 'key', 'val'],
    //     ['lt', 'key', 'val']
    //   ]]
    // ]
    let binds = [];
    filters.forEach((filter, i) => {
      // 'key = value'
      if (typeof filter === 'string') {
        filters[i] = [filter];
        return;
      }

      let action = filter.shift();

      switch (action) {
        case 'eq':
          filters[i] = filter[0] + ' = ?';
          binds.push(filter[1]);
          break;
        case 'neq':
          filters[i] = filter[0] + ' != ?';
          binds.push(filter[1]);
          break;
        case 'lt':
          filters[i] = filter[0] + ' < ?';
          binds.push(filter[1]);
          break;
        case 'lte':
          filters[i] = filter[0] + ' <= ?';
          binds.push(filter[1]);
          break;
        case 'gt':
          filters[i] = filter[0] + ' > ?';
          binds.push(filter[1]);
          break;
        case 'gte':
          filters[i] = filter[0] + ' >= ?';
          binds.push(filter[1]);
          break;
        case 'like':
          filters[i] = filter[0] + ' LIKE ?';
          binds.push('%' + filter[1] + '%');
          break;
        default:
          filters[i] = action;
          break;
      }
    });

    return filters;
  }

  /**
   * Normalizes the filter input
   *
   * @private
   *
   * @param {Array} filters
   *
   * @return {Array}
   */
  static _getFilters(filters) {
    let sort = {},
      start = 0,
      range = null;

    // example filters
    // [
    //   ['eq', 'key', 'val'],
    //   ['lt', 'key', 'val'],
    //   ['null', 'key'],
    //   ['or', [
    //     ['eq', 'key', 'val'],
    //     ['lt', 'key', 'val']
    //   ]]
    // ]
    const sortOptions = ['asc', 'desc'];

    filters.forEach((filter, i) => {
      // 'key = value'
      if (typeof filter === 'string') {
        return
      }

      if (!(filter instanceof Array) || !filter.length) {
        delete filters[i];
        return;
      }

      if (filter[0] === 'sort') {
        if (typeof filter[2] !== 'undefined') {
          sort[filter[1]] = filter[2].toLowerCase()
        }

        delete filters[i];
        return;
      }

      if (filter[0] === 'start') {
        if (
          typeof filter[1] !== 'undefined'
          && !isNaN(parseInt(filter[1]))
        ) {
          start = filter[1];
        }

        delete filters[i];
        return;
      }

      if (filter[0] === 'range') {
        if (
          typeof filter[1] !== 'undefined'
          && !isNaN(parseInt(filter[1]))
        ) {
          range = filter[1];
        }

        delete filters[i];
        return;
      }
    });

    filters = filters.filter(value => {
      return value;
    });

    return [
      filters,
      sort,
      start,
      range
    ];
  }
}
