import Exception from '../Exception';

/**
 * Store contract
 */
export default class StoreInterface {
  /**
   * Inserts data to the store
   *
   * @param {String} collection
   * @param {Object} data
   *
   * @return {StoreInterface}
   */
  async insert(collection, data) {
    throw Exception.forUndefinedAbstract('create');
  }

  /**
   * Retrieves data from the store
   *
   * @param {String} collection
   * @param {String} key
   * @param {(String|Integer)} id
   *
   * @return {Object}
   */
  async detail(collection, key, id) {
    throw Exception.forUndefinedAbstract('detail');
  }

  /**
   * Removes data from the store
   *
   * @param {String} collection
   * @param {String} key
   * @param {(String|Integer)} id
   *
   * @return {StoreInterface}
   */
  async remove(collection, key, id) {
    throw Exception.forUndefinedAbstract('remove');
  }

  /**
   * Searches in the store
   *
   * @param {String} collection
   * @param {*} [filters]
   *
   * @return [Array]
   */
  async search(collection, filters) {
    throw Exception.forUndefinedAbstract('search');
  }

  /**
   * Updates data to the store
   *
   * @param {String} collection
   * @param {String} key
   * @param {(String|Integer)} id
   * @param {Object} data
   *
   * @return {StoreInterface}
   */
  async update(collection, key, id, data) {
    throw Exception.forUndefinedAbstract('update');
  }
}
