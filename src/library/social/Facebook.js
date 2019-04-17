// dependencies
import axios from 'axios';
import { Facebook as ExpoFacebook } from 'expo';
import async from 'async';
import withQuery from 'with-query';

/**
 * Facebook Social Library
 */
export default class Facebook {
  /**
   * Facebook Social Library Constructor
   */
  constructor(appId, appSecret) {
    // request url
    this.requestUrl = 'https://graph.facebook.com/';

    // app id
    this.appId = appId;

    // app secret
    this.appSecret = appSecret;

    // access token
    this.token = '';
  }

  /**
   * Fetches the detail of the current logged in facebook user.
   *
   * @return {Promise}
   */
  getDetail() {
    return new Promise((resolve, reject) => {
      // put this in async
      async.waterfall([
        // get basic details
        (callback) => {
          // build out the url
          const requestUrl = this._formatRequestUrl('me', { fields: 'id,name' });

          console.log('[Requesting]', requestUrl);

          axios.get(requestUrl)
            .then((response) => {
              callback(null, response.data);
            })
            .catch((error) => {
              callback(true, 'Something went wrong while accessing your info from Facebook.');
            });
        },

        // get profile picture
        (profile, callback) => {
          // build out the url
          const requestUrl = this._formatRequestUrl(
            'me/picture',
            { height: 480, redirect: false,  width: 480 }
          );

          console.log('[Requesting]', requestUrl);

          // send the request
          axios.get(requestUrl)
            .then((response) => {
                // merge data
                if (response.data && response.data.data) {
                  profile = {
                    ...profile,
                    ['image']: response.data.data.url
                  };
                }

                // proceed
                callback(null, profile);
              });
        }
      ], (err, data) => {
        if (err) {
          return reject({ message: data });
        }

        resolve(data);
      });
    });
  }

  /**
   * Login to Facebook using Expo's integration.
   *
   * @return {*}
   */
  login() {
    return ExpoFacebook
      .logInWithReadPermissionsAsync(
        this.appId,
        { permissions: ['public_profile']}
      );
  }

  /**
   * Sets the access token to be used for requests.
   *
   * @return {Class}
   */
  setAccessToken(token) {
    this.token = token;
    return this;
  }

  /**
   * Builds the request URL.
   *
   * @param {String} path
   * @param {Object} query
   *
   * @return {String}
   */
  _formatRequestUrl(path, query = {}) {
    // format query
    return withQuery(
      this.requestUrl + path,
      {
        ...query,
        ['access_token']: this.token
      },
      {
        stringifyOpt: { encode: true },
        parseOpt: { parseArray: false }
      }
    );
  }
}
