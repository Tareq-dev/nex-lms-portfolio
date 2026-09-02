# NEX-LMS API Reference

## Base URL

```text
http://localhost:5000/api/v1
```

For protected requests:

```ts
credentials: "include";
```

For JSON requests:

```ts
headers: {
  "Content-Type": "application/json",
}
```

> Replace values such as `USER_ID`, `COURSE_ID`, `MODULE_ID`, and `CHAPTER_ID` with actual UUIDs.

---

# Authentication API

## Register

```http
POST /auth/register
```

Access: Public

```json
{
  "name": "Tarequl Islam",
  "email": "Tareq@example.com",
  "password": "Password123!"
}
```

New accounts receive the `STUDENT` role.

## Login

```http
POST /auth/login
```

Access: Public

```json
{
  "email": "Tareq@example.com",
  "password": "Password123!"
}
```

JWT tokens are stored in `HttpOnly` cookies.

## Get Logged-in User

```http
GET /auth/me
```

Access: Authenticated

Body: None

## Refresh Authentication

```http
POST /auth/refresh
```

Access: Refresh cookie required

Body: None

## Logout

```http
POST /auth/logout
```

Body: None

## Forgot Password

```http
POST /auth/forgot-password
```

Access: Public

```json
{
  "email": "Tareq@example.com"
}
```

## Reset Password

```http
POST /auth/reset-password
```

Access: Public

```json
{
  "token": "RESET_TOKEN",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

## Change Password

```http
PATCH /auth/change-password
```

Access: Authenticated

```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

---

# User API

## Update Own Profile

```http
PATCH /users/me
```

Access: Authenticated

```json
{
  "name": "Tarequl Islam",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

Remove avatar:

```json
{
  "avatarUrl": null
}
```

## Get Users

```http
GET /users
```

Access: `ADMIN`, `SUPER_ADMIN`

Query parameters:

```text
page
limit
search
role
status
```

Example:

```http
GET /users?page=1&limit=10&role=INSTRUCTOR&status=ACTIVE
```

## Get User by ID

```http
GET /users/:userId
```

Access: `ADMIN`, `SUPER_ADMIN`

## Update User Role or Status

```http
PATCH /users/:userId
```

Access: `ADMIN`, `SUPER_ADMIN`

```json
{
  "role": "INSTRUCTOR",
  "status": "ACTIVE"
}
```

Available roles:

```text
STUDENT
INSTRUCTOR
ADMIN
SUPER_ADMIN
```

Available statuses:

```text
ACTIVE
INACTIVE
SUSPENDED
```

---

# Category API

## Create Category

```http
POST /categories
```

Access: `ADMIN`, `SUPER_ADMIN`

```json
{
  "name": "Web Development",
  "description": "Frontend and backend development courses."
}
```

## Get Public Categories

```http
GET /categories
```

Access: Public

Only active categories are returned.

Query parameters:

```text
page
limit
search
```

Example:

```http
GET /categories?page=1&limit=10&search=web
```

## Get Admin Categories

```http
GET /categories/admin
```

Access: `ADMIN`, `SUPER_ADMIN`

Query parameters:

```text
page
limit
search
isActive
```

Example:

```http
GET /categories/admin?isActive=false
```

## Get Category by Slug

```http
GET /categories/slug/:slug
```

Access: Public

## Get Category by ID

```http
GET /categories/:categoryId
```

Access: Public

## Update or Restore Category

```http
PATCH /categories/:categoryId
```

Access: `ADMIN`, `SUPER_ADMIN`

```json
{
  "name": "Full Stack Development",
  "slug": "full-stack-development",
  "description": "Complete frontend and backend courses.",
  "isActive": true
}
```

Restore only:

```json
{
  "isActive": true
}
```

Remove description:

```json
{
  "description": null
}
```

## Deactivate Category

```http
DELETE /categories/:categoryId
```

Access: `ADMIN`, `SUPER_ADMIN`

Body: None

This is a soft delete. It sets:

```json
{
  "isActive": false
}
```

---

# Course API

## Create Course

```http
POST /courses
```

Access: `ADMIN`, `SUPER_ADMIN`

Course without curriculum:

```json
{
  "categoryId": "CATEGORY_ID",
  "title": "Modern React Development",
  "shortDescription": "Build modern applications using React.",
  "description": "Learn modern React development from fundamentals through production architecture.",
  "thumbnailUrl": "https://example.com/react.jpg",
  "price": 5000,
  "discountPrice": 3500,
  "level": "BEGINNER",
  "isFeatured": true
}
```

Course with Modules, Chapters and Videos:

```json
{
  "categoryId": "CATEGORY_ID",
  "title": "Modern React Development",
  "shortDescription": "Build modern applications using React.",
  "description": "Learn modern React development from fundamentals through production architecture.",
  "thumbnailUrl": "https://example.com/react.jpg",
  "price": 5000,
  "discountPrice": 3500,
  "level": "BEGINNER",
  "isFeatured": true,
  "modules": [
    {
      "title": "React Fundamentals",
      "description": "Learn the fundamental concepts.",
      "chapters": [
        {
          "title": "Introduction to React",
          "description": "Course introduction.",
          "videoUrl": "https://example.com/videos/react-introduction.mp4",
          "durationSeconds": 765,
          "isPreview": true
        },
        {
          "title": "React Components",
          "videoUrl": "https://example.com/videos/react-components.mp4",
          "durationSeconds": 1450,
          "isPreview": false
        }
      ]
    }
  ]
}
```

New Courses are created with:

```text
status = DRAFT
```

Available levels:

```text
BEGINNER
INTERMEDIATE
ADVANCED
ALL_LEVELS
```

## Get Public Courses

```http
GET /courses
```

Access: Public

Only `PUBLISHED` Courses under active Categories are returned.

Query parameters:

```text
page
limit
search
category
level
isFeatured
minPrice
maxPrice
sort
```

Example:

```http
GET /courses?page=1&limit=10&category=web-development&level=BEGINNER
```

Available sort values:

```text
newest
oldest
price_asc
price_desc
title_asc
```

## Get Public Course by Slug

```http
GET /courses/slug/:slug
```

Access: Public

Example:

```http
GET /courses/slug/modern-react-development
```

## Get Admin Course List

```http
GET /courses/admin
```

Access: `ADMIN`, `SUPER_ADMIN`

Additional query parameters:

```text
status
instructorId
```

Examples:

```http
GET /courses/admin?status=DRAFT
```

```http
GET /courses/admin?instructorId=ACTUAL_INSTRUCTOR_UUID
```

## Get Admin Course by ID

```http
GET /courses/admin/:courseId
```

Access: `ADMIN`, `SUPER_ADMIN`

Returns `DRAFT`, `PUBLISHED`, or `ARCHIVED` Courses.

## Update Course

```http
PATCH /courses/:courseId
```

Access: `ADMIN`, `SUPER_ADMIN`

```json
{
  "categoryId": "CATEGORY_ID",
  "title": "Advanced React Development",
  "slug": "advanced-react-development",
  "shortDescription": "Build advanced React applications.",
  "description": "Learn advanced production React architecture.",
  "thumbnailUrl": "https://example.com/advanced-react.jpg",
  "price": 6000,
  "discountPrice": 4000,
  "level": "ADVANCED",
  "isFeatured": true
}
```

Remove discount:

```json
{
  "discountPrice": null
}
```

Remove thumbnail:

```json
{
  "thumbnailUrl": null
}
```

## Publish Course

```http
POST /courses/:courseId/publish
```

Access: `ADMIN`, `SUPER_ADMIN`

Body: None

```text
DRAFT → PUBLISHED
```

## Archive Course

```http
DELETE /courses/:courseId
```

Access: `ADMIN`, `SUPER_ADMIN`

Body: None

```text
DRAFT/PUBLISHED → ARCHIVED
```

## Restore Course

```http
POST /courses/:courseId/restore
```

Access: `ADMIN`, `SUPER_ADMIN`

Body: None

```text
ARCHIVED → DRAFT
```

---

# Course Instructor API

## Get Active Instructors

```http
GET /users?role=INSTRUCTOR&status=ACTIVE
```

Access: `ADMIN`, `SUPER_ADMIN`

## Assign or Replace Course Instructor

```http
PATCH /courses/:courseId/instructor
```

Access: `ADMIN`, `SUPER_ADMIN`

```json
{
  "instructorId": "ACTUAL_INSTRUCTOR_UUID"
}
```

The selected user must have:

```text
role = INSTRUCTOR
status = ACTIVE
```

## Remove Course Instructor

```http
DELETE /courses/:courseId/instructor
```

Access: `ADMIN`, `SUPER_ADMIN`

Body: None

## Filter Courses by Instructor

```http
GET /courses/admin?instructorId=ACTUAL_INSTRUCTOR_UUID
```

Access: `ADMIN`, `SUPER_ADMIN`

---

# Curriculum API

## Get Public Curriculum

```http
GET /courses/slug/:slug/curriculum
```

Access: Public

- Published Course only.
- Preview Chapters return `videoUrl`.
- Locked Chapters return `videoUrl: null`.

## Get Admin Curriculum

```http
GET /courses/:courseId/curriculum
```

Access: `ADMIN`, `SUPER_ADMIN`

Returns all Modules, Chapters and Video URLs.

---

# Module API

## Create Module

```http
POST /courses/:courseId/modules
```

Access: `ADMIN`, `SUPER_ADMIN`

```json
{
  "title": "React Fundamentals",
  "description": "Learn the fundamental concepts."
}
```

## Update Module

```http
PATCH /modules/:moduleId
```

Access: `ADMIN`, `SUPER_ADMIN`

```json
{
  "title": "Updated Module Title",
  "description": "Updated module description."
}
```

Remove description:

```json
{
  "description": null
}
```

## Delete Module

```http
DELETE /modules/:moduleId
```

Access: `ADMIN`, `SUPER_ADMIN`

Body: None

Deleting a Module also deletes its Chapters.

## Reorder Modules

```http
PATCH /courses/:courseId/modules/reorder
```

Access: `ADMIN`, `SUPER_ADMIN`

Send every Module ID exactly once in the required order:

```json
{
  "moduleIds": ["SECOND_MODULE_ACTUAL_UUID", "FIRST_MODULE_ACTUAL_UUID"]
}
```

---

# Chapter and Video API

## Create Chapter

```http
POST /modules/:moduleId/chapters
```

Access: `ADMIN`, `SUPER_ADMIN`

```json
{
  "title": "Introduction to React",
  "description": "Introduction lesson.",
  "videoUrl": "https://example.com/videos/react-introduction.mp4",
  "durationSeconds": 765,
  "isPreview": true
}
```

## Update Chapter

```http
PATCH /chapters/:chapterId
```

Access: `ADMIN`, `SUPER_ADMIN`

```json
{
  "title": "Updated Chapter Title",
  "description": "Updated lesson description.",
  "videoUrl": "https://example.com/videos/updated-video.mp4",
  "durationSeconds": 900,
  "isPreview": false
}
```

Remove duration:

```json
{
  "durationSeconds": null
}
```

## Delete Chapter

```http
DELETE /chapters/:chapterId
```

Access: `ADMIN`, `SUPER_ADMIN`

Body: None

## Reorder Chapters

```http
PATCH /modules/:moduleId/chapters/reorder
```

Access: `ADMIN`, `SUPER_ADMIN`

Send every Chapter ID exactly once in the required order:

```json
{
  "chapterIds": ["SECOND_CHAPTER_ACTUAL_UUID", "FIRST_CHAPTER_ACTUAL_UUID"]
}
```

---

# Standard Frontend Fetch

## GET Request

```ts
const response = await fetch("http://localhost:5000/api/v1/auth/me", {
  method: "GET",
  credentials: "include",
});

const result = await response.json();
```

## POST/PATCH Request

```ts
const response = await fetch("http://localhost:5000/api/v1/courses", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(input),
});

const result = await response.json();
```

---

# Standard Error Format

```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "Error message.",
  "data": null,
  "errors": [
    {
      "field": "fieldName",
      "message": "Field error message."
    }
  ]
}
```

Common HTTP statuses:

```text
400 Validation or business rule error
401 Authentication required
403 Permission denied
404 Resource not found
409 Duplicate or conflicting resource
500 Internal server error
```

---

# Important Frontend Notes

- Always use `credentials: "include"` for authenticated requests.
- Do not store JWT tokens in Local Storage or Redux.
- `price` and `discountPrice` may be returned as decimal strings.
- Public Course APIs only return `PUBLISHED` Courses.
- Public Category APIs only return active Categories.
- `DELETE /categories/:id` deactivates a Category.
- `DELETE /courses/:id` archives a Course.
- `DELETE /modules/:id` and `DELETE /chapters/:id` permanently delete those records.
- Do not send documentation placeholders such as `COURSE_ID` as actual values.
- Non-preview video URLs are not exposed by the Public Curriculum API.

# Step 6.5 — Enrollment and Protected Playback API

## Base URL

```text
http://localhost:5000/api/v1
```

Protected requests must include the authentication cookie:

```ts
credentials: "include";
```

## API Summary

| Method  | Endpoint                           | Access        | Purpose                   |
| ------- | ---------------------------------- | ------------- | ------------------------- |
| `POST`  | `/courses/:courseId/enroll`        | Student       | Enroll in a free course   |
| `GET`   | `/enrollments/me`                  | Student       | Get own enrollments       |
| `GET`   | `/enrollments/me/:courseId`        | Student       | Check course enrollment   |
| `POST`  | `/admin/enrollments`               | Admin         | Manually enroll a student |
| `GET`   | `/admin/enrollments`               | Admin         | Get all enrollments       |
| `PATCH` | `/admin/enrollments/:enrollmentId` | Admin         | Update enrollment status  |
| `GET`   | `/chapters/:chapterId/playback`    | Authenticated | Get protected video URL   |

> `Admin` means `ADMIN` or `SUPER_ADMIN`.

---

## 1. Enroll in a Free Course

```http
POST /courses/:courseId/enroll
```

**Access:** `STUDENT`  
**Request body:** None

### Example

```http
POST /courses/7d795527-5612-4a45-9292-da2c8b654653/enroll
```

The course must be:

- `PUBLISHED`
- Under an active category
- Free after applying its discount

A course is free when:

```text
discountPrice ?? price = 0
```

### Success — `201 Created`

```json
{
  "success": true,
  "message": "Course enrollment completed successfully.",
  "data": {
    "enrollment": {
      "id": "ENROLLMENT_UUID",
      "status": "ACTIVE",
      "enrolledAt": "2026-09-02T10:00:00.000Z",
      "completedAt": null,
      "course": {
        "id": "COURSE_UUID",
        "title": "Free TypeScript Fundamentals",
        "slug": "free-typescript-fundamentals",
        "price": "0.00",
        "discountPrice": null,
        "status": "PUBLISHED"
      }
    }
  }
}
```

If the student is already enrolled, the existing enrollment is returned with `200 OK`.

### Paid Course Error — `402`

```json
{
  "success": false,
  "code": "PURCHASE_REQUIRED",
  "message": "This is a paid course. Purchase is required before enrollment.",
  "data": null,
  "errors": []
}
```

---

## 2. Get Own Enrollments

```http
GET /enrollments/me
```

**Access:** `STUDENT`

### Query Parameters

| Parameter | Default | Accepted values                    |
| --------- | ------: | ---------------------------------- |
| `page`    |     `1` | Minimum `1`                        |
| `limit`   |    `10` | `1–100`                            |
| `status`  |       — | `ACTIVE`, `COMPLETED`, `CANCELLED` |

### Examples

```http
GET /enrollments/me?page=1&limit=10
```

```http
GET /enrollments/me?status=ACTIVE
```

### Success — `200 OK`

```json
{
  "success": true,
  "message": "Enrollments retrieved successfully.",
  "data": {
    "enrollments": [
      {
        "id": "ENROLLMENT_UUID",
        "status": "ACTIVE",
        "enrolledAt": "2026-09-02T10:00:00.000Z",
        "completedAt": null,
        "course": {
          "id": "COURSE_UUID",
          "title": "Free TypeScript Fundamentals",
          "slug": "free-typescript-fundamentals",
          "thumbnailUrl": "https://example.com/course.jpg",
          "price": "0.00",
          "discountPrice": null,
          "level": "BEGINNER",
          "status": "PUBLISHED",
          "instructor": {
            "id": "INSTRUCTOR_UUID",
            "name": "Course Instructor",
            "avatarUrl": null
          }
        }
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## 3. Check Enrollment for a Course

```http
GET /enrollments/me/:courseId
```

**Access:** `STUDENT`

### Example

```http
GET /enrollments/me/7d795527-5612-4a45-9292-da2c8b654653
```

### Success — `200 OK`

```json
{
  "success": true,
  "message": "Enrollment retrieved successfully.",
  "data": {
    "enrollment": {
      "id": "ENROLLMENT_UUID",
      "status": "ACTIVE",
      "enrolledAt": "2026-09-02T10:00:00.000Z",
      "completedAt": null,
      "course": {
        "id": "COURSE_UUID",
        "title": "Free TypeScript Fundamentals",
        "slug": "free-typescript-fundamentals"
      }
    }
  }
}
```

### Not Enrolled — `404`

```json
{
  "success": false,
  "code": "ENROLLMENT_NOT_FOUND",
  "message": "Enrollment was not found.",
  "data": null,
  "errors": []
}
```

Frontend can use this endpoint to display:

```text
Enroll Now
Continue Course
Course Completed
Access Cancelled
```

---

## 4. Create Manual Enrollment

```http
POST /admin/enrollments
```

**Access:** `ADMIN`, `SUPER_ADMIN`

Admin can provide complimentary access to free or paid courses.

### Request Body

```json
{
  "studentId": "STUDENT_UUID",
  "courseId": "COURSE_UUID"
}
```

The selected user must:

- Exist in the database
- Have the `STUDENT` role
- Have `ACTIVE` status

The course must be published and available.

### Success — `201 Created`

```json
{
  "success": true,
  "message": "Enrollment created successfully.",
  "data": {
    "enrollment": {
      "id": "ENROLLMENT_UUID",
      "status": "ACTIVE",
      "student": {
        "id": "STUDENT_UUID",
        "name": "Jabed Hasan",
        "email": "jabed@example.com",
        "role": "STUDENT",
        "status": "ACTIVE"
      },
      "course": {
        "id": "COURSE_UUID",
        "title": "Modern React Development",
        "slug": "modern-react-development",
        "status": "PUBLISHED"
      }
    }
  }
}
```

---

## 5. Get All Enrollments

```http
GET /admin/enrollments
```

**Access:** `ADMIN`, `SUPER_ADMIN`

### Query Parameters

| Parameter   | Example  | Purpose                     |
| ----------- | -------- | --------------------------- |
| `page`      | `1`      | Current page                |
| `limit`     | `10`     | Results per page            |
| `search`    | `Jabed`  | Search student or course    |
| `status`    | `ACTIVE` | Filter by enrollment status |
| `studentId` | UUID     | Filter by student           |
| `courseId`  | UUID     | Filter by course            |

### Examples

```http
GET /admin/enrollments?page=1&limit=10
```

```http
GET /admin/enrollments?status=ACTIVE
```

```http
GET /admin/enrollments?search=typescript
```

```http
GET /admin/enrollments?studentId=STUDENT_UUID
```

```http
GET /admin/enrollments?courseId=COURSE_UUID
```

```http
GET /admin/enrollments?courseId=COURSE_UUID&status=ACTIVE&page=1&limit=20
```

### Success — `200 OK`

```json
{
  "success": true,
  "message": "Enrollments retrieved successfully.",
  "data": {
    "enrollments": [
      {
        "id": "ENROLLMENT_UUID",
        "status": "ACTIVE",
        "student": {
          "id": "STUDENT_UUID",
          "name": "Jabed Hasan",
          "email": "jabed@example.com"
        },
        "course": {
          "id": "COURSE_UUID",
          "title": "Free TypeScript Fundamentals",
          "slug": "free-typescript-fundamentals"
        }
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## 6. Update Enrollment Status

```http
PATCH /admin/enrollments/:enrollmentId
```

**Access:** `ADMIN`, `SUPER_ADMIN`

### Mark as Completed

```json
{
  "status": "COMPLETED"
}
```

This automatically sets `completedAt`.

### Cancel Access

```json
{
  "status": "CANCELLED"
}
```

A cancelled student cannot access locked chapter videos.

### Reactivate Access

```json
{
  "status": "ACTIVE"
}
```

This clears `completedAt`.

### Success — `200 OK`

```json
{
  "success": true,
  "message": "Enrollment status updated successfully.",
  "data": {
    "enrollment": {
      "id": "ENROLLMENT_UUID",
      "status": "COMPLETED",
      "completedAt": "2026-09-02T12:00:00.000Z"
    }
  }
}
```

---

## 7. Get Protected Chapter Playback

```http
GET /chapters/:chapterId/playback
```

**Access:** Authenticated user  
**Request body:** None

### Example

```http
GET /chapters/CHAPTER_UUID/playback
```

### Access Rules

| User                       | Access                      |
| -------------------------- | --------------------------- |
| `ADMIN` / `SUPER_ADMIN`    | Any chapter                 |
| Assigned `INSTRUCTOR`      | Assigned course chapters    |
| Student without enrollment | Preview chapters only       |
| `ACTIVE` student           | Preview and locked chapters |
| `COMPLETED` student        | Preview and locked chapters |
| `CANCELLED` student        | Preview chapters only       |

### Success — `200 OK`

```json
{
  "success": true,
  "message": "Chapter playback retrieved successfully.",
  "data": {
    "chapter": {
      "id": "CHAPTER_UUID",
      "title": "TypeScript Basic Types",
      "durationSeconds": 900,
      "isPreview": false
    },
    "course": {
      "id": "COURSE_UUID",
      "title": "Free TypeScript Fundamentals",
      "slug": "free-typescript-fundamentals"
    },
    "playbackUrl": "https://example.com/videos/typescript-types.mp4"
  }
}
```

### No Course Access — `403`

```json
{
  "success": false,
  "code": "COURSE_ACCESS_REQUIRED",
  "message": "Enroll in or purchase this course to watch this chapter.",
  "data": null,
  "errors": []
}
```

---

## Enrollment Statuses

```text
ACTIVE
COMPLETED
CANCELLED
```

| Status      | Meaning            | Locked video access |
| ----------- | ------------------ | ------------------- |
| `ACTIVE`    | Current enrollment | Yes                 |
| `COMPLETED` | Course completed   | Yes                 |
| `CANCELLED` | Access removed     | No                  |

---

## Frontend Integration

### Enroll in a Free Course

```ts
const response = await fetch(
  `http://localhost:5000/api/v1/courses/${courseId}/enroll`,
  {
    method: "POST",
    credentials: "include",
  },
);

const result = await response.json();
```

### Get Own Enrollments

```ts
const response = await fetch(
  "http://localhost:5000/api/v1/enrollments/me?page=1&limit=10",
  {
    method: "GET",
    credentials: "include",
  },
);

const result = await response.json();
```

### Check Course Enrollment

```ts
const response = await fetch(
  `http://localhost:5000/api/v1/enrollments/me/${courseId}`,
  {
    method: "GET",
    credentials: "include",
  },
);

const result = await response.json();
```

### Get Chapter Playback

```ts
const response = await fetch(
  `http://localhost:5000/api/v1/chapters/${chapterId}/playback`,
  {
    method: "GET",
    credentials: "include",
  },
);

const result = await response.json();

if (response.ok) {
  const playbackUrl = result.data.playbackUrl;
}
```

### Admin Manual Enrollment

```ts
const response = await fetch("http://localhost:5000/api/v1/admin/enrollments", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    studentId,
    courseId,
  }),
});

const result = await response.json();
```

### Admin Update Enrollment Status

```ts
const response = await fetch(
  `http://localhost:5000/api/v1/admin/enrollments/${enrollmentId}`,
  {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "CANCELLED",
    }),
  },
);

const result = await response.json();
```

---

## Common Errors

| HTTP Status | Code                     | Meaning                              |
| ----------: | ------------------------ | ------------------------------------ |
|       `400` | `VALIDATION_ERROR`       | Invalid body, query or UUID          |
|       `400` | `COURSE_NOT_AVAILABLE`   | Course is not published or available |
|       `400` | `USER_NOT_STUDENT`       | Selected user is not a student       |
|       `400` | `STUDENT_NOT_ACTIVE`     | Student account is not active        |
|       `401` | `UNAUTHENTICATED`        | Login is required                    |
|       `402` | `PURCHASE_REQUIRED`      | Paid course requires purchase        |
|       `403` | `FORBIDDEN`              | User role has no permission          |
|       `403` | `COURSE_ACCESS_REQUIRED` | Enrollment or purchase is required   |
|       `404` | `COURSE_NOT_FOUND`       | Course does not exist                |
|       `404` | `CHAPTER_NOT_FOUND`      | Chapter does not exist               |
|       `404` | `ENROLLMENT_NOT_FOUND`   | Enrollment does not exist            |

---

## Important Frontend Notes

- Always use `credentials: "include"` for protected requests.
- JWT is stored in HttpOnly cookies, not in `localStorage`.
- A new enrollment starts with `ACTIVE` status.
- Duplicate enrollment does not create another database row.
- Free course enrollment only works when the effective price is `0`.
- Paid course enrollment will be completed through the future Purchase API.
- Public course responses must not expose locked chapter `videoUrl`.
- Use `/chapters/:chapterId/playback` when the student presses the Play button.

# Step 6.6 — Mock Course Purchase API

## Base URL

```text
http://localhost:5000/api/v1
```

Protected requests must include the authentication cookie:

```ts
credentials: "include";
```

> Mock payment is only available in development and testing. It is automatically disabled when `NODE_ENV=production`.

---

## Purchase Flow

```text
Student creates checkout
→ Purchase becomes PENDING
→ Mock payment is processed
→ SUCCESS: Purchase becomes PAID
→ Enrollment becomes ACTIVE
→ Student gets protected course access
```

---

## API Summary

| Method | Endpoint                              | Access  | Purpose                     |
| ------ | ------------------------------------- | ------- | --------------------------- |
| `POST` | `/purchases/checkout`                 | Student | Create paid-course checkout |
| `POST` | `/purchases/:purchaseId/mock/confirm` | Student | Simulate payment result     |
| `GET`  | `/purchases/me`                       | Student | Get own purchase history    |
| `GET`  | `/purchases/me/:purchaseId`           | Student | Get one own purchase        |
| `GET`  | `/admin/purchases`                    | Admin   | Get all purchases           |
| `GET`  | `/admin/purchases/:purchaseId`        | Admin   | Get purchase details        |

> `Admin` means `ADMIN` or `SUPER_ADMIN`.

---

# 1. Create Checkout

```http
POST /purchases/checkout
```

**Access:** `STUDENT`

## Request Body

```json
{
  "courseId": "COURSE_UUID"
}
```

Do not send the course price from the frontend. The backend calculates the payable amount using:

```text
discountPrice ?? price
```

The course must be:

- `PUBLISHED`
- Under an active category
- A paid course
- Not already purchased
- Not already enrolled

## Example

```http
POST http://localhost:5000/api/v1/purchases/checkout
```

```json
{
  "courseId": "7d795527-5612-4a45-9292-da2c8b654653"
}
```

## Success — `201 Created`

```json
{
  "success": true,
  "message": "Mock checkout created successfully.",
  "data": {
    "purchase": {
      "id": "PURCHASE_UUID",
      "amount": "3500.00",
      "currency": "BDT",
      "status": "PENDING",
      "provider": "MOCK",
      "paidAt": null,
      "createdAt": "2026-09-02T12:00:00.000Z",
      "updatedAt": "2026-09-02T12:00:00.000Z",
      "student": {
        "id": "STUDENT_UUID",
        "name": "Jabed Hasan",
        "email": "jabed@example.com",
        "role": "STUDENT",
        "status": "ACTIVE"
      },
      "course": {
        "id": "COURSE_UUID",
        "title": "Advanced TypeScript Masterclass",
        "slug": "advanced-typescript-masterclass",
        "thumbnailUrl": "https://example.com/typescript.jpg",
        "price": "5000.00",
        "discountPrice": "3500.00",
        "level": "ADVANCED",
        "status": "PUBLISHED"
      },
      "paymentAttempts": [
        {
          "id": "PAYMENT_ATTEMPT_UUID",
          "transactionId": "MOCK-TRANSACTION_UUID",
          "amount": "3500.00",
          "currency": "BDT",
          "provider": "MOCK",
          "status": "PENDING",
          "failureReason": null,
          "processedAt": null
        }
      ]
    },
    "mockPayment": {
      "confirmUrl": "/api/v1/purchases/PURCHASE_UUID/mock/confirm",
      "allowedResults": ["SUCCESS", "FAILED", "CANCELLED"]
    }
  }
}
```

If a pending checkout already exists, the existing purchase is returned with `200 OK`.

---

# 2. Process Mock Payment

```http
POST /purchases/:purchaseId/mock/confirm
```

**Access:** Purchase owner with `STUDENT` role

Available mock results:

```text
SUCCESS
FAILED
CANCELLED
```

---

## 2.1 Simulate Successful Payment

```http
POST /purchases/PURCHASE_UUID/mock/confirm
```

```json
{
  "result": "SUCCESS"
}
```

## Success — `200 OK`

```json
{
  "success": true,
  "message": "Mock payment completed successfully.",
  "data": {
    "purchase": {
      "id": "PURCHASE_UUID",
      "amount": "3500.00",
      "currency": "BDT",
      "status": "PAID",
      "provider": "MOCK",
      "paidAt": "2026-09-02T12:10:00.000Z",
      "paymentAttempts": [
        {
          "id": "PAYMENT_ATTEMPT_UUID",
          "transactionId": "MOCK-TRANSACTION_UUID",
          "status": "SUCCESS",
          "failureReason": null,
          "processedAt": "2026-09-02T12:10:00.000Z"
        }
      ]
    }
  }
}
```

Successful payment automatically creates:

```text
Enrollment status → ACTIVE
```

The student can then access protected chapters.

---

## 2.2 Simulate Failed Payment

```http
POST /purchases/PURCHASE_UUID/mock/confirm
```

```json
{
  "result": "FAILED"
}
```

## Response — `200 OK`

```json
{
  "success": true,
  "message": "Mock payment failed.",
  "data": {
    "purchase": {
      "id": "PURCHASE_UUID",
      "status": "FAILED",
      "paidAt": null,
      "paymentAttempts": [
        {
          "id": "PAYMENT_ATTEMPT_UUID",
          "status": "FAILED",
          "failureReason": "Mock payment failed.",
          "processedAt": "2026-09-02T12:10:00.000Z"
        }
      ]
    }
  }
}
```

No enrollment is created after a failed payment.

---

## 2.3 Simulate Cancelled Payment

```http
POST /purchases/PURCHASE_UUID/mock/confirm
```

```json
{
  "result": "CANCELLED"
}
```

## Response — `200 OK`

```json
{
  "success": true,
  "message": "Mock payment cancelled.",
  "data": {
    "purchase": {
      "id": "PURCHASE_UUID",
      "status": "CANCELLED",
      "paidAt": null,
      "paymentAttempts": [
        {
          "id": "PAYMENT_ATTEMPT_UUID",
          "status": "CANCELLED",
          "failureReason": "Mock payment was cancelled.",
          "processedAt": "2026-09-02T12:10:00.000Z"
        }
      ]
    }
  }
}
```

No enrollment is created after a cancelled payment.

---

# 3. Retry Failed or Cancelled Payment

Use the checkout endpoint again:

```http
POST /purchases/checkout
```

```json
{
  "courseId": "COURSE_UUID"
}
```

The backend will:

```text
Reuse the existing Purchase
→ Change Purchase status to PENDING
→ Create a new PaymentAttempt
```

## Response — `200 OK`

```json
{
  "success": true,
  "message": "Pending checkout retrieved successfully.",
  "data": {
    "purchase": {
      "id": "PURCHASE_UUID",
      "status": "PENDING",
      "paymentAttempts": [
        {
          "id": "NEW_PAYMENT_ATTEMPT_UUID",
          "status": "PENDING"
        },
        {
          "id": "OLD_PAYMENT_ATTEMPT_UUID",
          "status": "FAILED"
        }
      ]
    }
  }
}
```

After retrying, process the new pending payment:

```http
POST /purchases/PURCHASE_UUID/mock/confirm
```

```json
{
  "result": "SUCCESS"
}
```

---

# 4. Get Own Purchase History

```http
GET /purchases/me
```

**Access:** `STUDENT`

## Query Parameters

| Parameter | Default | Accepted values |
| --------- | ------: | --------------- |
| `page`    |     `1` | Minimum `1`     |
| `limit`   |    `10` | `1–100`         |
| `status`  |       — | Purchase status |

## Examples

```http
GET /purchases/me?page=1&limit=10
```

```http
GET /purchases/me?status=PAID
```

```http
GET /purchases/me?status=PENDING
```

```http
GET /purchases/me?status=FAILED
```

## Success — `200 OK`

```json
{
  "success": true,
  "message": "Purchases retrieved successfully.",
  "data": {
    "purchases": [
      {
        "id": "PURCHASE_UUID",
        "amount": "3500.00",
        "currency": "BDT",
        "status": "PAID",
        "provider": "MOCK",
        "paidAt": "2026-09-02T12:10:00.000Z",
        "course": {
          "id": "COURSE_UUID",
          "title": "Advanced TypeScript Masterclass",
          "slug": "advanced-typescript-masterclass",
          "thumbnailUrl": "https://example.com/typescript.jpg",
          "price": "5000.00",
          "discountPrice": "3500.00",
          "level": "ADVANCED",
          "status": "PUBLISHED"
        },
        "paymentAttempts": [
          {
            "id": "PAYMENT_ATTEMPT_UUID",
            "transactionId": "MOCK-TRANSACTION_UUID",
            "status": "SUCCESS",
            "processedAt": "2026-09-02T12:10:00.000Z"
          }
        ]
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

# 5. Get One Own Purchase

```http
GET /purchases/me/:purchaseId
```

**Access:** Purchase owner with `STUDENT` role

## Example

```http
GET /purchases/me/PURCHASE_UUID
```

## Success — `200 OK`

```json
{
  "success": true,
  "message": "Purchase retrieved successfully.",
  "data": {
    "purchase": {
      "id": "PURCHASE_UUID",
      "amount": "3500.00",
      "currency": "BDT",
      "status": "PAID",
      "provider": "MOCK",
      "paidAt": "2026-09-02T12:10:00.000Z",
      "course": {
        "id": "COURSE_UUID",
        "title": "Advanced TypeScript Masterclass",
        "slug": "advanced-typescript-masterclass"
      },
      "paymentAttempts": [
        {
          "id": "PAYMENT_ATTEMPT_UUID",
          "transactionId": "MOCK-TRANSACTION_UUID",
          "status": "SUCCESS",
          "processedAt": "2026-09-02T12:10:00.000Z"
        }
      ]
    }
  }
}
```

A student cannot read another student's purchase.

---

# 6. Get All Purchases as Admin

```http
GET /admin/purchases
```

**Access:** `ADMIN`, `SUPER_ADMIN`

## Query Parameters

| Parameter   | Example | Purpose                   |
| ----------- | ------- | ------------------------- |
| `page`      | `1`     | Current page              |
| `limit`     | `10`    | Results per page          |
| `search`    | `Jabed` | Search student or course  |
| `status`    | `PAID`  | Filter by purchase status |
| `studentId` | UUID    | Filter by student         |
| `courseId`  | UUID    | Filter by course          |

## Examples

```http
GET /admin/purchases?page=1&limit=10
```

```http
GET /admin/purchases?status=PAID
```

```http
GET /admin/purchases?search=typescript
```

```http
GET /admin/purchases?studentId=STUDENT_UUID
```

```http
GET /admin/purchases?courseId=COURSE_UUID
```

```http
GET /admin/purchases?courseId=COURSE_UUID&status=PAID&page=1&limit=20
```

## Success — `200 OK`

```json
{
  "success": true,
  "message": "Purchases retrieved successfully.",
  "data": {
    "purchases": [
      {
        "id": "PURCHASE_UUID",
        "amount": "3500.00",
        "currency": "BDT",
        "status": "PAID",
        "provider": "MOCK",
        "paidAt": "2026-09-02T12:10:00.000Z",
        "student": {
          "id": "STUDENT_UUID",
          "name": "Jabed Hasan",
          "email": "jabed@example.com",
          "role": "STUDENT",
          "status": "ACTIVE"
        },
        "course": {
          "id": "COURSE_UUID",
          "title": "Advanced TypeScript Masterclass",
          "slug": "advanced-typescript-masterclass"
        }
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

# 7. Get One Purchase as Admin

```http
GET /admin/purchases/:purchaseId
```

**Access:** `ADMIN`, `SUPER_ADMIN`

## Example

```http
GET /admin/purchases/PURCHASE_UUID
```

Admin can view:

- Student information
- Course information
- Purchase amount
- Purchase status
- Payment provider
- Transaction ID
- Payment attempts
- Failure reason
- Payment processing time

---

# Purchase Statuses

```text
PENDING
PAID
FAILED
CANCELLED
REFUNDED
```

| Status      | Meaning             | Enrollment          |
| ----------- | ------------------- | ------------------- |
| `PENDING`   | Waiting for payment | Not created         |
| `PAID`      | Payment successful  | `ACTIVE`            |
| `FAILED`    | Payment failed      | Not created         |
| `CANCELLED` | Payment cancelled   | Not created         |
| `REFUNDED`  | Money returned      | Future refund logic |

---

# Payment Attempt Statuses

```text
PENDING
SUCCESS
FAILED
CANCELLED
```

| Status      | Meaning                       |
| ----------- | ----------------------------- |
| `PENDING`   | Payment attempt is waiting    |
| `SUCCESS`   | Payment attempt succeeded     |
| `FAILED`    | Payment attempt failed        |
| `CANCELLED` | Payment attempt was cancelled |

---

# Frontend Integration

## Create Checkout

```ts
const response = await fetch(
  "http://localhost:5000/api/v1/purchases/checkout",
  {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      courseId,
    }),
  },
);

const result = await response.json();

if (response.ok) {
  const purchaseId = result.data.purchase.id;
}
```

## Simulate Successful Payment

```ts
const response = await fetch(
  `http://localhost:5000/api/v1/purchases/${purchaseId}/mock/confirm`,
  {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      result: "SUCCESS",
    }),
  },
);

const result = await response.json();
```

## Get Purchase History

```ts
const response = await fetch(
  "http://localhost:5000/api/v1/purchases/me?page=1&limit=10",
  {
    method: "GET",
    credentials: "include",
  },
);

const result = await response.json();
```

## Check Automatic Enrollment

After a successful payment:

```ts
const response = await fetch(
  `http://localhost:5000/api/v1/enrollments/me/${courseId}`,
  {
    method: "GET",
    credentials: "include",
  },
);

const result = await response.json();
```

Expected enrollment status:

```text
ACTIVE
```

## Open Protected Chapter

```ts
const response = await fetch(
  `http://localhost:5000/api/v1/chapters/${chapterId}/playback`,
  {
    method: "GET",
    credentials: "include",
  },
);

const result = await response.json();

if (response.ok) {
  const playbackUrl = result.data.playbackUrl;
}
```

---

# Common Errors

| HTTP Status | Error Code                        | Meaning                                                |
| ----------: | --------------------------------- | ------------------------------------------------------ |
|       `400` | `VALIDATION_ERROR`                | Invalid body, query or UUID                            |
|       `400` | `COURSE_NOT_AVAILABLE`            | Course is not published or available                   |
|       `400` | `FREE_COURSE_ENROLLMENT_REQUIRED` | Use the free enrollment API                            |
|       `401` | `UNAUTHENTICATED`                 | Login is required                                      |
|       `403` | `FORBIDDEN`                       | User does not have permission                          |
|       `403` | `MOCK_PAYMENT_DISABLED`           | Mock payment is disabled in production                 |
|       `404` | `COURSE_NOT_FOUND`                | Course does not exist                                  |
|       `404` | `PURCHASE_NOT_FOUND`              | Purchase does not exist or is not owned by the student |
|       `409` | `ALREADY_ENROLLED`                | Student already has course access                      |
|       `409` | `COURSE_ALREADY_PURCHASED`        | Course has already been purchased                      |
|       `409` | `PAYMENT_NOT_PENDING`             | Start a new checkout before payment                    |
|       `409` | `PAYMENT_ATTEMPT_NOT_FOUND`       | No pending payment attempt exists                      |

---

# Important Frontend Notes

- Always send `credentials: "include"` with protected requests.
- Never send or calculate the final payable amount from the frontend.
- Use the amount returned by the checkout API.
- Free courses must use `POST /courses/:courseId/enroll`.
- Paid courses must use `POST /purchases/checkout`.
- Do not create enrollment from the frontend.
- Successful payment automatically creates the enrollment.
- A failed or cancelled payment does not create enrollment.
- Calling checkout again after failure creates a new payment attempt.
- Sending `SUCCESS` twice does not create duplicate enrollment.
- Mock payment controls must never be shown in the production frontend.
- Replace Mock Payment with a real payment gateway before production deployment.
