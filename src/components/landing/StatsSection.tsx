'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { DollarSign, Users, TrendingUp, Globe2 } from 'lucide-react';

const STATS = [
  { icon: DollarSign, value: 62, prefix: '$', suffix: 'M+', label: 'Recovered', desc: 'In total settlements for our clients' },
  { icon: Users, value: 15000, suffix: '+', label: 'Claims Filed', desc: 'And counting — growing every month' },
  { icon: TrendingUp, value: 98, suffix: '%', label: 'Success Rate', desc: 'For clients who complete the full process' },
  { icon: Globe2, value: 50, suffix: '+', label: 'States', desc: 'Nationwide coverage across the US' },
];

function useCountUp(target: number, active: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, active, duration]);
  return count;
}

function StatCard({ stat, active }: { stat: typeof STATS[0]; active: boolean }) {
  const Icon = stat.icon;
  const count = useCountUp(stat.value, active);
  return (
    <div className="text-center p-4 md:p-6">
      <div className="w-12 h-12 md:w-14 md:h-14 mx-auto rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3 md:mb-4">
        <Icon className="w-6 h-6 md:w-7 md:h-7 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">
        {stat.prefix || ''}{count.toLocaleString()}{stat.suffix}
      </div>
      <div className="text-sm md:text-base font-medium text-slate-700 dark:text-slate-300 mb-1">
        {stat.label}
      </div>
      <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
        {stat.desc}
      </div>
    </div>
  );
}

export default function StatsSection() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); obs.unobserve(el); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-16 md:py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-wide uppercase mb-4">
            Proven Results
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Numbers That Speak for Themselves
          </h2>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            We&apos;ve helped thousands of claimants navigate complex mass tort processes with proven results.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {STATS.map((stat, i) => (
            <StatCard key={i} stat={stat} active={active} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
