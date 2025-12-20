# Студенческий портал

Веб-приложение для организации учебного процесса и управления студенческой жизнью.

## Описание

Студенческий портал — это комплексная система, предоставляющая единую платформу для студентов и преподавателей. Система включает следующие модули:

- **Система аутентификации и авторизации** - регистрация, вход, управление правами доступа
- **Управление курсами** - создание курсов, запись студентов
- **Система домашних заданий** - выдача, сдача и проверка заданий
- **Расписание занятий** - просмотр и управление расписанием
- **Учебные материалы** - загрузка и доступ к материалам
- **Электронный журнал** - просмотр и управление оценками

## Технологический стек

### Frontend
- React 19.2.0
- React Router DOM 7.1.3
- Axios 1.7.9
- Vite 7.2.4

### Backend
- Node.js
- Express 5.2.1
- PostgreSQL
- Sequelize 6.37.3
- JWT (jsonwebtoken)
- bcryptjs
- Multer (для загрузки файлов)

## Требования

- Node.js (версия 16 или выше)
- PostgreSQL (версия 12 или выше)
- npm или yarn

## Установка и настройка

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd student-portal
```

### 2. Настройка базы данных

1. Установите PostgreSQL, если он еще не установлен
2. Создайте базу данных:

```sql
CREATE DATABASE student_portal;
```

### 3. Настройка Backend

1. Перейдите в папку backend:
```bash
cd backend
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` в папке `backend`:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=student_portal
DB_PASSWORD=your_password
DB_PORT=5432

JWT_SECRET=your-secret-jwt-key-change-in-production
PORT=5000
NODE_ENV=development

UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

4. Обновите конфигурацию базы данных в `backend/config/config.json`:

```json
{
  "development": {
    "username": "postgres",
    "password": "your_password",
    "database": "student_portal",
    "host": "localhost",
    "dialect": "postgres",
    "port": 5432
  }
}
```

5. Выполните миграции:
```bash
npx sequelize-cli db:migrate
```

6. Запустите сервер:
```bash
npm run dev
```

Сервер будет запущен на `http://localhost:5000`

### 4. Настройка Frontend

1. Откройте новый терминал и перейдите в папку frontend:
```bash
cd frontend
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите dev сервер:
```bash
npm run dev
```

Frontend будет доступен на `http://localhost:5173`

## Использование

### Первый запуск

1. Запустите backend сервер
2. Запустите frontend сервер
3. Откройте браузер и перейдите на `http://localhost:5173`
4. Зарегистрируйте нового пользователя или войдите в систему

### Роли пользователей

- **Студент (student)**: Может записываться на курсы, просматривать задания, отправлять решения, просматривать оценки и материалы
- **Преподаватель (teacher)**: Может создавать курсы, выдавать задания, проверять работы, загружать материалы, управлять расписанием
- **Администратор (admin)**: Полный доступ ко всем функциям системы

## Структура проекта

```
student-portal/
├── backend/                 # Backend приложение
│   ├── config/             # Конфигурация
│   ├── controllers/        # Контроллеры
│   ├── middleware/         # Middleware
│   ├── migrations/         # Миграции базы данных
│   ├── models/             # Модели Sequelize
│   ├── routes/             # API маршруты
│   ├── uploads/            # Загруженные файлы
│   ├── server.js           # Точка входа
│   └── package.json
│
├── frontend/               # Frontend приложение
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── pages/          # Страницы
│   │   ├── services/       # API сервисы
│   │   ├── context/        # React Context
│   │   └── App.jsx
│   └── package.json
│
└── docs/                   # Документация
    ├── specification.md    # Техническое задание
    └── tech-stack.md       # Технологический стек
```

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/auth/logout` - Выход

### Профиль
- `GET /api/profile/me` - Получить профиль
- `PUT /api/profile/me` - Обновить профиль

### Курсы
- `GET /api/courses` - Все курсы
- `GET /api/courses/my` - Мои курсы
- `GET /api/courses/:id` - Курс по ID
- `POST /api/courses` - Создать курс (teacher/admin)
- `POST /api/courses/:courseId/enroll` - Записаться на курс (student)

### Задания
- `GET /api/assignments` - Все задания
- `GET /api/assignments/my` - Мои задания
- `GET /api/assignments/:id` - Задание по ID
- `POST /api/assignments` - Создать задание (teacher)
- `POST /api/assignments/:id/submit` - Отправить решение (student)
- `POST /api/assignments/submissions/:submissionId/grade` - Оценить решение (teacher)

### Расписание
- `GET /api/schedule` - Расписание
- `GET /api/schedule/:id` - Расписание по ID
- `POST /api/schedule` - Создать запись (teacher/admin)
- `PUT /api/schedule/:id` - Обновить запись
- `DELETE /api/schedule/:id` - Удалить запись

### Материалы
- `GET /api/materials` - Все материалы
- `GET /api/materials/:id` - Материал по ID
- `POST /api/materials` - Создать материал (teacher)
- `PUT /api/materials/:id` - Обновить материал
- `DELETE /api/materials/:id` - Удалить материал

### Оценки
- `GET /api/grades` - Все оценки
- `GET /api/grades/:id` - Оценка по ID
- `GET /api/grades/performance/:studentId?` - Успеваемость студента

## Скрипты

### Backend
- `npm start` - Запуск продакшн сервера
- `npm run dev` - Запуск dev сервера с nodemon
- `npx sequelize-cli db:migrate` - Выполнить миграции
- `npx sequelize-cli db:migrate:undo` - Откатить последнюю миграцию

### Frontend
- `npm run dev` - Запуск dev сервера
- `npm run build` - Сборка для продакшена
- `npm run preview` - Просмотр продакшн сборки
- `npm run lint` - Проверка кода линтером

## Документация

Подробная документация находится в папке `docs/`:
- `specification.md` - Техническое задание с полным описанием требований
- `tech-stack.md` - Детальное описание технологического стека

## Безопасность

- Пароли хешируются с использованием bcrypt
- JWT токены для аутентификации
- Валидация данных на клиенте и сервере
- Защита маршрутов с помощью middleware
- CORS настройки

## Разработка

### Добавление новых функций

1. Создайте модель в `backend/models/`
2. Создайте миграцию: `npx sequelize-cli migration:generate --name your-migration-name`
3. Создайте контроллер в `backend/controllers/`
4. Создайте маршруты в `backend/routes/`
5. Добавьте маршруты в `backend/server.js`
6. Создайте компоненты на frontend в `frontend/src/pages/` или `frontend/src/components/`

## Лицензия

Этот проект создан в образовательных целях.

## Контакты

По вопросам и предложениям обращайтесь к разработчикам проекта.
