'use client';

import { useEffect, useRef, useState } from 'react';

export type WeatherEffectType = 
  | 'spring' 
  | 'summer' 
  | 'autumn' 
  | 'winter' 
  | 'leaves' 
  | 'rain' 
  | 'snow' 
  | 'mist' 
  | 'sun' 
  | 'fireflies' 
  | 'fog'
  | 'clouds'
  | 'dust'
  | 'wind'
  | 'none';

interface EnvironmentalEffectsProps {
  effect: WeatherEffectType;
  intensity?: 'subtle' | 'medium' | 'high';
  className?: string;
}

export default function EnvironmentalEffects({
  effect,
  intensity = 'medium',
  className = '',
}: EnvironmentalEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  // State to track prefers-reduced-motion dynamically
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // Listen to OS-level prefers-reduced-motion changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    setIsReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionChange);
    } else {
      // Fallback for older Safari/browsers
      mediaQuery.addListener(handleMotionChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMotionChange);
      } else {
        mediaQuery.removeListener(handleMotionChange);
      }
    };
  }, []);

  useEffect(() => {
    // Cancel any active animation frame
    if (animFrameId.current !== null) {
      cancelAnimationFrame(animFrameId.current);
      animFrameId.current = null;
    }

    if (effect === 'none') {
      return () => {
        if (animFrameId.current !== null) {
          cancelAnimationFrame(animFrameId.current);
          animFrameId.current = null;
        }
      };
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Dynamic particle count: reduced on mobile (<768px) and adjusted for high devicePixelRatio
    const isMobile = window.innerWidth < 768;
    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
    const countMultiplier = intensity === 'subtle' ? 0.6 : intensity === 'high' ? 1.4 : 1.0;

    let baseCount = isMobile ? 25 : 55;
    if (effect === 'fog' || effect === 'mist') {
      baseCount = isMobile ? 12 : 24;
    } else if (effect === 'clouds') {
      baseCount = isMobile ? 8 : 16;
    } else if (effect === 'dust') {
      baseCount = isMobile ? 35 : 70;
    }

    // High DPR mobile adjustment to prevent frame drops
    if (isMobile && dpr >= 2.5) {
      baseCount = Math.max(6, Math.floor(baseCount * 0.8));
    }

    const particleCount = Math.floor(baseCount * countMultiplier);

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      angle: number;
      rotationSpeed: number;
      opacity: number;
      color: string;
      layer: number;
      wobbleSpeed?: number;
      wobblePhase?: number;
      pulsePhase?: number;
    }

    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const layer = i % 3; // 0 = far/slow, 1 = mid, 2 = near/fast

      // 1. SPRING (Hoa dao / Canh hoa anh dao roi)
      if (effect === 'spring') {
        const petalColors = ['#FDA4AF', '#FB7185', '#F472B6', '#FBCFE8', '#FFF1F2'];
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: (layer + 1) * 2.5 + Math.random() * 3,
          speedX: 0.8 + layer * 0.4 + Math.random() * 1.0,
          speedY: 0.8 + layer * 0.5 + Math.random() * 0.6,
          angle: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.03,
          opacity: 0.45 + layer * 0.25,
          color: petalColors[Math.floor(Math.random() * petalColors.length)],
          layer,
          wobbleSpeed: 0.02 + Math.random() * 0.03,
          wobblePhase: Math.random() * Math.PI * 2,
        });
      }
      // 2. SUMMER (Ha: Nang vang ruc ro & Anh sang mat troi lap lanh)
      else if (effect === 'summer' || effect === 'sun') {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: (layer + 1) * 2.2 + Math.random() * 4,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: -0.4 - Math.random() * 0.6,
          angle: 0,
          rotationSpeed: 0,
          opacity: 0.25 + layer * 0.25,
          color: '#FDE68A',
          layer,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
      // 3. AUTUMN (Thu: La vang / La phong roi theo gio) & WIND
      else if (effect === 'autumn' || effect === 'leaves' || effect === 'wind') {
        const leafColors = ['#F95738', '#EA580C', '#F59E0B', '#D97706', '#92400E', '#B45309'];
        const isStrongWind = effect === 'wind';
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: (layer + 1) * 3.5 + Math.random() * 4,
          speedX: (isStrongWind ? 2.5 : 0.8) + layer * 0.6 + Math.random() * 1.2,
          speedY: 1.0 + layer * 0.7 + Math.random() * 0.8,
          angle: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * (isStrongWind ? 0.08 : 0.05),
          opacity: 0.4 + layer * 0.25,
          color: leafColors[Math.floor(Math.random() * leafColors.length)],
          layer,
          wobbleSpeed: 0.03 + Math.random() * 0.02,
          wobblePhase: Math.random() * Math.PI * 2,
        });
      }
      // 4. WINTER (Dong: Tuyet roi bong benh da tang)
      else if (effect === 'winter' || effect === 'snow') {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: (layer + 1) * 1.6 + Math.random() * 2.2,
          speedX: (Math.random() - 0.5) * 0.6 + layer * 0.15,
          speedY: 0.7 + layer * 0.7 + Math.random() * 0.5,
          angle: Math.random() * Math.PI * 2,
          rotationSpeed: 0.02,
          opacity: 0.35 + layer * 0.3,
          color: '#FFFFFF',
          layer,
          wobbleSpeed: 0.02 + Math.random() * 0.02,
          wobblePhase: Math.random() * Math.PI * 2,
        });
      }
      // 5. RAIN (Mua roi xuyen thau da tang)
      else if (effect === 'rain') {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: (layer + 1) * 8 + Math.random() * 10,
          speedX: -0.8 - layer * 0.4,
          speedY: 12 + layer * 6,
          angle: 0,
          rotationSpeed: 0,
          opacity: 0.2 + layer * 0.25,
          color: 'rgba(186, 230, 253, ',
          layer,
        });
      }
      // 6. FIREFLIES (Dom dom dem lua trai)
      else if (effect === 'fireflies') {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 2.2 + Math.random() * 2.8,
          speedX: (Math.random() - 0.5) * 0.7,
          speedY: (Math.random() - 0.5) * 0.7,
          angle: 0,
          rotationSpeed: 0,
          opacity: 0.3 + Math.random() * 0.6,
          color: '#A3E635',
          layer,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
      // 7. MIST (Suong mu bong benh)
      else if (effect === 'mist') {
        particles.push({
          x: Math.random() * width,
          y: height * 0.3 + Math.random() * (height * 0.7),
          size: 90 + Math.random() * 140,
          speedX: 0.25 + Math.random() * 0.3,
          speedY: 0,
          angle: 0,
          rotationSpeed: 0,
          opacity: 0.07 + Math.random() * 0.08,
          color: 'rgba(255, 255, 255, ',
          layer,
        });
      }
      // 8. FOG (Dai suong day troi ngang cham phu phan duoi khung)
      else if (effect === 'fog') {
        particles.push({
          x: Math.random() * width,
          y: height * 0.52 + Math.random() * (height * 0.48),
          size: (layer + 1) * 35 + 85 + Math.random() * 70,
          speedX: 0.15 + layer * 0.12 + Math.random() * 0.15,
          speedY: (Math.random() - 0.5) * 0.06,
          angle: 0,
          rotationSpeed: 0,
          opacity: 0.12 + layer * 0.06 + Math.random() * 0.06,
          color: 'rgba(226, 232, 240, ',
          layer,
          wobbleSpeed: 0.01 + Math.random() * 0.01,
          wobblePhase: Math.random() * Math.PI * 2,
        });
      }
      // 9. CLOUDS (Khoi may lon troi ngang rat cham o lop nen)
      else if (effect === 'clouds') {
        particles.push({
          x: Math.random() * width,
          y: height * 0.04 + Math.random() * (height * 0.42),
          size: (layer + 1) * 45 + 120 + Math.random() * 90,
          speedX: 0.08 + layer * 0.05 + Math.random() * 0.06,
          speedY: 0,
          angle: 0,
          rotationSpeed: 0,
          opacity: 0.06 + layer * 0.04 + Math.random() * 0.04,
          color: 'rgba(255, 255, 255, ',
          layer,
        });
      }
      // 10. DUST (Hat bui li ti lo lung, chuyen dong Brown nhe)
      else if (effect === 'dust') {
        const dustColors = ['#FEF08A', '#FDE68A', '#FCD34D', '#FFFFFF', '#E2E8F0'];
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: (layer + 1) * 0.6 + 0.8 + Math.random() * 1.2,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: (Math.random() - 0.5) * 0.3 - 0.1,
          angle: 0,
          rotationSpeed: 0,
          opacity: 0.25 + layer * 0.2,
          color: dustColors[Math.floor(Math.random() * dustColors.length)],
          layer,
          wobbleSpeed: 0.02 + Math.random() * 0.03,
          wobblePhase: Math.random() * Math.PI * 2,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    }

    const drawParticles = (isStatic: boolean, delta: number) => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        if (!isStatic) {
          if (p.wobblePhase !== undefined && p.wobbleSpeed !== undefined) {
            p.wobblePhase += p.wobbleSpeed;
            p.x += Math.sin(p.wobblePhase) * 1.2;
          }

          p.x += p.speedX;
          p.y += p.speedY;
          p.angle += p.rotationSpeed;

          // Dynamic wrap margin based on particle size (prevents pop-in/pop-out for large shapes)
          const margin = p.size > 50 ? p.size * 2.2 : 40;
          if (p.x < -margin) p.x = width + margin - 5;
          if (p.x > width + margin) p.x = -margin + 5;
          if (p.y < -margin) p.y = height + margin - 5;
          if (p.y > height + margin) p.y = -margin + 5;
        }

        // 1. SPRING (Canh hoa anh dao)
        if (effect === 'spring') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-p.size * 0.8, -p.size * 0.6, -p.size * 0.6, -p.size * 1.4, 0, -p.size * 1.8);
          ctx.bezierCurveTo(p.size * 0.6, -p.size * 1.4, p.size * 0.8, -p.size * 0.6, 0, 0);
          ctx.fill();
          ctx.restore();
        }
        // 2. SUMMER / SUN (Tia nang vang am)
        else if (effect === 'summer' || effect === 'sun') {
          if (!isStatic && p.pulsePhase !== undefined) p.pulsePhase += delta * 2.2;
          const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.pulsePhase || 0));
          ctx.save();
          ctx.globalAlpha = alpha;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
          grad.addColorStop(0, 'rgba(253, 230, 138, 0.95)');
          grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.4)');
          grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        // 3. AUTUMN / LEAVES / WIND (La phong / La vang 3D)
        else if (effect === 'autumn' || effect === 'leaves' || effect === 'wind') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;

          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.2, p.size * 0.6, p.angle, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        // 4. WINTER / SNOW (Bong tuyet tinh the)
        else if (effect === 'winter' || effect === 'snow') {
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        // 5. RAIN (Mua da tang)
        else if (effect === 'rain') {
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.strokeStyle = `${p.color} ${p.opacity})`;
          ctx.lineWidth = 0.8 + p.layer * 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 2, p.y + p.size);
          ctx.stroke();
          ctx.restore();
        }
        // 6. FIREFLIES (Dom dom)
        else if (effect === 'fireflies') {
          if (!isStatic && p.pulsePhase !== undefined) p.pulsePhase += delta * 2.5;
          const alpha = p.opacity * (0.3 + 0.7 * Math.abs(Math.sin(p.pulsePhase || 0)));
          ctx.save();
          ctx.globalAlpha = alpha;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
          grad.addColorStop(0, 'rgba(190, 242, 100, 0.9)');
          grad.addColorStop(1, 'rgba(190, 242, 100, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        // 7. MIST (Suong mu)
        else if (effect === 'mist') {
          ctx.save();
          ctx.globalAlpha = p.opacity;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        // 8. FOG (Dai suong day phu phan duoi)
        else if (effect === 'fog') {
          ctx.save();
          ctx.globalAlpha = p.opacity;
          const rx = p.size * 1.8;
          const ry = p.size * 0.7;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rx);
          grad.addColorStop(0, 'rgba(230, 238, 248, 0.55)');
          grad.addColorStop(0.5, 'rgba(215, 226, 238, 0.25)');
          grad.addColorStop(1, 'rgba(200, 215, 230, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, rx, ry, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        // 9. CLOUDS (Khoi may lon o nen troi)
        else if (effect === 'clouds') {
          ctx.save();
          ctx.globalAlpha = p.opacity;
          const rx = p.size * 2.0;
          const ry = p.size * 0.75;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rx);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
          grad.addColorStop(0.45, 'rgba(248, 250, 252, 0.3)');
          grad.addColorStop(1, 'rgba(241, 245, 249, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, rx, ry, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        // 10. DUST (Hat bui li ti chuyen dong Brown)
        else if (effect === 'dust') {
          if (!isStatic) {
            p.x += (Math.random() - 0.5) * 0.35;
            p.y += (Math.random() - 0.5) * 0.35;
            if (p.pulsePhase !== undefined) p.pulsePhase += delta * 1.8;
          }
          const alpha = p.opacity * (0.4 + 0.6 * Math.abs(Math.sin(p.pulsePhase || 0)));
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });
    };

    // Check reduced motion
    const prefersReduced = isReducedMotion || (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      if (prefersReduced) {
        drawParticles(true, 0);
      }
    };

    window.addEventListener('resize', handleResize);

    // Pause when scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // If reduced-motion is requested: render a single static frame and DO NOT start requestAnimationFrame
    if (prefersReduced) {
      drawParticles(true, 0);
      return () => {
        if (animFrameId.current !== null) {
          cancelAnimationFrame(animFrameId.current);
          animFrameId.current = null;
        }
        window.removeEventListener('resize', handleResize);
        observer.disconnect();
      };
    }

    let lastTime = performance.now();

    const render = (time: number) => {
      animFrameId.current = requestAnimationFrame(render);

      if (!isVisibleRef.current) return;

      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      drawParticles(false, delta);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animFrameId.current !== null) {
        cancelAnimationFrame(animFrameId.current);
        animFrameId.current = null;
      }
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [effect, intensity, isReducedMotion]);

  if (effect === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-15 w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
}
