'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { NAV_LINKS } from '@/lib/constants';

/* ═══════════════════════════════════════════════════════════════
   CUSTOM HOOKS
   ═══════════════════════════════════════════════════════════════ */

/** IntersectionObserver-based hook: returns ref + inView boolean, fires once */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.unobserve(el); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/** Animated counter: counts from 0 to target while inView is true */
function useCounter(target: number, inView: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, inView, duration]);
  return count;
}

/** Scroll spy: returns the currently active section id based on scroll position */
function useScrollSpy() {
  const [activeSection, setActiveSection] = useState('#hero');
  useEffect(() => {
    let ticking = false;
    const handler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const sections = NAV_LINKS.map(l => l.href.slice(1));
          for (let i = sections.length - 1; i >= 0; i--) {
            const el = document.getElementById(sections[i]);
            if (el && el.getBoundingClientRect().top <= 120) {
              setActiveSection(`#${sections[i]}`);
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return activeSection;
}

/** Countdown timer: returns { days, hours, minutes } remaining until targetDate */
function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      });
    };
    tick();
    // Tick every 30 seconds instead of every second — saves CPU cycles
    const interval = setInterval(tick, 30000);
    return () => clearInterval(interval);
  }, [targetDate]);
  return timeLeft;
}

/** Animated counter with easing: cubic ease-out from 0 to target */
function useAnimatedCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress >= 1) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [target, duration]);
  return count;
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN READER ANNOUNCEMENT UTILITY
   ═══════════════════════════════════════════════════════════════ */

/** Announce a message to screen readers via the live region */
function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const el = document.getElementById('sr-announcer');
  if (el) { el.textContent = ''; setTimeout(() => { el.textContent = message; }, 50); }
}

/* ═══════════════════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════════════════ */

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

/* ═══════════════════════════════════════════════════════════════
   SMALL REUSABLE COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/** Animated number that counts up to the given value on mount */
function CountUpNumber({ value }: { value: number }) {
  const count = useCounter(value, true, 2500);
  return <>{count.toLocaleString()}</>;
}

/* ═══════════════════════════════════════════════════════════════
   EXPORTS
   ═══════════════════════════════════════════════════════════════ */

export {
  // Hooks
  useInView,
  useCounter,
  useScrollSpy,
  useCountdown,
  useAnimatedCounter,

  // Utilities
  announce,

  // Animation Variants
  fadeInUp,
  staggerContainer,
  scaleIn,

  // Components
  CountUpNumber,
};
