'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, DollarSign, Globe2, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATS = [
  { icon: TrendingUp, value: 15, suffix: '+', label: 'Years Experience' },
  { icon: DollarSign, value: 62, prefix: '$', suffix: 'M+', label: 'Recovered' },
  { icon: Globe2, value: 50, suffix: '', label: 'States Covered' },
  { icon: CheckCircle2, value: 98, suffix: '%', label: 'Success Rate' },
];

function AnimatedNumber({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
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
  }, [target]);
  return <>{prefix}{count.toLocaleString()}{suffix}</>;
}

export default function HeroSection() {
  const handleClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/hero-bg.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/85 to-blue-900/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6 md:mb-8">
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="text-xs sm:text-sm font-medium text-amber-300">
                Trusted by 15,000+ Claimants Nationwide
              </span>
            </div>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Fighting for Every{' '}
            <span className="bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
              Dollar You Deserve
            </span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed mb-8 md:mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Expert guidance for mass tort claims. From Camp Lejeune to Roundup, we help you navigate the claims process, track your status, and maximize your compensation — 100% free.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold text-base px-8 py-6 rounded-xl shadow-lg shadow-amber-500/20"
              onClick={() => handleClick('#contact')}
            >
              Check My Eligibility
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 font-semibold text-base px-8 py-6 rounded-xl"
              onClick={() => handleClick('#track-claim')}
            >
              Track My Claim
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 md:mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            {['100% Free', 'HIPAA Compliant', '256-bit Encryption', '24/7 Support'].map((badge) => (
              <div key={badge} className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {badge}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Animated Stats Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-10 bg-white/10 backdrop-blur-xl border-t border-white/10"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {STATS.map((stat, i) => (
              <div key={i} className="py-5 md:py-6 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-0.5">
                  <AnimatedNumber target={stat.value} prefix={stat.prefix || ''} suffix={stat.suffix} />
                </div>
                <div className="text-xs sm:text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
