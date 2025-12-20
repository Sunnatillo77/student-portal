const express = require('express');
const router = express.Router();
const materialsController = require('../controllers/materials.controller');
const { authMiddleware } = require('../middleware/auth');

// Все маршруты требуют аутентификации
router.use(authMiddleware);

// Получить все материалы
router.get('/', materialsController.getAll);

// Получить материал по ID
router.get('/:id', materialsController.getById);

// Создать материал (только для преподавателей) с загрузкой файла
router.post('/', materialsController.uploadMiddleware, materialsController.create);

// Обновить материал
router.put('/:id', materialsController.uploadMiddleware, materialsController.update);

// Удалить материал
router.delete('/:id', materialsController.delete);

module.exports = router;


