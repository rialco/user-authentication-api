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

  static async insert(name, email, password) {
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;',
      [name, email, password],
    );

    return rows[0];
  }

  static async update(id, payload) {
    const { role, password, email } = payload;
    const updatedValues = {};
    if (password) {
      updatedValues.password = await pool.query(
        'UPDATE users SET password $1 WHERE id = $2 RETURNING id;',
        [password, id],
      );
    }
    if (role) {
      updatedValues.role = await pool.query(
        'UPDATE users SET role $1 WHERE id = $2 RETURNING role;',
        [role, id],
      );
    }
    if (email) {
      updatedValues.email = await pool.query(
        'UPDATE users SET email $1 WHERE id = $2 RETURNING *;',
        [email, id],
      );
    }

    return updatedValues;
  }

  static async delete(id) {
    const { rows } = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *;', [id]);

    return rows[0];
  }
}

module.exports = UserRepo;
