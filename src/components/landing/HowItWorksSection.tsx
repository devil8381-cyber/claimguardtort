'use client';

import { motion } from 'framer-motion';
import { Search, ClipboardCheck, Eye, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { step: 1, icon: Search, title: 'Check Eligibility', description: 'Answer a few quick questions to see if you qualify for a mass tort claim.' },
  { step: 2, icon: ClipboardCheck, title: 'Submit Your Claim', description: 'Provide your details and documents through our guided intake form.' },
  { step: 3, icon: Eye, title: 'We Review', description: 'Our experts review your case, verify documents, and build your claim strategy.' },
  { step: 4, icon: CheckCircle2, title: 'Get Results', description: 'Track your claim in real-time and receive the compensation you deserve.' },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold tracking-wide uppercase mb-4">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Four Simple Steps
          </h2>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            We&apos;ve streamlined the claims process so you can focus on what matters — getting fair compensation.
          </p>
        </div>

        {/* Steps - Vertical on mobile, horizontal on desktop */}
        <div className="relative">
          {/* Connector line - desktop only */}
          <div className="hidden lg:block absolute top-24 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-0.5 bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-500" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Number circle */}
                  <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-5">
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500 text-xs font-bold text-slate-900 flex items-center justify-center shadow">
                      {step.step}
                    </span>
                  </div>

                  {/* Vertical connector for mobile */}
                  {i < STEPS.length - 1 && (
                    <div className="lg:hidden absolute top-[68px] left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-blue-500/50 to-transparent" />
                  )}

                  <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
