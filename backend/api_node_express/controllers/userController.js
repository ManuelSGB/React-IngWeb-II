const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const validRoles = ['admin', 'user'];
const validStatuses = ['activo', 'inactivo'];

function normalizeUser(body) {
  const user = {};
  const aliases = [
    ['nombre', 'name'],
    ['apellido', 'lastname'],
    ['correo', 'email'],
    ['contrasena', 'password'],
    ['rol', 'role'],
    ['estado', 'status'],
  ];
  for (const [databaseField, apiField] of aliases) {
    if (Object.hasOwn(body, databaseField)) {
      user[apiField] = body[databaseField];
    } else if (Object.hasOwn(body, apiField)) {
      user[apiField] = body[apiField];
    }
  }
  return user;
}

function isValidUser(user, { requirePassword = true } = {}) {
  return (
    typeof user.name === 'string' &&
    user.name.trim().length > 0 &&
    typeof user.lastname === 'string' &&
    user.lastname.trim().length > 0 &&
    typeof user.email === 'string' &&
    user.email.trim().length > 0 &&
    (!requirePassword || (typeof user.password === 'string' && user.password.length > 0)) &&
    validRoles.includes(user.role) &&
    validStatuses.includes(user.status)
  );
}

module.exports = {
  login(req, res) {
    const email = req.body.correo ?? req.body.email;
    const password = req.body.contrasena ?? req.body.password;

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Correo y contraseña son obligatorios',
      });
    }

    User.findByEmail(email, async (err, myUser) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error al consultar el usuario',
        });
      }

      if (!myUser || myUser.status !== 'activo') {
        return res.status(401).json({
          success: false,
          message: 'Correo o contraseña incorrectos, o cuenta inactiva',
        });
      }

      try {
        const isPasswordValid = await bcrypt.compare(password, myUser.password);
        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            message: 'Correo o contraseña incorrectos',
          });
        }

        const token = jwt.sign(
          { id: myUser.id, email: myUser.email, role: myUser.role },
          keys.secretOrKey,
          { expiresIn: '1h' }
        );

        const { password: _password, ...userData } = myUser;
        return res.status(201).json({
          success: true,
          message: 'Usuario autenticado',
          data: { ...userData, session_token: `JWT ${token}` },
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: 'No se pudo autenticar al usuario',
        });
      }
    });
  },

  getAllUsers(req, res) {
    User.findAll((err, users) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error al listar usuarios',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Lista de usuarios',
        data: users,
      });
    });
  },

  getUserById(req, res) {
    User.findById(req.params.id, (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error al consultar el usuario',
        });
      }
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Usuario encontrado',
        data: user,
      });
    });
  },

  getProfile(req, res) {
    User.findById(req.user.id, (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error al consultar el perfil',
        });
      }
      if (!user || user.status !== 'activo') {
        return res.status(404).json({
          success: false,
          message: 'Cuenta no encontrada o inactiva',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Perfil del usuario',
        data: user,
      });
    });
  },

  changePassword(req, res) {
    const { currentPassword, newPassword } = req.body;
    if (
      typeof currentPassword !== 'string' ||
      typeof newPassword !== 'string' ||
      newPassword.length < 6 ||
      newPassword.length > 255
    ) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña actual es obligatoria y la nueva debe tener entre 6 y 255 caracteres',
      });
    }

    User.findByIdWithPassword(req.user.id, async (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error al validar la contraseña actual',
        });
      }
      if (!user || user.status !== 'activo') {
        return res.status(404).json({
          success: false,
          message: 'Cuenta no encontrada o inactiva',
        });
      }

      try {
        if (!(await bcrypt.compare(currentPassword, user.password))) {
          return res.status(400).json({
            success: false,
            message: 'La contraseña actual es incorrecta',
          });
        }
        User.updatePassword(req.user.id, newPassword, (updateError, result) => {
          if (updateError) {
            return res.status(500).json({
              success: false,
              message: 'No se pudo actualizar la contraseña',
            });
          }
          if (!result.affectedRows) {
            return res.status(404).json({
              success: false,
              message: 'Cuenta no encontrada',
            });
          }
          return res.status(200).json({
            success: true,
            message: 'Contraseña actualizada correctamente',
          });
        });
      } catch (compareError) {
        return res.status(500).json({
          success: false,
          message: 'No se pudo validar la contraseña actual',
        });
      }
    });
  },

  register(req, res) {
    const user = normalizeUser(req.body);
    user.role = 'user';
    user.status = 'activo';
    if (!isValidUser(user)) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, apellido, correo, contraseña, rol o estado no válidos',
      });
    }

    User.create(user, (err, data) => {
      if (err) {
        const duplicateEmail = err.code === 'ER_DUP_ENTRY';
        return res.status(duplicateEmail ? 409 : 500).json({
          success: false,
          message: duplicateEmail ? 'El correo ya está registrado' : 'Error al crear al usuario',
        });
      }
      return res.status(201).json({
        success: true,
        message: 'Usuario creado correctamente',
        data,
      });
    });
  },

  createAdmin(req, res) {
    const user = normalizeUser(req.body);
    user.role ??= 'user';
    user.status ??= 'activo';
    if (!isValidUser(user)) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, apellido, correo, contraseña, rol o estado no válidos',
      });
    }

    User.create(user, (err, data) => {
      if (err) {
        const duplicateEmail = err.code === 'ER_DUP_ENTRY';
        return res.status(duplicateEmail ? 409 : 500).json({
          success: false,
          message: duplicateEmail ? 'El correo ya está registrado' : 'Error al crear al usuario',
        });
      }
      return res.status(201).json({
        success: true,
        message: 'Usuario creado correctamente',
        data,
      });
    });
  },

  getUserUpdate(req, res) {
    const user = { ...normalizeUser(req.body), id: req.params.id };
    const validPartialUser = Object.entries(user).every(([field, value]) => {
      if (field === 'id') return true;
      if (field === 'role') return validRoles.includes(value);
      if (field === 'status') return validStatuses.includes(value);
      if (field === 'password') return typeof value === 'string' && value.length > 0;
      return typeof value === 'string' && value.trim().length > 0;
    });
    if (Object.keys(user).length === 1 || !validPartialUser) {
      return res.status(400).json({
        success: false,
        message: 'Los campos enviados no son válidos',
      });
    }

    User.update(user, (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error al actualizar el usuario',
        });
      }
      if (data.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Usuario actualizado',
        data,
      });
    });
  },

  updateUserStatus(req, res) {
    const { estado, status } = req.body;
    const nextStatus = estado ?? status;
    if (!validStatuses.includes(nextStatus)) {
      return res.status(400).json({
        success: false,
        message: 'El estado debe ser activo o inactivo',
      });
    }

    User.findById(req.params.id, (findError, user) => {
      if (findError) {
        return res.status(500).json({
          success: false,
          message: 'Error al consultar el usuario',
        });
      }
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
      }

      User.updateStatus(req.params.id, nextStatus, (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Error al actualizar el estado del usuario',
          });
        }
        return res.status(200).json({
          success: true,
          message: 'Estado actualizado',
          data: { id: req.params.id, status: nextStatus },
        });
      });
    });
  },

  getUserDelete(req, res) {
    User.delete(req.params.id, (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error al eliminar el usuario',
        });
      }
      if (data.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Usuario eliminado',
        data,
      });
    });
  },
};
