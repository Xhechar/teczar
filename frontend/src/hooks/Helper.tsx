import { useEffect, useRef, useCallback } from "react";

// ===================== SCROLL REVEAL HOOK =====================
/**
 * Observes all .reveal/.reveal-left/.reveal-right elements and adds
 * the "visible" class when they enter the viewport.
 *
 * Pass a deps array to re-run after async data loads so newly
 * rendered cards get observed. e.g. useScrollReveal([services, products])
 */
export function useScrollReveal(deps: unknown[] = []) {
  useEffect(() => {
    // Tiny delay so React has flushed new DOM nodes before we query them
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target); // done — no need to keep watching
            }
          });
        },
        { threshold: 0.06, rootMargin: "0px 0px -30px 0px" },
      );

      document
        .querySelectorAll(".reveal, .reveal-left, .reveal-right")
        .forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }, 60);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ===================== SECTION SCROLL UTILITY =====================
/**
 * Smoothly scrolls to a section by id.
 * Retries up to ~1 second in case the element hasn't mounted yet
 * (useful for hash-links to sections on the homepage).
 */
export function scrollToSection(sectionId: string, attempts = 0): void {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  } else if (attempts < 20) {
    setTimeout(() => scrollToSection(sectionId, attempts + 1), 50);
  }
}

// ===================== COUNTER ANIMATION HOOK =====================
export function useCounterAnimation(
  target: number,
  duration: number = 2000,
  start: boolean = true,
) {
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!start) return;
    if (startedRef.current && target === 0) return;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    startedRef.current = true;

    const el = ref.current;
    if (!el) return;

    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target).toString();
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        el.textContent = target.toString();
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, target]);

  return ref;
}
