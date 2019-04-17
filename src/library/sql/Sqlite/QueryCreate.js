import QueryInterface from '../contracts/QueryInterface';

export default class QueryCreate extends QueryInterface {
  /**
   * Construct: Set the table, if any
   *
   * @param {String} [table]
   */
  constructor(table) {
    super();

    this.table = null;
    this.comments = null;
    this.fields = {};
    this.keys = {};
    this.uniqueKeys = [];

    if (typeof table === 'string') {
      this.setTable(table)
    }
  }

  /**
   * Adds a field in the table
   *
   * @param {String} name
   * @param {Array} attributes
   *
   * @return {QueryCreate}
   */
  addField(name, attributes) {
    this.fields[name] = attributes;
    return this;
  }

  /**
   * Adds an index key
   *
   * @param {String} name
   * @param {String} table
   * @param {String} key
   *
   * @return {QueryCreate}
   */
  addForeignKey(name, table, key) {
    this.keys[name] = [table, key];
    return this;
  }

  /**
   * Adds a unique key
   *
   * @param {String} name
   *
   * @return {QueryCreate}
   */
  addUniqueKey(name) {
    this.uniqueKeys.push(name);
    return this;
  }

  /**
   * Returns the string version of the query
   *
   * @param {Boolean} [unbind=false]
   *
   * @return {String}
   */
  getQuery(unbind = false) {
    let fields = [];
    let table = '"' + this.table + '"';

    Object.keys(this.fields).forEach(name => {
      let field = ['"%s"'.replace('%s', name)];
      let attr = this.fields[name];

      if (typeof attr['type'] !== 'undefined') {
        field.push(attr['length']
          ? (attr['type'] + '(' + attr['length'] + ')')
          : attr['type']
        );
      }


      if (typeof attr['primary'] !== 'undefined') {
        field.push('PRIMARY KEY');
      }

      if (typeof attr['attribute'] !== 'undefined') {
        field.push(attr['attribute']);
      }

      if (typeof attr['null'] !== 'undefined') {
        if (attr['null'] === false) {
          field.push('NOT NULL');
        } else {
          field.push('DEFAULT NULL');
        }
      }

      if (attr['default'] !== false) {
        if (typeof attr['null'] === 'undefined' || !attr['null']) {
          if (typeof attr['default'] === 'string') {
            field.push("DEFAULT '%s'".replace('%s', attr['default']));
          } else if (typeof attr['default'] === 'number') {
            field.push('DEFAULT %s'.replace('%s', attr['default']));
          }
        }
      }

      fields.push(field.join(' '));
    });

    fields = fields.join(', ');

    let uniques = '';
    if (this.uniqueKeys.length) {
      uniques = ', UNIQUE ("%s")'.replace('%s', this.uniqueKeys.join('", "'))
    }

    let keys = [];
    Object.keys(this.keys).forEach(key => {
      keys.push(
        'FOREIGN KEY "%s" REFERENCES %s(%s)'
          .replace('%s', key)
          .replace('%s', this.keys[key][0])
          .replace('%s', this.keys[key][1])
      );
    });

    keys = ', ' + keys.join(', ');
    if (keys === ', ') {
      keys = '';
    }

    return 'CREATE TABLE %s (%s%s%s)'
      .replace('%s', table)
      .replace('%s', fields)
      .replace('%s', uniques)
      .replace('%s', keys);
  }

  /**
   * Sets a list of fields to the table
   *
   * @param {Array} fields
   *
   * @return {QueryCreate}
   */
  setFields(fields) {
    this.fields = fields;
    return this;
  }

  /**
   * Sets a list of keys to the table
   *
   * @param {Array} keys
   *
   * @return {QueryCreate}
   */
  setForiegnKeys(keys) {
    this.keys = keys;
    return this;
  }

  /**
   * Sets the name of the table you wish to create
   *
   * @param {String} table
   *
   * @return {QueryCreate}
   */
  setTable(table) {
    this.table = table;
    return this;
  }

  /**
   * Sets a list of unique keys to the table
   *
   * @param {Array} uniqueKeys
   *
   * @return {QueryCreate}
   */
  setUniqueKeys(uniqueKeys) {
    this.uniqueKeys = uniqueKeys;
    return this;
  }
}
