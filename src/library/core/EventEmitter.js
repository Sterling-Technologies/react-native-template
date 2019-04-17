import EventInterface from './contracts/EventInterface';

/**
 * Allows the ability to listen to events made known by another
 * piece of functionality. Events are items that transpire based
 * on an action. With events you can add extra functionality
 * right after the event has triggered.
 */
export default class EventEmitter extends EventInterface {
  /**
   * Sets the default state of listeners
   */
  constructor() {
    super();
    this.listeners = {};
  }

  /**
   * Static loader
   *
   * @return {EventEmitter}
   */
  static load() {
    return new EventEmitter();
  }

  /**
   * Adds a callback to the given event listener
   *
   * @param {String} event
   * @param {Function} callback
   *
   * @return {EventEmitter}
   */
  on(event, callback) {
    if (typeof this.listeners[event] === 'undefined') {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
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
    if (typeof this.listeners[event] === 'undefined') {
      return this;
    }

    await EventEmitter.forEach(this.listeners[event], async callback => {
      if (await callback(...args) === false) {
        return false;
      }
    })

    return this;
  }

  /**
   * Asyncronous Looper
   *
   * @param {(Object|Array)} list
   * @param {Function} callback
   */
  static async forEach(list, callback) {
    for (let results, index = 0; index < list.length; index++) {
      if (await callback(list[index], index) === false) {
        break;
      }
    }
  }
}
