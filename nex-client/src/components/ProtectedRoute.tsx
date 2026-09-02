"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import type { RootState } from "@/redux/store/store";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: readonly string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.auth,
  );

  const router = useRouter();

  const isRoleAllowed =
    !allowedRoles || (typeof role === "string" && allowedRoles.includes(role));

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth");
      return;
    }

    if (!isRoleAllowed) {
      router.replace("/unauthorized");
    }
  }, [isAuthenticated, isRoleAllowed, router]);

  if (!isAuthenticated || !isRoleAllowed) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
