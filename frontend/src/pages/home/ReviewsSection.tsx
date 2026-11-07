import React, { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Star,
  Quote,
  Loader2,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ModelType } from "../../enums/enums";
import { useSocketInvalidation } from "../../hooks/socket.hook";
import { Review } from "../../interfaces/interfaces";
import { ReviewService } from "../../services/review.service";

// ─── Timing ───────────────────────────────────────────────────────
const AUTOPLAY_MS           = 5000; // how long each card rests before sliding on
const RESUME_AFTER_TOUCH_MS = 8000; // pause length after the user swipes / clicks arrows
const SETTLE_MS             = 140;  // scroll must be idle this long before we re-centre

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "star-filled fill-current" : "star-empty"}`}
      />
    ))}
  </div>
);

const BG_COLORS = [
  "from-primary-500 to-primary-700",
  "from-amber-500 to-orange-500",
  "from-teal-500 to-electric-600",
  "from-navy-600 to-navy-800",
  "from-purple-500 to-indigo-600",
];

const ReviewCard: React.FC<{ review: Review; index: number }> = React.memo(({ review, index }) => {
  const user = review.User;
  const initials = user ? `${user.FirstName[0]}${user.SecondName[0]}` : "RZ";

  return (
    <div className="product-card p-6 flex flex-col gap-4 h-full">
      <Quote className="w-8 h-8 text-primary-100 fill-primary-50" />
      <StarRating rating={review.Rating} />

      <p className="text-slate-600 text-sm leading-relaxed italic flex-1">
        "{review.Message ?? "Great service and excellent work!"}"
      </p>

      <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
        <div
          className={`w-10 h-10 rounded-full bg-gradient-to-br ${BG_COLORS[index % BG_COLORS.length]} flex items-center justify-center text-white text-sm font-bold shrink-0`}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-navy-900 text-sm truncate">
            {user ? `${user.FirstName} ${user.SecondName}` : "Valued Customer"}
          </p>
          {user?.County && (
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
              <MapPin className="w-3 h-3" />
              {user.County}
            </div>
          )}
        </div>
        <div className="ml-auto bg-green-50 text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Verified
        </div>
      </div>
    </div>
  );
});

const ReviewsSection: React.FC = () => {
  useSocketInvalidation(ModelType.Review);

  const trackRef       = useRef<HTMLDivElement>(null);
  const counterRef     = useRef<HTMLSpanElement>(null);
  const hoveringRef    = useRef(false);
  const pausedUntilRef = useRef(0);
  const settleTimer    = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const indexRef       = useRef(0); // which real review is currently at the left edge

  const { data, isLoading } = useQuery({
    queryKey: [ModelType.Review.toLowerCase()],
    queryFn: () => ReviewService.FetchApproved(),
    staleTime: 1000 * 60 * 5,
  });

  const reviews = data?.DataList ?? [];
  const n       = reviews.length;
  const loops   = n >= 2;

  // How many times the list is repeated. Needs to be wide enough that the
  // re-centring jump always has content on both sides (≥ ~12 cards in total).
  const copies = loops ? Math.max(3, Math.ceil(12 / n)) : 1;

  // Distance between the left edge of one card and the next (card width + gap)
  const getStep = () => {
    const t = trackRef.current;
    if (!t || t.children.length < 2) return 0;
    return (t.children[1] as HTMLElement).offsetLeft - (t.children[0] as HTMLElement).offsetLeft;
  };

  // Slide one card left/right. Never wraps — the loop is handled by re-centring.
  const advance = useCallback((dir: 1 | -1) => {
    const t = trackRef.current;
    const step = getStep();
    if (!t || !step) return;
    t.scrollTo({ left: (Math.round(t.scrollLeft / step) + dir) * step, behavior: "smooth" });
  }, []);

  const pauseForUser = useCallback(() => {
    pausedUntilRef.current = Date.now() + RESUME_AFTER_TOUCH_MS;
  }, []);

  // ── The infinite-loop trick ─────────────────────────────────────
  // The track holds `copies` identical sets of reviews. We keep the viewport
  // inside the 2nd set. Whenever scrolling comes to rest in the 1st or 3rd set,
  // we jump by exactly one set width — the content is identical, so the eye
  // sees nothing, but the carousel is back in the middle with room to keep going.
  const recentre = useCallback(() => {
    const t = trackRef.current;
    const step = getStep();
    if (!t || !step || !loops) return;
    const setW = n * step;
    if (t.scrollLeft >= 2 * setW - 2)      t.scrollLeft -= setW;
    else if (t.scrollLeft < setW - 2)      t.scrollLeft += setW;
  }, [n, loops]);

  // Start in the middle set, before first paint, so there's no visible jump on load
  useLayoutEffect(() => {
    const t = trackRef.current;
    const step = getStep();
    if (!t || !step || !loops) return;
    t.scrollLeft = n * step;
  }, [n, loops, copies]);

  // Keep the position correct if the window is resized (card width changes at breakpoints)
  useEffect(() => {
    if (!loops) return;
    const onResize = () => {
      const t = trackRef.current;
      const step = getStep();
      if (!t || !step) return;
      t.scrollLeft = n * step + indexRef.current * step;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [n, loops]);

  // ── Autoplay ────────────────────────────────────────────────────
  useEffect(() => {
    if (!loops) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      if (document.hidden) return;
      if (hoveringRef.current) return;
      if (Date.now() < pausedUntilRef.current) return;
      advance(1);
    }, AUTOPLAY_MS);

    return () => clearInterval(id);
  }, [loops, advance]);

  useEffect(() => () => clearTimeout(settleTimer.current), []);

  // Scroll handler: update the "3 / 12" counter, and re-centre once scrolling has settled
  const handleScroll = () => {
    const t = trackRef.current;
    const step = getStep();
    if (!t || !step || !loops) return;

    const setW = n * step;
    const idx = ((Math.round((t.scrollLeft - setW) / step) % n) + n) % n;
    indexRef.current = idx;
    if (counterRef.current) counterRef.current.textContent = `${idx + 1} / ${n}`;

    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(recentre, SETTLE_MS);
  };

  if (isLoading) {
    return (
      <section className="section-padding bg-white">
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      </section>
    );
  }

  if (n === 0) return null;

  const avgRating = reviews.reduce((acc, r) => acc + r.Rating, 0) / n;

  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="reveal badge badge-primary mb-4 mx-auto w-fit">
            <Star className="w-3 h-3 fill-current" /> Client Reviews
          </div>
          <h2 className="reveal section-title">
            Trusted by Hundreds <span className="text-gradient">Across Kenya</span>
          </h2>
          <div className="reveal stagger-2 flex items-center justify-center gap-3 mt-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(avgRating) ? "star-filled fill-current" : "star-empty"}`}
                />
              ))}
            </div>
            <span className="font-700 text-navy-900 text-lg">{avgRating.toFixed(1)}</span>
            <span className="text-slate-400 text-sm">from {n} verified reviews</span>
          </div>
        </div>

        {/* ── Carousel ── */}
        <div
          onMouseEnter={() => { hoveringRef.current = true; }}
          onMouseLeave={() => { hoveringRef.current = false; }}
          onFocus={() => { hoveringRef.current = true; }}
          onBlur={() => { hoveringRef.current = false; }}
        >
          <div
            ref={trackRef}
            onScroll={handleScroll}
            onTouchStart={pauseForUser}
            onPointerDown={pauseForUser}
            onWheel={pauseForUser}
            tabIndex={0}
            role="region"
            aria-label="Customer reviews"
            className="reviews-track flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 -my-4 focus:outline-none"
          >
            {Array.from({ length: copies }).map((_, copy) =>
              reviews.map((review, i) => (
                <div
                  key={`${copy}-${review.ReviewId}`}
                  // Only the first set is exposed to screen readers; the rest are loop clones
                  aria-hidden={copy > 0}
                  className="snap-start shrink-0 w-[88%] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <ReviewCard review={review as Review} index={i} />
                </div>
              ))
            )}
          </div>

          {/* Controls: prev · counter · next */}
          {loops && (
            <div className="flex items-center justify-center gap-5 mt-8">
              <button
                onClick={() => { pauseForUser(); advance(-1); }}
                aria-label="Previous review"
                className="w-10 h-10 shrink-0 rounded-full border border-slate-200 text-slate-500 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 flex items-center justify-center transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span
                ref={counterRef}
                className="text-sm font-semibold text-slate-400 tabular-nums min-w-[56px] text-center"
              >
                1 / {n}
              </span>

              <button
                onClick={() => { pauseForUser(); advance(1); }}
                aria-label="Next review"
                className="w-10 h-10 shrink-0 rounded-full border border-slate-200 text-slate-500 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 flex items-center justify-center transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .reviews-track::-webkit-scrollbar { display: none; }
        .reviews-track { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default ReviewsSection;