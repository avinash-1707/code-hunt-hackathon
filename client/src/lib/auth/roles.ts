export type AppRole = "SUPER_ADMIN" | "HR_ADMIN" | "HR_MANAGER";

export const hasRequiredRole = (
  currentRole: AppRole | undefined,
  allowedRoles: AppRole[],
): boolean => {
  if (!currentRole) return false;
  if (allowedRoles.length === 0) return true;
  return allowedRoles.includes(currentRole);
};
