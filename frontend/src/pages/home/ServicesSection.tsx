import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
  Loader2,
} from "lucide-react";
import { ModelType } from "../../enums/enums";
import { useSocketInvalidation } from "../../hooks/socket.hook";
import { Service } from "../../interfaces/interfaces";
import { ServicesService } from "../../services/service.service";

// Map service titles to icons
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

const SERVICE_COLORS: string[] = [
  "from-amber-500 to-orange-500",
  "from-primary-500 to-primary-700",
  "from-yellow-500 to-amber-600",
  "from-electric-400 to-primary-600",
  "from-navy-600 to-navy-900",
  "from-teal-500 to-electric-600",
  "from-blue-500 to-primary-700",
  "from-indigo-500 to-purple-600",
];

interface ServiceCardProps {
  service: Service;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  const Icon = SERVICE_ICONS[service.Title] ?? Zap;
  const colorClass = SERVICE_COLORS[index % SERVICE_COLORS.length];
  const delay = `${(index % 4) * 0.1}s`;

  return (
    <div
      className="reveal product-card group"
      style={{ transitionDelay: delay }}
    >
      {/* Image */}
      {service.ImageUrl && (
        <div className="relative h-44 overflow-hidden">
          <img
            src={service.ImageUrl}
            alt={service.Title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 to-transparent" />

          {/* Icon badge */}
          <div
            className={`absolute top-4 left-4 w-10 h-10 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>

          {/* Offer badge */}
          {service.OnOffer && (
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-amber-400 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              <Tag className="w-3 h-3" />
              On Offer
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-700 text-lg text-navy-900 mb-2 leading-tight">
          {service.Title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-4">
          {service.Description}
        </p>

        <Link
          to={`/explore?tab=services&id=${service.ServiceId}`}
          className="flex items-center gap-2 text-sm font-semibold text-primary-600 group-hover:text-primary-700 transition-colors duration-200"
        >
          Book This Service
          <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

const ServicesSection: React.FC = () => {
  useSocketInvalidation(ModelType.Service);

  const { data, isLoading, isError } = useQuery({
    queryKey: [ModelType.Service.toLowerCase()],
    queryFn: () => ServicesService.FetchAll(),
  });

  const services = data?.DataList ?? [];

  return (
    <section className="section-padding bg-surface-50">
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
              View All Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : isError ? (
          <div className="text-center py-16 text-slate-400">
            <p>Unable to load services. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <ServiceCard
                key={service.ServiceId}
                service={service}
                index={i}
              />
            ))}
          </div>
        )}

        {/* Why choose us strip */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: "Certified Professionals",
              desc: "All our technicians are trained, certified, and insured for your peace of mind.",
              color: "text-primary-600 bg-primary-50",
            },
            {
              icon: Zap,
              title: "Fast Response Times",
              desc: "We understand urgency. Our team responds within 2 hours for emergency calls.",
              color: "text-amber-600 bg-amber-50",
            },
            {
              icon: Sun,
              title: "Quality Guaranteed",
              desc: "All installations come with a service warranty. We stand behind our work 100%.",
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
    </section>
  );
};

export default ServicesSection;