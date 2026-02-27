"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { hasRequiredRole, type AppRole } from "@/lib/auth/roles";

type AuthGuardProps = {
  children: ReactNode;
  allowedRoles?: AppRole[];
};

export function AuthGuard({ children, allowedRoles = [] }: AuthGuardProps) {
  const { isInitializing, isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (
      !isInitializing &&
      isAuthenticated &&
      allowedRoles.length > 0 &&
      !hasRequiredRole(user?.role, allowedRoles)
    ) {
      router.replace("/dashboard?error=forbidden");
    }
  }, [isInitializing, isAuthenticated, allowedRoles, router, user?.role]);

  if (isInitializing) {
    return <div className="p-6 text-sm text-zinc-600">Loading session...</div>;
  }

  if (!isAuthenticated || !hasRequiredRole(user?.role, allowedRoles)) {
    return null;
  }

  return <>{children}</>;
}
