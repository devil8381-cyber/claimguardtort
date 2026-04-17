'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const TESTIMONIALS = [
  { name: 'Margaret H.', location: 'Austin, TX', text: "My claim was stuck in 'Correction Needed' for months. ClaimGuard helped me fix the paperwork within a week and resubmit. Now my claim is approved!", rating: 5, caseType: 'Camp Lejeune' },
  { name: 'Thomas J.', location: 'Columbus, OH', text: "I had no idea where my claim stood or what to do next. Their tracking system and support team made everything clear. Highly recommend their services.", rating: 5, caseType: 'Roundup' },
  { name: 'Linda R.', location: 'Phoenix, AZ', text: "After my initial claim was denied, I felt hopeless. They helped me appeal with stronger evidence and we won. I'm so grateful for their persistence.", rating: 5, caseType: 'Talc' },
  { name: 'Robert M.', location: 'Charlotte, NC', text: "The eligibility quiz gave me confidence to file. The team walked me through every single document. Six months later, I received my settlement check.", rating: 5, caseType: 'Hernia Mesh' },
  { name: 'Dorothy K.', location: 'Jacksonville, FL', text: "What impressed me most was the real-time tracking. I could see my claim moving through each stage. It gave me peace of mind during a stressful time.", rating: 5, caseType: 'Paraquat' },
  { name: 'James P.', location: 'Denver, CO', text: "They caught a critical error in my medical records submission that would have cost me my entire claim. Their attention to detail saved my case.", rating: 5, caseType: 'Camp Lejeune' },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number) => {
    setCurrent(index % TESTIMONIALS.length);
  }, []);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1 + TESTIMONIALS.length), [current, goTo]);

  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next]);

  const t = TESTIMONIALS[current];

  return (
    <section className="py-16 md:py-24 bg-slate-900 relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-slate-900" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold tracking-wide uppercase mb-4">
            Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
            Real stories from claimants who turned their situations around with our help.
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-10"
          >
            <Quote className="w-10 h-10 text-amber-400/30 mb-4" />
            <p className="text-base md:text-lg text-slate-200 leading-relaxed mb-6 italic">
              &ldquo;{t.text}&rdquo;
            </p>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="font-semibold text-white">{t.name}</p>
                <p className="text-sm text-slate-400">
                  {t.location} &middot; {t.caseType}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === current ? 'bg-amber-400 w-6' : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
