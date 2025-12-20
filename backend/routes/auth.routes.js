const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Маршрут для регистрации
router.post('/register', authController.register);

// Маршрут для входа
router.post('/login', authController.login);

// Маршрут для выхода
router.post('/logout', authController.logout);

module.exports = router;