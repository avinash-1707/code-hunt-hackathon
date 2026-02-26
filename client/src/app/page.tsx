"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getMe,
  googleAuth,
  hydrateAccessToken,
  login,
  logout,
  refreshSession,
  register,
  setAccessToken,
} from "@/lib/api";
import {
  googleAuthSchema,
  loginSchema,
  registerSchema,
  type GoogleAuthFormValues,
  type LoginFormValues,
  type RegisterFormValues,
} from "@/lib/validators/auth";

type AuthMode = "login" | "register";

type MeResponse = {
  user: {
    id: string;
    email: string;
    provider: "LOCAL" | "GOOGLE";
    emailVerified: boolean;
    createdAt: string;
  } | null;
};

const inputClassName =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500";

const errorClassName = "text-xs text-red-600";

export default function Home() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [busy, setBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [me, setMe] = useState<MeResponse["user"]>(null);

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const googleForm = useForm<GoogleAuthFormValues>({
    resolver: zodResolver(googleAuthSchema),
    defaultValues: {
      idToken: "",
    },
  });

  useEffect(() => {
    hydrateAccessToken();
  }, []);

  const activeForm = useMemo(() => (mode === "login" ? loginForm : registerForm), [mode, loginForm, registerForm]);

  const fetchProfile = async (): Promise<void> => {
    const response = (await getMe()) as MeResponse;
    setMe(response.user);
  };

  const handleRegister = registerForm.handleSubmit(async (values) => {
    setBusy(true);
    setStatusMessage(null);
    try {
      const result = await register(values);
      setAccessToken(result.accessToken);
      await fetchProfile();
      setStatusMessage("Registration successful.");
      registerForm.reset();
    } catch {
      setStatusMessage("Registration failed.");
    } finally {
      setBusy(false);
    }
  });

  const handleLogin = loginForm.handleSubmit(async (values) => {
    setBusy(true);
    setStatusMessage(null);
    try {
      const result = await login(values);
      setAccessToken(result.accessToken);
      await fetchProfile();
      setStatusMessage("Login successful.");
      loginForm.reset();
    } catch {
      setStatusMessage("Login failed.");
    } finally {
      setBusy(false);
    }
  });

  const handleGoogleAuth = googleForm.handleSubmit(async (values) => {
    setBusy(true);
    setStatusMessage(null);
    try {
      const result = await googleAuth(values);
      setAccessToken(result.accessToken);
      await fetchProfile();
      setStatusMessage("Google authentication successful.");
      googleForm.reset();
    } catch {
      setStatusMessage("Google authentication failed.");
    } finally {
      setBusy(false);
    }
  });

  const handleRefresh = async (): Promise<void> => {
    setBusy(true);
    setStatusMessage(null);
    try {
      const result = await refreshSession();
      setAccessToken(result.accessToken);
      await fetchProfile();
      setStatusMessage("Session refreshed.");
    } catch {
      setStatusMessage("Session refresh failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    setBusy(true);
    setStatusMessage(null);
    try {
      await logout();
      setMe(null);
      setStatusMessage("Logged out.");
    } catch {
      setStatusMessage("Logout failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 py-8">
      <main className="mx-auto w-full max-w-4xl rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Authentication</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Frontend auth wired to backend JWT + refresh-cookie endpoints.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-lg border border-zinc-200 p-4">
            <div className="mb-4 flex gap-2">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`rounded-md px-3 py-2 text-sm ${mode === "login" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700"}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`rounded-md px-3 py-2 text-sm ${mode === "register" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700"}`}
              >
                Register
              </button>
            </div>

            <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-800">Email</label>
                <input type="email" className={inputClassName} {...activeForm.register("email")} />
                {activeForm.formState.errors.email ? (
                  <p className={errorClassName}>{activeForm.formState.errors.email.message}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-800">Password</label>
                <input type="password" className={inputClassName} {...activeForm.register("password")} />
                {activeForm.formState.errors.password ? (
                  <p className={errorClassName}>{activeForm.formState.errors.password.message}</p>
                ) : null}
              </div>

              <button
                disabled={busy}
                type="submit"
                className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {mode === "login" ? "Sign in" : "Create account"}
              </button>
            </form>

            <form onSubmit={handleGoogleAuth} className="mt-5 space-y-3 border-t border-zinc-200 pt-4">
              <h2 className="text-sm font-semibold text-zinc-800">Google Sign-in (ID token)</h2>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-800">Google ID token</label>
                <textarea rows={4} className={inputClassName} {...googleForm.register("idToken")} />
                {googleForm.formState.errors.idToken ? (
                  <p className={errorClassName}>{googleForm.formState.errors.idToken.message}</p>
                ) : null}
              </div>

              <button
                disabled={busy}
                type="submit"
                className="w-full rounded-md bg-white px-3 py-2 text-sm font-medium text-zinc-900 ring-1 ring-zinc-300 disabled:opacity-60"
              >
                Authenticate with Google token
              </button>
            </form>
          </section>

          <section className="rounded-lg border border-zinc-200 p-4">
            <h2 className="text-base font-semibold text-zinc-900">Session</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={fetchProfile}
                disabled={busy}
                className="rounded-md bg-zinc-200 px-3 py-2 text-sm text-zinc-900 disabled:opacity-60"
              >
                Get /users/me
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={busy}
                className="rounded-md bg-zinc-200 px-3 py-2 text-sm text-zinc-900 disabled:opacity-60"
              >
                Refresh
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

            {statusMessage ? <p className="mt-4 text-sm text-zinc-700">{statusMessage}</p> : null}

            <pre className="mt-4 overflow-auto rounded-md bg-zinc-900 p-3 text-xs text-zinc-100">
              {JSON.stringify(me, null, 2) || "null"}
            </pre>
          </section>
        </div>
      </main>
    </div>
  );
}
