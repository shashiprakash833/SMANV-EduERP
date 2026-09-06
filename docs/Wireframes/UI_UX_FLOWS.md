# SMANV EduERP - Mobile UI/UX Navigation Flows & Wireframe Architecture

## 1. Information Architecture & Navigation Hierarchy

SMANV EduERP is designed for rapid touch interaction on Android and iOS devices using React Native and Expo Router. The navigation architecture separates the user journey into logical, parenthesized route groups.

```
                                [App Root (_layout.tsx)]
                                           |
                   +-----------------------+-----------------------+
                   | (Unauthenticated)                             | (Authenticated)
                   v                                               v
            [(auth) Group]                                  [Root Drawer / Tabs]
            ├── login.tsx                                          |
            ├── register.tsx               +-----------------------+-----------------------+
            ├── forgot-password.tsx        |                       |                       |
            ├── reset-password.tsx         v                       v                       v
            └── verify-otp.tsx       [(dashboard)]          [(organization)]          [(profile)]
                                     ├── index.tsx          ├── index.tsx             └── index.tsx
                                     │                      └── switch.tsx
                                     +---------------------------------------------+
                                     | Feature Sub-Routes                          |
                                     v                                             v
                              [(student)]            [(staff)]             [(finance)]
                              ├── index.tsx          ├── index.tsx         ├── index.tsx
                              ├── [id].tsx           ├── [id].tsx          └── fees.tsx
                              └── add.tsx            └── add.tsx
```

---

## 2. Route Groups & Screen Directory

| Route Group | Screen Path | Screen Title | Primary Purpose |
|---|---|---|---|
| `(auth)` | `/login` | Sign In | Email/password credential entry with tenant identification |
| `(auth)` | `/register` | Institutional Sign Up | Register new institution and administrator profile |
| `(auth)` | `/forgot-password`| Forgot Password | Dispatch recovery link/OTP |
| `(auth)` | `/reset-password` | Set Password | Confirm password change with cryptographic token |
| `(auth)` | `/verify-otp` | OTP Verification | 6-digit numeric input with countdown timer |
| `(dashboard)` | `/` | Executive Dashboard | KPI metrics, quick actions, attendance summary, notifications |
| `(organization)`| `/organization` | Institution Settings| View tenant branding, academic years, and branches |
| `(student)` | `/students` | Student Directory | Searchable, filterable student list by grade and section |
| `(student)` | `/students/[id]` | Student 360 Profile | Complete student dossier (attendance %, grades, fees, guardian) |
| `(student)` | `/students/add` | New Student Enrollment | Multi-step enrollment wizard |
| `(staff)` | `/staff` | Faculty Directory | Staff listings categorized by department |
| `(staff)` | `/staff/[id]` | Staff Profile | Academic schedules, assigned classes, contact records |
| `(finance)` | `/finance` | Financial Overview | Fee collection dials, overdue invoice alerts |
| `(finance)` | `/finance/fees` | Fee Collection Desk | Search student, select invoice, record cash/digital payment |
| `(profile)` | `/profile` | User Profile | Personal settings, language selection, dark mode, sign out |

---

## 3. Core User Journey Flows

### 3.1 Flow A: Authentication & Role-Based Landing
```
[User Launches App]
        |
        v
[useProtectedRoute Hook]
        |
        +---> [No Token / Token Expired] ----> Redirect to `/(auth)/login`
        |                                             |
        |                                             v
        |                                      [Submit Credentials]
        |                                             |
        |                                             v
        |                                      [Store JWT in SecureStore]
        |                                             |
        +---> [Active Token Present] <----------------+
                    |
                    v
          [Fetch User & Active Tenant Profile]
                    |
                    +---> If multiple orgs: Prompt Tenant Selector `/(organization)/switch`
                    +---> Else: Navigate directly to Role Dashboard `/(dashboard)`
```

### 3.2 Flow B: Daily Attendance Marking
```
[Teacher Dashboard]
        |
        v
[Tap "Mark Attendance" Quick Action]
        |
        v
[Select Class & Section Dropdown (e.g. Grade 10 - Section A)]
        |
        v
[Renders Student List with Default 'Present' Toggles]
        |
        v
[Teacher Taps Any Absent / Late Students (One-touch toggle)]
        |
        v
[Tap "Submit Class Attendance"]
        |
        v
[Optimistic UI Update + POST /api/v1/attendance/mark-bulk/]
        |
        v
[Automated SMS/Push Notification queued via Celery to parents of absent students]
```

---

## 4. Design System Tokens

- **Color Palette**:
  - Primary: `#2563EB` (Royal Blue)
  - Primary Dark: `#1D4ED8`
  - Secondary Accent: `#0D9488` (Teal)
  - Warning / Alert: `#F59E0B` (Amber)
  - Error / Overdue: `#EF4444` (Crimson)
  - Surface Background: `#F8FAFC` (Light Mode) / `#0F172A` (Dark Mode)
  - Card Background: `#FFFFFF` / `#1E293B`
- **Typography**: System font family (Inter / Roboto / SF Pro)
  - Display: 28px Bold
  - Header 1: 22px SemiBold
  - Body: 15px Regular
  - Caption: 12px Medium
- **Elevation / Shadows**:
  - Card Shadow: `0px 2px 8px rgba(0, 0, 0, 0.06)`
  - Modal Elevation: `0px 10px 24px rgba(0, 0, 0, 0.12)`
