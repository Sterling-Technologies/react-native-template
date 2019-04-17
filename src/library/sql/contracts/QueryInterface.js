import SqlException from '../SqlException';

export default class QueryInterface {
  /**
   * Returns the string of the query expression
   *
   * @return {String}
   */
  getQuery() {
    throw SqlException.forUndefinedAbstract('getQuery');
  }
}
