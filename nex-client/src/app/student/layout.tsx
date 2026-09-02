"use client";
import ProtectedRoute from '@/components/ProtectedRoute';

// এখানে অবশ্যই একটি ফাংশনাল কম্পোনেন্ট থাকতে হবে
export default function StudentLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      {children}
    </ProtectedRoute>
  );
}