const pgFormat = require('pg-format');

const pool = require('../../pool');

class UserRepo {
  /*
  Retrieve all users from database
  */
  static async findAll() {
    const { rows } = await pool.query('SELECT * FROM users;');

    return rows;
  }

  /*
  Retrieve an specific user given its ID
  */
  static async findByID(id) {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    return rows[0];
  }

  /*
  Retrieve an specific user given its email
  */
  static async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    return rows[0];
  }

  /*
  Insert a new user in the database
  */
  static async insert(name, email, password) {
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;',
      [name, email, password],
    );

    return rows[0];
  }

  /*
  Modify a user column given its ID, column to modify and value to update.
  */
  static async update(id, value, columnName) {
    // Use pg-format library to enable dynamic queries
    const sql = pgFormat('UPDATE users SET %I = $1 WHERE id = $2 RETURNING *;', columnName);
    const { rows } = await pool.query(sql, [value, id]);

    return rows[0];
  }

  /*
  Delete a user from the database
  */
  static async delete(id) {
    const { rows } = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *;', [id]);

    return rows[0];
  }
}

module.exports = UserRepo;
