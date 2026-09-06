# SMANV EduERP - Database Schema Design & Multi-Tenant Data Architecture

## 1. Multi-Tenant Relational Design Overview

SMANV EduERP operates on a **Shared Database, Row-Level Isolation** architecture hosted on PostgreSQL 16+. Every tenant is modeled as an `Organization`, and every entity belonging to an institution maintains a direct foreign key to `organizations.Organization`.

```
               +-----------------------------+
               |  organizations.Organization |
               |-----------------------------|
               | PK  id (UUID)               |
               |     name (VARCHAR)          |
               |     slug (VARCHAR, UNIQUE)  |
               |     code (VARCHAR, UNIQUE)  |
               |     plan (VARCHAR)          |
               |     is_active (BOOLEAN)     |
               +--------------+--------------+
                              |
       +----------------------+----------------------+
       | 1:N                                         | 1:N
       v                                             v
+------------------------+             +-------------------------------+
|     accounts.User      |             |       TenantAwareModel        |
|------------------------|             |-------------------------------|
| PK  id (UUID)          |             | FK  organization_id (UUID)   |
| FK  organization_id    |             |     created_at (TIMESTAMP)    |
|     email (VARCHAR)    |             |     updated_at (TIMESTAMP)    |
|     role (VARCHAR)     |             +---------------+---------------+
|     is_active (BOOLEAN)|                             |
+------------------------+                             | Inherited by all
                                                       | domain tables:
                               +-----------------------+-----------------------+
                               |           |           |           |           |
                               v           v           v           v           v
                          [Students]   [Staff]   [Academics]   [Finance]   [Attendance]
```

---

## 2. Core Entities & Table Specifications

### 2.1 `organizations.Organization`
Stores tenant institutional records.
- `id` (UUID, Primary Key, default `uuid.uuid4`)
- `name` (VARCHAR 255, NOT NULL)
- `slug` (SLUG, UNIQUE, db_index=True)
- `code` (VARCHAR 50, UNIQUE)
- `plan` (VARCHAR 20, default `'trial'`)
- `is_active` (BOOLEAN, default `True`)
- `max_students` (INTEGER, default 500)
- `max_storage_mb` (INTEGER, default 5120)
- `settings` (JSONField, default `{}`)
- `created_at`, `updated_at` (TIMESTAMP)

### 2.2 `accounts.User`
Multi-tenant user identity model extending Django's `AbstractBaseUser` and `PermissionsMixin`.
- `id` (UUID, Primary Key)
- `organization_id` (UUID, Foreign Key to `organizations.Organization`, NULL for Super Admins)
- `email` (EMAIL, UNIQUE, db_index=True)
- `phone_number` (VARCHAR 20, nullable, db_index=True)
- `first_name`, `last_name` (VARCHAR 150)
- `role` (VARCHAR 20, Choice: `super_admin`, `org_admin`, `principal`, `teacher`, `accountant`, `student`, `parent`, `staff`)
- `is_active` (BOOLEAN, default `True`)
- `is_verified` (BOOLEAN, default `False`)
- `is_staff` (BOOLEAN, default `False`)
- `last_login_ip` (GENERIC IP ADDRESS, nullable)
- `created_at`, `updated_at` (TIMESTAMP)

### 2.3 `students.StudentProfile` & `Guardian`
- **StudentProfile**:
  - `id` (UUID, Primary Key)
  - `organization_id` (UUID, FK $\to$ Organization)
  - `user_id` (UUID, OneToOne to `accounts.User`, nullable)
  - `admission_number` (VARCHAR 50, db_index=True)
  - `first_name`, `last_name` (VARCHAR 100)
  - `date_of_birth` (DATE)
  - `gender` (VARCHAR 10)
  - `current_class_id` (UUID, FK $\to$ `academics.AcademicClass`)
  - `section_id` (UUID, FK $\to$ `academics.Section`)
  - `status` (VARCHAR 20, default `'active'`)
  - *Unique Constraint*: `('organization_id', 'admission_number')`
- **Guardian**:
  - `id` (UUID, Primary Key)
  - `organization_id` (UUID, FK $\to$ Organization)
  - `student_id` (UUID, FK $\to$ StudentProfile)
  - `relationship` (VARCHAR 30: `'father'`, `'mother'`, `'legal_guardian'`)
  - `phone`, `email`, `occupation` (VARCHAR)

### 2.4 `staff.StaffProfile` & `Department`
- **Department**:
  - `id` (UUID, Primary Key)
  - `organization_id` (UUID, FK $\to$ Organization)
  - `name`, `code` (VARCHAR)
- **StaffProfile**:
  - `id` (UUID, Primary Key)
  - `organization_id` (UUID, FK $\to$ Organization)
  - `user_id` (UUID, OneToOne to `accounts.User`)
  - `employee_id` (VARCHAR 50, db_index=True)
  - `department_id` (UUID, FK $\to$ Department)
  - `designation` (VARCHAR 100)
  - `joining_date` (DATE)
  - `status` (VARCHAR 20, default `'active'`)

### 2.5 `attendance.AttendanceRecord`
- `id` (UUID, Primary Key)
- `organization_id` (UUID, FK $\to$ Organization)
- `student_id` (UUID, FK $\to$ StudentProfile)
- `date` (DATE, db_index=True)
- `status` (VARCHAR 10: `'present'`, `'absent'`, `'late'`, `'excused'`)
- `remarks` (TEXT, nullable)
- *Unique Constraint*: `('organization_id', 'student_id', 'date')`

### 2.6 `academics.AcademicClass`, `Section`, `Subject`
- **AcademicClass**: `name`, `grade_level`, `academic_year`
- **Section**: `name`, `class_id` (FK), `room_number`
- **Subject**: `name`, `code`, `class_id` (FK), `credits`

### 2.7 `examinations.Exam` & `ExamResult`
- **Exam**: `title`, `exam_type` (`midterm`, `final`, `unit_test`), `start_date`, `end_date`
- **ExamResult**: `exam_id` (FK), `student_id` (FK), `subject_id` (FK), `marks_obtained`, `max_marks`, `grade`

### 2.8 `finance.FeeStructure`, `Invoice`, `Payment`
- **FeeStructure**: `name`, `class_id` (FK), `amount`, `frequency`
- **Invoice**: `invoice_number`, `student_id` (FK), `total_amount`, `due_date`, `status` (`paid`, `unpaid`, `partial`, `overdue`)
- **Payment**: `invoice_id` (FK), `amount_paid`, `payment_method`, `transaction_reference`, `paid_at`

---

## 3. Database Indexes & Performance Optimization

1. **Compound Multi-Tenant Indexes**:
   - Every lookup query combines `organization_id` with entity identifiers:
     - `CREATE INDEX idx_student_org_adm ON students (organization_id, admission_number);`
     - `CREATE INDEX idx_att_org_date ON attendance (organization_id, date);`
     - `CREATE INDEX idx_inv_org_status ON invoices (organization_id, status);`
2. **Soft Deletes**:
   - Financial and academic records use `deleted_at` timestamp rather than hard physical deletions to ensure audit compliance.
