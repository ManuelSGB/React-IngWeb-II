const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Rutas públicas
router.post('/create', userController.register);
router.post('/login', userController.login);

// Rutas protegidas
router.post('/admin', verifyToken, authorizeRoles(['admin']), userController.createAdmin);
router.get('/me', verifyToken, userController.getProfile);
router.patch('/me/password', verifyToken, userController.changePassword);
router.get('/', verifyToken, authorizeRoles(['admin']), userController.getAllUsers);
router.get('/:id', verifyToken, authorizeRoles(['admin']), userController.getUserById);
router.patch('/:id/status', verifyToken, authorizeRoles(['admin']), userController.updateUserStatus);
router.put('/:id', verifyToken, authorizeRoles(['admin']), userController.getUserUpdate);
router.delete('/delete/:id', verifyToken, authorizeRoles(['admin']), userController.getUserDelete);

module.exports = router;