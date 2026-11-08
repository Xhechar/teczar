import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Search,
  X,
  MapPin,
  Tag,
  Calendar,
  ArrowUpDown,
  FolderOpen,
  CheckCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../pages/home/Footer";
import ProjectCard from "../components/ProjectCard";
import { PROJECTS, byNewest, getProjectYear } from "../shared/projects.data";

const PAGE_SIZE = 8;

type SortKey = "newest" | "oldest" | "title" | "location";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Name (A–Z)" },
  { value: "location", label: "Location (A–Z)" },
];

// ─── Styled select with leading icon ──────────────────────────────
const FilterSelect: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
  children: React.ReactNode;
}> = ({ icon: Icon, label, value, onChange, className = "", children }) => (
  <div className={`relative ${className}`}>
    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-10 pr-9 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 cursor-pointer appearance-none transition-all"
    >
      {children}
    </select>
    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
  </div>
);

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Arriving from the middle of the homepage — start at the top of this page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ── Filters live in the URL so they survive refresh / back navigation ──
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "all";
  const county = searchParams.get("county") ?? "all";
  const year = searchParams.get("year") ?? "all";
  const sort = (searchParams.get("sort") as SortKey) ?? "newest";

  const setParam = (key: string, value: string, defaultValue = "all") => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === defaultValue) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  // Any filter change → go back to the first page of results
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [q, category, county, year, sort]);

  // ── Filter options build themselves from the data ──
  const categories = useMemo(
    () => Array.from(new Set(PROJECTS.map((p) => p.category))).sort(),
    [],
  );
  const counties = useMemo(
    () => Array.from(new Set(PROJECTS.map((p) => p.county))).sort(),
    [],
  );
  const years = useMemo(
    () =>
      Array.from(new Set(PROJECTS.map((p) => getProjectYear(p.completedAt))))
        .sort()
        .reverse(),
    [],
  );

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = PROJECTS.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (county !== "all" && p.county !== county) return false;
      if (year !== "all" && getProjectYear(p.completedAt) !== year)
        return false;
      if (term) {
        const haystack = [
          p.title,
          p.subtitle,
          p.county,
          p.category,
          ...p.details,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "oldest":
          return -byNewest(a, b);
        case "title":
          return a.title.localeCompare(b.title);
        case "location":
          return a.county.localeCompare(b.county) || byNewest(a, b);
        default:
          return byNewest(a, b);
      }
    });
    return list;
  }, [q, category, county, year, sort]);

  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visible.length;
  const hasFilters =
    q !== "" || category !== "all" || county !== "all" || year !== "all";

  const clearFilters = () =>
    setSearchParams(sort !== "newest" ? { sort } : {}, { replace: true });

  // Back: previous page if there is one, otherwise home (e.g. page opened from a shared link)
  const goBack = () =>
    window.history.length > 1 ? navigate(-1) : navigate("/");

  // Contact form lives on the homepage — go there, then scroll once it has rendered
  const goToContact = () => {
    navigate("/");
    let tries = 0;
    const tick = () => {
      const el = document.getElementById("contact");
      if (el) {
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - 72,
          behavior: "smooth",
        });
      } else if (tries++ < 40) {
        setTimeout(tick, 50);
      }
    };
    setTimeout(tick, 50);
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />

      {/* ── Header ── */}
      <div
        className="pt-28 pb-20"
        style={{
          background: "linear-gradient(135deg,#0d1a42 0%,#1660eb 100%)",
        }}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Projects</span>
            </div>
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-700 text-white mt-4 mb-3">
            Our Projects
          </h1>
          <p className="text-white/60 max-w-xl text-sm md:text-base leading-relaxed">
            A look at the installations we've completed for homes and businesses
            across Kenya. Filter by type, location, or year to find work similar
            to yours.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-3 mt-7">
            {[
              { n: PROJECTS.length, l: "Projects shown" },
              { n: counties.length, l: "Locations" },
              { n: categories.length, l: "Service types" },
            ].map(({ n, l }) => (
              <div
                key={l}
                className="bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 backdrop-blur-sm"
              >
                <span className="font-display font-700 text-white text-xl mr-2">
                  {n}
                </span>
                <span className="text-white/60 text-xs uppercase tracking-wide">
                  {l}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filters (overlaps the header) ── */}
      <div className="container-custom -mt-9 relative z-10">
        <div className="bg-white rounded-2xl shadow-card-hover border border-slate-100 p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12">
            {/* Search by name / keyword */}
            <div className="relative sm:col-span-2 lg:col-span-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                value={q}
                onChange={(e) => setParam("q", e.target.value, "")}
                placeholder="Search by name or keyword…"
                aria-label="Search projects"
                className="w-full pl-10 pr-9 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
              />
              {q && (
                <button
                  onClick={() => setParam("q", "", "")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <FilterSelect
              icon={Tag}
              label="Filter by type"
              value={category}
              onChange={(v) => setParam("category", v)}
              className="lg:col-span-2"
            >
              <option value="all">All types</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect
              icon={MapPin}
              label="Filter by location"
              value={county}
              onChange={(v) => setParam("county", v)}
              className="lg:col-span-2"
            >
              <option value="all">All locations</option>
              {counties.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect
              icon={Calendar}
              label="Filter by year"
              value={year}
              onChange={(v) => setParam("year", v)}
              className="lg:col-span-2"
            >
              <option value="all">All years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect
              icon={ArrowUpDown}
              label="Sort projects"
              value={sort}
              onChange={(v) => setParam("sort", v, "newest")}
              className="lg:col-span-2"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </FilterSelect>
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="container-custom py-10">
        <div className="flex items-center justify-between gap-4 mb-6 min-h-[28px]">
          <p className="text-sm text-slate-500">
            Showing <strong className="text-navy-900">{visible.length}</strong>{" "}
            of <strong className="text-navy-900">{filtered.length}</strong>{" "}
            project{filtered.length !== 1 ? "s" : ""}
            {hasFilters && <span className="text-slate-400"> (filtered)</span>}
          </p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              <X className="w-3.5 h-3.5" /> Clear filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 text-slate-200" />
            <h3 className="font-display font-700 text-navy-900 text-lg mb-1">
              No projects match your filters
            </h3>
            <p className="text-slate-400 text-sm mb-5">
              Try a different keyword, or remove a filter.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#1660eb,#0d1a42)" }}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            {/* Cards animate with a CSS fade (not scroll-reveal) so they're never
                left invisible when the list changes after filtering / "show more". */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {visible.map((project, i) => (
                <div
                  key={project.id}
                  style={{
                    animation: "projFadeIn .4s ease-out both",
                    animationDelay: `${(i % PAGE_SIZE) * 0.05}s`,
                  }}
                >
                  <ProjectCard project={project} animate={false} showDate />
                </div>
              ))}
            </div>

            {remaining > 0 && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-primary-600 text-primary-600 font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300"
                >
                  Show more projects ({remaining} remaining)
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* ── CTA ── */}
        <div
          className="mt-16 relative overflow-hidden rounded-3xl p-10 text-center"
          style={{
            background: "linear-gradient(135deg, #0d1a42 0%, #1660eb 100%)",
          }}
        >
          <div className="absolute inset-0 mesh-pattern opacity-20" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 bg-white/10 rounded-full px-3 py-1 mb-4">
              <CheckCircle className="w-3.5 h-3.5 text-green-400" /> Free site
              assessment
            </div>
            <h3 className="font-display text-3xl md:text-4xl font-700 text-white mb-3">
              Have a Similar Project in Mind?
            </h3>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Tell us what you need and we'll visit your property, assess it,
              and send you a personalized quote — no obligation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={goToContact} className="btn-amber">
                Get a Free Quote <ArrowRight className="w-4 h-4" />
              </button>
              <a href="tel:+254700000000" className="btn-outline">
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes projFadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ProjectsPage;
