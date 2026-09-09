# Internal Planning & Reporting System

Система для планирования работы сотрудников, ведения месячных планов, спринтов, фиксации фактических результатов и автоматического формирования отчётов.

## Архитектура
* **Backend:** FastAPI, PostgreSQL, SQLAlchemy, Alembic
* **Frontend:** React, TypeScript, Vite, TailwindCSS
* **Инфраструктура:** Docker Compose

## Как запустить

1. Убедитесь, что у вас установлен Docker и Docker Compose.
2. Скопируйте `.env.example` в `.env`:
   ```bash
   cp .env.example .env
   ```
3. Запустите все сервисы одной командой:
   ```bash
   docker-compose up --build
   ```
4. После запуска:
   * **Frontend:** доступен по адресу `http://localhost:5173`
   * **Backend API:** `http://localhost:8000`
   * **Swagger Docs:** `http://localhost:8000/docs`

## Структура проекта
* `backend/` - исходный код FastAPI.
  * `app/models.py` - ORM модели.
  * `app/schemas.py` - Pydantic схемы валидации.
  * `app/crud.py` - бизнес-логика (в т.ч. валидация "Sum(Sprint Plans) == Month Plan").
  * `alembic/` - система миграций БД.
* `frontend/` - исходный код React приложения (Vite).
* `docker-compose.yml` - конфигурация развёртывания.

## Дальнейшее развитие
1. Запуск первой миграции Alembic (база создастся автоматически через `Base.metadata.create_all`, но миграции настроены для Production).
2. Реализация полноценной авторизации (UI для логина + привязка JWT токенов к запросам).
3. Добавление Telegram Bot API.

