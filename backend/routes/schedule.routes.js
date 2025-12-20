const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule.controller');
const { authMiddleware } = require('../middleware/auth');

// Все маршруты требуют аутентификации
router.use(authMiddleware);

// Получить все расписания
router.get('/', scheduleController.getAll);

// Получить расписание по ID
router.get('/:id', scheduleController.getById);

// Создать запись в расписании (только для преподавателей/админов)
router.post('/', scheduleController.create);

// Обновить расписание
router.put('/:id', scheduleController.update);

// Удалить расписание
router.delete('/:id', scheduleController.delete);

module.exports = router;


