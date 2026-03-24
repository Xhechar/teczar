import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Images,
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Monitor,
} from "lucide-react";
import {
  PageHeader,
  FilterBar,
  ListCard,
  SkeletonList,
  StatusBadge,
  FilterSelect,
  ActionButton,
  IconButton,
  ConfirmModal,
  EmptyState,
  SlideOver,
  FormField,
  inputCls,
  CloudinaryUpload,
  SectionDivider,
  SubmitButton,
} from "./components/AdminUI";
import { useToast, toastResult } from "../../components/Toast";
import { CreateHeroSlideDto, UpdateHeroSlideDto } from "../../dtos/dto";
import { AdminSliderService, dummyHeroSlides } from "../../dummy/dummy";
import { ModelType } from "../../enums/enums";
import { useSocketInvalidation } from "../../hooks/socket.hook";
import { HeroSlide } from "../../interfaces/interfaces";
import AdminLayout from "./layouts/AdminLayout";
import { HeroSliderService } from "../../services/hero.slider.service";

// ─── Tag options (match TAG_ICON_MAP in HeroSection) ─────────────
const TAG_OPTIONS = [
  "Solar Installation",
  "CCTV & Security",
  "Electrical Works",
  "Internet & WiFi",
  "Electric Fencing",
  "Intercom & Access Control",
  "Plumbing Services",
  "Electronic Repairs",
  "Custom",
];

// ─── CTA Link suggestions ─────────────────────────────────────────
const CTA_LINK_OPTIONS = [
  { label: "Services page", value: "/explore?tab=services" },
  { label: "Products page", value: "/explore?tab=products" },
  { label: "Contact section", value: "/#contact" },
  { label: "About section", value: "/#about" },
  { label: "Careers page", value: "/careers" },
];

// ─── LIVE PREVIEW ─────────────────────────────────────────────────
const SlidePreview: React.FC<{ slide: Partial<HeroSlide> }> = ({ slide }) => (
  <div
    className="relative rounded-xl overflow-hidden aspect-[16/7] bg-slate-900 select-none"
    style={
      slide.ImageUrl
        ? {
            backgroundImage: `url(${slide.ImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }
        : undefined
    }
  >
    {/* Overlays */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(to bottom,rgba(8,15,40,.55) 0%,rgba(8,15,40,.85) 100%)",
      }}
    />
    <div className="absolute inset-0 p-5 flex flex-col justify-end">
      {slide.Tag && (
        <span className="inline-flex items-center self-start bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] font-semibold text-white/90 uppercase tracking-widest mb-2">
          {slide.Tag}
        </span>
      )}
      <p className="text-white font-bold text-lg leading-tight">
        {slide.Title || <span className="text-white/30 italic">Title</span>}
        {slide.TitleAccent && (
          <span
            className="block"
            style={{
              background: "linear-gradient(135deg,#f59e0b,#f97316)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {slide.TitleAccent}
          </span>
        )}
      </p>
      {slide.Description && (
        <p className="text-white/60 text-xs mt-1 line-clamp-2">
          {slide.Description}
        </p>
      )}
      {slide.CtaLabel && (
        <div className="mt-2 inline-flex items-center gap-1.5 bg-primary-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg self-start">
          {slide.CtaLabel}
        </div>
      )}
    </div>
    {!slide.ImageUrl && (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-white/20">
          <Monitor className="w-8 h-8" />
          <p className="text-xs">Upload an image to preview</p>
        </div>
      </div>
    )}
  </div>
);

// ─── SLIDE ROW CARD ───────────────────────────────────────────────
const SlideRow: React.FC<{
  slide: HeroSlide;
  isFirst: boolean;
  isLast: boolean;
  onEdit: (s: HeroSlide) => void;
  onDelete: (s: HeroSlide) => void;
  onToggle: (s: HeroSlide) => void;
  onMoveUp: (s: HeroSlide) => void;
  onMoveDown: (s: HeroSlide) => void;
}> = ({
  slide,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  onToggle,
  onMoveUp,
  onMoveDown,
}) => (
  <ListCard>
    <div className="flex items-center gap-3 min-w-0">
      {/* Sort order badge */}
      <div className="shrink-0 w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
        {slide.SortOrder}
      </div>

      {/* Thumbnail */}
      <div className="shrink-0 w-20 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
        {slide.ImageUrl ? (
          <img
            src={slide.ImageUrl}
            alt={slide.Tag}
            className="w-full h-full object-cover"
          />
        ) : (
          <Images className="w-5 h-5 text-slate-300 m-auto mt-3" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="font-semibold text-sm text-slate-900 truncate max-w-[180px] sm:max-w-xs">
            {slide.Title} {slide.TitleAccent}
          </span>
          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full whitespace-nowrap">
            {slide.Tag}
          </span>
          <StatusBadge status={slide.IsActive ? "Active" : "Inactive"} />
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
          <span className="truncate max-w-[220px] hidden sm:block">
            {slide.Description}
          </span>
          <span className="hidden md:block shrink-0">
            CTA:{" "}
            <span className="text-slate-600 font-medium">{slide.CtaLabel}</span>
          </span>
          <span className="shrink-0">
            → <span className="font-mono">{slide.CtaLink}</span>
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="shrink-0 flex items-center gap-1">
        {/* Reorder */}
        <IconButton
          onClick={() => onMoveUp(slide)}
          icon={ArrowUp}
          label="Move up"
          variant="ghost"
          disabled={isFirst}
        />
        <IconButton
          onClick={() => onMoveDown(slide)}
          icon={ArrowDown}
          label="Move down"
          variant="ghost"
          disabled={isLast}
        />
        {/* Toggle visibility */}
        <IconButton
          onClick={() => onToggle(slide)}
          icon={slide.IsActive ? Eye : EyeOff}
          label={slide.IsActive ? "Hide slide" : "Show slide"}
          variant={slide.IsActive ? "success" : "warning"}
        />
        <IconButton
          onClick={() => onEdit(slide)}
          icon={Edit}
          label="Edit slide"
          variant="ghost"
        />
        <IconButton
          onClick={() => onDelete(slide)}
          icon={Trash2}
          label="Delete slide"
          variant="danger"
        />
      </div>
    </div>
  </ListCard>
);

const AdminSlider: React.FC = () => {
  useSocketInvalidation(ModelType.HeroSlide);
  const toast = useToast();

  const [activeFilter, setActiveFilter] = useState("all");
  const [panelMode, setPanelMode] = useState<"create" | "edit" | null>(null);
  const [editSlide, setEditSlide] = useState<HeroSlide | null>(null);
  const [confirmDel, setConfirmDel] = useState<HeroSlide | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  const [previewData, setPreviewData] = useState<Partial<HeroSlide>>({});
  const [imageUrl, setImageUrl] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: [ModelType.HeroSlide.toLowerCase()],
    queryFn: () => HeroSliderService.FetchAll(),
  });

  React.useEffect(() => {
    if (isError) toast.error("Failed to load slides", "Please refresh.");
  }, [isError]);

  const slides = useMemo(() => {
    let list: HeroSlide[] = data?.DataList ?? [];
    if (activeFilter === "active") list = list.filter((s) => s.IsActive);
    if (activeFilter === "inactive") list = list.filter((s) => !s.IsActive);
    return [...list].sort((a, b) => a.SortOrder - b.SortOrder);
  }, [data, activeFilter]);

  // ── Form ──
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateHeroSlideDto>();

  // Keep preview in sync as the user types
  const watchedFields = watch();
  React.useEffect(() => {
    setPreviewData({ ...watchedFields, ImageUrl: imageUrl });
  }, [watchedFields, imageUrl]);

  const openCreate = () => {
    const nextOrder = (slides[slides.length - 1]?.SortOrder ?? 0) + 1;
    setEditSlide(null);
    setImageUrl("");
    setPreviewData({});
    reset({
      Tag: TAG_OPTIONS[0],
      CtaLink: "/explore?tab=services",
      SortOrder: nextOrder,
      IsActive: true,
    });
    setPanelMode("create");
  };

  const openEdit = (s: HeroSlide) => {
    setEditSlide(s);
    setImageUrl(s.ImageUrl);
    setPreviewData(s);
    reset({
      ImageUrl: s.ImageUrl,
      Tag: s.Tag,
      Title: s.Title,
      TitleAccent: s.TitleAccent,
      Description: s.Description,
      CtaLabel: s.CtaLabel,
      CtaLink: s.CtaLink,
      SortOrder: s.SortOrder,
      IsActive: s.IsActive,
    });
    setPanelMode("edit");
  };

  // ── Submit ──
  const onSubmit = async (values: CreateHeroSlideDto) => {
    setSaving(true);
    try {
      const dto: CreateHeroSlideDto = { ...values, ImageUrl: imageUrl };
      const result =
        panelMode === "create"
          ? await HeroSliderService.Create(dto)
          : await HeroSliderService.Update(
              editSlide!.SlideId,
              {
                ImageUrl: dto.ImageUrl,
                Tag: dto.Tag,
                Title: dto.Title,
                TitleAccent: dto.TitleAccent,
                Description: dto.Description,
                CtaLabel: dto.CtaLabel,
                CtaLink: dto.CtaLink,
                SortOrder: dto.SortOrder,
                IsActive: dto.IsActive,
              },
            );
      toastResult(result, toast);
      if (result.Success) setPanelMode(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.ErrorMessage ?? "Could not save slide.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle active ──
  const handleToggle = async (s: HeroSlide) => {
    setToggling(s.SlideId);
    try {
      const result = await HeroSliderService.ToggleActive(s.SlideId);
      if(result.Success) {
        toast.success(
          result.Title,
          `Slide "${s.Title}" is now ${s.IsActive ? "hidden" : "visible"} on the site.`,
        );
      } else {
        toastResult(result, toast);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.ErrorMessage ?? "Toggle failed");
    } finally {
      setToggling(null);
    }
  };

  const handleReorder = async (s: HeroSlide, direction: "up" | "down") => {
    const sorted = [...slides];
    const idx = sorted.findIndex((x) => x.SlideId === s.SlideId);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const newOrder = sorted.map((sl, i) => {
      if (i === idx) return { ...sl, SortOrder: sorted[swapIdx].SortOrder };
      if (i === swapIdx) return { ...sl, SortOrder: sorted[idx].SortOrder };
      return sl;
    });

    const orderedIds = [...newOrder]
      .sort((a, b) => a.SortOrder - b.SortOrder)
      .map((x) => x.SlideId);

    setReordering(true);
    setReordering(false);
  };

  // ── Delete ──
  const handleDelete = async () => {
    if (!confirmDel) return;
    setDeleting(true);
    try {
      const result = await HeroSliderService.Delete(confirmDel.SlideId);
      toastResult(result, toast);
      if (result.Success) setConfirmDel(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.ErrorMessage ?? "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout title="Hero Slider">
      <PageHeader
        title="Hero Slider"
        subtitle={`${slides.length} slide${slides.length !== 1 ? "s" : ""} · Landing page carousel`}
        breadcrumb={["Admin", "Hero Slider"]}
        action={
          <ActionButton
            onClick={openCreate}
            icon={Plus}
            label="Add Slide"
            variant="primary"
            size="md"
          />
        }
      />

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-primary-50 border border-primary-100 rounded-xl mb-5 text-sm text-primary-700">
        <Monitor className="w-4 h-4 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold">Landing page carousel</span> — Only{" "}
          <strong>Active</strong> slides appear on the site, in{" "}
          <strong>Sort Order</strong> (ascending). Use the arrows to reorder.
          Changes are reflected immediately after saving.
        </div>
      </div>

      <FilterBar>
        <FilterSelect
          value={activeFilter}
          onChange={setActiveFilter}
          placeholder="All Slides"
          options={[
            { value: "active", label: "Active Only" },
            { value: "inactive", label: "Inactive Only" },
          ]}
        />
      </FilterBar>

      {isLoading ? (
        <SkeletonList />
      ) : slides.length === 0 ? (
        <EmptyState
          icon={Images}
          title="No slides found"
          description="Add your first hero slide to get the landing page carousel running."
          action={
            <ActionButton
              onClick={openCreate}
              icon={Plus}
              label="Add Slide"
              variant="primary"
              size="sm"
            />
          }
        />
      ) : (
        <div className="space-y-2">
          {slides.map((slide, i) => (
            <SlideRow
              key={slide.SlideId}
              slide={slide}
              isFirst={i === 0}
              isLast={i === slides.length - 1}
              onEdit={openEdit}
              onDelete={setConfirmDel}
              onToggle={handleToggle}
              onMoveUp={(s) => handleReorder(s, "up")}
              onMoveDown={(s) => handleReorder(s, "down")}
            />
          ))}
        </div>
      )}

      {/* ── Create / Edit panel ── */}
      <SlideOver
        open={!!panelMode}
        onClose={() => setPanelMode(null)}
        title={panelMode === "create" ? "Add New Slide" : "Edit Slide"}
        subtitle={
          editSlide ? `${editSlide.Title} ${editSlide.TitleAccent}` : undefined
        }
        width="xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Live preview at top of panel */}
          <div className="mb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Live Preview
            </p>
            <SlidePreview slide={previewData} />
          </div>

          <SectionDivider label="Background Image" />
          <CloudinaryUpload
            label="Slide Background Image"
            value={imageUrl}
            onChange={(url) => {
              setImageUrl(url);
              setPreviewData((p) => ({ ...p, ImageUrl: url }));
            }}
            resourceType="image"
            hint="Recommended: landscape image, minimum 1600 × 900 px for best quality."
            error={!imageUrl && saving ? "Image is required" : undefined}
          />

          <SectionDivider label="Content" />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Tag / Service Label"
              required
              error={errors.Tag?.message}
              hint="Shown in the pill above the headline"
            >
              <select
                {...register("Tag", { required: "Required" })}
                onChange={(e) => {
                  setPreviewData((p) => ({ ...p, Tag: e.target.value }));
                }}
                className={inputCls(!!errors.Tag)}
              >
                {TAG_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField
              label="Sort Order"
              required
              error={errors.SortOrder?.message}
              hint="Lower numbers appear first"
            >
              <input
                {...register("SortOrder", {
                  required: "Required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Min 1" },
                })}
                type="number"
                className={inputCls(!!errors.SortOrder)}
              />
            </FormField>
          </div>

          <FormField
            label="Headline (Line 1)"
            required
            error={errors.Title?.message}
            hint="e.g. Power Your Home"
          >
            <input
              {...register("Title", { required: "Required" })}
              className={inputCls(!!errors.Title)}
              placeholder="e.g. Power Your Home"
              onChange={(e) =>
                setPreviewData((p) => ({ ...p, Title: e.target.value }))
              }
            />
          </FormField>

          <FormField
            label="Headline Accent (Line 2 — shown in gold)"
            required
            error={errors.TitleAccent?.message}
            hint="e.g. With Clean Solar Energy."
          >
            <input
              {...register("TitleAccent", { required: "Required" })}
              className={inputCls(!!errors.TitleAccent)}
              placeholder="e.g. With Clean Solar Energy."
              onChange={(e) =>
                setPreviewData((p) => ({ ...p, TitleAccent: e.target.value }))
              }
            />
          </FormField>

          <FormField
            label="Description"
            required
            error={errors.Description?.message}
          >
            <textarea
              {...register("Description", {
                required: "Required",
                minLength: { value: 20, message: "At least 20 characters" },
              })}
              rows={3}
              className={`${inputCls(!!errors.Description)} resize-none`}
              placeholder="Describe the service or offer featured in this slide…"
              onChange={(e) =>
                setPreviewData((p) => ({ ...p, Description: e.target.value }))
              }
            />
          </FormField>

          <SectionDivider label="Call to Action" />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="CTA Button Label"
              required
              error={errors.CtaLabel?.message}
            >
              <input
                {...register("CtaLabel", { required: "Required" })}
                className={inputCls(!!errors.CtaLabel)}
                placeholder="e.g. Get a Free Quote"
                onChange={(e) =>
                  setPreviewData((p) => ({ ...p, CtaLabel: e.target.value }))
                }
              />
            </FormField>
            <FormField
              label="CTA Link"
              required
              error={errors.CtaLink?.message}
              hint="React-Router path, e.g. /explore?tab=services"
            >
              <select
                {...register("CtaLink", { required: "Required" })}
                className={inputCls(!!errors.CtaLink)}
              >
                {CTA_LINK_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label} ({o.value})
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <SectionDivider label="Visibility" />
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register("IsActive")}
              className="w-4 h-4 rounded border-slate-300 text-primary-600"
            />
            Active — visible on the live site
          </label>

          <div className="pt-2">
            <SubmitButton
              loading={saving}
              label={panelMode === "create" ? "Create Slide" : "Save Changes"}
            />
          </div>
        </form>
      </SlideOver>

      {/* Confirm delete */}
      <ConfirmModal
        open={!!confirmDel}
        title="Delete Slide"
        message={`Remove the "${confirmDel?.Title} ${confirmDel?.TitleAccent}" slide? This cannot be undone.`}
        confirmLabel="Delete Slide"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDel(null)}
      />
    </AdminLayout>
  );
};

export default AdminSlider;