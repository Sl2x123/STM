# Internal Planning & Reporting System (PMS)

Система для планирования работы сотрудников, ведения месячных планов, спринтов проектов, блогеров, фиксации фактических результатов (РНП) и формирования аналитических отчетов.

---

## Архитектура
* **Backend:** FastAPI (Python 3.11), PostgreSQL 15, SQLAlchemy, Alembic, Uvicorn (multi-worker)
* **Frontend:** React 18, TypeScript, Vite, TailwindCSS, Lucide Icons
* **Reverse Proxy:** Nginx (Alpine), Gzip, SSL (Let's Encrypt / Certbot)
* **Инфраструктура:** Docker & Docker Compose

---

## 🛠 Быстрый запуск для разработки (Local Dev)

1. Клонируйте репозиторий:
   ```bash
   git clone -b develop https://github.com/Sl2x123/STM.git
   cd STM
   ```
2. Скопируйте файл переменных окружения:
   ```bash
   cp .env.example .env
   ```
3. Запустите стек разработки:
   ```bash
   docker compose up -d --build
   ```
4. Доступ к сервисам:
   * **Frontend:** [http://localhost:5173](http://localhost:5173)
   * **Backend API:** [http://localhost:8000](http://localhost:8000)
   * **Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🚀 Развертывание на боевом сервере (Production Deploy)

На удаленном сервере (Ubuntu / Debian VPS) проект запускается одной командой через production-скрипт:

### 1. Подготовка сервера:
Установите Docker и Git (если еще не установлены):
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

### 2. Клонирование и запуск:
```bash
git clone -b develop https://github.com/Sl2x123/STM.git
cd STM
chmod +x deploy.sh backup_db.sh
./deploy.sh
```

`deploy.sh` автоматически:
- Создаст безопасный `.env` (если отсутствует).
- Соберет фронтенд в оптимизированные статические файлы Nginx.
- Запустит FastAPI с 4 воркерами.
- Поднимет Nginx reverse proxy на портах `80` (HTTP) и `443` (HTTPS).

### 3. Настройка бесплатного SSL (HTTPS):
Если у вас есть домен (например, `pms.yourdomain.uz`), получите сертификат Let's Encrypt:
```bash
docker run -it --rm --name certbot \
  -v "$(pwd)/nginx/certbot_etc:/etc/letsencrypt" \
  -v "$(pwd)/nginx/certbot_var:/var/www/certbot" \
  certbot/certbot certonly --webroot -w /var/www/certbot \
  -d pms.yourdomain.uz
```

---

## 💾 Резервное копирование базы данных

Создать моментальный дамп PostgreSQL:
```bash
./backup_db.sh
```
Бэкапы сохраняются в папку `./backups/` в сжатом виде (`.sql.gz`). Скрипт автоматически удаляет дампы старше 14 дней.

---

## 📂 Структура проекта
* `backend/` — FastAPI API, модели SQLAlchemy, схемы Pydantic, сервисы аналитики и парсинга.
* `frontend/` — React SPA приложение (Дашборд, Спринты, Блогеры, РНП).
* `nginx/` — конфигурация production-шлюза Nginx.
* `docker-compose.yml` — конфигурация для локальной разработки с hot-reload.
* `docker-compose.prod.yml` — конфигурация для продакшна с Nginx и многопоточным Uvicorn.
* `deploy.sh` — скрипт авто-развертывания и обновления.
* `backup_db.sh` — скрипт бэкапа PostgreSQL.
