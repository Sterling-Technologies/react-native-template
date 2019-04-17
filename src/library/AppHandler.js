import {createStackNavigator, createAppContainer} from 'react-navigation';

import EventEmitter from './core/EventEmitter';
import Request from './core/Request';
import Response from './core/Response';

import { SqliteStore } from '@library/sql';

class AppHandler {
  /**
   * Sets up the navigation and the event emitter
   */
  constructor() {
    this.navigation = {};
    this.emitter = EventEmitter.load();
  }

  /**
   * Static loader
   *
   * @return {AppHandler}
   */
  static load() {
    //singleton pattern
    if (typeof AppHandler.instance === 'undefined') {
      AppHandler.instance = new AppHandler()
    }

    return AppHandler.instance;
  }

  /**
   * Add loggers this way instead of using console.log
   *
   * @param {Function} callback
   *
   * @return {AppHandler}
   */
  addLogger(callback) {
    return this.on('_logger', callback);
  }

  /**
   * Add loggers this way instead of using console.log
   *
   * @param {Array} screens
   *
   * @return {AppHandler}
   */
  addNavigation(screens) {
    Object.keys(screens).forEach(name => {
      screens[name].app = this;
      this.navigation[name] = { screen: screens[name] };
    });

    return this;
  }

  /**
   * Easily access configuration paths without
   * hardcoding those in other classes
   *
   * @param {String} path
   * @param {String} [key]
   *
   * @return {*}
   */
  config(path, key) {
    let config = {};
    switch (path) {
      case 'services':
        config = require('../../config/services');
        break;
      case 'settings':
        config = require('../../config/settings');
        break;
      case 'settings.dev':
        config = require('../../config/settings.dev');
        break;
      case 'settings.stage':
        config = require('../../config/settings.stage');
        break;
      case 'settings.prod':
        config = require('../../config/settings.prod');
        break;
      default:
        break;
    }

    if (key && config[key]) {
      return config[key];
    }

    return config;
  }

  /**
   * Use this method instead of console.log
   *
   * @param {(...*)} args
   *
   * @return {AppHandler}
   */
  async log(...args) {
    return await this.trigger('_logger', ...args);
  }

  /**
   * Makes a request and response payload
   *
   * @return {Object}
   */
  makePayload() {
    let request = new Request();
    let response = new Response();
    return {
      req: request,
      res: response
    };
  }

  /**
   * Adds a callback to the given event listener
   *
   * @param {String} event
   * @param {Function} callback
   *
   * @return {AppHandler}
   */
  on(event, callback) {
    this.emitter.on(event, callback);
    return this;
  }

  /**
   * A pattern to call events auto configuring the RnR
   *
   * @param {String} event
   * @param {(Request|Object)} request
   * @param {Response} response
   *
   * @return {(Object|Boolean)}
   */
  async method(event, request, response) {
    if (!request) {
      request = Request.load();
    } else if (request.constructor === Object) {
      request = Request.load().setStage(request);
    }

    if (!response) {
      response = Response.load();
    }

    await this.trigger(event, request, response);

    if (response.isError()) {
      return false;
    }

    return response.getResults();
  }

  /**
   * Modules can initialize their own things
   *
   * @param {Function} callback
   *
   * @return {AppHandler}
   */
  register(callback) {
    callback(this);
    return this;
  }

  /**
   * Returns the database Store
   *
   * @return {StoreInterface}
   */
  get database() {
    return SqliteStore.load(this.databaseResource);
  }

  /**
   * Returns the hash list of screens
   *
   * @return {Object}
   */
  get screens() {
    let screens = {};
    Object.keys(this.navigation).forEach(name => {
      screens[name] = this.navigation[name].screen;
    });

    return screens;
  }

  /**
   * Sets the database resource
   *
   * @param {StoreInterface} resource
   */
  set database(resource) {
    this.databaseResource = resource;
  }

  /**
   * Sets the database resource
   *
   * @param {StoreInterface} resource
   *
   * @return {AppHandler}
   */
  setDatabase(resource) {
    this.databaseResource = resource;
    return this;
  }

  /**
   * Starts the app processes
   *
   * @param {String} name
   */
  start(name) {
    let navigation = this.navigation;
    if (typeof this.navigation[name] !== 'undefined') {
      navigation = {};
      navigation[name] = this.navigation[name];
    }

    this.navigator = createStackNavigator(navigation);
    return createAppContainer(this.navigator);
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
    await this.emitter.trigger(event, ...args);
    return this;
  }
}

export default AppHandler.load();
