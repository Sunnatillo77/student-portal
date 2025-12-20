const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Импортируем модели для синхронизации
const { sequelize } = require('./models');

// Подключаем маршруты
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const coursesRoutes = require('./routes/courses.routes');
const assignmentsRoutes = require('./routes/assignments.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const materialsRoutes = require('./routes/materials.routes');
const gradesRoutes = require('./routes/grades.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5824'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статическая раздача загруженных файлов
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Корневой маршрут - должен быть ДО других маршрутов
app.get('/', (req, res) => {
    res.json({ 
        message: 'Добро пожаловать в Student Portal API!',
        description: 'API для студенческого портала',
        version: '1.0.0',
        endpoints: {
            api: '/api',
            auth: '/api/auth',
            profile: '/api/profile',
            courses: '/api/courses',
            assignments: '/api/assignments',
            schedule: '/api/schedule',
            materials: '/api/materials',
            grades: '/api/grades'
        },
        frontend: 'http://localhost:5173',
        documentation: 'Для доступа к API используйте соответствующие endpoints'
    });
});

// Подключаем маршруты
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/grades', gradesRoutes);

// Маршрут для главной страницы API
app.get('/api', (req, res) => {
    res.json({
        message: 'Добро пожаловать в API студенческого портала!',
        endpoints: {
            auth: '/api/auth',
            profile: '/api/profile',
            courses: '/api/courses',
            assignments: '/api/assignments',
            schedule: '/api/schedule',
            materials: '/api/materials',
            grades: '/api/grades'
        },
        documentation: 'Документация доступна по запросу'
    });
});

// Базовый маршрут для проверки
app.get('/api/health', (req, res) => {
    res.json({ 
        message: 'API студенческого портала работает',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        database: 'connected'
    });
});

// Маршрут для проверки работоспособности
app.get('/api/test', (req, res) => {
    res.json({ 
        status: 'ok',
        serverTime: new Date().toISOString(),
        database: 'connected'
    });
});

// Маршрут для 404 ошибки - ДОЛЖЕН БЫТЬ ПОСЛЕДНИМ
app.use((req, res) => {
    res.status(404).json({
        error: 'Маршрут не найден',
        requestedUrl: req.url,
        method: req.method,
        availableEndpoints: [
            '/',
            '/api',
            '/api/health',
            '/api/auth/*',
            '/api/profile/*',
            '/api/courses/*',
            '/api/assignments/*',
            '/api/schedule/*',
            '/api/materials/*',
            '/api/grades/*'
        ]
    });
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error('❌ Ошибка сервера:', err.stack);
    res.status(500).json({ 
        error: 'Внутренняя ошибка сервера',
        message: err.message 
    });
});

// Синхронизация базы данных и запуск сервера
sequelize.authenticate()
    .then(() => {
        console.log('✅ Подключение к базе данных успешно');
        
        // Синхронизация моделей
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log('✅ Модели синхронизированы');
        
        // Запуск сервера
        app.listen(PORT, () => {
            console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
            console.log(`✅ API доступно по http://localhost:${PORT}/api`);
            console.log(`✅ Фронтенд запущен на http://localhost:5173`);
            console.log(`✅ Проверьте работоспособность:`);
            console.log(`   - http://localhost:${PORT}/`);
            console.log(`   - http://localhost:${PORT}/api`);
            console.log(`   - http://localhost:${PORT}/api/health`);
            console.log(`   - http://localhost:${PORT}/api/test`);
        });
    })
    .catch(err => {
        console.error('❌ Ошибка подключения к базе данных:', err);
        process.exit(1);
    });