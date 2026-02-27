"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { hasRequiredRole, type AppRole } from "@/lib/auth/roles";

type RoleCheckProps = {
  roles: AppRole[];
  children: ReactNode;
  fallback?: ReactNode;
};

export function RoleCheck({ roles, children, fallback = null }: RoleCheckProps) {
  const { user } = useAuth();

  if (!hasRequiredRole(user?.role, roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
