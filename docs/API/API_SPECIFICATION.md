# SMANV EduERP - REST API Specification

## 1. Protocol & Standard Conventions

- **Base URL**: `https://api.smanv-eduerp.com/api/v1/` (Production) | `http://localhost:8000/api/v1/` (Local Development)
- **Authentication**: HTTP Header `Authorization: Bearer <access_jwt_token>`
- **Content Type**: `application/json` (unless uploading multipart media files)
- **OpenAPI / Swagger Explorer**: Available in development at `/api/v1/docs/` (Swagger UI) and `/api/v1/redoc/` (ReDoc). Raw schema at `/api/v1/schema/`.

---

## 2. Standard Envelopes & Response Codes

### 2.1 Success Response Envelope
```json
{
  "status": "success",
  "data": { ... },
  "message": "Optional human-readable confirmation message"
}
```

### 2.2 Paginated Response Envelope
```json
{
  "count": 1420,
  "next": "https://api.smanv-eduerp.com/api/v1/students/?page=3",
  "previous": "https://api.smanv-eduerp.com/api/v1/students/?page=1",
  "results": [ ... ]
}
```

### 2.3 Error Envelope
```json
{
  "status": "error",
  "code": "VALIDATION_FAILED",
  "message": "Invalid credentials provided.",
  "errors": {
    "email": ["Enter a valid email address."]
  }
}
```

---

## 3. Authentication & User Management Endpoints (`/api/v1/auth/`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/auth/register/` | Register new user account | No |
| `POST` | `/api/v1/auth/login/` | Authenticate user & receive JWT pair | No |
| `POST` | `/api/v1/auth/refresh/` | Refresh expired access token | No |
| `POST` | `/api/v1/auth/logout/` | Invalidate / blacklist refresh token | Yes |
| `GET` | `/api/v1/auth/me/` | Fetch authenticated user profile | Yes |
| `PATCH` | `/api/v1/auth/me/` | Update user profile details | Yes |
| `POST` | `/api/v1/auth/verify-otp/` | Verify 6-digit one-time password | No |
| `POST` | `/api/v1/auth/resend-otp/` | Resend verification OTP to email/phone | No |
| `POST` | `/api/v1/auth/forgot-password/` | Trigger password reset email with token | No |
| `POST` | `/api/v1/auth/reset-password/` | Set new password using reset token | No |
| `POST` | `/api/v1/auth/change-password/` | Change password for logged-in user | Yes |

---

## 4. Organization & Tenant Management (`/api/v1/organizations/`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/organizations/` | List institutions accessible by current user | Yes |
| `POST` | `/api/v1/organizations/` | Create a new educational institution | Yes (Super Admin) |
| `GET` | `/api/v1/organizations/{id}/` | Retrieve institution profile and settings | Yes |
| `PATCH` | `/api/v1/organizations/{id}/` | Update institution configuration/branding | Yes (Admin) |
| `POST` | `/api/v1/organizations/switch-tenant/` | Switch active tenant context in session | Yes |

---

## 5. Core ERP Domain Endpoints

### 5.1 Students & Guardians (`/api/v1/students/`)
- `GET /api/v1/students/` - Filter and search student records by class, section, enrollment status.
- `POST /api/v1/students/` - Register a new student record.
- `GET /api/v1/students/{id}/` - Retrieve full student profile including guardian details.
- `PATCH /api/v1/students/{id}/` - Update student profile.
- `GET /api/v1/students/{id}/guardians/` - List linked guardians / parents.

### 5.2 Staff & HR (`/api/v1/staff/`)
- `GET /api/v1/staff/` - List faculty and administrative staff.
- `POST /api/v1/staff/` - Onboard new staff profile.
- `GET /api/v1/staff/departments/` - List academic and operational departments.

### 5.3 Attendance (`/api/v1/attendance/`)
- `GET /api/v1/attendance/records/` - Query attendance history with date/student filters.
- `POST /api/v1/attendance/records/` - Submit single attendance entry.
- `POST /api/v1/attendance/mark-bulk/` - Batch submit class-wide attendance in a single transaction.

### 5.4 Academics (`/api/v1/academics/`)
- `GET /api/v1/academics/courses/` - List academic courses/degrees.
- `GET /api/v1/academics/classes/` - List classes/standards.
- `GET /api/v1/academics/sections/` - List sections associated with a class.
- `GET /api/v1/academics/subjects/` - List subjects taught in the institution.

### 5.5 Examinations & Results (`/api/v1/examinations/`)
- `GET /api/v1/examinations/exams/` - List upcoming and concluded examinations.
- `POST /api/v1/examinations/exams/` - Schedule new examination cycle.
- `GET /api/v1/examinations/results/` - Fetch examination score cards.
- `POST /api/v1/examinations/results/` - Upload student marks and grades.

### 5.6 Finance & Fees (`/api/v1/finance/`)
- `GET /api/v1/finance/fee-structures/` - View defined tuition/transport fee structures.
- `GET /api/v1/finance/invoices/` - List student fee invoices and payment statuses.
- `POST /api/v1/finance/payments/` - Record incoming fee payment transactions.

---

## 6. AI Insights & Reporting

### 6.1 AI & Predictive Analytics (`/api/v1/ai/`)
- `GET /api/v1/ai/dropout-risk/` - Return student dropout risk scores computed by predictive models.
- `GET /api/v1/ai/attendance-predictions/` - Predict attendance trends and identify chronic absenteeism.
- `GET /api/v1/ai/performance-insights/` - AI-assisted learning curve and examination grade projections.

### 6.2 Reports & Exports (`/api/v1/reports/`)
- `GET /api/v1/reports/executive-summary/` - High-level operational metrics for leadership.
- `POST /api/v1/reports/export/pdf/` - Queue asynchronous PDF generation.
- `POST /api/v1/reports/export/excel/` - Queue asynchronous Excel report export.
