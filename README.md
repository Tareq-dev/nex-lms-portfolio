# NEX-LMS — Full-Stack Learning Management System

![Next.js](https://img.shields.io/badge/Next.js-14+-000000?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![Vitest](https://img.shields.io/badge/Tested_with-Vitest-6E9F18?logo=vitest)

NEX-LMS is a modular full-stack Learning Management System built with **Next.js, TypeScript, Express, Prisma, and PostgreSQL**.

It provides secure authentication, role-based dashboards, course and curriculum management, enrollment, protected video access, and a complete mock purchase workflow.

**Live Frontend Demo:** [https://nex-lms.vercel.app](https://nex-lms.vercel.app)

---

## Key Features

### Authentication and Security

- User registration and login
- JWT access and refresh tokens
- Secure HttpOnly cookie authentication
- Refresh-token rotation and logout
- Forgot, reset and change password
- Argon2 password hashing
- Suspended-user login blocking
- Protected routes and role authorization
- Environment-variable validation
- Centralized error handling
- Reusable Zod validation middleware

### Role-Based Access Control

Supported roles:

```text
STUDENT
INSTRUCTOR
ADMIN
SUPER_ADMIN
```

- Students access enrolled courses and protected lessons
- Instructors can be assigned to courses
- Admins manage users, categories, courses, enrollments and purchases
- Super Admins have full administrative access

### User Management

- Get authenticated user profile
- Update own profile
- User listing with pagination
- Search users by name or email
- Filter by role and account status
- Admin-controlled role and status updates

### Category Management

- Create and update categories
- Public active-category listing
- Pagination and search
- Slug-based category URLs
- Soft delete and restore

### Course Management

- Create and update courses
- `DRAFT`, `PUBLISHED` and `ARCHIVED` workflow
- Publish, archive and restore courses
- Category and instructor relations
- Search, pagination, filtering and sorting
- Featured-course and course-level filters
- Secure public and admin course responses

### Curriculum Management

- Course modules and chapters
- Ordered modules and lessons
- Chapter title, description and duration
- Video URL and preview lessons
- Public curriculum response
- Protected playback for locked lessons
- Assigned-instructor course relation

### Enrollment and Course Access

- Free-course self-enrollment
- Admin-created complimentary enrollment
- Enrollment history and status management
- `ACTIVE`, `COMPLETED` and `CANCELLED` statuses
- Enrollment-based video authorization
- Preview lessons without enrollment
- Locked lessons for enrolled students only

### Mock Course Purchase

- Secure backend-controlled course pricing
- Purchase and payment-attempt records
- Mock payment success, failure and cancellation
- Failed-payment retry support
- Automatic enrollment after successful payment
- Duplicate purchase and enrollment protection
- Student purchase history
- Admin purchase monitoring

> Mock payment is available for development and testing only. It is automatically disabled in production.

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| Next.js App Router | Frontend framework |
| TypeScript | Static typing |
| Redux Toolkit | Global state management |
| Tailwind CSS | Responsive styling |
| Lucide React | Icons |
| Protected Routes | Role-based page access |
| Dark/Light Theme | Persistent theme support |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express 5 | REST API framework |
| TypeScript | Type-safe backend |
| PostgreSQL | Relational database |
| Prisma 7 | ORM and migrations |
| Zod | Request and environment validation |
| Argon2 | Password hashing |
| JSON Web Token | Authentication |
| Nodemailer | Password-reset email |
| Vitest | Test runner |
| Supertest | API integration testing |

---

## System Architecture

```mermaid
flowchart LR
    A["Next.js Client"] --> B["Express REST API"]
    B --> C["Authentication & RBAC"]
    B --> D["Business Modules"]
    C --> E["Prisma ORM"]
    D --> E
    E --> F["PostgreSQL"]
```

The backend follows a modular architecture:

```text
Route
→ Validation Middleware
→ Controller
→ Service
→ Prisma
→ PostgreSQL
```

---

## Project Structure

```text
nex-lms/
├── nex-client/                 # Next.js frontend
│   └── src/
│       ├── app/                # App Router pages
│       ├── components/         # Reusable UI components
│       ├── store/              # Redux store and slices
│       └── types/              # TypeScript types
│
└── nex-server/                 # Express backend
    ├── prisma/
    │   ├── schema.prisma       # Database schema
    │   └── migrations/         # Migration history
    │
    ├── src/
    │   ├── common/             # Errors, middleware and responses
    │   ├── config/             # Environment configuration
    │   ├── generated/          # Generated Prisma Client
    │   ├── lib/                # Database connection
    │   ├── modules/
    │   │   ├── auth/
    │   │   ├── user/
    │   │   ├── category/
    │   │   ├── course/
    │   │   ├── curriculum/
    │   │   ├── enrollment/
    │   │   └── purchase/
    │   ├── routes/             # Main API router
    │   ├── utils/              # JWT, password and slug utilities
    │   ├── app.ts              # Express application
    │   └── server.ts           # Server entry point
    │
    └── tests/                  # API integration tests
```

---

## API Overview

Base URL:

```text
http://localhost:5000/api/v1
```

| Module | Example endpoints |
|---|---|
| Authentication | `/auth/register`, `/auth/login`, `/auth/me` |
| Users | `/users`, `/users/me`, `/users/:userId` |
| Categories | `/categories`, `/categories/admin` |
| Courses | `/courses`, `/courses/admin`, `/courses/:courseId` |
| Curriculum | `/courses/:courseId/modules`, `/chapters/:chapterId` |
| Playback | `/chapters/:chapterId/playback` |
| Enrollments | `/courses/:courseId/enroll`, `/enrollments/me` |
| Purchases | `/purchases/checkout`, `/purchases/me` |
| Administration | `/admin/enrollments`, `/admin/purchases` |

Protected frontend requests must include cookies:

```ts
const response = await fetch(
  "http://localhost:5000/api/v1/auth/me",
  {
    method: "GET",
    credentials: "include",
  },
);
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Tareq-dev/nex-lms.git
cd nex-lms
```

### 2. Install Frontend Dependencies

```bash
cd nex-client
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../nex-server
npm install
```

### 4. Configure Environment Variables

Create `.env` inside `nex-server`:

```env
NODE_ENV=development
PORT=5000

DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/nex_lms
SHADOW_DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/nex_lms_shadow

FRONTEND_URL=http://localhost:3000

JWT_ACCESS_SECRET=replace_with_a_long_random_secret
JWT_REFRESH_SECRET=replace_with_another_long_random_secret

SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=NEX-LMS <no-reply@example.com>
```

### 5. Run Database Migrations

```bash
npx prisma@7.10.0 migrate dev
npx prisma@7.10.0 generate
```

### 6. Start the Backend

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

### 7. Start the Frontend

```bash
cd ../nex-client
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

## Testing

The backend includes integration tests for authentication, users, categories, courses, curriculum, enrollments and purchases.

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run TypeScript validation:

```bash
npm run typecheck
```

Run Purchase API tests:

```bash
npm run test:purchase
```

The tests verify:

- Authentication and authorization
- Request validation
- Database operations
- Role-based access restrictions
- Course visibility rules
- Enrollment and playback security
- Payment success, failure and retry
- Automatic enrollment
- Duplicate-operation protection

---


# Private Implementation

The production implementation of authentication sessions, refresh-token
rotation, password reset, payment processing and media authorization is
maintained in the private repository.

The source is available for walkthrough during technical interviews.



## Engineering Highlights

This project demonstrates practical experience with:

- Full-stack TypeScript development
- REST API design
- Relational database modelling
- Prisma relations and migrations
- Authentication and authorization
- Secure cookie-based JWT sessions
- Service-oriented backend architecture
- Transactional purchase processing
- Idempotent payment handling
- API integration testing
- Centralized validation and error handling

---

## Current Development Status

Completed:

- Authentication and user management
- Category and course management
- Instructor assignment
- Modules, chapters and video access
- Enrollment and authorization
- Mock course purchase
- Automated API tests

Planned:

- Real payment-gateway integration
- Signed video streaming
- Student progress tracking
- Assignments
- MCQ exams and results
- Certificates
- Student and Admin analytics dashboards
- Production monitoring and deployment

---


## Portfolio Source Edition

This repository contains selected production-quality source code from NEX-LMS.

Core authentication, payment processing, enrollment authorization,
protected video delivery, production database migrations and deployment
configuration are maintained privately.

The complete production application is available as a live demo, and a
full code walkthrough is available during technical interviews.


## Author

Developed by [Tareq](https://github.com/Tareq-dev)

GitHub: [https://github.com/Tareq-dev](https://github.com/Tareq-dev)