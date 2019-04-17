import SchemaBase from '@library/core/Schema';

export default class Schema extends SchemaBase {
  /**
   * Sets up the default field collection
   *
   * @param {String} name
   * @param {Store} store
   */
  constructor(name, store) {
    super(name);
    this.store = store;
  }

  /**
   * Static loader
   *
   * @param {String} name
   * @param {Store} store
   *
   * @return {Schema}
   */
  static load(name, store) {
    return new Schema(name, store);
  }

  /**
   * Builds the schema into a store
   *
   * @return {Schema}
   */
  async build() {
    //drop the table
    await this.store.dropTable(this.getName());
    //then create
    let query = this.store.getCreateQuery(this.getName());

    Object.keys(this.fields).forEach(name => {
      let field = Object.assign({}, this.fields[name]);
      switch(field.type) {
        case 'primary':
          field.primary = true;
        case 'int':
        case 'bool':
        case 'float':
          field.type = 'INTEGER';
          break;
        case 'float':
          field.type = 'REAL';
          break;
        case 'unique':
          query.addUniqueKey(name);
        case 'string':
        case 'text':
        case 'json':
          field.type = 'TEXT';
          break;
      }

      if (field.initial === null) {
        field['null'] = true;
      } else {
        field['default'] = field.initial;
      }

      query.addField(name, field);
    })

    await this.store.query(query);
    return this;
  }

  /**
   * Returns a collection
   *
   * @return {SqlCollection}
   */
  getCollection() {
    return this.store.getCollection(this);
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
        && this.fields[name].type !== 'primary'
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

  getPrimaryKey() {
    for (let key in this.fields) {
      if (this.fields[key].type === 'primary') {
        return key;
      }
    }

    return null;
  }
}
