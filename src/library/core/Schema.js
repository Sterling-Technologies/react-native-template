import Exception from './Exception';

/**
 * Schema used for stores and form validation
 */
export default class Schema {
  /**
   * Sets up the default field collection
   *
   * @param {String} name
   */
  constructor(name) {
    this.name = name;
    this.fields = {};
  }

  /**
   * Static loader
   *
   * @param {String} name
   *
   * @return {Schema}
   */
  static load(name) {
    return new Schema(name);
  }

  /**
   * Adds a field definition
   *
   * @param {String} name
   * @param {String} type
   * @param {*} initial
   *
   * @return {Schema}
   */
  addField(name, type, initial) {
    this.fields[name] = {
        type,
        initial,
        validation: []
    };

    return this;
  }

  /**
   * Adds a custom validator against a field
   *
   * @param {String} name
   * @param {Function} callback
   *
   * @return {Schema}
   */
  addValidation(name, callback) {
    if (typeof this.fields[name] === 'undefined') {
      throw Exception.for('Adding validation for undefined field %s', name);
    }

    this.fields[name].validation.push(callback);
    return this;
  }

  /**
   * Returns errors based on validation
   *
   * @param {Object} data
   *
   * @return {Object}
   */
  getErrors(data) {
    let errors = {};

    Object.keys(this.fields).forEach(name => {
      let type = this.fields[name].type;
      let value = data[name];

      if (
        typeof value === 'undefined'
        && typeof this.fields[name].initial === 'undefined'
      ) {
        errors[name] = 'missing';
        return;
      }

      switch (true) {
        case type === 'int' && !Number.isInteger(value):
        case type === 'float' && isNaN(parseFloat(value)):
        case type === 'bool' && typeof value !== 'boolean':
        case type === 'string' && typeof value !== 'string':
        case type === 'text' && typeof value !== 'text':
        case type === 'json' && typeof value !== 'object':
          errors[name] = 'expected ' + type;
          return;
      }

      this.fields[name].validation.forEach(callback => {
        callback(value, errors);
      });
    });

    return errors;
  }

  /**
   * Removes keys from the data that is not defined in the schema
   *
   * @param {Object} data
   *
   * @return {Object}
   */
  getFields(data) {
    let fields = {}
    Object.keys(this.fields).forEach(name => {
      if (typeof data[name] !== 'undefined') {
        fields[name] = data[name];
      } else if (typeof this.fields[name].initial !== 'undefined') {
        fields[name] = this.fields[name].initial;
      }
    });

    return fields;
  }

  /**
   * Returns the name of the schema
   *
   * @return {String}
   */
  getName() {
    return this.name;
  }
}
