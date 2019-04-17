import { SQLite as Resource } from 'expo';
import { SqlCollection, SqlException, Sqlite } from '@library/sql';
import DeviceModel from './DeviceModel';

// import {SqlSchema as schema} from './schema'

export default class DeviceCollection extends SqlCollection
{
  /**
   * Sets up the parent collection
   */
  constructor() {
    //add the profile collection name
    // super('profile', schema, Sqlite.load(Resource))
    super();
  }

  /**
   * Static loader
   *
   * @return Schema
   */
  static load() {
    //singleton pattern
    if (typeof DeviceCollection.instance === 'undefined') {
      DeviceCollection.instance = new DeviceCollection();
    }

    return DeviceCollection.instance;
  }

  /**
   * Returns profile model
   *
   * @param hash
   *
   * @return DeviceModel
   */
  model(data) {
    return DeviceModel.load(data, this);
  }
}
