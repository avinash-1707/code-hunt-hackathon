"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth/auth-guard";
import { RoleCheck } from "@/components/auth/role-check";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
  return (
    <AuthGuard allowedRoles={["SUPER_ADMIN", "HR_ADMIN", "HR_MANAGER"]}>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const router = useRouter();
  const { user, signOut, refreshProfile } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async (): Promise<void> => {
    setBusy(true);
    setError(null);
    try {
      await signOut();
      router.replace("/login");
    } catch {
      setError("Logout failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleRefresh = async (): Promise<void> => {
    setBusy(true);
    setError(null);
    try {
      await refreshProfile();
    } catch {
      setError("Failed to refresh profile.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 py-10">
      <main className="mx-auto w-full max-w-3xl rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
            <p className="text-sm text-zinc-600">Authenticated area.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={busy}
              className="rounded-md bg-zinc-200 px-3 py-2 text-sm text-zinc-900 disabled:opacity-60"
            >
              Refresh profile
            </button>
            <button
              type="button"
              onClick={handleLogout}
              disabled={busy}
              className="rounded-md bg-red-600 px-3 py-2 text-sm text-white disabled:opacity-60"
            >
              Logout
            </button>
          </div>
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <pre className="mt-6 overflow-auto rounded-md bg-zinc-900 p-4 text-xs text-zinc-100">
          {JSON.stringify(user, null, 2)}
        </pre>

        <RoleCheck
          roles={["SUPER_ADMIN", "HR_ADMIN"]}
          fallback={
            <p className="mt-4 text-sm text-zinc-500">
              Admin section is hidden for your role.
            </p>
          }
        >
          <section className="mt-6 rounded-md border border-zinc-300 bg-zinc-50 p-4">
            <h2 className="text-sm font-semibold text-zinc-900">Admin Section</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Visible only to SUPER_ADMIN and HR_ADMIN roles.
            </p>
          </section>
        </RoleCheck>
      </main>
    </div>
  );
}
