import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ShoppingCart,
  MessageCircle,
  Phone,
  Tag,
  Star,
  CheckCircle,
  XCircle,
  Package,
  ChevronRight,
  Loader2,
  Share2,
  Plus,
  Minus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast, toastResult } from "../components/Toast";
import { Navbar } from "../components/Navbar";
import { ModelType } from "../enums/enums";
import { Product } from "../interfaces/interfaces";
import { CartItemService } from "../services/cart.item.service";
import Footer from "./home/Footer";
import { ProductService } from "../services/product.service";

// ─── Helpers ──────────────────────────────────────────────────────
function fmtKES(value?: number | string) {
  const num = Number(value);
  if (isNaN(num)) return "KES 0.00"; // fallback
  return num.toLocaleString("en-KE", {
    style: "currency",
    currency: "KES",
  });
}

const WHATSAPP_NUMBER = "254746430693";
const waUrl = (name: string) => {
  const msg = encodeURIComponent(
    `Hi Raz Technologies! I'd like to order: *${name}*. Please share availability and delivery details.`,
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
};

// ─── Image gallery ────────────────────────────────────────────────
const ImageGallery: React.FC<{
  images: { ImageId: string; ImageUrl: string }[];
  name: string;
}> = ({ images, name }) => {
  const [active, setActive] = useState(0);

  if (!images.length) {
    return (
      <div className="w-full aspect-square rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
        <Package className="w-16 h-16 text-slate-300" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
        <img
          src={images[active].ImageUrl}
          alt={name}
          className="w-full h-full object-cover transition-all duration-400"
        />
      </div>

      {/* Thumbnails — only show if more than 1 */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.ImageId}
              onClick={() => setActive(i)}
              className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                i === active
                  ? "border-primary-500 shadow-sm scale-105"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <img
                src={img.ImageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Star display ─────────────────────────────────────────────────
const StarDisplay: React.FC<{ rating: number; count?: number }> = ({
  rating,
  count,
}) => (
  <div className="flex items-center gap-1.5">
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-4 h-4 ${n <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
        />
      ))}
    </div>
    {count !== undefined && (
      <span className="text-sm text-slate-500">
        ({count} review{count !== 1 ? "s" : ""})
      </span>
    )}
  </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────
const ProductSkeleton: React.FC = () => (
  <div className="container-custom py-10">
    <div className="skeleton h-5 w-48 rounded-lg mb-8" />
    <div className="grid md:grid-cols-2 gap-10">
      <div className="skeleton aspect-square rounded-2xl" />
      <div className="space-y-4">
        <div className="skeleton h-4 w-24 rounded" />
        <div className="skeleton h-8 w-3/4 rounded-xl" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton h-10 w-1/3 rounded-xl mt-4" />
        <div className="skeleton h-3 w-full rounded mt-4" />
        <div className="skeleton h-3 w-5/6 rounded" />
        <div className="skeleton h-3 w-4/6 rounded" />
        <div className="flex gap-3 mt-8">
          <div className="skeleton h-12 flex-1 rounded-xl" />
          <div className="skeleton h-12 flex-1 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────
const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { user } = useAuth();

  const [qty, setQty] = useState(1);
  const [addingToCart, setAdding] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: [ModelType.Product.toLowerCase(), productId],
    queryFn: () => ProductService.FetchById(productId as string),
    enabled: !!productId,
  });

  const product = data?.Data as Product | undefined;

  React.useEffect(() => {
    if (product) setQty(1);
    // eslint-disable-next-line
  }, [product?.ProductId]);

  const maxQty = product?.Quantity ?? 1;

  const handleAddToCart = async () => {
    if (!product) return;

    if (!user) {
      toast.error("Please log in to add product to cart");
      setTimeout(() => navigate(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
        { replace: true },
      ), 5000);
      return;
    }

    setAdding(true);
    try {
      const result = await CartItemService.Create({
        ProductId: product.ProductId,
        Quantity: qty,
      });

      toastResult(result, toast);

      if (result.Success) {
        queryClient.invalidateQueries({
          queryKey: [`user${ModelType.CartItem.toLowerCase()}`],
        });
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.Title ?? "SERVER ERROR",
        error?.response?.data?.ErrorMessage ??
          "Cannot create cart item. Please try again.",
      );
    } finally {
      setAdding(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product?.Name,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!", "Product link copied to clipboard.");
    }
  };
  const avgRating = product?.Reviews?.length
    ? product.Reviews.reduce((s, r) => s + r.Rating, 0) / product.Reviews.length
    : 0;

  const savings =
    product?.OnOffer && product.OfferPrice
      ? product.Price - product.OfferPrice
      : 0;
  const savingsPct =
    product?.Price && savings ? Math.round((savings / product.Price) * 100) : 0;

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />

      <div className="pt-20">
        {isLoading ? (
          <ProductSkeleton />
        ) : isError || !product ? (
          <div className="container-custom py-20 text-center">
            <Package className="w-14 h-14 mx-auto mb-4 text-slate-200" />
            <h2 className="font-display text-2xl font-700 text-navy-900 mb-2">
              Product Not Found
            </h2>
            <p className="text-slate-400 mb-6">
              This product may no longer be available.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm"
              style={{ background: "linear-gradient(135deg,#1660eb,#0d1a42)" }}
            >
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
          </div>
        ) : (
          <>
            {/* Breadcrumb + back */}
            <div className="container-custom py-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-400 flex-wrap">
                  <Link
                    to="/"
                    className="hover:text-primary-600 transition-colors"
                  >
                    Home
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <Link
                    to="/explore?tab=products"
                    className="hover:text-primary-600 transition-colors"
                  >
                    Products
                  </Link>
                  {product.Category && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5" />
                      <button
                        onClick={() =>
                          navigate(
                            `/explore?tab=products&category=${product.CategoryId}`,
                          )
                        }
                        className="hover:text-primary-600 transition-colors"
                      >
                        {product.Category.Name}
                      </button>
                    </>
                  )}
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-slate-600 font-medium truncate max-w-[160px]">
                    {product.Name}
                  </span>
                </div>
                <button
                  onClick={() => navigate(-1)}
                  className="shrink-0 flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              </div>
            </div>

            {/* Main content */}
            <div className="container-custom pb-16">
              <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
                {/* ── Left: gallery ── */}
                <div>
                  <ImageGallery
                    images={product.Images ?? []}
                    name={product.Name}
                  />
                </div>

                {/* ── Right: details ── */}
                <div className="flex flex-col">
                  {/* Category + badges */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {product.Category && (
                      <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                        {product.Category.Name}
                      </span>
                    )}
                    {product.IsFeatured && (
                      <span className="flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{" "}
                        Featured
                      </span>
                    )}
                    {product.OnOffer && (
                      <span className="flex items-center gap-1 text-xs font-bold bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">
                        <Tag className="w-3 h-3" /> {savingsPct}% OFF
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <h1 className="font-display text-2xl sm:text-3xl font-700 text-navy-900 leading-tight mb-3">
                    {product.Name}
                  </h1>

                  {/* Rating */}
                  {(product.Reviews?.length ?? 0) > 0 && (
                    <div className="mb-4">
                      <StarDisplay
                        rating={avgRating}
                        count={(product.Reviews ?? []).length}
                      />
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-end gap-3 mb-2">
                    <span className="text-3xl font-900 text-navy-900">
                      {fmtKES(product.OfferPrice ?? product.Price)}
                    </span>
                    {product.OnOffer && product.OfferPrice && (
                      <span className="text-lg text-slate-400 line-through mb-0.5">
                        {fmtKES(product.Price)}
                      </span>
                    )}
                  </div>
                  {savings > 0 && (
                    <p className="text-sm font-semibold text-emerald-600 mb-4">
                      You save {fmtKES(savings)} ({savingsPct}%)
                    </p>
                  )}

                  {/* Stock */}
                  <div
                    className={`flex items-center gap-2 text-sm font-semibold mb-6 ${
                      product.Quantity > 5
                        ? "text-emerald-600"
                        : product.Quantity > 0
                          ? "text-amber-600"
                          : "text-red-500"
                    }`}
                  >
                    {product.Quantity > 0 ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    {product.Quantity > 5
                      ? "In Stock"
                      : product.Quantity > 0
                        ? `Only ${product.Quantity} left`
                        : "Out of Stock"}
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 leading-relaxed mb-8">
                    {product.Description}
                  </p>

                  {/* ── Quantity stepper ── */}
                  <div className="flex items-center gap-4 mb-5">
                    <span className="text-sm font-semibold text-slate-600">
                      Quantity
                    </span>
                    <div className="flex items-center gap-0 rounded-xl border border-slate-200 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        disabled={qty <= 1}
                        className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-primary-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center text-sm font-bold text-navy-900 select-none">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                        disabled={qty >= maxQty || !product.IsAvailable}
                        className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-primary-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {product.Quantity > 0 && product.Quantity <= 5 && (
                      <span className="text-xs text-amber-600 font-medium">
                        Only {product.Quantity} left
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 mt-auto">
                    <div className="flex gap-3">
                      {/* ── Add to Cart — real handler ── */}
                      <button
                        onClick={handleAddToCart}
                        disabled={!product.IsAvailable || addingToCart}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          background: "linear-gradient(135deg,#1660eb,#0d1a42)",
                        }}
                      >
                        {addingToCart ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Adding…
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" /> Add to Cart
                          </>
                        )}
                      </button>
                      <a
                        href={waUrl(product.Name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 ${!product.IsAvailable ? "opacity-40 pointer-events-none" : ""}`}
                        style={{
                          background: "linear-gradient(135deg,#25d366,#128c7e)",
                        }}
                      >
                        <MessageCircle className="w-4 h-4" /> Order via WhatsApp
                      </a>
                    </div>
                    <div className="flex gap-3">
                      <a
                        href="tel:+254746430693"
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:border-primary-300 hover:text-primary-600 transition-all duration-200"
                      >
                        <Phone className="w-4 h-4" /> Call to Order
                      </a>
                      <button
                        onClick={handleShare}
                        className="px-4 py-3 rounded-xl border border-slate-200 text-slate-500 hover:border-primary-300 hover:text-primary-600 transition-all duration-200"
                        title="Share this product"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Trust badges */}
                  <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-3 gap-3 text-center">
                    {[
                      { emoji: "🛡️", label: "Genuine Product" },
                      { emoji: "🚚", label: "Kenya-wide Delivery" },
                      { emoji: "🔧", label: "Installation Support" },
                    ].map(({ emoji, label }) => (
                      <div
                        key={label}
                        className="flex flex-col items-center gap-1"
                      >
                        <span className="text-xl">{emoji}</span>
                        <span className="text-xs text-slate-500 leading-tight">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Reviews section ── */}
              {(product.Reviews?.length ?? 0) > 0 && (
                <div className="mt-16">
                  <h2 className="font-display text-2xl font-700 text-navy-900 mb-6">
                    Customer Reviews
                    <span className="text-base font-normal text-slate-400 ml-2">
                      ({(product.Reviews ?? []).length})
                    </span>
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {product.Reviews?.slice(0, 6).map((review) => (
                      <div
                        key={review.ReviewId}
                        className="bg-white rounded-2xl p-5 shadow-card border border-slate-100"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-navy-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {review.User
                              ? `${review.User.FirstName[0]}${review.User.SecondName[0]}`
                              : "?"}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-slate-900">
                              {review.User
                                ? `${review.User.FirstName} ${review.User.SecondName}`
                                : "Customer"}
                            </p>
                            <StarDisplay rating={review.Rating} />
                          </div>
                        </div>
                        {review.Message && (
                          <p className="text-sm text-slate-500 italic leading-relaxed">
                            "{review.Message}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductPage;
