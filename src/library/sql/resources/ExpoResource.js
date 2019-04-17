import { SQLite as Resource } from 'expo';

import QueryInterface from '../contracts/QueryInterface';

export default class ExpoResource {
  /**
   * Set the resource
   *
   * @param {String} name
   */
  constructor(name) {
    this.resource = Resource.openDatabase(name);
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
    if (expression instanceof QueryInterface) {
      expression = expression.getQuery()
    }

    return new Promise(function (fulfill) {
      this.resource.transaction(transaction => {
        transaction.executeSql(expression, bind, (_, results) => {
          //if an id was returned
          if (typeof results.insertId !== 'undefined') {
            return fulfill(results.insertId);
          }

          //if a callback was set
          if (typeof callback !== 'function') {
            return fulfill(results.rows.array);
          }

          //loop the results passing
          //each row to the callback
          for (let i = 0; i < results.rows.length; i++) {
            //NOTE: try doing a linear test
            callback(results.rows.item(i));
          }

          fulfill(_);
        }, (_, error) => {
          throw SqlException.forQueryError(expression, error);
        });
      });
    });
  }
}
