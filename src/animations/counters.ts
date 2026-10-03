import { gsap } from '@/lib/animation';

export function animateCount(
  targetEl: HTMLElement | null,
  endValue: number,
  options: {
    duration?: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    formatVND?: boolean;
    onComplete?: () => void;
  } = {}
) {
  if (!targetEl) return;

  const {
    duration = 1.8,
    prefix = '',
    suffix = '',
    decimals = 0,
    formatVND = false,
    onComplete,
  } = options;

  const obj = { val: 0 };

  return gsap.to(obj, {
    val: endValue,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      let formatted: string;
      if (formatVND) {
        formatted = Math.round(obj.val).toLocaleString('vi-VN');
      } else if (decimals > 0) {
        formatted = obj.val.toFixed(decimals);
      } else {
        formatted = Math.round(obj.val).toLocaleString('en-US');
      }
      targetEl.innerText = `${prefix}${formatted}${suffix}`;
    },
    onComplete,
  });
}
