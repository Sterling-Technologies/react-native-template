import Registry from '../Registry';
import Exception from '../Exception';

/**
 * Model contract
 */
export default class ModelInterface extends Registry {
  /**
   * Inserts data to an external store or via API
   *
   * @return {ModelInterface}
   */
  async insert() {
    throw Exception.forUndefinedAbstract('create');
  }

  /**
   * Removes data from an external store or via API
   *
   * @return {ModelInterface}
   */
  async remove() {
    throw Exception.forUndefinedAbstract('remove');
  }

  /**
   * Inserts or updates data to an external store or via API
   *
   * @return {ModelInterface}
   */
  async save() {
    throw Exception.forUndefinedAbstract('save');
  }

  /**
   * Updates data to an external store or via API
   *
   * @return {ModelInterface}
   */
  async update() {
    throw Exception.forUndefinedAbstract('update');
  }
}
