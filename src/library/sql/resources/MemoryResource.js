import sqlite3 from 'sqlite3';

import SqlException from '../SqlException';
import QueryInterface from '../contracts/QueryInterface';

export default class SqliteResource {
  /**
   * Set the resource
   */
  constructor() {
    let sqlite = sqlite3.verbose();
    this.resource = new sqlite.Database(':memory:');
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
    bind = bind || [];
    if (expression instanceof QueryInterface) {
      expression = expression.getQuery()
    }

    return new Promise((fulfill, reject) => {
      if (expression.toUpperCase().indexOf('INSERT INTO') !== -1) {
        return this.resource.run(expression, bind, function(error) {
          if (error) {
            throw SqlException.forQueryError(expression, error.message);
          }

          //if a callback was set
          if (typeof callback !== 'function') {
            return fulfill(this.lastID);
          }

          callback(this.lastID);
          fulfill();
        });
      }

      this.resource.all(expression, bind, function(error, rows) {
        if (error) {
          throw SqlException.forQueryError(expression, error.message);
        }

        //if a callback was set
        if (typeof callback !== 'function') {
          return fulfill(rows);
        }

        rows.forEach(row => {
          callback(row);
        })

        fulfill();
      });
    });
  }
}
