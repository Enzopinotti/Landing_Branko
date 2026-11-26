"use client";

import { createContext, useCallback, useContext, useEffect, ReactNode, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

interface SmoothScrollProps {
  children: ReactNode;
}

type ScrollTarget = number | string | HTMLElement;
type ScrollOptions = { offset?: number; duration?: number };

function nativeScrollTo(target: ScrollTarget, options: ScrollOptions = {}) {
  const offset = options.offset ?? 0;
  const element = typeof target === "string"
    ? document.querySelector<HTMLElement>(target)
    : typeof target === "number"
      ? null
      : target;

  const top = element
    ? element.getBoundingClientRect().top + window.scrollY + offset
    : typeof target === "number"
      ? target + offset
      : undefined;

  if (top !== undefined) window.scrollTo({ top, behavior: "smooth" });
}

const SmoothScrollContext = createContext<(target: ScrollTarget, options?: ScrollOptions) => void>(nativeScrollTo);

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  const scrollTo = useCallback((target: ScrollTarget, options: ScrollOptions = {}) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset: options.offset ?? 0,
        duration: options.duration ?? 1.2,
      });
      return;
    }

    nativeScrollTo(target, options);
  }, []);

  return <SmoothScrollContext.Provider value={scrollTo}>{children}</SmoothScrollContext.Provider>;
}
