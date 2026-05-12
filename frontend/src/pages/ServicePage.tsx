import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  ArrowLeft, ChevronRight, Calendar, MapPin,
  Phone, CheckCircle, Tag, Star, Wrench,
  Loader2, X, Share2, Clock, ShieldCheck,
  Sun, Camera, Zap, Wifi, Shield, Mic2, Droplets,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useToast, toastResult } from "../components/Toast";
import { ServicesService } from "../services/service.service";
import { ModelType } from "../enums/enums";
import { useScrollReveal } from "../hooks/Helper";
import { Service } from "../interfaces/interfaces";
import { ServiceResult } from "../interfaces/result/service.result";
import { api } from "../middleware/middleware";
import Footer from "./home/Footer";
import { ServiceRequestService } from "../services/service.request.service";

// ─── Booking DTO ──────────────────────────────────────────────────
interface BookingForm {
  PreferredDate: string;
  LocationDescription: string;
}

// ─── Icon + colour maps (mirrors ServicesSection) ─────────────────
const SERVICE_ICONS: Record<string, React.ElementType> = {
  "Solar Panel Installation":         Sun,
  "CCTV & IP Camera Installation":    Camera,
  "Electrical Installation & Wiring": Zap,
  "Internet & WiFi Setup":            Wifi,
  "Electric Fence Installation":      Shield,
  "Intercom & Access Control Systems":Mic2,
  "Plumbing Services":                Droplets,
  "Electronic Repairs":               Wrench,
};

const SERVICE_COLORS: Record<string, string> = {
  "Solar Panel Installation":         "from-amber-500 to-orange-500",
  "CCTV & IP Camera Installation":    "from-primary-500 to-primary-700",
  "Electrical Installation & Wiring": "from-yellow-500 to-amber-600",
  "Internet & WiFi Setup":            "from-electric-400 to-primary-600",
  "Electric Fence Installation":      "from-navy-600 to-navy-900",
  "Intercom & Access Control Systems":"from-teal-500 to-electric-600",
  "Plumbing Services":                "from-blue-500 to-primary-700",
  "Electronic Repairs":               "from-indigo-500 to-purple-600",
};

// ─── Service-specific feature bullets ────────────────────────────
const SERVICE_FEATURES: Record<string, string[]> = {
  "Solar Panel Installation": [
    "Free site assessment and system sizing",
    "5KVA to 20KVA hybrid systems",
    "Lithium & gel battery options",
    "Grid-tie and off-grid configurations",
    "Remote monitoring app included",
    "5-year workmanship warranty",
  ],
  "CCTV & IP Camera Installation": [
    "4K and HD IP camera systems",
    "Night vision & motion detection",
    "Remote viewing on phone / PC",
    "4 to 32-channel NVR systems",
    "Alarm and intercom integration",
    "Annual maintenance contracts",
  ],
  "Electrical Installation & Wiring": [
    "Full house and commercial wiring",
    "DB board supply and installation",
    "Socket, lighting, and fan points",
    "Shower head connections",
    "ERC licensed electricians",
    "KPLC inspection compliance",
  ],
  "Internet & WiFi Setup": [
    "WiFi 6 mesh network design",
    "Fibre and wireless installation",
    "Office and hospitality networks",
    "Signal dead-zone elimination",
    "Router and switch configuration",
    "Ongoing support and monitoring",
  ],
  "Electric Fence Installation": [
    "Residential and commercial fencing",
    "Heavy-duty energizers (5J–100J)",
    "Alarm system integration",
    "CCTV add-on available",
    "Farm and estate perimeter",
    "Annual energizer servicing",
  ],
  "Plumbing Services": [
    "Solar water heater installation (300L+)",
    "Electric and gas water heaters",
    "Pipe repairs and replacements",
    "Bathroom and kitchen fittings",
    "Drainage and sewerage works",
    "Emergency plumbing 24/7",
  ],
};

// ─── Shared input class ───────────────────────────────────────────
const inputCls = (hasErr = false) =>
  `w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
    hasErr
      ? "border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/30"
      : "border-slate-200 focus:border-primary-400 focus:ring-primary-100 bg-white"
  }`;

// ─── Booking modal ────────────────────────────────────────────────
const BookingModal: React.FC<{ service: Service; onClose: () => void }> = ({
  service, onClose,
}) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<BookingForm>();

  const onSubmit = async (data: BookingForm) => {
    setLoading(true);
    try {
      const result = await ServiceRequestService.Create({
        ServiceId:           service.ServiceId,
        PreferredDate:       new Date(data.PreferredDate),
        LocationDescription: data.LocationDescription,
      });
      toastResult(result, toast);
      if (result.Success) onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.Title        ?? "Booking Failed",
        err?.response?.data?.ErrorMessage ?? "Could not submit booking. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ animation: "fadeUp .25s ease-out" }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 flex items-start justify-between gap-4"
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
            className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-all shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Preferred Date <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                {...register("PreferredDate", { required: "Please choose a preferred date" })}
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className={`${inputCls(!!errors.PreferredDate)} pl-10`}
              />
            </div>
            {errors.PreferredDate && (
              <p className="text-red-500 text-xs mt-1">{errors.PreferredDate.message}</p>
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
                  required: "Please describe your location",
                  minLength: { value: 10, message: "Please be more specific (min 10 chars)" },
                })}
                rows={3}
                placeholder="e.g. Westlands, Nairobi — near ABC Mall, Gate 2"
                className={`${inputCls(!!errors.LocationDescription)} pl-10 resize-none`}
              />
            </div>
            {errors.LocationDescription && (
              <p className="text-red-500 text-xs mt-1">{errors.LocationDescription.message}</p>
            )}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Our team will call you within{" "}
            <strong className="text-slate-600">2 hours</strong> to confirm.
            You can also reach us at{" "}
            <a href="tel:+254700000000" className="text-primary-600 font-semibold">
              +254 700 000 000
            </a>.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#1660eb,#0d1a42)" }}
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
              : <><Calendar className="w-4 h-4" /> Confirm Booking</>}
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────
const ServiceSkeleton: React.FC = () => (
  <div className="container-custom py-10">
    <div className="skeleton h-5 w-48 rounded-lg mb-8" />
    <div className="grid md:grid-cols-2 gap-10">
      <div className="skeleton aspect-video rounded-2xl" />
      <div className="space-y-4">
        <div className="skeleton h-4 w-20 rounded" />
        <div className="skeleton h-8 w-3/4 rounded-xl" />
        <div className="skeleton h-3 w-full rounded mt-4" />
        <div className="skeleton h-3 w-5/6 rounded" />
        <div className="skeleton h-3 w-4/6 rounded" />
        <div className="skeleton h-12 w-full rounded-xl mt-8" />
        <div className="skeleton h-12 w-full rounded-xl" />
      </div>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────
const ServicePage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate      = useNavigate();
  const toast         = useToast();
  const [showBooking, setShowBooking] = useState(false);

  useScrollReveal([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: [ModelType.Service.toLowerCase(), serviceId],
    queryFn: async () => {
      const data = await ServicesService.FetchById(serviceId!);
      return { Success: true, Data: data.Data, Title: data.Title };
    },
    enabled: !!serviceId,
  });

  const service = data?.Data;

  const Icon       = service ? (SERVICE_ICONS[service.Title]  ?? Wrench)  : Wrench;
  const colorClass = service ? (SERVICE_COLORS[service.Title] ?? "from-primary-500 to-navy-700") : "";
  const features   = service ? (SERVICE_FEATURES[service.Title] ?? []) : [];

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: service?.Title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!", "Service link copied to clipboard.");
    }
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />

      <div className="pt-20">
        {isLoading ? (
          <ServiceSkeleton />
        ) : isError || !service ? (
          <div className="container-custom py-20 text-center">
            <Wrench className="w-14 h-14 mx-auto mb-4 text-slate-200" />
            <h2 className="font-display text-2xl font-700 text-navy-900 mb-2">
              Service Not Found
            </h2>
            <p className="text-slate-400 mb-6">
              This service may no longer be available.
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
            {/* ── Breadcrumb + back ── */}
            <div className="container-custom py-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-sm text-slate-400 flex-wrap">
                  <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <Link
                    to="/explore?tab=services"
                    className="hover:text-primary-600 transition-colors"
                  >
                    Services
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-slate-600 font-medium truncate max-w-[180px]">
                    {service.Title}
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

            {/* ── Main content ── */}
            <div className="container-custom pb-16">
              <div className="grid md:grid-cols-2 gap-10 lg:gap-14">

                {/* ── Left: image / icon ── */}
                <div className="reveal">
                  {service.ImageUrl ? (
                    <div className="relative rounded-2xl overflow-hidden aspect-video shadow-sm border border-slate-200">
                      <img
                        src={service.ImageUrl}
                        alt={service.Title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 to-transparent" />
                    </div>
                  ) : (
                    /* Fallback: gradient card with icon */
                    <div
                      className={`relative rounded-2xl aspect-video flex items-center justify-center bg-gradient-to-br ${colorClass} shadow-sm overflow-hidden`}
                    >
                      {/* Decorative circles */}
                      <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
                      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />
                      <Icon className="w-24 h-24 text-white/80 relative z-10" />
                    </div>
                  )}

                  {/* Why us cards */}
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {[
                      { icon: ShieldCheck, label: "Certified",  sub: "Licensed team" },
                      { icon: Clock,       label: "Fast",       sub: "2hr response" },
                      { icon: Star,        label: "Guaranteed", sub: "Warranty incl." },
                    ].map(({ icon: I, label, sub }) => (
                      <div key={label} className="bg-white rounded-xl p-3 text-center shadow-card border border-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center mx-auto mb-2">
                          <I className="w-4 h-4 text-primary-600" />
                        </div>
                        <p className="text-xs font-700 text-navy-900">{label}</p>
                        <p className="text-[11px] text-slate-400">{sub}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Right: details ── */}
                <div className="reveal stagger-2 flex flex-col">

                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className="flex items-center gap-1 text-xs font-semibold text-primary-600 uppercase tracking-wide">
                      <Wrench className="w-3.5 h-3.5" /> Service
                    </span>
                    {service.IsFeatured && (
                      <span className="flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Popular
                      </span>
                    )}
                    {service.OnOffer && (
                      <span className="flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <Tag className="w-3 h-3" /> Special Offer
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="font-display text-2xl sm:text-3xl font-700 text-navy-900 leading-tight mb-4">
                    {service.Title}
                  </h1>

                  {/* Description */}
                  <p className="text-slate-600 leading-relaxed mb-6">{service.Description}</p>

                  {/* Feature bullets */}
                  {features.length > 0 && (
                    <div className="mb-8">
                      <p className="text-xs font-700 text-slate-500 uppercase tracking-widest mb-3">
                        What's included
                      </p>
                      <ul className="space-y-2.5">
                        {features.map((f) => (
                          <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                            <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA buttons */}
                  <div className="space-y-3 mt-auto">
                    <button
                      onClick={() => setShowBooking(true)}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-200"
                      style={{ background: "linear-gradient(135deg,#1660eb,#0d1a42)" }}
                    >
                      <Calendar className="w-4 h-4" /> Book This Service
                    </button>
                    <div className="flex gap-3">
                      <a
                        href="tel:+254700000000"
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:border-primary-300 hover:text-primary-600 transition-all duration-200"
                      >
                        <Phone className="w-4 h-4" /> Call Us
                      </a>
                      <a
                        href={`https://wa.me/254700000000?text=${encodeURIComponent(`Hi! I'd like to enquire about: *${service.Title}*`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                        style={{ background: "linear-gradient(135deg,#25d366,#128c7e)" }}
                      >
                        <Phone className="w-4 h-4" /> WhatsApp
                      </a>
                      <button
                        onClick={handleShare}
                        className="px-4 py-3 rounded-xl border border-slate-200 text-slate-500 hover:border-primary-300 hover:text-primary-600 transition-all duration-200"
                        title="Share this service"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Free quote nudge */}
                  <div className="mt-5 flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                    <Star className="w-4 h-4 text-amber-500 mt-0.5 shrink-0 fill-amber-400" />
                    <p className="text-xs text-amber-800 leading-relaxed">
                      <strong>Free site assessment</strong> — our technician will visit your property, assess your needs, and provide a no-obligation quote before any work begins.
                    </p>
                  </div>
                </div>
              </div>

              {/* ── How it works ── */}
              <div className="mt-16 reveal">
                <h2 className="font-display text-2xl font-700 text-navy-900 mb-8 text-center">
                  How It Works
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { step: "01", title: "Book Online",      desc: "Submit your booking request with your preferred date and location." },
                    { step: "02", title: "We Confirm",       desc: "Our team calls you within 2 hours to confirm and discuss your requirements." },
                    { step: "03", title: "Site Visit",       desc: "A certified technician visits, assesses the job, and gives a final quote." },
                    { step: "04", title: "Job Complete",     desc: "We complete the installation or repair to the highest standards." },
                  ].map(({ step, title, desc }) => (
                    <div key={step} className="relative text-center">
                      {/* Connector line (hidden on last) */}
                      <div className="absolute top-5 left-1/2 w-full h-px bg-slate-200 hidden lg:block -z-0" />
                      <div className="relative z-10 w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-navy-700 flex items-center justify-center text-white text-xs font-bold mx-auto mb-3 shadow-sm">
                        {step}
                      </div>
                      <h4 className="font-display font-700 text-navy-900 text-sm mb-1.5">{title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── CTA banner ── */}
              <div
                className="mt-14 reveal relative overflow-hidden rounded-3xl p-10 text-center"
                style={{ background: "linear-gradient(135deg,#0d1a42 0%,#1660eb 100%)" }}
              >
                <div className="absolute inset-0 mesh-pattern opacity-20" />
                <div className="relative z-10">
                  <h3 className="font-display text-2xl md:text-3xl font-700 text-white mb-3">
                    Ready to Get Started?
                  </h3>
                  <p className="text-white/70 mb-7 max-w-lg mx-auto text-sm">
                    Book your {service.Title} today. Free site assessment, no-obligation quote.
                  </p>
                  <button
                    onClick={() => setShowBooking(true)}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-navy-900 bg-amber-400 hover:bg-amber-300 transition-colors duration-200 text-sm"
                  >
                    <Calendar className="w-4 h-4" /> Book Now — It's Free
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />

      {/* Booking modal */}
      {showBooking && service && (
        <BookingModal service={service as Service} onClose={() => setShowBooking(false)} />
      )}
    </div>
  );
};

export default ServicePage;