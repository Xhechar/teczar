import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  ArrowRight,
  Sun,
  Camera,
  Zap,
  Wifi,
  Shield,
  Mic2,
  Wrench,
  Droplets,
  Tag,
  ChevronRight,
  Calendar,
  MapPin,
  X,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "../../components/Toast";
import { ModelType } from "../../enums/enums";
import { useScrollReveal } from "../../hooks/Helper";
import { useSocketInvalidation } from "../../hooks/socket.hook";
import { Service } from "../../interfaces/interfaces";
import { ServicesService } from "../../services/service.service";

// ─── Service request form DTO ─────────────────────────────────────
interface BookingForm {
  PreferredDate: string;
  LocationDescription: string;
}

// ─── Icon + colour maps ───────────────────────────────────────────
const SERVICE_ICONS: Record<string, React.ElementType> = {
  "Solar Panel Installation": Sun,
  "CCTV & IP Camera Installation": Camera,
  "Electrical Installation & Wiring": Zap,
  "Internet & WiFi Setup": Wifi,
  "Electric Fence Installation": Shield,
  "Intercom & Access Control Systems": Mic2,
  "Plumbing Services": Droplets,
  "Electronic Repairs": Wrench,
};

const SERVICE_COLORS = [
  "from-amber-500 to-orange-500",
  "from-primary-500 to-primary-700",
  "from-yellow-500 to-amber-600",
  "from-electric-400 to-primary-600",
  "from-navy-600 to-navy-900",
  "from-teal-500 to-electric-600",
  "from-blue-500 to-primary-700",
  "from-indigo-500 to-purple-600",
];

// ─── Skeleton card ────────────────────────────────────────────────
const ServiceSkeleton: React.FC = () => (
  <div className="product-card overflow-hidden flex flex-col">
    <div className="skeleton h-44 w-full" />
    <div className="p-5 flex flex-col flex-1 gap-3">
      <div className="skeleton h-5 w-3/4 rounded-lg" />
      <div className="skeleton h-3 w-full rounded-lg" />
      <div className="skeleton h-3 w-5/6 rounded-lg" />
      <div className="skeleton h-3 w-2/3 rounded-lg" />
      <div className="mt-auto skeleton h-9 w-full rounded-xl" />
    </div>
  </div>
);

// ─── Booking modal ────────────────────────────────────────────────
interface BookingModalProps {
  service: Service;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ service, onClose }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingForm>();

  const onSubmit = async (data: BookingForm) => {
    setLoading(true);
    try {
      // TODO: replace with api.post('/service-requests', { ServiceId: service.ServiceId, ...data })
      await new Promise((r) => setTimeout(r, 600));
      toast.success(
        "Booking Submitted!",
        `We'll contact you to confirm your ${service.Title} appointment.`,
      );
      onClose();
    } catch {
      toast.error("Booking Failed", "Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (hasErr = false) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
      hasErr
        ? "border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/30"
        : "border-slate-200 focus:border-primary-400 focus:ring-primary-100 bg-white"
    }`;

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
        {/* Header */}
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
                {...register("PreferredDate", {
                  required: "Please choose a preferred date",
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
                  required: "Please describe your location",
                  minLength: {
                    value: 10,
                    message: "Be a bit more specific (min 10 chars)",
                  },
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

          <p className="text-xs text-slate-400 leading-relaxed">
            Our team will contact you within{" "}
            <strong className="text-slate-600">2 hours</strong> to confirm the
            appointment. You can also reach us at{" "}
            <a
              href="tel:+254700000000"
              className="text-primary-600 font-semibold"
            >
              +254 700 000 000
            </a>
            .
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-60"
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
interface ServiceCardProps {
  service: Service;
  index: number;
  onBook: (s: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  index,
  onBook,
}) => {
  const Icon = SERVICE_ICONS[service.Title] ?? Zap;
  const colorClass = SERVICE_COLORS[index % SERVICE_COLORS.length];

  return (
    <div
      className="reveal product-card group flex flex-col"
      style={{ transitionDelay: `${(index % 4) * 0.08}s` }}
    >
      {/* Image */}
      {service.ImageUrl && (
        <div className="relative h-44 overflow-hidden shrink-0">
          <img
            src={service.ImageUrl}
            alt={service.Title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 to-transparent" />
          <div
            className={`absolute top-4 left-4 w-10 h-10 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          {service.OnOffer && (
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-amber-400 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              <Tag className="w-3 h-3" /> On Offer
            </div>
          )}
        </div>
      )}

      {/* Content — flex-1 so cards stretch to equal height */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-700 text-base text-navy-900 mb-2 leading-snug">
          {service.Title}
        </h3>
        {/* flex-1 pushes the button to the bottom regardless of description length */}
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1 mb-4">
          {service.Description}
        </p>

        {/* mt-auto pins button to bottom */}
        <button
          onClick={() => onBook(service)}
          className="mt-auto flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200 group/link"
        >
          Book This Service
          <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

// ─── Section ──────────────────────────────────────────────────────
const ServicesSection: React.FC = () => {
  const [bookingService, setBookingService] = useState<Service | null>(null);

  useSocketInvalidation(ModelType.Service);

  const { data, isLoading, isError } = useQuery({
    queryKey: [ModelType.Service.toLowerCase()],
    queryFn: () => ServicesService.FetchAll(),
  });

  const services = data?.DataList ?? [];

  // Re-run reveal whenever data arrives so newly rendered cards are observed
  useScrollReveal([services.length]);

  return (
    <section id="services" className="section-padding bg-surface-50">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="reveal">
            <div className="badge badge-primary mb-3">
              <Zap className="w-3 h-3" /> Our Services
            </div>
            <h2 className="section-title">
              Everything Your Property Needs,{" "}
              <span className="text-gradient">Done Right</span>
            </h2>
            <p className="section-subtitle mt-3">
              Comprehensive technology and installation services for homes and
              businesses. Certified technicians, quality materials, guaranteed
              workmanship.
            </p>
          </div>
          <div className="reveal stagger-2 shrink-0">
            <Link
              to="/explore?tab=services"
              className="btn-primary whitespace-nowrap"
            >
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ServiceSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16 text-slate-400">
            <p>Unable to load services. Please try again later.</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p>No services available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <ServiceCard
                key={service.ServiceId}
                service={service}
                index={i}
                onBook={setBookingService}
              />
            ))}
          </div>
        )}

        {/* Why us strip */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: "Certified Professionals",
              desc: "All technicians are trained, certified, and insured.",
              color: "text-primary-600 bg-primary-50",
            },
            {
              icon: Zap,
              title: "Fast Response Times",
              desc: "We respond within 2 hours for emergency calls.",
              color: "text-amber-600 bg-amber-50",
            },
            {
              icon: Sun,
              title: "Quality Guaranteed",
              desc: "All installations come with a service warranty.",
              color: "text-electric-600 bg-sky-50",
            },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="reveal flex items-start gap-4 bg-white rounded-2xl p-6 shadow-card"
            >
              <div
                className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-700 text-navy-900 mb-1">
                  {title}
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking modal */}
      {bookingService && (
        <BookingModal
          service={bookingService}
          onClose={() => setBookingService(null)}
        />
      )}
    </section>
  );
};

export default ServicesSection;