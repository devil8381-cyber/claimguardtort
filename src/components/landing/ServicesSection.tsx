'use client';

import { motion } from 'framer-motion';
import { Search, FileSignature, UserCheck, HeadphonesIcon, Gavel, DollarSign, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const SERVICES = [
  { icon: Search, title: 'Claim Status Tracking', description: 'Instantly check where your claim stands with real-time tracking showing status, progress, and required actions.' },
  { icon: FileSignature, title: 'Document Correction', description: 'Missed signatures? Incorrect forms? Our experts identify and fix documentation issues quickly.' },
  { icon: UserCheck, title: 'Eligibility Review', description: 'Not sure if you qualify? We review your case against settlement criteria to confirm eligibility.' },
  { icon: HeadphonesIcon, title: 'Personalized Support', description: 'Get a dedicated support specialist who understands your case and guides you every step.' },
  { icon: Gavel, title: 'Legal Consultation', description: 'Connect with experienced attorneys who specialize in mass tort litigation and settlements.' },
  { icon: DollarSign, title: 'Settlement Maximization', description: 'We help ensure you receive the maximum compensation available under each settlement program.' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-24 bg-gray-50 dark:bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-wide uppercase mb-4">
            Our Services
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Comprehensive Claims Assistance
          </h2>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            From tracking to resolution, we provide end-to-end support for your mass tort claim.
          </p>
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div key={i} variants={itemVariants}>
                <Card className="group h-full border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-slate-800">
                  <CardContent className="p-5 md:p-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {service.description}
                    </p>
                    <button
                      onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                      className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      Learn More
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
