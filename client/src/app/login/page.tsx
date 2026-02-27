"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { getApiErrorMessage } from "@/lib/api";
import {
  loginSchema,
  registerSchema,
  type LoginFormValues,
  type RegisterFormValues,
} from "@/lib/validators/auth";

type AuthMode = "login" | "register";

const inputClassName =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500";

const errorClassName = "text-xs text-red-600";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isInitializing, signIn, signUp } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isInitializing, router]);

  const handleLogin = loginForm.handleSubmit(async (values) => {
    setBusy(true);
    setError(null);
    try {
      await signIn(values);
      router.replace("/dashboard");
    } catch (error: unknown) {
      setError(getApiErrorMessage(error, "Invalid email or password."));
    } finally {
      setBusy(false);
    }
  });

  const handleRegister = registerForm.handleSubmit(async (values) => {
    setBusy(true);
    setError(null);
    try {
      await signUp(values);
      router.replace("/dashboard");
    } catch (error: unknown) {
      setError(getApiErrorMessage(error, "Registration failed."));
    } finally {
      setBusy(false);
    }
  });

  if (isInitializing) {
    return <div className="p-6 text-sm text-zinc-600">Loading session...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-100 py-10">
      <main className="mx-auto w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Sign in</h1>
        <p className="mt-1 text-sm text-zinc-600">Use your account to access the dashboard.</p>

        <div className="mt-5 flex gap-2">
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

        <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="mt-4 space-y-3">
          {mode === "register" ? (
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-800">Full name</label>
              <input type="text" className={inputClassName} {...registerForm.register("name")} />
              {registerForm.formState.errors.name ? (
                <p className={errorClassName}>{registerForm.formState.errors.name.message}</p>
              ) : null}
            </div>
          ) : null}

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-800">Email</label>
            <input type="email" className={inputClassName} {...(mode === "login" ? loginForm.register("email") : registerForm.register("email"))} />
            {(mode === "login" ? loginForm.formState.errors.email : registerForm.formState.errors.email) ? (
              <p className={errorClassName}>{(mode === "login" ? loginForm.formState.errors.email : registerForm.formState.errors.email)?.message}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-800">Password</label>
            <input type="password" className={inputClassName} {...(mode === "login" ? loginForm.register("password") : registerForm.register("password"))} />
            {(mode === "login" ? loginForm.formState.errors.password : registerForm.formState.errors.password) ? (
              <p className={errorClassName}>{(mode === "login" ? loginForm.formState.errors.password : registerForm.formState.errors.password)?.message}</p>
            ) : null}
          </div>

          <button
            disabled={busy}
            type="submit"
            className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {mode === "login" ? "Login" : "Create account"}
          </button>
        </form>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </main>
    </div>
  );
}
