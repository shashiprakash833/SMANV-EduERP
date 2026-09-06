# SMANV EduERP - Enterprise Modular Monolith

[![Architecture: Modular Monolith](https://img.shields.io/badge/Architecture-Modular%20Monolith-blue.svg)](#architecture)
[![Backend: Django 5+](https://img.shields.io/badge/Backend-Django%205%2B%20%7C%20DRF-green.svg)](file:///backend/README.md)
[![Frontend: React Native / Expo SDK 53+](https://img.shields.io/badge/Frontend-Expo%20SDK%2053%2B-purple.svg)](file:///frontend/README.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](file:///LICENSE)

**SMANV EduERP** is an enterprise-grade, multi-tenant SaaS Education Resource Planning (ERP) platform developed by **SMANV Info Tech Private Limited**. Designed to serve single-campus schools, multi-branch colleges, and university networks, SMANV EduERP provides centralized administration, academic tracking, automated attendance, fee invoicing, and AI-powered predictive analytics.

---

## Repository Structure

The repository is organized as an enterprise **Modular Monolith** separating client interfaces, server domains, and technical specifications into distinct workspaces:

```text
SMANV-EduERP/
├── frontend/                     # Cross-platform Mobile Client (React Native / Expo)
│   ├── app/                      # Expo Router Transparent Route Groups
│   │   ├── (auth)/               # Authentication (Login, Register, OTP, Reset)
│   │   ├── (dashboard)/          # Role-Based Executive Dashboards
│   │   ├── (organization)/       # Tenant Profile & Multi-Campus Switcher
│   │   ├── (student)/            # Student Information System & 360 Profiles
│   │   ├── (staff)/              # Faculty & HR Directory
│   │   ├── (finance)/            # Fee Management & Invoicing Desk
│   │   ├── (profile)/            # User Profile & Preferences
│   │   └── _layout.tsx           # Root Navigation Drawer / Header Layout
│   ├── components/               # Shared Reusable Atomic UI Components
│   ├── features/                 # Modular Domain State, Hooks & Types
│   ├── hooks/                    # Global React Hooks (useProtectedRoute, etc.)
│   ├── services/                 # Axios API Client & Network Interceptors
│   ├── store/                    # Zustand Stores with SecureStore Token Storage
│   ├── theme/                    # Design System Colors, Typography & Spacing
│   ├── utils/                    # Common Utility Helpers & Formatters
│   ├── package.json              # Frontend Node Dependencies
│   └── tsconfig.json             # TypeScript Configuration with @/ Path Aliases
│
├── backend/                      # Production Multi-Tenant Backend (Django 5+ / DRF)
│   ├── config/                   # Core Django Settings & Routing
│   │   ├── settings/             # Environment-Specific Settings
│   │   │   ├── base.py           # Base Django & DRF Configuration
│   │   │   ├── development.py    # Local SQLite / Dev Settings
│   │   │   ├── production.py     # High-Security PostgreSQL Settings
│   │   │   └── testing.py        # Fast In-Memory SQLite Testing Profile
│   │   ├── urls.py               # Top-Level API Router & Swagger Endpoints
│   │   ├── wsgi.py               # WSGI Entrypoint for Gunicorn
│   │   └── asgi.py               # ASGI Entrypoint for WebSockets
│   ├── apps/                     # Clean Architecture Modular Domain Apps
│   │   ├── accounts/             # Multi-Tenant User Model & JWT Auth
│   │   ├── organizations/        # Tenant Model & Organization Management
│   │   ├── students/             # Student Information System (SIS)
│   │   ├── staff/                # Human Resource & Faculty Management
│   │   ├── attendance/           # Daily & Batch Attendance Engine
│   │   ├── academics/            # Courses, Classes, Sections & Subjects
│   │   ├── examinations/         # Exams, Grading & Report Cards
│   │   ├── finance/              # Fee Structures, Invoices & Payments
│   │   ├── notifications/        # In-App & Multi-Channel Notifications
│   │   ├── ai/                   # AI Dropout Risk & Performance Insights
│   │   ├── reports/              # Executive Analytics & Document Exports
│   │   ├── common/               # TenantAwareModel & Custom Exceptions
│   │   └── core/                 # Health Checks & System Monitoring
│   ├── requirements/             # Modular Dependency Requirements
│   ├── scripts/                  # Data Seeding & Maintenance Scripts
│   ├── manage.py                 # Administrative CLI
│   └── Dockerfile                # Multi-Stage Production Containerfile
│
├── docs/                         # Enterprise Architectural & Engineering Docs
│   ├── Architecture/             # System Architecture & Clean Architecture Layering
│   ├── API/                      # RESTful API Endpoints & Request/Response Contracts
│   ├── Database/                 # PostgreSQL Schema Design & RLS Isolation
│   ├── Wireframes/               # Mobile UI/UX Navigation Flows & Design Tokens
│   ├── SRS/                      # Software Requirements Specification (IEEE 830)
│   ├── FRS/                      # Functional Requirements Specification
│   └── Deployment/               # Production DevOps, Docker Compose & EAS Guides
│
├── .gitignore                    # Master Monolith Git Ignore Rules
├── LICENSE                       # MIT License
└── README.md                     # Monolith Overview & Engineering Reference
```

---

## Architectural Principles

### 1. Clean Architecture (Backend)
Every domain module within `backend/apps/` enforces a strict separation of concerns:
- **`models.py`**: Inherits from `TenantAwareModel` ensuring strict row-level isolation.
- **`serializers.py`**: Handles strict validation and JSON serialization.
- **`services.py`**: Contains pure domain business logic and atomic write transactions.
- **`selectors.py`**: Encapsulates optimized database queries (`select_related`, `prefetch_related`) scoped to the active tenant.
- **`views.py`**: Thin HTTP controllers dispatching to services and selectors.
- **`permissions.py`**: Custom permission checks (`IsTenantMember`, `IsAdminOrReadOnly`).

### 2. Transparent Route Groups (Frontend)
The mobile client leverages Expo Router parenthesized folder groups (e.g., `(auth)`, `(student)`, `(finance)`). This provides modular file organization while keeping routing paths clean, decoupled, and intuitive:
- `app/(auth)/login.tsx` $\to$ `/login`
- `app/(student)/index.tsx` $\to$ `/students`
- `app/(finance)/fees.tsx` $\to$ `/finance/fees`

### 3. Multi-Tenancy by Design
Data isolation is guaranteed through a **Shared Database, Row-Level Isolation** strategy:
- Every tenant entity maintains an indexed Foreign Key to `organizations.Organization`.
- The `TenantContextMiddleware` and `IsTenantMember` permissions prevent cross-tenant data leakage.

---

## Quick Start Guide

### Prerequisites
- Node.js 18+ and npm / yarn
- Python 3.12+ (Python 3.13 tested)
- Git

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements/development.txt

# Run migrations
python manage.py migrate

# Seed sample institutional demo data
python scripts/seed_demo_data.py

# Run the test suite (25 tests across all modules)
python manage.py test apps --settings=config.settings.testing

# Start the development server
python manage.py runserver
```
*API will be available at `http://localhost:8000/api/v1/`.*  
*Interactive Swagger UI at `http://localhost:8000/api/v1/docs/`.*

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Verify TypeScript compilation
npx tsc --noEmit

# Start the Expo development server
npx expo start
```
*Press `a` to open in Android Emulator, `i` for iOS Simulator, or scan the QR code using Expo Go.*

---

## Technical Documentation Directory

For in-depth architectural and engineering documentation, refer to the [docs/](file:///docs/) directory:
- [System Architecture Specification](file:///docs/Architecture/SYSTEM_ARCHITECTURE.md)
- [REST API Specification](file:///docs/API/API_SPECIFICATION.md)
- [Database Schema Design](file:///docs/Database/SCHEMA_DESIGN.md)
- [Mobile UI/UX Navigation Flows](file:///docs/Wireframes/UI_UX_FLOWS.md)
- [Software Requirements Specification (SRS)](file:///docs/SRS/SOFTWARE_REQUIREMENTS.md)
- [Functional Requirements Specification (FRS)](file:///docs/FRS/FUNCTIONAL_REQUIREMENTS.md)
- [Production Deployment & DevOps Guide](file:///docs/Deployment/DEPLOYMENT_GUIDE.md)

---

## Quality Assurance & Verification Status

| Component | Verification Target | Status | Notes |
|---|---|---|---|
| **Backend** | Unit & Integration Tests | **25/25 Passing** | Tested via `config.settings.testing` (0.206s execution time) |
| **Backend** | OpenAPI 3.0 Schema | **Validated** | Validated with `drf-spectacular` without warnings |
| **Frontend** | TypeScript Compilation | **0 Errors** | `npx tsc --noEmit` cleanly passed across all 23 views & components |
| **Frontend** | Expo Configuration | **Validated** | `npx expo config` validated |
| **Monolith** | Git History Integrity | **Preserved** | All legacy files migrated via `git mv` |

---

## License & Copyright

Developed by **SMANV Info Tech Private Limited**.  
Distributed under the MIT License. See [LICENSE](file:///LICENSE) for details.
