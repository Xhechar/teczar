import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { ResetPasswordDto } from "../../dtos/dto";
import { AuthService } from "../../services/auth.service";

// ─── DTOs ────────────────────────────────────────────────────────
interface RequestCodeDto {
  Email: string;
}

// ─── Shared input style ───────────────────────────────────────────
const fieldCls = (hasErr: boolean) =>
  `w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
    hasErr
      ? "border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/30"
      : "border-slate-200 focus:border-primary-400 focus:ring-primary-100 bg-white"
  }`;

// ─── 6-digit OTP input ────────────────────────────────────────────
interface OtpInputProps {
  value: string;
  onChange: (v: string) => void;
  hasError: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({ value, onChange, hasError }) => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>(Array(6).fill(null));

  const digits = value.padEnd(6, " ").split("").slice(0, 6);

  const focusAt = (i: number) => inputsRef.current[i]?.focus();

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = digits.map((d, idx) => (idx === i ? " " : d));
      onChange(next.join("").trimEnd());
      if (i > 0) focusAt(i - 1);
    }
  };

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    if (!char) return;
    const next = digits.map((d, idx) => (idx === i ? char : d));
    onChange(next.join("").trim());
    if (i < 5) focusAt(i + 1);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted) {
      onChange(pasted);
      focusAt(Math.min(pasted.length, 5));
    }
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i]?.trim() || ""}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          className={`w-11 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 ${
            hasError
              ? "border-red-300 bg-red-50 focus:ring-red-100 text-red-600"
              : digits[i]?.trim()
                ? "border-primary-400 bg-primary-50 focus:ring-primary-100 text-primary-700"
                : "border-slate-200 bg-slate-50 focus:border-primary-400 focus:ring-primary-100 text-slate-900"
          }`}
          style={{ height: "3.25rem" }}
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
};

// ─── Countdown timer for resend ───────────────────────────────────
const useCountdown = (seconds: number) => {
  const [remaining, setRemaining] = useState(0);
  const start = () => setRemaining(seconds);
  useEffect(() => {
    if (remaining <= 0) return;
    const t = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(t);
  }, [remaining]);
  return { remaining, start };
};

// ─── STEP 1 — Request Code ────────────────────────────────────────
interface Step1Props {
  onSuccess: (email: string) => void;
}

const RequestCodeStep: React.FC<Step1Props> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<RequestCodeDto>({ mode: "onTouched" });

  const onSubmit = async (data: RequestCodeDto) => {
    setLoading(true);
    setApiError("");
    try {
      const result = await AuthService.VerifyMail(data.Email);
      if (result.Success) {
        onSuccess(data.Email);
      } else {
        setApiError(
          result.ErrorMessage ?? "Something went wrong. Please try again.",
        );
      }
    } catch (error: any) {
      setApiError(error?.response?.data?.ErrorMessage ?? "Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mb-5">
        <Mail className="w-7 h-7 text-primary-600" />
      </div>

      <h1 className="font-display text-2xl font-700 text-navy-900 mb-1.5">
        Forgot your password?
      </h1>
      <p className="text-slate-500 text-sm leading-relaxed mb-7">
        Enter the email address linked to your account and we'll send you a
        6-digit reset code.
      </p>

      {apiError && (
        <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl mb-5">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{apiError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            {...register("Email", {
              required: "Email address is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={fieldCls(!!errors.Email && !!touchedFields.Email)}
          />
          {errors.Email && touchedFields.Email && (
            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.Email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(135deg,#1660eb,#0d1a42)" }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Sending code…
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" /> Send Reset Code
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Remembered your password?{" "}
        <Link to="/login" className="text-primary-600 font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
};

// ─── STEP 2 — Enter Code + New Password ──────────────────────────
interface Step2Props {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

const ResetPasswordStep: React.FC<Step2Props> = ({ email, onSuccess, onBack }) => {
  const [otpValue, setOtpValue] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCp, setShowCp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [resending, setResending] = useState(false);
  const { remaining, start } = useCountdown(60);

  useEffect(() => {
    start();
    // eslint-disable-next-line
  }, []);

  interface ResetForm {
    NewPassword: string;
    ConfirmPassword: string;
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
  } = useForm<ResetForm>({ mode: "onTouched" });

  const newPassword = watch("NewPassword");
  const otpComplete = otpValue.replace(/\s/g, "").length === 6;

  const onSubmit = async (data: ResetForm) => {
    if (!otpComplete) {
      setApiError("Please enter the complete 6-digit code.");
      return;
    }
    setLoading(true);
    setApiError("");
    try {
      const dto: ResetPasswordDto = {
        Email: email,
        ResetCode: Number(otpValue.trim()),
        NewPassword: data.NewPassword,
      };
      const result = await AuthService.ResetPassword(dto);
      if (result.Success) {
        onSuccess();
      } else {
        setApiError(result.ErrorMessage ?? "Invalid or expired code. Please try again.");
      }
    } catch (error: any) {
      setApiError(error?.response?.data?.ErrorMessage ?? "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setApiError("");
    try {
      const result = await AuthService.VerifyMail(email);
      if (result.Success) {
        start();
        setOtpValue("");
      } else {
        setApiError((result as any).ErrorMessage ?? "Could not resend code.");
      }
    } catch (error: any) {
      setApiError(error?.response?.data?.ErrorMessage ?? "Network error. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const getStrength = (pw: string = "") => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = getStrength(newPassword);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-amber-400", "bg-primary-400", "bg-emerald-500"][strength];

  return (
    <>
      <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mb-5">
        <KeyRound className="w-7 h-7 text-primary-600" />
      </div>

      <h1 className="font-display text-2xl font-700 text-navy-900 mb-1.5">
        Enter your reset code
      </h1>
      <p className="text-slate-500 text-sm leading-relaxed mb-2">
        We sent a 6-digit code to{" "}
        <span className="font-semibold text-navy-900">{email}</span>. Enter it
        below along with your new password.
      </p>

      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Use a different email
      </button>

      {apiError && (
        <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl mb-5">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{apiError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-3 text-center">
            6-Digit Reset Code <span className="text-red-400">*</span>
          </label>
          <OtpInput value={otpValue} onChange={setOtpValue} hasError={!!apiError && !otpComplete} />
          <div className="flex justify-center mt-3">
            {remaining > 0 ? (
              <p className="text-xs text-slate-400">
                Resend code in{" "}
                <span className="font-semibold text-slate-600 tabular-nums">
                  0:{String(remaining).padStart(2, "0")}
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-semibold transition-colors disabled:opacity-50"
              >
                {resending ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending…</>
                ) : (
                  <><RotateCcw className="w-3.5 h-3.5" /> Resend Code</>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-xs text-slate-400">New Password</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            New Password <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              {...register("NewPassword", {
                required: "New password is required",
                minLength: { value: 8, message: "Must be at least 8 characters" },
                validate: (v) =>
                  getStrength(v) >= 2 || "Password is too weak — add uppercase, numbers, or symbols",
              })}
              type={showPw ? "text" : "password"}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              className={`${fieldCls(!!errors.NewPassword && !!touchedFields.NewPassword)} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPw((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {newPassword?.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((lvl) => (
                  <div
                    key={lvl}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      strength >= lvl ? strengthColor : "bg-slate-100"
                    }`}
                  />
                ))}
              </div>
              {strengthLabel && (
                <p className={`text-xs font-medium ${
                  strength === 1 ? "text-red-500"
                    : strength === 2 ? "text-amber-500"
                    : strength === 3 ? "text-primary-500"
                    : "text-emerald-600"
                }`}>
                  {strengthLabel} password
                </p>
              )}
            </div>
          )}

          {errors.NewPassword && touchedFields.NewPassword && (
            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.NewPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Confirm Password <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              {...register("ConfirmPassword", {
                required: "Please confirm your new password",
                validate: (v) => v === newPassword || "Passwords do not match",
              })}
              type={showCp ? "text" : "password"}
              placeholder="Repeat new password"
              autoComplete="new-password"
              className={`${fieldCls(!!errors.ConfirmPassword && !!touchedFields.ConfirmPassword)} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowCp((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={showCp ? "Hide password" : "Show password"}
            >
              {showCp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.ConfirmPassword && touchedFields.ConfirmPassword && (
            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.ConfirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !otpComplete}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(135deg,#1660eb,#0d1a42)" }}
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Resetting password…</>
          ) : (
            <><ShieldCheck className="w-4 h-4" /> Reset Password</>
          )}
        </button>
      </form>
    </>
  );
};

const SuccessStep: React.FC<{ onGoLogin: () => void }> = ({ onGoLogin }) => (
  <>
    <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5 mx-auto">
      <CheckCircle className="w-8 h-8 text-emerald-500" />
    </div>
    <h1 className="font-display text-2xl font-700 text-navy-900 mb-2 text-center">
      Password Reset!
    </h1>
    <p className="text-slate-500 text-sm leading-relaxed text-center mb-8">
      Your password has been updated successfully. You can now sign in with your
      new password.
    </p>
    <button
      onClick={onGoLogin}
      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all duration-300"
      style={{ background: "linear-gradient(135deg,#1660eb,#0d1a42)" }}
    >
      Go to Sign In
    </button>
  </>
);

// ─── Step progress bar ────────────────────────────────────────────
const StepIndicator: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="flex items-center gap-2 mb-8">
    {Array.from({ length: total }).map((_, i) => (
      <React.Fragment key={i}>
        <div
          className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
            i < current
              ? "bg-primary-600"
              : i === current
                ? "bg-primary-300"
                : "bg-slate-200"
          }`}
        />
      </React.Fragment>
    ))}
  </div>
);

// ─── MAIN PAGE ────────────────────────────────────────────────────
type Step = "request" | "reset" | "success";

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const prefilledEmail = searchParams.get("email") ?? "";

  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState(prefilledEmail);

  const STEP_INDEX: Record<Step, number> = { request: 0, reset: 1, success: 2 };

  const leftPanelContent: Record<Step, { headline: string; sub: string }> = {
    request: {
      headline: "Forgot your password?",
      sub: "No worries — it happens. Enter your email and we'll send a reset code instantly.",
    },
    reset: {
      headline: "Check your inbox.",
      sub: "Enter the 6-digit code we emailed you, then choose a strong new password.",
    },
    success: {
      headline: "You're all set!",
      sub: "Your password has been reset. Sign back in to continue managing your account.",
    },
  };

  const panel = leftPanelContent[step];

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "linear-gradient(135deg,#080f28 0%,#133889 100%)" }}
    >
      {/* ── Left decorative panel (desktop only) ── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 relative overflow-hidden">
        {/* Blobs */}
        <div
          className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blob-1 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(22,96,235,0.2) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full blob-2 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-40 h-40 rounded-full blob-3 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)" }}
        />

        {/* Logo + back */}
        <div className="relative z-10 flex items-center justify-between">
          {/* Clickable logo — navigates to "/" */}
          <Link to="/" aria-label="Go to homepage">
            <img
              src="../../favicon.png"
              alt="Raz Tech"
              className="h-24 w-auto object-contain drop-shadow-lg transition-transform duration-300 hover:scale-105"
            />
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-medium transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Dynamic content */}
        <div className="relative z-10">
          <p
            key={step + "-headline"}
            className="text-5xl font-900 font-display text-white leading-tight mb-5"
            style={{ animation: "fadeUp .5s ease-out" }}
          >
            {panel.headline.split(".").map((part, i, arr) =>
              i === arr.length - 1 && part ? (
                <span key={i} className="text-gradient-gold">{part}.</span>
              ) : part ? (
                <span key={i}>{part}.<br /></span>
              ) : null,
            )}
          </p>
          <p
            key={step + "-sub"}
            className="text-white/50 text-lg leading-relaxed max-w-md"
            style={{ animation: "fadeUp .5s .1s ease-out both" }}
          >
            {panel.sub}
          </p>
        </div>

        {/* Stats strip */}
        <div className="relative z-10 flex gap-8">
          {[["500+", "Projects"], ["24/7", "Support"], ["98%", "Satisfaction"]].map(([val, label]) => (
            <div key={label}>
              <p className="text-2xl font-900 text-white">{val}</p>
              <p className="text-white/40 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-4 xs:p-6 sm:p-8 lg:p-16">
        <div className="w-full max-w-md">

          {/* Mobile logo + back */}
          <div className="flex lg:hidden items-center justify-between mb-8">
            {/* Clickable logo — navigates to "/" */}
            <Link to="/" aria-label="Go to homepage">
              <img
                src="../../favicon.png"
                alt="Raz Tech"
                className="h-20 xs:h-24 w-auto object-contain drop-shadow-lg transition-transform duration-300 hover:scale-105"
              />
            </Link>
            <Link
              to="/"
              className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Home
            </Link>
          </div>

          {/* Card */}
          <div
            className="bg-white rounded-3xl shadow-2xl p-6 xs:p-8 md:p-10"
            style={{ animation: "fadeUp .4s ease-out" }}
          >
            {step !== "success" && (
              <StepIndicator current={STEP_INDEX[step]} total={2} />
            )}

            <div key={step} style={{ animation: "fadeUp .35s ease-out" }}>
              {step === "request" && (
                <RequestCodeStep
                  onSuccess={(confirmedEmail) => {
                    setEmail(confirmedEmail);
                    setStep("reset");
                  }}
                />
              )}

              {step === "reset" && (
                <ResetPasswordStep
                  email={email}
                  onSuccess={() => setStep("success")}
                  onBack={() => setStep("request")}
                />
              )}

              {step === "success" && (
                <SuccessStep onGoLogin={() => navigate("/login")} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;