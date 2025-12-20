const express = require('express');
const router = express.Router();
const assignmentsController = require('../controllers/assignments.controller');
const { authMiddleware } = require('../middleware/auth');

// Все маршруты требуют аутентификации
router.use(authMiddleware);

// Получить все задания
router.get('/', assignmentsController.getAll);

// Получить мои задания
router.get('/my', assignmentsController.getMyAssignments);

// Получить задание по ID
router.get('/:id', assignmentsController.getById);

// Создать задание (только для преподавателей)
router.post('/', assignmentsController.create);

// Отправить решение задания
router.post('/:id/submit', assignmentsController.submit);

// Оценить решение (для преподавателей)
router.post('/submissions/:submissionId/grade', assignmentsController.grade);

module.exports = router;


