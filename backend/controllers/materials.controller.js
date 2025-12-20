const { Material, Course, User } = require('../models');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        try {
            await fs.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        } catch (error) {
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    },
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});

const materialsController = {
    // Получить все материалы
    async getAll(req, res) {
        try {
            const { courseId } = req.query;
            const where = courseId ? { course_id: courseId } : {};

            const materials = await Material.findAll({
                where,
                include: [
                    { model: Course, as: 'course', attributes: ['id', 'name', 'code'] },
                    { model: User, as: 'teacher', attributes: ['id', 'full_name', 'email'] }
                ],
                order: [['createdAt', 'DESC']]
            });

            res.json(materials);
        } catch (error) {
            console.error('Ошибка получения материалов:', error);
            res.status(500).json({ error: 'Ошибка при получении материалов' });
        }
    },

    // Получить материал по ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const material = await Material.findByPk(id, {
                include: [
                    { model: Course, as: 'course' },
                    { model: User, as: 'teacher', attributes: ['id', 'full_name', 'email'] }
                ]
            });

            if (!material) {
                return res.status(404).json({ error: 'Материал не найден' });
            }

            res.json(material);
        } catch (error) {
            console.error('Ошибка получения материала:', error);
            res.status(500).json({ error: 'Ошибка при получении материала' });
        }
    },

    // Создать материал (только для преподавателей)
    async create(req, res) {
        try {
            if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Доступ запрещен' });
            }

            const { title, description, course_id, type, file_url } = req.body;

            let fileData = {};
            if (req.file) {
                fileData = {
                    file_url: `/uploads/${req.file.filename}`,
                    file_name: req.file.originalname,
                    file_size: req.file.size
                };
            } else if (file_url) {
                fileData = { file_url };
            }

            const material = await Material.create({
                title,
                description,
                course_id,
                teacher_id: req.user.id,
                type: type || 'document',
                ...fileData
            });

            const createdMaterial = await Material.findByPk(material.id, {
                include: [
                    { model: Course, as: 'course' },
                    { model: User, as: 'teacher', attributes: ['id', 'full_name', 'email'] }
                ]
            });

            res.status(201).json(createdMaterial);
        } catch (error) {
            console.error('Ошибка создания материала:', error);
            res.status(500).json({ error: 'Ошибка при создании материала' });
        }
    },

    // Обновить материал
    async update(req, res) {
        try {
            if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Доступ запрещен' });
            }

            const { id } = req.params;
            const material = await Material.findByPk(id);

            if (!material) {
                return res.status(404).json({ error: 'Материал не найден' });
            }

            // Преподаватель может обновлять только свои материалы
            if (req.user.role === 'teacher' && material.teacher_id !== req.user.id) {
                return res.status(403).json({ error: 'Доступ запрещен' });
            }

            let fileData = {};
            if (req.file) {
                // Удаляем старый файл если есть
                if (material.file_url && material.file_url.startsWith('/uploads/')) {
                    const oldFilePath = path.join(__dirname, '..', material.file_url);
                    try {
                        await fs.unlink(oldFilePath);
                    } catch (error) {
                        console.error('Ошибка удаления старого файла:', error);
                    }
                }

                fileData = {
                    file_url: `/uploads/${req.file.filename}`,
                    file_name: req.file.originalname,
                    file_size: req.file.size
                };
            }

            await material.update({ ...req.body, ...fileData });

            const updatedMaterial = await Material.findByPk(id, {
                include: [
                    { model: Course, as: 'course' },
                    { model: User, as: 'teacher', attributes: ['id', 'full_name', 'email'] }
                ]
            });

            res.json(updatedMaterial);
        } catch (error) {
            console.error('Ошибка обновления материала:', error);
            res.status(500).json({ error: 'Ошибка при обновлении материала' });
        }
    },

    // Удалить материал
    async delete(req, res) {
        try {
            if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Доступ запрещен' });
            }

            const { id } = req.params;
            const material = await Material.findByPk(id);

            if (!material) {
                return res.status(404).json({ error: 'Материал не найден' });
            }

            // Преподаватель может удалять только свои материалы
            if (req.user.role === 'teacher' && material.teacher_id !== req.user.id) {
                return res.status(403).json({ error: 'Доступ запрещен' });
            }

            // Удаляем файл если есть
            if (material.file_url && material.file_url.startsWith('/uploads/')) {
                const filePath = path.join(__dirname, '..', material.file_url);
                try {
                    await fs.unlink(filePath);
                } catch (error) {
                    console.error('Ошибка удаления файла:', error);
                }
            }

            await material.destroy();
            res.json({ message: 'Материал успешно удален' });
        } catch (error) {
            console.error('Ошибка удаления материала:', error);
            res.status(500).json({ error: 'Ошибка при удалении материала' });
        }
    },

    // Middleware для загрузки файлов
    uploadMiddleware: upload.single('file')
};

module.exports = materialsController;


