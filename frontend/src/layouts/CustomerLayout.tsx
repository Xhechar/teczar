import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  User, ShoppingCart, Package, Calendar,
  Settings, LogOut, ChevronRight, Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../pages/home/Footer";

const NAV_ITEMS = [
  { icon: User,         label: "My Profile",  to: "/profile"  },
  { icon: ShoppingCart, label: "My Cart",     to: "/cart"     },
  { icon: Package,      label: "My Orders",   to: "/orders"   },
  { icon: Calendar,     label: "My Bookings", to: "/bookings" },
  { icon: Settings,     label: "Settings",    to: "/settings" },
];

interface Props {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const CustomerLayout: React.FC<Props> = ({ children, title, subtitle }) => {
  const location   = useLocation();
  const navigate   = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const initials = user
    ? `${user.FirstName[0]}${user.SecondName[0]}`.toUpperCase()
    : "?";
  const displayName = user ? `${user.FirstName} ${user.SecondName}` : "Account";

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

      <div className="lg:hidden bg-white border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-1 px-4 py-3 overflow-x-auto scrollbar-none">
          {NAV_ITEMS.map(({ icon: Icon, label, to }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  active
                    ? "bg-primary-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            );
          })}
          {/* Logout pill */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 bg-red-50 text-red-500 hover:bg-red-100 transition-all duration-200 ml-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="container-custom py-8 lg:py-10">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* ── DESKTOP SIDEBAR — hidden on mobile ── */}
          <aside className="hidden lg:block">
            <div className="bg-white rounded-2xl shadow-card sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto overflow-x-hidden">
              {/* User card */}
              <div className="p-5 bg-gradient-to-br from-primary-600 to-navy-800 rounded-t-2xl">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white text-xl font-bold mb-3">
                  {initials}
                </div>
                <p className="font-700 text-white">{displayName}</p>
                <p className="text-white/60 text-xs capitalize">
                  {user?.Role ?? "Customer"}
                </p>
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
                    href="tel:+254746430693"
                    className="text-white font-semibold"
                  >
                    Call us 24/7
                  </a>
                </p>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="min-w-0">{children}</main>
        </div>
      </div>

      <Footer />

      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default CustomerLayout;