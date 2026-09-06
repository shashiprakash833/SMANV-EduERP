# SMANV EduERP - Frontend Application

A production-ready, multi-tenant Educational Enterprise Resource Planning (ERP) mobile application for Schools and Colleges, developed by **SMANV Info Tech Private Limited**.

Built with **Expo SDK 57**, **React Native 0.86**, **React 19**, **TypeScript**, and **React Native Paper**.

---

## Directory Structure

```text
frontend/
├── app/                      # File-based routing via Expo Router
│   ├── (auth)/               # Authentication & registration routes
│   │   ├── login.tsx
│   │   ├── register-org.tsx
│   │   ├── forgot-password.tsx
│   │   └── welcome.tsx
│   ├── (dashboard)/          # Main dashboard & analytics
│   │   ├── (tabs)/           # Role-based bottom navigation tabs
│   │   ├── reports.tsx
│   │   └── ai-assistant.tsx
│   ├── (organization)/       # Organization settings & about
│   │   ├── settings.tsx
│   │   ├── about.tsx
│   │   └── help.tsx
│   ├── (student)/            # Student portal & admissions
│   │   ├── students.tsx
│   │   ├── admissions.tsx
│   │   ├── examinations.tsx
│   │   └── assignments.tsx
│   ├── (staff)/              # Staff portal & attendance tracking
│   │   ├── staff.tsx
│   │   └── attendance.tsx
│   ├── (finance)/            # Fee collection & payment tracking
│   │   └── fees.tsx
│   ├── (profile)/            # User profile management
│   │   └── index.tsx
│   ├── _layout.tsx           # Global providers & stack navigation
│   └── index.tsx             # Splash screen & initial auth redirect
├── assets/                   # App icons, splash images, branding
├── components/               # Reusable enterprise UI components
├── features/                 # Modular domain-driven feature interfaces
├── services/                 # Hardware SecureStore & offline sync queue
├── api/                      # Axios client & DRF endpoints
├── hooks/                    # Custom React hooks (protected routes, etc.)
├── store/                    # State management contexts (Auth, Theme, etc.)
├── theme/                    # Design tokens & color palettes
├── constants/                # Layout dimensions, brand strings, demo data
├── types/                    # Enterprise TypeScript interfaces
├── utils/                    # Shared formatters & helpers
├── app.json                  # Expo project manifest
└── package.json              # Dependencies and scripts
```

---

## Getting Started

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Ensure `.env` exists in `frontend/`:
```ini
EXPO_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

### 3. Start Development Server

```bash
npx expo start
```

Press:
- `a` to open in Android Emulator
- `i` to open in iOS Simulator
- `w` to open in Web Browser
- Scan QR code in Expo Go for physical devices
