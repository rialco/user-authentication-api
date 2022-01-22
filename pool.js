/* eslint-disable no-underscore-dangle */
const pg = require('pg');

class Pool {
  _pool = null;

  connect(options) {
    this._pool = new pg.Pool(options);
    return this._pool.query('SELECT 1 + 1;');
  }

  close() {
    return this._pool.close();
  }

  query(SQL, params) {
    return this._pool.query(SQL, params);
  }
}

module.exports = new Pool();
