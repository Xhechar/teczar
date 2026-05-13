import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  User,
  ShoppingCart,
  Package,
  Settings,
  LogOut,
  Calendar,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { CategoryService } from "../services/category.service";
import { useQuery } from "@tanstack/react-query";
import { Category } from "../interfaces/interfaces";

interface NavbarProps {
  transparent?: boolean;
}

interface NavLink {
  label: string;
  to: string;
  sectionId?: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Home", to: "/", sectionId: "home" },
  { label: "Services", to: "/explore?tab=services" },
  { label: "Products", to: "/explore?tab=products" },
  { label: "About", to: "/", sectionId: "about" },
  { label: "Projects", to: "/", sectionId: "projects" },
  { label: "Careers", to: "/careers" },
  { label: "Team", to: "/meet-team" },
  { label: "Contact", to: "/", sectionId: "contact" },
];

function scrollToSection(id: string, attempts = 0) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  } else if (attempts < 20) {
    setTimeout(() => scrollToSection(id, attempts + 1), 25);
  }
}

const HOME_SECTION_IDS = ["hero", "projects", "about", "contact"];

export const Navbar: React.FC<NavbarProps> = ({ transparent = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const catMenuRef = useRef<HTMLDivElement>(null);
  const catMenuCloseTimeout = useRef<number | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const { data: catsData } = useQuery({
    queryKey: ["nav-categories"],
    queryFn: () => CategoryService.FetchAll(),
    staleTime: 1000 * 60 * 10,
  });

  const navCategories: Category[] = catsData?.DataList ?? [];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHomePage) {
      setActiveSection(null);
      return;
    }

    setActiveSection("hero");

    const NAVBAR_HEIGHT = 80;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: `-${NAVBAR_HEIGHT}px 0px -60% 0px`,
        threshold: 0,
      },
    );

    const sectionEls: Element[] = [];

    HOME_SECTION_IDS.forEach((id) => {
      if (id === "hero") {
        const el = document.querySelector("section");
        if (el) {
          el.id = "hero";
          sectionEls.push(el);
          observer.observe(el);
        }
      } else {
        const el = document.getElementById(id);
        if (el) {
          sectionEls.push(el);
          observer.observe(el);
        }
      }
    });

    return () => observer.disconnect();
  }, [isHomePage]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      if (catMenuCloseTimeout.current) {
        window.clearTimeout(catMenuCloseTimeout.current);
      }
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent, link: NavLink) => {
    if (!link.sectionId) return;

    e.preventDefault();
    setMobileOpen(false);

    const targetId = link.sectionId === "home" ? "hero" : link.sectionId;

    if (isHomePage) {
      scrollToSection(targetId);
    } else {
      navigate("/");
      scrollToSection(targetId);
    }
  };

  const isNavScrolled = scrolled || !transparent || mobileOpen;

  const isActive = (link: NavLink): boolean => {
    if (!isHomePage) {
      if (link.sectionId) return false;

      const linkPath = link.to.split("?")[0];
      const linkParams = new URLSearchParams(
        link.to.includes("?") ? link.to.split("?")[1] : "",
      );
      const currentParams = new URLSearchParams(location.search);

      // For Services and Products: match both pathname AND the tab param
      if (linkPath === "/explore" && linkParams.get("tab")) {
        return (
          location.pathname === "/explore" &&
          currentParams.get("tab") === linkParams.get("tab")
        );
      }

      return location.pathname === linkPath;
    }

    // Home page section tracking
    if (link.sectionId === "home")
      return activeSection === "hero" || activeSection === null;
    if (link.sectionId) return activeSection === link.sectionId;
    return false;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          isNavScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-md py-2"
            : "bg-transparent py-3"
        }`}
      >
        <div className="container-custom flex items-center justify-between">
          {/* Logo — blue rounded container keeps logo visible on both transparent & white states */}
          <Link
            to="/"
            className="flex items-center group"
            aria-label="Raz Tech — Home"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-600 to-navy-700 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-300 overflow-hidden p-1.5">
              <img
                src="../testtrial.png"
                alt="Raz Tech"
                className="w-full h-full object-contain"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isProducts = link.label === "Products";

              // Products gets a special dropdown wrapper
              if (isProducts) {
                return (
                  <div
                    key={link.label}
                    ref={catMenuRef}
                    className="relative"
                    onMouseEnter={() => {
                      if (catMenuCloseTimeout.current) {
                        window.clearTimeout(catMenuCloseTimeout.current);
                        catMenuCloseTimeout.current = null;
                      }
                      setCatMenuOpen(true);
                    }}
                    onMouseLeave={() => {
                      if (catMenuCloseTimeout.current) {
                        window.clearTimeout(catMenuCloseTimeout.current);
                      }
                      catMenuCloseTimeout.current = window.setTimeout(
                        () => setCatMenuOpen(false),
                        250,
                      );
                    }}
                  >
                    {/* Products button — left part navigates, right chevron opens submenu */}
                    <div
                      className={`flex items-center rounded-lg transition-all duration-200 ${
                        isActive(link)
                          ? isNavScrolled
                            ? "text-primary-600 bg-primary-50"
                            : "text-white bg-white/15"
                          : isNavScrolled
                            ? "text-slate-700 hover:text-primary-600 hover:bg-slate-50"
                            : "text-white/85 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Link
                        to={link.to}
                        className="pl-4 py-2 text-sm font-medium"
                      >
                        {link.label}
                      </Link>
                      <button
                        className="px-1.5 py-2 rounded-r-lg"
                        aria-label="Browse product categories"
                      >
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${catMenuOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>

                    {/* Category submenu */}
                    {catMenuOpen && (
                      <div
                        className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-card-hover border border-slate-100 overflow-hidden z-50"
                        style={{ animation: "fadeUp .18s ease-out" }}
                      >
                        <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                          <p className="text-xs font-700 text-slate-500 uppercase tracking-wide">
                            Browse by Category
                          </p>
                        </div>
                        <div className="py-1.5 max-h-72 overflow-y-auto">
                          {/* All products */}
                          <Link
                            to="/explore?tab=products"
                            onClick={() => setCatMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                          >
                            <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                              <Package className="w-3.5 h-3.5 text-slate-500" />
                            </div>
                            All Products
                          </Link>

                          {navCategories.length > 0 && (
                            <div className="h-px bg-slate-100 my-1" />
                          )}

                          {navCategories.map((cat) => (
                            <Link
                              key={cat.CategoryId}
                              to={`/explore?tab=products&category=${cat.CategoryId}`}
                              onClick={() => setCatMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                            >
                              {cat.ImageUrl ? (
                                <img
                                  src={cat.ImageUrl}
                                  alt=""
                                  className="w-6 h-6 rounded-lg object-cover shrink-0"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                                  <Package className="w-3.5 h-3.5 text-primary-400" />
                                </div>
                              )}
                              <span className="truncate">{cat.Name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // All other nav links render normally
              return (
                <Link
                  key={link.label}
                  to={link.sectionId ? "/" : link.to}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link)
                      ? isNavScrolled
                        ? "text-primary-600 bg-primary-50"
                        : "text-white bg-white/15"
                      : isNavScrolled
                        ? "text-slate-700 hover:text-primary-600 hover:bg-slate-50"
                        : "text-white/85 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              /* ── Authenticated ── */
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen((p) => !p)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 ${
                    isNavScrolled
                      ? "hover:bg-slate-100 text-slate-800"
                      : "hover:bg-white/10 text-white"
                  }`}
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-navy-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.FirstName[0]}
                    {user.SecondName[0]}
                  </div>
                  <div className="text-left">
                    <p
                      className={`text-sm font-semibold leading-none ${isNavScrolled ? "text-navy-900" : "text-white"}`}
                    >
                      {user.FirstName}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${isNavScrolled ? "text-slate-500" : "text-white/60"}`}
                    >
                      {user.Role}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""} ${isNavScrolled ? "text-slate-400" : "text-white/60"}`}
                  />
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-card-hover border border-slate-100 overflow-hidden">
                    <div className="p-3 bg-gradient-to-br from-primary-50 to-navy-50 border-b border-slate-100">
                      <p className="text-sm font-semibold text-navy-900">
                        {user.FirstName} {user.SecondName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {user.Email}
                      </p>
                    </div>
                    <div className="py-1.5">
                      {[
                        { icon: User, label: "My Profile", to: "/profile" },
                        { icon: ShoppingCart, label: "My Cart", to: "/cart" },
                        { icon: Package, label: "My Orders", to: "/orders" },
                        {
                          icon: Calendar,
                          label: "My Bookings",
                          to: "/bookings",
                        },
                        { icon: Settings, label: "Settings", to: "/settings" },
                      ].map(({ icon: Icon, label, to }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors duration-150"
                        >
                          <Icon className="w-4 h-4 text-slate-400" />
                          {label}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 py-1.5">
                      <button
                        onClick={async () => {
                          await logout();
                          setDropdownOpen(false);
                          navigate("/", { replace: true });
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── Guest ── */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isNavScrolled
                      ? "text-slate-700 hover:bg-slate-100"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-300 shadow-glow"
                  style={{
                    background: "linear-gradient(135deg,#1660eb,#0d1a42)",
                  }}
                >
                  <UserPlus className="w-4 h-4" />
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className={`lg:hidden p-2 rounded-xl transition-all duration-200 ${
              isNavScrolled
                ? "text-slate-700 hover:bg-slate-100"
                : "text-white hover:bg-white/10"
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Drawer */}
        <div
          className={`lg:hidden transition-all duration-400 overflow-hidden ${
            mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {/* overflow-y-auto ensures the drawer itself scrolls if content is taller than viewport */}
          <div className="container-custom py-4 space-y-1 border-t border-slate-100 bg-white/98 backdrop-blur-lg overflow-y-auto max-h-[calc(100vh-64px)]">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.sectionId ? "/" : link.to}
                onClick={(e) => handleNavClick(e, link)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link)
                    ? "text-primary-600 bg-primary-50"
                    : "text-slate-700 hover:bg-slate-50 hover:text-primary-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-1">
              {user ? (
                <>
                  {/* User card */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl mb-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-navy-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {user.FirstName[0]}
                      {user.SecondName[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-navy-900 truncate">
                        {user.FirstName} {user.SecondName}
                      </p>
                      <p className="text-xs text-slate-500">{user.Role}</p>
                    </div>
                  </div>
                  {/* All dashboard links — Settings included */}
                  {[
                    { icon: User, label: "My Profile", to: "/profile" },
                    { icon: ShoppingCart, label: "My Cart", to: "/cart" },
                    { icon: Package, label: "My Orders", to: "/orders" },
                    { icon: Calendar, label: "My Bookings", to: "/bookings" },
                    { icon: Settings, label: "Settings", to: "/settings" },
                  ].map(({ icon: Icon, label, to }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-slate-400" />
                      {label}
                    </Link>
                  ))}
                  {/* Sign Out — always visible, separated */}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={async () => {
                        await logout();
                        setMobileOpen(false);
                        navigate("/", { replace: true });
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 border border-slate-200 hover:bg-slate-50"
                  >
                    <LogIn className="w-4 h-4" /> Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white"
                    style={{
                      background: "linear-gradient(135deg,#1660eb,#0d1a42)",
                    }}
                  >
                    <UserPlus className="w-4 h-4" /> Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
