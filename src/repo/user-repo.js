const pgFormat = require('pg-format');

const pool = require('../../pool');

class UserRepo {
  static async findAll() {
    const { rows } = await pool.query('SELECT * FROM users;');

    return rows;
  }

  static async findByID(id) {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    return rows[0];
  }

  static async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    return rows[0];
  }

  static async insert(name, email, password) {
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;',
      [name, email, password],
    );

    return rows[0];
  }

  static async update(id, value, columnName) {
    const sql = pgFormat('UPDATE users SET %I = $1 WHERE id = $2 RETURNING *;', columnName);
    const { rows } = await pool.query(sql, [value, id]);

    return rows[0];
  }

  static async delete(id) {
    const { rows } = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *;', [id]);

    return rows[0];
  }
}

module.exports = UserRepo;
