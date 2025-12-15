const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Простой тестовый маршрут
app.get('/', (req, res) => {
  res.json({ message: '✅ Сервер студенческого портала работает!' });
});

// Маршрут для проверки API
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'OK',
    modules: ['Расписание', 'Задания', 'Оценки', 'Материалы']
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});