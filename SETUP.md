# Инструкция по настройке проекта

## Важно! Создание файла .env

Перед запуском проекта необходимо создать файл `.env` в папке `backend/`.

### Шаги:

1. Скопируйте файл `.env.example` в `.env`:
   ```bash
   cd backend
   copy .env.example .env
   ```
   
   Или создайте файл `.env` вручную и добавьте следующее содержимое:

```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=student_portal
DB_PASSWORD=12345678
DB_PORT=5432

# JWT Secret
JWT_SECRET=your-secret-jwt-key-change-in-production-12345

# Server Configuration
PORT=5000
NODE_ENV=development

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

2. **Обязательно измените следующие значения:**
   - `DB_PASSWORD` - укажите ваш пароль от PostgreSQL
   - `JWT_SECRET` - придумайте сложный секретный ключ для JWT (в продакшене используйте длинный случайный ключ)

3. Также обновите `backend/config/config.json` с вашими данными базы данных:
   ```json
   {
     "development": {
       "username": "postgres",
       "password": "ваш_пароль",
       "database": "student_portal",
       "host": "localhost",
       "dialect": "postgres",
       "port": 5432
     }
   }
   ```

## Последовательность запуска

1. **Установите зависимости backend:**
   ```bash
   cd backend
   npm install
   ```

2. **Создайте базу данных PostgreSQL:**
   ```sql
   CREATE DATABASE student_portal;
   ```

3. **Выполните миграции:**
   ```bash
   npx sequelize-cli db:migrate
   ```

4. **Запустите backend сервер:**
   ```bash
   npm run dev
   ```

5. **В новом терминале установите зависимости frontend:**
   ```bash
   cd frontend
   npm install
   ```

6. **Запустите frontend сервер:**
   ```bash
   npm run dev
   ```

7. Откройте браузер и перейдите на `http://localhost:5173`

## Проверка работы

После запуска обоих серверов:

1. Backend должен быть доступен на `http://localhost:5000`
2. Frontend должен быть доступен на `http://localhost:5173`
3. Попробуйте зарегистрировать нового пользователя
4. Войдите в систему с созданными учетными данными

## Возможные проблемы

### Ошибка подключения к базе данных
- Убедитесь, что PostgreSQL запущен
- Проверьте правильность данных в `.env` и `config.json`
- Убедитесь, что база данных `student_portal` создана

### Ошибка "Cannot find module"
- Убедитесь, что вы установили все зависимости: `npm install`
- Проверьте, что вы находитесь в правильной папке

### Ошибка миграций
- Убедитесь, что база данных создана
- Проверьте права доступа к базе данных
- Попробуйте откатить миграции: `npx sequelize-cli db:migrate:undo` и выполнить заново

## Готово!

После выполнения всех шагов проект должен быть готов к работе. Подробная документация находится в папке `docs/`.


