import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  Briefcase,
  Star,
  CreditCard,
  Folder,
  Wrench,
  Megaphone,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Menu,
  ClipboardList,
  UserCheck,
  Images,
  UsersIcon,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

// ─── NAV CONFIG ───────────────────────────────────────────────────
interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  {
    group: "Overview",
    items: [{ label: "Dashboard", to: "/admin", icon: LayoutDashboard }],
  },
  {
    group: "Catalogue",
    items: [
      { label: "Products", to: "/admin/products", icon: Package },
      { label: "Services", to: "/admin/services", icon: Wrench },
      { label: "Categories", to: "/admin/categories", icon: Folder },
    ],
  },
  {
    group: "Commerce",
    items: [
      { label: "Orders", to: "/admin/orders", icon: ShoppingCart },
      { label: "Payments", to: "/admin/payments", icon: CreditCard },
      {
        label: "Service Requests",
        to: "/admin/service-requests",
        icon: ClipboardList,
      },
    ],
  },
  {
    group: "Content",
    items: [
      { label: "Hero Slider", to: "/admin/slider", icon: Images },
      { label: "Adverts", to: "/admin/adverts", icon: Megaphone },
      { label: "Reviews", to: "/admin/reviews", icon: Star },
    ],
  },
  {
    group: "HR",
    items: [
      { label: "Jobs", to: "/admin/jobs", icon: Briefcase },
      { label: "Applications", to: "/admin/applications", icon: UserCheck },
    ],
  },
  {
    group: "Users",
    items: [{ label: "Manage Users", to: "/admin/users", icon: Users }],
  },
  {
    group: "Management",
    items: [{ label: "Team Members", to: "/admin/team-members", icon: UsersIcon }],
  },
];

// ─── SIDEBAR ──────────────────────────────────────────────────────
interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (to: string) =>
    to === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(to);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full z-[100] flex flex-col transition-all duration-300
          ${collapsed ? "w-[70px]" : "w-[240px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
          background: "linear-gradient(180deg, #0d1a42 0%, #080f28 100%)",
        }}
      >
        {/* Logo */}
        <div
          className={`flex items-center gap-3 px-4 py-4 border-b border-white/10 ${collapsed ? "justify-center" : ""}`}
        >
          {/* Clickable logo — navigates to "/admin" */}
          <Link to="/admin" aria-label="Go to homepage" className="shrink-0">
            <img
              src="/favicon.png"
              alt="Raz Tech"
              className={`object-contain drop-shadow-lg transition-all duration-300 hover:scale-105 ${
                collapsed ? "h-9 w-9" : "h-11 w-auto"
              }`}
            />
          </Link>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-display font-800 text-white text-sm leading-tight truncate">
                Technologies
              </p>
              <p className="text-white/40 text-xs">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5 scrollbar-none">
          {NAV.map((group) => (
            <div key={group.group} className="mb-1">
              {!collapsed && (
                <p className="text-white/30 text-[10px] font-700 uppercase tracking-widest px-3 py-2">
                  {group.group}
                </p>
              )}
              {collapsed && <div className="my-2 border-t border-white/10" />}
              {group.items.map((item) => {
                const active = isActive(item.to);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onMobileClose}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                      active
                        ? "bg-primary-600 text-white shadow-glow"
                        : "text-white/60 hover:bg-white/8 hover:text-white"
                    } ${collapsed ? "justify-center" : ""}`}
                  >
                    <Icon
                      className={`w-4.5 h-4.5 shrink-0 ${active ? "text-white" : "text-white/50 group-hover:text-white"}`}
                      style={{ width: "18px", height: "18px" }}
                    />
                    {!collapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                    {!collapsed && item.badge !== undefined && (
                      <span className="ml-auto bg-amber-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {/* Tooltip when collapsed */}
                    {collapsed && (
                      <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-lg">
                        {item.label}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom — collapse toggle + logout */}
        <div className="border-t border-white/10 p-3 space-y-1">
          <button
            onClick={onToggle}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:bg-white/8 hover:text-white transition-all duration-150 ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-150 ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? "Sign Out" : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

// ─── ADMIN LAYOUT ─────────────────────────────────────────────────
interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const initials = user
    ? `${user.FirstName[0]}${user.SecondName[0]}`.toUpperCase()
    : "AU";
  const fullName = user ? `${user.FirstName} ${user.SecondName}` : "Admin User";

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((p) => !p)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Top bar — desktop */}
      <div
        className="hidden lg:block fixed top-0 right-0 z-[80] bg-white/95 backdrop-blur-lg border-b border-slate-100 shadow-sm transition-all duration-300"
        style={{ left: collapsed ? "70px" : "240px" }}
      >
        <div className="flex items-center justify-between px-6 py-3.5">
          <h2 className="font-display font-700 text-slate-900 text-base">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            <button className="relative w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-all">
              <Bell style={{ width: "18px", height: "18px" }} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-navy-600 flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <div>
                <p className="text-xs font-700 text-slate-800 leading-tight">
                  {fullName}
                </p>
                <p className="text-[10px] text-slate-400">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[80] bg-white/95 backdrop-blur-lg border-b border-slate-100 shadow-sm flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-600"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile top bar logo — clickable */}
        <Link to="/" aria-label="Go to homepage">
          <img
            src="/favicon.png"
            alt="Raz Tech"
            className="h-9 w-auto object-contain drop-shadow transition-transform duration-300 hover:scale-105"
          />
        </Link>

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-navy-600 flex items-center justify-center text-white text-xs font-bold">
          {initials}
        </div>
      </div>

      {/* Page content */}
      <main
        className="transition-all duration-300 min-h-screen pt-16"
        style={{ marginLeft: collapsed ? "70px" : "240px" }}
      >
        <div className="p-5 md:p-6 pt-[72px]">{children}</div>
      </main>

      <style>{`
        @media (max-width: 1024px) {
          main { margin-left: 0 !important; }
        }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default AdminLayout;