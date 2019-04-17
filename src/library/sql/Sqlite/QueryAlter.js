import QueryInterface from '../contracts/QueryInterface';

export default class QueryAlter extends QueryInterface {
  /**
   * Construct: Set the table, if any
   *
   * @param {String} [table]
   */
  constructor(table) {
    super();

    this.table = null;

    this.addKeys = {};
    this.addFields = {};
    this.changeFields = {};
    this.addUniqueKeys = [];
    this.addPrimaryKeys = [];

    this.removeKeys = [];
    this.removeFields = [];
    this.removeUniqueKeys = [];
    this.removePrimaryKeys = [];

    if (typeof table === 'string') {
      this.setTable(table);
    }
  }

  /**
   * Adds a field in the table
   *
   * @param {String} name
   * @param {Array} attributes
   *
   * @return {QueryAlter}
   */
  addField(name, attributes) {
    this.addFields[name] = attributes;
    return this;
  }

  /**
   * Adds an index key
   *
   * @param {String} name
   * @param {String} table
   * @param {String} key
   *
   * @return {QueryAlter}
   */
  addForeignKey(name, table, key) {
    this.addKeys[name] = [table, key];
    return this;
  }

  /**
   * Adds a unique key
   *
   * @param {String} name
   *
   * @return {QueryAlter}
   */
  addUniqueKey(name) {
    this.addUniqueKeys.push('"%s"'.replace('%s', name));
    return this;
  }

  /**
   * Changes attributes of the table given
   * the field name
   *
   * @param {String} name
   * @param {Array} attributes
   *
   * @return {QueryAlter}
   */
  changeField(name, attributes) {
    this.changeFields[name] = attributes;
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
    let table = '"%s"'.replace('%s', this.table);

    this.removeFields.forEach(name => {
      fields.push('DROP "%s"'.replace('%s', name));
    });

    Object.keys(this.addFields).forEach(name => {
      let attr = this.addFields[name];
      let field = ['ADD "%s"'.replace('%s', name)];

      if (typeof attr['type'] !== 'undefined') {
        field.push(attr['length']
          ? (attr['type'] + '(' + attr['length'] + ')')
          : attr['type']
        );
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
    })

    Object.keys(this.changeFields).forEach(name => {
      let attr = this.addFields[name];
      let field = [
        'CHANGE "%s" "%s"'
          .replace('%s', name)
          .replace('%s', name)
      ];

      if (typeof attr['name'] !== 'undefined') {
        field = [
          'CHANGE "%s" "%s"'
            .replace('%s', name)
            .replace('%s', attr['name'])
        ]
      }

      if (typeof attr['type'] !== 'undefined') {
        field.push(attr['length']
          ? (attr['type'] + '(' + attr['length'] + ')')
          : attr['type']
        )
      }

      if (typeof attr['attribute'] !== 'undefined') {
        field.push(attr['attribute'])
      }

      if (typeof attr['null'] !== 'undefined') {
        if (attr['null'] === false) {
          field.push('NOT NULL')
        } else {
          field.push('DEFAULT NULL')
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
    })

    this.removeKeys.forEach(key => {
      fields.push('DROP FOREIGN KEY "%s"'.replace('%s', key))
    });

    Object.keys(this.addKeys).forEach(key => {
      fields.push(
        'ADD FOREIGN KEY "%s" REFERENCES %s(%s)'
          .replace('%s', key)
          .replace('%s', this.keys[key][0])
          .replace('%s', this.keys[key][1])
      );
    });

    this.removeUniqueKeys.forEach(key => {
      fields.push('DROP UNIQUE "%s"'.replace('%s', key));
    });

    if (this.addUniqueKeys.length) {
      fields.push('ADD UNIQUE (%s)'.replace('%s', this.addUniqueKeys.join(', ')));
    }

    return 'ALTER TABLE %s %s'.replace('%s', table).replace(fields.join(', '))
  }

  /**
   * Removes a field
   *
   * @param {String} name
   *
   * @return {QueryAlter}
   */
  removeField(name) {
    this.removeFields.push(name);
    return this;
  }

  /**
   * Removes an index key
   *
   * @param {String} name
   *
   * @return {QueryAlter}
   */
  removeForeignKey(name) {
    this.removeKeys.push(name);
    return this;
  }

  /**
   * Removes a unique key
   *
   * @param {String} name
   *
   * @return {QueryAlter}
   */
  removeUniqueKey(name) {
    this.removeUniqueKeys.push(name);
    return this;
  }

  /**
   * Sets the name of the table you wish to create
   *
   * @param {String} table
   *
   * @return {QueryAlter}
   */
  setTable(table) {
    this.table = table;
    return this;
  }
}
