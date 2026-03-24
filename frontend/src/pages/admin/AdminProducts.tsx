import React, { useState, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Star,
  Tag,
  CheckCircle,
  XCircle,
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
  ProductImageManager,
  type ManagedImage,
  SectionDivider,
  SubmitButton,
} from "./components/AdminUI";
import { useToast, toastResult } from "../../components/Toast";
import { ModelType } from "../../enums/enums";
import { useSocketInvalidation } from "../../hooks/socket.hook";
import { Product } from "../../interfaces/interfaces";
import AdminLayout from "./layouts/AdminLayout";
import { ProductService } from "../../services/product.service";
import { CategoryService } from "../../services/category.service";
import { CreateProductDto } from "../../dtos/dto";
import { ProductImageService } from "../../services/product.image.service";
import { log } from "console";

const fmtKES = (n: number) => `KES ${n.toLocaleString("en-KE")}`;
const toManaged = (p: Product): ManagedImage[] =>
  (p.Images ?? []).map((img) => ({
    ImageId: img.ImageId,
    ImageUrl: img.ImageUrl,
  }));

// ─── PRODUCT ROW CARD ─────────────────────────────────────────────
const ProductRow: React.FC<{
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}> = ({ product, onEdit, onDelete }) => {
  const thumb = product.Images?.[0]?.ImageUrl;

  return (
    <ListCard>
      <div className="flex items-center gap-3 min-w-0">
        {/* Thumbnail */}
        <div className="shrink-0 w-11 h-11 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
          {thumb ? (
            <img
              src={thumb}
              alt={product.Name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package className="w-5 h-5 text-slate-300 m-3" />
          )}
        </div>

        {/* Name + badges */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <span className="font-semibold text-sm text-slate-900 truncate max-w-[200px] sm:max-w-none">
              {product.Name}
            </span>
            {product.IsFeatured && (
              <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200 px-1.5 py-0.5 rounded-full">
                <Star className="w-2.5 h-2.5" />
                Featured
              </span>
            )}
            {product.OnOffer && (
              <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-semibold bg-primary-50 text-primary-700 ring-1 ring-primary-200 px-1.5 py-0.5 rounded-full">
                <Tag className="w-2.5 h-2.5" />
                Offer
              </span>
            )}
          </div>
          {/* Meta row */}
          <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
            <span className="font-semibold text-slate-700">
              {fmtKES(product.OfferPrice ?? product.Price)}
            </span>
            {product.OnOffer && (product.OfferPrice) && (
              <span className="line-through">{fmtKES(product.Price)}</span>
            )}
            {product.Category && (
              <span className="hidden sm:inline">{product.Category.Name}</span>
            )}
            <span
              className={`font-medium ${product.Quantity > 5 ? "text-emerald-600" : product.Quantity > 0 ? "text-amber-600" : "text-red-500"}`}
            >
              {product.Quantity > 5
                ? `${product.Quantity} in stock`
                : product.Quantity > 0
                  ? `${product.Quantity} left`
                  : "Out of stock"}
            </span>
          </div>
        </div>

        {/* Status + actions — flush right, no overflow */}
        <div className="shrink-0 flex items-center gap-2">
          <StatusBadge status={product.IsAvailable ? "Active" : "Inactive"} />
          <div className="flex items-center gap-1">
            <IconButton
              onClick={() => onEdit(product)}
              icon={Edit}
              label="Edit product"
              variant="ghost"
            />
            <IconButton
              onClick={() => onDelete(product)}
              icon={Trash2}
              label="Delete product"
              variant="danger"
            />
          </div>
        </div>
      </div>
    </ListCard>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────
const AdminProducts: React.FC = () => {
  useSocketInvalidation(ModelType.Product, ModelType.Category);
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [availFilter, setAvailFilter] = useState("all");
  const [offerFilter, setOfferFilter] = useState("all");
  const [panelMode, setPanelMode] = useState<"create" | "edit" | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [confirmDel, setConfirmDel] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [images, setImages] = useState<ManagedImage[]>([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: [ModelType.Product.toLowerCase()],
    queryFn: () => ProductService.FetchAll(),
  });

  const { data: catsData } = useQuery({
    queryKey: [ModelType.Category.toLowerCase()],
    queryFn: () => CategoryService.FetchAll(),
  });

  const categories = catsData?.DataList ?? [];

  React.useEffect(() => {
    if (isError) toast.error("Failed to load products");
  }, [isError]);

  const products = useMemo(() => {
    let list = data?.DataList ?? [];
    if (catFilter !== "all")
      list = list.filter((p) => p.Category?.CategoryId === catFilter);
    if (availFilter === "in") list = list.filter((p) => p.IsAvailable);
    if (availFilter === "out") list = list.filter((p) => !p.IsAvailable);
    if (offerFilter === "yes") list = list.filter((p) => p.OnOffer);
    if (offerFilter === "no") list = list.filter((p) => !p.OnOffer);
    if (search)
      list = list.filter(
        (p) =>
          p.Name.toLowerCase().includes(search.toLowerCase()) ||
          (p.Category?.Name ?? "").toLowerCase().includes(search.toLowerCase()),
      );
    return list;
  }, [data, catFilter, availFilter, offerFilter, search]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<Product>>();

  const openCreate = () => {
    setEditProduct(null);
    setImages([]);
    reset({
      IsAvailable: true,
      OnOffer: false,
      IsFeatured: false,
      Quantity: 1,
    });
    setPanelMode("create");
  };
  const openEdit = (p: Product) => {
    setEditProduct(p);
    setImages(toManaged(p));
    reset(p);
    setPanelMode("edit");
  };

  const onSubmit = async (values: Partial<Product>) => {
    setSaving(true);
    try {
      const dto = {
        ...values,
        ImageUrls: images.map((img) => ({
          ImageId: img.isNew ? "" : img.ImageId,
          ProductId: editProduct?.ProductId ?? "",
          ImageUrl: img.ImageUrl,
          IsDeleted: false,
          CreatedAt: new Date(),
          UpdatedAt: new Date(),
        })),
      };
      const result =
        panelMode === "create"
          ? await ProductService.Create({
              Name: dto.Name as string,
              Description: dto.Description as string,
              Price: Number(dto.Price),
              OfferPrice: dto.OfferPrice ?? undefined,
              OnOffer: dto.OnOffer ?? undefined,
              Quantity: Number(dto.Quantity),
              CategoryId: dto.CategoryId as string,
              IsFeatured: dto.IsFeatured ?? undefined,
              IsAvailable: dto.IsAvailable ?? undefined,
              ImageUrls: dto.ImageUrls.map((i) => i.ImageUrl),
            })
          : await ProductService.Update(editProduct!.ProductId, {Name: dto.Name,
              Description: dto.Description,
              Price: Number(dto.Price),
              OfferPrice: dto.OfferPrice,
              OnOffer: dto.OnOffer ?? undefined,
              Quantity: Number(dto.Quantity),
              CategoryId: dto.CategoryId,
              IsFeatured: dto.IsFeatured ?? undefined,
              IsAvailable: dto.IsAvailable ?? undefined
            });
      toastResult(result, toast);
      if (result.Success) setPanelMode(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.ErrorMessage ?? "Could not save product.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpdate = async (imageId: string, url: string) => {
    toastResult(await ProductImageService.Update(imageId, {ImageUrl: url}), toast);
  };
  const handleImageDelete = async (imageId: string) => {
    toastResult(
      await ProductImageService.Delete(imageId),
      toast,
    );
  };

  const handleDelete = async () => {
    if (!confirmDel) return;
    setDeleting(true);
    try {
      const result = await ProductService.Delete(
        confirmDel.ProductId,
      );
      toastResult(result, toast);
      if (result.Success) setConfirmDel(null);
    } catch (error) {
      toast.error( error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout title="Products">
      <PageHeader
        title="Products"
        subtitle={`${products.length} product${products.length !== 1 ? "s" : ""}`}
        breadcrumb={["Admin", "Products"]}
        action={
          <ActionButton
            onClick={openCreate}
            icon={Plus}
            label="Add Product"
            variant="primary"
            size="md"
          />
        }
      />

      <FilterBar>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search products…"
        />
        <FilterSelect
          value={catFilter}
          onChange={setCatFilter}
          placeholder="All Categories"
          options={categories.map((c) => ({
            value: c.CategoryId,
            label: c.Name,
          }))}
        />
        <FilterSelect
          value={availFilter}
          onChange={setAvailFilter}
          placeholder="Availability"
          options={[
            { value: "in", label: "In Stock" },
            { value: "out", label: "Out of Stock" },
          ]}
        />
        <FilterSelect
          value={offerFilter}
          onChange={setOfferFilter}
          placeholder="Offer"
          options={[
            { value: "yes", label: "On Offer" },
            { value: "no", label: "No Offer" },
          ]}
        />
      </FilterBar>

      {isLoading ? (
        <SkeletonList />
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description="Try adjusting your filters or add a new product."
          action={
            <ActionButton
              onClick={openCreate}
              icon={Plus}
              label="Add Product"
              variant="primary"
              size="sm"
            />
          }
        />
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <ProductRow
              key={p.ProductId}
              product={{...p, CategoryId: p.Category?.CategoryId as string}}
              onEdit={openEdit}
              onDelete={setConfirmDel}
            />
          ))}
        </div>
      )}

      {/* Create / Edit panel */}
      <SlideOver
        open={!!panelMode}
        onClose={() => setPanelMode(null)}
        title={panelMode === "create" ? "Add Product" : "Edit Product"}
        subtitle={editProduct?.Name}
        width="xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <SectionDivider label="Basic Info" />
          <FormField label="Product Name" required error={errors.Name?.message}>
            <input
              {...register("Name", { required: "Required" })}
              className={inputCls(!!errors.Name)}
              placeholder="e.g. 10KVA Solar Inverter"
            />
          </FormField>
          <FormField
            label="Description"
            required
            error={errors.Description?.message}
          >
            <textarea
              {...register("Description", { required: "Required" })}
              rows={3}
              className={`${inputCls()} resize-none`}
            />
          </FormField>

          <SectionDivider label="Pricing & Stock" />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Price (KES)"
              required
              error={errors.Price?.message}
            >
              <input
                {...register("Price", {
                  required: "Required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Must be ≥ 0" },
                })}
                type="number"
                className={inputCls(!!errors.Price)}
              />
            </FormField>
            <FormField label="Offer Price (KES)" hint="Optional">
              <input
                {...register("OfferPrice", { valueAsNumber: true })}
                type="number"
                className={inputCls()}
                placeholder="—"
              />
            </FormField>
            <FormField
              label="Quantity"
              required
              error={errors.Quantity?.message}
            >
              <input
                {...register("Quantity", {
                  required: "Required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Must be ≥ 0" },
                })}
                type="number"
                className={inputCls(!!errors.Quantity)}
              />
            </FormField>
            <FormField
              label="Category"
              required
              error={errors.CategoryId?.message}
            >
              <select
                {...register("CategoryId", { required: "Required" })}
                className={inputCls(!!errors.CategoryId)}
              >
                <option value="">Select…</option>
                {categories.map((c) => (
                  <option key={c.CategoryId} value={c.CategoryId}>
                    {c.Name}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <SectionDivider label="Flags" />
          <div className="flex gap-5">
            {(
              [
                ["OnOffer", "On Offer"],
                ["IsFeatured", "Featured"],
                ["IsAvailable", "Available"],
              ] as const
            ).map(([n, l]) => (
              <label
                key={n}
                className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer"
              >
                <input
                  type="checkbox"
                  {...register(n as any)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-primary-600 focus:ring-primary-400"
                />
                {l}
              </label>
            ))}
          </div>

          <SectionDivider label="Images" />
          <ProductImageManager
            images={images}
            onChange={setImages}
            onUpdateExisting={
              panelMode === "edit" ? handleImageUpdate : undefined
            }
            onDeleteExisting={
              panelMode === "edit" ? handleImageDelete : undefined
            }
          />

          <div className="pt-2">
            <SubmitButton
              loading={saving}
              label={panelMode === "create" ? "Create Product" : "Save Changes"}
            />
          </div>
        </form>
      </SlideOver>

      <ConfirmModal
        open={!!confirmDel}
        title="Delete Product"
        message={`Soft-delete "${confirmDel?.Name}"? It will be hidden from the store.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDel(null)}
      />
    </AdminLayout>
  );
};

export default AdminProducts;