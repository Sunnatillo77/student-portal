const { Grade, User, Course, AssignmentSubmission } = require('../models');

// Общая функция для расчета успеваемости
async function calculatePerformance(studentId) {
    const grades = await Grade.findAll({
        where: { student_id: studentId },
        include: [
            { model: Course, as: 'course', attributes: ['id', 'name', 'code'] }
        ]
    });

    let totalScore = 0;
    let totalMaxScore = 0;
    const coursesMap = new Map();

    grades.forEach(grade => {
        totalScore += grade.score;
        totalMaxScore += grade.max_score;

        const courseId = grade.course_id;
        if (!coursesMap.has(courseId)) {
            coursesMap.set(courseId, {
                course: grade.course,
                scores: [],
                totalScore: 0,
                totalMaxScore: 0
            });
        }

        const courseData = coursesMap.get(courseId);
        courseData.scores.push(grade.score);
        courseData.totalScore += grade.score;
        courseData.totalMaxScore += grade.max_score;
    });

    const coursePerformance = Array.from(coursesMap.values()).map(data => ({
        course: data.course,
        averageScore: data.totalMaxScore > 0 
            ? ((data.totalScore / data.totalMaxScore) * 100).toFixed(2)
            : 0,
        grades: data.scores
    }));

    const overallAverage = totalMaxScore > 0 
        ? ((totalScore / totalMaxScore) * 100).toFixed(2)
        : 0;

    return {
        studentId,
        overallAverage: parseFloat(overallAverage),
        coursePerformance,
        totalGrades: grades.length
    };
}

const gradesController = {
    // Получить все оценки
    async getAll(req, res) {
        try {
            const { studentId, courseId } = req.query;
            const where = {};

            // Если студент, показываем только его оценки
            if (req.user.role === 'student') {
                where.student_id = req.user.id;
            } else if (studentId) {
                where.student_id = studentId;
            }

            if (courseId) {
                where.course_id = courseId;
            }

            const grades = await Grade.findAll({
                where,
                include: [
                    { model: User, as: 'student', attributes: ['id', 'full_name', 'email'] },
                    { model: Course, as: 'course', attributes: ['id', 'name', 'code'] },
                    { model: AssignmentSubmission, as: 'submission', required: false }
                ],
                order: [['graded_at', 'DESC']]
            });

            res.json(grades);
        } catch (error) {
            console.error('Ошибка получения оценок:', error);
            res.status(500).json({ error: 'Ошибка при получении оценок' });
        }
    },

    // Получить оценку по ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const grade = await Grade.findByPk(id, {
                include: [
                    { model: User, as: 'student', attributes: ['id', 'full_name', 'email'] },
                    { model: Course, as: 'course' },
                    { model: AssignmentSubmission, as: 'submission' }
                ]
            });

            if (!grade) {
                return res.status(404).json({ error: 'Оценка не найдена' });
            }

            // Студент может видеть только свои оценки
            if (req.user.role === 'student' && grade.student_id !== req.user.id) {
                return res.status(403).json({ error: 'Доступ запрещен' });
            }

            res.json(grade);
        } catch (error) {
            console.error('Ошибка получения оценки:', error);
            res.status(500).json({ error: 'Ошибка при получении оценки' });
        }
    },

    // Получить успеваемость текущего пользователя
    async getStudentPerformance(req, res) {
        try {
            let studentId;
            
            // Определяем studentId в зависимости от роли пользователя
            if (req.user.role === 'student') {
                studentId = req.user.id;
            } else if (req.params.studentId) {
                // Для преподавателей/админов с указанием studentId
                if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
                    return res.status(403).json({ error: 'Доступ запрещен' });
                }
                studentId = req.params.studentId;
            } else {
                // Для преподавателей/админов без указания studentId - ошибка
                if (req.user.role !== 'student') {
                    return res.status(400).json({ error: 'Укажите ID студента' });
                }
            }

            const result = await calculatePerformance(studentId);
            res.json(result);
        } catch (error) {
            console.error('Ошибка получения успеваемости:', error);
            res.status(500).json({ error: 'Ошибка при получении успеваемости' });
        }
    }
};

module.exports = gradesController;