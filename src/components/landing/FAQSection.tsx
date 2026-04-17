'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';

const FAQ_DATA = [
  { q: 'What is a mass tort claim?', a: 'A mass tort claim is a civil action involving numerous plaintiffs who have suffered similar harm from the same product, device, or environmental exposure. Unlike class actions, each plaintiff in a mass tort has their own individual case, but the cases are grouped together for efficiency in pretrial proceedings.' },
  { q: 'How long does the claims process take?', a: 'The timeline varies significantly depending on the type of claim, the complexity of your case, and the specific settlement program. Generally, once all documentation is complete and submitted, you can expect the review process to take anywhere from 3 to 18 months.' },
  { q: 'What does "Correction Needed" mean?', a: '"Correction Needed" means the claims administrator has identified issues with your submitted documentation. This could include missing signatures, incomplete medical records, incorrect forms, or insufficient proof of exposure. This does not mean your claim is denied.' },
  { q: 'Can I appeal a denied claim?', a: 'Yes, in most cases you can appeal a denied claim. The appeals process typically involves submitting additional supporting evidence, correcting any identified deficiencies, and providing a written explanation of why you believe the denial was incorrect.' },
  { q: 'How do I know if I am eligible?', a: 'Eligibility varies by case type but generally requires proof of exposure or use of the product/device in question, documentation of resulting harm or injury, and meeting specific timeline requirements. Our free assessment can help you determine your potential eligibility.' },
  { q: 'What documents do I need to file a claim?', a: 'Required documents typically include: a completed claim form, proof of identity, proof of residence during the relevant time period, medical records documenting your condition, proof of product use or exposure, and any supporting documentation.' },
  { q: 'Is there a deadline to file?', a: 'Yes, most mass tort settlements have strict filing deadlines. These deadlines vary by case type and jurisdiction. Once a filing window closes, you may permanently lose your right to submit a claim.' },
  { q: 'Is this service really free?', a: 'Yes, ClaimGuard Tort is completely free. Every service we offer — from claim tracking and status checks to document correction, eligibility assessments, and personalized support — is provided at no cost to you, ever.' },
  { q: 'Is my information secure?', a: 'Absolutely. We use bank-level 256-bit encryption to protect all your personal and medical information. Our systems are HIPAA-compliant and undergo regular security audits. We never share your information without your explicit consent.' },
  { q: 'How do I check my claim status?', a: 'You can check your claim status anytime using our Track My Claim feature. Simply enter your tracking ID (e.g., CLM-2024-001) and you will instantly see your current status, progress, and any required actions.' },
];

export default function FAQSection() {
  const [search, setSearch] = useState('');

  const filtered = FAQ_DATA.filter(
    (item) =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section id="faq" className="py-16 md:py-24 bg-gray-50 dark:bg-slate-800/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold tracking-wide uppercase mb-4">
            FAQ
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400">
            Everything you need to know about mass tort claims and our services.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
          />
        </div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {filtered.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-500 dark:text-slate-400">No questions match your search.</p>
              <button
                onClick={() => setSearch('')}
                className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-3">
              {filtered.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-5 md:px-6 data-[state=open]:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left text-sm md:text-base font-medium text-slate-900 dark:text-white py-4 md:py-5 hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pb-4 md:pb-5">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </motion.div>
      </div>
    </section>
  );
}
