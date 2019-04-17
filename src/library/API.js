import axios from 'axios';
import withQuery from 'with-query';
import { Auth } from 'aws-amplify';

import CryptoJS from 'crypto-js';

import app from '@library/AppHandler';

/**
 * API Utility
 */
export default class API {
  /**
   * API Constructor
   *
   * @param {Object} opts
   */
  constructor(opts = {}) {
    this.settings = opts;

    // set axios
    this.axios = axios.create();

    // base url
    this.axios.defaults.baseURL = opts.rest_url;

    // timeout config
    this.axios.defaults.timeout = opts.timeout || 20000;

    this.authRequest = opts.authenticate || false;
    this.encryptRequest = opts.encrypt || false;
    this.uploadRequest = opts.upload || false;
    this.isDevRequest = opts.isDev || false;
  }

  /**
   * This sets the request to include the access token.
   *
   * @return {Class}
   */
  authenticated() {
    this.authRequest = true;
    return this;
  }

  /**
  * Sets the request to be encrypted.
  *
  * @return {Class}
  */
  encrypted() {
    this.encryptRequest = true;
    return this;
  }

  /**
   * Sets the GET request
   *
   * @param {String} path
   * @param {Object} [query]
   *
   * @return {Promise}
   */
  async get(path, query = {}) {
    if (this.isDevRequest) {
      query.dev = true;
    }

    // build the request URL
    let requestUrl = await this._formatRequestUrl(path, query);

    // send the request
    return this.axios.get(requestUrl);
  }

  /**
   * Sets the POST request
   *
   * @param {String} path
   * @param {Object} payload
   * @param {Object} [query]
   *
   * @return {Promise}
   */
  async post(path, payload = {}, query = {}) {
    if (this.isDevRequest) {
      query.dev = true;
    }

    // format the url first
    let requestUrl = await this._formatRequestUrl(path, query);

    // has file upload?
    if (this.uploadRequest) {
      // create form data
      let form = new FormData();
      // convert object to form data
      payload = await this._buildFormData(form, payload);
    }

    // encrypt the request?
    if (this.encryptRequest) {
      payload = this._encryptPayload(payload);
    }

    // send out the request
    return this.axios.post(requestUrl, payload);
  }

  /**
   * Sets the request to form data
   *
   * @return {Class}
   */
  upload(upload = true) {
    this.uploadRequest = upload;
    return this;
  }

  /**
   * Sets the request to form data
   *
   * @return {Class}
   */
  setAsDev(isDev = true) {
    this.isDevRequest = isDev;
    return this;
  }

  /**
  * Builds an object into a form data.
  *
  * @param {Object} formData
  * @param {Object} data
  * @param {String} parentKey
  *
  * @return {Object}
  */
  _buildFormData(formData, data, parentKey) {
    // validate the data
    if (data && typeof data === 'object'
      && !(data instanceof Date)
      && !(data instanceof File)
    ) {
      // check if data is an object and is a file/image
      // file if it has a uri
      if (typeof data === 'object' && data.uri) {
        formData.append(parentKey, {
          uri: data.uri,
          type: data.type,
          name: data.name
        });
      } else {
          // if not image
          // iterate on each object
          Object.keys(data).forEach(key => {
            // process nested objects
            this._buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
          });
        }
    } else {
      // do we have a value?
      const value = data == null ? '' : data;

      // append the data to form
      formData.append(parentKey, value);
    }

    return formData;
  }

  /**
   * Encrypts the payload to be sent to the server.
   *
   * @param {Object} data
   *
   * @return {Object}
   */
  _encryptPayload(data) {
    // encrypt transaction data
    const encrypt = CryptoJS.AES.encrypt(JSON.stringify(data), this.settings.salt);

    return { data: encrypt.toString() };
  }

  /**
   * Builds the request URL.
   *
   * @param {String} path
   * @param {Object} query
   *
   * @return {String}
   */
  async _formatRequestUrl(path, query = {}) {
    // request should be authenticated
    if (this.authRequest) {
      try {
        let token = (await Auth.currentSession()).getAccessToken().getJwtToken();

        if (token) {
          this.axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        }
      } catch (error) {}
    }

    // format query
    let url = withQuery(
      path,
      query,
      {
        stringifyOpt: { encode: true },
        parseOpt: { parseArray: false }
      }
    );

    // log the request url
    this._logRequestUrl(path, query);

    return url;
  }

  /**
   * Logs the full url of the request.
   *
   * @param {String} path
   * @param {Object} query
   *
   * @return {NULL}
   */
  _logRequestUrl(path, query = {}) {
      // set the request url
      let url = this.axios.defaults.baseURL;

      app.log('url', url);

      // remove the access token
      delete query.access_token;

      // format query
      url = withQuery(
        url + path,
        query,
        {
          stringifyOpt: { encode: true },
          parseOpt: { parseArray: false }
        }
      );

      app.log('[Request URL]', url);

      return;
    }
}
