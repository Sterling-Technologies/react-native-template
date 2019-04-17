import Exception from '@library/core/Exception';

export default class SqlException extends Exception {
  static forQueryError(query, message) {
    return SqlException.for('%s - %s', message, query);
  }
}
