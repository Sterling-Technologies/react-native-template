import { SecureStore } from 'expo';
import { AsyncStorage } from 'react-native';

/**
 * Storage Class
 *
 */
export default class Storage {
  /**
   * Storage Class Constructor
   *
   */
  constructor() {
    // list of secured keys known in the whole app
    this.securedKeys = [
      'pin_code',
    ];
  }

  /**
   * Removes all known securestore keys and asyncstorage
   *
   * @return {Promise}
   */
  deleteAll() {
    let cleanup = [];

    // clean async
    cleanup.push(AsyncStorage.clear());

    // loop the secured keys
    for (let sk in this.securedKeys) {
      cleanup.push(SecureStore.deleteItemAsync(this.securedKeys[sk]));
    }

    return Promise.all(cleanup);
  }

  /**
   * Deletes an item either from AsyncStorage or SecureStore
   *
   * @param {String} key
   * @param {Boolean} [secured]
   *
   * @return {*}
   */
  deleteItem(key, secured = false) {
    if (secured) {
      return SecureStore.deleteItemAsync(key);
    }

    return AsyncStorage.removeItem(key);
  }

  /**
   * Fetches an item from the selected Storage.
   *
   * @param {String} key
   * @param {Boolean} secured
   *
   * @return {Promise}
   */
  getItem(key, secured = false) {
    if (secured) {
      return SecureStore.getItemAsync(key);
    }

    return AsyncStorage.getItem(key);
  }

  /**
   * Stores an item.
   *
   * @param {String} key
   * @param {String|Integer} value
   * @param {Boolean} secured
   *
   * @return {Promise}
   */
  setItem(key, value, secured = false) {
    if (secured) {
      return SecureStore.setItemAsync(key, value);
    }

    return AsyncStorage.setItem(key, value);
  }
}
