import Exception from './Exception';
import Registry from './Registry';

import ModelInterface from './contracts/ModelInterface';

/**
 * Model abstract used as a starting point
 * to implement ModelInterface
 */
export default class Model extends ModelInterface {
  /**
   * Adds the initial data
   *
   * @param {Object} [data = {}]
   * @param {CollectionInterface} [collection]
   */
  constructor(data = {}, collection = null) {
    super(data);
    //need a mixin for registry
    Object.assign(this, Registry.prototype);
    //then set the data
    this.data = data;
    //then set the collection
    this.collection = collection;
  }

  /**
   * Model Loader
   *
   * @param {Object} [data = {}]
   * @param {CollectionInterface} [collection]
   *
   * @return Model
   */
  static load(data = {}, collection = null) {
    return new Model(data, collection);
  }

  /**
   * Clones the data and returns a new Model class
   *
   * @return {Model}
   */
  clone() {
    return new this.constructor(
      Object.assign({}, this.data)
    );
  }

  /**
   * Copies data from one key to the other
   *
   * @param {(String|Integer)} from
   * @param {(String|Integer)} to
   *
   * @return {Model}
   */
  copy(from, to) {
    this.data[to] = this.data[from];
    return this;
  }

  /**
   * Inserts data to an external store or via API
   *
   * @param {CollectionInterface} [collection]
   *
   * @return {Model}
   */
  async insert(collection = null) {
    this.data = await this._getCollection(collection).insert(this.data);
    return this;
  }

  /**
   * Removes data from an external store or via API
   *
   * @param {CollectionInterface} [collection]
   *
   * @return {Model}
   */
  async remove(collection = null) {
    const primaryKey = this._getCollection(collection).getPrimaryKey();

    if (typeof this.data[primaryKey] === 'undefined') {
      throw Exception.for('Missing %s', primaryKey);
    }

    return this._getCollection(collection).remove(this.data[primaryKey]);
  }

  /**
   * Inserts or updates data to an external store or via API
   *
   * @param {CollectionInterface} [collection]
   *
   * @return {Model}
   */
  async save(collection = null) {
    const primaryKey = this._getCollection(collection).getPrimaryKey();

    if (typeof this.data[primaryKey] === 'undefined') {
      return this.insert(collection);
    }

    return this.update(collection);
  }

  /**
   * Updates data to an external store or via API
   *
   * @param {CollectionInterface} [collection]
   *
   * @return {Model}
   */
  async update(collection = null) {
    const primaryKey = this._getCollection(collection).getPrimaryKey();

    if (typeof this.data[primaryKey] === 'undefined') {
      throw Exception.for('Missing %s', primaryKey);
    }

    this.data = await this._getCollection(collection).update(
      this.data[primaryKey],
      this.data
    );

    return this;
  }

  /**
   * Determines what collection should be used
   *
   * @private
   *
   * @param {CollectionInterface} [collection]
   *
   * @return {Model}
   */
  _getCollection(collection = null) {
    if (!collection) {
      collection = this.collection;
    }

    if (!collection) {
      throw Exception.for('Collection not set');
    }

    return collection;
  }
}
