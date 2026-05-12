import React, { useMemo, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Package,
  Zap,
  Search,
  SlidersHorizontal,
  Loader2,
  ChevronRight,
  Tag,
  Star,
  ShoppingCart,
  Phone,
  Calendar,
  MapPin,
  X,
  MessageCircle,
  Folder,
  ArrowLeft,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { toastResult, useToast } from "../components/Toast";
import { ModelType } from "../enums/enums";
import { useScrollReveal } from "../hooks/Helper";
import { useSocketInvalidation } from "../hooks/socket.hook";
import { Service, Product, Category } from "../interfaces/interfaces";
import { ProductService } from "../services/product.service";
import { ServicesService } from "../services/service.service";
import Footer from "./home/Footer";
import { CreateCartItemDto } from "../dtos/dto";
import { CartItemService } from "../services/cart.item.service";
import { ServiceRequestService } from "../services/service.request.service";
import { useAuth } from "../context/AuthContext";
import { CategoryService } from "../services/category.service";

const formatKES = (v: number) => `KES ${v.toLocaleString("en-KE")}`;

const WHATSAPP_NUMBER = "254746430693";
function whatsappOrderUrl(name: string) {
  const msg = encodeURIComponent(
    `Hi Raz Technologies! I'd like to order: *${name}*. Please share availability and delivery details.`,
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

interface BookingForm {
  PreferredDate: string;
  LocationDescription: string;
}

const ServiceBookingModal: React.FC<{
  service: Service;
  onClose: () => void;
}> = ({ service, onClose }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingForm>();

  const inputCls = (e = false) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
      e
        ? "border-red-300 focus:ring-red-100 bg-red-50/30"
        : "border-slate-200 focus:border-primary-400 focus:ring-primary-100 bg-white"
    }`;

  const onSubmit = async (data: BookingForm) => {
    if (!user) {
      toast.error("Please log in to book a service");
      setTimeout(
        () =>
          navigate(
            `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
            { replace: true },
          ),
        5000,
      );
      return;
    }

    setLoading(true);
    try {
      let result = await ServiceRequestService.Create({
        ServiceId: service.ServiceId,
        LocationDescription: data.LocationDescription,
        PreferredDate: new Date(`${data.PreferredDate}T00:00:00Z`),
      });
      toastResult(result, toast);
      if (result.Success) {
        reset();
        onClose();
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.Title ?? "Booking Failed",
        error?.response?.data?.ErrorMessage ?? "Please try again or call us.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ animation: "fadeUp .25s ease-out" }}
      >
        <div
          className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4"
          style={{ background: "linear-gradient(135deg,#0d1a42,#1660eb)" }}
        >
          <div>
            <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-1">
              Book a Service
            </p>
            <h3 className="font-display font-700 text-white text-lg leading-tight">
              {service.Title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Preferred Date <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                {...register("PreferredDate", {
                  required: "Please choose a date",
                })}
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className={`${inputCls(!!errors.PreferredDate)} pl-10`}
              />
            </div>
            {errors.PreferredDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.PreferredDate.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Location / Address <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <textarea
                {...register("LocationDescription", {
                  required: "Location required",
                  minLength: { value: 10, message: "Be more specific" },
                })}
                rows={3}
                placeholder="e.g. Westlands, Nairobi — near ABC Mall, Gate 2"
                className={`${inputCls(!!errors.LocationDescription)} pl-10 resize-none`}
              />
            </div>
            {errors.LocationDescription && (
              <p className="text-red-500 text-xs mt-1">
                {errors.LocationDescription.message}
              </p>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Our team will contact you within{" "}
            <strong className="text-slate-600">2 hours</strong> to confirm. Call
            us at{" "}
            <a
              href="tel:+254746430693"
              className="text-primary-600 font-semibold"
            >
              +254 746 430 693
            </a>
            .
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-sm disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#1660eb,#0d1a42)" }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" /> Confirm Booking
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── Service card ─────────────────────────────────────────────────
const ServiceExploreCard: React.FC<{
  service: Service;
  onBook: (s: Service) => void;
}> = ({ service, onBook }) => {
  const navigate = useNavigate();

  return (
    <div
      className="product-card group flex flex-col cursor-pointer hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5"
      onClick={() => navigate(`/services/${service.ServiceId}`)}
    >
      {service.ImageUrl && (
        <div className="relative h-48 overflow-hidden shrink-0">
          <img
            src={service.ImageUrl}
            alt={service.Title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
          {service.OnOffer && (
            <span className="absolute top-3 right-3 bg-amber-400 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Tag className="w-3 h-3" /> On Offer
            </span>
          )}
          <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="bg-white text-primary-600 text-xs font-bold px-3 py-1 rounded-full shadow">
              View Details →
            </span>
          </div>
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display font-700 text-lg text-navy-900 mb-2">
          {service.Title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-5 line-clamp-3">
          {service.Description}
        </p>
        {/* Stop propagation so card click doesn't fire when using buttons */}
        <div
          className="flex gap-2 mt-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onBook(service)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
            style={{ background: "linear-gradient(135deg,#1660eb,#0d1a42)" }}
          >
            <Calendar className="w-4 h-4" /> Book Service
          </button>
          <a
            href="tel:+254746430693"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center px-4 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 hover:border-primary-400 hover:text-primary-600 transition-all duration-200"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

// ─── Services list ────────────────────────────────────────────────
const ServicesList: React.FC = () => {
  useSocketInvalidation(ModelType.Service);
  const [search, setSearch] = useState("");
  const [bookingService, setBook] = useState<Service | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: [ModelType.Service.toLowerCase()],
    queryFn: () => ServicesService.FetchAll(),
  });

  const services = useMemo(
    () =>
      (data?.DataList ?? []).filter(
        (s) =>
          s.Title.toLowerCase().includes(search.toLowerCase()) ||
          s.Description.toLowerCase().includes(search.toLowerCase()),
      ),
    [data, search],
  );

  useScrollReveal([services.length]);

  return (
    <div>
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services…"
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 text-sm transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          No services found{search ? ` matching "${search}"` : ""}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {services.map((s) => (
            <ServiceExploreCard
              key={s.ServiceId}
              service={s}
              onBook={setBook}
            />
          ))}
        </div>
      )}
      {bookingService && (
        <ServiceBookingModal
          service={bookingService}
          onClose={() => setBook(null)}
        />
      )}
    </div>
  );
};

// ─── Product card ─────────────────────────────────────────────────
const ProductExploreCard: React.FC<{ product: Product }> = ({ product }) => {
  const toast = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const image =
    product.Images?.[0]?.ImageUrl ??
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80";

  async function handleAddToCart(data: CreateCartItemDto): Promise<void> {
    if (!user) {
      toast.error("Please log in to add products to cart");
      setTimeout(
        () =>
          navigate(
            `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
            { replace: true },
          ),
        5000,
      );
      return;
    }

    try {
      let result = await CartItemService.Create(data);
      toastResult(result, toast);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.ErrorMessage ?? "Unable to add to cart",
      );
    }
  }

  return (
    <div
      className="product-card group flex flex-col cursor-pointer hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5"
      onClick={() => navigate(`/products/${product.ProductId}`)}
    >
      <div className="relative h-52 overflow-hidden shrink-0 bg-slate-100">
        {image ? (
          <img
            src={image}
            alt={product.Name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <Package className="w-10 h-10 text-slate-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 to-transparent" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.OnOffer && product.OfferPrice && (
            <span className="bg-amber-400 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {Math.round(
                ((product.Price - product.OfferPrice) / product.Price) * 100,
              )}
              % OFF
            </span>
          )}
          {product.IsFeatured && (
            <span className="bg-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" /> Featured
            </span>
          )}
        </div>
        {/* View details hint on hover */}
        <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="bg-white text-primary-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            View Details →
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        {product.Category && (
          <span className="text-xs font-semibold text-primary-500 uppercase tracking-wide mb-1">
            {product.Category.Name}
          </span>
        )}
        <h3 className="font-display font-700 text-base text-navy-900 mb-2 leading-snug line-clamp-2">
          {product.Name}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 flex-1 mb-4">
          {product.Description}
        </p>

        <div className="flex items-end gap-2 mb-3">
          <span className="text-xl font-900 text-navy-900">
            {formatKES(product.OfferPrice ?? product.Price)}
          </span>
          {product.OnOffer && product.OfferPrice && (
            <span className="text-sm text-slate-400 line-through mb-0.5">
              {formatKES(product.Price)}
            </span>
          )}
        </div>

        {/* Stop propagation on action buttons so card click doesn't also fire */}
        <div
          className="flex flex-col gap-2 mt-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-2">
            <button
              disabled={!product.IsAvailable}
              onClick={() =>
                handleAddToCart({ ProductId: product.ProductId, Quantity: 1 })
              }
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white transition-all duration-200 disabled:opacity-40"
            >
              <ShoppingCart className="w-4 h-4" /> Cart
            </button>
            <a
              href={whatsappOrderUrl(product.Name)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white ${!product.IsAvailable ? "opacity-40 pointer-events-none" : ""}`}
              style={{ background: "linear-gradient(135deg,#25d366,#128c7e)" }}
            >
              <MessageCircle className="w-4 h-4" /> Order
            </a>
          </div>
          <a
            href="tel:+254746430693"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-primary-600 border border-slate-200 hover:border-primary-300 transition-all duration-200"
          >
            <Phone className="w-3.5 h-3.5" /> Call to Order
          </a>
        </div>
      </div>
    </div>
  );
};

const CategoryBar: React.FC<{
  categories: Category[];
  selected: string;
  onSelect: (id: string) => void;
}> = ({ categories, selected, onSelect }) => (
  <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
    <button
      onClick={() => onSelect("all")}
      className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
        selected === "all"
          ? "bg-primary-600 text-white shadow-sm"
          : "bg-white border border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600"
      }`}
    >
      <Folder className="w-3.5 h-3.5" /> All
    </button>
    {categories.map((cat) => (
      <button
        key={cat.CategoryId}
        onClick={() => onSelect(cat.CategoryId)}
        className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
          selected === cat.CategoryId
            ? "bg-primary-600 text-white shadow-sm"
            : "bg-white border border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600"
        }`}
      >
        {cat.ImageUrl && (
          <img
            src={cat.ImageUrl}
            alt=""
            className="w-4 h-4 rounded object-cover"
          />
        )}
        {cat.Name}
      </button>
    ))}
  </div>
);

const ProductsList: React.FC = () => {
  useSocketInvalidation(ModelType.Product);

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">(
    "default",
  );
  const selectedCat = searchParams.get("category") ?? "all";

  const setCategory = (id: string) => {
    const next = new URLSearchParams(searchParams);
    if (id === "all") next.delete("category");
    else next.set("category", id);
    setSearchParams(next);
  };

  const { data: productsData, isLoading: loadingProducts } = useQuery({
    queryKey: [ModelType.Product.toLowerCase()],
    queryFn: () => ProductService.FetchAll(),
  });

  const { data: catsData, isLoading: loadingCats } = useQuery({
    queryKey: [ModelType.Category.toLowerCase()],
    queryFn: () => CategoryService.FetchAll(),
  });

  const categories = catsData?.DataList ?? [];

  let products = useMemo(() => {
    let list = productsData?.DataList ?? [];
    if (selectedCat !== "all")
      list = list.filter((p) => p.CategoryId === selectedCat);
    if (search)
      list = list.filter(
        (p) =>
          p.Name.toLowerCase().includes(search.toLowerCase()) ||
          p.Description.toLowerCase().includes(search.toLowerCase()) ||
          (p.Category?.Name ?? "").toLowerCase().includes(search.toLowerCase()),
      );
    if (sortBy === "price-asc")
      list = [...list].sort(
        (a, b) => (a.OfferPrice ?? a.Price) - (b.OfferPrice ?? b.Price),
      );
    if (sortBy === "price-desc")
      list = [...list].sort(
        (a, b) => (b.OfferPrice ?? b.Price) - (a.OfferPrice ?? a.Price),
      );
    return list;
  }, [productsData, selectedCat, search, sortBy]);

  useScrollReveal([products.length]);

  if (loadingProducts)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );

  return (
    <div>
      {/* Category pills */}
      {!loadingCats && categories.length > 0 && (
        <div className="mb-5">
          <CategoryBar
            categories={categories}
            selected={selectedCat}
            onSelect={setCategory}
          />
        </div>
      )}

      {/* Search + sort row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 text-sm transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="py-3 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-400 text-sm bg-white"
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      {(search || selectedCat !== "all") && (
        <p className="text-sm text-slate-400 mb-4">
          {products.length} product{products.length !== 1 ? "s" : ""}
          {selectedCat !== "all" &&
          categories.find((c) => c.CategoryId === selectedCat)
            ? ` in ${categories.find((c) => c.CategoryId === selectedCat)!.Name}`
            : ""}
          {search ? ` matching "${search}"` : ""}
        </p>
      )}

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <Package className="w-10 h-10 mx-auto mb-3 text-slate-200" />
          <p className="text-slate-400 font-medium">No products found.</p>
          {(search || selectedCat !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setCategory("all");
              }}
              className="mt-4 text-sm text-primary-600 hover:underline font-semibold"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductExploreCard key={p.ProductId} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab =
    (searchParams.get("tab") as "services" | "products") ?? "services";

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />

      {/* Header */}
      <div
        className="pt-28 pb-10"
        style={{
          background: "linear-gradient(135deg,#0d1a42 0%,#1660eb 100%)",
        }}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-white/50 text-sm flex-wrap">
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Explore</span>
            </div>
            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-700 text-white mt-4 mb-2">
            {tab === "services" ? "All Services" : "All Products"}
          </h1>
          <p className="text-white/60 max-w-xl text-sm">
            {tab === "services"
              ? "Book professional installation and repair services for your home or business."
              : "Browse our quality electronic products. Click any product to see full details."}
          </p>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="sticky top-16 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="container-custom">
          <div className="flex">
            {(["services", "products"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  const next = new URLSearchParams();
                  next.set("tab", t);
                  setSearchParams(next);
                }}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all duration-200 capitalize ${
                  tab === t
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                }`}
              >
                {t === "services" ? (
                  <Zap className="w-4 h-4" />
                ) : (
                  <Package className="w-4 h-4" />
                )}
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-custom py-10">
        {tab === "services" ? <ServicesList /> : <ProductsList />}
      </div>

      <Footer />

      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ExplorePage;
