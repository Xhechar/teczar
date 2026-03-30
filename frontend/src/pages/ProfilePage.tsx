import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Save, User, Loader2 } from "lucide-react";
import { queryClient } from "..";
import { useToast, toastResult } from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import CustomerLayout from "../layouts/CustomerLayout";
import { UserService } from "../services/user.service";

interface ProfileForm {
  FirstName: string;
  SecondName: string;
  Email: string;
  Phone: string;
  County: string;
  LocationDescription: string;
}

// ─── Counties ────────────────────────────────────────────────────
const KENYA_COUNTIES = [
  "Mombasa","Kwale","Kilifi","Tana River","Lamu","Taita/Taveta","Garissa",
  "Wajir","Mandera","Marsabit","Isiolo","Meru","Tharaka-Nithi","Embu",
  "Kitui","Machakos","Makueni","Nyandarua","Nyeri","Kirinyaga","Murang'a",
  "Kiambu","Turkana","West Pokot","Samburu","Trans Nzoia","Uasin Gishu",
  "Elgeyo/Marakwet","Nandi","Baringo","Laikipia","Nakuru","Narok","Kajiado",
  "Kericho","Bomet","Kakamega","Vihiga","Bungoma","Busia","Siaya","Kisumu",
  "Homa Bay","Migori","Kisii","Nyamira","Nairobi",
];

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all bg-white";

// ─── Skeleton ─────────────────────────────────────────────────────
const ProfileSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-card p-6 md:p-8 space-y-6">
    <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
      <div className="skeleton w-20 h-20 rounded-2xl" />
      <div className="space-y-2 flex-1">
        <div className="skeleton h-5 w-40 rounded-lg" />
        <div className="skeleton h-3.5 w-28 rounded-lg" />
      </div>
    </div>
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="skeleton h-12 rounded-xl" />
      <div className="skeleton h-12 rounded-xl" />
    </div>
    <div className="skeleton h-12 rounded-xl" />
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="skeleton h-12 rounded-xl" />
      <div className="skeleton h-12 rounded-xl" />
    </div>
    <div className="skeleton h-24 rounded-xl" />
    <div className="flex justify-end">
      <div className="skeleton h-12 w-36 rounded-xl" />
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────
const ProfilePage: React.FC = () => {
  const toast = useToast();
  const { user: authUser } = useAuth();

  let { data, isLoading, isError } = useQuery({
    queryKey: [`user-profile`],
    queryFn: () => UserService.FetchById(),
  });

  const currentUser = data?.Data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<ProfileForm>();

  useEffect(() => {
    if (!currentUser) return;
    reset({
      FirstName:           currentUser.FirstName           ?? "",
      SecondName:          currentUser.SecondName          ?? "",
      Email:               currentUser.Email               ?? "",
      Phone:               currentUser.Phone               ?? "",
      County:              currentUser.County              ?? "Nairobi",
      LocationDescription: currentUser.LocationDescription ?? "",
    });
  }, [currentUser, reset]);

const onSubmit = async (data: ProfileForm) => {
  try {
    let result = await UserService.Update({
      FirstName: data.FirstName,
      SecondName: data.SecondName,
      County: data.County,
      LocationDescription: data.LocationDescription,
    });
    toastResult(result, toast);
    if (result.Success)
      queryClient.invalidateQueries({ queryKey: [`user-profile`] });
  } catch (error: any) {
    toast.error(
      error?.response?.data?.ErrorMessage ?? "Unable to update profile.",
    );
  }
};

  if (isLoading) return (
    <CustomerLayout title="My Profile" subtitle="Manage your personal information">
      <ProfileSkeleton />
    </CustomerLayout>
  );

  if (isError || !currentUser) return (
    <CustomerLayout title="My Profile" subtitle="Manage your personal information">
      <div className="bg-white rounded-2xl shadow-card p-8 text-center">
        <p className="text-slate-500 text-sm">
          Could not load profile. Please refresh the page or{" "}
          <button onClick={() => queryClient.invalidateQueries({ queryKey: ["user-profile"] })}
            className="text-primary-600 font-semibold hover:underline">
            try again
          </button>.
        </p>
      </div>
    </CustomerLayout>
  );

  const initials = [
    (currentUser?.FirstName ?? authUser?.FirstName ?? "?")[0],
    (currentUser?.SecondName ?? authUser?.SecondName ?? "")[0],
  ].join("").toUpperCase();

  const displayName = `${currentUser?.FirstName ?? ""} ${currentUser?.SecondName ?? ""}`.trim();

  return (
    <CustomerLayout
      title="My Profile"
      subtitle="Manage your personal information"
    >
      <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
        {/* Avatar header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-navy-600 flex items-center justify-center text-white text-2xl font-900 shrink-0">
            {initials}
          </div>
          <div>
            <h2 className="font-display text-xl font-700 text-navy-900">
              {displayName}
            </h2>
            <p className="text-slate-400 text-sm capitalize">
              {currentUser.Role} Account
            </p>
            <button
              type="button"
              className="mt-2 text-xs text-primary-600 font-semibold hover:underline flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5" />
              Change Photo
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                First Name
              </label>
              <input {...register("FirstName")} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Last Name
              </label>
              <input {...register("SecondName")} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Email Address
            </label>
            <input {...register("Email")} type="email" className={inputCls} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Phone Number
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
                className={inputCls}
                placeholder="0712 345 678"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                County
              </label>
              <select
                {...register("County")}
                className={`${inputCls} cursor-pointer`}
              >
                {KENYA_COUNTIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Location Description{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              {...register("LocationDescription")}
              rows={3}
              placeholder="e.g. Westlands, near ABC Mall, House No. 5..."
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Unsaved changes indicator */}
          {isDirty && (
            <p className="text-xs text-amber-600 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
              You have unsaved changes
            </p>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg,#1660eb,#0d1a42)" }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </CustomerLayout>
  );
};

export default ProfilePage;