import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../enums/enums";

// ─── Full-page spinner shown while auth state is being determined ──
const AuthLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-navy-700 flex items-center justify-center shadow-glow">
        <Zap className="w-7 h-7 text-white animate-pulse" />
      </div>
      <p className="text-slate-400 text-sm font-medium">Verifying session…</p>
    </div>
  </div>
);

// ─── Unauthorised screen (wrong role — e.g. customer hits /admin) ─
const Unauthorised: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface-50 p-6">
    <div className="text-center max-w-sm">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">🚫</span>
      </div>
      <h1 className="font-display text-2xl font-700 text-slate-900 mb-2">
        Access Denied
      </h1>
      <p className="text-slate-500 text-sm leading-relaxed mb-6">
        You don't have permission to view this page.
      </p>
      <a
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm"
        style={{ background: "linear-gradient(135deg,#1660eb,#0d1a42)" }}
      >
        Back to Home
      </a>
    </div>
  </div>
);

// ─── CUSTOMER GUARD ───────────────────────────────────────────────
/**
 * Wraps all /profile, /orders, /cart, /bookings, /settings routes.
 *
 * Behaviour:
 *  - Loading        → shows full-page spinner (avoids flash of wrong content)
 *  - Not logged in  → redirects to /login, preserving the attempted URL
 *                     so they can be sent back after login
 *  - Role = Admin   → shows Unauthorised (admins use /admin, not /profile etc.)
 *  - Role = Customer or Staff → renders the protected page
 */
export const CustomerGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <AuthLoader />;

  if (!user) {
    // Preserve the URL they were trying to reach
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }

  if (user.Role === UserRole.Admin) {
    return <Unauthorised />;
  }

  return <>{children}</>;
};

// ─── ADMIN GUARD ──────────────────────────────────────────────────
/**
 * Wraps all /admin/* routes.
 *
 * Behaviour:
 *  - Loading             → full-page spinner
 *  - Not logged in       → redirects to /login with redirect param
 *  - Role ≠ Admin        → shows Unauthorised (not 404, so the user
 *                          knows the page exists but they can't access it)
 *  - Role = Admin        → renders the protected admin page
 */
export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <AuthLoader />;

  if (!user) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }

  if (user.Role !== UserRole.Admin) {
    return <Unauthorised />;
  }

  return <>{children}</>;
};

// ─── GUEST GUARD ──────────────────────────────────────────────────
/**
 * Wraps /login, /register, /forgot-password.
 *
 * Behaviour:
 *  - Loading        → full-page spinner
 *  - Already logged in as Customer/Staff → redirect to / (or ?redirect param)
 *  - Already logged in as Admin          → redirect to /admin
 *  - Not logged in  → renders the auth page normally
 *
 * This prevents logged-in users from accidentally hitting the login page
 * and getting confused.
 */
export const GuestGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <AuthLoader />;

  if (user) {
    // If there's a ?redirect param, honour it after login
    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect");

    if (user.Role === UserRole.Admin) {
      return <Navigate to={redirect ?? "/admin"} replace />;
    }
    return <Navigate to={redirect ?? "/"} replace />;
  }

  return <>{children}</>;
};
