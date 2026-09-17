#!/usr/bin/env bash
set -e

echo "🚀 [PMS] Starting Production Deployment..."

# 1. Check environment file
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
    else
        echo "DATABASE_URL=postgresql://pms_user:pms_password@db:5432/pms_db" > .env
        echo "SECRET_KEY=$(openssl rand -hex 32 2>/dev/null || echo 'change_me_super_secret_production_key_12345')" >> .env
    fi
    echo "✅ .env initialized."
fi

# 2. Pull latest codebase (if in git repo)
if [ -d .git ]; then
    echo "📥 Pulling latest updates from Git..."
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD || echo "develop")
    git pull origin "$CURRENT_BRANCH" || echo "⚠️ Git pull failed or offline, continuing with local files..."
fi

# 3. Build & Run production stack
echo "📦 Building and starting Production Containers..."
docker compose -f docker-compose.prod.yml up -d --build

# 4. Verification
echo "⏳ Waiting for services to initialize..."
sleep 5

docker compose -f docker-compose.prod.yml ps

echo "🎉 [PMS] Production deployment completed successfully!"
echo "🌐 Frontend & API are live on port 80 (HTTP) and 443 (HTTPS)."
