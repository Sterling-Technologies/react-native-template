import Registry from './Registry';

export default class Request extends Registry {
  /**
   * Static loader
   *
   * @return {Request}
   */
  static load(data) {
    return new Request(data);
  }

  /**
   * Retrieves the stage data stored specified by the path
   *
   * @param {(...String)} [path]
   *
   * @return {*}
   */
  getStage(...path) {
    path.unshift('stage');
    return this.get.apply(this, path);
  }

  /**
   * Returns true if the specified stage path exists
   *
   * @param {(...String)} path
   *
   * @return {Boolean}
   */
  hasStage(...path) {
    path.unshift('stage');
    return this.has.apply(this, path);
  }

  /**
   * Removes the stage data from a specified path
   *
   * @param {(...String)} path
   *
   * @return {Request}
   */
  removeStage(...path) {
    path.unshift('stage');
    return this.remove.apply(this, path);
  }

  /**
   * Sets the stage data of a specified path
   *
   * @param {(...String)} path
   * @param {*} value
   *
   * @return Request
   */
  setStage(...path) {
    path.unshift('stage');
    return this.set.apply(this, path);
  }
}
