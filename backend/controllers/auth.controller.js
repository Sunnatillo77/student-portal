const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authController = {
    // Регистрация нового пользователя
    async register(req, res) {
        try {
            const { email, password, full_name, role, group_name } = req.body;

            // Проверка обязательных полей
            if (!email || !password || !full_name) {
                return res.status(400).json({ 
                    error: 'Пожалуйста, заполните все обязательные поля' 
                });
            }

            // Проверка формата email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ 
                    error: 'Неверный формат email' 
                });
            }

            // Проверка длины пароля
            if (password.length < 6) {
                return res.status(400).json({ 
                    error: 'Пароль должен содержать минимум 6 символов' 
                });
            }

            // Проверка существующего пользователя
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(409).json({ 
                    error: 'Пользователь с таким email уже существует' 
                });
            }

            // Создание пользователя (пароль хешируется автоматически в модели через hook)
            const user = await User.create({
                email,
                password,
                full_name,
                role: role || 'student',
                group_name: group_name || null
            });

            // Создание JWT токена
            const token = jwt.sign(
                { 
                    id: user.id, 
                    email: user.email, 
                    role: user.role 
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            // Возвращаем данные пользователя (без пароля)
            res.status(201).json({
                message: 'Регистрация успешна!',
                user: {
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name,
                    role: user.role,
                    group_name: user.group_name,
                    created_at: user.createdAt
                },
                token
            });

        } catch (error) {
            console.error('Ошибка регистрации:', error);
            res.status(500).json({ 
                error: 'Ошибка при регистрации',
                details: process.env.NODE_ENV === 'development' ? error.message : null
            });
        }
    },

    // Вход пользователя
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ 
                    error: 'Пожалуйста, введите email и пароль' 
                });
            }

            // Поиск пользователя
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ 
                    error: 'Неверный email или пароль' 
                });
            }

            // Проверка пароля
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ 
                    error: 'Неверный email или пароль' 
                });
            }

            // Создание JWT токена
            const token = jwt.sign(
                { 
                    id: user.id, 
                    email: user.email, 
                    role: user.role 
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            res.json({
                message: 'Вход выполнен успешно!',
                user: {
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name,
                    role: user.role,
                    group_name: user.group_name
                },
                token
            });

        } catch (error) {
            console.error('Ошибка входа:', error);
            res.status(500).json({ 
                error: 'Ошибка при входе в систему' 
            });
        }
    },

    // Выход пользователя
    async logout(req, res) {
        try {
            res.json({ 
                message: 'Выход выполнен успешно' 
            });
        } catch (error) {
            console.error('Ошибка выхода:', error);
            res.status(500).json({ 
                error: 'Ошибка при выходе из системы' 
            });
        }
    }
};

module.exports = authController;