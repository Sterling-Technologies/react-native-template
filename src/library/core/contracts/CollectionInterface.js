import Registry from '../Registry';
import Exception from '../Exception';

/**
 * Collection contract
 */
export default class CollectionInterface {
  /**
   * Inserts data to an external store or via API
   *
   * @param {Object} data
   *
   * @return {CollectionInterface}
   */
  async insert(data) {
    throw Exception.forUndefinedAbstract('create');
  }

  /**
   * Retrieves data from an external store or via API
   *
   * @param {String|Integer} id
   *
   * @return {Object}
   */
  async detail(id) {
    throw Exception.forUndefinedAbstract('detail');
  }

  /**
   * Removes data from an external store or via API
   *
   * @param {String|Integer} id
   *
   * @return {CollectionInterface}
   */
  async remove(id) {
    throw Exception.forUndefinedAbstract('remove');
  }

  /**
   * Searches in an external store or via API
   *
   * @param {*} filters
   *
   * @return {Array}
   */
  async search(filters) {
    throw Exception.forUndefinedAbstract('search');
  }

  /**
   * Updates data to an external store or via API
   *
   * @param {String|Integer} id
   * @param {Object} data
   *
   * @return {CollectionInterface}
   */
  async update(id, data) {
    throw Exception.forUndefinedAbstract('update');
  }
}
