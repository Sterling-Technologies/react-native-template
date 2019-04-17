import Registry from './Registry';

export default class Response extends Registry {
  /**
   * Static loader
   *
   * @return {Response}
   */
  static load(data) {
    return new Response(data);
  }

  /**
   * Returns the error message
   *
   * @return {String}
   */
  getMessage() {
    return this.get('json', 'message');
  }

  /**
   * Retrieves the result data stored specified by the path
   *
   * @param {(...String)} [path]
   *
   * @return {*}
   */
  getResults(...path) {
    path.unshift('results');
    path.unshift('json');

    return this.get.apply(this, path);
  }

  /**
   * Returns true if the specified result path exists
   *
   * @param {(...String)} path
   *
   * @return {Boolean}
   */
  hasResults(...path) {
    path.unshift('results');
    path.unshift('json');

    return this.has.apply(this, path);
  }

  /**
   * Returns true if there is an error
   *
   * @return {Boolean}
   */
  isError() {
    return !!this.get('json', 'error');
  }

  /**
   * Removes the result data from a specified path
   *
   * @param {(...String)} [path]
   *
   * @return {Response}
   */
  removeResults(...path) {
    path.unshift('results');
    path.unshift('json');

    return this.remove.apply(this, path);
  }

  /**
   * Sets an error message
   *
   * @param {Boolean}
   * @param {String}
   *
   * @return {Response}
   */
  setError(error, message) {
    this.set('json', 'error', error || false);

    if (typeof message === 'string' && message.trim().length) {
      this.set('json', 'message', message);
    }

    return this
  }

  /**
   * Sets the result data of a specified path
   *
   * @param {(...String)} path
   * @param {*} value
   *
   * @return Response
   */
  setResults(...path) {
    path.unshift('results');
    path.unshift('json');

    return this.set.apply(this, path);
  }
}
