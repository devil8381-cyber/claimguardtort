'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Building2, Leaf, Sparkles, Shield, Zap, Car, Baby, Pill, Users, Lock, Gamepad2, AlertTriangle, Activity, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const CASE_TYPES = [
  { title: 'Camp Lejeune', description: 'Water contamination claims for veterans and families stationed at Camp Lejeune between 1953-1987.', icon: Building2, deadline: 'Aug 2024 (extended)', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
  { title: 'Roundup (Glyphosate)', description: 'For farmers and homeowners who developed non-Hodgkin lymphoma after Roundup use.', icon: Leaf, deadline: 'Varies by state', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
  { title: 'Talc / Baby Powder', description: 'For individuals who used talc-based powder and were diagnosed with ovarian cancer.', icon: Sparkles, deadline: 'Ongoing', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
  { title: 'Hernia Mesh', description: 'For patients with hernia mesh implants that failed, caused infection, or required revision surgery.', icon: Shield, deadline: 'Varies', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
  { title: 'Paraquat', description: 'For agricultural workers who developed Parkinson\'s disease after Paraquat exposure.', icon: Zap, deadline: 'Ongoing', color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' },
  { title: 'Firefighting Foam (AFFF)', description: 'For military and firefighters exposed to PFAS chemicals who developed related conditions.', icon: Shield, deadline: 'Ongoing', color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' },
  { title: 'Rideshare Assault', description: 'For individuals who experienced assault or injury during Uber or Lyft trips.', icon: Car, deadline: 'Varies by state', color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' },
  { title: 'NEC Baby Formula', description: 'For families whose premature infants developed NEC after cow\'s milk-based formula.', icon: Baby, deadline: 'Ongoing', color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400' },
  { title: 'Depo Provera', description: 'For individuals who developed brain tumors after using Depo Provera contraceptive injection.', icon: Pill, deadline: 'Ongoing', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' },
  { title: 'Social Media', description: 'For families harmed by addictive social media algorithms causing mental health issues in teens.', icon: Users, deadline: 'Ongoing', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' },
  { title: 'IL Detention', description: 'For individuals who suffered harm or rights violations in immigration detention centers.', icon: Lock, deadline: 'Varies', color: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' },
  { title: 'Hair Relaxer', description: 'For individuals who developed uterine or ovarian cancer after chemical hair relaxer use.', icon: Heart, deadline: 'Ongoing', color: 'bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400' },
];

export default function CaseTypesSection() {
  const [search, setSearch] = useState('');

  const filtered = CASE_TYPES.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section id="case-types" className="py-16 md:py-24 bg-gray-50 dark:bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-wide uppercase mb-4">
            Case Types
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Claims We Handle
          </h2>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            We specialize in the most significant mass tort cases in the country.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search case types..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filtered.map((caseType, i) => {
            const Icon = caseType.icon;
            return (
              <motion.div
                key={caseType.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.05, 0.3) }}
              >
                <Card className="h-full border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800 group">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${caseType.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm md:text-base text-slate-900 dark:text-white mb-0.5">
                          {caseType.title}
                        </h3>
                        <Badge variant="outline" className="text-[10px] px-2 py-0 font-normal">
                          Deadline: {caseType.deadline}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {caseType.description}
                    </p>
                    <button
                      onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                      className="inline-flex text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mt-3 transition-colors"
                    >
                      Check Eligibility &rarr;
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-10">
            <p className="text-slate-500 dark:text-slate-400">No case types match your search.</p>
            <button
              onClick={() => setSearch('')}
              className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
