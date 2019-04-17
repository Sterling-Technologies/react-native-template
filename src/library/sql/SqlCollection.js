import AbstractCollection from '@library/core/AbstractCollection';

import SqlModel from './SqlModel';
import SqlException from './SqlException';

export default class SqlCollection extends AbstractCollection {
  /**
   * Sets the store name
   */
  constructor(schema, store) {
    super(schema.getName());

    this.schema = schema;
    this.store = store;
    this.primary = null;
  }

  /**
   * Inserts data to an external store or via API
   *
   * @param {Object} data
   *
   * @return {SqlCollection}
   */
  async insert(data) {
    const errors = this.schema.getErrors(data);

    if (Object.keys(errors).length) {
      throw SqlException.forErrorsFound(errors)
    }

    const fields = this.schema.getFields(data);

    let results = await this.store.insert(this.name, fields);

    return results
  }

  /**
   * Retrieves data from an external store or via API
   *
   * @param {String|Integer} id
   *
   * @return {Object}
   */
  async detail(id) {
    const key = this.getPrimaryKey();
    return await this.store.detail(this.name, key, id);
  }

  /**
   * Returns wallet model
   *
   * @param {Object} data
   *
   * @return {SqlModel}
   */
  getModel(data) {
    return SqlModel.load(data, this);
  }

  /**
   * Returns the primary key name
   *
   * @return {String|Integer}
   */
  getPrimaryKey() {
    if (!this.primary) {
      this.primary = this.schema.getPrimaryKey();
    }

    return this.primary;
  }

  /**
   * Removes data from an external store or via API
   *
   * @param {String|Integer}
   *
   * @return {SqlCollection}
   */
  async remove(id) {
    const key = this.getPrimaryKey();
    return await this.store.remove(this.name, key, id);
  }

  /**
   * Searches in an external store or via API
   *
   * @param {*} filters
   *
   * @return {Array}
   */
  async search(filters) {
    return await this.store.search(this.name, filters);
  }

  /**
   * Updates data to an external store or via API
   *
   * @param {String|Integer} id
   * @param {Object} data
   *
   * @return {SqlCollection}
   */
  async update(id, data) {
    const key = this.getPrimaryKey();

    if (typeof data[key] === 'undefined') {
      throw SqlException.for('Missing primary key %s', key);
    }

    const errors = this.schema.getErrors(data);

    if (Object.keys(errors).length) {
      throw SqlException.forErrorsFound(errors);
    }

    const fields = this.schema.getFields(data);
    return await this.store.update(this.name, key, id, fields);
  }
}
