'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-amber-400 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-blue-400 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
            Ready to File Your Claim?
          </h2>
          <p className="text-base md:text-lg text-blue-100 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            Don&apos;t navigate the complex mass tort process alone. Whether you need to track an existing claim, check your eligibility, or file for the first time — we&apos;re here to help.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold text-base px-8 py-6 rounded-xl shadow-lg"
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Free Assessment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 font-semibold text-base px-8 py-6 rounded-xl"
              onClick={() => document.querySelector('#track-claim')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Track My Claim
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-blue-200">
            <a href="tel:4849681529" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
              <Phone className="w-4 h-4" />
              (484) 968-1529
            </a>
            <a href="mailto:donotreply@claimguardtort.com" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
              donotreply@claimguardtort.com
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
