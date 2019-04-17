import StoreInterfaceBase from '@library/core/contracts/StoreInterface';
import SqlException from '../SqlException';

export default class StoreInterface extends StoreInterfaceBase {
  /**
   * Raw query maker
   *
   * @param {String} expression
   * @param {Array} [bind]
   * @param {Function} [callback]
   *
   * @return {Array}
   */
  async query(expression, bind, callback) {
    throw SqlException.forUndefinedAbstract('create');
  }
}
