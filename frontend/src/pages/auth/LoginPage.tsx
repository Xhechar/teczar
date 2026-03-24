import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Zap, LogIn, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { AuthService } from "../../services/auth.service";
import { UserRole } from "../../enums/enums";
import { toastResult, useToast } from "../../components/Toast";

interface LoginForm {
  Email: string;
  Password: string;
}

const LoginPage: React.FC = () => {
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let toast = useToast();
  const [searchParams] = useSearchParams();
  let {refresh} = useAuth();

  const redirectTo = searchParams.get("redirect") ?? null;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
  } = useForm<LoginForm>({ mode: "all" });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError("");
    try {
      const result = await AuthService.LoginUser(data);

      toastResult(result, toast);

      if (!result.Success) {
        setError(result.ErrorMessage ?? "Invalid email or password.");
        return;
      }
      
      await refresh();

      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      } else if (result.Role === UserRole.Admin) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

    } catch (err: any) {
      const msg =
        err?.response?.data?.ErrorMessage ??
        err?.response?.data?.Title ??
        "Invalid email or password. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (hasErr: boolean) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
      hasErr
        ? "border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/30"
        : "border-slate-200 focus:border-primary-400 focus:ring-primary-100 bg-white"
    }`;

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "linear-gradient(135deg,#080f28 0%,#133889 100%)" }}
    >
      {/* Left panel — decorative */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 relative overflow-hidden">
        {/* Blobs */}
        <div
          className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blob-1"
          style={{
            background:
              "radial-gradient(circle, rgba(22,96,235,0.2) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full blob-2"
          style={{
            background:
              "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-navy-700 flex items-center justify-center shadow-glow">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-800 text-xl text-white">
              Technologies
            </span>
          </div>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-medium transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Quote */}
        <div className="relative z-10">
          <p className="text-5xl font-900 font-display text-white leading-tight mb-6">
            Power Your Home.{" "}
            <span className="text-gradient-gold">Secure Your World.</span>
          </p>
          <p className="text-white/50 text-lg leading-relaxed max-w-md">
            Log in to manage your orders, bookings, and account settings.
          </p>
        </div>

        {/* Stats strip */}
        <div className="relative z-10 flex gap-8">
          {[
            ["500+", "Projects"],
            ["24/7", "Support"],
            ["98%", "Satisfaction"],
          ].map(([val, label]) => (
            <div key={label}>
              <p className="text-2xl font-900 text-white">{val}</p>
              <p className="text-white/40 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-md">
          {/* Mobile logo + back button */}
          <div className="flex lg:hidden items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-navy-700 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-800 text-xl text-white">
                Technologies
              </span>
            </div>
            <Link
              to="/"
              className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-medium transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
            <div className="mb-8">
              <h1 className="font-display text-3xl font-700 text-navy-900 mb-1">
                Welcome back
              </h1>
              <p className="text-slate-500 text-sm">
                Sign in to your account to continue
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("Email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className={inputCls(!!errors.Email)}
                />
                {errors.Email && touchedFields.Email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.Email.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-600">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <Link
                    to={`/forgot-password${watch("Email") ? `?email=${encodeURIComponent(watch("Email"))}` : ""}`}
                    className="text-xs text-primary-500 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    {...register("Password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    className={`${inputCls(!!errors.Password)} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPw ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.Password && touchedFields.Password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.Password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg,#1660eb,#0d1a42)",
                }}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                    Signing in…
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" /> Sign In
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary-600 font-semibold hover:underline"
              >
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;