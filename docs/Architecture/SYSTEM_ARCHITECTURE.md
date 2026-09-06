# SMANV EduERP - System Architecture Specification

## 1. Executive Summary

SMANV EduERP is an enterprise-grade, multi-tenant Education Resource Planning (ERP) platform developed by **SMANV Info Tech Private Limited**. The platform provides centralized administrative, academic, financial, and predictive analytics capabilities for schools, colleges, and university networks.

The system is architected as an **Enterprise Modular Monolith**:
- **Frontend**: Cross-platform mobile client built on React Native and Expo (SDK 53+), utilizing Expo Router for transparent route groups, Zustand for local/auth state, and Axios for token-authenticated API communication.
- **Backend**: Python 3.13+ / Django 5+ web application with Django REST Framework (DRF), following **Clean Architecture** patterns (Views $\to$ Services $\to$ Models, with dedicated Selectors for queries), Celery for asynchronous processing, and Redis for distributed caching.

---

## 2. High-Level Architecture Diagram

```
+-------------------------------------------------------------------------------+
|                                CLIENT TIER                                    |
|   +-----------------------------------------------------------------------+   |
|   |                        SMANV EduERP Mobile App                        |   |
|   |                  (React Native / Expo SDK 53+)                        |   |
|   |   +-------------+  +---------------+  +-------------+  +----------+   |   |
|   |   |  Auth State |  | Feature Views |  | Theme / UI  |  |  Axios   |   |   |
|   |   |  (Zustand)  |  | (Expo Router) |  | Design Sys  |  | Client   |   |   |
|   |   +------+------+  +-------+-------+  +------+------+  +----+-----+   |   |
|   +----------|-----------------|-----------------|--------------|---------+   |
+--------------|-----------------|-----------------|--------------|-------------+
               |                 |                 |              |
               | HTTPS / REST API with Bearer JWT Tokens          |
               v                 v                 v              v
+-------------------------------------------------------------------------------+
|                              API GATEWAY / NGINX                              |
|   - SSL/TLS Termination    - Rate Limiting (django-ratelimit)  - CORS Rules  |
+---------------------------------------+---------------------------------------+
                                        |
                                        v
+-------------------------------------------------------------------------------+
|                    BACKEND TIER (DJANGO MODULAR MONOLITH)                     |
|                                                                               |
|   +-----------------------------------------------------------------------+   |
|   |                           API Presentation Layer                      |   |
|   |   - Django REST Framework (APIViews / ViewSets)                       |   |
|   |   - drf-spectacular OpenAPI 3.0 Documentation                         |   |
|   |   - Multi-Tenant & Role-Based Permissions (IsTenantMember, IsAdmin)   |   |
|   +-----------------------------------+-----------------------------------+   |
|                                       |                                       |
|             +-------------------------+-------------------------+             |
|             v                                                   v             |
|   +-----------------------------------+   +-------------------------------+   |
|   |       Write Operations (CUD)      |   |       Read Operations (R)     |   |
|   |           Service Layer           |   |         Selector Layer        |   |
|   |   - Pure Python Business Logic    |   |   - Optimized Queries         |   |
|   |   - Atomic Transactions (atomic)  |   |   - select_related / prefetch |   |
|   |   - Signal / Celery Task Dispatch |   |   - Tenant-Scoped Filtering   |   |
|   +-----------------+-----------------+   +---------------+---------------+   |
|                     |                                     |                   |
|                     +-----------------+-------------------+                   |
|                                       |                                       |
|                                       v                                       |
|   +-----------------------------------------------------------------------+   |
|   |                             Domain Layer                              |   |
|   |   - TenantAwareModel & TenantQuerySet (Row-Level Security)            |   |
|   |   - 13 Domain Modules (Accounts, Orgs, SIS, Staff, Finance, etc.)     |   |
|   +-----------------------------------+-----------------------------------+   |
+---------------------------------------|---------------------------------------+
                                        |
          +-----------------------------+-----------------------------+
          |                                                           |
          v                                                           v
+-----------------------+                                   +-------------------+
|     POSTGRESQL 16+    |                                   |    REDIS 7+       |
|  - Primary Relational |                                   |  - Celery Broker  |
|  - Foreign Key RLS    |                                   |  - Session Cache  |
|  - Multi-Tenant DB    |                                   |  - Rate Limits    |
+-----------------------+                                   +-------------------+
                                                                      |
                                                                      v
                                                            +-------------------+
                                                            |  CELERY WORKERS   |
                                                            |  - Notifications  |
                                                            |  - Report Gen     |
                                                            |  - AI Analytics   |
                                                            +-------------------+
```

---

## 3. Backend Architectural Patterns

### 3.1 Clean Architecture Division of Responsibilities

The Django backend strictly segregates concerns into predictable layers:

1. **Presentation Layer (`views.py`, `serializers.py`)**:
   - `serializers.py`: Dedicated to input validation (deserialization) and response shaping (serialization). Does not execute complex business logic.
   - `views.py`: Thin controllers that handle HTTP verb routing, extract tenant context, verify permissions, delegate execution to **Services** or **Selectors**, and return standardized HTTP status codes.

2. **Command / Mutation Layer (`services.py`)**:
   - Contains all domain write logic (Create, Update, Delete, Transition).
   - Wrapped inside `django.db.transaction.atomic()` where multi-table operations are executed.
   - Publishes domain signals or enqueues asynchronous Celery tasks.

3. **Query / Retrieval Layer (`selectors.py`)**:
   - Encapsulates complex filtering, aggregations, and optimizations (`select_related`, `prefetch_related`).
   - Guarantees multi-tenant scoping (`organization_id` filter applied at query definition).

4. **Domain / Data Layer (`models.py`, `managers.py`)**:
   - Extends `TenantAwareModel` or `TimeStampedModel`.
   - Custom `TenantManager` and `TenantQuerySet` for automatic tenant isolation.

---

## 4. Multi-Tenancy Architecture

### 4.1 Tenancy Isolation Model: Shared Database, Row-Level Isolation
SMANV EduERP implements **Shared Database, Multi-Tenant Row Isolation**:
- Each tenant is represented as an `Organization` with a unique UUID `id`, `slug`, and `code`.
- All tenant-owned tables inherit from `TenantAwareModel`, enforcing a non-nullable foreign key to `organizations.Organization`:
  ```python
  class TenantAwareModel(TimeStampedModel):
      organization = models.ForeignKey(
          'organizations.Organization',
          on_delete=models.CASCADE,
          related_name="%(app_label)s_%(class)s_set",
          db_index=True
      )
      class Meta:
          abstract = True
  ```
- Custom QuerySet methods ensure that queries automatically filter by `organization_id=request.user.organization_id`.
- The `TenantContextMiddleware` and `IsTenantMember` permission enforce that no user can access data outside their active tenant.

---

## 5. Frontend Architectural Patterns

### 5.1 Route Group Organization (Expo Router)
The mobile frontend leverages Expo Router's parenthesis notation for transparent route grouping:
- `(auth)`: Login, Registration, Forgot Password, Reset Password, OTP Verification.
- `(dashboard)`: Executive and role-tailored landing screens with metric widgets.
- `(organization)`: Tenant details, branch management, academic year selection.
- `(student)`: Student directory, profiles, enrollment forms, academic histories.
- `(staff)`: Teacher & staff profiles, departmental allocations.
- `(finance)`: Fee collections, invoice records, payment processing.
- `(profile)`: User profile, notification preferences, security settings.

Because route groups in parentheses are omitted from the URL path, deep links and programmatic navigation remain clean and uncoupled:
```typescript
router.push('/login');        // resolves to app/(auth)/login.tsx
router.push('/students');     // resolves to app/(student)/index.tsx
router.push('/finance/fees'); // resolves to app/(finance)/fees.tsx
```

### 5.2 State Management & Network Layer
- **Global Auth State**: Zustand store (`useAuthStore`) integrated with `expo-secure-store` for hardware-backed token encryption.
- **API Client**: Axios instance configured with request interceptors that inject the active `Authorization: Bearer <token>` and response interceptors that handle automatic 401 token refreshing.
