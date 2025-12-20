const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { authMiddleware } = require('../middleware/auth');

// Все маршруты требуют аутентификации
router.use(authMiddleware);

// Получить профиль текущего пользователя
router.get('/me', profileController.getProfile);

// Обновить профиль
router.put('/me', profileController.updateProfile);

module.exports = router;