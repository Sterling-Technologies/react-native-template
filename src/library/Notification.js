import { Permissions, Notifications } from 'expo';
import async from 'async';

/**
 * Notification Class
 *
 */
export default class Notification {
  /**
   * Notification Class Constructor
   *
   */
  constructor() {
    // stores the permission
    this.status;
  }

  /**
   * Asks for permission to access device notification.
   *
   * @return {Promise}
   */
  askPermission() {
    return new Promise((resolve, reject) => {
      // put this in async
      async.waterfall([
        // check if we have status
        (callback) => {
          if (this.status) {
            // proceed
            return callback();
          }

          this.getStatus().then((status) => {
            // proceed
            callback();
          });
        },

        // check the status
        (callback) => {
          if (this.status !== 'granted') {
            // ask permission
            Permissions.askAsync(Permissions.NOTIFICATIONS)
              .then((permission) => {
                // set the status
                this.status = permission.status;

                // proceed
                callback(null,  permission.status);
              });
            return false;
          }

          // proceed
          callback(null, this.status);
        }
      ], (err, data) => {
        if (err || data !== 'granted') {
          return reject(data);
        }

        resolve(data);
      });
    });
  }

  /**
   * Checks the current permission status if we have access for notifications.
   *
   * @return {Promise}
   */
  getStatus() {
    return new Promise((resolve, reject) => {
      Permissions.getAsync(Permissions.NOTIFICATIONS)
        .then((permission) => {
          this.status =  permission.status;

          // resolve it
          resolve(permission.status);
        });
    });
  }

  /**
   * Fetches the push token
   *
   * @return {Promise}
   */
  getToken() {
    return Notifications.getExpoPushTokenAsync();
  }
}
