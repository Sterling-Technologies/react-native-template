import { SqlModel, SqlException } from '@library/sql';

export default class DeviceModel extends SqlModel
{
  /**
   * Model Loader
   *
   * @param *hash
   *
   * @return SqlModel
   */
  static load(data) {
    return new DeviceModel(data);
  }
}
