const { Schedule, Course, User } = require('../models');

const scheduleController = {
    // Получить расписание
    async getAll(req, res) {
        try {
            const { dayOfWeek, groupName, courseId } = req.query;
            const where = {};

            if (dayOfWeek !== undefined) {
                where.day_of_week = dayOfWeek;
            }

            if (groupName) {
                where.group_name = groupName;
            }

            if (courseId) {
                where.course_id = courseId;
            }

            // Если студент, показываем только его группу
            if (req.user.role === 'student' && req.user.group_name) {
                where.group_name = req.user.group_name;
            }

            // Если преподаватель, показываем только его занятия
            if (req.user.role === 'teacher') {
                where.teacher_id = req.user.id;
            }

            const schedules = await Schedule.findAll({
                where,
                include: [
                    { model: Course, as: 'course', attributes: ['id', 'name', 'code', 'credits'] },
                    { model: User, as: 'teacher', attributes: ['id', 'full_name', 'email'] }
                ],
                order: [['day_of_week', 'ASC'], ['start_time', 'ASC']]
            });

            res.json(schedules);
        } catch (error) {
            console.error('Ошибка получения расписания:', error);
            res.status(500).json({ error: 'Ошибка при получении расписания' });
        }
    },

    // Получить расписание по ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const schedule = await Schedule.findByPk(id, {
                include: [
                    { model: Course, as: 'course' },
                    { model: User, as: 'teacher', attributes: ['id', 'full_name', 'email'] }
                ]
            });

            if (!schedule) {
                return res.status(404).json({ error: 'Расписание не найдено' });
            }

            res.json(schedule);
        } catch (error) {
            console.error('Ошибка получения расписания:', error);
            res.status(500).json({ error: 'Ошибка при получении расписания' });
        }
    },

    // Создать запись в расписании (для преподавателей/админов)
    async create(req, res) {
        try {
            if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Доступ запрещен' });
            }

            const { course_id, day_of_week, start_time, end_time, classroom, group_name } = req.body;

            const schedule = await Schedule.create({
                course_id,
                teacher_id: req.user.role === 'teacher' ? req.user.id : req.body.teacher_id,
                day_of_week,
                start_time,
                end_time,
                classroom,
                group_name
            });

            const createdSchedule = await Schedule.findByPk(schedule.id, {
                include: [
                    { model: Course, as: 'course' },
                    { model: User, as: 'teacher', attributes: ['id', 'full_name', 'email'] }
                ]
            });

            res.status(201).json(createdSchedule);
        } catch (error) {
            console.error('Ошибка создания расписания:', error);
            res.status(500).json({ error: 'Ошибка при создании расписания' });
        }
    },

    // Обновить расписание
    async update(req, res) {
        try {
            if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Доступ запрещен' });
            }

            const { id } = req.params;
            const schedule = await Schedule.findByPk(id);

            if (!schedule) {
                return res.status(404).json({ error: 'Расписание не найдено' });
            }

            // Преподаватель может обновлять только свои занятия
            if (req.user.role === 'teacher' && schedule.teacher_id !== req.user.id) {
                return res.status(403).json({ error: 'Доступ запрещен' });
            }

            await schedule.update(req.body);

            const updatedSchedule = await Schedule.findByPk(id, {
                include: [
                    { model: Course, as: 'course' },
                    { model: User, as: 'teacher', attributes: ['id', 'full_name', 'email'] }
                ]
            });

            res.json(updatedSchedule);
        } catch (error) {
            console.error('Ошибка обновления расписания:', error);
            res.status(500).json({ error: 'Ошибка при обновлении расписания' });
        }
    },

    // Удалить запись из расписания
    async delete(req, res) {
        try {
            if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Доступ запрещен' });
            }

            const { id } = req.params;
            const schedule = await Schedule.findByPk(id);

            if (!schedule) {
                return res.status(404).json({ error: 'Расписание не найдено' });
            }

            // Преподаватель может удалять только свои занятия
            if (req.user.role === 'teacher' && schedule.teacher_id !== req.user.id) {
                return res.status(403).json({ error: 'Доступ запрещен' });
            }

            await schedule.destroy();
            res.json({ message: 'Расписание успешно удалено' });
        } catch (error) {
            console.error('Ошибка удаления расписания:', error);
            res.status(500).json({ error: 'Ошибка при удалении расписания' });
        }
    }
};

module.exports = scheduleController;

