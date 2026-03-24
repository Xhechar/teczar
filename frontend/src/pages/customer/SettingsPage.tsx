import React, { useState } from "react";
import { Eye, EyeOff, Shield, Bell, Trash2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import CustomerLayout from "../../layouts/CustomerLayout";
import { toastResult, useToast } from "../../components/Toast";
import { AuthService } from "../../services/auth.service";

interface PasswordForm {
  CurrentPassword: string;
  NewPassword: string;
  ConfirmPassword: string;
}

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all";

const SettingsPage: React.FC = () => {
  let toast = useToast();

  const [showPws, setShowPws] = useState({
    current: false,
    newP: false,
    confirm: false,
  });
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PasswordForm>({ mode: "onTouched" });
  const newPw = watch("NewPassword");

  const onPwSubmit = async (data: PasswordForm) => {
    try {
      let result = await AuthService.ChangePassword({
        OldPassword: data.CurrentPassword,
        NewPassword: data.NewPassword,
      });
      toastResult(result, toast);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.ErrorMessage ?? "Unable to update password.",
      );
    }
  };

  const toggle = (key: "current" | "newP" | "confirm") =>
    setShowPws((p) => ({ ...p, [key]: !p[key] }));

  return (
    <CustomerLayout title="Settings" subtitle="Manage your account preferences">
      <div className="space-y-6">
        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-display font-700 text-navy-900">
                Change Password
              </h3>
              <p className="text-xs text-slate-400">Keep your account secure</p>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onPwSubmit)}
            className="space-y-4 max-w-md"
          >
            {(["current", "newP", "confirm"] as const).map((key, i) => {
              const fieldMap = {
                current: "CurrentPassword",
                newP: "NewPassword",
                confirm: "ConfirmPassword",
              } as const;
              const labels = {
                current: "Current Password",
                newP: "New Password",
                confirm: "Confirm New Password",
              };
              const field = fieldMap[key];
              return (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    {labels[key]}
                  </label>
                  <div className="relative">
                    <input
                      {...register(field, {
                        required: `${labels[key]} is required`,
                        ...(key === "newP"
                          ? {
                              minLength: {
                                value: 8,
                                message: "At least 8 characters",
                              },
                            }
                          : {}),
                        ...(key === "confirm"
                          ? {
                              validate: (v) =>
                                v === newPw || "Passwords do not match",
                            }
                          : {}),
                      })}
                      type={showPws[key] ? "text" : "password"}
                      placeholder="••••••••"
                      className={`${inputCls} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => toggle(key)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPws[key] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors[field] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[field]?.message}
                    </p>
                  )}
                </div>
              );
            })}
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300"
              style={{ background: "linear-gradient(135deg,#1660eb,#0d1a42)" }}
            >
              <Save className="w-4 h-4" /> Update Password
            </button>
          </form>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-display font-700 text-navy-900">
                Notifications
              </h3>
              <p className="text-xs text-slate-400">
                Choose how you receive updates
              </p>
            </div>
          </div>
          <div className="space-y-4 max-w-md">
            {[
              {
                label: "Email Notifications",
                desc: "Order updates, booking confirmations",
                state: emailNotifs,
                toggle: () => setEmailNotifs((p) => !p),
              },
              {
                label: "SMS Notifications",
                desc: "Receive texts for critical updates",
                state: smsNotifs,
                toggle: () => setSmsNotifs((p) => !p),
              },
            ].map(({ label, desc, state, toggle: tog }) => (
              <div
                key={label}
                className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-semibold text-navy-900">{label}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
                <button
                  onClick={tog}
                  className={`relative w-11 h-6 rounded-full transition-all duration-300 ${state ? "bg-primary-600" : "bg-slate-200"}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${state ? "translate-x-5" : ""}`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl shadow-card p-6 border border-red-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-display font-700 text-red-700">
                Danger Zone
              </h3>
              <p className="text-xs text-slate-400">
                Irreversible account actions
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-200">
            <Trash2 className="w-4 h-4" />
            Delete My Account
          </button>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default SettingsPage;