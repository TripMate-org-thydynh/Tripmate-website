'use client';

import { useEffect } from 'react';

export function TravelMotion() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const scenes = [...document.querySelectorAll<HTMLElement>('.tripmate-landing [data-travel-motion]')];
    const reveals = document.querySelectorAll<HTMLElement>('.tripmate-landing [data-travel-reveal]');
    const observer = new IntersectionObserver(entries => {
      for (const { isIntersecting, target } of entries) {
        if (!isIntersecting) continue;
        if (!preference.matches) (target as HTMLElement).dataset.travelReveal = 'visible';
        observer.unobserve(target);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: .07 });
    reveals.forEach(element => observer.observe(element));
    let frame: number | undefined;

    function update() {
      frame = undefined;
      if (preference.matches) return;

      const viewport = window.innerHeight;
      const measurements = scenes.map(scene => ({ scene, bounds: scene.getBoundingClientRect() }));
      for (const { scene, bounds } of measurements) {
        const progress = scene.dataset.travelMotion === 'hero'
          ? window.scrollY / Math.min(450, viewport * .5)
          : (viewport - bounds.top - 20) / Math.min(235, Math.max(140, bounds.height * .75));
        const clamped = Math.max(0, Math.min(1, progress));
        const value = clamped.toFixed(3);
        if (scene.style.getPropertyValue('--scene-progress') !== value) {
          scene.style.setProperty('--scene-progress', value);
        }
      }
    }

    function schedule() {
      if (frame === undefined) frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    preference.addEventListener('change', schedule);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      preference.removeEventListener('change', schedule);
      if (frame !== undefined) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
