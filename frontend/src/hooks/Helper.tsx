import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ModelType } from "../enums/enums";

// ===================== SCROLL REVEAL HOOK =====================
export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" },
    );

    const elements = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right",
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

export function useCounterAnimation(
  target: number,
  duration: number = 2000,
  start: boolean = true
) {
  const ref      = useRef<HTMLSpanElement>(null);
  const rafRef   = useRef<number | null>(null);
  const startedRef = useRef(false);
 
  useEffect(() => {
    if (!start) return;
    if (startedRef.current && target === 0) return; // guard no-op
 
    // Cancel any in-progress animation
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    startedRef.current = true;
 
    const el = ref.current;
    if (!el) return;
 
    const startTime = performance.now();
 
    const tick = (now: number) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const ease     = 1 - Math.pow(1 - progress, 3);
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