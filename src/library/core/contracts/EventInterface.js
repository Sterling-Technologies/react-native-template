import Exception from '../Exception';

/**
 * Event contract
 */
export default class EventInterface {
  /**
   * Adds a callback to the given event listener
   *
   * @param {String} event
   * @param {Function} callback
   *
   * @return {EventEmitter}
   */
  on(event, callback) {
    throw Exception.forUndefinedAbstract('on');
  }

  /**
   * Calls all the callbacks of the given event passing the given arguments
   *
   * @param {String} event
   * @param {(...*)} args
   *
   * @return {EventEmitter}
   */
  async trigger(event, ...args) {
    throw Exception.forUndefinedAbstract('trigger');
  }
}
