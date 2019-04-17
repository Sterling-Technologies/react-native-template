import { SqlModel, SqlException } from '@library/sql';

export default class ProfileModel extends SqlModel
{
  /**
   * Model Loader
   *
   * @param *hash
   *
   * @return SqlModel
   */
  static load(data) {
    return new ProfileModel(data);
  }
}
