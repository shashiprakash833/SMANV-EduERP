# SMANV EduERP - Production-Ready Django Backend

SMANV EduERP is a multi-tenant SaaS Enterprise Resource Planning system tailored for Schools, Colleges, and Educational Institutions. Developed by **SMANV Info Tech Private Limited**.

This backend service is completely independent from the frontend and provides production-ready RESTful APIs, JWT authentication, role-based access control, tenant isolation, and interactive Swagger/OpenAPI documentation.

---

## Tech Stack

- **Python**: 3.13+
- **Django**: 5.0+
- **Django REST Framework**: 3.15+
- **JWT Auth**: `djangorestframework-simplejwt`
- **Database**: PostgreSQL (with automatic local dev fallback support)
- **API Documentation**: `drf-spectacular` (OpenAPI 3.0 & Swagger UI)
- **CORS Handling**: `django-cors-headers`
- **Containerization**: Docker & Docker Compose

---

## Directory Structure

```text
backend/
├── config/
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── apps/
│   ├── accounts/         # User model, roles, authentication, JWT views
│   ├── organizations/    # Organization tenant model, profile & settings
│   ├── common/           # Abstract models, custom exception handler, permissions
│   └── core/             # Health check & system diagnostics
├── media/                # User avatar uploads & school logos
├── static/               # Collected static assets
├── requirements/
│   ├── base.txt
│   ├── development.txt
│   └── production.txt
├── docker/
│   ├── Dockerfile
│   └── entrypoint.sh
├── .env                  # Active environment variables
├── .env.example          # Example environment template
├── docker-compose.yml    # Postgres & Backend container setup
├── requirements.txt      # Root dependency entrypoint
├── manage.py             # Administrative CLI
└── README.md
```

---

## Installation & Local Setup

### 1. Prerequisites
- Python 3.13 or newer
- Git
- PostgreSQL (or use Docker / SQLite fallback during initial testing)

### 2. Create and Activate Virtual Environment

**Windows (PowerShell):**
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Linux / macOS:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Requirements

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

*(For testing and development tools, you can run `pip install -r requirements/development.txt`)*

### 4. Configure Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Adjust your database credentials in `.env`:
```ini
DB_ENGINE=django.db.backends.postgresql
DB_NAME=smanv_eduerp_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=127.0.0.1
DB_PORT=5432
USE_SQLITE_FALLBACK=True
```

### 5. Run Database Migrations

```bash
python manage.py makemigrations accounts organizations
python manage.py migrate
```

### 6. Create Superuser (Super Admin)

```bash
python manage.py createsuperuser
```
Follow the interactive prompts to enter an email, name, and password.

### 7. Run the Development Server

```bash
python manage.py runserver 0.0.0.0:8000
```
The server will start at `http://127.0.0.1:8000/`.

---

## Docker Quickstart

To spin up PostgreSQL and the Django backend together:

```bash
cd backend
docker-compose up --build
```

- Backend will be available at `http://localhost:8000/`
- PostgreSQL will be running on port `5432`

---

## API Documentation & Swagger UI

Interactive API documentation is generated via `drf-spectacular`:

- **Swagger UI**: [http://127.0.0.1:8000/api/v1/docs/](http://127.0.0.1:8000/api/v1/docs/) or [http://127.0.0.1:8000/swagger/](http://127.0.0.1:8000/swagger/)
- **OpenAPI Schema (JSON)**: [http://127.0.0.1:8000/api/v1/schema/](http://127.0.0.1:8000/api/v1/schema/)
- **Redoc**: [http://127.0.0.1:8000/api/v1/redoc/](http://127.0.0.1:8000/api/v1/redoc/)

---

## API Endpoints List

### Authentication Endpoints (`/api/v1/auth/`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register/` | Register organization & admin account | No |
| `POST` | `/api/v1/auth/login/` | Authenticate with email/password; returns JWT | No |
| `POST` | `/api/v1/auth/logout/` | Blacklists refresh token | No |
| `POST` | `/api/v1/auth/refresh/` | Rotates JWT access and refresh token | No |
| `GET` | `/api/v1/auth/me/` | Retrieves authenticated user profile & organization | Yes (Bearer) |

*Frontend Compatibility Aliases:*
- `POST /api/v1/auth/token/` (maps to login)
- `POST /api/v1/auth/token/refresh/` (maps to token refresh)
- `GET /api/v1/auth/user/` (maps to `/auth/me/`)

### Organization Endpoints (`/api/v1/organizations/`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/organizations/register/` | Alias for organization registration | No |
| `GET` | `/api/v1/organizations/me/` | Retrieve current user's organization | Yes (Bearer) |
| `PATCH` | `/api/v1/organizations/me/` | Update organization profile | Yes (Org Admin) |
| `GET` | `/api/v1/organizations/current/` | Alias to retrieve organization | Yes (Bearer) |
| `PATCH` | `/api/v1/organizations/current/` | Alias to update organization | Yes (Org Admin) |

### System & Diagnostics

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health/` | Health check & database connection status | No |

---

## User Roles & Permissions

1. **Super Admin (`super_admin`)**: Full platform control across all tenant organizations.
2. **Organization Admin (`org_admin`)**: Manages institutional settings, staff, students, fees.
3. **Staff (`staff`)**: Accesses academic timetable, attendance marking, grading.
4. **Student (`student`)**: Accesses assignments, attendance history, fees receipt, results.
5. **Parent (`parent`)**: Accesses child's academic and fee records.
6. **Finance & HR (`finance`)**: Accesses billing, fee records, receipts, and payroll.

---

## Running Automated Tests

Run the test suite covering registration, login, token refresh, blacklist, and permissions:

```bash
python manage.py test apps --settings=config.settings.development
```

---

## License & Author

Developed by **SMANV Info Tech Private Limited** for SMANV EduERP.
All rights reserved.
