'use client';

import { useState, useEffect, useRef, useCallback, useMemo, type FormEvent, memo, type ReactNode } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import {
  Shield,
  Search,
  Users,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  Star,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileSignature,
  UserCheck,
  HeadphonesIcon,
  Scale,
  Award,
  Lock,
  Menu,
  ArrowRight,
  ArrowUp,
  Loader2,
  MessageCircle,
  X,
  Send,
  Download,
  FileText,
  ClipboardCheck,
  Gavel,
  Building2,
  CalendarDays,
  Sparkles,
  DollarSign,
  Timer,
  BadgeCheck,
  Upload,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  BookOpen,
  Target,
  Zap,
  ChevronLeft,
  Leaf,
  Sun,
  Moon,
  FileDown,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS & DATA
   ═══════════════════════════════════════════════════════════════ */

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Services', href: '#services' },
  { label: 'Eligibility Quiz', href: '#eligibility-quiz' },
  { label: 'Track Claim', href: '#track-claim' },
  { label: 'FAQ', href: '#faq' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const HERO_HEADLINES = [
  "Don't Let Your Claim Get Lost in the System",
  "Your Path to Fair Compensation Starts Here",
  "Expert Guidance for Mass Tort Claims",
  "We Fight for Every Dollar You Deserve",
];

const CASE_TYPES = [
  'Camp Lejeune', 'Roundup', 'Talc / Baby Powder', 'Hernia Mesh',
  'Paraquat', 'Firefighting Foam', 'Zantac', 'Hair Relaxer',
  'CPAP Machines', 'Social Media Lawsuits', 'Camp Lejeune', 'Roundup',
  'Talc / Baby Powder', 'Hernia Mesh', 'Paraquat', 'Firefighting Foam',
];

const MARQUEE_LOGOS = [
  'CNN', 'FOX News', 'BBC', 'Reuters', 'Bloomberg', 'Forbes', 'The Wall Street Journal',
  'USA Today', 'NBC News', 'ABC News', 'CBS News', 'The New York Times',
];

const HOW_IT_WORKS_STEPS = [
  { step: 1, icon: Search, title: 'Enter Your Claim ID', description: 'Provide your unique tracking ID or claim reference. Our system instantly retrieves your current claim status and history.', color: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' },
  { step: 2, icon: Eye, title: 'Review Status & Progress', description: 'See exactly where your claim stands in real-time. View detailed status updates, progress indicators, and an estimated timeline for resolution.', color: 'bg-gold/10 text-gold-dark dark:text-gold-light' },
  { step: 3, icon: ClipboardCheck, title: 'Identify Issues & Gaps', description: 'Our intelligent system flags missing documents, incomplete forms, or errors that could delay or derail your claim.', color: 'bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400' },
  { step: 4, icon: FileSignature, title: 'Correct & Resubmit', description: 'Get step-by-step guidance to fix documentation issues. Our team helps you correct errors and resubmit properly.', color: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' },
  { step: 5, icon: CheckCircle2, title: 'Get Your Compensation', description: 'With proper documentation and timely action, maximize your chances of a successful claim outcome and fair compensation.', color: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' },
];

const SERVICES_DATA = [
  { icon: Search, title: 'Claim Status Tracking', description: 'Instantly check where your claim stands with real-time tracking showing status, progress, and required actions.', detail: 'Our advanced tracking system integrates directly with claims administrators to provide you with the most up-to-date information. You can view your complete claim history, download reports, and receive push notifications when your status changes.' },
  { icon: FileSignature, title: 'Document Correction & Re-filing', description: 'Missed signatures? Incorrect forms? Our experts identify and fix documentation issues quickly.', detail: 'Our team of experienced paralegals reviews every document for accuracy and completeness. We handle everything from simple signature fixes to complex form re-filing, ensuring your claim moves forward without unnecessary delays.' },
  { icon: UserCheck, title: 'Eligibility Review & Verification', description: 'Not sure if you qualify? We review your case against settlement criteria to confirm eligibility.', detail: 'We conduct a thorough analysis of your case against all applicable settlement criteria. This includes reviewing exposure history, medical records, and timeline requirements to build the strongest possible case for your eligibility.' },
  { icon: HeadphonesIcon, title: 'Personalized Claimant Support', description: 'Get a dedicated support specialist who understands your case and guides you every step.', detail: 'Every claimant is paired with a dedicated specialist who serves as your single point of contact. They understand the nuances of your specific case type and provide personalized guidance throughout the entire claims process.' },
  { icon: Gavel, title: 'Legal Strategy Consultation', description: 'Connect with experienced attorneys who specialize in mass tort litigation and settlements.', detail: 'Our network of vetted mass tort attorneys provides strategic guidance on your case. Whether you need help understanding settlement offers, evaluating legal options, or preparing for proceedings, our legal team is here to help.' },
  { icon: DollarSign, title: 'Settlement Maximization', description: 'We help ensure you receive the maximum compensation available under each settlement program.', detail: 'Our settlement analysis team reviews each offer against historical data and comparable cases to ensure you receive fair compensation. We identify opportunities for additional claims and help you optimize your overall recovery.' },
];

const STATS_DATA = [
  { icon: Users, value: 1250, suffix: '+', label: 'Claims Assisted', progress: 92 },
  { icon: Award, value: 98, suffix: '%', label: 'Success Rate', progress: 98 },
  { icon: DollarSign, value: 47, suffix: 'M+', label: 'Recovered', prefix: '$', progress: 85 },
  { icon: CalendarDays, value: 15, suffix: '+', label: 'Years Experience', progress: 88 },
  { icon: HeadphonesIcon, value: 24, suffix: '/7', label: 'Dedicated Support', progress: 100 },
  { icon: Lock, value: 100, suffix: '%', label: 'Secure & Confidential', progress: 100 },
];

const TESTIMONIALS_DATA = [
  { name: 'Margaret H.', location: 'Austin, TX', text: "My claim was stuck in 'Correction Needed' for months. ClaimGuard Pro helped me fix the paperwork within a week and resubmit. Now my claim is approved!", rating: 5, caseType: 'Camp Lejeune', color: 'bg-blue-500' },
  { name: 'Thomas J.', location: 'Columbus, OH', text: "I had no idea where my claim stood or what to do next. Their tracking system and support team made everything clear. Highly recommend their services.", rating: 5, caseType: 'Roundup', color: 'bg-emerald-500' },
  { name: 'Linda R.', location: 'Phoenix, AZ', text: "After my initial claim was denied, I felt hopeless. ClaimGuard Pro helped me appeal with stronger evidence and we won. I'm so grateful for their persistence.", rating: 5, caseType: 'Talc', color: 'bg-purple-500' },
  { name: 'Robert M.', location: 'Charlotte, NC', text: "The eligibility quiz gave me confidence to file. The team walked me through every single document. Six months later, I received my settlement check.", rating: 5, caseType: 'Hernia Mesh', color: 'bg-amber-500' },
  { name: 'Dorothy K.', location: 'Jacksonville, FL', text: "What impressed me most was the real-time tracking. I could see my claim moving through each stage. It gave me peace of mind during a stressful time.", rating: 5, caseType: 'Paraquat', color: 'bg-rose-500' },
  { name: 'James P.', location: 'Denver, CO', text: "They caught a critical error in my medical records submission that would have cost me my entire claim. Their attention to detail saved my case.", rating: 5, caseType: 'Camp Lejeune', color: 'bg-teal-500' },
];

const FAQ_DATA = [
  { q: 'What is a mass tort claim?', a: 'A mass tort claim is a civil action involving numerous plaintiffs who have suffered similar harm from the same product, device, or environmental exposure. Unlike class actions, each plaintiff in a mass tort has their own individual case, but the cases are grouped together for efficiency in pretrial proceedings.' },
  { q: 'How long does the claims process take?', a: 'The timeline varies significantly depending on the type of claim, the complexity of your case, and the specific settlement program. Generally, once all documentation is complete and submitted, you can expect the review process to take anywhere from 3 to 18 months.' },
  { q: 'What does "Correction Needed" mean?', a: '"Correction Needed" means the claims administrator has identified issues with your submitted documentation. This could include missing signatures, incomplete medical records, incorrect forms, or insufficient proof of exposure. This does not mean your claim is denied.' },
  { q: 'Can I appeal a denied claim?', a: 'Yes, in most cases you can appeal a denied claim. The appeals process typically involves submitting additional supporting evidence, correcting any identified deficiencies, and providing a written explanation of why you believe the denial was incorrect.' },
  { q: 'How do I know if I am eligible?', a: 'Eligibility varies by case type but generally requires proof of exposure or use of the product/device in question, documentation of resulting harm or injury, and meeting specific timeline requirements. Our free Eligibility Quiz can help you assess your potential eligibility.' },
  { q: 'What documents do I need to file a claim?', a: 'Required documents typically include: a completed claim form, proof of identity, proof of residence during the relevant time period, medical records documenting your condition, proof of product use or exposure, and any supporting documentation.' },
  { q: 'Is there a deadline to file?', a: 'Yes, most mass tort settlements have strict filing deadlines. These deadlines vary by case type and jurisdiction. Once a filing window closes, you may permanently lose your right to submit a claim.' },
  { q: 'How much does ClaimGuard Pro charge?', a: 'ClaimGuard Pro provides initial claim tracking, status checks, and eligibility assessments completely free of charge. For document correction and personalized support, we work on a contingency basis — you only pay if your claim is successful.' },
  { q: 'Is my information secure?', a: 'Absolutely. We use bank-level 256-bit encryption to protect all your personal and medical information. Our systems are HIPAA-compliant and undergo regular security audits. We never share your information without your explicit consent.' },
  { q: 'How do I check my claim status?', a: 'You can check your claim status anytime using our Track My Claim feature. Simply enter your tracking ID (e.g., CLM-2024-001) and you will instantly see your current status, progress, claim history, and any required actions.' },
];

const CASE_STUDIES = [
  { name: 'Margaret H.', caseType: 'Camp Lejeune Water Contamination', badge: 'bg-blue-500', challenge: 'Margaret was stationed at Camp Lejeune for 3 years and developed a rare form of kidney disease. Her initial claim was denied due to incomplete medical records linking her condition to the contaminated water supply.', solution: 'Our team worked with Margaret to obtain comprehensive medical opinions, gathered additional service records, and built a detailed timeline of her exposure. We identified key military health records that had been overlooked.', outcome: "After a 6-month appeals process, Margaret's claim was approved with a settlement of $185,000. She received her payment within 90 days of approval.", compensation: '$185,000', beforeStatus: 'Denied', afterStatus: 'Approved' },
  { name: 'Thomas J.', caseType: 'Roundup (Glyphosate) Exposure', badge: 'bg-emerald-500', challenge: 'Thomas, a farmer for 25 years, developed non-Hodgkin lymphoma after decades of Roundup use. His claim was stuck in "Correction Needed" for 8 months due to missing purchase records.', solution: 'We helped Thomas compile decades of agricultural supply invoices, secured supporting medical opinions from two oncologists, and corrected multiple form errors in his original submission.', outcome: "Thomas's corrected claim was approved, and he received a settlement of $340,000.", compensation: '$340,000', beforeStatus: 'Correction Needed', afterStatus: 'Approved' },
  { name: 'Dorothy K.', caseType: 'Talcum Powder / Ovarian Cancer', badge: 'bg-purple-500', challenge: 'Dorothy used talcum powder products for over 40 years before being diagnosed with ovarian cancer. Her claim was pending for 14 months with no updates.', solution: "Our team escalated Dorothy's case with the claims administrator, identified the processing bottleneck (a missing pathology report), and facilitated expedited review of her complete medical file.", outcome: "Dorothy's claim was moved to active review within 2 weeks and was approved 3 months later with a settlement of $275,000.", compensation: '$275,000', beforeStatus: 'Pending (14 months)', afterStatus: 'Approved' },
];

const TEAM_MEMBERS = [
  { name: 'Sarah Mitchell', role: 'Founder & Lead Attorney', color: 'bg-blue-500', initials: 'SM', bio: 'Former DOJ attorney with 20+ years of mass tort litigation experience.' },
  { name: 'David Chen', role: 'Senior Claims Analyst', color: 'bg-emerald-500', initials: 'DC', bio: 'Expert in claims processing and document analysis. Has reviewed over 5,000 mass tort claims.' },
  { name: 'Jessica Rodriguez', role: 'Client Relations Director', color: 'bg-purple-500', initials: 'JR', bio: 'Passionate advocate for claimants\' rights. Manages our 24/7 support team.' },
  { name: 'Michael Thompson', role: 'Document Specialist', color: 'bg-amber-500', initials: 'MT', bio: 'Detail-oriented paralegal specializing in document correction. 99.2% correction success rate.' },
  { name: 'Emily Watson', role: 'Legal Strategy Advisor', color: 'bg-rose-500', initials: 'EW', bio: 'Skilled attorney specializing in settlement negotiation. Recovered over $15M for clients.' },
  { name: 'Marcus Johnson', role: 'Technology Director', color: 'bg-teal-500', initials: 'MJ', bio: 'Built our proprietary claim tracking system. 99.99% uptime.' },
];

const PIPELINE_STAGES = ['Submitted', 'Validated', 'Under Review', 'Decision', 'Completed'];

const DOC_CHECKLIST = [
  { name: 'Proof of Residence', icon: Building2 },
  { name: 'Medical Records', icon: FileText },
  { name: 'Claim Form', icon: ClipboardCheck },
  { name: 'Authorization Letter', icon: FileSignature },
  { name: 'ID Verification', icon: BadgeCheck },
];

const CASE_TYPE_DETAILS = [
  { title: 'Camp Lejeune Water Contamination', description: 'For individuals stationed at or living near Camp Lejeune between 1953-1987 who developed health conditions due to contaminated water.', icon: Building2, color: 'bg-blue-500', deadline: 'Aug 2024 (extended)', statuses: ['Pending', 'Under Review', 'Approved'], detail: 'The Camp Lejeune Justice Act provides compensation for veterans, their families, and civilians exposed to contaminated water. Qualifying conditions include kidney cancer, liver cancer, non-Hodgkin lymphoma, leukemia, and multiple myeloma. Our team has successfully navigated complex military record requirements.' },
  { title: 'Roundup (Glyphosate)', description: 'For farmers, agricultural workers, and homeowners who developed non-Hodgkin lymphoma or related cancers after using Roundup weed killer.', icon: Leaf, color: 'bg-emerald-500', deadline: 'Varies by state', statuses: ['Pending', 'Approved', 'Denied'], detail: 'Monsanto/Bayer has agreed to multi-billion dollar settlements for Roundup-related cancers. We help gather purchase records, exposure documentation, and medical evidence to build strong claims.' },
  { title: 'Talcum Powder / Ovarian Cancer', description: 'For individuals who used talc-based powder products regularly and were subsequently diagnosed with ovarian cancer or mesothelioma.', icon: Sparkles, color: 'bg-purple-500', deadline: 'Ongoing', statuses: ['Under Review', 'Approved'], detail: 'Multiple juries have found talc manufacturers liable for failing to warn consumers. Claims focus on asbestos contamination in talc products used over decades.' },
  { title: 'Hernia Mesh', description: 'For patients who received hernia mesh implants that failed, caused infection, or required additional surgery due to device defects.', icon: Shield, color: 'bg-amber-500', deadline: 'Varies by manufacturer', statuses: ['Pending', 'Correction Needed', 'Approved'], detail: 'Defective hernia mesh devices have caused chronic pain, infection, adhesion, and organ perforation. We help document the link between device failure and subsequent medical complications.' },
  { title: 'Paraquat Herbicide', description: "For agricultural workers and farmers who developed Parkinson's disease or related conditions after exposure to Paraquat herbicide.", icon: Zap, color: 'bg-rose-500', deadline: 'Ongoing', statuses: ['Under Review', 'Approved', 'Denied'], detail: "Paraquat is a restricted-use herbicide linked to increased Parkinson's disease risk. Licensed applicators and farmworkers with documented exposure may qualify." },
  { title: 'Firefighting Foam (AFFF)', description: 'For military personnel, firefighters, and airport workers exposed to PFAS-containing firefighting foam who developed related health conditions.', icon: Target, color: 'bg-teal-500', deadline: 'Ongoing', statuses: ['Pending', 'Under Review'], detail: 'AFFF foam contains PFAS "forever chemicals" linked to several cancers and thyroid disease. Military bases, airports, and fire departments are primary exposure sites.' },
];

const COMPARISON_DATA = [
  { feature: 'Real-Time Claim Tracking', us: { label: 'Instant tracking with pipeline visualization', has: true }, others: { label: 'Manual status checks via phone', has: false } },
  { feature: 'Document Correction Support', us: { label: 'Expert review + correction + re-filing', has: true }, others: { label: 'Self-service or no support', has: false } },
  { feature: 'Eligibility Assessment', us: { label: 'Free interactive quiz + expert review', has: true }, others: { label: 'Basic checklist only', has: false } },
  { feature: 'Dedicated Specialist', us: { label: 'Assigned claim specialist for your case', has: true }, others: { label: 'General support line', has: false } },
  { feature: 'Cost', us: { label: 'Free tracking + contingency for services', has: true }, others: { label: 'Hourly fees or retainers', has: false } },
  { feature: 'Settlement Maximization', us: { label: 'Data-driven analysis to maximize recovery', has: true }, others: { label: 'Accept first offer as-is', has: false } },
  { feature: '24/7 Availability', us: { label: 'Round-the-clock support and chat', has: true }, others: { label: 'Business hours only', has: false } },
  { feature: 'Data Security', us: { label: '256-bit encryption, HIPAA compliant', has: true }, others: { label: 'Standard security', has: false } },
];

const PRIVACY_POLICY_TEXT = `Privacy Policy for ClaimGuard Pro

Last Updated: January 2025

1. Information We Collect

We collect information you provide directly to us, including:
- Personal identification information (name, email address, phone number)
- Claim-related information (tracking IDs, claim types, statuses)
- Documents you upload (file names and sizes)
- Communication preferences (newsletter subscriptions, contact method choices)

We also automatically collect certain technical information when you visit our website, including your IP address, browser type, device type, pages visited, and time spent on pages.

2. How We Use Your Information

We use the information we collect to:
- Provide and improve our claim tracking and assistance services
- Communicate with you about your claim status and updates
- Send newsletter communications (only if you have opted in)
- Respond to your inquiries and provide customer support
- Analyze website usage to improve our services
- Comply with legal obligations

3. Information Sharing

We do not sell, trade, or rent your personal information to third parties. We may share your information with:
- Claims administrators (only with your explicit consent)
- Legal professionals in our network (to assist with your claim)
- Service providers who help us operate our website and services
- Law enforcement (when required by law or to protect our legal rights)

4. Data Security

We implement industry-standard security measures to protect your personal information, including:
- 256-bit SSL/TLS encryption for all data in transit
- Encrypted storage for sensitive documents
- Access controls limiting data access to authorized personnel
- Regular security audits and vulnerability assessments
- SOC 2 Type II certified data centers

5. Cookies and Tracking

We use cookies and similar tracking technologies to:
- Remember your preferences and settings
- Analyze website traffic and usage patterns
- Provide functionality for our interactive features
- You can control cookie settings through your browser preferences.

6. Your Rights

You have the right to:
- Access the personal information we hold about you
- Request correction of inaccurate information
- Request deletion of your personal information
- Opt out of marketing communications
- Request a copy of your data in a portable format

To exercise any of these rights, please contact us at privacy@claimguardpro.com.

7. Contact

If you have questions about this Privacy Policy, please contact us at:
Email: privacy@claimguardpro.com
Phone: (800) 555-0199
Address: 123 Justice Avenue, Washington, DC 20001`;

const TERMS_OF_SERVICE_TEXT = `Terms of Service for ClaimGuard Pro

Last Updated: January 2025

1. Services

ClaimGuard Pro provides mass tort claim assistance services including claim tracking, document correction support, eligibility assessment, and referral to qualified legal professionals. Our services are designed to assist claimants in navigating the complex mass tort claims process.

2. Important Disclaimers

ClaimGuard Pro is NOT a law firm and does not provide legal advice. The information on this website is for general informational purposes only. Nothing on this website should be construed as legal advice or create an attorney-client relationship.

Prior results described on this website do not guarantee a similar outcome for any individual case. Case results depend on many factors unique to each claim.

3. Limitations of Liability

To the maximum extent permitted by law, ClaimGuard Pro shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services or website. Our total liability shall not exceed the fees you have paid to us in the twelve months preceding the claim.

4. User Responsibilities

You agree to:
- Provide accurate and truthful information
- Not misuse our services or website
- Not attempt to gain unauthorized access to our systems
- Comply with all applicable laws and regulations
- Maintain the confidentiality of your account credentials

5. Indemnification

You agree to indemnify and hold harmless ClaimGuard Pro, its officers, directors, employees, and agents from and against any claims, damages, losses, or expenses arising from your use of our services or your violation of these Terms.

6. Intellectual Property

All content on this website, including text, graphics, logos, and software, is the property of ClaimGuard Pro and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.

7. Governing Law

These Terms shall be governed by and construed in accordance with the laws of the District of Columbia, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of the District of Columbia.

8. Modifications

We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our website. Your continued use of our services after such changes constitutes acceptance of the modified Terms.

9. Contact

For questions about these Terms, contact us at:
Email: legal@claimguardpro.com
Phone: (800) 555-0199
Address: 123 Justice Avenue, Washington, DC 20001`;

const DISCLAIMER_TEXT = `Legal Disclaimer

ClaimGuard Pro is not a law firm. We are a claims assistance service that connects claimants with qualified legal professionals and provides administrative support throughout the mass tort claims process.

The information provided on this website is for general informational purposes only and does not constitute legal advice, legal opinion, or any other form of professional advice. You should not act upon any information provided without first seeking qualified legal counsel from a licensed attorney in your jurisdiction.

Testimonials and case results displayed on this website reflect the experiences of individual clients. Every case is different, and past results do not guarantee or predict a similar outcome in any future case. The testimonials displayed are given verbatim except for correction of grammatical or typing errors. Some testimonials may have been shortened for brevity.

Attorney Advertising. Prior results do not guarantee a similar outcome. The information on this site is not legal advice. Your access to and use of this site is subject to additional Terms and Conditions.

ClaimGuard Pro makes no representations or warranties, express or implied, regarding the accuracy, completeness, or reliability of any information on this website. Any reliance you place on such information is strictly at your own risk.

By using this website, you acknowledge that you have read, understood, and agree to this disclaimer.`;

/* ═══════════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════════ */

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.unobserve(el); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useCounter(target: number, inView: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, inView, duration]);
  return count;
}

function useScrollSpy() {
  const [activeSection, setActiveSection] = useState('#hero');
  useEffect(() => {
    let ticking = false;
    const handler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const sections = NAV_LINKS.map(l => l.href.slice(1));
          for (let i = sections.length - 1; i >= 0; i--) {
            const el = document.getElementById(sections[i]);
            if (el && el.getBoundingClientRect().top <= 120) {
              setActiveSection(`#${sections[i]}`);
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return activeSection;
}

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);
  return timeLeft;
}

/* ═══════════════════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════════════════ */

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

/* ═══════════════════════════════════════════════════════════════
   LAZY SECTION WRAPPER
   ═══════════════════════════════════════════════════════════════ */

function LazySection({ children, type = 'cards' }: { children: ReactNode; type?: 'cards' | 'form' | 'text' | 'stats' }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); obs.unobserve(el); }
    }, { rootMargin: '300px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (!isVisible) {
    return (
      <div ref={ref} className="py-12">
        {type === 'cards' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl p-6 bg-gray-100 dark:bg-gray-800/50 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        )}
        {type === 'form' && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        )}
        {type === 'text' && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <Skeleton className="h-8 w-2/3 mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
            <Skeleton className="h-4 w-4/5 mx-auto" />
          </div>
        )}
        {type === 'stats' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl p-6 bg-gray-100 dark:bg-gray-800/50 text-center space-y-3">
                  <Skeleton className="h-8 w-16 mx-auto" />
                  <Skeleton className="h-3 w-24 mx-auto" />
                  <Skeleton className="h-1.5 w-full" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: NAVBAR
   ═══════════════════════════════════════════════════════════════ */

const Navbar = memo(function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [countdownDismissed, setCountdownDismissed] = useState(false);
  const activeSection = useScrollSpy();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { const id = requestAnimationFrame(() => setMounted(true)); return () => cancelAnimationFrame(id); }, []);
  useEffect(() => {
    const id = requestAnimationFrame(() => setCountdownDismissed(sessionStorage.getItem('claimguard-countdown-dismissed') === 'true'));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handler = () => {
      if (!ticking) {
        requestAnimationFrame(() => { setScrolled(window.scrollY > 20); ticking = false; });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleClick = useCallback((href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const navbarTop = scrolled || countdownDismissed ? 'top-0' : 'top-10';

  return (
    <nav className={`fixed left-0 right-0 z-50 transition-all duration-300 ${navbarTop} ${scrolled ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-lg border-b border-gold/20 dark:border-gray-700' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button onClick={() => handleClick('#hero')} className="flex items-center gap-2 group" aria-label="Go to homepage">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-navy flex items-center justify-center group-hover:bg-navy-light transition-colors">
              <Shield className="w-5 h-5 md:w-6 md:h-6 text-gold" />
            </div>
            <span className={`text-lg md:text-xl font-bold leading-tight tracking-tight transition-colors ${scrolled ? 'text-navy dark:text-white' : 'text-white'}`}>
              Claim<span className="text-gold">Guard</span> Pro
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <button
                  key={link.href}
                  onClick={() => handleClick(link.href)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${isActive ? (scrolled ? 'text-gold bg-gold/10 dark:bg-gold/20' : 'text-gold bg-white/10') : (scrolled ? 'text-navy dark:text-gray-300 hover:bg-gold/10 hover:text-gold' : 'text-white/90 hover:bg-white/10 hover:text-gold')}`}
                >
                  {link.label}
                </button>
              );
            })}
            <Button onClick={() => handleClick('#contact')} size="sm" className="ml-2 bg-gold hover:bg-gold-dark text-white font-semibold animate-pulse-glow">
              Free Consultation
            </Button>
            {mounted && (
              <motion.button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="ml-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  {theme === 'dark' ? (
                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Sun className="w-4 h-4 text-gold" />
                    </motion.div>
                  ) : (
                    <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Moon className="w-4 h-4 text-navy" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg transition-colors"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-gold" /> : <Moon className="w-5 h-5 text-white" />}
              </button>
            )}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className={`p-2 rounded-lg transition-colors ${scrolled ? 'text-navy dark:text-white hover:bg-navy/5 dark:hover:bg-gray-800' : 'text-white hover:bg-white/10'}`} aria-label="Open navigation menu">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white dark:bg-gray-950 p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center">
                        <Shield className="w-4 h-4 text-gold" />
                      </div>
                      <span className="text-lg font-bold text-navy dark:text-white">Claim<span className="text-gold">Guard</span> Pro</span>
                    </div>
                  </div>
                  <ScrollArea className="flex-1 py-4">
                    {NAV_LINKS.map((link) => (
                      <button key={link.href} onClick={() => handleClick(link.href)} className="w-full text-left px-6 py-3 text-base font-medium text-navy dark:text-gray-200 hover:bg-navy/5 dark:hover:bg-gray-800 hover:text-gold transition-colors flex items-center justify-between">
                        {link.label}
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </button>
                    ))}
                  </ScrollArea>
                  <div className="p-4 border-t border-border">
                    <Button onClick={() => handleClick('#contact')} className="w-full bg-gold hover:bg-gold-dark text-white font-semibold">Free Consultation</Button>
                    <a href="tel:8005550199" className="flex items-center justify-center gap-2 mt-3 text-sm text-navy dark:text-gray-300 font-medium">
                      <Phone className="w-4 h-4 text-gold" />(800) 555-0199
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
});

/* ═══════════════════════════════════════════════════════════════
   SECTION: COUNTDOWN DEADLINE BANNER
   ═══════════════════════════════════════════════════════════════ */

function CountdownBanner() {
  const deadline = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 87);
    return d;
  }, []);
  const [dismissed, setDismissed] = useState(false);
  const { days, hours, minutes, seconds } = useCountdown(deadline);

  useEffect(() => {
    const id = requestAnimationFrame(() => setDismissed(sessionStorage.getItem('claimguard-countdown-dismissed') === 'true'));
    return () => cancelAnimationFrame(id);
  }, []);

  const dismiss = useCallback(() => {
    sessionStorage.setItem('claimguard-countdown-dismissed', 'true');
    setDismissed(true);
  }, []);

  const scrollToContact = useCallback(() => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-gold-dark via-gold to-gold-light text-white py-2"
          role="timer"
          aria-label="Filing deadline countdown"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-3 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 hidden sm:block" aria-hidden="true" />
            <span className="font-medium hidden sm:inline">Important: Camp Lejeune filing deadline approaching!</span>
            <span className="font-medium sm:hidden">Camp Lejeune deadline!</span>
            <span className="countdown-timer font-bold flex items-center gap-1" aria-label={`${days} days ${hours} hours ${minutes} minutes ${seconds} seconds remaining`}>
              <span className="bg-navy/20 px-1.5 py-0.5 rounded text-xs">{days}d</span>
              <span className="bg-navy/20 px-1.5 py-0.5 rounded text-xs">{hours}h</span>
              <span className="bg-navy/20 px-1.5 py-0.5 rounded text-xs">{minutes}m</span>
              <span className="bg-navy/20 px-1.5 py-0.5 rounded text-xs">{seconds}s</span>
            </span>
            <button onClick={scrollToContact} className="font-bold underline hover:no-underline ml-1 whitespace-nowrap">Get Help Now →</button>
            <button onClick={dismiss} className="ml-2 p-0.5 hover:bg-white/20 rounded transition-colors" aria-label="Dismiss deadline banner">
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: HERO
   ═══════════════════════════════════════════════════════════════ */

const PARTICLE_POSITIONS = Array.from({ length: 20 }, (_, i) => ({
  left: `${((i * 37 + 13) % 97)}%`,
  top: `${((i * 53 + 7) % 95)}%`,
  delay: `${(i * 0.7) % 8}s`,
  duration: `${6 + (i % 7)}s`,
}));

function HeroSection() {
  const [headlineIdx, setHeadlineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    const current = HERO_HEADLINES[headlineIdx];
    let timeout: ReturnType<typeof setTimeout>;
    if (!isDeleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), 50);
    } else if (!isDeleting && charIdx === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), 30);
    } else if (isDeleting && charIdx === 0) {
      const nextIdx = (headlineIdx + 1) % HERO_HEADLINES.length;
      const id = requestAnimationFrame(() => { setIsDeleting(false); setHeadlineIdx(nextIdx); });
      return () => { clearTimeout(timeout); cancelAnimationFrame(id); };
    }
    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, headlineIdx]);

  const displayText = HERO_HEADLINES[headlineIdx].slice(0, charIdx);

  const scrollTo = useCallback((id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <img src="/hero-bg.png" alt="" className="w-full h-full object-cover" aria-hidden="true" />
        <div className="hero-gradient absolute inset-0" />
      </motion.div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {PARTICLE_POSITIONS.map((pos, i) => (
          <div key={i} className="particle-dot" style={{ left: pos.left, top: pos.top, animationDelay: pos.delay, animationDuration: pos.duration }} />
        ))}
      </div>

      <div className="absolute top-20 right-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-navy-light/20 rounded-full blur-3xl" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="max-w-3xl">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <Badge className="mb-6 px-4 py-1.5 bg-gold/20 text-gold border-gold/30 text-sm font-medium backdrop-blur-sm">
              <Shield className="w-3.5 h-3.5 mr-1.5" />
              Trusted by 1,250+ Claimants Nationwide
            </Badge>
          </motion.div>

          <motion.h1 initial="hidden" animate="visible" variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { delay: 0.15 } } }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            <span className="typewriter-cursor">{displayText}</span>
          </motion.h1>

          <motion.p initial="hidden" animate="visible" variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { delay: 0.25 } } }} className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed">
            Mass tort claims can be overwhelming. ClaimGuard Pro guides you through every step — from tracking your claim status to correcting paperwork errors — so you get the compensation you deserve.
          </motion.p>

          <motion.div initial="hidden" animate="visible" variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { delay: 0.35 } } }} className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => scrollTo('#track-claim')} size="lg" className="bg-gold hover:bg-gold-dark text-white font-semibold text-base px-8 py-6 shadow-xl shadow-gold/20 transition-all hover:shadow-2xl hover:shadow-gold/30 hover:scale-[1.02]">
              <Search className="w-5 h-5 mr-2" />Track My Claim
            </Button>
            <Button onClick={() => scrollTo('#eligibility-quiz')} size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold text-base px-8 py-6 backdrop-blur-sm transition-all hover:scale-[1.02]">
              <Target className="w-5 h-5 mr-2" />Check Eligibility
            </Button>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { delay: 0.5 } } }} className="mt-12 flex flex-wrap gap-6 text-white/60 text-sm">
            <div className="flex items-center gap-2"><Lock className="w-4 h-4 text-gold" /><span>Secure & Confidential</span></div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold" /><span>No Upfront Fees</span></div>
            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gold" /><span>24/7 Support Available</span></div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-20 left-0 right-0 z-10 overflow-hidden" aria-hidden="true">
        <div className="bg-black/20 backdrop-blur-sm py-3">
          <div className="flex animate-badge-scroll whitespace-nowrap">
            {[...CASE_TYPES, ...CASE_TYPES].map((ct, i) => (
              <span key={i} className="mx-3 px-4 py-1.5 rounded-full bg-white/10 text-white/70 text-xs font-medium border border-white/10">
                {ct}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-gold rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: TRUSTED BY / LOGO MARQUEE
   ═══════════════════════════════════════════════════════════════ */

const TrustedBySection = memo(function TrustedBySection() {
  return (
    <section className="py-10 bg-[#F4F1EB] dark:bg-gray-950 border-y border-gold/10 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">As Featured In</p>
        <div className="relative overflow-hidden" aria-hidden="true">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#F4F1EB] dark:from-gray-950 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#F4F1EB] dark:from-gray-950 to-transparent z-10" />
          <div className="flex animate-marquee">
            {[...MARQUEE_LOGOS, ...MARQUEE_LOGOS].map((logo, i) => (
              <div key={i} className="mx-8 flex-shrink-0 flex items-center justify-center">
                <span className="text-xl font-bold text-navy/30 dark:text-gray-600 hover:text-navy/60 dark:hover:text-gray-400 transition-colors whitespace-nowrap tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>{logo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

/* ═══════════════════════════════════════════════════════════════
   SECTION: HOW IT WORKS
   ═══════════════════════════════════════════════════════════════ */

function HowItWorksSection() {
  const { ref, inView } = useInView(0.1);
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white dark:bg-gray-950">
      <LazySection type="cards">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-16">
            <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Five Simple Steps to <span className="gradient-text-gold">Resolve Your Claim</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We&apos;ve streamlined the claims assistance process so you can focus on what matters — getting the compensation you deserve.
            </p>
          </motion.div>

          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {HOW_IT_WORKS_STEPS.map((item, idx) => (
              <motion.div key={item.step} variants={fadeInUp} className="relative group">
                {idx < HOW_IT_WORKS_STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[calc(50%+2rem)] right-[calc(-50%+2rem)] h-0.5 z-0" aria-hidden="true">
                    <div className="w-full h-full bg-gradient-to-r from-gold/40 to-gold/10" />
                  </div>
                )}
                <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full bg-white dark:bg-gray-800/50 dark:border-gray-700 hover-glow z-10">
                  <CardHeader className="pb-4 text-center">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-3`}>
                      <item.icon className="w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-navy flex items-center justify-center text-white font-bold text-sm md:text-xs mx-auto -mt-1 mb-2">{item.step}</div>
                    <CardTitle className="text-sm md:text-base font-bold text-navy dark:text-gray-100">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground dark:text-gray-400 text-xs md:text-sm leading-relaxed text-center">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </LazySection>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: SERVICES
   ═══════════════════════════════════════════════════════════════ */

function ServicesSection() {
  const { ref, inView } = useInView(0.1);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <section id="services" className="py-20 md:py-28 bg-[#F4F1EB] dark:bg-gray-900">
      <LazySection type="cards">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-16">
            <Badge className="mb-4 px-3 py-1 bg-navy/10 text-navy border-navy/20 text-xs font-semibold uppercase tracking-wider dark:text-gray-300 dark:border-gray-600">Our Services</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Comprehensive Claims <span className="gradient-text-gold">Assistance</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">From tracking to resolution, we provide end-to-end support for your mass tort claim.</p>
          </motion.div>

          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES_DATA.map((service, idx) => (
              <motion.div key={service.title} variants={fadeInUp}>
                <Card className="group h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-800/50 dark:border-gray-700 overflow-hidden hover-glow relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                  <CardHeader className="pb-3 relative">
                    <div className="w-12 h-12 rounded-xl bg-navy/5 dark:bg-gray-700 flex items-center justify-center mb-3 group-hover:bg-gold/10 transition-colors">
                      <service.icon className="w-6 h-6 text-navy dark:text-gray-300 group-hover:text-gold transition-colors" />
                    </div>
                    <CardTitle className="text-lg font-bold text-navy dark:text-gray-100">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 relative">
                    <p className="text-muted-foreground dark:text-gray-400 text-sm leading-relaxed mb-3">{service.description}</p>
                    <button
                      onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                      aria-expanded={expandedIdx === idx}
                      className="text-gold-dark dark:text-gold-light text-sm font-semibold hover:text-gold flex items-center gap-1 transition-colors"
                    >
                      {expandedIdx === idx ? 'Show Less' : 'Learn More'}
                      {expandedIdx === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <AnimatePresence>
                      {expandedIdx === idx && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                          <p className="text-sm text-navy/70 dark:text-gray-400 leading-relaxed mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">{service.detail}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </LazySection>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: WHY WE'RE DIFFERENT
   ═══════════════════════════════════════════════════════════════ */

function WhyDifferentSection() {
  const { ref, inView } = useInView(0.1);
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-16">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">Why We&apos;re Different</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            The ClaimGuard <span className="gradient-text-gold">Advantage</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">See how our comprehensive approach compares to other claims assistance services.</p>
        </motion.div>

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer}>
          {/* Desktop table view */}
          <Card className="border-0 shadow-lg overflow-hidden hidden md:block">
            <div className="grid grid-cols-3 bg-navy dark:bg-gray-900 text-white">
              <div className="p-4 text-left font-semibold text-sm border-r border-white/10">Feature</div>
              <div className="p-4 text-center font-semibold text-sm border-r border-white/10">
                <div className="flex items-center justify-center gap-2"><Shield className="w-4 h-4 text-gold" />ClaimGuard Pro</div>
              </div>
              <div className="p-4 text-center font-semibold text-sm">Typical Service</div>
            </div>
            {COMPARISON_DATA.map((row, idx) => (
              <motion.div key={row.feature} variants={fadeInUp}>
                <div className={`grid grid-cols-3 ${idx % 2 === 0 ? 'bg-white dark:bg-gray-800/50' : 'bg-gray-50/50 dark:bg-gray-800/30'} border-b border-gray-100 dark:border-gray-700 last:border-0`}>
                  <div className="p-4 text-sm font-medium text-navy dark:text-gray-200 border-r border-gray-100 dark:border-gray-700">{row.feature}</div>
                  <div className="p-4 text-center border-r border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /><span className="text-sm text-navy/80 dark:text-gray-300">{row.us.label}</span>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <X className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0" /><span className="text-sm text-muted-foreground">{row.others.label}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </Card>

          {/* Mobile stacked cards view */}
          <div className="md:hidden space-y-3">
            {COMPARISON_DATA.map((row) => (
              <Card key={row.feature} className="border-0 shadow-md bg-white dark:bg-gray-800/50 dark:border-gray-700">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-navy dark:text-gray-100 text-sm mb-3">{row.feature}</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">ClaimGuard Pro</span>
                        <p className="text-xs text-emerald-600/80 dark:text-emerald-400/70">{row.us.label}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                      <X className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Typical Service</span>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{row.others.label}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: ELIGIBILITY QUIZ
   ═══════════════════════════════════════════════════════════════ */

interface QuizAnswers { q1: string; q2: string; q3: string; q4: string; q5: string; }

function EligibilityQuizSection() {
  const { ref, inView } = useInView(0.1);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [showResult, setShowResult] = useState(false);

  const quizQuestions = useMemo(() => [
    { question: 'Have you filed a mass tort claim?', type: 'radio' as const, options: ['Yes', 'No'], key: 'q1' as keyof QuizAnswers },
    { question: 'What type of claim are you interested in?', type: 'select' as const, options: ['Camp Lejeune', 'Roundup', 'Talc / Baby Powder', 'Hernia Mesh', 'Paraquat', 'Firefighting Foam', 'Other'], key: 'q2' as keyof QuizAnswers },
    { question: 'What is your current claim status?', type: 'select' as const, options: ['Pending', 'Under Review', 'Approved', 'Denied', 'Correction Needed', 'Not Yet Filed'], key: 'q3' as keyof QuizAnswers },
    { question: 'Have you received any correspondence about your claim?', type: 'radio' as const, options: ['Yes', 'No'], key: 'q4' as keyof QuizAnswers },
    { question: 'What is your primary concern?', type: 'select' as const, options: ['Missing documents', 'Denied claim', 'No updates on status', 'Incomplete forms', 'Need help filing', 'Other'], key: 'q5' as keyof QuizAnswers },
  ], []);

  const handleNext = useCallback(() => {
    if (step < quizQuestions.length - 1) setStep(s => s + 1);
    else setShowResult(true);
  }, [step, quizQuestions.length]);

  const handleBack = useCallback(() => setStep(s => Math.max(0, s - 1)), []);

  const getRecommendation = useCallback((): { score: number; label: string; recommendations: string[]; color: string } => {
    const a = answers;
    let score = 60;
    const recommendations: string[] = [];
    if (a.q1 === 'No') { score -= 15; recommendations.push('You may benefit from our claim filing assistance — we can guide you through the entire process.'); }
    else { recommendations.push("Great that you've already filed! We can help track your progress and resolve any issues."); }
    if (a.q3 === 'Denied') { score -= 20; recommendations.push('A denied claim can often be appealed. Our specialists have a high success rate with appeals.'); }
    if (a.q3 === 'Correction Needed') { score -= 10; recommendations.push('We specialize in document correction. Let us help you fix the issues and resubmit quickly.'); }
    if (a.q3 === 'Not Yet Filed') { score -= 15; recommendations.push('Filing soon is critical — deadlines are approaching for many settlement programs.'); }
    if (a.q5 === 'Missing documents') { recommendations.push('Our document checklist will help you identify and obtain everything you need.'); score -= 5; }
    if (a.q5 === 'Denied claim') { recommendations.push("Don't lose hope — we can review your denial and build a strong appeal strategy."); score -= 10; }
    if (score >= 75) return { score: Math.min(score, 95), label: 'Strong Candidate', recommendations, color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800' };
    if (score >= 50) return { score: Math.min(score, 74), label: 'Good Potential', recommendations, color: 'text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800' };
    return { score: Math.max(score, 25), label: 'Needs Assessment', recommendations, color: 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800' };
  }, [answers]);

  const resetQuiz = useCallback(() => { setStep(0); setAnswers({}); setShowResult(false); }, []);
  const currentQ = quizQuestions[step];

  return (
    <section id="eligibility-quiz" className="py-20 md:py-28 bg-white dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-12">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">Eligibility Quiz</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Check Your <span className="gradient-text-gold">Eligibility</span>
          </h2>
          <p className="text-muted-foreground text-lg">Answer 5 quick questions to find out if you may qualify for a mass tort claim.</p>
        </motion.div>

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleIn}>
          <Card className="border-2 border-gold/20 dark:border-gray-700 shadow-xl overflow-hidden bg-white dark:bg-gray-800/50">
            {!showResult && (
              <div className="bg-navy dark:bg-gray-900 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm font-medium">Question {step + 1} of {quizQuestions.length}</span>
                  <span className="text-gold text-sm font-bold">{Math.round(((step) / quizQuestions.length) * 100)}%</span>
                </div>
                <div className="flex gap-2">
                  {quizQuestions.map((_, i) => (
                    <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'bg-gold' : 'bg-white/20'}`} />
                  ))}
                </div>
              </div>
            )}
            <CardContent className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                {!showResult ? (
                  <motion.div key={`step-${step}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                    <h3 className="text-xl font-bold text-navy dark:text-white mb-6">{currentQ.question}</h3>
                    {currentQ.type === 'radio' ? (
                      <RadioGroup value={answers[currentQ.key] || ''} onValueChange={(v) => setAnswers(prev => ({ ...prev, [currentQ.key]: v }))} className="space-y-3">
                        {currentQ.options.map(opt => (
                          <label key={opt} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${answers[currentQ.key] === opt ? 'border-gold bg-gold/5 shadow-sm' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}`}>
                            <RadioGroupItem value={opt} />
                            <span className="text-navy dark:text-gray-200 font-medium">{opt}</span>
                          </label>
                        ))}
                      </RadioGroup>
                    ) : (
                      <div className="space-y-3">
                        {currentQ.options.map(opt => (
                          <label key={opt} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${answers[currentQ.key] === opt ? 'border-gold bg-gold/5 shadow-sm' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}`}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${answers[currentQ.key] === opt ? 'border-gold bg-gold' : 'border-gray-300 dark:border-gray-500'}`}>
                              {answers[currentQ.key] === opt && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <span className="text-navy dark:text-gray-200 font-medium">{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-between mt-8">
                      <Button variant="outline" onClick={handleBack} disabled={step === 0} className="px-6">
                        <ChevronLeft className="w-4 h-4 mr-1" />Back
                      </Button>
                      <Button onClick={handleNext} disabled={!answers[currentQ.key]} className="px-6 bg-gold hover:bg-gold-dark text-white font-semibold">
                        {step === quizQuestions.length - 1 ? 'See Results' : 'Next'}<ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-gold" />
                      </div>
                      <h3 className="text-2xl font-bold text-navy dark:text-white mb-2">Your Assessment</h3>
                      {(() => { const rec = getRecommendation(); return (
                        <>
                          <Badge className={`text-sm font-semibold px-4 py-1.5 border ${rec.color} mb-4`}>{rec.label}</Badge>
                          <div className="max-w-xs mx-auto mb-4">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-muted-foreground">Eligibility Score</span>
                              <span className="text-sm font-bold text-gold">{rec.score}%</span>
                            </div>
                            <Progress value={rec.score} className="h-3 [&>div]:bg-gold progress-animated" />
                          </div>
                          <div className="space-y-3 text-left mt-6">
                            <p className="text-sm font-semibold text-navy dark:text-gray-200 uppercase tracking-wider">Personalized Recommendations:</p>
                            {rec.recommendations.map((r, i) => (
                              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                                <p className="text-sm text-navy/80 dark:text-gray-300">{r}</p>
                              </div>
                            ))}
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3 mt-8">
                            <Button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })} className="flex-1 bg-gold hover:bg-gold-dark text-white font-semibold">
                              <Phone className="w-4 h-4 mr-2" />Contact a Specialist
                            </Button>
                            <Button onClick={() => document.querySelector('#track-claim')?.scrollIntoView({ behavior: 'smooth' })} variant="outline" className="flex-1 dark:border-gray-600 dark:text-gray-200">
                              <Search className="w-4 h-4 mr-2" />Track My Claim
                            </Button>
                          </div>
                          <button onClick={resetQuiz} className="mt-4 text-sm text-muted-foreground hover:text-gold transition-colors">Retake Quiz</button>
                        </>
                      ); })()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: WHY CHOOSE US / STATS
   ═══════════════════════════════════════════════════════════════ */

function StatCardComponent({ icon: Icon, value, suffix, label, inView, progress, prefix = '' }: {
  icon: typeof Users; value: number; suffix: string; label: string; inView: boolean; progress: number; prefix?: string;
}) {
  const count = useCounter(value, inView);
  return (
    <motion.div variants={fadeInUp} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
      <Icon className="w-8 h-8 text-gold mx-auto mb-3" />
      <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{prefix}{count}{suffix}</div>
      <div className="text-white/50 text-sm font-medium mb-3">{label}</div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={inView ? { width: `${progress}%` } : { width: 0 }} transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }} className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full" />
      </div>
    </motion.div>
  );
}

function WhyChooseUsSection() {
  const { ref, inView } = useInView(0.15);
  const { scrollY } = useScroll();
  const orbY = useTransform(scrollY, [500, 1200], [0, -40]);

  return (
    <section id="why-choose-us" className="py-20 md:py-28 bg-navy dark:bg-gray-950 relative overflow-hidden">
      <motion.div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" style={{ y: orbY }} aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy-light/30 rounded-full blur-3xl" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-16">
          <Badge className="mb-4 px-3 py-1 bg-gold/20 text-gold border-gold/30 text-xs font-semibold uppercase tracking-wider">Why Choose Us</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Your Trusted Partner in <span className="text-gold">Claims Recovery</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">We&apos;ve helped thousands of claimants navigate complex mass tort processes with proven results.</p>
        </motion.div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {STATS_DATA.map((stat) => (
            <StatCardComponent key={stat.label} {...stat} inView={inView} prefix={stat.prefix} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: TESTIMONIALS CAROUSEL
   ═══════════════════════════════════════════════════════════════ */

const TestimonialsSection = memo(function TestimonialsSection() {
  const { ref, inView } = useInView(0.1);
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-12">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">Testimonials</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            What Our <span className="gradient-text-gold">Clients Say</span>
          </h2>
        </motion.div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleIn}>
          <Carousel opts={{ loop: true, align: 'start' }} className="w-full">
            <CarouselContent>
              {TESTIMONIALS_DATA.map((t) => (
                <CarouselItem key={t.name} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <div className="h-full">
                    <Card className="card-gradient-border h-full hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex gap-0.5 mb-3">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                          ))}
                        </div>
                        <Badge className="mb-3 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100">{t.caseType}</Badge>
                        <p className="text-navy/80 dark:text-gray-300 text-sm leading-relaxed mb-5 italic">&ldquo;{t.text}&rdquo;</p>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm`}>{t.name.charAt(0)}</div>
                          <div>
                            <div className="font-semibold text-navy dark:text-gray-100 text-sm">{t.name}</div>
                            <div className="text-muted-foreground text-xs flex items-center gap-1">
                              <MapPin className="w-3 h-3" />{t.location}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center gap-2 mt-6">
              <CarouselPrevious className="static translate-y-0 bg-navy/10 hover:bg-navy/20 border-none dark:bg-gray-700" />
              <CarouselNext className="static translate-y-0 bg-navy/10 hover:bg-navy/20 border-none dark:bg-gray-700" />
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
});

/* ═══════════════════════════════════════════════════════════════
   SECTION: TRACK MY CLAIM
   ═══════════════════════════════════════════════════════════════ */

interface ClaimResult {
  trackingId: string; status: string; claimType: string | null; description: string | null;
  filedDate: string | null; lastUpdated: string; notes: string | null; nextSteps: string | null;
  progress: number; claimant: { firstName: string; lastName: string };
  history: { status: string; notes: string | null; date: string }[];
}

function getStatusConfig(status: string) {
  switch (status) {
    case 'Pending': return { badge: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800', icon: Clock, color: 'text-amber-600' };
    case 'Under Review': return { badge: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800', icon: Eye, color: 'text-blue-600' };
    case 'Approved': return { badge: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800', icon: CheckCircle2, color: 'text-emerald-600' };
    case 'Denied': return { badge: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800', icon: AlertCircle, color: 'text-red-600' };
    case 'Correction Needed': return { badge: 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800', icon: FileSignature, color: 'text-violet-600' };
    default: return { badge: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700', icon: Clock, color: 'text-gray-600' };
  }
}

function getStageIndex(status: string): number {
  switch (status) {
    case 'Pending': return 0; case 'Correction Needed': return 1;
    case 'Under Review': return 2; case 'Denied': case 'Approved': return 3;
    default: return 0;
  }
}

function TrackClaimSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-2 border-gold/20 dark:border-gray-700 shadow-xl overflow-hidden bg-white dark:bg-gray-800/50">
        <div className="bg-navy dark:bg-gray-900 p-6">
          <Skeleton className="h-8 w-48 bg-white/10" />
          <Skeleton className="h-6 w-32 bg-white/10 mt-2" />
        </div>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-3 w-16 bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
          <Skeleton className="h-px w-full bg-gray-200 dark:bg-gray-700" />
          <div className="grid sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-20 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-5 w-32 bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full bg-gray-100 dark:bg-gray-700/50 rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TrackClaimSection() {
  const { ref, inView } = useInView(0.1);
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClaimResult | null>(null);
  const [error, setError] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);
  const { toast } = useToast();

  const handleTrack = useCallback(async () => {
    const trimmed = trackingId.trim();
    if (!trimmed) { setError('Please enter a tracking ID'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/claims/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ trackingId: trimmed }) });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Claim not found');
        toast({ title: 'Claim Not Found', description: data.error || 'Please verify your tracking ID.', variant: 'destructive' });
        return;
      }
      setResult(data.claim);
      toast({ title: 'Claim Found', description: `Successfully retrieved status for ${data.claim.trackingId}` });
    } catch {
      setError('Network error. Please try again.');
      toast({ title: 'Error', description: 'Could not connect to the server.', variant: 'destructive' });
    } finally { setLoading(false); }
  }, [trackingId, toast]);

  const downloadPDF = useCallback(async () => {
    if (!result) return;
    setPdfLoading(true);
    try {
      const reportRes = await fetch(`/api/claims/report?trackingId=${result.trackingId}`);
      if (!reportRes.ok) throw new Error('Failed to fetch report data');
      const report = await reportRes.json();

      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const navy = [27, 42, 74] as const;
      const gold = [197, 165, 90] as const;

      doc.setFillColor(...navy);
      doc.rect(0, 0, 210, 45, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text('ClaimGuard Pro', 20, 20);
      doc.setFontSize(12);
      doc.setTextColor(...gold);
      doc.text('Claim Status Report', 20, 30);
      doc.setFontSize(8);
      doc.setTextColor(180, 180, 180);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 38);

      doc.setTextColor(...navy);
      doc.setFontSize(10);
      let y = 55;
      const addLine = (label: string, value: string) => { doc.setFont('helvetica', 'bold'); doc.text(label, 20, y); doc.setFont('helvetica', 'normal'); doc.text(value, 80, y); y += 8; };
      addLine('Tracking ID:', report.trackingId);
      addLine('Claimant:', report.claimant);
      addLine('Status:', report.status);
      addLine('Progress:', `${report.progress}%`);
      addLine('Claim Type:', report.claimType || 'N/A');
      addLine('Filed Date:', report.filedDate || 'N/A');
      addLine('Last Updated:', report.lastUpdated);

      y += 5;
      doc.setFillColor(244, 241, 235);
      doc.roundedRect(15, y, 180, 10, 2, 2, 'F');
      doc.setTextColor(...navy);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Claim Pipeline', 20, y + 7);
      y += 15;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      report.pipeline.forEach((stage: { name: string; status: string }) => {
        const isActive = stage.status === 'active' || stage.status === 'complete';
        doc.setTextColor(isActive ? 16 : 156, isActive ? 185 : 163, isActive ? 129 : 175);
        doc.text(`${isActive ? '●' : '○'} ${stage.name} — ${stage.status.toUpperCase()}`, 20, y);
        y += 7;
      });

      y += 5;
      doc.setTextColor(...navy);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Document Checklist', 20, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      report.checklist.forEach((item: { name: string; done: boolean }) => {
        doc.setTextColor(item.done ? 16 : 239, item.done ? 185 : 68, item.done ? 129 : 68);
        doc.text(`${item.done ? '☑' : '☐'} ${item.name}`, 20, y);
        y += 7;
      });

      if (report.notes) { y += 5; doc.setFillColor(254, 243, 199); doc.roundedRect(15, y, 180, 20, 2, 2, 'F'); doc.setTextColor(146, 64, 14); doc.setFontSize(9); doc.text(`Notes: ${report.notes}`, 20, y + 12); y += 25; }
      if (report.nextSteps) { doc.setFillColor(209, 250, 229); doc.roundedRect(15, y, 180, 20, 2, 2, 'F'); doc.setTextColor(6, 78, 59); doc.setFontSize(9); doc.text(`Next Steps: ${report.nextSteps}`, 20, y + 12); y += 25; }

      y += 5;
      doc.setTextColor(...navy); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
      doc.text('History Timeline', 20, y);
      y += 8;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
      report.history.forEach((h: { date: string; status: string; notes: string | null }) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setTextColor(100, 100, 100); doc.text(`${h.date} — ${h.status}`, 20, y);
        y += 5;
        if (h.notes) { doc.setTextColor(80, 80, 80); doc.text(`  ${h.notes}`, 20, y); y += 5; }
        y += 3;
      });

      doc.setFillColor(...navy);
      doc.rect(0, 282, 210, 15, 'F');
      doc.setTextColor(180, 180, 180);
      doc.setFontSize(7);
      doc.text('This report is for informational purposes only and does not constitute legal advice. ClaimGuard Pro is not a law firm.', 20, 290);
      doc.text('For legal guidance, please consult with a qualified attorney. © ' + new Date().getFullYear() + ' ClaimGuard Pro. All rights reserved.', 20, 295);

      doc.save(`ClaimGuard-Report-${result.trackingId}.pdf`);
      toast({ title: 'PDF Downloaded', description: `ClaimGuard-Report-${result.trackingId}.pdf` });
    } catch {
      toast({ title: 'PDF Error', description: 'Failed to generate PDF report.', variant: 'destructive' });
    } finally { setPdfLoading(false); }
  }, [result, toast]);

  const demoIds = useMemo(() => ['CLM-2024-001', 'CLM-2024-002', 'CLM-2024-003', 'CLM-2024-004', 'CLM-2024-005', 'CLM-2024-006'], []);

  return (
    <section id="track-claim" className="py-20 md:py-28 bg-[#F4F1EB] dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-12">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">Track Your Claim</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Real-Time Claim <span className="gradient-text-gold">Status Check</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Enter your tracking ID to see where your claim stands, view history, and get clear next steps.</p>
        </motion.div>

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleIn} className="max-w-2xl mx-auto mb-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input value={trackingId} onChange={(e) => { setTrackingId(e.target.value); setError(''); }} onKeyDown={(e) => e.key === 'Enter' && handleTrack()} placeholder="Enter Tracking ID (e.g., CLM-2024-001)" className="pl-12 h-13 text-base border-2 focus:border-gold bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white" disabled={loading} />
            </div>
            <Button onClick={handleTrack} disabled={loading} className="h-13 px-8 bg-navy dark:bg-gray-800 hover:bg-navy-light dark:hover:bg-gray-700 text-white font-semibold text-base">
              {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Searching...</> : <><Search className="w-5 h-5 mr-2" />Track Claim</>}
            </Button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-red-800 dark:text-red-300 font-medium text-sm">{error}</p>
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">Need help? <button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })} className="underline font-semibold">Contact our support team</button></p>
              </div>
            </div>
          )}
        </motion.div>

        {!result && !error && (
          <div className="text-center mb-10">
            <p className="text-sm text-muted-foreground">
              Try demo IDs:{' '}
              {demoIds.map((id, idx) => (
                <span key={id}>
                  {idx > 0 && <span className="text-muted-foreground">, </span>}
                  <button onClick={() => { setTrackingId(id); setError(''); }} className="text-gold font-semibold hover:underline">{id}</button>
                </span>
              ))}
            </p>
          </div>
        )}

        {loading && <TrackClaimSkeleton />}

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <Card className="border-2 border-gold/20 dark:border-gray-700 shadow-xl overflow-hidden bg-white dark:bg-gray-800/50">
              <div className="bg-navy dark:bg-gray-900 p-6 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">Tracking ID</p>
                    <p className="text-2xl font-bold flex items-center gap-2"><Shield className="w-6 h-6 text-gold" />{result.trackingId}</p>
                  </div>
                  <Badge className={`text-sm font-semibold px-4 py-1.5 border ${getStatusConfig(result.status).badge}`}>
                    {(() => { const Ic = getStatusConfig(result.status).icon; return Ic ? <Ic className="w-4 h-4 mr-1.5" /> : null; })()}
                    {result.status}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6 space-y-6">
                <div role="progressbar" aria-valuenow={result.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Claim progress: ${result.progress}%`}>
                  <p className="text-sm font-semibold text-navy dark:text-gray-200 mb-4 uppercase tracking-wider">Claim Pipeline</p>
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-gray-200 dark:bg-gray-700 z-0" aria-hidden="true" />
                    <div className="absolute top-5 left-[10%] h-1 bg-gold z-0 transition-all duration-700" style={{ width: `${(getStageIndex(result.status) / (PIPELINE_STAGES.length - 1)) * 80}%` }} aria-hidden="true" />
                    {PIPELINE_STAGES.map((stage, i) => {
                      const stageIdx = getStageIndex(result.status);
                      const isActive = i <= stageIdx;
                      const isCurrent = i === stageIdx;
                      return (
                        <div key={stage} className="relative z-10 flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${isCurrent ? 'pipeline-stage-active scale-110' : isActive ? 'pipeline-stage-complete' : 'pipeline-stage-inactive'}`}>
                            {isActive && !isCurrent ? <CheckCircle2 className="w-5 h-5" /> : <span>{i + 1}</span>}
                          </div>
                          <span className={`text-xs font-medium mt-2 text-center max-w-[70px] ${isCurrent ? 'text-navy dark:text-white font-bold' : isActive ? 'text-navy/70 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600'}`}>{stage}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <Separator className="dark:bg-gray-700" />
                <div>
                  <p className="text-sm font-semibold text-navy dark:text-gray-200 mb-3 uppercase tracking-wider">Document Checklist</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {DOC_CHECKLIST.map((doc, i) => {
                      const isChecked = i < 3 || result.status === 'Approved';
                      return (
                        <div key={doc.name} className={`flex items-center gap-3 p-3 rounded-lg border ${isChecked ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'}`}>
                          <div className={`w-5 h-5 rounded flex items-center justify-center ${isChecked ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                            {isChecked ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <X className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <doc.icon className={`w-4 h-4 ${isChecked ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`} />
                          <span className={`text-sm font-medium ${isChecked ? 'text-emerald-800 dark:text-emerald-300' : 'text-amber-800 dark:text-amber-300'}`}>{doc.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <Separator className="dark:bg-gray-700" />
                <div className="grid sm:grid-cols-2 gap-6">
                  <div><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Claimant</p><p className="font-semibold text-navy dark:text-gray-100">{result.claimant.firstName} {result.claimant.lastName}</p></div>
                  <div><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Claim Type</p><p className="font-semibold text-navy dark:text-gray-100">{result.claimType || 'N/A'}</p></div>
                  <div><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Filed Date</p><p className="font-semibold text-navy dark:text-gray-100">{result.filedDate ? new Date(result.filedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p></div>
                  <div><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Estimated Timeline</p><p className="font-semibold text-navy dark:text-gray-100 flex items-center gap-1"><Timer className="w-4 h-4 text-gold" />{result.status === 'Approved' ? 'Complete' : result.status === 'Pending' ? '6-12 months' : result.status === 'Under Review' ? '3-6 months' : result.status === 'Denied' ? 'Appeal: 3-9 months' : '2-4 weeks'}</p></div>
                </div>
                {result.notes && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1"><AlertCircle className="w-3.5 h-3.5 inline mr-1" />Important Notes</p>
                    <p className="text-sm text-amber-900 dark:text-amber-200">{result.notes}</p>
                  </div>
                )}
                {result.nextSteps && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                    <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-1"><ArrowRight className="w-3.5 h-3.5 inline mr-1" />Next Steps</p>
                    <p className="text-sm text-emerald-900 dark:text-emerald-200">{result.nextSteps}</p>
                  </div>
                )}
                {result.history && result.history.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Claim History</p>
                    <div className="space-y-3">
                      {result.history.map((h, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <div className="flex flex-col items-center mt-1" aria-hidden="true">
                            <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-gold' : 'bg-gray-300 dark:bg-gray-600'}`} />
                            {i < result.history.length - 1 && <div className="w-0.5 h-8 bg-gray-200 dark:bg-gray-700" />}
                          </div>
                          <div className="pb-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary" className={`text-xs ${getStatusConfig(h.status).badge}`}>{h.status}</Badge>
                              <span className="text-xs text-muted-foreground">{new Date(h.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                            </div>
                            {h.notes && <p className="text-sm text-navy/70 dark:text-gray-400 mt-1">{h.notes}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                  {(result.status === 'Denied' || result.status === 'Correction Needed') && (
                    <Button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })} className="flex-1 bg-gold hover:bg-gold-dark text-white font-semibold" size="lg">
                      {result.status === 'Denied' ? 'Appeal My Claim' : 'Fix My Documents'}<ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  )}
                  <Button onClick={downloadPDF} disabled={pdfLoading} variant="outline" className="flex-1 border-navy/20 dark:border-gray-600 text-navy dark:text-gray-200 hover:bg-navy/5 dark:hover:bg-gray-700" size="lg">
                    {pdfLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Generating PDF...</> : <><FileDown className="w-5 h-5 mr-2" />Download PDF Report</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: WHAT WE HANDLE (CASE TYPES)
   ═══════════════════════════════════════════════════════════════ */

function WhatWeHandleSection() {
  const { ref, inView } = useInView(0.1);
  const [selectedCase, setSelectedCase] = useState<typeof CASE_TYPE_DETAILS[0] | null>(null);

  return (
    <section id="what-we-handle" className="py-20 md:py-28 bg-[#F4F1EB] dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-16">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">Case Types</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Claims We <span className="gradient-text-gold">Handle</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We specialize in the most significant mass tort cases. Click on any case type to learn more.</p>
        </motion.div>

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CASE_TYPE_DETAILS.map((ct) => (
            <motion.div key={ct.title} variants={fadeInUp}>
              <Card onClick={() => setSelectedCase(ct)} className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-800/50 dark:border-gray-700 overflow-hidden hover-glow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl ${ct.color} flex items-center justify-center text-white shadow-md`}>
                      <ct.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-base font-bold text-navy dark:text-gray-100 leading-tight">{ct.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground dark:text-gray-400 text-sm leading-relaxed mb-4">{ct.description}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-gold shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Filing Deadline:</p>
                      <p className="text-xs font-semibold text-navy dark:text-gray-200">{ct.deadline}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {ct.statuses.map(s => (
                      <Badge key={s} variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">{s}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <Dialog open={!!selectedCase} onOpenChange={(open) => !open && setSelectedCase(null)}>
          {selectedCase && (
            <DialogContent className="max-w-lg bg-white dark:bg-gray-800 dark:border-gray-700">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${selectedCase.color} flex items-center justify-center text-white`}>
                    <selectedCase.icon className="w-6 h-6" />
                  </div>
                  <DialogTitle className="text-navy dark:text-white">{selectedCase.title}</DialogTitle>
                </div>
                <DialogDescription className="text-muted-foreground dark:text-gray-400">{selectedCase.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <h4 className="text-sm font-semibold text-navy dark:text-gray-200 mb-2">Filing Deadline</h4>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">{selectedCase.deadline}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-navy dark:text-gray-200 mb-2">Current Statuses</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedCase.statuses.map(s => (
                      <Badge key={s} variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">{s}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-navy dark:text-gray-200 mb-2">Detailed Information</h4>
                  <p className="text-sm text-muted-foreground dark:text-gray-400 leading-relaxed">{selectedCase.detail}</p>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button onClick={() => { setSelectedCase(null); document.querySelector('#eligibility-quiz')?.scrollIntoView({ behavior: 'smooth' }); }} className="flex-1 bg-gold hover:bg-gold-dark text-white font-semibold">Check Eligibility</Button>
                  <Button onClick={() => { setSelectedCase(null); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }} variant="outline" className="flex-1 dark:border-gray-600 dark:text-gray-200">Contact Us</Button>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: CTA (CALL TO ACTION)
   ═══════════════════════════════════════════════════════════════ */

function CTASection() {
  const { ref, inView } = useInView(0.1);
  const { scrollY } = useScroll();
  const gradShift = useTransform(scrollY, [800, 1500], [0, 30]);

  const scrollTo = useCallback((id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section className="py-20 md:py-24 bg-navy dark:bg-gray-950 relative overflow-hidden">
      <motion.div className="absolute top-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" style={{ x: gradShift }} aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" aria-hidden="true" />
      <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-gold" />
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          Ready to Take the <span className="text-gold">Next Step</span>?
        </h2>
        <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Don&apos;t navigate the complex mass tort process alone. Whether you need to track an existing claim, check your eligibility, or file for the first time — we&apos;re here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => scrollTo('#eligibility-quiz')} size="lg" className="bg-gold hover:bg-gold-dark text-white font-semibold text-base px-8 py-6 shadow-xl shadow-gold/20 transition-all hover:shadow-2xl hover:scale-[1.02]">
            <Target className="w-5 h-5 mr-2" />Check Eligibility Free
          </Button>
          <Button onClick={() => scrollTo('#track-claim')} size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold text-base px-8 py-6 backdrop-blur-sm transition-all hover:scale-[1.02]">
            <Search className="w-5 h-5 mr-2" />Track My Claim
          </Button>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-8 text-white/40 text-sm">
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold" /><span>Free Consultation</span></div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold" /><span>No Upfront Fees</span></div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold" /><span>100% Confidential</span></div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold" /><span>98% Success Rate</span></div>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: FAQ
   ═══════════════════════════════════════════════════════════════ */

function FAQSection() {
  const { ref, inView } = useInView(0.1);
  return (
    <section id="faq" className="py-20 md:py-28 bg-white dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-12">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">FAQ</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Frequently Asked <span className="gradient-text-gold">Questions</span>
          </h2>
          <p className="text-muted-foreground text-lg">Everything you need to know about mass tort claims and our services.</p>
        </motion.div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer}>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_DATA.map((item, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <AccordionItem value={`faq-${i}`} className="border-0 bg-[#F4F1EB] dark:bg-gray-800/50 rounded-xl overflow-hidden px-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gold/5 transition-colors [&[data-state=open]]:text-gold-dark [&[data-state=open]]:bg-gold/5 dark:[&[data-state=open]]:text-gold-light">
                    <span className="text-left font-semibold text-navy dark:text-gray-100 text-sm sm:text-base">{item.q}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-sm text-navy/70 dark:text-gray-400 leading-relaxed">{item.a}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: CASE STUDIES
   ═══════════════════════════════════════════════════════════════ */

function CaseStudiesSection() {
  const { ref, inView } = useInView(0.1);
  return (
    <section id="case-studies" className="py-20 md:py-28 bg-[#F4F1EB] dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-16">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">Success Stories</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Real <span className="gradient-text-gold">Case Results</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">These are real outcomes we&apos;ve helped our clients achieve. Names are partially masked for privacy.</p>
        </motion.div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} className="space-y-12">
          {CASE_STUDIES.map((cs, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <Card className="overflow-hidden border-0 shadow-lg hover-glow">
                <div className="grid md:grid-cols-2">
                  <div className={`${cs.badge} p-8 md:p-10 text-white flex flex-col justify-center`}>
                    <Badge className="self-start bg-white/20 text-white border-white/30 text-xs font-medium mb-4">{cs.caseType}</Badge>
                    <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Client: {cs.name}</h3>
                    <div className="text-4xl font-bold mt-4 mb-2">{cs.compensation}</div>
                    <p className="text-white/70 text-sm">Settlement Amount</p>
                    <div className="flex items-center gap-4 mt-6">
                      <div className="text-center"><p className="text-xs text-white/50 uppercase tracking-wider mb-1">Before</p><Badge className="bg-white/20 text-white border-white/20 text-sm">{cs.beforeStatus}</Badge></div>
                      <ArrowRight className="w-5 h-5 text-white/40" aria-hidden="true" />
                      <div className="text-center"><p className="text-xs text-white/50 uppercase tracking-wider mb-1">After</p><Badge className="bg-emerald-500/30 text-emerald-100 border-emerald-400/30 text-sm">{cs.afterStatus}</Badge></div>
                    </div>
                  </div>
                  <div className="p-8 md:p-10 bg-white dark:bg-gray-800/50">
                    <div className="space-y-6">
                      <div><p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />Challenge</p><p className="text-sm text-navy/80 dark:text-gray-300 leading-relaxed">{cs.challenge}</p></div>
                      <div><p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Zap className="w-3.5 h-3.5" />Solution</p><p className="text-sm text-navy/80 dark:text-gray-300 leading-relaxed">{cs.solution}</p></div>
                      <div><p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />Outcome</p><p className="text-sm text-navy/80 dark:text-gray-300 leading-relaxed">{cs.outcome}</p></div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: NEWSLETTER (REAL API)
   ═══════════════════════════════════════════════════════════════ */

function NewsletterSection() {
  const { ref, inView } = useInView(0.1);
  const [email, setEmail] = useState('');
  const [claimType, setClaimType] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkUpdates, setCheckUpdates] = useState(true);
  const [checkDeadlines, setCheckDeadlines] = useState(true);
  const [checkTips, setCheckTips] = useState(false);
  const { toast } = useToast();

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!emailRegex.test(email)) { toast({ title: 'Invalid email', description: 'Please enter a valid email address.', variant: 'destructive' }); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, claimType: claimType || undefined, updates: checkUpdates, deadlines: checkDeadlines, tips: checkTips }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        toast({ title: 'Subscribed!', description: data.message || 'Welcome to our newsletter!' });
        setTimeout(() => { setSubmitted(false); setEmail(''); setClaimType(''); }, 4000);
      } else {
        toast({ title: 'Subscription Error', description: data.error || 'Please try again.', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Network Error', description: 'Please try again.', variant: 'destructive' });
    } finally { setLoading(false); }
  }, [email, claimType, checkUpdates, checkDeadlines, checkTips, emailRegex, toast]);

  return (
    <section id="newsletter" className="py-20 bg-navy dark:bg-gray-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl" aria-hidden="true" />
      <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-gold/20 flex items-center justify-center mb-6">
              <Mail className="w-7 h-7 text-gold" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>Stay Informed</h2>
            <p className="text-white/60 mb-6 leading-relaxed">Join over 8,000 claimants who receive our weekly newsletter.</p>
            <div className="space-y-3">
              {[
                { label: 'Claim Status Updates', checked: checkUpdates, onChange: setCheckUpdates, icon: Search },
                { label: 'Filing Deadline Alerts', checked: checkDeadlines, onChange: setCheckDeadlines, icon: Clock },
                { label: 'Expert Tips & Guides', checked: checkTips, onChange: setCheckTips, icon: BookOpen },
              ].map((item) => (
                <label key={item.label} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${item.checked ? 'bg-gold border-gold' : 'border-white/30 group-hover:border-white/50'}`} onClick={() => item.onChange(!item.checked)}>
                    {item.checked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <item.icon className="w-4 h-4 text-gold/70" aria-hidden="true" />
                  <span className="text-white/70 text-sm group-hover:text-white/90 transition-colors">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-lg font-bold text-white mb-2">Get Your Free Newsletter</h3>
                <p className="text-white/50 text-sm mb-6">Join 8,000+ subscribers staying ahead of deadlines.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label className="text-white/60 text-xs mb-1 block">Email Address</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-gold" />
                  </div>
                  <div>
                    <Label className="text-white/60 text-xs mb-1 block">Claim Type (optional)</Label>
                    <Input value={claimType} onChange={(e) => setClaimType(e.target.value)} placeholder="e.g., Camp Lejeune, Roundup..." className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-gold text-sm" />
                  </div>
                  <Button type="submit" disabled={loading || submitted} className={`w-full h-12 font-semibold transition-all text-base ${submitted ? 'bg-emerald-500' : 'bg-gold hover:bg-gold-dark text-white'}`}>
                    {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Subscribing...</> : submitted ? <><CheckCircle2 className="w-5 h-5 mr-2" />Successfully Subscribed!</> : <><Send className="w-5 h-5 mr-2" />Subscribe Now — It&apos;s Free</>}
                  </Button>
                </form>
                <div className="flex items-center justify-center gap-4 mt-4 text-white/30 text-xs">
                  <div className="flex items-center gap-1"><Lock className="w-3 h-3" /><span>Encrypted</span></div>
                  <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /><span>No Spam</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: ABOUT US
   ═══════════════════════════════════════════════════════════════ */

function AboutSection() {
  const { ref, inView } = useInView(0.1);
  const VALUES = [
    { icon: Shield, title: 'Integrity First', desc: 'We operate with complete transparency and always put our claimants\' interests first.' },
    { icon: Scale, title: 'Justice for All', desc: 'Every claimant deserves fair representation and equal access to compensation.' },
    { icon: Users, title: 'Personalized Care', desc: 'No cookie-cutter solutions. Every claim gets individualized attention.' },
    { icon: Award, title: 'Proven Results', desc: 'With a 98% success rate and $47M+ recovered, our track record speaks for itself.' },
  ];
  const TIMELINE_MILESTONES = [
    { year: '2009', title: 'Founded', desc: 'ClaimGuard Pro was established with a mission to help mass tort claimants.' },
    { year: '2013', title: '1,000 Claims', desc: 'Reached our first milestone of assisting 1,000 claimants.' },
    { year: '2017', title: 'Technology Platform', desc: 'Launched our proprietary claim tracking system.' },
    { year: '2020', title: '$25M Recovered', desc: 'Helped claimants recover over $25 million in settlements.' },
    { year: '2023', title: 'National Expansion', desc: 'Expanded to serve claimants in all 50 states.' },
    { year: '2024', title: '$47M+ & Growing', desc: 'Surpassed $47 million in total recoveries with AI-powered tools.' },
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-16">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">About Us</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Fighting for <span className="gradient-text-gold">Justice</span> Since 2009
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            ClaimGuard Pro was founded with a single mission: to ensure every person affected by corporate negligence has access to fair compensation.
          </p>
        </motion.div>

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleIn} className="max-w-3xl mx-auto mb-16">
          <Card className="bg-navy dark:bg-gray-900 text-white border-0 shadow-xl overflow-hidden">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-10 h-10 text-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>Our Mission</h3>
              <p className="text-white/80 leading-relaxed text-lg italic">&ldquo;To level the playing field between everyday people and powerful corporations by providing expert guidance, transparent communication, and unwavering advocacy throughout the mass tort claims process.&rdquo;</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {VALUES.map((v) => (
            <motion.div key={v.title} variants={fadeInUp}>
              <Card className="h-full border-0 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 bg-white dark:bg-gray-800/50 dark:border-gray-700 hover-glow">
                <CardHeader className="text-center pb-3">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-3"><v.icon className="w-6 h-6 text-gold" /></div>
                  <CardTitle className="text-base font-bold text-navy dark:text-gray-100">{v.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-center"><p className="text-muted-foreground dark:text-gray-400 text-sm leading-relaxed">{v.desc}</p></CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-8">
          <h3 className="text-2xl font-bold text-navy dark:text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>Meet Our Team</h3>
          <p className="text-muted-foreground">Dedicated professionals fighting for your rights.</p>
        </motion.div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {TEAM_MEMBERS.map((member) => (
            <motion.div key={member.name} variants={fadeInUp}>
              <Card className="text-center border-0 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 bg-white dark:bg-gray-800/50 dark:border-gray-700 hover-glow h-full">
                <CardContent className="p-6">
                  <div className={`w-20 h-20 rounded-full ${member.color} flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold shadow-lg`}>{member.initials}</div>
                  <h4 className="font-bold text-navy dark:text-gray-100 text-base">{member.name}</h4>
                  <p className="text-gold-dark dark:text-gold-light text-xs font-semibold uppercase tracking-wider mb-2">{member.role}</p>
                  <p className="text-muted-foreground dark:text-gray-400 text-xs leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="mt-16 mb-16">
          <h3 className="text-2xl font-bold text-navy dark:text-white mb-8 text-center" style={{ fontFamily: 'Georgia, serif' }}>Our Journey</h3>
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gold/20 -translate-x-1/2" aria-hidden="true" />
            <div className="md:hidden absolute left-6 top-0 bottom-0 w-0.5 bg-gold/20" aria-hidden="true" />
            {TIMELINE_MILESTONES.map((milestone, idx) => (
              <motion.div key={milestone.year} variants={fadeInUp} className={`relative flex items-start gap-6 mb-8 last:mb-0 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gold border-4 border-white dark:border-gray-950 shadow-md z-10 mt-1" aria-hidden="true" />
                <div className="md:hidden absolute left-6 -translate-x-1/2 w-4 h-4 rounded-full bg-gold border-4 border-white dark:border-gray-950 shadow-md z-10 mt-1" aria-hidden="true" />
                <div className={`ml-14 md:ml-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <Badge className="bg-gold/10 text-gold-dark dark:text-gold-light border-gold/20 text-xs font-bold mb-2">{milestone.year}</Badge>
                  <h4 className="font-bold text-navy dark:text-gray-100 text-base mb-1">{milestone.title}</h4>
                  <p className="text-muted-foreground dark:text-gray-400 text-sm leading-relaxed">{milestone.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
          {[
            { icon: Shield, label: 'BBB Accredited A+' },
            { icon: Lock, label: '256-bit SSL Encrypted' },
            { icon: CheckCircle2, label: 'HIPAA Compliant' },
            { icon: Award, label: 'Top Rated 2024' },
            { icon: Users, label: '8,000+ Subscribers' },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F4F1EB] dark:bg-gray-800 text-sm text-navy/70 dark:text-gray-300 hover:bg-gold/10 transition-colors cursor-default">
              <badge.icon className="w-4 h-4 text-gold" /><span>{badge.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: CONTACT (REAL FILE UPLOAD)
   ═══════════════════════════════════════════════════════════════ */

interface UploadedFile { file: File; id: string; }

function ContactSection() {
  const { ref, inView } = useInView(0.1);
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', claimId: '', message: '', contactMethod: 'email' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!emailRegex.test(form.email)) e.email = 'Valid email is required';
    if (!form.message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form, emailRegex]);

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter(f => {
      const ext = f.name.split('.').pop()?.toLowerCase();
      return ['pdf', 'doc', 'docx', 'jpg', 'png'].includes(ext || '') && f.size <= 10 * 1024 * 1024;
    });
    setUploadedFiles(prev => {
      const combined = [...prev, ...newFiles.map(f => ({ file: f, id: `${f.name}-${Date.now()}` }))];
      return combined.slice(0, 3);
    });
  }, []);

  const removeFile = useCallback((id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); }, [addFiles]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const fileName = uploadedFiles.map(f => f.file.name).join(', ') || undefined;
      const fileSize = uploadedFiles.length > 0 ? `${uploadedFiles.length} file(s), ${uploadedFiles.reduce((sum, f) => sum + f.file.size, 0)}` : undefined;
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, fileName, fileSize }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Message Sent!', description: data.message || 'We will get back to you shortly.' });
        setForm({ name: '', email: '', phone: '', claimId: '', message: '', contactMethod: 'email' });
        setUploadedFiles([]);
      } else {
        toast({ title: 'Error', description: data.error || 'Please try again.', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Network Error', description: 'Please try again.', variant: 'destructive' });
    } finally { setLoading(false); }
  }, [form, validate, toast, uploadedFiles]);

  const formatSize = useCallback((bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }, []);

  return (
    <section id="contact" className="py-20 md:py-28 bg-[#F4F1EB] dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-16">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">Contact Us</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Get Your Free <span className="gradient-text-gold">Consultation</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Speak with our team today. No obligation, no upfront fees.</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="lg:col-span-3">
            <Card className="border-0 shadow-lg bg-white dark:bg-gray-800/50 dark:border-gray-700">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-name" className="text-sm font-semibold text-navy dark:text-gray-200 mb-1 block">Full Name *</Label>
                      <Input id="contact-name" value={form.name} onChange={(e) => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: '' })); }} placeholder="John Doe" className={errors.name ? 'border-red-400 dark:bg-gray-700 dark:border-red-500 dark:text-white' : 'dark:bg-gray-700 dark:border-gray-600 dark:text-white'} />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="contact-email" className="text-sm font-semibold text-navy dark:text-gray-200 mb-1 block">Email *</Label>
                      <Input id="contact-email" type="email" value={form.email} onChange={(e) => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })); }} placeholder="john@example.com" className={errors.email ? 'border-red-400 dark:bg-gray-700 dark:border-red-500 dark:text-white' : 'dark:bg-gray-700 dark:border-gray-600 dark:text-white'} />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-phone" className="text-sm font-semibold text-navy dark:text-gray-200 mb-1 block">Phone</Label>
                      <Input id="contact-phone" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(555) 000-0000" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                      <Label htmlFor="contact-claimId" className="text-sm font-semibold text-navy dark:text-gray-200 mb-1 block">Claim ID (optional)</Label>
                      <Input id="contact-claimId" value={form.claimId} onChange={(e) => setForm(f => ({ ...f, claimId: e.target.value }))} placeholder="CLM-2024-XXX" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-navy dark:text-gray-200 mb-2 block">Preferred Contact Method</Label>
                    <RadioGroup value={form.contactMethod} onValueChange={(v) => setForm(f => ({ ...f, contactMethod: v }))} className="flex gap-4">
                      {[
                        { value: 'email', label: 'Email', icon: Mail },
                        { value: 'phone', label: 'Phone', icon: Phone },
                        { value: 'sms', label: 'SMS', icon: MessageCircle },
                      ].map(opt => (
                        <label key={opt.value} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all text-sm ${form.contactMethod === opt.value ? 'border-gold bg-gold/5 dark:bg-gold/10' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`}>
                          <RadioGroupItem value={opt.value} /><opt.icon className="w-4 h-4 text-muted-foreground" />{opt.label}
                        </label>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="contact-message" className="text-sm font-semibold text-navy dark:text-gray-200 mb-1 block">Message *</Label>
                    <Textarea id="contact-message" value={form.message} onChange={(e) => { setForm(f => ({ ...f, message: e.target.value })); setErrors(er => ({ ...er, message: '' })); }} placeholder="Tell us about your situation..." rows={4} className={errors.message ? 'border-red-400 dark:bg-gray-700 dark:border-red-500 dark:text-white' : 'dark:bg-gray-700 dark:border-gray-600 dark:text-white'} />
                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-navy dark:text-gray-200 mb-2 block">Attach Documents (optional)</Label>
                    <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.jpg,.png" className="hidden" onChange={(e) => addFiles(e.target.files)} />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${isDragging ? 'border-gold bg-gold/5 dark:bg-gold/10' : 'border-gray-300 dark:border-gray-600 hover:border-gold/50'}`}
                      role="button"
                      tabIndex={0}
                      aria-label="Upload documents"
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground dark:text-gray-400">Click to upload or drag files here</p>
                      <p className="text-xs text-muted-foreground dark:text-gray-500 mt-1">PDF, DOC, JPG, PNG up to 10MB each (max 3 files)</p>
                    </div>
                    {uploadedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {uploadedFiles.map(f => (
                          <div key={f.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 dark:bg-gold/20 border border-gold/20 dark:border-gold/30 text-sm">
                            <FileText className="w-3.5 h-3.5 text-gold" />
                            <span className="text-navy dark:text-gray-200 font-medium text-xs max-w-[120px] truncate">{f.file.name}</span>
                            <span className="text-muted-foreground text-xs">{formatSize(f.file.size)}</span>
                            <button onClick={() => removeFile(f.id)} className="text-gray-400 hover:text-red-500 transition-colors" aria-label={`Remove ${f.file.name}`}>
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button type="submit" disabled={loading} className="w-full bg-gold hover:bg-gold-dark text-white font-semibold h-12 text-base">
                    {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Sending...</> : <><Send className="w-5 h-5 mr-2" />Send Message</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { delay: 0.2 } } }} className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-md overflow-hidden bg-white dark:bg-gray-800/50 dark:border-gray-700">
              <div className="bg-navy/5 dark:bg-gray-900 h-48 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-gold mx-auto mb-2" />
                  <p className="text-sm font-semibold text-navy dark:text-white">123 Justice Avenue</p>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">Washington, DC 20001</p>
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                {[
                  { icon: Phone, label: 'Call Us', value: '(800) 555-0199', href: 'tel:8005550199' },
                  { icon: Mail, label: 'Email', value: 'info@claimguardpro.com', href: 'mailto:info@claimguardpro.com' },
                  { icon: Clock, label: 'Office Hours', value: 'Mon-Fri: 8AM-8PM EST\nSat: 9AM-5PM EST', href: '' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0"><item.icon className="w-5 h-5 text-gold" /></div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm font-medium text-navy dark:text-gray-200 hover:text-gold transition-colors">{item.value}</a>
                      ) : (
                        <p className="text-sm font-medium text-navy dark:text-gray-200 whitespace-pre-line">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-navy dark:bg-gray-900 text-white border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <HeadphonesIcon className="w-8 h-8 text-gold mx-auto mb-3" />
                <h4 className="font-bold text-lg mb-1">Need Immediate Help?</h4>
                <p className="text-white/60 text-sm mb-4">Our specialists are standing by 24/7.</p>
                <a href="tel:8005550199" className="block w-full bg-gold hover:bg-gold-dark text-white font-semibold py-3 rounded-lg transition-colors mb-3"><Phone className="w-4 h-4 inline mr-2" />(800) 555-0199</a>
                <a href="mailto:info@claimguardpro.com" className="block w-full bg-white/10 hover:bg-white/15 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"><Mail className="w-4 h-4 inline mr-2" />info@claimguardpro.com</a>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800/50 border-0 shadow-md dark:border-gray-700">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0"><Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /></div>
                  <div>
                    <h4 className="font-bold text-navy dark:text-gray-100 text-sm mb-1">Our Response Guarantee</h4>
                    <ul className="space-y-1.5 text-xs text-muted-foreground dark:text-gray-400">
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" />Email: Response within 2 hours</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" />Phone: Connect within 30 seconds</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" />Chat: Instant during business hours</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" />Claims: Status update within 24 hours</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: FOOTER (WITH LEGAL DIALOGS)
   ═══════════════════════════════════════════════════════════════ */

function Footer() {
  const scrollTo = useCallback((id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  return (
    <>
      <footer className="bg-navy-dark dark:bg-gray-950 text-white">
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: 'Secure & Encrypted', desc: '256-bit SSL encryption protects all your data' },
                { icon: CheckCircle2, title: 'No Upfront Fees', desc: 'We only get paid if your claim succeeds' },
                { icon: Award, title: 'BBB A+ Rated', desc: 'Accredited by the Better Business Bureau since 2012' },
                { icon: Users, title: 'Expert Team', desc: '50+ specialists dedicated to your claim' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0"><item.icon className="w-5 h-5 text-gold" /></div>
                  <div><p className="text-sm font-semibold text-white">{item.title}</p><p className="text-xs text-white/40">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gold/20 flex items-center justify-center"><Shield className="w-5 h-5 text-gold" /></div>
                <span className="text-lg font-bold">Claim<span className="text-gold">Guard</span> Pro</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-4">Your trusted partner in mass tort claims recovery. Guiding claimants to fair compensation since 2009.</p>
              <div className="flex gap-3">
                {[Facebook, Twitter, Linkedin, Instagram, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-gold/20 flex items-center justify-center transition-colors" aria-label={`Visit our ${['Facebook', 'Twitter', 'LinkedIn', 'Instagram', 'YouTube'][i]} page`}>
                    <Icon className="w-4 h-4 text-white/60 hover:text-gold" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-gold">Quick Links</h4>
              <div className="space-y-2">
                {[
                  { label: 'Track My Claim', href: '#track-claim' },
                  { label: 'Eligibility Quiz', href: '#eligibility-quiz' },
                  { label: 'Our Services', href: '#services' },
                  { label: 'Claims We Handle', href: '#what-we-handle' },
                  { label: 'FAQ', href: '#faq' },
                  { label: 'Case Studies', href: '#case-studies' },
                  { label: 'Contact Us', href: '#contact' },
                  { label: 'Newsletter', href: '#newsletter' },
                ].map(link => (
                  <button key={link.href + link.label} onClick={() => scrollTo(link.href)} className="block text-sm text-white/50 hover:text-gold transition-colors text-left">{link.label}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-gold">Practice Areas</h4>
              <div className="space-y-2">
                {['Camp Lejeune', 'Roundup', 'Talc / Baby Powder', 'Hernia Mesh', 'Paraquat', 'Firefighting Foam'].map(area => (
                  <p key={area} className="text-sm text-white/50">{area}</p>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-gold">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" /><span className="text-sm text-white/50">123 Justice Avenue<br />Washington, DC 20001</span></div>
                <a href="tel:8005550199" className="flex items-center gap-2 text-sm text-white/50 hover:text-gold transition-colors"><Phone className="w-4 h-4 text-gold" />(800) 555-0199</a>
                <a href="mailto:info@claimguardpro.com" className="flex items-center gap-2 text-sm text-white/50 hover:text-gold transition-colors"><Mail className="w-4 h-4 text-gold" />info@claimguardpro.com</a>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {['BBB A+', 'HIPAA', 'NATA'].map(badge => (
                  <span key={badge} className="px-2 py-1 rounded text-xs bg-white/5 text-white/40 border border-white/10">{badge}</span>
                ))}
              </div>
            </div>
          </div>
          <Separator className="bg-white/10 my-10" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30 text-center md:text-left">
              © {new Date().getFullYear()} ClaimGuard Pro. All rights reserved. This website is for informational purposes only and does not constitute legal advice.
            </p>
            <div className="flex gap-4 text-xs text-white/30">
              <button onClick={() => setPrivacyOpen(true)} className="hover:text-gold transition-colors">Privacy Policy</button>
              <button onClick={() => setTermsOpen(true)} className="hover:text-gold transition-colors">Terms of Service</button>
              <button onClick={() => setDisclaimerOpen(true)} className="hover:text-gold transition-colors">Disclaimer</button>
            </div>
          </div>
          <p className="text-center text-xs text-white/20 mt-6 max-w-4xl mx-auto leading-relaxed">
            Attorney Advertising. Prior results do not guarantee a similar outcome. The information on this site is not legal advice. ClaimGuard Pro is not a law firm.
          </p>
        </div>
      </footer>

      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] bg-white dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader><DialogTitle className="text-navy dark:text-white">Privacy Policy</DialogTitle><DialogDescription className="text-muted-foreground dark:text-gray-400">Last Updated: January 2025</DialogDescription></DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="text-sm text-muted-foreground dark:text-gray-300 leading-relaxed whitespace-pre-line">{PRIVACY_POLICY_TEXT}</div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] bg-white dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader><DialogTitle className="text-navy dark:text-white">Terms of Service</DialogTitle><DialogDescription className="text-muted-foreground dark:text-gray-400">Last Updated: January 2025</DialogDescription></DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="text-sm text-muted-foreground dark:text-gray-300 leading-relaxed whitespace-pre-line">{TERMS_OF_SERVICE_TEXT}</div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={disclaimerOpen} onOpenChange={setDisclaimerOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] bg-white dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader><DialogTitle className="text-navy dark:text-white">Legal Disclaimer</DialogTitle></DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="text-sm text-muted-foreground dark:text-gray-300 leading-relaxed whitespace-pre-line">{DISCLAIMER_TEXT}</div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: FLOATING LIVE CHAT WIDGET (AI-POWERED)
   ═══════════════════════════════════════════════════════════════ */

interface ChatMessage { id: number; text: string; sender: 'bot' | 'user'; }

function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, text: "Hi! I'm the AI Claims Assistant. How can I help you with your claim today?", sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && chatInputRef.current) {
      setTimeout(() => chatInputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: Date.now(), text: text.trim(), sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setMsgCount(c => c + 1);
    setIsTyping(true);

    const typingStart = Date.now();
    try {
      const history = messages.slice(-10).map(m => ({ role: m.sender === 'bot' ? 'assistant' : 'user', content: m.text }));
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), history }),
      });
      const data = await res.json();
      const elapsed = Date.now() - typingStart;
      const minDelay = Math.max(0, 1500 - elapsed);

      setTimeout(() => {
        const botMsg: ChatMessage = { id: Date.now() + 1, text: data.reply || "Thank you for your message. A specialist will respond shortly. For immediate help, call (800) 555-0199.", sender: 'bot' };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
      }, minDelay);
    } catch {
      const elapsed = Date.now() - typingStart;
      const minDelay = Math.max(0, 1500 - elapsed);
      setTimeout(() => {
        const fallbackMsg: ChatMessage = { id: Date.now() + 1, text: "I'm sorry, I'm having trouble connecting. Please try again or call us at (800) 555-0199 for immediate assistance.", sender: 'bot' };
        setMessages(prev => [...prev, fallbackMsg]);
        setIsTyping(false);
      }, minDelay);
    }
  }, [messages]);

  const quickReplies = useMemo(() => ['Track My Claim', 'Check Eligibility', 'Talk to Agent', 'FAQ', 'Camp Lejeune Info', 'File a Claim'], []);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              onClick={() => setIsOpen(true)}
              className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
              style={{ background: 'linear-gradient(135deg, #C5A55A, #A88A3F)' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Open live chat support"
            >
              {msgCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-chat-pulse">{msgCount}</span>
              )}
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="left"><p>AI Claims Assistant</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 w-[calc(100vw-2rem)] h-[70vh] max-w-[400px] max-h-[550px] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            role="dialog"
            aria-label="Live chat window"
          >
            <div className="bg-navy dark:bg-gray-900 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center"><HeadphonesIcon className="w-5 h-5 text-gold" /></div>
                <div>
                  <p className="text-white font-semibold text-sm">AI Claims Assistant</p>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
                    <span className="text-white/60 text-xs">AI Powered</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors p-1" aria-label="Close chat">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 chat-scrollbar bg-gray-50 dark:bg-gray-900" aria-live="polite">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} chat-message-enter`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-navy dark:bg-gold text-white dark:text-navy rounded-br-md' : 'bg-white dark:bg-gray-800 text-navy dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700 rounded-bl-md'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {messages.length <= 2 && (
              <div className="px-3 py-2 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-2 overflow-x-auto">
                {quickReplies.map(reply => (
                  <button key={reply} onClick={() => sendMessage(reply)} className="shrink-0 px-3 py-1.5 rounded-full bg-gold/10 text-gold-dark dark:text-gold-light text-xs font-medium hover:bg-gold/20 transition-colors border border-gold/20">
                    {reply}
                  </button>
                ))}
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 p-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center mb-2">AI assistant powered by ClaimGuard Pro. For legal advice, consult a qualified attorney.</p>
              <div className="flex gap-2">
                <Input
                  ref={chatInputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                  placeholder="Type your message..."
                  className="flex-1 h-10 text-sm border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <Button onClick={() => sendMessage(input)} size="icon" className="h-10 w-10 bg-gold hover:bg-gold-dark shrink-0" aria-label="Send message">
                  <Send className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: BACK TO TOP BUTTON
   ═══════════════════════════════════════════════════════════════ */

const BackToTopButton = memo(function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let ticking = false;
    const handler = () => {
      if (!ticking) {
        requestAnimationFrame(() => { setVisible(window.scrollY > 400); ticking = false; });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollToTop = useCallback(() => window.scrollTo({ top: 0, behavior: 'smooth' }), []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-50 w-11 h-11 rounded-full bg-gold hover:bg-gold-dark text-white shadow-lg flex items-center justify-center transition-colors"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
});

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: COOKIE CONSENT BANNER
   ═══════════════════════════════════════════════════════════════ */

function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('claimguard-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = useCallback(() => {
    localStorage.setItem('claimguard-cookie-consent', 'accepted');
    setVisible(false);
  }, []);

  const handleDecline = useCallback(() => {
    localStorage.setItem('claimguard-cookie-consent', 'declined');
    setVisible(false);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[60]"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0"><Shield className="w-5 h-5 text-gold" /></div>
                <div>
                  <p className="text-sm font-semibold text-navy dark:text-white mb-1">Cookie Notice</p>
                  <p className="text-xs text-muted-foreground dark:text-gray-400 leading-relaxed">
                    We use cookies to improve your experience and analyze site traffic. By continuing to use our site, you agree to our{' '}
                    <button onClick={() => setPrivacyOpen(true)} className="text-gold underline hover:text-gold-dark">Privacy Policy</button>
                    {' '}and{' '}
                    <button onClick={() => setTermsOpen(true)} className="text-gold underline hover:text-gold-dark">Terms of Service</button>.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0 self-end sm:self-center">
                <Button onClick={handleDecline} variant="outline" size="sm" className="text-xs h-9 border-gray-300 dark:border-gray-600 dark:text-gray-300">Decline Non-Essential</Button>
                <Button onClick={handleAccept} size="sm" className="text-xs h-9 bg-gold hover:bg-gold-dark text-white font-semibold">Accept All Cookies</Button>
              </div>
            </div>
          </div>

          <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] bg-white dark:bg-gray-800 dark:border-gray-700">
              <DialogHeader><DialogTitle className="text-navy dark:text-white">Privacy Policy</DialogTitle></DialogHeader>
              <ScrollArea className="max-h-[60vh] pr-4"><div className="text-sm text-muted-foreground dark:text-gray-300 leading-relaxed whitespace-pre-line">{PRIVACY_POLICY_TEXT}</div></ScrollArea>
            </DialogContent>
          </Dialog>

          <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] bg-white dark:bg-gray-800 dark:border-gray-700">
              <DialogHeader><DialogTitle className="text-navy dark:text-white">Terms of Service</DialogTitle></DialogHeader>
              <ScrollArea className="max-h-[60vh] pr-4"><div className="text-sm text-muted-foreground dark:text-gray-300 leading-relaxed whitespace-pre-line">{TERMS_OF_SERVICE_TEXT}</div></ScrollArea>
            </DialogContent>
          </Dialog>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function HomePage() {
  return (
    <>
      <a href="#hero" className="skip-to-content">
        Skip to main content
      </a>
      <main id="main-content" className="min-h-screen flex flex-col">
        <CountdownBanner />
        <Navbar />
        <HeroSection />
        <TrustedBySection />
        <HowItWorksSection />
        <ServicesSection />
        <WhyDifferentSection />
        <EligibilityQuizSection />
        <WhyChooseUsSection />
        <TestimonialsSection />
        <TrackClaimSection />
        <WhatWeHandleSection />
        <CTASection />
        <FAQSection />
        <CaseStudiesSection />
        <NewsletterSection />
        <AboutSection />
        <ContactSection />
        <Footer />
        <LiveChatWidget />
        <BackToTopButton />
        <CookieConsentBanner />
      </main>
    </>
  );
}
