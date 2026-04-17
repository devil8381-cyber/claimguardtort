'use client';

import { motion } from 'framer-motion';
import { Shield, Users, Heart, Scale, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const TEAM = [
  { name: 'Sarah Mitchell', role: 'Founder & Lead Attorney', photo: '/team/sarah.jpg' },
  { name: 'David Chen', role: 'Senior Claims Analyst', photo: '/team/david.jpg' },
  { name: 'Jessica Rodriguez', role: 'Client Relations Director', photo: '/team/jessica.jpg' },
  { name: 'Michael Thompson', role: 'Document Specialist', photo: '/team/michael.jpg' },
];

const VALUES = [
  { icon: Shield, title: 'Integrity First', desc: 'We operate with complete transparency and always put our claimants\' interests first.' },
  { icon: Scale, title: 'Justice for All', desc: 'Every claimant deserves fair representation and equal access to compensation.' },
  { icon: Users, title: 'Personalized Care', desc: 'No cookie-cutter solutions. Every claim gets individualized attention.' },
  { icon: Heart, title: 'Proven Results', desc: 'With a 98% success rate and $62M+ recovered, our track record speaks for itself.' },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-wide uppercase mb-4">
            About Us
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Fighting for Justice Since 2009
          </h2>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            ClaimGuard Tort was founded with a single mission: to ensure every person affected by corporate negligence has access to fair compensation. Our dedicated team of legal professionals, claims analysts, and support specialists work tirelessly to guide you through every step of the process.
          </p>
        </div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 md:p-10 mb-12 md:mb-16"
        >
          <h3 className="text-lg md:text-xl font-semibold text-white mb-3">Our Mission</h3>
          <p className="text-blue-100 leading-relaxed text-base md:text-lg italic">
            &ldquo;To level the playing field between everyday people and powerful corporations by providing expert guidance, transparent communication, and unwavering advocacy throughout the mass tort claims process.&rdquo;
          </p>
        </motion.div>

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-12 md:mb-16">
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-5"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1.5">{v.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{v.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Team */}
        <div className="text-center mb-8">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Meet Our Team
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
            Dedicated professionals fighting for your rights.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {TEAM.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-gray-100 dark:bg-slate-800">
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <h4 className="font-semibold text-sm md:text-base text-slate-900 dark:text-white">{member.name}</h4>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
