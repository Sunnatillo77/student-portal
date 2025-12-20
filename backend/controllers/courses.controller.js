const { Course, User } = require('../models');

const coursesController = {
    // Получить все курсы
    async getAll(req, res) {
        try {
            const courses = await Course.findAll({
                include: [
                    {
                        model: User,
                        as: 'students',
                        attributes: ['id', 'full_name', 'email'],
                        through: { attributes: [] }
                    }
                ]
            });
            res.json(courses);
        } catch (error) {
            console.error('Ошибка получения курсов:', error);
            res.status(500).json({ error: 'Ошибка при получении курсов' });
        }
    },

    // Получить курс по ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const course = await Course.findByPk(id, {
                include: [
                    {
                        model: User,
                        as: 'students',
                        attributes: ['id', 'full_name', 'email'],
                        through: { attributes: [] }
                    }
                ]
            });

            if (!course) {
                return res.status(404).json({ error: 'Курс не найден' });
            }

            res.json(course);
        } catch (error) {
            console.error('Ошибка получения курса:', error);
            res.status(500).json({ error: 'Ошибка при получении курса' });
        }
    },

    // Создать курс (только для преподавателей/админов)
    async create(req, res) {
        try {
            if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Доступ запрещен' });
            }

            const { name, description, code, credits } = req.body;
            const course = await Course.create({
                name,
                description,
                code,
                credits: credits || 3
            });

            res.status(201).json(course);
        } catch (error) {
            console.error('Ошибка создания курса:', error);
            res.status(500).json({ error: 'Ошибка при создании курса' });
        }
    },

    // Записаться на курс (для студентов)
    async enroll(req, res) {
        try {
            if (req.user.role !== 'student') {
                return res.status(403).json({ error: 'Только студенты могут записываться на курсы' });
            }

            const { courseId } = req.params;
            const course = await Course.findByPk(courseId);

            if (!course) {
                return res.status(404).json({ error: 'Курс не найден' });
            }

            // Проверяем, не записан ли уже студент на курс
            const student = await User.findByPk(req.user.id);
            const isEnrolled = await course.hasStudent(student);

            if (isEnrolled) {
                return res.status(400).json({ error: 'Вы уже записаны на этот курс' });
            }

            await course.addStudent(student);
            res.json({ message: 'Вы успешно записались на курс' });
        } catch (error) {
            console.error('Ошибка записи на курс:', error);
            res.status(500).json({ error: 'Ошибка при записи на курс' });
        }
    },

    // Получить курсы текущего пользователя
    async getMyCourses(req, res) {
        try {
            const user = await User.findByPk(req.user.id, {
                include: [
                    {
                        model: Course,
                        as: 'courses',
                        through: { attributes: [] }
                    }
                ]
            });

            res.json(user.courses || []);
        } catch (error) {
            console.error('Ошибка получения курсов пользователя:', error);
            res.status(500).json({ error: 'Ошибка при получении курсов' });
        }
    }
};

module.exports = coursesController;

