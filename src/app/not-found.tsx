'use client';

import { motion } from 'framer-motion';
import { Shield, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F4F1EB] dark:bg-gray-950 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-center max-w-lg"
      >
        <div className="w-20 h-20 rounded-2xl bg-[#1B2A4A] flex items-center justify-center mx-auto mb-6">
          <Shield className="w-10 h-10 text-[#C5A55A]" />
        </div>
        <h1 className="text-6xl font-bold text-[#1B2A4A] dark:text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>404</h1>
        <h2 className="text-2xl font-bold text-[#1B2A4A] dark:text-white mb-4">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. 
          Let us help you find what you need.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a 
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white font-semibold rounded-lg transition-colors"
          >
            <Shield className="w-4 h-4" /> Go Home
          </a>
          <a 
            href="/#track-claim"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C5A55A] hover:bg-[#C5A55A]/90 text-white font-semibold rounded-lg transition-colors"
          >
            <Search className="w-4 h-4" /> Track My Claim
          </a>
        </div>
      </motion.div>
    </div>
  );
}
