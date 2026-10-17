const db = require('../config/config');
const bcrypt = require('bcryptjs');
const User = {};

const userFields = `
  id,
  nombre AS name,
  apellido AS lastname,
  correo AS email,
  rol AS role,
  estado AS status,
  created_at
`;

User.findAll = (result) => {
  const sql = `SELECT ${userFields} FROM users`;
  db.query(sql, (err, users) => {
    if (err) {
      console.log('Error al listar usuarios: ', err);
      return result(err, null);
    }
    result(null, users);
  });
};

User.findById = (id, result) => {
  const sql = `SELECT ${userFields} FROM users WHERE id = ?`;
  db.query(sql, [id], (err, users) => {
    if (err) {
      console.log('Error al consultar usuario: ', err);
      return result(err, null);
    }
    result(null, users[0]);
  });
};

User.findByIdWithPassword = (id, result) => {
  const sql = `SELECT ${userFields}, contrasena AS password FROM users WHERE id = ?`;
  db.query(sql, [id], (err, users) => {
    if (err) {
      console.log('Error al consultar credenciales de usuario: ', err);
      return result(err, null);
    }
    result(null, users[0]);
  });
};

User.findByEmail = (email, result) => {
  const sql = `SELECT ${userFields}, contrasena AS password FROM users WHERE correo = ?`;
  db.query(sql, [email], (err, users) => {
    if (err) {
      console.log('Error al consultar usuario: ', err);
      return result(err, null);
    }
    result(null, users[0]);
  });
};

User.create = async (user, result) => {
  try {
    const hash = await bcrypt.hash(user.password, 10);
    const sql = `INSERT INTO users (nombre, apellido, correo, contrasena, rol, estado)
      VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(
      sql,
      [user.name, user.lastname, user.email, hash, user.role, user.status],
      (err, res) => {
        if (err) {
          console.log('Error al crear usuario: ', err);
          return result(err, null);
        }
        result(null, {
          id: res.insertId,
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
          status: user.status,
        });
      }
    );
  } catch (err) {
    result(err, null);
  }
};

User.update = async (user, result) => {
  try {
    const fields = [];
    const values = [];
    const mutableFields = [
      ['email', 'correo'],
      ['name', 'nombre'],
      ['lastname', 'apellido'],
      ['role', 'rol'],
      ['status', 'estado'],
    ];

    for (const [property, column] of mutableFields) {
      if (Object.hasOwn(user, property)) {
        fields.push(`${column} = ?`);
        values.push(user[property]);
      }
    }

    if (user.password) {
      fields.push('contrasena = ?');
      values.push(await bcrypt.hash(user.password, 10));
    }

    if (fields.length === 0) {
      return result(new Error('No hay campos para actualizar'), null);
    }

    values.push(user.id);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    db.query(sql, values, (err, res) => {
      if (err) {
        console.log('Error al actualizar usuario: ', err);
        return result(err, null);
      }
      result(null, { affectedRows: res.affectedRows, id: user.id });
    });
  } catch (err) {
    result(err, null);
  }
};

User.updatePassword = async (id, password, result) => {
  try {
    const hash = await bcrypt.hash(password, 10);
    db.query('UPDATE users SET contrasena = ? WHERE id = ?', [hash, id], (err, res) => {
      if (err) {
        console.log('Error al actualizar contraseña: ', err);
        return result(err, null);
      }
      result(null, res);
    });
  } catch (err) {
    result(err, null);
  }
};

User.updateStatus = (id, status, result) => {
  db.query('UPDATE users SET estado = ? WHERE id = ?', [status, id], (err, res) => {
    if (err) {
      console.log('Error al actualizar estado de usuario: ', err);
      return result(err, null);
    }
    result(null, res);
  });
};

User.delete = (id, result) => {
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [id], (err, res) => {
    if (err) {
      console.log('Error al eliminar usuario: ', err);
      return result(err, null);
    }
    result(null, res);
  });
};

module.exports = User;
