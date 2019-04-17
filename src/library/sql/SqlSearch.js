export default class SqlSearch {
  /**
   * Variable list
   *
   * @param {StoreInterface} store
   */
  constructor(store) {
    this.store = store;

    this.columns = ['*'];
    this.table = null;
    this.relations = [];

    this.filters = [];
    this.sort = {};
    this.group = [];
    this.have = [];

    this.start = null;
    this.range = 0;

    this.binds = [];
  }

  /**
   * The initial table to search from
   *
   * @param {String} table
   *
   * @return {SqlSearch}
   */
  from(table) {
    this.table = table;
    return this;
  }

  /**
   * Returns the query expression
   *
   * @param {Boolean} [count=false]
   *
   * @return {QueryInterface}
   */
  getQuery(count = false) {
    count = count;
    let query = this.store.getSelectQuery().from(this.table);

    this.relations.forEach(join => {
      if (!(join[2] instanceof Array)) {
        join[2] = [join[2]];
      }

      let where = join[2].shift();

      if (join[2].length) {
        this.binds = this.binds.concat(join[2]);
      }

      query.join(join[0], join[1], where, join[3]);
    })

    this.filters.forEach((filter, i) => {
      let where = filter.shift();

      if (filter.length) {
        this.binds = this.binds.concat(filter);
      }

      query.where(where);
    });

    if (count) {
      return query.select('COUNT(*) as total');
    }

    query
      .select(this.columns.join(', '))
      .limit(this.start, this.range);

    Object.keys(this.sort).forEach(key => {
      query.sortBy(key, this.sort[key]);
    });

    if (this.group.length) {
      query.groupBy(this.group)
    }

    if (this.have.length) {
      query.having(this.have)
    }

    return query;
  }

  /**
   * Wraps the `getRow()` into a model
   *
   * @param {SqlCollection} collection
   *
   * @return {SqlModel}
   */
  async getModel(collection) {
    let row = await this.getRow();
    if (typeof collection !== 'undefined') {
      return collection.getModel(row);
    }

    return this.store.getModel(row);
  }

  /**
   * Returns the first row found
   *
   * @return {Object}
   */
  async getRow() {
    let query = this.getQuery().limit(0, 1);

    let rows = await this.store.query(query, this.binds);

    if (!rows.length) {
      return null;
    }

    return rows[0];
  }

  /**
   * Returns the rows based on the search criteria
   *
   * @param {Function} callback
   *
   * @return {(Array|SqlSearch)}
   */
  async getRows(callback) {
    let query = this.getQuery();

    let rows = await this.store.query(query, this.binds, callback);

    if (typeof callback === 'undefined') {
      return rows;
    }

    return this;
  }

  /**
   * Returns the number of rows found
   *
   * @return {Integer}
   */
  async getTotal() {
    let query = this.getQuery(true);

    let rows = await this.store.query(query, this.binds);

    if (
        typeof rows[0] === 'undefined'
        || typeof rows[0].total === 'undefined'
    ) {
      return 0;
    }

    return rows[0].total;
  }

  /**
   * Group by clause
   *
   * @param {(String|String[])} group
   *
   * @return {SqlSearch}
   */
  groupBy(group) {
    if (typeof group === 'string') {
      group = [group];
    }

    this.group.concat(group);
    return this;
  }

  /**
   * Having clause
   *
   * @param {(String|Array)}
   *
   * @return {SqlSearch}
   */
  having(have) {
    if (typeof have === 'string') {
      have = [have]
    }

    this.have.concat(have);
    return this;
  }

  /**
   * Inner join on clause
   *
   * @param {String} table
   * @param {(String|String[])} where
   *
   * @return {SqlSearch}
   */
  innerJoinOn(table, where) {
    this.relations.push(['INNER', table, where, false]);
    return this;
  }

  /**
   * Inner join using clause
   *
   * @param {String} table
   * @param {(String|String[])} where
   *
   * @return {SqlSearch}
   */
  innerJoinUsing(table, where) {
    this.relations.push(['INNER', table, where, true]);
    return this;
  }

  /**
   * Left join on clause
   *
   * @param {String} table
   * @param {(String|String[])} where
   *
   * @return {SqlSearch}
   */
  leftJoinOn(table, where) {
    this.relations.push(['LEFT', table, where, false]);
    return this;
  }

  /**
   * Left join using clause
   *
   * @param {String} table
   * @param {(String|String[])} where
   *
   * @return {SqlSearch}
   */
  leftJoinUsing(table, where) {
    this.relations.push(['LEFT', table, where, true]);
    return this;
  }

  /**
   * Limit clause
   *
   * @param {Integer} start
   * @param {Integer} range
   *
   * @return {SqlSearch}
   */
  limit(start, range) {
    this.start = start;
    this.range = range;

    return this;
  }

  /**
   * Outer join on clause
   *
   * @param {String} table
   * @param {(String|String[])} where
   *
   * @return {SqlSearch}
   */
  outerJoinOn(table, where) {
    this.relations.push(['OUTER', table, where, false]);
    return this;
  }

  /**
   * Outer join using clause
   *
   * @param {String} table
   * @param {(String|String[])} where
   *
   * @return {SqlSearch}
   */
  outerJoinUsing(table, where) {
    this.relations.push(['OUTER', table, where, true]);
    return this;
  }

  /**
   * Right join on clause
   *
   * @param {String} table
   * @param {(String|String[])} where
   *
   * @return {SqlSearch}
   */
  rightJoinOn(table, where) {
    this.relations.push(['RIGHT', table, where, false]);
    return this;
  }

  /**
   * Right join using clause
   *
   * @param {String} table
   * @param {(String|String[])} where
   *
   * @return {SqlSearch}
   */
  rightJoinUsing(table, where) {
    this.relations.push(['RIGHT', table, where, true]);
    return this;
  }

  /**
   * Select clause
   *
   * @param {(...String)} columns
   *
   * @return {SqlSearch}
   */
  select(...columns) {
    if (columns.length === 1 && columns[0] instanceof Array) {
      columns = columns[0]
    }

    this.columns = columns;
    return this;
  }

  /**
   * Sort by clause
   *
   * @param {String} column
   * @param {String} [order='ASC']
   *
   * @return SqlSearch
   */
  sortBy(column, order = 'ASC') {
    if (order !== 'DESC') {
      order = 'ASC';
    }

    this.sort[column] = order;
    return this;
  }

  /**
   * Where clause
   *
   * @param {(...String)} args
   *
   * @return SqlSearch
   */
  where(...args) {
    this.filters.push(args);
    return this;
  }
}
