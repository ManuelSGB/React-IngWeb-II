    const jwt = require("jsonwebtoken");
    const keys = require("../config/keys");
    const User = require("../models/user");
    
    function verifyToken(req, res, next) {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        return res.status(403).json({
          success: false,
          message: "No se proporcionó un token",
        });
      }
    
      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(403).json({
          success: false,
          message: "Formato de token inválido",
        });
      }
    
      jwt.verify(token, keys.secretOrKey, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            success: false,
            message: "Token inválido o expirado",
            error: err,
          });
        }
        User.findById(decoded.id, (userError, user) => {
          if (userError) {
            return res.status(500).json({
              success: false,
              message: 'No se pudo validar la cuenta',
            });
          }
          if (!user || user.status !== 'activo') {
            return res.status(401).json({
              success: false,
              message: 'La cuenta no existe o está inactiva',
            });
          }
          req.user = { id: user.id, email: user.email, role: user.role };
          next();
        });
      });
    }
    
    function authorizeRoles(roles) {
      return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
          return res.status(403).json({
            success: false,
            message: `Acceso denegado: se requiere rol ${roles.join(" o ")}`,
          });
        }
        next();
      };
    }
    
    module.exports = {
      verifyToken,
      authorizeRoles,
    };