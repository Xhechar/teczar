import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Wrench,
  Plus,
  Edit,
  Trash2,
  CreditCard,
  Star,
  Megaphone,
  ClipboardList,
  Briefcase,
  UserCheck,
  Folder,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  User,
  Phone,
  Mail,
  DollarSign,
  PlayCircle,
} from "lucide-react";
import {
  PageHeader,
  FilterBar,
  ListCard,
  SkeletonList,
  StatusBadge,
  SearchBar,
  FilterSelect,
  ActionButton,
  IconButton,
  ConfirmModal,
  EmptyState,
  SlideOver,
  FormField,
  inputCls,
  CloudinaryUpload,
  SubmitButton,
} from "./components/AdminUI";
import { useToast, toastResult } from "../../components/Toast";
import {
  ModelType,
  OrderStatus,
  PaymentStatus,
  ReviewStatus,
  MediaType,
  ServiceRequestStatus,
  JobApplicationStatus,
} from "../../enums/enums";
import { useSocketInvalidation } from "../../hooks/socket.hook";
import {
  Service,
  Category,
  Payment,
  Review,
  Advert,
  ServiceRequest,
  Job,
  JobApplication,
} from "../../interfaces/interfaces";
import AdminLayout from "./layouts/AdminLayout";
import { User as UserType } from "../../interfaces/interfaces";
import { ServicesService } from "../../services/service.service";
import { CategoryService } from "../../services/category.service";
import { OrderService } from "../../services/order.service";
import { ReviewService } from "../../services/review.service";
import { AdvertService } from "../../services/advert.service";
import { ServiceRequestService } from "../../services/service.request.service";
import { JobService } from "../../services/job.service";
import { JobApplicationService } from "../../services/job.application.service";
import { PaymentService } from "../../services/payment.service";

const SEL =
  "py-1.5 px-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary-400 bg-white text-slate-700 cursor-pointer disabled:opacity-40 min-w-0";

export const AdminServices: React.FC = () => {
  useSocketInvalidation(ModelType.Service);
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [offerFilter, setOffer] = useState("all");
  const [panelMode, setPanel] = useState<"create" | "edit" | null>(null);
  const [editItem, setEditItem] = useState<Service | null>(null);
  const [confirmDel, setConfirmDel] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: [ModelType.Service.toLowerCase()],
    queryFn: () => ServicesService.FetchAll(),
  });
  React.useEffect(() => {
    if (isError) toast.error("Failed to load services");
    // eslint-disable-next-line
  }, [isError]);

  const services = useMemo(() => {
    let list: Service[] = data?.DataList ?? [];
    if (offerFilter === "offer") list = list.filter((s) => s.OnOffer);
    if (offerFilter === "featured") list = list.filter((s) => s.IsFeatured);
    if (search)
      list = list.filter((s) =>
        s.Title.toLowerCase().includes(search.toLowerCase()),
      );
    return list;
  }, [data, offerFilter, search]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<Service>>();
  const openCreate = () => {
    setEditItem(null);
    setImageUrl("");
    reset({ OnOffer: false, IsFeatured: false });
    setPanel("create");
  };
  const openEdit = (s: Service) => {
    setEditItem(s);
    setImageUrl(s.ImageUrl ?? "");
    reset(s);
    setPanel("edit");
  };

  const onSubmit = async (v: Partial<Service>) => {
    setSaving(true);
    try {
      const r =
        panelMode === "create"
          ? await ServicesService.Create({
              Title: v.Title as string,
              Description: v.Description as string,
              ImageUrl: imageUrl,
            })
          : await ServicesService.Update(editItem!.ServiceId, {
              Title: v.Title,
              Description: v.Description,
              OnOffer: v.OnOffer,
              IsFeatured: v.IsFeatured,
              ImageUrl: imageUrl,
            });
      toastResult(r, toast);
      if (r.Success) setPanel(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };
  const doDelete = async () => {
    setDeleting(true);
    try {
      const r = await ServicesService.Delete(confirmDel!.ServiceId);
      toastResult(r, toast);
      if (r.Success) setConfirmDel(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout title="Services">
      <PageHeader
        title="Services"
        subtitle={`${services.length} services`}
        breadcrumb={["Admin", "Services"]}
        action={
          <ActionButton
            onClick={openCreate}
            icon={Plus}
            label="Add Service"
            variant="primary"
            size="md"
          />
        }
      />
      <FilterBar>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search services…"
        />
        <FilterSelect
          value={offerFilter}
          onChange={setOffer}
          placeholder="All Services"
          options={[
            { value: "offer", label: "On Offer" },
            { value: "featured", label: "Featured" },
          ]}
        />
      </FilterBar>

      {isLoading ? (
        <SkeletonList />
      ) : services.length === 0 ? (
        <EmptyState icon={Wrench} title="No services found" />
      ) : (
        <div className="space-y-2">
          {services.map((s: Service) => (
            <ListCard key={s.ServiceId}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                  {s.ImageUrl ? (
                    <img
                      src={s.ImageUrl}
                      alt={s.Title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Wrench className="w-5 h-5 text-slate-300 m-2.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-slate-900 truncate">
                      {s.Title}
                    </span>
                    {s.IsFeatured && <StatusBadge status="Active" />}
                    {s.OnOffer && (
                      <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200 px-1.5 py-0.5 rounded-full">
                        On Offer
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {s.Description}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-1">
                  <IconButton
                    onClick={() => openEdit(s)}
                    icon={Edit}
                    label="Edit"
                    variant="ghost"
                  />
                  <IconButton
                    onClick={() => setConfirmDel(s)}
                    icon={Trash2}
                    label="Delete"
                    variant="danger"
                  />
                </div>
              </div>
            </ListCard>
          ))}
        </div>
      )}

      <SlideOver
        open={!!panelMode}
        onClose={() => setPanel(null)}
        title={panelMode === "create" ? "Add Service" : "Edit Service"}
        subtitle={editItem?.Title}
        width="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Title" required error={errors.Title?.message}>
            <input
              {...register("Title", { required: "Required" })}
              className={inputCls(!!errors.Title)}
            />
          </FormField>
          <FormField label="Description" required>
            <textarea
              {...register("Description", { required: "Required" })}
              rows={3}
              className={`${inputCls()} resize-none`}
            />
          </FormField>
          <div className="flex gap-5">
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                {...register("OnOffer")}
                className="w-3.5 h-3.5 rounded"
              />
              On Offer
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                {...register("IsFeatured")}
                className="w-3.5 h-3.5 rounded"
              />
              Featured
            </label>
          </div>
          <CloudinaryUpload
            label="Service Image"
            value={imageUrl}
            onChange={setImageUrl}
          />
          <SubmitButton
            loading={saving}
            label={panelMode === "create" ? "Create Service" : "Save Changes"}
          />
        </form>
      </SlideOver>
      <ConfirmModal
        open={!!confirmDel}
        title="Delete Service"
        message={`Delete "${confirmDel?.Title}"?`}
        loading={deleting}
        onConfirm={doDelete}
        onCancel={() => setConfirmDel(null)}
      />
    </AdminLayout>
  );
};

export const AdminCategories: React.FC = () => {
  useSocketInvalidation(ModelType.Category);
  const toast = useToast();
  const [panelMode, setPanel] = useState<"create" | "edit" | null>(null);
  const [editItem, setEditItem] = useState<Category | null>(null);
  const [confirmDel, setConfirmDel] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: [ModelType.Category.toLowerCase()],
    queryFn: () => CategoryService.FetchAll(),
  });
  React.useEffect(() => {
    if (isError) toast.error("Failed to load categories");
    // eslint-disable-next-line
  }, [isError]);

  const cats = data?.DataList ?? [];
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<Category>>();
  const openCreate = () => {
    setEditItem(null);
    setImageUrl("");
    reset({});
    setPanel("create");
  };
  const openEdit = (c: Category) => {
    setEditItem(c);
    setImageUrl(c.ImageUrl ?? "");
    reset(c);
    setPanel("edit");
  };

  const onSubmit = async (v: Partial<Category>) => {
    setSaving(true);
    try {
      const r =
        panelMode === "create"
          ? await CategoryService.Create({
              Name: v.Name as string,
              ImageUrl: imageUrl,
            })
          : await CategoryService.Update(editItem!.CategoryId, {
              Name: v.Name,
              ImageUrl: imageUrl,
            });
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
      const r = await CategoryService.Delete(confirmDel!.CategoryId);
      toastResult(r, toast);
      if (r.Success) setConfirmDel(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.ErrorMessage ?? "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout title="Categories">
      <PageHeader
        title="Categories"
        subtitle={`${cats.length} categories`}
        breadcrumb={["Admin", "Categories"]}
        action={
          <ActionButton
            onClick={openCreate}
            icon={Plus}
            label="Add Category"
            variant="primary"
            size="md"
          />
        }
      />

      {isLoading ? (
        <SkeletonList />
      ) : cats.length === 0 ? (
        <EmptyState
          icon={Folder}
          title="No categories yet"
          description="Create categories to organise your store."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {cats.map((c: Category) => (
            <ListCard key={c.CategoryId}>
              {c.ImageUrl && (
                <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-100 mb-3 border border-slate-100">
                  <img
                    src={c.ImageUrl}
                    alt={c.Name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-900 truncate">
                    {c.Name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {new Date(c.CreatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <IconButton
                    onClick={() => openEdit(c)}
                    icon={Edit}
                    label="Edit"
                    variant="ghost"
                  />
                  <IconButton
                    onClick={() => setConfirmDel(c)}
                    icon={Trash2}
                    label="Delete"
                    variant="danger"
                  />
                </div>
              </div>
            </ListCard>
          ))}
        </div>
      )}

      <SlideOver
        open={!!panelMode}
        onClose={() => setPanel(null)}
        title={panelMode === "create" ? "New Category" : "Edit Category"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label="Category Name"
            required
            error={errors.Name?.message}
          >
            <input
              {...register("Name", { required: "Required" })}
              className={inputCls(!!errors.Name)}
            />
          </FormField>
          <CloudinaryUpload
            label="Category Image"
            value={imageUrl}
            onChange={setImageUrl}
          />
          <SubmitButton
            loading={saving}
            label={panelMode === "create" ? "Create" : "Save"}
          />
        </form>
      </SlideOver>
      <ConfirmModal
        open={!!confirmDel}
        title="Delete Category"
        message={`Delete "${confirmDel?.Name}"?`}
        loading={deleting}
        onConfirm={doDelete}
        onCancel={() => setConfirmDel(null)}
      />
    </AdminLayout>
  );
};

const shortId = (id: string) => (id.length > 8 ? `${id.slice(0, 8)}…` : id);

export const AdminOrders: React.FC = () => {
  useSocketInvalidation(ModelType.Order);
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStat] = useState("all");
  const [dateFilter, setDate] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: [ModelType.Order.toLowerCase()],
    queryFn: () => OrderService.FetchAll(),
  });
  React.useEffect(() => {
    if (isError) toast.error("Failed to load orders");
    // eslint-disable-next-line
  }, [isError]);

  const orders = useMemo(() => {
    let list = data?.DataList ?? [];
    if (statusFilter !== "all")
      list = list.filter((o) => o.Status === statusFilter);
    if (dateFilter === "today") {
      const t = new Date().toDateString();
      list = list.filter((o) => new Date(o.CreatedAt).toDateString() === t);
    }
    if (dateFilter === "week") {
      const wa = Date.now() - 7 * 24 * 60 * 60 * 1000;
      list = list.filter((o) => new Date(o.CreatedAt).getTime() >= wa);
    }
    if (search)
      list = list.filter(
        (o) =>
          o.OrderId.toLowerCase().includes(search.toLowerCase()) ||
          (o.User &&
            `${o.User.FirstName} ${o.User.SecondName}`
              .toLowerCase()
              .includes(search.toLowerCase())),
      );
    return list;
  }, [data, statusFilter, dateFilter, search]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    setUpdating(id);
    try {
      const r = await OrderService.UpdateOrderStatus(id, { Status: status });
      toastResult(r, toast, { successMsg: `Order updated to ${status}.` });
    } catch {
      toast.error("Update failed");
    } finally {
      setUpdating(null);
    }
  };

  const fmtKES = (n: number) => `KES ${n.toLocaleString("en-KE")}`;

  // Summary stats
  const stats = useMemo(
    () => ({
      total: (data?.DataList ?? []).length,
      pending: (data?.DataList ?? []).filter(
        (o) => o.Status === OrderStatus.AwaitingPayment,
      ).length,
      processing: (data?.DataList ?? []).filter(
        (o) =>
          o.Status === OrderStatus.Processing || o.Status === OrderStatus.Paid,
      ).length,
      delivered: (data?.DataList ?? []).filter(
        (o) => o.Status === OrderStatus.Delivered,
      ).length,
    }),
    [data],
  );

  return (
    <AdminLayout title="Orders">
      <PageHeader
        title="Orders"
        subtitle={`${orders.length} order${orders.length !== 1 ? "s" : ""}`}
        breadcrumb={["Admin", "Orders"]}
      />

      {/* Summary pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          {
            l: "Total",
            n: stats.total,
            cls: "bg-slate-100 text-slate-700 ring-slate-200",
          },
          {
            l: "Awaiting",
            n: stats.pending,
            cls: "bg-yellow-50 text-yellow-700 ring-yellow-200",
          },
          {
            l: "Processing",
            n: stats.processing,
            cls: "bg-blue-50 text-blue-700 ring-blue-200",
          },
          {
            l: "Delivered",
            n: stats.delivered,
            cls: "bg-emerald-50 text-emerald-700 ring-emerald-200",
          },
        ].map((s) => (
          <span
            key={s.l}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ring-1 ring-inset text-xs font-semibold ${s.cls}`}
          >
            {s.l} <span className="font-bold">{s.n}</span>
          </span>
        ))}
      </div>

      <FilterBar>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by order ID or customer…"
        />
        <FilterSelect
          value={statusFilter}
          onChange={setStat}
          placeholder="All Statuses"
          options={Object.values(OrderStatus).map((s) => ({
            value: s,
            label: s,
          }))}
        />
        <FilterSelect
          value={dateFilter}
          onChange={setDate}
          placeholder="All Time"
          options={[
            { value: "today", label: "Today" },
            { value: "week", label: "This Week" },
          ]}
        />
      </FilterBar>

      {isLoading ? (
        <SkeletonList />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No orders found"
          description="Orders matching your filters will appear here."
        />
      ) : (
        <div className="space-y-2">
          {orders.map((o) => (
            <div
              key={o.OrderId}
              className="bg-white rounded-xl border border-slate-100 overflow-hidden"
            >
              {/* ── Summary row ── */}
              <button
                type="button"
                onClick={() =>
                  setExpanded(expanded === o.OrderId ? null : o.OrderId)
                }
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors min-w-0"
              >
                {/* Expand chevron */}
                <div
                  className={`shrink-0 w-6 h-6 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 transition-transform duration-200 ${expanded === o.OrderId ? "bg-primary-50 border-primary-200 rotate-180" : ""}`}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    {/* Shortened ID */}
                    <span
                      className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded"
                      title={o.OrderId}
                    >
                      #{shortId(o.OrderId)}
                    </span>
                    <StatusBadge status={o.Status} />
                    <span className="font-bold text-sm text-slate-900">
                      {fmtKES(o.TotalAmount)}
                    </span>
                    {o.Items && o.Items.length > 0 && (
                      <span className="text-xs text-slate-400">
                        {o.Items.length} item{o.Items.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                    {o.User && (
                      <>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {o.User.FirstName} {o.User.SecondName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {o.User.Phone}
                        </span>
                        <span className="hidden sm:flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {o.User.Email}
                        </span>
                      </>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(o.CreatedAt).toLocaleDateString("en-KE", {
                        dateStyle: "medium",
                      })}
                    </span>
                  </div>
                </div>

                {/* Status update — stop click propagating to expand toggle */}
                <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={o.Status}
                    disabled={updating === o.OrderId}
                    onChange={(e) =>
                      updateStatus(o.OrderId, e.target.value as OrderStatus)
                    }
                    className={`${SEL} w-36`}
                  >
                    {Object.values(OrderStatus).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </button>

              {/* ── Expanded order items ── */}
              {expanded === o.OrderId && (
                <div className="border-t border-slate-100">
                  {/* Customer detail strip */}
                  {o.User && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-4 py-3 bg-slate-50 text-xs">
                      {[
                        {
                          label: "Customer",
                          value: `${o.User.FirstName} ${o.User.SecondName}`,
                        },
                        { label: "Phone", value: o.User.Phone },
                        { label: "Email", value: o.User.Email },
                        { label: "County", value: o.User.County },
                      ].map((f) => (
                        <div key={f.label}>
                          <p className="font-semibold text-slate-500 uppercase tracking-wide text-[10px] mb-0.5">
                            {f.label}
                          </p>
                          <p className="font-medium text-slate-900 truncate">
                            {f.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Product line items */}
                  {o.Items && o.Items.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                      {/* Table header */}
                      <div className="hidden sm:grid grid-cols-[1fr_80px_100px_100px] gap-3 px-4 py-2 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wide border-t border-slate-100">
                        <span>Product</span>
                        <span className="text-center">Qty</span>
                        <span className="text-right">Unit Price</span>
                        <span className="text-right">Subtotal</span>
                      </div>

                      {o.Items.map((item) => (
                        <div
                          key={item.OrderItemId}
                          className="grid grid-cols-1 sm:grid-cols-[1fr_80px_100px_100px] gap-1 sm:gap-3 items-center px-4 py-3"
                        >
                          {/* Product name */}
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-slate-900 truncate">
                              {item.Product?.Name ?? "Unknown Product"}
                            </p>
                            {item.Product?.Category && (
                              <p className="text-xs text-slate-400">
                                {item.Product.Category.Name}
                              </p>
                            )}
                          </div>
                          {/* Qty */}
                          <div className="sm:text-center">
                            <span className="sm:hidden text-xs text-slate-400">
                              Qty:{" "}
                            </span>
                            <span className="text-sm font-semibold text-slate-700">
                              ×{item.Quantity}
                            </span>
                          </div>
                          {/* Unit price */}
                          <div className="sm:text-right">
                            <span className="sm:hidden text-xs text-slate-400">
                              Unit:{" "}
                            </span>
                            <span className="text-sm text-slate-600">
                              {fmtKES(Number(item.PriceAtPurchase))}
                            </span>
                          </div>
                          {/* Line total */}
                          <div className="sm:text-right">
                            <span className="sm:hidden text-xs text-slate-400">
                              Total:{" "}
                            </span>
                            <span className="text-sm font-bold text-slate-900">
                              {fmtKES(
                                Number(item.PriceAtPurchase) * item.Quantity,
                              )}
                            </span>
                          </div>
                        </div>
                      ))}

                      {/* Order total row */}
                      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          Order Total
                        </span>
                        <span className="text-base font-bold text-slate-900">
                          {fmtKES(o.TotalAmount)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 px-4 py-3 italic">
                      No item details available.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

interface PaymentGroup {
  user: UserType;
  payments: Payment[];
  total: number;
  completedTotal: number;
}

export const AdminPayments: React.FC = () => {
  useSocketInvalidation(ModelType.Payment);
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatus] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [expandedUser, setExpanded] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: [ModelType.Payment.toLowerCase()],
    queryFn: () => PaymentService.GetAllPayments(),
  });
  React.useEffect(() => {
    if (isError) toast.error("Failed to load payments");
    // eslint-disable-next-line
  }, [isError]);

  const payments: Payment[] = useMemo(() => {
    let list = data?.DataList ?? [];
    if (statusFilter !== "all")
      list = list.filter((p) => p.Status === statusFilter);
    if (dateFilter === "today") {
      const today = new Date().toDateString();
      list = list.filter((p) => new Date(p.CreatedAt).toDateString() === today);
    }
    if (dateFilter === "week") {
      const wa = Date.now() - 7 * 24 * 60 * 60 * 1000;
      list = list.filter((p) => new Date(p.CreatedAt).getTime() >= wa);
    }
    if (search)
      list = list.filter(
        (p) =>
          (p.MpesaReferenceCode ?? "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (p.User
            ? `${p.User.FirstName} ${p.User.SecondName}`
                .toLowerCase()
                .includes(search.toLowerCase())
            : false),
      );
    return list;
  }, [data, statusFilter, dateFilter, search]);

  const groups = useMemo<PaymentGroup[]>(() => {
    const map = new Map<string, PaymentGroup>();
    payments.forEach((p) => {
      if (!p.User) return;
      const ex = map.get(p.UserId);
      const c = p.Status === PaymentStatus.Completed ? p.Amount : 0;
      if (ex) {
        ex.payments.push(p);
        ex.total += p.Amount;
        ex.completedTotal += c;
      } else {
        map.set(p.UserId, {
          user: p.User,
          payments: [p],
          total: p.Amount,
          completedTotal: c,
        });
      }
    });
    return Array.from(map.values()).sort(
      (a, b) => b.completedTotal - a.completedTotal,
    );
  }, [payments]);

  const fmtKES = (n: number) => `KES ${n.toLocaleString("en-KE")}`;
  const grandTotal = payments
    .filter((p) => p.Status === PaymentStatus.Completed)
    .reduce((a, p) => a + p.Amount, 0);

  return (
    <AdminLayout title="Payments">
      <PageHeader
        title="Payments"
        subtitle={`Collected: ${fmtKES(grandTotal)} · ${payments.length} transactions`}
        breadcrumb={["Admin", "Payments"]}
      />

      {/* Summary pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          {
            l: "Completed",
            n: payments.filter((p) => p.Status === PaymentStatus.Completed)
              .length,
            cls: "bg-emerald-50 text-emerald-700 ring-emerald-200",
          },
          {
            l: "Pending",
            n: payments.filter((p) => p.Status === PaymentStatus.Pending)
              .length,
            cls: "bg-amber-50 text-amber-700 ring-amber-200",
          },
          {
            l: "Failed",
            n: payments.filter((p) => p.Status === PaymentStatus.Failed).length,
            cls: "bg-red-50 text-red-700 ring-red-200",
          },
        ].map((s) => (
          <span
            key={s.l}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ring-1 ring-inset text-xs font-semibold ${s.cls}`}
          >
            {s.l} <span className="font-bold">{s.n}</span>
          </span>
        ))}
      </div>

      <FilterBar>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name or M-Pesa ref…"
        />
        <FilterSelect
          value={statusFilter}
          onChange={setStatus}
          placeholder="All Statuses"
          options={Object.values(PaymentStatus).map((s) => ({
            value: s,
            label: s,
          }))}
        />
        <FilterSelect
          value={dateFilter}
          onChange={setDateFilter}
          placeholder="All Time"
          options={[
            { value: "today", label: "Today" },
            { value: "week", label: "This Week" },
          ]}
        />
      </FilterBar>

      {isLoading ? (
        <SkeletonList />
      ) : groups.length === 0 ? (
        <EmptyState icon={CreditCard} title="No payments found" />
      ) : (
        <div className="space-y-2">
          {groups.map((group) => (
            <div
              key={group.user.UserId}
              className="bg-white rounded-xl border border-slate-100 overflow-hidden"
            >
              {/* User header */}
              <button
                type="button"
                onClick={() =>
                  setExpanded(
                    expandedUser === group.user.UserId
                      ? null
                      : group.user.UserId,
                  )
                }
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors min-w-0"
              >
                <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-navy-600 flex items-center justify-center text-white text-xs font-bold">
                  {group.user.FirstName[0]}
                  {group.user.SecondName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-900">
                    {group.user.FirstName} {group.user.SecondName}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span className="truncate max-w-[160px]">
                        {group.user.Email}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {group.user.County}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 text-right mr-2">
                  <p className="font-bold text-sm text-slate-900">
                    {fmtKES(group.completedTotal)}
                  </p>
                  <p className="text-xs text-slate-400">
                    {group.payments.length} txn
                    {group.payments.length !== 1 ? "s" : ""}
                  </p>
                </div>
                {expandedUser === group.user.UserId ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {expandedUser === group.user.UserId && (
                <div className="border-t border-slate-100 divide-y divide-slate-50">
                  {group.payments.map((p) => (
                    <div
                      key={p.PaymentId}
                      className="flex items-center gap-3 px-4 py-3 bg-slate-50/50 min-w-0"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-xs font-semibold text-slate-700">
                            {p.PaymentId}
                          </span>
                          <span className="text-xs text-slate-400">
                            → {p.OrderId}
                          </span>
                          <StatusBadge status={p.Status} />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                          {p.MpesaReferenceCode && (
                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                              {p.MpesaReferenceCode}
                            </span>
                          )}
                          <span>
                            {new Date(p.CreatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span className="shrink-0 font-semibold text-sm text-slate-900">
                        {fmtKES(p.Amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export const AdminReviews: React.FC = () => {
  useSocketInvalidation(ModelType.Review);
  const toast = useToast();
  const [statusFilter, setStat] = useState("all");
  const [ratingFilter, setRating] = useState("all");
  const [confirmDel, setConfirmDel] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: [ModelType.Review.toLowerCase()],
    queryFn: () => ReviewService.FetchAll(),
  });
  React.useEffect(() => {
    if (isError) toast.error("Failed to load reviews");
    // eslint-disable-next-line
  }, [isError]);

  const reviews = useMemo(() => {
    let list: Review[] = data?.DataList ?? [];
    if (statusFilter !== "all")
      list = list.filter((r) => r.Status === statusFilter);
    if (ratingFilter !== "all")
      list = list.filter((r) => r.Rating === Number(ratingFilter));
    return list;
  }, [data, statusFilter, ratingFilter]);

  const changeStatus = async (id: string, status: ReviewStatus) => {
    setUpdId(id);
    try {
      const r = await ReviewService.UpdateStatus(id, status);
      toastResult(r, toast);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setUpdId(null);
    }
  };
  const doDelete = async () => {
    setDeleting(true);
    try {
      const r = await ReviewService.Delete(confirmDel!.ReviewId);
      toastResult(r, toast);
      if (r.Success) setConfirmDel(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout title="Reviews">
      <PageHeader
        title="Reviews"
        subtitle={`${reviews.length} reviews`}
        breadcrumb={["Admin", "Reviews"]}
      />
      <FilterBar>
        <FilterSelect
          value={statusFilter}
          onChange={setStat}
          placeholder="All Statuses"
          options={Object.values(ReviewStatus).map((s) => ({
            value: s,
            label: s,
          }))}
        />
        <FilterSelect
          value={ratingFilter}
          onChange={setRating}
          placeholder="All Ratings"
          options={[5, 4, 3, 2, 1].map((n) => ({
            value: String(n),
            label: `${n}★`,
          }))}
        />
      </FilterBar>

      {isLoading ? (
        <SkeletonList />
      ) : reviews.length === 0 ? (
        <EmptyState icon={Star} title="No reviews found" />
      ) : (
        <div className="space-y-2">
          {reviews.map((r: Review) => (
            <ListCard key={r.ReviewId}>
              <div className="flex items-start gap-3 min-w-0">
                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-navy-600 flex items-center justify-center text-white text-xs font-bold">
                  {r.User
                    ? `${r.User.FirstName[0]}${r.User.SecondName[0]}`
                    : "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-semibold text-sm text-slate-900">
                      {r.User
                        ? `${r.User.FirstName} ${r.User.SecondName}`
                        : "Anonymous"}
                    </span>
                    <span className="text-xs text-amber-400">
                      {"★".repeat(r.Rating)}
                      {"☆".repeat(5 - r.Rating)}
                    </span>
                    <StatusBadge status={r.Status} />
                  </div>
                  {r.Message && (
                    <p className="text-xs text-slate-500 italic line-clamp-2">
                      "{r.Message}"
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {new Date(r.CreatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-1">
                  {r.Status !== ReviewStatus.Approved && (
                    <IconButton
                      onClick={() =>
                        changeStatus(r.ReviewId, ReviewStatus.Approved)
                      }
                      icon={CheckCircle}
                      label="Approve"
                      variant="success"
                      loading={updatingId === r.ReviewId}
                    />
                  )}
                  {r.Status !== ReviewStatus.Rejected && (
                    <IconButton
                      onClick={() =>
                        changeStatus(r.ReviewId, ReviewStatus.Rejected)
                      }
                      icon={XCircle}
                      label="Reject"
                      variant="warning"
                      loading={updatingId === r.ReviewId}
                    />
                  )}
                  <IconButton
                    onClick={() => setConfirmDel(r)}
                    icon={Trash2}
                    label="Delete"
                    variant="danger"
                  />
                </div>
              </div>
            </ListCard>
          ))}
        </div>
      )}
      <ConfirmModal
        open={!!confirmDel}
        title="Delete Review"
        message="Permanently remove this review?"
        loading={deleting}
        onConfirm={doDelete}
        onCancel={() => setConfirmDel(null)}
      />
    </AdminLayout>
  );
};

export const AdminAdverts: React.FC = () => {
  useSocketInvalidation(ModelType.Advert);
  const toast = useToast();
  const [typeFilter, setType] = useState("all");
  const [panelMode, setPanel] = useState<"create" | "edit" | null>(null);
  const [editItem, setEditItem] = useState<Advert | null>(null);
  const [confirmDel, setConfirmDel] = useState<Advert | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: [ModelType.Advert.toLowerCase()],
    queryFn: () => AdvertService.FetchAll(),
  });
  React.useEffect(() => {
    if (isError) toast.error("Failed to load adverts");
    // eslint-disable-next-line
  }, [isError]);

  const adverts = useMemo(() => {
    let list: Advert[] = data?.DataList ?? [];
    if (typeFilter !== "all")
      list = list.filter((a) => a.MediaType === typeFilter);
    return list;
  }, [data, typeFilter]);

  const { register, handleSubmit, reset, watch } = useForm<Partial<Advert>>();
  const mediaType = watch("MediaType") as MediaType;

  const openCreate = () => {
    setEditItem(null);
    setMediaUrl("");
    reset({ MediaType: MediaType.Image, IsActive: true });
    setPanel("create");
  };
  const openEdit = (a: Advert) => {
    setEditItem(a);
    setMediaUrl(a.MediaUrl);
    reset(a);
    setPanel("edit");
  };

  const onSubmit = async (v: Partial<Advert>) => {
    setSaving(true);
    try {
      const r =
        panelMode === "create"
          ? await AdvertService.Create({
              MediaType: v.MediaType as MediaType,
              Title: v.Title as string,
              MediaUrl: mediaUrl,
            })
          : await AdvertService.Update(editItem!.AdvertId, {
              MediaType: v.MediaType,
              Title: v.Title,
              IsActive: v.IsActive,
              MediaUrl: mediaUrl,
            });
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
      const r = await AdvertService.Delete(confirmDel!.AdvertId);
      toastResult(r, toast);
      if (r.Success) setConfirmDel(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.ErrorMessage ?? "Delete failed");
    } finally {
      setDeleting(false);
    }
  };
  const toggleActive = async (a: Advert) => {
    try {
      const r = await AdvertService.ToggleAdvert(a.AdvertId);
      toastResult(r, toast);
    } catch (error: any) {
      toast.error(error?.response?.data?.ErrorMessage ?? "Toggle failed");
    }
  };

  return (
    <AdminLayout title="Adverts">
      <PageHeader
        title="Adverts"
        subtitle={`${adverts.length} adverts`}
        breadcrumb={["Admin", "Adverts"]}
        action={
          <ActionButton
            onClick={openCreate}
            icon={Plus}
            label="Add Advert"
            variant="primary"
            size="md"
          />
        }
      />
      <FilterBar>
        <FilterSelect
          value={typeFilter}
          onChange={setType}
          placeholder="All Types"
          options={[
            { value: MediaType.Image, label: "Images" },
            { value: MediaType.Video, label: "Videos" },
          ]}
        />
      </FilterBar>

      {isLoading ? (
        <SkeletonList />
      ) : adverts.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No adverts yet"
          description="Create adverts to display on the site."
        />
      ) : (
        <div className="space-y-2">
          {adverts.map((a: Advert) => (
            <ListCard key={a.AdvertId}>
              <div className="flex items-center gap-3 min-w-0">
                {/* Preview thumbnail */}
                <div className="shrink-0 w-16 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                  {a.MediaType === MediaType.Image ? (
                    <img
                      src={a.MediaUrl}
                      alt={a.Title ?? ""}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-navy-900">
                      <PlayCircle className="w-4 h-4 text-white/50" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-semibold text-sm text-slate-900 truncate">
                      {a.Title ?? "Untitled"}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                      {a.MediaType}
                    </span>
                    <StatusBadge status={a.IsActive ? "Active" : "Inactive"} />
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1">
                  <IconButton
                    onClick={() => toggleActive(a)}
                    icon={a.IsActive ? ToggleLeft : ToggleRight}
                    label={a.IsActive ? "Deactivate" : "Activate"}
                    variant={a.IsActive ? "warning" : "success"}
                  />
                  <IconButton
                    onClick={() => openEdit(a)}
                    icon={Edit}
                    label="Edit"
                    variant="ghost"
                  />
                  <IconButton
                    onClick={() => setConfirmDel(a)}
                    icon={Trash2}
                    label="Delete"
                    variant="danger"
                  />
                </div>
              </div>
            </ListCard>
          ))}
        </div>
      )}

      <SlideOver
        open={!!panelMode}
        onClose={() => setPanel(null)}
        title={panelMode === "create" ? "New Advert" : "Edit Advert"}
        subtitle={editItem?.Title ?? undefined}
        width="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Title">
            <input
              {...register("Title")}
              className={inputCls()}
              placeholder="Optional"
            />
          </FormField>
          <FormField label="Media Type" required>
            <select
              {...register("MediaType", { required: "Required" })}
              className={inputCls()}
            >
              <option value={MediaType.Image}>Image</option>
              <option value={MediaType.Video}>
                Video (YouTube embed or Cloudinary)
              </option>
            </select>
          </FormField>
          <CloudinaryUpload
            label={mediaType === MediaType.Video ? "Video URL" : "Advert Image"}
            value={mediaUrl}
            onChange={setMediaUrl}
            resourceType={mediaType === MediaType.Video ? "video" : "image"}
            hint={
              mediaType === MediaType.Video
                ? "Use a YouTube embed: https://youtube.com/embed/ID"
                : undefined
            }
          />
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              {...register("IsActive")}
              className="w-3.5 h-3.5 rounded"
            />{" "}
            Active (visible on site)
          </label>
          <SubmitButton
            loading={saving}
            label={panelMode === "create" ? "Create Advert" : "Save Changes"}
          />
        </form>
      </SlideOver>
      <ConfirmModal
        open={!!confirmDel}
        title="Delete Advert"
        message={`Delete "${confirmDel?.Title ?? "this advert"}"?`}
        loading={deleting}
        onConfirm={doDelete}
        onCancel={() => setConfirmDel(null)}
      />
    </AdminLayout>
  );
};

export const AdminServiceRequests: React.FC = () => {
  useSocketInvalidation(ModelType.ServiceRequest);
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStat] = useState("all");
  const [confirmDel, setConfirmDel] = useState<ServiceRequest | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: [ModelType.ServiceRequest.toLowerCase()],
    queryFn: () => ServiceRequestService.FetchAll(),
  });
  React.useEffect(() => {
    if (isError) toast.error("Failed to load service requests");
    // eslint-disable-next-line
  }, [isError]);

  const requests = useMemo(() => {
    let list = data?.DataList ?? [];
    if (statusFilter !== "all")
      list = list.filter((r) => r.Status === statusFilter);
    if (search)
      list = list.filter(
        (r) =>
          r.RequestId.toLowerCase().includes(search.toLowerCase()) ||
          (r.User &&
            `${r.User.FirstName} ${r.User.SecondName}`
              .toLowerCase()
              .includes(search.toLowerCase())) ||
          (r.Service?.Title ?? "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (r.LocationDescription ?? "")
            .toLowerCase()
            .includes(search.toLowerCase()),
      );
    return list;
  }, [data, statusFilter, search]);

  const updateStatus = async (id: string, status: ServiceRequestStatus) => {
    setUpdating(id);
    try {
      const r = await ServiceRequestService.UpdateStatus(id, status);
      toastResult(r, toast, { successMsg: `Request updated to ${status}.` });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setUpdating(null);
    }
  };
  const doDelete = async () => {
    setDeleting(true);
    try {
      const r = await ServiceRequestService.Delete(confirmDel!.RequestId);
      toastResult(r, toast);
      if (r.Success) setConfirmDel(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  // eslint-disable-next-line

  return (
    <AdminLayout title="Service Requests">
      <PageHeader
        title="Service Requests"
        subtitle={`${requests.length} booking${requests.length !== 1 ? "s" : ""}`}
        breadcrumb={["Admin", "Service Requests"]}
      />
      <FilterBar>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name, service, location…"
        />
        <FilterSelect
          value={statusFilter}
          onChange={setStat}
          placeholder="All Statuses"
          options={Object.values(ServiceRequestStatus).map((s) => ({
            value: s,
            label: s,
          }))}
        />
      </FilterBar>

      {isLoading ? (
        <SkeletonList />
      ) : requests.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No service requests"
          description="Customer bookings will appear here."
        />
      ) : (
        <div className="space-y-2">
          {requests.map((r: ServiceRequest) => (
            <div
              key={r.RequestId}
              className="bg-white rounded-xl border border-slate-100 overflow-hidden"
            >
              {/* ── Summary row ── */}
              <button
                type="button"
                onClick={() =>
                  setExpanded(expanded === r.RequestId ? null : r.RequestId)
                }
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors min-w-0"
              >
                {/* Expand chevron */}
                <div
                  className={`shrink-0 w-6 h-6 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 transition-transform duration-200 ${expanded === r.RequestId ? "bg-primary-50 border-primary-200 rotate-180" : ""}`}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span
                      className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded"
                      title={r.RequestId}
                    >
                      #{shortId(r.RequestId)}
                    </span>
                    <StatusBadge status={r.Status} />
                    {/* Service name — the most important info upfront */}
                    {r.Service && (
                      <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100">
                        {r.Service.Title}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                    {r.User && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {r.User.FirstName} {r.User.SecondName}
                      </span>
                    )}
                    {r.LocationDescription && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[140px]">
                          {r.LocationDescription}
                        </span>
                      </span>
                    )}
                    {r.PreferredDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(r.PreferredDate).toLocaleDateString("en-KE", {
                          dateStyle: "medium",
                        })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions — stop propagation so expand doesn't fire */}
                <div
                  className="shrink-0 flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <select
                    value={r.Status}
                    disabled={updating === r.RequestId}
                    onChange={(e) =>
                      updateStatus(
                        r.RequestId,
                        e.target.value as ServiceRequestStatus,
                      )
                    }
                    className={`${SEL} w-32`}
                  >
                    {Object.values(ServiceRequestStatus).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <IconButton
                    onClick={() => setConfirmDel(r)}
                    icon={Trash2}
                    label="Delete"
                    variant="danger"
                  />
                </div>
              </button>

              {/* ── Expanded detail panel ── */}
              {expanded === r.RequestId && (
                <div className="border-t border-slate-100">
                  {/* Detail grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 px-4 py-4 bg-slate-50">
                    {/* Service requested */}
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                        Service Requested
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {r.Service?.Title ?? "N/A"}
                      </p>
                      {r.Service?.OnOffer && (
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full">
                          On Offer
                        </span>
                      )}
                    </div>

                    {/* Customer name */}
                    {r.User && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                          Customer
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {r.User.FirstName} {r.User.SecondName}
                        </p>
                        <p className="text-xs text-slate-400">{r.User.Role}</p>
                      </div>
                    )}

                    {/* Preferred date */}
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                        Preferred Date
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {r.PreferredDate
                          ? new Date(r.PreferredDate).toLocaleDateString(
                              "en-KE",
                              { dateStyle: "full" },
                            )
                          : "Not specified"}
                      </p>
                    </div>

                    {/* Phone */}
                    {r.User && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                          Phone
                        </p>
                        <a
                          href={`tel:${r.User.Phone}`}
                          className="text-sm font-semibold text-primary-600 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          {r.User.Phone}
                        </a>
                      </div>
                    )}

                    {/* Email */}
                    {r.User && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                          Email
                        </p>
                        <a
                          href={`mailto:${r.User.Email}`}
                          className="text-sm font-semibold text-primary-600 hover:underline truncate block"
                        >
                          {r.User.Email}
                        </a>
                      </div>
                    )}

                    {/* County */}
                    {r.User && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                          County
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {r.User.County}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Location description — full width */}
                  {r.LocationDescription && (
                    <div className="px-4 py-3 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                        Location / Address
                      </p>
                      <p className="text-sm text-slate-700 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        {r.LocationDescription}
                      </p>
                    </div>
                  )}

                  {/* Quick action buttons */}
                  {r.User && (
                    <div className="flex gap-2 px-4 py-3 border-t border-slate-100 bg-slate-50">
                      <a
                        href={`tel:${r.User.Phone}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call Customer
                      </a>
                      <a
                        href={`mailto:${r.User.Email}?subject=Re: Your ${r.Service?.Title ?? "Service"} Booking`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" /> Email Customer
                      </a>
                      <a
                        href={`https://wa.me/${r.User.Phone?.replace(/^0/, "254")}?text=${encodeURIComponent(`Hi ${r.User.FirstName}, regarding your ${r.Service?.Title ?? "service"} booking on ${r.PreferredDate ? new Date(r.PreferredDate).toLocaleDateString() : "the requested date"}…`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-colors"
                        style={{
                          background: "linear-gradient(135deg,#25d366,#128c7e)",
                        }}
                      >
                        <Phone className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <ConfirmModal
        open={!!confirmDel}
        title="Delete Request"
        message={`Remove booking ${shortId(confirmDel?.RequestId ?? "")} for ${confirmDel?.Service?.Title ?? "this service"}?`}
        loading={deleting}
        onConfirm={doDelete}
        onCancel={() => setConfirmDel(null)}
      />
    </AdminLayout>
  );
};

export const AdminJobs: React.FC = () => {
  useSocketInvalidation(ModelType.Job);
  const toast = useToast();
  const [activeFilter, setActive] = useState("all");
  const [panelMode, setPanel] = useState<"create" | "edit" | null>(null);
  const [editItem, setEditItem] = useState<Job | null>(null);
  const [confirmDel, setConfirmDel] = useState<Job | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: [ModelType.Job.toLowerCase()],
    queryFn: () => JobService.FetchAll(),
  });
  React.useEffect(() => {
    if (isError) toast.error("Failed to load jobs");
    // eslint-disable-next-line
  }, [isError]);

  const jobs = useMemo(() => {
    let list = data?.DataList ?? [];
    if (activeFilter === "active") list = list.filter((j) => j.IsActive);
    if (activeFilter === "inactive") list = list.filter((j) => !j.IsActive);
    return list;
  }, [data, activeFilter]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<Job>>();
  const openCreate = () => {
    setEditItem(null);
    reset({ IsActive: true });
    setPanel("create");
  };
  const openEdit = (j: Job) => {
    setEditItem(j);
    reset(j);
    setPanel("edit");
  };

  const onSubmit = async (v: Partial<Job>) => {
    setSaving(true);
    try {
      const r =
        panelMode === "create"
          ? await JobService.Create({
              Title: v.Title as string,
              Description: v.Description as string,
              Location: v.Location as string,
              SalaryRange: v.SalaryRange ?? undefined,
              EmploymentType: v.EmploymentType as string,
            })
          : await JobService.Update(editItem!.JobId, {
              Title: v.Title,
              Description: v.Description,
              Location: v.Location,
              SalaryRange: v.SalaryRange,
              IsActive: v.IsActive,
            });
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
      const r = await JobService.Delete(confirmDel!.JobId);
      toastResult(r, toast);
      if (r.Success) setConfirmDel(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.ErrorMessage ?? "Delete failed");
    } finally {
      setDeleting(false);
    }
  };
  const toggleActive = async (j: Job) => {
    setToggling(j.JobId);
    try {
      const r = await JobService.SoftDelete(j.JobId);
      toastResult(r, toast);
    } catch (error: any) {
      toast.error(error?.response?.data?.ErrorMessage ?? "Toggle failed");
    } finally {
      setToggling(null);
    }
  };

  return (
    <AdminLayout title="Jobs">
      <PageHeader
        title="Jobs"
        subtitle={`${jobs.length} listings`}
        breadcrumb={["Admin", "Jobs"]}
        action={
          <ActionButton
            onClick={openCreate}
            icon={Plus}
            label="Post Job"
            variant="primary"
            size="md"
          />
        }
      />
      <FilterBar>
        <FilterSelect
          value={activeFilter}
          onChange={setActive}
          placeholder="All Jobs"
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
      </FilterBar>

      {isLoading ? (
        <SkeletonList />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No job listings"
          description="Post jobs to attract candidates."
        />
      ) : (
        <div className="space-y-2">
          {jobs.map((j: Job) => (
            <ListCard key={j.JobId}>
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-semibold text-sm text-slate-900">
                      {j.Title}
                    </span>
                    <StatusBadge status={j.IsActive ? "Active" : "Inactive"} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                    {j.Location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {j.Location}
                      </span>
                    )}
                    {j.SalaryRange && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {j.SalaryRange}
                      </span>
                    )}
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1">
                  <IconButton
                    onClick={() => toggleActive(j)}
                    icon={j.IsActive ? ToggleLeft : ToggleRight}
                    label={j.IsActive ? "Deactivate" : "Activate"}
                    variant={j.IsActive ? "warning" : "success"}
                    loading={toggling === j.JobId}
                  />
                  <IconButton
                    onClick={() => openEdit(j)}
                    icon={Edit}
                    label="Edit"
                    variant="ghost"
                  />
                  <IconButton
                    onClick={() => setConfirmDel(j)}
                    icon={Trash2}
                    label="Delete"
                    variant="danger"
                  />
                </div>
              </div>
            </ListCard>
          ))}
        </div>
      )}

      <SlideOver
        open={!!panelMode}
        onClose={() => setPanel(null)}
        title={panelMode === "create" ? "Post New Job" : "Edit Job"}
        subtitle={editItem?.Title ?? undefined}
        width="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Job Title" required error={errors.Title?.message}>
            <input
              {...register("Title", { required: "Required" })}
              className={inputCls(!!errors.Title)}
            />
          </FormField>
          <FormField
            label="Description"
            required
            error={errors.Description?.message}
          >
            <textarea
              {...register("Description", { required: "Required" })}
              rows={4}
              className={`${inputCls()} resize-none`}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Location">
              <input
                {...register("Location")}
                className={inputCls()}
                placeholder="e.g. Nairobi"
              />
            </FormField>
            <FormField label="Salary Range">
              <input
                {...register("SalaryRange")}
                className={inputCls()}
                placeholder="e.g. KES 50k–80k"
              />
            </FormField>
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              {...register("IsActive")}
              className="w-3.5 h-3.5 rounded"
            />
            Active (visible on careers page)
          </label>
          <SubmitButton
            loading={saving}
            label={panelMode === "create" ? "Post Job" : "Save"}
          />
        </form>
      </SlideOver>
      <ConfirmModal
        open={!!confirmDel}
        title="Delete Job"
        message={`Delete "${confirmDel?.Title}"?`}
        loading={deleting}
        onConfirm={doDelete}
        onCancel={() => setConfirmDel(null)}
      />
    </AdminLayout>
  );
};

export const AdminJobApplications: React.FC = () => {
  useSocketInvalidation(ModelType.JobApplication);
  const toast = useToast();
  const [statusFilter, setStat] = useState("all");
  const [search, setSearch] = useState("");
  const [confirmDel, setConfirmDel] = useState<JobApplication | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: [ModelType.JobApplication.toLowerCase()],
    queryFn: () => JobApplicationService.FetchAll(),
  });
  React.useEffect(() => {
    if (isError) toast.error("Failed to load applications");
    // eslint-disable-next-line
  }, [isError]);

  const apps = useMemo(() => {
    let list: JobApplication[] = data?.DataList ?? [];
    if (statusFilter !== "all")
      list = list.filter((a) => a.Status === statusFilter);
    if (search)
      list = list.filter(
        (a) =>
          `${a.FullName}`.toLowerCase().includes(search.toLowerCase()) ||
          a.Email.toLowerCase().includes(search.toLowerCase()),
      );
    return list;
  }, [data, statusFilter, search]);

  const PIPELINE: JobApplicationStatus[] = [
    JobApplicationStatus.Pending,
    JobApplicationStatus.Reviewing,
    JobApplicationStatus.Interview,
    JobApplicationStatus.Accepted,
    JobApplicationStatus.Rejected,
  ];

  const updateStatus = async (id: string, status: JobApplicationStatus) => {
    setUpdating(id);
    try {
      const r = await JobApplicationService.UpdateApplicationStatus(id, status);
      toastResult(r, toast);
    } catch (error: any) {
      toast.error(error?.response?.data?.ErrorMessage ?? "Update failed");
    } finally {
      setUpdating(null);
    }
  };

  const doDelete = async () => {
    setDeleting(true);
    try {
      const r = await JobApplicationService.Delete(confirmDel!.ApplicationId);
      toastResult(r, toast);
      if (r.Success) setConfirmDel(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.ErrorMessage ?? "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout title="Applications">
      <PageHeader
        title="Applications"
        subtitle={`${apps.length} applicant${apps.length !== 1 ? "s" : ""}`}
        breadcrumb={["Admin", "Applications"]}
      />
      <FilterBar>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name or email…"
        />
        <FilterSelect
          value={statusFilter}
          onChange={setStat}
          placeholder="All Statuses"
          options={PIPELINE.map((s) => ({ value: s, label: s }))}
        />
      </FilterBar>

      {isLoading ? (
        <SkeletonList />
      ) : apps.length === 0 ? (
        <EmptyState icon={UserCheck} title="No applications found" />
      ) : (
        <div className="space-y-2">
          {apps.map((a: JobApplication) => (
            <div
              key={a.ApplicationId}
              className="bg-white rounded-xl border border-slate-100 overflow-hidden"
            >
              {/* ── Summary row (clickable to expand) ── */}
              <button
                type="button"
                onClick={() =>
                  setExpanded(
                    expanded === a.ApplicationId ? null : a.ApplicationId,
                  )
                }
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors min-w-0"
              >
                {/* Expand chevron */}
                <div
                  className={`shrink-0 w-6 h-6 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 transition-transform duration-200 ${
                    expanded === a.ApplicationId
                      ? "bg-primary-50 border-primary-200 rotate-180"
                      : ""
                  }`}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-semibold text-sm text-slate-900">
                      {a.FullName}
                    </span>
                    <StatusBadge status={a.Status} />
                    {a.Job?.Title && (
                      <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100">
                        {a.Job.Title}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {a.Email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {a.Phone}
                    </span>
                    {a.Job?.Location && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {a.Job.Location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions — stop propagation so expand doesn't fire */}
                <div
                  className="shrink-0 flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <select
                    value={a.Status}
                    disabled={updating === a.ApplicationId}
                    onChange={(e) =>
                      updateStatus(
                        a.ApplicationId,
                        e.target.value as JobApplicationStatus,
                      )
                    }
                    className={`${SEL} w-28`}
                  >
                    {PIPELINE.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <IconButton
                    onClick={() => setConfirmDel(a)}
                    icon={Trash2}
                    label="Delete"
                    variant="danger"
                  />
                </div>
              </button>

              {/* ── Expanded detail panel ── */}
              {expanded === a.ApplicationId && (
                <div className="border-t border-slate-100">
                  {/* Detail grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 px-4 py-4 bg-slate-50">
                    {/* Applicant name */}
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                        Full Name
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {a.FullName}
                      </p>
                    </div>

                    {/* Email */}
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                        Email
                      </p>
                      <a
                        href={`mailto:${a.Email}`}
                        className="text-sm font-semibold text-primary-600 hover:underline truncate block"
                      >
                        {a.Email}
                      </a>
                    </div>

                    {/* Phone */}
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                        Phone
                      </p>
                      <a
                        href={`tel:${a.Phone}`}
                        className="text-sm font-semibold text-primary-600 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        {a.Phone}
                      </a>
                    </div>

                    {/* Applied for */}
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                        Position Applied
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {a.Job?.Title ?? "N/A"}
                      </p>
                    </div>

                    {/* Employment type */}
                    {a.Job?.EmploymentType && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                          Employment Type
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {a.Job.EmploymentType}
                        </p>
                      </div>
                    )}

                    {/* Salary range */}
                    {a.Job?.SalaryRange && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                          Salary Range
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {a.Job.SalaryRange}
                        </p>
                      </div>
                    )}

                    {/* Location */}
                    {a.Job?.Location && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                          Job Location
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {a.Job.Location}
                        </p>
                      </div>
                    )}

                    {/* Applied on */}
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                        Applied On
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {new Date(a.CreatedAt).toLocaleDateString("en-KE", {
                          dateStyle: "full",
                        })}
                      </p>
                    </div>

                    {/* Current status */}
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                        Current Status
                      </p>
                      <StatusBadge status={a.Status} />
                    </div>
                  </div>

                  {/* Pipeline progress — full width */}
                  <div className="px-4 py-3 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">
                      Application Pipeline
                    </p>
                    <div className="flex items-center gap-0.5 flex-wrap">
                      {PIPELINE.map((step, i) => {
                        const ci = PIPELINE.indexOf(
                          a.Status as JobApplicationStatus,
                        );
                        return (
                          <React.Fragment key={step}>
                            <span
                              className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                                i === ci
                                  ? "bg-primary-600 text-white"
                                  : i < ci
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              {step}
                            </span>
                            {i < PIPELINE.length - 1 && (
                              <span
                                className={`w-3 h-px ${i < ci ? "bg-emerald-300" : "bg-slate-200"}`}
                              />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                  {/* Job description — full width */}
                  {a.Job?.Description && (
                    <div className="px-4 py-3 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                        Job Description
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {a.Job.Description}
                      </p>
                    </div>
                  )}

                  {/* Quick action buttons */}
                  <div className="flex gap-2 px-4 py-3 border-t border-slate-100 bg-slate-50 flex-wrap">
                    <a
                      href={`tel:${a.Phone}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call Applicant
                    </a>
                    <a
                      href={`mailto:${a.Email}?subject=Re: Your Application for ${a.Job?.Title ?? "the position"}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" /> Email Applicant
                    </a>
                    <a
                      href={`https://wa.me/${a.Phone?.replace(/^0/, "254")}?text=${encodeURIComponent(
                        `Hi ${a.FullName}, regarding your application for ${a.Job?.Title ?? "the position"} at Raz Technologies…`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-colors"
                      style={{
                        background: "linear-gradient(135deg,#25d366,#128c7e)",
                      }}
                    >
                      <Phone className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!confirmDel}
        title="Delete Application"
        message={`Remove application from ${confirmDel?.FullName}?`}
        loading={deleting}
        onConfirm={doDelete}
        onCancel={() => setConfirmDel(null)}
      />
    </AdminLayout>
  );
};