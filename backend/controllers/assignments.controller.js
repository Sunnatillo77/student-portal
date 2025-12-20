const { Assignment, AssignmentSubmission, Course, User, Grade } = require('../models');

const assignmentsController = {
    // Получить все задания
    async getAll(req, res) {
        try {
            const { courseId } = req.query;
            const where = courseId ? { course_id: courseId } : {};

            const assignments = await Assignment.findAll({
                where,
                include: [
                    { model: Course, as: 'course', attributes: ['id', 'name', 'code'] },
                    { model: User, as: 'teacher', attributes: ['id', 'full_name', 'email'] }
                ],
                order: [['due_date', 'ASC']]
            });

            res.json(assignments);
        } catch (error) {
            console.error('Ошибка получения заданий:', error);
            res.status(500).json({ error: 'Ошибка при получении заданий' });
        }
    },

    // Получить задание по ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const assignment = await Assignment.findByPk(id, {
                include: [
                    { model: Course, as: 'course' },
                    { model: User, as: 'teacher', attributes: ['id', 'full_name', 'email'] },
                    {
                        model: AssignmentSubmission,
                        as: 'submissions',
                        include: [
                            { model: User, as: 'student', attributes: ['id', 'full_name', 'email'] },
                            { model: Grade, as: 'grade' }
                        ]
                    }
                ]
            });

            if (!assignment) {
                return res.status(404).json({ error: 'Задание не найдено' });
            }

            res.json(assignment);
        } catch (error) {
            console.error('Ошибка получения задания:', error);
            res.status(500).json({ error: 'Ошибка при получении задания' });
        }
    },

    // Создать задание (только для преподавателей)
    async create(req, res) {
        try {
            if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Доступ запрещен' });
            }

            const { title, description, course_id, due_date, max_score, attachments } = req.body;

            const assignment = await Assignment.create({
                title,
                description,
                course_id,
                teacher_id: req.user.id,
                due_date,
                max_score: max_score || 100,
                attachments: attachments || []
            });

            const createdAssignment = await Assignment.findByPk(assignment.id, {
                include: [
                    { model: Course, as: 'course' },
                    { model: User, as: 'teacher', attributes: ['id', 'full_name', 'email'] }
                ]
            });

            res.status(201).json(createdAssignment);
        } catch (error) {
            console.error('Ошибка создания задания:', error);
            res.status(500).json({ error: 'Ошибка при создании задания' });
        }
    },

    // Отправить решение задания (для студентов)
    async submit(req, res) {
        try {
            if (req.user.role !== 'student') {
                return res.status(403).json({ error: 'Только студенты могут отправлять решения' });
            }

            const { id } = req.params;
            const { content, attachments } = req.body;

            const assignment = await Assignment.findByPk(id);
            if (!assignment) {
                return res.status(404).json({ error: 'Задание не найдено' });
            }

            // Проверяем, не отправлено ли уже решение
            const existingSubmission = await AssignmentSubmission.findOne({
                where: {
                    assignment_id: id,
                    student_id: req.user.id
                }
            });

            if (existingSubmission) {
                return res.status(400).json({ error: 'Решение уже отправлено' });
            }

            const submission = await AssignmentSubmission.create({
                assignment_id: id,
                student_id: req.user.id,
                content,
                attachments: attachments || []
            });

            const createdSubmission = await AssignmentSubmission.findByPk(submission.id, {
                include: [
                    { model: Assignment, as: 'assignment' },
                    { model: User, as: 'student', attributes: ['id', 'full_name', 'email'] }
                ]
            });

            res.status(201).json(createdSubmission);
        } catch (error) {
            console.error('Ошибка отправки решения:', error);
            res.status(500).json({ error: 'Ошибка при отправке решения' });
        }
    },

    // Оценить решение (для преподавателей)
    async grade(req, res) {
        try {
            if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Доступ запрещен' });
            }

            const { submissionId } = req.params;
            const { score, max_score, feedback } = req.body;

            const submission = await AssignmentSubmission.findByPk(submissionId, {
                include: [{ model: Assignment, as: 'assignment' }]
            });

            if (!submission) {
                return res.status(404).json({ error: 'Решение не найдено' });
            }

            // Создаем или обновляем оценку
            const [grade, created] = await Grade.findOrCreate({
                where: {
                    submission_id: submissionId
                },
                defaults: {
                    student_id: submission.student_id,
                    course_id: submission.assignment.course_id,
                    submission_id: submissionId,
                    score,
                    max_score: max_score || submission.assignment.max_score,
                    feedback
                }
            });

            if (!created) {
                grade.score = score;
                grade.max_score = max_score || grade.max_score;
                grade.feedback = feedback;
                await grade.save();
            }

            // Обновляем статус решения
            submission.status = 'graded';
            await submission.save();

            const updatedGrade = await Grade.findByPk(grade.id, {
                include: [
                    { model: User, as: 'student', attributes: ['id', 'full_name', 'email'] },
                    { model: AssignmentSubmission, as: 'submission' }
                ]
            });

            res.json(updatedGrade);
        } catch (error) {
            console.error('Ошибка оценки решения:', error);
            res.status(500).json({ error: 'Ошибка при оценке решения' });
        }
    },

    // Получить мои задания (для студентов) или задания, которые я создал (для преподавателей)
    async getMyAssignments(req, res) {
        try {
            if (req.user.role === 'student') {
                // Получаем задания по курсам студента
                const user = await User.findByPk(req.user.id, {
                    include: [
                        {
                            model: Course,
                            as: 'courses',
                            include: [
                                {
                                    model: Assignment,
                                    as: 'assignments',
                                    include: [
                                        { model: AssignmentSubmission, as: 'submissions', where: { student_id: req.user.id }, required: false }
                                    ]
                                }
                            ]
                        }
                    ]
                });

                const assignments = [];
                user.courses.forEach(course => {
                    course.assignments.forEach(assignment => {
                        assignments.push(assignment);
                    });
                });

                res.json(assignments);
            } else {
                // Для преподавателей - задания, которые они создали
                const assignments = await Assignment.findAll({
                    where: { teacher_id: req.user.id },
                    include: [
                        { model: Course, as: 'course' },
                        {
                            model: AssignmentSubmission,
                            as: 'submissions',
                            include: [
                                { model: User, as: 'student', attributes: ['id', 'full_name', 'email'] },
                                { model: Grade, as: 'grade' }
                            ]
                        }
                    ]
                });

                res.json(assignments);
            }
        } catch (error) {
            console.error('Ошибка получения заданий:', error);
            res.status(500).json({ error: 'Ошибка при получении заданий' });
        }
    }
};

module.exports = assignmentsController;

