import RegistryInterface from './contracts/RegistryInterface';

/**
 * Registry are designed to easily manipulate data in
 * preparation to integrate with any multi dimensional
 * data store.
 */
export default class Registry extends RegistryInterface {
  /**
   * Sets the initial data
   *
   * @param {Object} [data = {}]
   */
  constructor(data = {}) {
    super(data);
    this.data = data;
  }

  /**
   * Registry Loader
   *
   * @param {Object} [data = {}]
   *
   * @return Registry
   */
  static load(data = {}) {
    return new Registry(data);
  }

  /**
   * Loops though the data of a specified path
   *
   * @param {(...String)} [path]
   *
   * @return {Registry}
   */
  each(...path) {
    const callback = path.pop();
    let list = this.get.apply(this, path);

    if (!list) {
      return this;
    }

    if (list instanceof Array && !list.length) {
      return this;
    }

    if (typeof list === 'string' && !list.length) {
      return this;
    }

    if (typeof list === 'object' && !Object.keys(list).length) {
      return this;
    }

    for(let key in list) {
      if (callback(list[key], key) === false) {
        break;
      }
    }

    return this;
  }

  /**
   * Retrieves the data stored specified by the path
   *
   * @param {(...String)} [path]
   *
   * @return {*}
   */
  get(...path) {
    if (!path.length) {
      return this.data;
    }

    if (!this.has.apply(this, path)) {
      return null;
    }

    const last = path.pop();
    let pointer = this.data;

    path.forEach((step, i) => {
      pointer = pointer[step];
    });

    return pointer[last];
  }

  /**
   * Returns true if the specified path exists
   *
   * @param {(...String)} path
   *
   * @return {Boolean}
   */
  has(...path) {
    if (!path.length) {
      return false;
    }

    let found = true;
    const last = path.pop();
    let pointer = this.data;

    path.forEach((step, i) => {
      if (!found) {
        return;
      }

      if (typeof pointer[step] !== 'object') {
        found = false;
        return;
      }

      pointer = pointer[step];
    });

    return !(!found || typeof pointer[last] === 'undefined');
  }

  /**
   * Removes the data from a specified path
   *
   * @param {(...String)} [path]
   *
   * @return {Registry}
   */
  remove(...path) {
    if (!path.length) {
      return this;
    }

    if (!this.has.apply(this, path)) {
      return this;
    }

    const last = path.pop();
    let pointer = this.data;

    path.forEach((step, i) => {
      pointer = pointer[step];
    });

    delete pointer[last];

    return this;
  }

  /**
   * Sets the data of a specified path
   *
   * @param {(...String)} path
   * @param {*} value
   *
   * @return {Registry}
   */
  set(...path) {
    if (path.length < 1) {
      return this;
    }

    let value = path.pop();
    const last = path.pop();
    let pointer = this.data;

    path.forEach((step, i) => {
      if (typeof pointer[step] !== 'object') {
        pointer[step] = {};
      }

      pointer = pointer[step];
    });

    pointer[last] = value;

    return this;
  }
}
