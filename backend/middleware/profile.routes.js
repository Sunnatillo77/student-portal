// backend/routes/profile.routes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth'); // Импортируем middleware

// Этот маршрут защищен: запрос должен содержать валидный токен
router.get('/me', authMiddleware, (req, res) => {
    // Пользователь доступен через req.user (добавлено в authMiddleware)
    res.json({
        message: 'Данные вашего профиля',
        user: req.user // Возвращаем данные пользователя без пароля
    });
});

module.exports = router;