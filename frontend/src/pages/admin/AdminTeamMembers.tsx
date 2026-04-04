import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Users } from "lucide-react";
import { toastResult, useToast } from "../../components/Toast";
import { ModelType } from "../../enums/enums";
import { useSocketInvalidation } from "../../hooks/socket.hook";
import {
  FetchTeamMemberDto,
  CreateTeamMemberDto,
  UpdateTeamMemberDto,
} from "../../dtos/dto";
import { TeamMemberService } from "../../services/team.member.service";
import {
  Plus,
  Edit,
  Trash2,
  UserCircle2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import AdminLayout from "./layouts/AdminLayout";
import { PageHeader, ActionButton, SkeletonList, EmptyState, ListCard, IconButton, SlideOver, FormField, inputCls, CloudinaryUpload, SubmitButton, ConfirmModal } from "./components/AdminUI";

export const AdminTeamMembers: React.FC = () => {
  useSocketInvalidation(ModelType.TeamMember);
  const toast = useToast();

  const [panelMode, setPanel] = useState<"create" | "edit" | null>(null);
  const [editItem, setEditItem] = useState<FetchTeamMemberDto | null>(null);
  const [confirmDel, setConfirmDel] = useState<FetchTeamMemberDto | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: [ModelType.TeamMember.toLowerCase()],
    queryFn: () => TeamMemberService.FetchAll(),
  });

  React.useEffect(() => {
    if (isError) toast.error("Failed to load team members");
    // eslint-disable-next-line
  }, [isError]);

  const members = data?.DataList ?? [];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateTeamMemberDto & { IsActive: boolean }>();

  const openCreate = () => {
    setEditItem(null);
    setImageUrl("");
    reset({ Name: "", Role: "", Bio: "", IsActive: true });
    setPanel("create");
  };

  const openEdit = (m: FetchTeamMemberDto) => {
    setEditItem(m);
    setImageUrl(m.ImageUrl ?? "");
    reset({
      Name: m.Name,
      Role: m.Role,
      Bio: m.Bio ?? "",
      IsActive: m.IsActive,
    });
    setPanel("edit");
  };

  const onSubmit = async (v: CreateTeamMemberDto & { IsActive: boolean }) => {
    if (!imageUrl) {
      toast.error("Please upload a photo for this team member.");
      return;
    }
    setSaving(true);
    try {
      const r =
        panelMode === "create"
          ? await TeamMemberService.Create({
              Name: v.Name,
              Role: v.Role,
              ImageUrl: imageUrl,
              Bio: v.Bio,
              IsActive: v.IsActive ?? true,
            } as CreateTeamMemberDto)
          : await TeamMemberService.Update(editItem!.MemberId, {
              Name: v.Name,
              Role: v.Role,
              ImageUrl: imageUrl,
              Bio: v.Bio,
              IsActive: v.IsActive,
            } as UpdateTeamMemberDto);
      toastResult(r, toast);
      if (r.Success) setPanel(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.ErrorMessage ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    setDeleting(true);
    try {
      const r = await TeamMemberService.Delete(confirmDel!.MemberId);
      toastResult(r, toast);
      if (r.Success) setConfirmDel(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.ErrorMessage ?? "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  // Quick-toggle IsActive without opening the panel
  const toggleActive = async (m: FetchTeamMemberDto) => {
    try {
      const r = await TeamMemberService.Update(m.MemberId, {
        IsActive: !m.IsActive,
      } as UpdateTeamMemberDto);
      toastResult(r, toast);
    } catch (error: any) {
      toast.error(error?.response?.data?.ErrorMessage ?? "Update failed");
    }
  };

  return (
    <AdminLayout title="Team Members">
      <PageHeader
        title="Team Members"
        subtitle={`${members.length} member${members.length !== 1 ? "s" : ""}`}
        breadcrumb={["Admin", "Team Members"]}
        action={
          <ActionButton
            onClick={openCreate}
            icon={Plus}
            label="Add Member"
            variant="primary"
            size="md"
          />
        }
      />

      {isLoading ? (
        <SkeletonList />
      ) : members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No team members yet"
          description="Add your first team member to display them on the public team page."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {members.map((m: FetchTeamMemberDto) => (
            <ListCard key={m.MemberId}>
              {/* Photo */}
              <div className="w-full h-36 rounded-lg overflow-hidden bg-slate-100 mb-3 border border-slate-100 flex items-center justify-center">
                {m.ImageUrl ? (
                  <img
                    src={m.ImageUrl}
                    alt={m.Name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <UserCircle2 className="w-14 h-14 text-slate-300" />
                )}
              </div>

              {/* Info + actions */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-900 truncate">
                    {m.Name}
                  </p>
                  <p className="text-xs text-primary-600 font-medium truncate">
                    {m.Role}
                  </p>
                  {m.Bio && (
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {m.Bio}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <IconButton
                    onClick={() => openEdit(m)}
                    icon={Edit}
                    label="Edit"
                    variant="ghost"
                  />
                  <IconButton
                    onClick={() => setConfirmDel(m)}
                    icon={Trash2}
                    label="Delete"
                    variant="danger"
                  />
                </div>
              </div>

              {/* Active toggle */}
              <button
                onClick={() => toggleActive(m)}
                className={`mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  m.IsActive
                    ? "bg-green-50 text-green-600 hover:bg-green-100"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
                title={
                  m.IsActive
                    ? "Click to hide from public page"
                    : "Click to show on public page"
                }
              >
                {m.IsActive ? (
                  <>
                    <ToggleRight className="w-3.5 h-3.5" /> Visible
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-3.5 h-3.5" /> Hidden
                  </>
                )}
              </button>
            </ListCard>
          ))}
        </div>
      )}

      {/* Create / Edit slide-over */}
      <SlideOver
        open={!!panelMode}
        onClose={() => setPanel(null)}
        title={panelMode === "create" ? "New Team Member" : "Edit Team Member"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Full Name" required error={errors.Name?.message}>
            <input
              {...register("Name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Name cannot exceed 100 characters",
                },
              })}
              placeholder="e.g. Jane Wanjiku"
              className={inputCls(!!errors.Name)}
            />
          </FormField>

          <FormField
            label="Role / Position"
            required
            error={errors.Role?.message}
          >
            <input
              {...register("Role", {
                required: "Role is required",
                minLength: {
                  value: 2,
                  message: "Role must be at least 2 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Role cannot exceed 100 characters",
                },
              })}
              placeholder="e.g. Lead Solar Engineer"
              className={inputCls(!!errors.Role)}
            />
          </FormField>

          <CloudinaryUpload
            label="Profile Photo"
            value={imageUrl}
            onChange={setImageUrl}
          />

          <FormField label="Bio" error={errors.Bio?.message}>
            <textarea
              {...register("Bio", {
                maxLength: {
                  value: 500,
                  message: "Bio cannot exceed 500 characters",
                },
              })}
              rows={4}
              placeholder="A short description about this team member…"
              className={`${inputCls(!!errors.Bio)} resize-none`}
            />
            {/* Character count hint */}
            <p className="text-[11px] text-slate-400 mt-1 text-right">
              {watch("Bio")?.length ?? 0} / 500
            </p>
          </FormField>

          {/* IsActive toggle */}
          <FormField label="Visibility">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                {...register("IsActive")}
                className="w-4 h-4 rounded accent-primary-600"
              />
              <span className="text-sm text-slate-600">
                Show on public team page
              </span>
            </label>
          </FormField>

          <SubmitButton
            loading={saving}
            label={panelMode === "create" ? "Add Member" : "Save Changes"}
          />
        </form>
      </SlideOver>

      {/* Delete confirmation */}
      <ConfirmModal
        open={!!confirmDel}
        title="Remove Team Member"
        message={`Remove "${confirmDel?.Name}" from the team? This cannot be undone.`}
        loading={deleting}
        onConfirm={doDelete}
        onCancel={() => setConfirmDel(null)}
      />
    </AdminLayout>
  );
};

export default AdminTeamMembers;