-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
    group_name VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для быстрого поиска по email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Пример тестовых данных (для разработки)
INSERT INTO users (email, password_hash, full_name, role, group_name) VALUES
('student@example.com', 'hashed_password_123', 'Иванов Иван', 'student', 'Группа 101'),
('teacher@example.com', 'hashed_password_456', 'Петрова Анна', 'teacher', NULL);