import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Phone,
  ChevronDown,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Sun,
  Camera,
  Zap,
  Wifi,
  Shield,
  Droplets,
  Wrench,
  Mic2,
} from "lucide-react";
import { ModelType } from "../../enums/enums";
import { useSocketInvalidation } from "../../hooks/socket.hook";
import { HeroSlide } from "../../interfaces/interfaces";
import { HeroSliderService } from "../../services/hero.slider.service";

const TAG_ICON_MAP: Record<string, React.ElementType> = {
  "Solar Installation": Sun,
  "CCTV & Security": Camera,
  "Electrical Works": Zap,
  "Internet & WiFi": Wifi,
  "Electric Fencing": Shield,
  "Intercom & Access Control": Mic2,
  "Plumbing Services": Droplets,
  "Electronic Repairs": Wrench,
};
const DEFAULT_ICON: React.ElementType = Zap;

const AUTO_PLAY_INTERVAL = 6000;

// ─── Stat strip (static — comes from admin settings in v2) ────────
const HERO_STATS = [
  { display: "500+", label: "Projects Done" },
  { display: "10+", label: "Counties Served" },
  { display: "24/7", label: "Support Available" },
  { display: "98%", label: "Satisfaction" },
];

// ─── Individual stat pill ────────────────────────────────────────
const StatPill: React.FC<{
  display: string;
  label: string;
  pulse: boolean;
}> = ({ display, label, pulse }) => (
  <div className="glass rounded-2xl py-4 px-3 text-center">
    <div
      className={`text-2xl md:text-3xl font-900 text-white mb-0.5 transition-transform duration-300 ${pulse ? "scale-110" : "scale-100"}`}
    >
      {display}
    </div>
    <div className="text-xs text-white/60 font-medium">{label}</div>
  </div>
);

// ─── Hero Section ────────────────────────────────────────────────
const HeroSection: React.FC = () => {
  useSocketInvalidation(ModelType.HeroSlide);

  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTrans] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [textVisible, setTextVis] = useState(true);
  const [statPulse, setStatPulse] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data } = useQuery({
    queryKey: [ModelType.HeroSlide.toLowerCase(), "active"],
    queryFn: () => HeroSliderService.FetchActive(),
    staleTime: 1000 * 60 * 5
  });

  const slides: HeroSlide[] = data?.DataList ?? [];

  // Reset current index when slides list changes length
  useEffect(() => {
    setCurrent(0);
  }, [slides.length]);

  // Initial mount fade-in
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 120);
    return () => clearTimeout(t);
  }, []);

  // ── Navigate to a specific slide ──
  const goTo = useCallback(
    (index: number) => {
      if (transitioning || index === current || slides.length < 2) return;
      setTextVis(false);
      setTrans(true);
      setPrev(current);
      setTimeout(() => {
        setCurrent(index);
        setTrans(false);
        setTimeout(() => {
          setTextVis(true);
          setStatPulse(true);
          setTimeout(() => setStatPulse(false), 400);
        }, 80);
      }, 700);
    },
    [current, transitioning, slides.length],
  );

  const goNext = useCallback(
    () => goTo((current + 1) % Math.max(slides.length, 1)),
    [current, goTo, slides.length],
  );
  const goPrev = useCallback(
    () => goTo((current - 1 + slides.length) % Math.max(slides.length, 1)),
    [current, goTo, slides.length],
  );

  // ── Auto-play ──
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (slides.length > 1) {
      timerRef.current = setInterval(goNext, AUTO_PLAY_INTERVAL);
    }
  }, [goNext, slides.length]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const handleManual = (fn: () => void) => {
    fn();
    resetTimer();
  };

  // ── Active slide ──
  const slide = slides[current];
  const prevSlide = prev !== null ? slides[prev] : null;

  // If slides haven't loaded yet, show a plain dark background
  if (!slide) {
    return (
      <section
        className="relative min-h-screen flex flex-col"
        style={{
          background: "linear-gradient(135deg,#080f28 0%,#0d1a42 100%)",
        }}
      >
        <div className="flex-1" />
        <svg
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full block relative z-10"
          style={{ marginBottom: "-2px" }}
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
            fill="#f8fafc"
          />
        </svg>
      </section>
    );
  }

  const TagIcon = TAG_ICON_MAP[slide.Tag] ?? DEFAULT_ICON;

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col">
      {/* ── Background crossfade ── */}
      {prevSlide && (
        <div
          key={`prev-${prev}`}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${prevSlide.ImageUrl})`,
            opacity: transitioning ? 1 : 0,
            transition: "opacity 0.7s ease-in-out",
          }}
        />
      )}
      <div
        key={`curr-${current}`}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${slide.ImageUrl})`,
          opacity: transitioning ? 0 : 1,
          transitionProperty: "opacity,transform",
          transitionDuration: "0.7s,1.2s",
          transitionTimingFunction: "ease-in-out,ease-out",
          transform: transitioning ? "scale(1.04)" : "scale(1)",
        }}
      />

      {/* ── Overlays ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom,rgba(8,15,40,.55) 0%,rgba(8,15,40,.72) 50%,rgba(8,15,40,.88) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right,rgba(13,26,66,.65) 0%,rgba(13,26,66,.15) 55%,transparent 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Main content ── */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="container-custom py-32 md:py-44 w-full">
          <div className="max-w-3xl">
            {/* Tag pill */}
            <div
              className={`inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 transition-all duration-500 ${loaded && textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
            >
              <TagIcon className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-semibold text-white/90 tracking-widest uppercase">
                {slide.Tag}
              </span>
            </div>

            {/* Title */}
            <h1
              className={`font-display text-5xl md:text-6xl lg:text-[4.5rem] font-900 text-white leading-none mb-4 transition-all duration-500 delay-75 ${loaded && textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              {slide.Title}{" "}
              <span className="block mt-1 text-gradient-gold">
                {slide.TitleAccent}
              </span>
            </h1>

            {/* Description */}
            <p
              className={`text-base md:text-lg text-white leading-relaxed mb-10 max-w-xl transition-all duration-500 delay-150 ${loaded && textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              {slide.Description}
            </p>

            {/* CTAs */}
            <div
              className={`flex flex-col sm:flex-row gap-4 mb-16 transition-all duration-500 delay-200 ${loaded && textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              <Link
                to={slide.CtaLink}
                className="btn-primary text-base px-8 py-4"
              >
                {slide.CtaLabel}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="tel:+254746430693"
                className="btn-outline text-base px-8 py-4"
              >
                <Phone className="w-5 h-5" />
                Call to Order
              </a>
            </div>

            {/* Stats */}
            <div
              className={`grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl transition-all duration-500 delay-300 ${loaded && textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              {HERO_STATS.map((s, i) => (
                <StatPill
                  key={s.label}
                  display={s.display}
                  label={s.label}
                  pulse={statPulse && i === current % HERO_STATS.length}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Prev / Next arrows ── */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => handleManual(goPrev)}
            aria-label="Previous slide"
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleManual(goNext)}
            aria-label="Next slide"
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </>
      )}

      {/* ── Dot indicators ── */}
      {slides.length > 1 && (
        <div className="absolute bottom-24 md:bottom-28 right-6 md:right-10 z-20 flex flex-col gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => handleManual(() => goTo(i))}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-400 ${i === current ? "w-2.5 h-8 bg-amber-400 shadow-glow-amber" : "w-2.5 h-2.5 bg-white/35 hover:bg-white/60"}`}
            />
          ))}
        </div>
      )}

      {/* ── Progress bar ── */}
      {slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-20 h-0.5 bg-white/10">
          <div
            key={current}
            className="h-full bg-amber-400"
            style={{
              animation: `progressBar ${AUTO_PLAY_INTERVAL}ms linear forwards`,
            }}
          />
        </div>
      )}

      {/* ── Wave bottom ── */}
      <div className="relative z-10">
        <svg
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full block"
          style={{ marginBottom: "-2px" }}
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
            fill="#f8fafc"
          />
        </svg>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </div>

      <style>{`
        @keyframes progressBar { from { width: 0%; } to { width: 100%; } }
      `}</style>
    </section>
  );
};

export default HeroSection;
