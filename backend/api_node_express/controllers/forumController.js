const Forum = require('../models/forum');

module.exports = {
  getAllTopics(req, res) {
    Forum.findAll((err, topics) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error al listar los temas del foro',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Lista de temas',
        data: topics,
      });
    });
  },

  getMyTopics(req, res) {
    Forum.findByUserId(req.user.id, (err, topics) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error al consultar tus publicaciones',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Tus publicaciones',
        data: topics,
      });
    });
  },

  createTopic(req, res) {
    const { categoria, category, titulo, title, mensaje, message } = req.body;
    const topic = {
      userId: req.user.id,
      category: categoria ?? category,
      title: titulo ?? title,
      message: mensaje ?? message,
    };

    if (
      !Forum.categories.includes(topic.category) ||
      typeof topic.title !== 'string' ||
      topic.title.trim().length === 0 ||
      topic.title.length > 150 ||
      typeof topic.message !== 'string' ||
      topic.message.trim().length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Categoría, título o mensaje no válidos',
      });
    }

    Forum.create(topic, (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error al crear el tema',
        });
      }
      return res.status(201).json({
        success: true,
        message: 'Tema creado correctamente',
        data,
      });
    });
  },

  updateMyTopic(req, res) {
    const { categoria, category, titulo, title, mensaje, message } = req.body;
    const topic = {
      id: req.params.id,
      userId: req.user.id,
      category: categoria ?? category,
      title: titulo ?? title,
      message: mensaje ?? message,
    };

    if (
      !Forum.categories.includes(topic.category) ||
      typeof topic.title !== 'string' ||
      topic.title.trim().length === 0 ||
      topic.title.length > 150 ||
      typeof topic.message !== 'string' ||
      topic.message.trim().length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Categoría, título o mensaje no válidos',
      });
    }

    Forum.updateOwned(topic, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error al actualizar la publicación',
        });
      }
      if (result.affectedRows) {
        return res.status(200).json({
          success: true,
          message: 'Publicación actualizada',
          data: topic,
        });
      }

      Forum.findOwned(topic.id, topic.userId, (findError, existingTopic) => {
        if (findError) {
          return res.status(500).json({
            success: false,
            message: 'Error al verificar la publicación',
          });
        }
        if (!existingTopic) {
          return res.status(404).json({
            success: false,
            message: 'Publicación no encontrada',
          });
        }
        return res.status(200).json({
          success: true,
          message: 'La publicación no tenía cambios',
          data: topic,
        });
      });
    });
  },

  deleteMyTopic(req, res) {
    Forum.deleteOwned(req.params.id, req.user.id, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error al eliminar la publicación',
        });
      }
      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          message: 'Publicación no encontrada',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Publicación eliminada',
      });
    });
  },
};
