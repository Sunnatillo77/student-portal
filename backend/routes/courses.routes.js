const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/courses.controller');
const { authMiddleware } = require('../middleware/auth');

// Все маршруты требуют аутентификации
router.use(authMiddleware);

// Получить все курсы
router.get('/', coursesController.getAll);

// Получить курсы текущего пользователя
router.get('/my', coursesController.getMyCourses);

// Получить курс по ID
router.get('/:id', coursesController.getById);

// Создать курс (только для преподавателей/админов)
router.post('/', coursesController.create);

// Записаться на курс (для студентов)
router.post('/:courseId/enroll', coursesController.enroll);

module.exports = router;


