import Model from '@library/core/Model';

export default class SqlModel extends Model {
  /**
   * Model Loader
   *
   * @param {Object} [data = {}]
   * @param {CollectionInterface} [collection]
   *
   * @return {SqlModel}
   */
  static load(data, collection) {
    return new SqlModel(data, collection)
  }
}
