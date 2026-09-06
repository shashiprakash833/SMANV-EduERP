# SMANV EduERP - Functional Requirements Specification (FRS)

## 1. Overview & Traceability Matrix

This Functional Requirements Specification defines the discrete functional behavior of the SMANV EduERP platform across its modular monolithic domain services.

| Module | Requirement Code | Feature Name | Priority |
|---|---|---|---|
| Accounts | FRS-01 | Identity, Authentication & RBAC | Critical |
| Organizations | FRS-02 | Multi-Tenant Organization Lifecycle | Critical |
| Students | FRS-03 | Student Information System (SIS) | High |
| Staff | FRS-04 | Faculty & Staff Management | High |
| Attendance | FRS-05 | Attendance Capture & Absence Alerting | Critical |
| Academics | FRS-06 | Courses, Classes & Curriculum Structure | High |
| Examinations | FRS-07 | Exam Scheduling & Grade Book | High |
| Finance | FRS-08 | Fee Billing, Invoices & Payments | Critical |
| Notifications | FRS-09 | Multi-Channel Dispatch Engine | Medium |
| AI Analytics | FRS-10 | Predictive Dropout & Trend Models | Medium |
| Reports | FRS-11 | Executive KPIs & Export Generation | High |

---

## 2. Module Specifications

### 2.1 FRS-01: Identity, Authentication & RBAC
- **Description**: Secure registration, login, JWT token rotation, and fine-grained permissions.
- **Inputs**: User email, password, phone number, multi-factor OTP.
- **Outputs**: Access token (15 min validity), Refresh token (7 days), user profile payload.
- **Preconditions**: User account must be active (`is_active=True`).
- **Postconditions**: User is issued a signed cryptographic JWT with tenant and role claims.
- **Business Rules**:
  - Failed login attempts exceeding 5 consecutive tries will trigger a 15-minute temporary lockout.
  - Passwords must be at least 8 characters and contain at least one uppercase letter, one numeral, and one special character.

### 2.2 FRS-02: Multi-Tenant Organization Lifecycle
- **Description**: Creation and management of institutional tenants with custom branding and quota constraints.
- **Inputs**: Institution name, unique code, sub-domain slug, contact email, subscription plan.
- **Outputs**: Created tenant record, tenant admin user account, default academic year.
- **Business Rules**:
  - Tenant `slug` and `code` must be globally unique across the platform.
  - A user belonging to multiple institutions can switch active context via `/switch-tenant/` without re-authenticating.

### 2.3 FRS-03: Student Information System (SIS)
- **Description**: End-to-end student lifecycle management from enrollment to alumni status.
- **Inputs**: Full name, admission number, DOB, gender, guardian contact, assigned class & section.
- **Outputs**: Unique Student UUID and profile record.
- **Business Rules**:
  - The combination of `(organization_id, admission_number)` must be strictly unique.
  - Deleting a student marks the profile as archived (`status='archived'`) to preserve historic financial audits.

### 2.4 FRS-04: Faculty & Staff Management
- **Description**: Tracking employee details, qualifications, departmental affiliations, and teaching assignments.
- **Inputs**: Employee ID, department ID, designation, joining date, contact information.
- **Outputs**: Staff profile record linked to user authentication entity.

### 2.5 FRS-05: Attendance Capture & Absence Alerting
- **Description**: Daily period-wise or session-wise student attendance registration.
- **Inputs**: Academic class ID, section ID, date, map of `{ student_id: status }`.
- **Outputs**: Batch attendance records saved in an atomic transaction; Celery notification tasks dispatched.
- **Business Rules**:
  - Attendance can only be recorded once per day per student unless marked as multi-period.
  - Any student marked `absent` or `unexcused` triggers an automatic notification alert to the primary guardian.

### 2.6 FRS-06: Courses, Classes & Curriculum Structure
- **Description**: Hierarchical setup of academic programs, grade levels, sections, and subjects.
- **Hierarchy**: `Organization` $\to$ `Course/Degree` $\to$ `Class/Standard` $\to$ `Section` $\to$ `Subject`.

### 2.7 FRS-07: Exam Scheduling & Grade Book
- **Description**: Examination definition, schedule publication, mark entry, and GPA/grade calculation.
- **Inputs**: Exam title, date range, subject-wise maximum marks, student marks obtained.
- **Outputs**: Tabulated mark sheets and performance report cards.

### 2.8 FRS-08: Fee Billing, Invoices & Payments
- **Description**: Complete fee ledger management, automated invoice generation, and payment reconciliation.
- **Inputs**: Fee structure ID, student ID, invoice line items, payment amount, payment gateway reference.
- **Outputs**: Digitally signed receipt, updated invoice payment status (`unpaid`, `partial`, `paid`).
- **Business Rules**:
  - Invoices cannot be modified once payment has been registered against them.
  - Overdue invoices automatically compute late penalty fees if enabled in institutional settings.

### 2.9 FRS-09: Multi-Channel Notifications
- **Description**: Dispatching in-app notifications, push notifications (Expo Push API), SMS, and transactional emails.
- **Processing**: All notifications are queued asynchronously through Celery and stored in the database for the user's notification feed.

### 2.10 FRS-10: AI-Powered Predictive Analytics
- **Description**: Computational models evaluating academic trends, attendance drop-offs, and early warning signs.
- **Outputs**: Risk score (0.0 to 1.0) and categorized recommendations for academic intervention.

### 2.11 FRS-11: Executive Dashboard & Compliance Reporting
- **Description**: Aggregated visual metrics for principals and administrators, including attendance averages, fee collection percentages, and enrollment statistics.
- **Exports**: Asynchronous generation of compliance reports in PDF and Excel formats.
