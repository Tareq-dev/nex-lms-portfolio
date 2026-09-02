# NEX-LMS Authentication System

This project is a high-performance Learning Management System (LMS) boilerplate built with **Next.ts 14+**, **Redux Toolkit**, and **Tailwind CSS**. It includes a robust role-based authentication and protected routing system.


**🌐 Live Demo:** [https://nex-lms.vercel.app/](https://nex-lms.vercel.app/)


## 🚀 Key Features

*   **Role-Based Access Control (RBAC):** Dedicated routing for Admin, Student, and User roles.
*   **Protected Routes:** Higher-Order Component (HOC) approach to secure private pages.
*   **Redux Toolkit:** Centralized state management for Auth, Theme, and User data.
*   **Split-Screen:** Modern, responsive UI.
*   **Responsive Design:** Mobile-first architecture using Tailwind CSS.
*   **Dark/Light Mode:** Full theme support with persistent state.

## 🛠 Tech Stack

*   **Framework:** Next.ts (App Router)
*   **State Management:** Redux Toolkit
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **Language:** JavaScript

## 📁 Folder Structure

```
src/
├── app/
│   ├── admin/       # Admin-only dashboard
│   ├── auth/        # Login/Signup page
│   ├── dashboard/   # Student/User dashboard
│   └── layout.tsx   # Root layout
├── components/
│   ├── ProtectedRoute.tsx # Auth security logic
│   └── Navbar.tsx   # Navigation with Logout
├── store/
│   ├── slices/
│   │   └── authSlice.ts   # Authentication logic
│   └── index.ts     # Redux store
```

## 🔐 Auth Logic

The system identifies roles via email-based simulation:
*   **Admin:** `admin@nex.com`
*   **User:** `user@nex.com`
*   **Student:** `student@nex.com`
*   **Password:** `1234`

## ⚙️ How to use Protected Routes

Wrap any private page with the `ProtectedRoute` component:

```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

export default function MyPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <YourComponent />
    </ProtectedRoute>
  );
}
```

