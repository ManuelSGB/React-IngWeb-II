const db = require('../config/config');
const Forum = {};

Forum.categories = ['HOGAR', 'ENERGIA SOLAR', 'EQUIPAMIENTO', 'RETOS'];

Forum.findAll = (result) => {
  const sql = `
    SELECT
      f.id,
      f.user_id,
      f.categoria AS category,
      f.titulo AS title,
      f.mensaje AS message,
      f.created_at,
      u.nombre AS author_name,
      u.apellido AS author_lastname
    FROM foro f
    INNER JOIN users u ON u.id = f.user_id
    ORDER BY f.created_at DESC, f.id DESC
  `;
  db.query(sql, (err, topics) => {
    if (err) {
      console.log('Error al listar temas: ', err);
      return result(err, null);
    }
    result(null, topics);
  });
};

Forum.findByUserId = (userId, result) => {
  const sql = `
    SELECT id, user_id, categoria AS category, titulo AS title, mensaje AS message, created_at
    FROM foro
    WHERE user_id = ?
    ORDER BY created_at DESC, id DESC
  `;
  db.query(sql, [userId], (err, topics) => {
    if (err) {
      console.log('Error al listar temas del usuario: ', err);
      return result(err, null);
    }
    result(null, topics);
  });
};

Forum.findOwned = (topicId, userId, result) => {
  const sql = 'SELECT id FROM foro WHERE id = ? AND user_id = ?';
  db.query(sql, [topicId, userId], (err, topics) => {
    if (err) {
      console.log('Error al verificar propiedad del tema: ', err);
      return result(err, null);
    }
    result(null, topics[0]);
  });
};

Forum.create = (topic, result) => {
  const sql = 'INSERT INTO foro (user_id, categoria, titulo, mensaje) VALUES (?, ?, ?, ?)';
  db.query(
    sql,
    [topic.userId, topic.category, topic.title, topic.message],
    (err, res) => {
      if (err) {
        console.log('Error al crear tema: ', err);
        return result(err, null);
      }
      result(null, { id: res.insertId, ...topic });
    }
  );
};

Forum.updateOwned = (topic, result) => {
  const sql = `
    UPDATE foro
    SET categoria = ?, titulo = ?, mensaje = ?
    WHERE id = ? AND user_id = ?
  `;
  db.query(
    sql,
    [topic.category, topic.title, topic.message, topic.id, topic.userId],
    (err, response) => {
      if (err) {
        console.log('Error al actualizar tema: ', err);
        return result(err, null);
      }
      result(null, response);
    }
  );
};

Forum.deleteOwned = (topicId, userId, result) => {
  db.query('DELETE FROM foro WHERE id = ? AND user_id = ?', [topicId, userId], (err, response) => {
    if (err) {
      console.log('Error al eliminar tema: ', err);
      return result(err, null);
    }
    result(null, response);
  });
};

module.exports = Forum;
