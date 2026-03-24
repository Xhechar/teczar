import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  User,
  ShoppingCart,
  Package,
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
  Zap,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import Footer from "../pages/home/Footer";

const NAV_ITEMS = [
  { icon: User, label: "My Profile", to: "/profile" },
  { icon: ShoppingCart, label: "My Cart", to: "/cart" },
  { icon: Package, label: "My Orders", to: "/orders" },
  { icon: Calendar, label: "My Bookings", to: "/bookings" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

interface Props {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const CustomerLayout: React.FC<Props> = ({ children, title, subtitle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />

      {/* Page header */}
      <div
        className="pt-20 pb-8"
        style={{
          background: "linear-gradient(135deg,#0d1a42 0%,#1660eb 100%)",
        }}
      >
        <div className="container-custom">
          <div className="flex items-center gap-2 text-white/50 text-sm mb-3">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">{title}</span>
          </div>
          <h1 className="font-display text-3xl font-700 text-white">{title}</h1>
          {subtitle && <p className="text-white/60 text-sm mt-1">{subtitle}</p>}
        </div>
      </div>

      {/* Body */}
      <div className="container-custom py-10">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Sidebar */}
          <aside>
            <div className="bg-white rounded-2xl shadow-card overflow-hidden sticky top-24">
              {/* User card */}
              <div className="p-5 bg-gradient-to-br from-primary-600 to-navy-800">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white text-xl font-bold mb-3">
                  JK
                </div>
                <p className="font-700 text-white">James Kamau</p>
                <p className="text-white/60 text-xs">Customer</p>
              </div>

              {/* Nav links */}
              <nav className="p-3">
                {NAV_ITEMS.map(({ icon: Icon, label, to }) => {
                  const active = location.pathname === to;
                  return (
                    <Link
                      key={to}
                      to={to}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        active
                          ? "bg-primary-50 text-primary-600"
                          : "text-slate-600 hover:bg-slate-50 hover:text-primary-600"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${active ? "text-primary-600" : "text-slate-400"}`}
                      />
                      {label}
                      {active && (
                        <ChevronRight className="w-3.5 h-3.5 ml-auto text-primary-400" />
                      )}
                    </Link>
                  );
                })}
                <div className="border-t border-slate-100 mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </nav>

              {/* 24/7 badge */}
              <div className="mx-3 mb-3 p-3 bg-navy-950 rounded-xl flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <p className="text-xs text-white/60">
                  Need help?{" "}
                  <a
                    href="tel:+254700000000"
                    className="text-white font-semibold"
                  >
                    Call us 24/7
                  </a>
                </p>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main>{children}</main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CustomerLayout;