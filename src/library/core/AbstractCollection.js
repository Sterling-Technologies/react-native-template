import Exception from './Exception';

import CollectionInterface from './contracts/CollectionInterface';

/**
 * Collection abstract used as a starting point
 * to implement CollectionInterface
 */
export default class AbstractCollection extends CollectionInterface {
  /**
   * Sets the collection name
   */
  constructor(name) {
    super(name);
    this.name = name;
  }

  /**
   * Returns the primary key name
   *
   * @return {(String|Integer)}
   */
  getPrimaryKey() {
    throw Exception.forUndefinedAbstract('getPrimaryKey');
  }
}
