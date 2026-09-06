# SMANV EduERP - Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for the **SMANV EduERP** platform, an enterprise multi-tenant Educational Resource Planning SaaS system created by **SMANV Info Tech Private Limited**.

### 1.2 Scope
SMANV EduERP delivers integrated administrative, academic, fee collection, staff management, and AI-driven predictive capabilities for multi-campus K-12 schools, higher education colleges, and educational trusts.

### 1.3 Definitions and Acronyms
- **ERP**: Enterprise Resource Planning
- **RBAC**: Role-Based Access Control
- **RLS**: Row-Level Security
- **JWT**: JSON Web Token
- **SIS**: Student Information System
- **Tenant**: An independent school or college organization utilizing the software.

---

## 2. Overall Description

### 2.1 Product Perspective
SMANV EduERP operates as a cloud-native SaaS application. It consists of a React Native mobile client for administrators, teachers, and parents, and a Python/Django REST Framework backend hosted on distributed infrastructure backed by PostgreSQL, Redis, and Celery.

### 2.2 User Classes and Personas
1. **Super Administrator**: Platform maintainers who oversee tenant onboarding, subscription tiers, and system health.
2. **Organization Administrator**: Institutional IT heads who manage school configuration, user provisioning, and role assignment.
3. **Principal / Dean**: Academic leaders who review campus-wide KPIs, pass rates, attendance metrics, and AI dropout risk predictions.
4. **Teacher / Faculty**: Instructors who manage class attendance, grade book entries, syllabus tracking, and student behavioral notes.
5. **Accountant / Cashier**: Financial officers responsible for fee structures, discount waivers, invoice generation, and fee collection.
6. **Parent / Guardian**: Family members monitoring student attendance, fee receipts, exam report cards, and school announcements.
7. **Student**: Learners accessing course schedules, homework assignments, and examination scores.

---

## 3. Specific System Requirements

### 3.1 External Interface Requirements
- **User Interface**: Intuitive touch UI complying with Apple Human Interface Guidelines and Google Material 3 standards.
- **Hardware Interfaces**: Mobile camera access for QR code scanning (attendance & fee verification) and student photo capture.
- **Software Interfaces**:
  - PostgreSQL 16+ via psycopg3.
  - Redis 7+ for caching, Celery task queue, and WebSocket channel layers.
  - Third-party SMS gateways (Twilio, Gupshup) and Payment Gateways (Razorpay, Stripe) via webhooks.

### 3.2 System Features & Capabilities
1. **Multi-Tenancy & Data Isolation**:
   - Strict row-level isolation guarantees that no query executed by tenant $A$ can return records from tenant $B$.
   - Ability for administrative users associated with multi-branch schools to switch active institutional context smoothly.
2. **Attendance Management**:
   - Real-time single and batch attendance marking.
   - Automatic triggers that dispatch SMS/Push alerts to parents upon recording unexcused absences.
3. **Finance & Invoicing Engine**:
   - Customizable fee templates (tuition, transport, laboratory, library).
   - Automated monthly and term-based invoice generation.
   - Partial payment handling, late fee calculations, and digital receipt generation.
4. **Predictive Analytics & AI**:
   - Automated identification of students exhibiting attendance decline or grade attrition.
   - Risk classification (Low, Medium, High) to enable early pastoral intervention.

---

## 4. Non-Functional Requirements (NFRs)

### 4.1 Performance Requirements
- **API Response Latency**: 95% of read requests must respond within 150ms under nominal load; complex analytical queries within 500ms.
- **Mobile Rendering**: 60 frames-per-second list virtualization using React Native FlashList or optimized FlatLists.
- **Asynchronous Processing**: Heavy computations (bulk PDF generation, bulk attendance dispatch) must be offloaded to Celery workers.

### 4.2 Security Requirements
- **Authentication**: JWT tokens signed with HMAC-SHA256 or RSA-256; short-lived access tokens (15 minutes) and long-lived refresh tokens (7 days).
- **Password Storage**: Passwords hashed using Argon2 or PBKDF2 with a minimum of 600,000 iterations.
- **Data in Transit**: Mandatory TLS 1.3 encryption across all public network endpoints.
- **Data at Rest**: Database volumes encrypted with AES-256.

### 4.3 Reliability & Availability
- **System Availability**: Minimum 99.9% uptime target during academic calendar operational hours.
- **Backup & Disaster Recovery**: Automated point-in-time PostgreSQL backups every 24 hours with geo-redundant replication.
