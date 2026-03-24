import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
  X,
  MessageCircleMore,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { ProductsService } from "../dummy/dummy";
import { ModelType } from "../enums/enums";
import { Service, Product } from "../interfaces/interfaces";
import Footer from "./home/Footer";
import { useScrollReveal } from "../hooks/Helper";
import { ServicesService } from "../services/service.service";
import { ProductService } from "../services/product.service";
import { toastResult, useToast } from "../components/Toast";
import { CartItemService } from "../services/cart.item.service";
import { CreateCartItemDto } from "../dtos/dto";
import { useSocketInvalidation } from "../hooks/socket.hook";

const formatKES = (v: number) => `KES ${v.toLocaleString("en-KE")}`;

const ServicesList: React.FC = () => {
  useSocketInvalidation(ModelType.Service);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: [ModelType.Service.toLowerCase()],
    queryFn: () => ServicesService.FetchAll(),
  });

  const services = (data?.DataList ?? []).filter(
    (s) =>
      s.Title.toLowerCase().includes(search.toLowerCase()) ||
      s.Description.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );

  return (
    <div>
      {/* Search */}
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 text-sm transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      {services.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          No services found matching "{search}".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceExploreCard key={service.ServiceId} service={service} />
          ))}
        </div>
      )}
    </div>
  );
};

const ServiceExploreCard: React.FC<{ service: Service }> = ({ service }) => (
  <div className="product-card group flex flex-col">
    {service.ImageUrl && (
      <div className="relative h-48 overflow-hidden">
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
      </div>
    )}
    <div className="p-6 flex flex-col flex-1">
      <h3 className="font-display font-700 text-lg text-navy-900 mb-2">
        {service.Title}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-5 flex-1">
        {service.Description}
      </p>
      <div className="flex gap-2 mt-auto">
        <Link
          to="/#contact"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
          style={{ background: "linear-gradient(135deg,#1660eb,#0d1a42)" }}
        >
          <Calendar className="w-4 h-4" /> Book Service
        </Link>
        <a
          href="tel:+254700000000"
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 border-slate-200 text-slate-600 hover:border-primary-400 hover:text-primary-600 transition-all duration-200"
        >
          <Phone className="w-4 h-4" />
        </a>
      </div>
    </div>
  </div>
);

const ProductsList: React.FC = () => {
  useSocketInvalidation(ModelType.Product);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">(
    "default",
  );

  const { data, isLoading } = useQuery({
    queryKey: [ModelType.Product.toLowerCase()],
    queryFn: () => ProductService.FetchAll(),
  });

  let products = (data?.DataList ?? []).filter(
    (p) =>
      p.Name.toLowerCase().includes(search.toLowerCase()) ||
      p.Description.toLowerCase().includes(search.toLowerCase()) ||
      p.Category?.Name.toLowerCase().includes(search.toLowerCase()),
  );

  if (sortBy === "price-asc") {
    products = [...products].sort(
      (a, b) => (a.OfferPrice ?? a.Price) - (b.OfferPrice ?? b.Price),
    );
  } else if (sortBy === "price-desc") {
    products = [...products].sort(
      (a, b) => (b.OfferPrice ?? b.Price) - (a.OfferPrice ?? a.Price),
    );
  }

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );

  return (
    <div>
      {/* Search + sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 text-sm transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-400 text-sm bg-white"
          >
            <option value="default">Default Sorting</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          No products found matching "{search}".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductExploreCard key={product.ProductId} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

const ProductExploreCard: React.FC<{ product: Product }> = ({ product }) => {
  const toast = useToast();

  const image = product.Images?.[0]?.ImageUrl;

  async function handleAddToCart(data: CreateCartItemDto): Promise<void> {
    try {
      let result = await CartItemService.Create(data);
      toastResult(result, toast);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.ErrorMessage ?? "Unable to add to cart");
    }
  }

  function handleWhatsappOrder(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="product-card group flex flex-col">
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={product.Name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
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
      </div>
      <div className="p-5 flex flex-col flex-1">
        {product.Category && (
          <span className="text-xs font-semibold text-primary-500 uppercase tracking-wide mb-1">
            {product.Category.Name}
          </span>
        )}
        <h3 className="font-display font-700 text-base text-navy-900 mb-2 leading-snug">
          {product.Name}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4 flex-1">
          {product.Description}
        </p>
        <div className="flex items-end gap-2 mb-4">
          <span className="text-xl font-900 text-navy-900">
            {formatKES(product.OfferPrice ?? product.Price)}
          </span>
          {product.OnOffer && product.OfferPrice && (
            <span className="text-sm text-slate-400 line-through mb-0.5">
              {formatKES(product.Price)}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => handleAddToCart({ProductId: product.ProductId, Quantity: 1})}
              disabled={!product.IsAvailable}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white transition-all duration-200 disabled:opacity-40"
            >
              <ShoppingCart className="w-4 h-4" /> Cart
            </button>
            <button
              disabled={!product.IsAvailable}
              onClick={() => handleWhatsappOrder()}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-40"
              style={{ background: "linear-gradient(135deg,#1660eb,#0d1a42)" }}
            >
              <MessageCircleMore className="w-4 h-4" /> WhatsApp Order
            </button>
          </div>
          <a
            href="tel:+254700000000"
            className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-primary-600 border border-slate-200 hover:border-primary-300 transition-all duration-200"
          >
            <Phone className="w-3.5 h-3.5" /> Call to Order
          </a>
        </div>
      </div>
    </div>
  );
};

const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab =
    (searchParams.get("tab") as "services" | "products") ?? "services";

  useScrollReveal();

  const setTab = (t: "services" | "products") => {
    setSearchParams({ tab: t });
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />

      {/* Page Header */}
      <div
        className="pt-28 pb-10"
        style={{
          background: "linear-gradient(135deg,#0d1a42 0%,#1660eb 100%)",
        }}
      >
        <div className="container-custom">
          <div className="flex items-center gap-2 text-white/50 text-sm mb-3">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Explore</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-700 text-white mb-3">
            {tab === "services" ? "All Services" : "All Products"}
          </h1>
          <p className="text-white/60 max-w-xl">
            {tab === "services"
              ? "Book professional installation and repair services for your home or business."
              : "Browse our range of quality electronic products with warranty support."}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="container-custom">
          <div className="flex">
            {(["services", "products"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
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

      {/* Content */}
      <div className="container-custom py-10">
        {tab === "services" ? <ServicesList /> : <ProductsList />}
      </div>

      <Footer />
    </div>
  );
};

export default ExplorePage;