import React from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  ArrowRight,
  Music2,
} from "lucide-react";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  const services = [
    "Solar Installation",
    "CCTV Systems",
    "Electrical Works",
    "Electric Fencing",
    "Intercom Systems",
    "Plumbing Services",
    "Electronic Repairs",
  ];

  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "Services", to: "/explore?tab=services" },
    { label: "Products", to: "/explore?tab=products" },
    { label: "Projects", to: "/#projects" },
    { label: "Careers", to: "/careers" },
    { label: "Contact Us", to: "/#contact" },
  ];

  return (
    <footer
      style={{ background: "#080f28" }}
      className="relative overflow-hidden"
    >
      {/* Top wave */}
      <svg
        viewBox="0 0 1440 60"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full block"
        style={{ marginTop: "-2px" }}
      >
        <path
          d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,0 L0,0 Z"
          fill="#f8fafc"
        />
      </svg>

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10">
        {/* Newsletter bar */}
        <div className="border-b border-white/10">
          <div className="container-custom py-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="font-display text-xl font-700 text-white mb-1">
                  Stay in the Loop
                </h4>
                <p className="text-white/50 text-sm">
                  Get updates on new products, offers, and tech tips.
                </p>
              </div>
              <div className="flex w-full max-w-md gap-2">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-primary-400 focus:bg-white/15 transition-all duration-200"
                />
                <button className="btn-primary px-5 py-3 rounded-xl shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main footer */}
        <div className="container-custom py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-1">
              {/* Clickable logo — navigates to "/" */}
              <Link
                to="/"
                aria-label="Go to homepage"
                className="inline-block mb-5"
              >
                <img
                  src="/favicon.png"
                  alt="Raz Tech"
                  className="h-20 w-auto object-contain drop-shadow-lg transition-transform duration-300 hover:scale-105"
                />
              </Link>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                Kenya's trusted partner for solar, electrical, CCTV and plumbing
                solutions. Serving homes and businesses with integrity since
                2018.
              </p>

              {/* Social */}
              <div className="flex gap-3">
                {[
                  {
                    icon: Facebook,
                    href: "https://www.facebook.com/raztechnologies",
                  },
                  {
                    icon: Music2,
                    href: "https://www.tiktok.com/@raztechnologies",
                  },
                  {
                    icon: Instagram,
                    href: "https://www.instagram.com/engineer_russel?igsh=MWV2cmdpaWFnanU5ZA==",
                  },
                  {
                    icon: Youtube,
                    href: "https://www.youtube.com/@raztechnologies",
                  },
                ].map(({ icon: Icon, href }) => (
                  <a
                    key={href}
                    href={href}
                    className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h5 className="font-semibold text-white mb-5 text-sm uppercase tracking-widest">
                Our Services
              </h5>
              <ul className="space-y-2.5">
                {services.map((s) => (
                  <li key={s}>
                    <Link
                      to="/explore?tab=services"
                      className="text-sm text-white/50 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                      {s}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick links */}
            <div>
              <h5 className="font-semibold text-white mb-5 text-sm uppercase tracking-widest">
                Quick Links
              </h5>
              <ul className="space-y-2.5">
                {quickLinks.map(({ label, to }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-sm text-white/50 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h5 className="font-semibold text-white mb-5 text-sm uppercase tracking-widest">
                Contact Info
              </h5>
              <ul className="space-y-4">
                {[
                  {
                    icon: Phone,
                    text: "+254 746 430 693",
                    href: "tel:+254746430693",
                  },
                  {
                    icon: Phone,
                    text: "+254 797 133 976",
                    href: "tel:+254797133976",
                  },
                  {
                    icon: Phone,
                    text: "+254 790 441 659",
                    href: "tel:+254790441659",
                  },
                  {
                    icon: Mail,
                    text: "raztechnologies9@gmail.com",
                    href: "mailto:raztechnologies9@gmail.com",
                  },
                  { icon: MapPin, text: "Eldoret, Kenya", href: "#" },
                ].map(({ icon: Icon, text, href }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className="flex items-start gap-3 text-sm text-white/50 hover:text-white transition-colors duration-200"
                    >
                      <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-primary-400" />
                      </div>
                      {text}
                    </a>
                  </li>
                ))}
              </ul>

              {/* 24/7 badge */}
              <div className="mt-6 inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-semibold text-green-400">
                  24/7 Emergency Support
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">
              © {year} Raz Technologies. All rights reserved.
            </p>
            <p className="flex items-center gap-1.5 text-white/30 text-xs">
              Built by{" "}
              <Link
                to="https://xhechar.vercel.app"
                className="text-white/30 hover:text-white/60 text-xs transition-colors duration-200"
              >
                xhechar
              </Link>{" "}
              in Kenya
            </p>
            <div className="flex gap-5">
              <Link
                to="/privacy"
                className="text-white/30 hover:text-white/60 text-xs transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-white/30 hover:text-white/60 text-xs transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;