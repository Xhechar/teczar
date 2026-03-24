import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Users,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import {
  PageHeader,
  FilterBar,
  ListCard,
  SkeletonList,
  StatusBadge,
  SearchBar,
  FilterSelect,
  IconButton,
  ActionButton,
  ConfirmModal,
  EmptyState,
  SlideOver,
  FormField,
  inputCls,
  SectionDivider,
  SubmitButton,
} from "./components/AdminUI";
import { useToast, toastResult } from "../../components/Toast";
import { ModelType, UserRole } from "../../enums/enums";
import { useSocketInvalidation } from "../../hooks/socket.hook";
import { User } from "../../interfaces/interfaces";
import AdminLayout from "./layouts/AdminLayout";
import { UserService } from "../../services/user.service";

const KENYA_COUNTIES = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Uasin Gishu",
  "Kilifi",
  "Kakamega",
  "Kisii",
  "Meru",
  "Kiambu",
  "Machakos",
  "Kajiado",
  "Nyeri",
  "Murang'a",
  "Embu",
  "Homa Bay",
  "Migori",
  "Siaya",
  "Bungoma",
  "Vihiga",
  "Busia",
  "Trans Nzoia",
  "West Pokot",
  "Samburu",
  "Turkana",
  "Baringo",
  "Laikipia",
  "Nandi",
  "Kericho",
  "Bomet",
  "Narok",
  "Tana River",
  "Garissa",
  "Wajir",
  "Mandera",
  "Marsabit",
  "Isiolo",
  "Tharaka-Nithi",
  "Kitui",
  "Makueni",
  "Nyandarua",
  "Kirinyaga",
  "Kwale",
  "Taita/Taveta",
  "Lamu",
];

const AdminUsers: React.FC = () => {
  useSocketInvalidation(ModelType.User);
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [roleFilter, setRole] = useState("all");
  const [statusFilter, setStatus] = useState("all");
  const [countyFilter, setCounty] = useState("all");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [confirmDelete, setConfirmDel] = useState<User | null>(null);
  const [confirmToggle, setConfirmTog] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: [ModelType.User.toLowerCase()],
    queryFn: () => UserService.FetchAll(),
  });

  React.useEffect(() => {
    if (isError) toast.error("Failed to load users");
  }, [isError]);

  const users = useMemo(() => {
    let list = data?.DataList ?? [];
    if (roleFilter !== "all") list = list.filter((u) => u.Role === roleFilter);
    if (statusFilter === "active") list = list.filter((u) => u.IsActive);
    if (statusFilter === "inactive") list = list.filter((u) => !u.IsActive);
    if (countyFilter !== "all")
      list = list.filter((u) => u.County === countyFilter);
    if (search)
      list = list.filter((u) =>
        `${u.FirstName} ${u.SecondName} ${u.Email} ${u.Phone}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
    return list;
  }, [data, roleFilter, statusFilter, countyFilter, search]);

  const availableCounties = useMemo(() => {
    const set = new Set((data?.DataList ?? []).map((u) => u.County));
    return Array.from(set).sort();
  }, [data]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<User>>();
  const openEdit = (u: User) => {
    setEditUser(u);
    reset(u);
  };

  const onEditSubmit = async (values: Partial<User>) => {
    if (!editUser) return;
    setSaving(true);
    try {
      const result = await UserService.AdminUpdate(editUser.UserId, {
        FirstName: values.FirstName,
        SecondName: values.SecondName,
        County: values.County,
        LocationDescription: values.LocationDescription,
      });
      toastResult(result, toast);
      if (result.Success) setEditUser(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.ErrorMessage ?? "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      const result = await UserService.Delete(confirmDelete.UserId);
      toastResult(result, toast);
      if (result.Success) setConfirmDel(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.ErrorMessage ?? "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggle = async () => {
    if (!confirmToggle) return;
    setToggling(true);
    try {
      const result = await UserService.ToggleActivate(confirmToggle.UserId);
      toastResult(result, toast);
      if (result.Success) setConfirmTog(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.ErrorMessage ?? "Toggle failed");
    } finally {
      setToggling(false);
    }
  };

  return (
    <AdminLayout title="Users">
      <PageHeader
        title="Users"
        subtitle={`${users.length} user${users.length !== 1 ? "s" : ""}`}
        breadcrumb={["Admin", "Users"]}
      />

      <FilterBar>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name, email, phone…"
        />
        <FilterSelect
          value={roleFilter}
          onChange={setRole}
          placeholder="All Roles"
          options={Object.values(UserRole).map((r) => ({ value: r, label: r }))}
        />
        <FilterSelect
          value={statusFilter}
          onChange={setStatus}
          placeholder="All Status"
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
        <FilterSelect
          value={countyFilter}
          onChange={setCounty}
          placeholder="All Counties"
          options={availableCounties.map((c) => ({ value: c, label: c }))}
        />
      </FilterBar>

      {isLoading ? (
        <SkeletonList />
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description="Try adjusting your filters."
        />
      ) : (
        <div className="space-y-2">
          {users.map((user) => (
            <ListCard key={user.UserId}>
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar */}
                <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-navy-600 flex items-center justify-center text-white text-xs font-bold">
                  {user.FirstName[0]}
                  {user.SecondName[0]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-semibold text-sm text-slate-900">
                      {user.FirstName} {user.SecondName}
                    </span>
                    <StatusBadge status={user.Role} />
                    <StatusBadge
                      status={user.IsActive ? "Active" : "Inactive"}
                    />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span className="truncate max-w-[160px] sm:max-w-none">
                        {user.Email}
                      </span>
                    </span>
                    <span className="hidden sm:flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {user.Phone}
                    </span>
                    <span className="hidden md:flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {user.County}
                    </span>
                    <span className="hidden lg:flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(user.CreatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions — icon-only, compact */}
                <div className="shrink-0 flex items-center gap-1">
                  <IconButton
                    onClick={() => openEdit(user)}
                    icon={Edit}
                    label="Edit user"
                    variant="ghost"
                  />
                  <IconButton
                    onClick={() => setConfirmTog(user)}
                    icon={user.IsActive ? ToggleLeft : ToggleRight}
                    label={user.IsActive ? "Deactivate" : "Activate"}
                    variant={user.IsActive ? "warning" : "success"}
                    disabled={user.Role === UserRole.Admin}
                  />
                  <IconButton
                    onClick={() => setConfirmDel(user)}
                    icon={Trash2}
                    label="Delete user"
                    variant="danger"
                    disabled={user.Role === UserRole.Admin}
                  />
                </div>
              </div>
            </ListCard>
          ))}
        </div>
      )}

      {/* Edit panel */}
      <SlideOver
        open={!!editUser}
        onClose={() => setEditUser(null)}
        title="Edit User"
        subtitle={
          editUser ? `${editUser.FirstName} ${editUser.SecondName}` : ""
        }
        width="lg"
      >
        <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
          <SectionDivider label="Personal Info" />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="First Name"
              required
              error={errors.FirstName?.message}
            >
              <input
                {...register("FirstName", {
                  required: "Required",
                  minLength: { value: 2, message: "Too short" },
                })}
                className={inputCls(!!errors.FirstName)}
              />
            </FormField>
            <FormField
              label="Last Name"
              required
              error={errors.SecondName?.message}
            >
              <input
                {...register("SecondName", {
                  required: "Required",
                  minLength: { value: 2, message: "Too short" },
                })}
                className={inputCls(!!errors.SecondName)}
              />
            </FormField>
          </div>
          <FormField label="Email" required error={errors.Email?.message}>
            <input
              {...register("Email", {
                required: "Required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email",
                },
              })}
              type="email"
              className={inputCls(!!errors.Email)}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Phone" error={errors.Phone?.message}>
              <input
                {...register("Phone", {
                    pattern: {
                      value: /^(\+254|0)\s?7\d{2}[\s-]?\d{3}[\s-]?\d{3}$/,
                      message: "Enter a valid Kenyan phone number (e.g. 0712345678 or +254712345678)",
                    },
                })}
                className={inputCls(!!errors.Phone)}
                placeholder="0712 345 678"
              />
            </FormField>
            <FormField label="County">
              <select {...register("County")} className={inputCls()}>
                {KENYA_COUNTIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
          <FormField
            label="Location Description"
            hint="Street or landmark (optional)"
          >
            <input
              {...register("LocationDescription")}
              className={inputCls()}
              placeholder="e.g. Westlands, near ABC Mall"
            />
          </FormField>

          <SectionDivider label="Account Settings" />
          <FormField label="Role">
            <select {...register("Role")} className={inputCls()}>
              {Object.values(UserRole).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </FormField>
          <div className="flex gap-5">
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                {...register("IsActive")}
                className="w-3.5 h-3.5 rounded"
              />{" "}
              Account Active
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                {...register("IsWelcomed")}
                className="w-3.5 h-3.5 rounded"
              />{" "}
              Welcomed
            </label>
          </div>
          <SubmitButton loading={saving} label="Save Changes" />
        </form>
      </SlideOver>

      {/* Confirm delete */}
      <ConfirmModal
        open={!!confirmDelete}
        title="Soft-Delete User"
        message={`Remove ${confirmDelete?.FirstName} ${confirmDelete?.SecondName}? Their data is preserved but the account will be hidden.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDel(null)}
      />

      {/* Confirm toggle */}
      <ConfirmModal
        open={!!confirmToggle}
        title={confirmToggle?.IsActive ? "Deactivate User" : "Activate User"}
        message={`${confirmToggle?.IsActive ? "Deactivating" : "Activating"} ${confirmToggle?.FirstName} will ${confirmToggle?.IsActive ? "block their login." : "restore their access."}`}
        confirmLabel={confirmToggle?.IsActive ? "Deactivate" : "Activate"}
        variant={confirmToggle?.IsActive ? "danger" : "warning"}
        loading={toggling}
        onConfirm={handleToggle}
        onCancel={() => setConfirmTog(null)}
      />
    </AdminLayout>
  );
};

export default AdminUsers;