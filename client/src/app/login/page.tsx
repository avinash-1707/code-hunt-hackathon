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

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isInitializing, signIn, signUp } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
    return (
      <>
        <style>{globalStyles}</style>
        <div className="loading-screen">
          <div className="loading-logo">
            <div className="loading-dot" />
            TalentHQ
          </div>
          <div className="loading-spinner" />
        </div>
      </>
    );
  }

  const loginErrors = loginForm.formState.errors;
  const registerErrors = registerForm.formState.errors;

  return (
    <>
      <style>{globalStyles}</style>

      <div className="auth-root">
        {/* Left panel */}
        <div className="auth-left">
          <div className="auth-left-bg" />
          <div className="auth-left-grid" />
          <div className="auth-orb auth-orb-1" />
          <div className="auth-orb auth-orb-2" />

          <div className="auth-left-inner">
            <a href="/" className="auth-brand">
              <div className="brand-dot" />
              TalentHQ
            </a>

            <div className="auth-left-content">
              <div className="auth-tagline-label">HR Management Platform</div>
              <h2 className="auth-tagline">
                Hire smarter.
                <br />
                <span className="auth-tagline-accent">Grow faster.</span>
              </h2>
              <p className="auth-tagline-sub">
                Streamline your entire hiring pipeline — from job postings to
                onboarding — in one unified workspace.
              </p>

              <div className="auth-features">
                {[
                  { icon: "⚡", label: "3× faster hiring cycles" },
                  { icon: "🎯", label: "Smart candidate matching" },
                  { icon: "📊", label: "Real-time HR analytics" },
                ].map((f) => (
                  <div key={f.label} className="auth-feature-item">
                    <div className="feature-icon">{f.icon}</div>
                    <span>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="auth-left-footer">
              <div className="auth-avatars">
                {["JD", "AM", "SR", "KL"].map((initials) => (
                  <div key={initials} className="avatar">
                    {initials}
                  </div>
                ))}
              </div>
              <p className="auth-social-proof">
                Trusted by <strong>2,400+</strong> HR teams worldwide
              </p>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="auth-right">
          <div className="auth-card">
            {/* Mode toggle */}
            <div className="auth-toggle">
              <button
                type="button"
                className={`toggle-btn${mode === "login" ? " active" : ""}`}
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`toggle-btn${mode === "register" ? " active" : ""}`}
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
              >
                Create Account
              </button>
            </div>

            <div className="auth-heading">
              <h1 className="auth-title">
                {mode === "login" ? "Welcome back" : "Get started"}
              </h1>
              <p className="auth-subtitle">
                {mode === "login"
                  ? "Sign in to your TalentHQ workspace."
                  : "Create your account in seconds."}
              </p>
            </div>

            <form
              onSubmit={mode === "login" ? handleLogin : handleRegister}
              className="auth-form"
            >
              {mode === "register" && (
                <div
                  className="field-group"
                  style={{ animation: "fieldAppear 0.25s ease both" }}
                >
                  <label className="field-label">Full Name</label>
                  <div className="input-wrap">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Jane Doe"
                      {...registerForm.register("name")}
                    />
                  </div>
                  {registerErrors.name && (
                    <p className="field-error">{registerErrors.name.message}</p>
                  )}
                </div>
              )}

              <div className="field-group">
                <label className="field-label">Email Address</label>
                <div className="input-wrap">
                  <span className="input-icon">✉️</span>
                  <input
                    type="email"
                    className="field-input"
                    placeholder="you@company.com"
                    {...(mode === "login"
                      ? loginForm.register("email")
                      : registerForm.register("email"))}
                  />
                </div>
                {(mode === "login"
                  ? loginErrors.email
                  : registerErrors.email) && (
                  <p className="field-error">
                    {
                      (mode === "login"
                        ? loginErrors.email
                        : registerErrors.email
                      )?.message
                    }
                  </p>
                )}
              </div>

              <div className="field-group">
                <div className="field-label-row">
                  <label className="field-label">Password</label>
                  {mode === "login" && (
                    <a href="#" className="field-link">
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="field-input"
                    placeholder={
                      mode === "register" ? "Min. 8 characters" : "••••••••"
                    }
                    {...(mode === "login"
                      ? loginForm.register("password")
                      : registerForm.register("password"))}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {(mode === "login"
                  ? loginErrors.password
                  : registerErrors.password) && (
                  <p className="field-error">
                    {
                      (mode === "login"
                        ? loginErrors.password
                        : registerErrors.password
                      )?.message
                    }
                  </p>
                )}
              </div>

              {error && (
                <div className="error-banner">
                  <span>⚠️</span> {error}
                </div>
              )}

              <button type="submit" disabled={busy} className="submit-btn">
                {busy ? (
                  <span className="btn-spinner" />
                ) : (
                  <>
                    {mode === "login" ? "Sign In" : "Create Account"}
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            <p className="auth-switch">
              {mode === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                className="switch-link"
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setError(null);
                }}
              >
                {mode === "login" ? "Create one" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0D0D1A;
    --ink-soft: #3A3A55;
    --ink-muted: #7A7A99;
    --accent: #5B4FE8;
    --accent-light: #EAE8FF;
    --accent-glow: rgba(91,79,232,0.18);
    --surface: #FAFAFE;
    --border: #E8E8F0;
    --white: #FFFFFF;
    --green: #22C97D;
    --red: #EF4444;
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--surface); color: var(--ink); }

  /* LOADING */
  .loading-screen {
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 24px;
    background: var(--surface);
  }
  .loading-logo {
    font-family: 'Syne', sans-serif;
    font-size: 24px; font-weight: 800;
    color: var(--ink);
    display: flex; align-items: center; gap: 8px;
  }
  .loading-dot {
    width: 8px; height: 8px;
    background: var(--accent); border-radius: 50%;
  }
  .loading-spinner {
    width: 28px; height: 28px;
    border: 2.5px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  /* ROOT LAYOUT */
  .auth-root {
    display: flex;
    min-height: 100vh;
  }

  /* LEFT PANEL */
  .auth-left {
    flex: 0 0 46%;
    position: relative;
    overflow: hidden;
    display: flex;
  }
  .auth-left-bg {
    position: absolute; inset: 0;
    background: linear-gradient(155deg, #1A0F5E 0%, #2D1FA8 45%, #1E1060 100%);
    z-index: 0;
  }
  .auth-left-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    z-index: 0;
  }
  .auth-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(70px);
    pointer-events: none;
    z-index: 0;
  }
  .auth-orb-1 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(155,143,255,0.4) 0%, transparent 70%);
    top: -100px; right: -80px;
  }
  .auth-orb-2 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(34,201,125,0.2) 0%, transparent 70%);
    bottom: 60px; left: -60px;
  }
  .auth-left-inner {
    position: relative; z-index: 1;
    display: flex; flex-direction: column;
    width: 100%;
    padding: 40px 52px;
  }
  .auth-brand {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'Syne', sans-serif;
    font-size: 20px; font-weight: 800;
    color: white;
    text-decoration: none;
    letter-spacing: -0.3px;
  }
  .brand-dot {
    width: 8px; height: 8px;
    background: var(--green);
    border-radius: 50%;
    box-shadow: 0 0 8px var(--green);
  }
  .auth-left-content {
    flex: 1;
    display: flex; flex-direction: column;
    justify-content: center;
    padding: 40px 0;
  }
  .auth-tagline-label {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 600;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: rgba(255,255,255,0.5);
    margin-bottom: 20px;
  }
  .auth-tagline {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 3.5vw, 52px);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -2px;
    color: white;
    margin-bottom: 20px;
  }
  .auth-tagline-accent {
    background: linear-gradient(135deg, #9B8FFF 0%, #22C97D 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .auth-tagline-sub {
    font-size: 15px;
    color: rgba(255,255,255,0.55);
    line-height: 1.7;
    font-weight: 300;
    max-width: 360px;
    margin-bottom: 40px;
  }
  .auth-features {
    display: flex; flex-direction: column; gap: 14px;
  }
  .auth-feature-item {
    display: flex; align-items: center; gap: 12px;
    font-size: 14px; color: rgba(255,255,255,0.75);
    font-weight: 400;
  }
  .feature-icon {
    width: 36px; height: 36px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }
  .auth-left-footer {
    display: flex; align-items: center; gap: 14px;
    padding-top: 36px;
    border-top: 1px solid rgba(255,255,255,0.1);
  }
  .auth-avatars {
    display: flex;
  }
  .avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent) 0%, #9B8FFF 100%);
    border: 2px solid rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 700; color: white;
    margin-left: -8px;
  }
  .avatar:first-child { margin-left: 0; }
  .auth-social-proof {
    font-size: 13px; color: rgba(255,255,255,0.55);
    font-weight: 300;
  }
  .auth-social-proof strong { color: white; font-weight: 600; }

  /* RIGHT PANEL */
  .auth-right {
    flex: 1;
    display: flex; align-items: center; justify-content: center;
    padding: 40px 20px;
    background: var(--surface);
  }
  .auth-card {
    width: 100%; max-width: 420px;
    animation: fadeUp 0.5s ease both;
  }

  /* TOGGLE */
  .auth-toggle {
    display: flex;
    background: var(--border);
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 32px;
    gap: 2px;
  }
  .toggle-btn {
    flex: 1;
    padding: 9px 16px;
    border-radius: 9px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500;
    cursor: pointer; border: none;
    color: var(--ink-muted);
    background: transparent;
    transition: all 0.2s;
  }
  .toggle-btn.active {
    background: white;
    color: var(--ink);
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }

  /* HEADING */
  .auth-heading { margin-bottom: 28px; }
  .auth-title {
    font-family: 'Syne', sans-serif;
    font-size: 30px; font-weight: 800;
    letter-spacing: -1.2px;
    color: var(--ink);
    margin-bottom: 6px;
  }
  .auth-subtitle {
    font-size: 14px;
    color: var(--ink-muted);
    font-weight: 300;
  }

  /* FORM */
  .auth-form { display: flex; flex-direction: column; gap: 18px; }
  .field-group { display: flex; flex-direction: column; gap: 6px; }
  .field-label-row {
    display: flex; align-items: center; justify-content: space-between;
  }
  .field-label {
    font-size: 13px; font-weight: 600;
    color: var(--ink-soft);
    letter-spacing: 0.1px;
  }
  .field-link {
    font-size: 12px; color: var(--accent);
    text-decoration: none; font-weight: 500;
    transition: opacity 0.15s;
  }
  .field-link:hover { opacity: 0.7; }
  .input-wrap {
    position: relative; display: flex; align-items: center;
  }
  .input-icon {
    position: absolute; left: 13px;
    font-size: 14px;
    pointer-events: none;
    opacity: 0.5;
    line-height: 1;
  }
  .field-input {
    width: 100%; padding: 12px 14px 12px 40px;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: var(--ink);
    background: white;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .field-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 4px var(--accent-glow);
  }
  .field-input::placeholder { color: var(--ink-muted); opacity: 0.6; }
  .password-toggle {
    position: absolute; right: 12px;
    background: none; border: none;
    cursor: pointer; font-size: 15px;
    opacity: 0.5; transition: opacity 0.15s;
    line-height: 1;
  }
  .password-toggle:hover { opacity: 1; }
  .field-error {
    font-size: 12px; color: var(--red);
    display: flex; align-items: center; gap: 4px;
  }

  /* ERROR BANNER */
  .error-banner {
    background: #FFF5F5;
    border: 1.5px solid #FECACA;
    border-radius: 10px;
    padding: 12px 14px;
    font-size: 13px; color: #B91C1C;
    display: flex; align-items: center; gap: 8px;
    animation: fieldAppear 0.2s ease;
  }

  /* SUBMIT */
  .submit-btn {
    width: 100%; padding: 14px;
    background: linear-gradient(135deg, var(--accent) 0%, #7B6FF0 100%);
    color: white; border: none;
    border-radius: 12px;
    font-family: 'Syne', sans-serif;
    font-size: 15px; font-weight: 700;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.2s;
    box-shadow: 0 6px 20px rgba(91,79,232,0.3);
    margin-top: 4px;
  }
  .submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 28px rgba(91,79,232,0.4);
  }
  .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
  .btn-arrow { transition: transform 0.2s; }
  .submit-btn:hover:not(:disabled) .btn-arrow { transform: translateX(3px); }
  .btn-spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  /* SWITCH */
  .auth-switch {
    text-align: center;
    margin-top: 24px;
    font-size: 14px; color: var(--ink-muted);
  }
  .switch-link {
    background: none; border: none;
    color: var(--accent); font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    transition: opacity 0.15s;
  }
  .switch-link:hover { opacity: 0.7; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fieldAppear {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 900px) {
    .auth-root { flex-direction: column; }
    .auth-left { flex: 0 0 auto; min-height: 300px; }
    .auth-left-inner { padding: 32px 28px; }
    .auth-left-content { padding: 20px 0; }
    .auth-tagline { font-size: 36px; letter-spacing: -1.5px; }
    .auth-right { padding: 40px 20px 60px; }
  }
`;
