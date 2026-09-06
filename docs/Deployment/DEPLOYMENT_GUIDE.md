# SMANV EduERP - Production Deployment & DevOps Guide

## 1. System Requirements & Architecture Overview

SMANV EduERP is designed to be deployed in high-availability cloud environments (AWS, GCP, DigitalOcean, or On-Premise Kubernetes/Docker clusters).

### Minimum Hardware Sizing (Per Node)
- **Application Server (Django / Gunicorn / Celery)**: 4 vCPUs, 8 GB RAM, 50 GB SSD
- **Database Server (PostgreSQL 16+)**: 4 vCPUs, 16 GB RAM, 100 GB NVMe SSD (Multi-AZ)
- **Cache & Message Broker (Redis 7+)**: 2 vCPUs, 4 GB RAM

---

## 2. Docker Compose Production Topology

The following `docker-compose.prod.yml` defines the container orchestration:

```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_DB: ${DB_NAME:-smanv_eduerp}
      POSTGRES_USER: ${DB_USER:-smanv_admin}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - internal_network

  redis:
    image: redis:7-alpine
    restart: always
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - internal_network

  web:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: always
    command: gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4 --threads 2 --timeout 60
    env_file:
      - ./backend/.env.production
    depends_on:
      - db
      - redis
    volumes:
      - static_volume:/app/staticfiles
      - media_volume:/app/media
    networks:
      - internal_network

  celery_worker:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: always
    command: celery -A config worker --loglevel=info --concurrency=4
    env_file:
      - ./backend/.env.production
    depends_on:
      - db
      - redis
    networks:
      - internal_network

  celery_beat:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: always
    command: celery -A config beat --loglevel=info
    env_file:
      - ./backend/.env.production
    depends_on:
      - db
      - redis
    networks:
      - internal_network

  nginx:
    image: nginx:1.25-alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx/prod.conf:/etc/nginx/conf.d/default.conf
      - ./docker/ssl:/etc/nginx/ssl:ro
      - static_volume:/var/www/static
      - media_volume:/var/www/media
    depends_on:
      - web
    networks:
      - internal_network

volumes:
  postgres_data:
  redis_data:
  static_volume:
  media_volume:

networks:
  internal_network:
    driver: bridge
```

---

## 3. Environment Variables Reference (`.env.production`)

```ini
# Django Core
DJANGO_SETTINGS_MODULE=config.settings.production
SECRET_KEY=generate-a-strong-random-key-here-minimum-50-characters
DEBUG=False
ALLOWED_HOSTS=api.smanv-eduerp.com,localhost

# Database (PostgreSQL)
DB_ENGINE=django.db.backends.postgresql
DB_NAME=smanv_eduerp
DB_USER=smanv_admin
DB_PASSWORD=SecureProductionDatabasePassword123!
DB_HOST=db
DB_PORT=5432

# Redis & Celery
REDIS_URL=redis://:RedisProductionPassword123!@redis:6379/0
CELERY_BROKER_URL=redis://:RedisProductionPassword123!@redis:6379/1
CELERY_RESULT_BACKEND=redis://:RedisProductionPassword123!@redis:6379/2

# JWT Security
JWT_ACCESS_TOKEN_LIFETIME_MINUTES=15
JWT_REFRESH_TOKEN_LIFETIME_DAYS=7

# CORS / CSRF
CORS_ALLOWED_ORIGINS=https://app.smanv-eduerp.com
CSRF_TRUSTED_ORIGINS=https://api.smanv-eduerp.com
```

---

## 4. Backend Deployment Steps

### Step 1: Initial Server Setup
```bash
# Clone the repository
git clone https://github.com/smanv-infotech/SMANV-EduERP.git
cd SMANV-EduERP/backend

# Create production environment file
cp .env.example .env.production
nano .env.production
```

### Step 2: Run Database Migrations
```bash
python manage.py migrate --settings=config.settings.production
```

### Step 3: Collect Static Files
```bash
python manage.py collectstatic --noinput --settings=config.settings.production
```

### Step 4: Seed Demo Data (Optional for Staging)
```bash
python scripts/seed_demo_data.py
```

### Step 5: Start Production Services
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 5. Mobile Application Deployment (Expo EAS)

The frontend mobile app is published to the Apple App Store and Google Play Store via **Expo Application Services (EAS)**:

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

### Step 2: Login to Expo Account
```bash
eas login
```

### Step 3: Configure Project Credentials
Inside `frontend/`:
```bash
cd frontend
eas build:configure
```

### Step 4: Build for Android (.aab for Google Play Store)
```bash
eas build --platform android --profile production
```

### Step 5: Build for iOS (.ipa for TestFlight / App Store)
```bash
eas build --platform ios --profile production
```

### Step 6: Submit to Stores
```bash
eas submit --platform android
eas submit --platform ios
```
