import { SQLite as Resource } from 'expo';
import { SqlCollection, SqlException, Sqlite } from '@library/sql';
import ProfileModel from './ProfileModel';

// import {SqlSchema as schema} from './schema'

export default class ProfileCollection extends SqlCollection
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
    if (typeof ProfileCollection.instance === 'undefined') {
      ProfileCollection.instance = new ProfileCollection();
    }

    return ProfileCollection.instance;
  }

  /**
   * Returns profile model
   *
   * @param hash
   *
   * @return ProfileModel
   */
  model(data) {
    return ProfileModel.load(data, this);
  }
}
