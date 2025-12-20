const express = require('express');
const router = express.Router();
const gradesController = require('../controllers/grades.controller');
const { authMiddleware } = require('../middleware/auth');

// Все маршруты требуют аутентификации
router.use(authMiddleware);

// Получить все оценки
router.get('/', gradesController.getAll);

// Получить успеваемость текущего пользователя
router.get('/performance', gradesController.getStudentPerformance);

// Получить оценку по ID
router.get('/:id', gradesController.getById);

module.exports = router;
