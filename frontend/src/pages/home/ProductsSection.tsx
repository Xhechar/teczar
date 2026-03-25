import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ShoppingCart,
  Tag,
  ArrowRight,
  Phone,
  Package,
  Star,
  MessageCircle,
} from "lucide-react";
import { ModelType } from "../../enums/enums";
import { useScrollReveal } from "../../hooks/Helper";
import { Product } from "../../interfaces/interfaces";
import { ProductService } from "../../services/product.service";
import { useSocketInvalidation } from "../../hooks/socket.hook";
import { queryClient } from "../..";
import { toastResult, useToast } from "../../components/Toast";
import { CreateCartItemDto } from "../../dtos/dto";
import { CartItemService } from "../../services/cart.item.service";
import { useAuth } from "../../context/AuthContext";

const formatKES = (n: number) => `KES ${n.toLocaleString("en-KE")}`;

const WHATSAPP_NUMBER = "254700000000"; // admin WhatsApp — update with real number

function whatsappUrl(productName: string) {
  const msg = encodeURIComponent(
    `Hi Raz Technologies! I'd like to order: *${productName}*. Please share availability and delivery details.`,
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

// ─── Skeleton card ────────────────────────────────────────────────
const ProductSkeleton: React.FC = () => (
  <div className="product-card flex flex-col overflow-hidden">
    <div className="skeleton h-52 w-full" />
    <div className="p-5 flex flex-col flex-1 gap-3">
      <div className="skeleton h-3 w-1/3 rounded-lg" />
      <div className="skeleton h-5 w-full rounded-lg" />
      <div className="skeleton h-3 w-5/6 rounded-lg" />
      <div className="skeleton h-3 w-4/6 rounded-lg" />
      <div className="skeleton h-7 w-1/3 rounded-lg mt-1" />
      <div className="flex gap-2 mt-auto">
        <div className="skeleton h-10 flex-1 rounded-xl" />
        <div className="skeleton h-10 flex-1 rounded-xl" />
      </div>
    </div>
  </div>
);

// ─── Product card ─────────────────────────────────────────────────
const ProductCard: React.FC<{ product: Product; index: number }> = ({
  product,
  index,
}) => {
  const toast = useToast();
  const {user} = useAuth();
  const navigate = useNavigate();

  const mainImage =
    product.Images?.[0]?.ImageUrl ??
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80";

    const handleAddToCart = async (dto: CreateCartItemDto) => {
      try {
        if(!user) {
          navigate('/login', {replace: true});
          return;
        }
        
        let result = await CartItemService.Create(dto);
        toastResult(result, toast);
        if (result.Success)
          queryClient.invalidateQueries({
            queryKey: [`user${ModelType.Order.toLowerCase()}`],
          });
      } catch (error: any) {
        toast.error(
          error.response.data.Title ?? "SERVER ERROR",
          error.response.data.ErrorMessage ??
            "Cannot create cart item. Please try again.",
        );
      }
    };

  return (
    <div
      className="reveal product-card group flex flex-col"
      style={{ transitionDelay: `${(index % 4) * 0.08}s` }}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden shrink-0">
        <img
          src={mainImage}
          alt={product.Name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.OnOffer && product.OfferPrice && (
            <span className="flex items-center gap-1 bg-amber-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              <Tag className="w-3 h-3" />
              {Math.round(
                ((product.Price - product.OfferPrice) / product.Price) * 100,
              )}
              % OFF
            </span>
          )}
          {product.IsFeatured && (
            <span className="flex items-center gap-1 bg-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              <Star className="w-3 h-3" /> Featured
            </span>
          )}
        </div>

        {!product.IsAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {product.Category && (
          <span className="text-xs font-semibold text-primary-500 uppercase tracking-wide mb-1">
            {product.Category.Name}
          </span>
        )}
        <h3 className="font-display font-700 text-base text-navy-900 mb-2 leading-snug line-clamp-2">
          {product.Name}
        </h3>
        {/* flex-1 pushes price + buttons to bottom */}
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 flex-1 mb-4">
          {product.Description}
        </p>

        {/* Price */}
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

        {/* Stock */}
        <div className="flex items-center gap-1.5 mb-4">
          <span
            className={`w-2 h-2 rounded-full ${product.Quantity > 5 ? "bg-green-400" : product.Quantity > 0 ? "bg-amber-400" : "bg-red-400"}`}
          />
          <span className="text-xs text-slate-500">
            {product.Quantity > 5
              ? "In Stock"
              : product.Quantity > 0
                ? `Only ${product.Quantity} left`
                : "Out of Stock"}
          </span>
        </div>

        {/* Actions — mt-auto pins to bottom */}
        <div className="flex flex-col gap-2 mt-auto">
          <div className="flex gap-2">
            <button
              disabled={!product.IsAvailable}
              onClick={() => {
                handleAddToCart({ProductId: product.ProductId, Quantity: 1})
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
            {/* WhatsApp order */}
            <a
              href={whatsappUrl(product.Name)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Order via WhatsApp"
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 ${!product.IsAvailable ? "opacity-40 pointer-events-none" : ""}`}
              style={{ background: "linear-gradient(135deg,#25d366,#128c7e)" }}
            >
              <MessageCircle className="w-4 h-4" /> Order Now
            </a>
          </div>
          <a
            href="tel:+254746430693"
            className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-primary-600 hover:bg-slate-50 transition-all duration-200 border border-slate-200"
          >
            <Phone className="w-3.5 h-3.5" /> Call to Order
          </a>
        </div>
      </div>
    </div>
  );
};

const ProductsSection: React.FC = () => {
  useSocketInvalidation(ModelType.Product);

  const { data, isLoading, isError } = useQuery({
    queryKey: [ModelType.Product.toLowerCase()],
    queryFn: () => ProductService.FetchAll(),
  });

  const products = data?.DataList ?? [];

  useScrollReveal([products.length]);

  return (
    <section id="products" className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="reveal">
            <div className="badge badge-amber mb-3">
              <Package className="w-3 h-3" /> Featured Products
            </div>
            <h2 className="section-title">
              Premium Electronics &amp;{" "}
              <span className="text-gradient">Equipment</span>
            </h2>
            <p className="section-subtitle mt-3">
              Quality products sourced from top manufacturers. All items come
              with warranty and professional installation support.
            </p>
          </div>
          <div className="reveal stagger-2 shrink-0">
            <Link
              to="/explore?tab=products"
              className="btn-amber whitespace-nowrap"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16 text-slate-400">
            <p>Unable to load products. Please try again later.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p>No featured products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <ProductCard
                key={product.ProductId}
                product={product}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;