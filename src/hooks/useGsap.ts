'use client';

import { useEffect, useRef, DependencyList } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/animation';

/**
 * Custom hook to safely execute GSAP animations with automatic scoping,
 * ScrollTrigger cleanup, and prefers-reduced-motion handling.
 *
 * `target` (the DOM node) is provided as the first parameter to prevent closure issues.
 */
export function useGsapEffect<T extends HTMLElement = HTMLDivElement>(
  effect: (target: T, ctx: gsap.Context, isReduced: boolean) => void | (() => void),
  deps: DependencyList = []
) {
  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const isReduced = prefersReducedMotion();
    let cleanupFn: void | (() => void);

    // Pass `el` (the actual DOM node) as scope so gsap.from('.selector') is properly scoped
    const ctx = gsap.context((self) => {
      cleanupFn = effect(el, self, isReduced);
      // Ensure ScrollTrigger measures the layout accurately
      if (typeof window !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, el);

    return () => {
      if (typeof cleanupFn === 'function') {
        cleanupFn();
      }
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return containerRef;
}

export { gsap, ScrollTrigger, prefersReducedMotion };
