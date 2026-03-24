import React from "react";
import { useForm } from "react-hook-form";
import { Save, User } from "lucide-react";
import CustomerLayout from "../layouts/CustomerLayout";
import { useSocketInvalidation } from "../hooks/socket.hook";
import { ModelType } from "../enums/enums";
import { toastResult, useToast } from "../components/Toast";
import { useQuery } from "@tanstack/react-query";
import { UserService } from "../services/user.service";
import { queryClient } from "..";

interface ProfileForm {
  FirstName: string;
  SecondName: string;
  Email: string;
  Phone: string;
  County: string;
  LocationDescription: string;
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

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all";

const ProfilePage: React.FC = () => {
  let toast = useToast();

  let {data: user} = useQuery({
    queryKey: [`user-profile`],
    queryFn: () => UserService.FetchById()
  });

  let currentUser = user?.Data;

  const { register, handleSubmit } = useForm<ProfileForm>({
    defaultValues: {
      FirstName: currentUser?.FirstName,
      SecondName: currentUser?.SecondName,
      Email: currentUser?.Email,
      Phone: currentUser?.Phone,
      County: currentUser?.County,
      LocationDescription: currentUser?.LocationDescription,
    },
  });

  const onSubmit = async(data: ProfileForm) => {
    try {
      let result = await UserService.Update(data);
      toastResult(result, toast);
      if(result.Success) queryClient.invalidateQueries({queryKey: [`user-profile`]});
    } catch (error: any) {
      toast.error(
        error?.response?.data?.ErrorMessage ?? "Unable to update profile.");
    }
  };

  return (
    <CustomerLayout
      title="My Profile"
      subtitle="Manage your personal information"
    >
      <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-navy-600 flex items-center justify-center text-white text-2xl font-900">
            {currentUser?.FirstName[0].toUpperCase()}{currentUser?.SecondName[0].toUpperCase()}
          </div>
          <div>
            <h2 className="font-display text-xl font-700 text-navy-900">
              {currentUser?.FirstName}{" "}{currentUser?.SecondName}
            </h2>
            <p className="text-slate-400 text-sm">Customer Account</p>
            <button className="mt-2 text-xs text-primary-600 font-semibold hover:underline flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              Change Photo
            </button>
          </div>
        </div>

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
              <input {...register("Phone")} className={inputCls} />
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
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300"
              style={{ background: "linear-gradient(135deg,#1660eb,#0d1a42)" }}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </CustomerLayout>
  );
};

export default ProfilePage;