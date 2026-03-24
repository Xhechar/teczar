import React, { useState } from "react";
import {
  AlertTriangle, Loader2, Search, X,
  ChevronUp, ChevronDown, ImageIcon, Trash2, RefreshCw,
} from "lucide-react";
import { uploadToCloudinary } from "../helpers/helper";

// ─── STATUS BADGE ────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  AwaitingPayment: "bg-yellow-50 text-yellow-700 ring-yellow-200",
  Paid:            "bg-blue-50 text-blue-700 ring-blue-200",
  Processing:      "bg-orange-50 text-orange-700 ring-orange-200",
  Delivered:       "bg-green-50 text-green-700 ring-green-200",
  Pending:         "bg-yellow-50 text-yellow-700 ring-yellow-200",
  Completed:       "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Failed:          "bg-red-50 text-red-700 ring-red-200",
  Approved:        "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Rejected:        "bg-red-50 text-red-700 ring-red-200",
  Contacted:       "bg-blue-50 text-blue-700 ring-blue-200",
  Scheduled:       "bg-purple-50 text-purple-700 ring-purple-200",
  Reviewing:       "bg-indigo-50 text-indigo-700 ring-indigo-200",
  Interview:       "bg-cyan-50 text-cyan-700 ring-cyan-200",
  Accepted:        "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Admin:           "bg-purple-50 text-purple-700 ring-purple-200",
  Customer:        "bg-slate-100 text-slate-600 ring-slate-200",
  Staff:           "bg-blue-50 text-blue-700 ring-blue-200",
  Active:          "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Inactive:        "bg-rose-50 text-rose-600 ring-rose-200",
  Cancelled:       "bg-red-50 text-red-700 ring-red-200",
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ring-1 ring-inset ${STATUS_COLORS[status] ?? "bg-slate-100 text-slate-600 ring-slate-200"}`}>
    {status}
  </span>
);

// ─── ICON BUTTON — compact, tooltip on hover ──────────────────────
// Used inside list rows. Shows only the icon; label appears as tooltip.
const ICON_BTN: Record<string, string> = {
  primary: "bg-primary-600 hover:bg-primary-700 text-white",
  warning: "bg-amber-400 hover:bg-amber-500 text-white",
  danger:  "text-red-500 hover:bg-red-50 hover:text-red-600",
  ghost:   "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
  success: "bg-emerald-500 hover:bg-emerald-600 text-white",
};

export const IconButton: React.FC<{
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  variant?: keyof typeof ICON_BTN;
  loading?: boolean;
  disabled?: boolean;
}> = ({ onClick, icon: Icon, label, variant = "ghost", loading, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    title={label}
    aria-label={label}
    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed shrink-0 ${ICON_BTN[variant]}`}
  >
    {loading
      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
      : <Icon className="w-3.5 h-3.5" />}
  </button>
);

// ─── ACTION BUTTON — full label, used in PageHeader / forms ───────
const BTN_VARIANT: Record<string, string> = {
  primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-sm",
  warning: "bg-amber-500 hover:bg-amber-600 text-white shadow-sm",
  danger:  "bg-red-500 hover:bg-red-600 text-white shadow-sm",
  ghost:   "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200",
  success: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm",
};

export const ActionButton: React.FC<{
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  variant?: keyof typeof BTN_VARIANT;
  size?: "sm" | "md";
  loading?: boolean;
  disabled?: boolean;
}> = ({ onClick, icon: Icon, label, variant = "ghost", size = "sm", loading, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${
      size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
    } ${BTN_VARIANT[variant]}`}
  >
    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" />}
    {label}
  </button>
);

// ─── CONFIRM MODAL ────────────────────────────────────────────────
export const ConfirmModal: React.FC<{
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: "danger" | "warning";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ open, title, message, confirmLabel = "Confirm", variant = "danger", loading, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${variant === "danger" ? "bg-red-100" : "bg-amber-100"}`}>
          <AlertTriangle className={`w-5 h-5 ${variant === "danger" ? "text-red-600" : "text-amber-600"}`} />
        </div>
        <h3 className="font-semibold text-base text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-5">{message}</p>
        <div className="flex gap-2">
          <button onClick={onCancel} disabled={loading}
            className="flex-1 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-40">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className={`flex-1 py-2 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 ${variant === "danger" ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"}`}>
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── PAGE HEADER ──────────────────────────────────────────────────
export const PageHeader: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  breadcrumb?: string[];
}> = ({ title, subtitle, action, breadcrumb }) => (
  <div className="flex items-center justify-between gap-4 mb-6">
    <div className="min-w-0 flex-1">
      {breadcrumb && (
        <p className="text-xs text-slate-400 mb-0.5 flex items-center gap-1">
          {breadcrumb.map((b, i) => (
            <React.Fragment key={b}>
              {i > 0 && <span className="text-slate-300">/</span>}
              <span>{b}</span>
            </React.Fragment>
          ))}
        </p>
      )}
      <h1 className="text-xl font-bold text-slate-900 leading-tight">{title}</h1>
      {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

// ─── STAT CARD ────────────────────────────────────────────────────
export const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  iconColor: string;
  trend?: { value: number; label: string };
}> = ({ label, value, icon: Icon, color, iconColor, trend }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
    <div className="flex items-center justify-between mb-3">
      <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className={`w-4.5 h-4.5 ${iconColor}`} style={{ width: 18, height: 18 }} />
      </div>
      {trend && (
        <span className={`text-xs font-semibold flex items-center gap-0.5 ${trend.value >= 0 ? "text-emerald-600" : "text-red-500"}`}>
          {trend.value >= 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {Math.abs(trend.value)}%
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-slate-900 leading-none mb-1">{value}</p>
    <p className="text-xs text-slate-500">{label}</p>
    {trend && <p className="text-[11px] text-slate-400 mt-0.5">{trend.label}</p>}
  </div>
);

// ─── SEARCH BAR ───────────────────────────────────────────────────
export const SearchBar: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder = "Search…" }) => (
  <div className="relative flex-1 min-w-0 max-w-xs">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 bg-white transition-all"
    />
    {value && (
      <button onClick={() => onChange("")}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
        <X className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);

// ─── FILTER SELECT ────────────────────────────────────────────────
export const FilterSelect: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}> = ({ value, onChange, options, placeholder }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="py-2 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-primary-400 bg-white text-slate-700 cursor-pointer shrink-0"
  >
    {placeholder && <option value="all">{placeholder}</option>}
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

// ─── EMPTY STATE ──────────────────────────────────────────────────
export const EmptyState: React.FC<{
  icon: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-slate-100">
    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
      <Icon className="w-6 h-6 text-slate-300" />
    </div>
    <h3 className="font-semibold text-slate-700 text-sm mb-1">{title}</h3>
    {description && <p className="text-xs text-slate-400 max-w-xs">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

// ─── LIST CARD ────────────────────────────────────────────────────
export const ListCard: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className = "" }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-xl border border-slate-100 p-4 transition-all duration-150 ${onClick ? "cursor-pointer hover:border-primary-200 hover:shadow-sm" : ""} ${className}`}
  >
    {children}
  </div>
);

// ─── SKELETON LIST ────────────────────────────────────────────────
const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-2.5">
    <div className="flex gap-3">
      <div className="skeleton w-12 h-12 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3.5 rounded w-2/5" />
        <div className="skeleton h-3 rounded w-3/5" />
        <div className="skeleton h-3 rounded w-1/3" />
      </div>
    </div>
  </div>
);

export const SkeletonList: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

// ─── FORM FIELD ───────────────────────────────────────────────────
export const FormField: React.FC<{
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}> = ({ label, error, required, children, hint }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
    {hint && !error && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    {error && (
      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
        <AlertTriangle className="w-3 h-3 shrink-0" />{error}
      </p>
    )}
  </div>
);

export const inputCls = (hasError = false) =>
  `w-full px-3 py-2 rounded-lg border text-sm transition-all duration-150 focus:outline-none focus:ring-2 ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-primary-400 focus:ring-primary-100 bg-white"
  }`;

// ─── CLOUDINARY SINGLE UPLOAD ─────────────────────────────────────
export const CloudinaryUpload: React.FC<{
  label: string;
  value: string;
  onChange: (url: string) => void;
  resourceType?: "image" | "video";
  error?: string;
  hint?: string;
}> = ({ label, value, onChange, resourceType = "image", error, hint }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const url = await uploadToCloudinary(file, resourceType);
      onChange(url);
    } catch {
      setUploadError("Upload failed — check Cloudinary config.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <FormField label={label} error={error ?? uploadError} hint={hint}>
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={resourceType === "video" ? "Paste embed URL…" : "Paste URL or upload →"}
            className={`${inputCls(!!error)} flex-1 min-w-0`}
          />
          <label className={`shrink-0 cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
            uploading ? "border-slate-200 text-slate-400 bg-slate-50" : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}>
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
            {uploading ? "Uploading" : "Upload"}
            <input type="file" className="hidden" accept={resourceType === "video" ? "video/*" : "image/*"} onChange={handleFile} disabled={uploading} />
          </label>
        </div>
        {value && resourceType === "image" && (
          <div className="relative inline-block">
            <img src={value} alt="preview" className="h-16 w-24 object-cover rounded-lg border border-slate-200" />
            <button type="button" onClick={() => onChange("")}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </FormField>
  );
};

// ─── PRODUCT IMAGE MANAGER ────────────────────────────────────────
export interface ManagedImage {
  ImageId: string;
  ImageUrl: string;
  isNew?: boolean;
}

export const ProductImageManager: React.FC<{
  images: ManagedImage[];
  onChange: (imgs: ManagedImage[]) => void;
  onUpdateExisting?: (imageId: string, url: string) => Promise<void>;
  onDeleteExisting?: (imageId: string) => Promise<void>;
}> = ({ images, onChange, onUpdateExisting, onDeleteExisting }) => {
  const [replacing, setReplacing] = useState<string | null>(null);
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);

  const handleReplace = async (imgId: string, file: File) => {
    setReplacing(imgId);
    try {
      const url = await uploadToCloudinary(file, "image");
      if (onUpdateExisting) await onUpdateExisting(imgId, url);
      onChange(images.map(img => img.ImageId === imgId ? { ...img, ImageUrl: url } : img));
    } finally { setReplacing(null); }
  };

  const handleDelete = async (imgId: string) => {
    setDeleting(imgId);
    try {
      if (onDeleteExisting) await onDeleteExisting(imgId);
      onChange(images.filter(img => img.ImageId !== imgId));
    } finally { setDeleting(null); }
  };

  const handleAddNew = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setAddingNew(true);
    try {
      const urls = await Promise.all(files.map(f => uploadToCloudinary(f, "image")));
      const newImgs: ManagedImage[] = urls.map((url, i) => ({
        ImageId: `new-${Date.now()}-${i}`, ImageUrl: url, isNew: true,
      }));
      onChange([...images, ...newImgs]);
    } finally { setAddingNew(false); e.target.value = ""; }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          Images <span className="text-slate-400 font-normal normal-case ml-1">({images.length})</span>
        </span>
        <label className={`cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
          addingNew ? "border-slate-200 text-slate-400" : "border-primary-200 text-primary-600 hover:bg-primary-50"
        }`}>
          {addingNew ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageIcon className="w-3 h-3" />}
          {addingNew ? "Uploading…" : "Add Images"}
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleAddNew} disabled={addingNew} />
        </label>
      </div>

      {images.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-lg p-6 text-center">
          <ImageIcon className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
          <p className="text-xs text-slate-400">No images. Click "Add Images" to upload.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((img) => (
            <div key={img.ImageId} className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-50 aspect-video">
              <img src={img.ImageUrl} alt="" className="w-full h-full object-cover" />
              {img.isNew && (
                <span className="absolute top-1 left-1 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">New</span>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <label title="Replace" className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center cursor-pointer hover:bg-white transition-all">
                  {replacing === img.ImageId
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-600" />
                    : <RefreshCw className="w-3.5 h-3.5 text-primary-600" />}
                  <input type="file" accept="image/*" className="hidden" disabled={!!replacing}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleReplace(img.ImageId, f); e.target.value = ""; }} />
                </label>
                <button type="button" title="Remove" disabled={!!deleting} onClick={() => handleDelete(img.ImageId)}
                  className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-all disabled:opacity-50">
                  {deleting === img.ImageId
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                    : <Trash2 className="w-3.5 h-3.5 text-red-500" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── SLIDE-OVER ───────────────────────────────────────────────────
export const SlideOver: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: "md" | "lg" | "xl";
}> = ({ open, onClose, title, subtitle, children, width = "md" }) => {
  if (!open) return null;
  const widthCls = width === "xl" ? "w-full max-w-2xl" : width === "lg" ? "w-full max-w-xl" : "w-full max-w-md";
  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white h-full shadow-2xl flex flex-col ${widthCls}`}
        style={{ animation: "slideInRight 0.22s ease-out" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <div className="min-w-0">
            <h2 className="font-semibold text-slate-900 text-base leading-tight">{title}</h2>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5 truncate">{subtitle}</p>}
          </div>
          <button onClick={onClose}
            className="ml-3 w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center transition-all text-slate-400 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
};

// ─── EXPANDABLE ───────────────────────────────────────────────────
export const Expandable: React.FC<{
  trigger: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ trigger, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button type="button" onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between gap-2 text-left">
        {trigger}
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
};

// ─── SECTION DIVIDER ──────────────────────────────────────────────
export const SectionDivider: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-2 pt-1">
    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{label}</span>
    <div className="flex-1 h-px bg-slate-100" />
  </div>
);

// ─── SUBMIT BUTTON ────────────────────────────────────────────────
export const SubmitButton: React.FC<{
  loading: boolean;
  label: string;
  loadingLabel?: string;
}> = ({ loading, label, loadingLabel = "Saving…" }) => (
  <button type="submit" disabled={loading}
    className="w-full py-2.5 rounded-lg font-semibold text-white text-sm disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
    style={{ background: "linear-gradient(135deg,#1660eb,#0d1a42)" }}>
    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
    {loading ? loadingLabel : label}
  </button>
);

export const FilterBar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-wrap items-center gap-2 mb-5">{children}</div>
);