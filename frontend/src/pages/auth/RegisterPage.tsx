import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, UserPlus, AlertCircle, ArrowLeft } from "lucide-react";
import { toastResult, useToast } from "../../components/Toast";
import { UserService } from "../../services/user.service";
import { CreateUserDto } from "../../dtos/dto";

interface RegisterForm {
  FirstName: string;
  SecondName: string;
  Email: string;
  Phone: string;
  County: string;
  Password: string;
  ConfirmPassword: string;
}

const KENYA_COUNTIES = [
  "Mombasa",
  "Kwale",
  "Kilifi",
  "Tana River",
  "Lamu",
  "Taita/Taveta",
  "Garissa",
  "Wajir",
  "Mandera",
  "Marsabit",
  "Isiolo",
  "Meru",
  "Tharaka-Nithi",
  "Embu",
  "Kitui",
  "Machakos",
  "Makueni",
  "Nyandarua",
  "Nyeri",
  "Kirinyaga",
  "Murang'a",
  "Kiambu",
  "Turkana",
  "West Pokot",
  "Samburu",
  "Trans Nzoia",
  "Uasin Gishu",
  "Elgeyo/Marakwet",
  "Nandi",
  "Baringo",
  "Laikipia",
  "Nakuru",
  "Narok",
  "Kajiado",
  "Kericho",
  "Bomet",
  "Kakamega",
  "Vihiga",
  "Bungoma",
  "Busia",
  "Siaya",
  "Kisumu",
  "Homa Bay",
  "Migori",
  "Kisii",
  "Nyamira",
  "Nairobi",
];

const RegisterPage: React.FC = () => {
  const [showPw, setShowPw] = useState(false);
  const [showCp, setShowCp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let toast = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
    reset,
  } = useForm<RegisterForm>({ mode: "all" });

  const password = watch("Password");

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setError("");
    try {
      let regData: CreateUserDto = {
        FirstName: data.FirstName,
        SecondName: data.SecondName,
        Email: data.Email,
        Phone: data.Phone,
        County: data.County,
        LocationDescription: undefined,
        Password: data.Password,
      };
      let result = await UserService.Create(regData);

      toastResult(result, toast);

      if (result.Success) {
        reset();
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error: any) {
      console.log(error);
      setError(
        error.response.data.ErrorMessage ??
          "Registration failed. Please try again.",
      );
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
      className="min-h-screen flex items-center justify-center p-4 xs:p-6 py-12 xs:py-16 sm:py-20"
      style={{ background: "linear-gradient(135deg,#080f28 0%,#133889 100%)" }}
    >
      <div className="w-full max-w-2xl">
        {/* Logo + back link */}
        <div className="flex items-center justify-between mb-6 xs:mb-8">
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
            className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-medium transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 xs:p-8 md:p-10">
          <div className="mb-6 xs:mb-8">
            <h1 className="font-display text-2xl xs:text-3xl font-700 text-navy-900 mb-1">
              Create Account
            </h1>
            <p className="text-slate-500 text-sm">
              Join Raz Technologies to order products and book services
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 xs:space-y-5"
            noValidate
          >
            {/* Name row */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("FirstName", {
                    required: "First name is required",
                    minLength: { value: 2, message: "Too short" },
                  })}
                  placeholder="James"
                  className={inputCls(!!errors.FirstName)}
                />
                {errors.FirstName && touchedFields.FirstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.FirstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("SecondName", {
                    required: "Last name is required",
                    minLength: { value: 2, message: "Too short" },
                  })}
                  placeholder="Kamau"
                  className={inputCls(!!errors.SecondName)}
                />
                {errors.SecondName && touchedFields.SecondName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.SecondName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
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

            {/* Phone + County */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("Phone", {
                    required: "Phone is required",
                    pattern: {
                      value: /^(\+254|0)(7\d{2}|1\d{2})[\s-]?\d{3}[\s-]?\d{3}$/,
                      message:
                        "Enter a valid Kenyan phone number (e.g. 0712345678, 0112345678, +254712345678, or +254112345678)",
                    },
                  })}
                  placeholder="0712 345 678"
                  type="tel"
                  className={inputCls(!!errors.Phone)}
                />
                {errors.Phone && touchedFields.Phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.Phone.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  County <span className="text-red-400">*</span>
                </label>
                <select
                  {...register("County", { required: "County is required" })}
                  className={`${inputCls(!!errors.County)} cursor-pointer`}
                >
                  <option value="">Select county…</option>
                  {KENYA_COUNTIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.County && touchedFields.County && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.County.message}
                  </p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register("Password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "At least 8 characters required",
                      },
                    })}
                    type={showPw ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    className={`${inputCls(!!errors.Password)} pr-11`}
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
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register("ConfirmPassword", {
                      required: "Please confirm your password",
                      validate: (v) =>
                        v === password || "Passwords do not match",
                    })}
                    type={showCp ? "text" : "password"}
                    placeholder="Repeat password"
                    className={`${inputCls(!!errors.ConfirmPassword)} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCp((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCp ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.ConfirmPassword && touchedFields.ConfirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.ConfirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 xs:py-3.5 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg,#1660eb,#0d1a42)" }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                  Creating account…
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Create Account
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5 xs:mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-600 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;