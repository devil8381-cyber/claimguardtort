'use client';

import { useState, useEffect, useRef, useCallback, useMemo, type FormEvent, memo, type ReactNode } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
// Dark mode only — theme toggle removed
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
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
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
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n';
import { REFILE_REASONS, REFILE_REASONS_COUNT } from '@/lib/refile-reasons';
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
  UserPlus,
  HeadphonesIcon,
  Scale,
  Award,
  Home,
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
  BookOpen,
  Target,
  Zap,
  ChevronLeft,
  Leaf,
  Baby,
  Car,
  Gamepad2,
  Pill,
  AlertTriangle,
  Activity,
  Heart,
  Brain,
  Globe,
  Play,
  Pause,
  Video,
  ExternalLink,

  Trash2,
  Plus,
  LayoutDashboard,
  BarChart3,
  Bell,
  RefreshCw,
  Facebook,
  Linkedin,
  Twitter,
  Cookie,
  FileDown,
  HandHeart,
  Calculator,
  FileUp,
  Database,
  ChevronRight as ChevronRightIcon,
  UsersRound,
  CircleDot,
  Filter,
  SortAsc,
  XCircle,
  DownloadCloud,
  FileSpreadsheet,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS & DATA
   ═══════════════════════════════════════════════════════════════ */

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Services', href: '#services' },
  { label: 'Eligibility Quiz', href: '#eligibility-quiz' },
  { label: 'Calculator', href: '#settlement-calculator' },
  { label: 'Track Claim', href: '#track-claim' },
  { label: 'Resources', href: '#resources' },
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
  'Paraquat', 'Firefighting Foam (AFFF)', 'Zantac', 'Hair Relaxer',
  'CPAP Machines', 'Social Media Lawsuits', 'Rideshare Assault',
  'NEC Baby Formula', 'Depo Provera', 'Roblox / Gaming', 'IL Detention',
  '3M Earplugs', 'Exactech Implants', 'Bard PowerPort',
  'Elmiron', 'Taxotere',
];

const TRUST_BADGES = [
  'Secure & Encrypted', '100% Free Service', 'No Hidden Costs',
  '24/7 Support', 'HIPAA Compliant', 'BBB Accredited',
  'Expert Legal Team', 'Fast Processing', '100% Confidential',
  'Proven Track Record', 'Dedicated Specialist', 'Nationwide Service',
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

const STATS_DATA = (() => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const seed = dayOfYear + today.getFullYear() * 366;
  const rand = (offset: number) => {
    const x = Math.sin(seed + offset * 7.3) * 10000;
    return x - Math.floor(x);
  };
  return [
    { icon: Users, value: Math.floor(1200 + rand(10) * 350), suffix: '+', label: 'Claims Assisted', progress: 92 },
    { icon: Award, value: Math.floor(96 + rand(11) * 3), suffix: '%', label: 'Success Rate', progress: 98 },
    { icon: DollarSign, value: Math.floor(45 + rand(12) * 8), suffix: 'M+', label: 'Recovered', prefix: '$', progress: 85 },
    { icon: CalendarDays, value: 15, suffix: '+', label: 'Years Experience', progress: 88 },
    { icon: HeadphonesIcon, value: 24, suffix: '/7', label: 'Dedicated Support', progress: 100 },
    { icon: Lock, value: 100, suffix: '%', label: 'Secure & Confidential', progress: 100 },
  ];
})();

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
  { q: 'Is ClaimGuard Pro really free?', a: 'Yes, ClaimGuard Pro is completely free. Every service we offer — from claim tracking and status checks to document correction, eligibility assessments, and personalized support — is provided at no cost to you, ever. We are funded through grants and legal partnerships to ensure every claimant has access to the help they need regardless of their financial situation.' },
  { q: 'Is my information secure?', a: 'Absolutely. We use bank-level 256-bit encryption to protect all your personal and medical information. Our systems are HIPAA-compliant and undergo regular security audits. We never share your information without your explicit consent.' },
  { q: 'How do I check my claim status?', a: 'You can check your claim status anytime using our Track My Claim feature. Simply enter your tracking ID (e.g., CLM-2024-001) and you will instantly see your current status, progress, claim history, and any required actions.' },
];

const CASE_STUDIES = [
  { name: 'Margaret H.', caseType: 'Camp Lejeune Water Contamination', badge: 'bg-blue-500', challenge: 'Margaret was stationed at Camp Lejeune for 3 years and developed a rare form of kidney disease. Her initial claim was denied due to incomplete medical records linking her condition to the contaminated water supply.', solution: 'Our team worked with Margaret to obtain comprehensive medical opinions, gathered additional service records, and built a detailed timeline of her exposure. We identified key military health records that had been overlooked.', outcome: "After a 6-month appeals process, Margaret's claim was approved with a significant settlement. She received her payment within 90 days of approval. Specific results vary per case.", compensation: 'Significant Settlement', beforeStatus: 'Denied', afterStatus: 'Approved' },
  { name: 'Thomas J.', caseType: 'Roundup (Glyphosate) Exposure', badge: 'bg-emerald-500', challenge: 'Thomas, a farmer for 25 years, developed non-Hodgkin lymphoma after decades of Roundup use. His claim was stuck in "Correction Needed" for 8 months due to missing purchase records.', solution: 'We helped Thomas compile decades of agricultural supply invoices, secured supporting medical opinions from two oncologists, and corrected multiple form errors in his original submission.', outcome: "Thomas's corrected claim was approved, and he received a substantial recovery. Specific results vary per case.", compensation: 'Substantial Recovery', beforeStatus: 'Correction Needed', afterStatus: 'Approved' },
  { name: 'Dorothy K.', caseType: 'Talcum Powder / Ovarian Cancer', badge: 'bg-purple-500', challenge: 'Dorothy used talcum powder products for over 40 years before being diagnosed with ovarian cancer. Her claim was pending for 14 months with no updates.', solution: "Our team escalated Dorothy's case with the claims administrator, identified the processing bottleneck (a missing pathology report), and facilitated expedited review of her complete medical file.", outcome: "Dorothy's claim was moved to active review within 2 weeks and was approved 3 months later with a favorable outcome. Specific results vary per case.", compensation: 'Favorable Outcome', beforeStatus: 'Pending (14 months)', afterStatus: 'Approved' },
];

const TEAM_MEMBERS = [
  { name: 'Sarah Mitchell', role: 'Founder & Lead Attorney', color: 'bg-blue-500', initials: 'SM', bio: 'Former government attorney with 20+ years of mass tort litigation experience.' },
  { name: 'David Chen', role: 'Senior Claims Analyst', color: 'bg-emerald-500', initials: 'DC', bio: 'Expert in claims processing and document analysis. Extensive experience reviewing mass tort claims.' },
  { name: 'Jessica Rodriguez', role: 'Client Relations Director', color: 'bg-purple-500', initials: 'JR', bio: 'Passionate advocate for claimants\' rights. Manages our 24/7 support team.' },
  { name: 'Michael Thompson', role: 'Document Specialist', color: 'bg-amber-500', initials: 'MT', bio: 'Detail-oriented paralegal specializing in document correction. High success rate in claim corrections.' },
  { name: 'Emily Watson', role: 'Legal Strategy Advisor', color: 'bg-rose-500', initials: 'EW', bio: 'Skilled attorney specializing in settlement negotiation. Helped clients recover substantial compensation.' },
  { name: 'Marcus Johnson', role: 'Technology Director', color: 'bg-teal-500', initials: 'MJ', bio: 'Built our proprietary claim tracking system. Ensures reliable platform performance.' },
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
  { title: 'Rideshare Assault & Safety', description: 'For individuals who experienced assault, injury, or safety failures during Uber, Lyft, or other rideshare trips due to driver negligence or inadequate background checks.', icon: Car, color: 'bg-indigo-500', deadline: 'Varies by state', statuses: ['Pending', 'Settled', 'Active'], detail: 'Rideshare companies face mounting liability for inadequate driver vetting and insufficient safety measures. Victims of assault or injury during rideshare trips may be entitled to compensation from both the driver and the platform company.' },
  { title: 'NEC Baby Formula', description: "For families whose premature infants developed necrotizing enterocolitis (NEC) after being fed cow's milk-based formula in NICUs.", icon: Baby, color: 'bg-cyan-500', deadline: 'Ongoing', statuses: ['Pending', 'Settled', 'Approved'], detail: "Studies have shown that cow's milk-based formula significantly increases NEC risk in premature infants compared to human breast milk. Major manufacturers failed to adequately warn hospitals and parents about these dangers." },
  { title: 'Depo Provera (Medroxyprogesterone)', description: 'For individuals who developed brain tumors (meningiomas) or other serious conditions after using the Depo Provera contraceptive injection.', icon: Pill, color: 'bg-orange-500', deadline: 'Ongoing', statuses: ['Pending', 'Under Review', 'Approved'], detail: 'Recent studies have linked the Depo Provera birth control shot to significantly increased risk of meningioma brain tumors. Users who developed tumors after prolonged use may be eligible for compensation.' },
  { title: 'Social Media Mental Health', description: 'For families and individuals harmed by addictive social media algorithms that caused eating disorders, self-harm, anxiety, depression, or suicide in children and teens.', icon: Users, color: 'bg-pink-500', deadline: 'Ongoing', statuses: ['Pending', 'Active', 'Settled'], detail: 'Internal documents reveal that social media companies knew their platforms were harmful to young users but prioritized engagement over safety. Multi-district litigation is moving forward against Meta, TikTok, Snap, and others.' },
  { title: 'Immigration Detention (IL Detention)', description: 'For individuals who suffered harm, abuse, or rights violations in immigration detention centers, including unsafe conditions, medical neglect, or wrongful detention.', icon: Lock, color: 'bg-slate-500', deadline: 'Varies', statuses: ['Pending', 'Settled', 'Active'], detail: 'Immigration detention facilities have faced numerous lawsuits over inhumane conditions, medical negligence, excessive force, and due process violations. Detainees have successfully pursued claims for damages and policy reform.' },
  { title: 'Roblox / Gaming Microtransactions', description: 'For parents and families whose children made unauthorized in-app purchases through deceptive game design, dark patterns, or lack of age verification on platforms like Roblox.', icon: Gamepad2, color: 'bg-red-500', deadline: 'Ongoing', statuses: ['Pending', 'Active'], detail: 'Gaming platforms face increasing legal scrutiny over manipulative design patterns targeting children, including loot boxes, virtual currencies, and pressure tactics that encourage excessive spending without parental consent.' },
  { title: 'Zantac (Ranitidine)', description: 'For individuals who developed cancer after long-term use of Zantac or generic ranitidine, which was found to contain NDMA, a probable human carcinogen.', icon: AlertTriangle, color: 'bg-violet-500', deadline: 'Varies by state', statuses: ['Pending', 'Under Review', 'Approved'], detail: 'The FDA recalled all ranitidine products in 2020 after discovering they could form NDMA, a known carcinogen. Long-term users who developed cancers of the stomach, liver, bladder, or other organs may qualify for compensation.' },
  { title: 'Hair Relaxer / Chemical Hair Straightener', description: 'For individuals who developed uterine cancer, ovarian cancer, endometrial cancer, or fibroids after using chemical hair relaxer products.', icon: Sparkles, color: 'bg-fuchsia-500', deadline: 'Ongoing', statuses: ['Pending', 'Under Review'], detail: 'NIH research found that women who frequently used chemical hair straighteners were more than twice as likely to develop uterine cancer. Major manufacturers face lawsuits for failing to warn consumers about cancer risks linked to endocrine-disrupting chemicals.' },
  { title: 'CPAP Machines (Philips Recall)', description: 'For individuals who used recalled Philips CPAP, BiPAP, or ventilator devices with defective sound abatement foam that degraded and released harmful particles and chemicals.', icon: Activity, color: 'bg-sky-500', deadline: 'Ongoing', statuses: ['Pending', 'Approved', 'Under Review'], detail: 'Philips recalled millions of sleep apnea devices after discovering the PE-PUR foam could break down and release black particles and volatile organic compounds into the airway. Users who developed respiratory issues, cancer, or other conditions may be eligible.' },
  { title: '3M Combat Earplugs', description: 'For military veterans who suffered hearing loss or tinnitus due to defective 3M dual-ended combat earplugs that were too short for proper insertion.', icon: Shield, color: 'bg-lime-500', deadline: 'Varies', statuses: ['Pending', 'Approved', 'Settled'], detail: '3M agreed to a multi-billion dollar settlement over defective combat earplugs issued to service members between 2003-2015. The earplugs\' design defect allowed them to loosen during use, failing to protect against loud battlefield noises.' },
  { title: 'Exactech Joint Implants', description: 'For patients who received recalled Exactech ankle, knee, or hip replacement implants with defective packaging that caused premature oxidation and failure.', icon: Target, color: 'bg-stone-500', deadline: 'Ongoing', statuses: ['Pending', 'Under Review', 'Correction Needed'], detail: 'Exactech recalled thousands of joint replacement systems after discovering that their vacuum-sealed packaging failed, allowing oxygen to degrade the polyethylene inserts. This caused premature device failure, bone loss, and the need for revision surgeries.' },
  { title: 'Bard PowerPort', description: 'For patients who received Bard PowerPort implantable catheter devices that fractured, migrated, or caused blood clots, infections, or other serious complications.', icon: Shield, color: 'bg-red-500', deadline: 'Ongoing', statuses: ['Pending', 'Under Review', 'Approved'], detail: 'Bard PowerPort devices have been linked to catheter fractures, migration, and severe infections. The devices can break apart inside the body, sending plastic fragments through the bloodstream. Claimants who required surgical removal or experienced complications may be eligible for compensation.' },
  { title: 'Elmiron (Pentosan Polysulfate)', description: 'For individuals who developed vision problems, macular damage, or retinal disease after long-term use of Elmiron for interstitial cystitis.', icon: Eye, color: 'bg-yellow-500', deadline: 'Ongoing', statuses: ['Pending', 'Under Review'], detail: 'Studies have linked long-term Elmiron use to a unique form of maculopathy that can cause permanent vision damage. Patients who took Elmiron for more than two years and developed retinal pigmentary changes or vision loss may qualify.' },
  { title: 'Taxotere (Docetaxel)', description: 'For individuals who experienced permanent hair loss (alopecia) after receiving Taxotere chemotherapy treatment for breast cancer.', icon: Leaf, color: 'bg-green-500', deadline: 'Varies by state', statuses: ['Pending', 'Approved', 'Denied'], detail: 'Sanofi-Aventis failed to adequately warn patients and physicians that Taxotere could cause permanent, irreversible hair loss. While temporary hair loss is common with chemotherapy, Taxotere causes permanent alopecia at significantly higher rates than alternative treatments.' },
];

const COMPARISON_DATA = [
  { feature: 'Real-Time Claim Tracking', us: { label: 'Instant tracking with pipeline visualization', has: true }, others: { label: 'Manual status checks via phone', has: false } },
  { feature: 'Document Correction Support', us: { label: 'Expert review + correction + re-filing', has: true }, others: { label: 'Self-service or no support', has: false } },
  { feature: 'Eligibility Assessment', us: { label: 'Free interactive quiz + expert review', has: true }, others: { label: 'Basic checklist only', has: false } },
  { feature: 'Dedicated Specialist', us: { label: 'Assigned claim specialist for your case', has: true }, others: { label: 'General support line', has: false } },
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
Phone: (484) 968-1529
Address: 1429 Walnut St, 14th Floor, Philadelphia, PA 19102`;

const TERMS_OF_SERVICE_TEXT = `Terms of Service for ClaimGuard Pro

Last Updated: January 2025

1. Services

ClaimGuard Pro provides mass tort claim assistance services including claim tracking, document correction support, eligibility assessment, and referral to qualified legal professionals. Our services are designed to assist claimants in navigating the complex mass tort claims process.

2. Important Disclaimers

ClaimGuard Pro is NOT a law firm and does not provide legal advice. The information on this website is for general informational purposes only. Nothing on this website should be construed as legal advice or create an attorney-client relationship.

Prior results described on this website do not guarantee a similar outcome for any individual case. Case results depend on many factors unique to each claim.

3. Limitations of Liability

To the maximum extent permitted by law, ClaimGuard Pro shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services or website. Our total liability shall not exceed the value of services provided to you.

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
Phone: (484) 968-1529
Address: 1429 Walnut St, 14th Floor, Philadelphia, PA 19102`;

/* ═══════════════════════════════════════════════════════════════
   SOCIAL PROOF GENERATOR — ~10,000+ Unique Combinations
   Combinatorial: names × cities × actions × case types × times
   ═══════════════════════════════════════════════════════════════ */

const SP_FIRST_NAMES = [
  'James','Robert','John','Michael','David','William','Richard','Joseph','Thomas','Charles',
  'Christopher','Daniel','Matthew','Anthony','Mark','Donald','Steven','Paul','Andrew','Joshua',
  'Kenneth','Kevin','Brian','George','Timothy','Ronald','Edward','Jason','Jeffrey','Ryan',
  'Jacob','Gary','Nicholas','Eric','Jonathan','Stephen','Larry','Justin','Scott','Brandon',
  'Benjamin','Samuel','Raymond','Gregory','Frank','Alexander','Patrick','Jack','Dennis','Jerry',
  'Tyler','Aaron','Jose','Adam','Nathan','Henry','Douglas','Peter','Zachary','Kyle',
  'Mary','Patricia','Jennifer','Linda','Barbara','Elizabeth','Susan','Jessica','Sarah','Karen',
  'Lisa','Nancy','Betty','Margaret','Sandra','Ashley','Dorothy','Kimberly','Emily','Donna',
  'Michelle','Carol','Amanda','Melissa','Deborah','Stephanie','Rebecca','Sharon','Laura','Cynthia',
  'Kathleen','Amy','Angela','Shirley','Anna','Brenda','Pamela','Emma','Nicole','Helen',
  'Samantha','Katherine','Christine','Debra','Rachel','Carolyn','Janet','Catherine','Maria','Heather',
  'Diane','Ruth','Julie','Olivia','Joyce','Virginia','Victoria','Kelly','Lauren','Christina',
];

const SP_LAST_INITIALS = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

const SP_CITIES = [
  { city: 'Houston', st: 'TX' },  { city: 'Phoenix', st: 'AZ' },  { city: 'San Antonio', st: 'TX' },
  { city: 'San Diego', st: 'CA' },  { city: 'Dallas', st: 'TX' },  { city: 'San Jose', st: 'CA' },
  { city: 'Austin', st: 'TX' },  { city: 'Jacksonville', st: 'FL' },  { city: 'Fort Worth', st: 'TX' },
  { city: 'Columbus', st: 'OH' },  { city: 'Charlotte', st: 'NC' },  { city: 'San Francisco', st: 'CA' },
  { city: 'Indianapolis', st: 'IN' },  { city: 'Seattle', st: 'WA' },  { city: 'Denver', st: 'CO' },
  { city: 'Washington', st: 'DC' },  { city: 'Nashville', st: 'TN' },  { city: 'Oklahoma City', st: 'OK' },
  { city: 'El Paso', st: 'TX' },  { city: 'Boston', st: 'MA' },  { city: 'Portland', st: 'OR' },
  { city: 'Las Vegas', st: 'NV' },  { city: 'Memphis', st: 'TN' },  { city: 'Louisville', st: 'KY' },
  { city: 'Baltimore', st: 'MD' },  { city: 'Milwaukee', st: 'WI' },  { city: 'Albuquerque', st: 'NM' },
  { city: 'Tucson', st: 'AZ' },  { city: 'Fresno', st: 'CA' },  { city: 'Sacramento', st: 'CA' },
  { city: 'Mesa', st: 'AZ' },  { city: 'Atlanta', st: 'GA' },  { city: 'Kansas City', st: 'MO' },
  { city: 'Colorado Springs', st: 'CO' },  { city: 'Raleigh', st: 'NC' },  { city: 'Omaha', st: 'NE' },
  { city: 'Miami', st: 'FL' },  { city: 'Long Beach', st: 'CA' },  { city: 'Virginia Beach', st: 'VA' },
  { city: 'Oakland', st: 'CA' },  { city: 'Minneapolis', st: 'MN' },  { city: 'Tulsa', st: 'OK' },
  { city: 'Arlington', st: 'TX' },  { city: 'Tampa', st: 'FL' },  { city: 'New Orleans', st: 'LA' },
  { city: 'Wichita', st: 'KS' },  { city: 'Cleveland', st: 'OH' },  { city: 'Pittsburgh', st: 'PA' },
  { city: 'Cincinnati', st: 'OH' },  { city: 'St. Louis', st: 'MO' },  { city: 'Salt Lake City', st: 'UT' },
  { city: 'Huntsville', st: 'AL' },  { city: 'Boise', st: 'ID' },  { city: 'Greenville', st: 'SC' },
  { city: 'Knoxville', st: 'TN' },  { city: 'Chattanooga', st: 'TN' },  { city: 'Mobile', st: 'AL' },
  { city: 'Savannah', st: 'GA' },  { city: 'Richmond', st: 'VA' },  { city: 'Spokane', st: 'WA' },
  { city: 'Reno', st: 'NV' },  { city: 'Biloxi', st: 'MS' },  { city: 'Charleston', st: 'SC' },
  { city: 'Columbia', st: 'SC' },  { city: 'Montgomery', st: 'AL' },  { city: 'Jackson', st: 'MS' },
  { city: 'Little Rock', st: 'AR' },  { city: 'Dayton', st: 'OH' },  { city: 'Wilmington', st: 'DE' },
  { city: 'Harrisburg', st: 'PA' },  { city: 'Hartford', st: 'CT' },  { city: 'Providence', st: 'RI' },
  { city: 'Des Moines', st: 'IA' },  { city: 'Madison', st: 'WI' },  { city: 'Lansing', st: 'MI' },
  { city: 'Cheyenne', st: 'WY' },  { city: 'Bismarck', st: 'ND' },  { city: 'Helena', st: 'MT' },
  { city: 'Pocatello', st: 'ID' },  { city: 'Salem', st: 'OR' },  { city: 'Olympia', st: 'WA' },
  { city: 'Carson City', st: 'NV' },  { city: 'Springfield', st: 'IL' },  { city: 'Jefferson City', st: 'MO' },
  { city: 'Annapolis', st: 'MD' },  { city: 'Trenton', st: 'NJ' },  { city: 'Dover', st: 'DE' },
  { city: 'Concord', st: 'NH' },  { city: 'Augusta', st: 'ME' },  { city: 'Montpelier', st: 'VT' },
  { city: 'Albany', st: 'NY' },  { city: 'Scranton', st: 'PA' },  { city: 'Pierre', st: 'SD' },
  { city: 'Frankfort', st: 'KY' },  { city: 'Topeka', st: 'KS' },  { city: 'Santa Fe', st: 'NM' },
  { city: 'Scottsdale', st: 'AZ' },  { city: 'Tallahassee', st: 'FL' },  { city: 'Honolulu', st: 'HI' },
  { city: 'Anchorage', st: 'AK' },  { city: 'Fairbanks', st: 'AK' },  { city: 'Burlington', st: 'VT' },
  { city: 'Portland', st: 'ME' },  { city: 'Manchester', st: 'NH' },  { city: 'New Haven', st: 'CT' },
  { city: 'Newark', st: 'NJ' },  { city: 'Buffalo', st: 'NY' },  { city: 'Rochester', st: 'NY' },
  { city: 'Syracuse', st: 'NY' },  { city: 'Yonkers', st: 'NY' },  { city: 'Erie', st: 'PA' },
  { city: 'Allentown', st: 'PA' },  { city: 'Reading', st: 'PA' },  { city: 'Lancaster', st: 'PA' },
  { city: 'York', st: 'PA' },  { city: 'Birmingham', st: 'AL' },  { city: 'Grand Rapids', st: 'MI' },
  { city: 'Warren', st: 'MI' },  { city: 'Sterling Heights', st: 'MI' },  { city: 'Ann Arbor', st: 'MI' },
  { city: 'Flint', st: 'MI' },  { city: 'Detroit', st: 'MI' },  { city: 'Columbus', st: 'GA' },
  { city: 'Macon', st: 'GA' },  { city: 'Athens', st: 'GA' },  { city: 'Gainesville', st: 'FL' },
  { city: 'Orlando', st: 'FL' },  { city: 'St. Petersburg', st: 'FL' },  { city: 'Fort Myers', st: 'FL' },
  { city: 'Naples', st: 'FL' },  { city: 'Pensacola', st: 'FL' },  { city: 'Baton Rouge', st: 'LA' },
  { city: 'Shreveport', st: 'LA' },  { city: 'Lafayette', st: 'LA' },  { city: 'Lake Charles', st: 'LA' },
  { city: 'Gulfport', st: 'MS' },  { city: 'Lexington', st: 'KY' },  { city: 'Bowling Green', st: 'KY' },
  { city: 'Owensboro', st: 'KY' },  { city: 'Fort Wayne', st: 'IN' },  { city: 'Evansville', st: 'IN' },
  { city: 'South Bend', st: 'IN' },  { city: 'Carmel', st: 'IN' },  { city: 'Toledo', st: 'OH' },
  { city: 'Akron', st: 'OH' },  { city: 'Canton', st: 'OH' },  { city: 'Parma', st: 'OH' },
  { city: 'Youngstown', st: 'OH' },  { city: 'Chicago', st: 'IL' },  { city: 'Aurora', st: 'IL' },
  { city: 'Rockford', st: 'IL' },  { city: 'Joliet', st: 'IL' },  { city: 'Naperville', st: 'IL' },
  { city: 'Peoria', st: 'IL' },  { city: 'Green Bay', st: 'WI' },  { city: 'Kenosha', st: 'WI' },
  { city: 'Racine', st: 'WI' },  { city: 'St. Paul', st: 'MN' },  { city: 'Rochester', st: 'MN' },
  { city: 'Duluth', st: 'MN' },  { city: 'Bloomington', st: 'MN' },  { city: 'Brooklyn Park', st: 'MN' },
  { city: 'Plymouth', st: 'MN' },  { city: 'Maple Grove', st: 'MN' },  { city: 'Sioux Falls', st: 'SD' },
  { city: 'Rapid City', st: 'SD' },  { city: 'Fargo', st: 'ND' },  { city: 'Lincoln', st: 'NE' },
  { city: 'Bellevue', st: 'NE' },  { city: 'Grand Island', st: 'NE' },  { city: 'Overland Park', st: 'KS' },
  { city: 'Kansas City', st: 'KS' },  { city: 'Olathe', st: 'KS' },  { city: 'Lawrence', st: 'KS' },
  { city: 'Norman', st: 'OK' },  { city: 'Broken Arrow', st: 'OK' },  { city: 'Edmond', st: 'OK' },
  { city: 'Corpus Christi', st: 'TX' },  { city: 'Laredo', st: 'TX' },  { city: 'Lubbock', st: 'TX' },
  { city: 'Irving', st: 'TX' },  { city: 'Plano', st: 'TX' },  { city: 'Garland', st: 'TX' },
  { city: 'Frisco', st: 'TX' },  { city: 'McKinney', st: 'TX' },  { city: 'McAllen', st: 'TX' },
  { city: 'Round Rock', st: 'TX' },  { city: 'George Town', st: 'TX' },  { city: 'Sugar Land', st: 'TX' },
  { city: 'Conroe', st: 'TX' },  { city: 'Midland', st: 'TX' },  { city: 'Odessa', st: 'TX' },
  { city: 'Abilene', st: 'TX' },  { city: 'Temple', st: 'TX' },  { city: 'Waco', st: 'TX' },
  { city: 'Killeen', st: 'TX' },  { city: 'College Station', st: 'TX' },  { city: 'Longview', st: 'TX' },
  { city: 'Tyler', st: 'TX' },  { city: 'Beaumont', st: 'TX' },  { city: 'Port Arthur', st: 'TX' },
  { city: 'Brownsville', st: 'TX' },  { city: 'Harlingen', st: 'TX' },  { city: 'Eagle Pass', st: 'TX' },
  { city: 'Del Rio', st: 'TX' },  { city: 'Uvalde', st: 'TX' },  { city: 'San Angelo', st: 'TX' },
  { city: 'Sweetwater', st: 'TX' },  { city: 'Big Spring', st: 'TX' },  { city: 'Fort Davis', st: 'TX' },
  { city: 'Marfa', st: 'TX' },  { city: 'Alpine', st: 'TX' },  { city: 'Las Cruces', st: 'NM' },
  { city: 'Rio Rancho', st: 'NM' },  { city: 'Roswell', st: 'NM' },  { city: 'Farmington', st: 'NM' },
  { city: 'Clovis', st: 'NM' },  { city: 'Hobbs', st: 'NM' },  { city: 'Aurora', st: 'CO' },
  { city: 'Fort Collins', st: 'CO' },  { city: 'Lakewood', st: 'CO' },  { city: 'Thornton', st: 'CO' },
  { city: 'Arvada', st: 'CO' },  { city: 'Westminster', st: 'CO' },  { city: 'Pueblo', st: 'CO' },
  { city: 'Boulder', st: 'CO' },  { city: 'Greeley', st: 'CO' },  { city: 'Longmont', st: 'CO' },
  { city: 'Castle Rock', st: 'CO' },  { city: 'Grand Junction', st: 'CO' },  { city: 'Durango', st: 'CO' },
  { city: 'West Valley City', st: 'UT' },  { city: 'Provo', st: 'UT' },  { city: 'West Jordan', st: 'UT' },
  { city: 'Orem', st: 'UT' },  { city: 'Ogden', st: 'UT' },  { city: 'St. George', st: 'UT' },
  { city: 'Layton', st: 'UT' },  { city: 'Logan', st: 'UT' },  { city: 'Meridian', st: 'ID' },
  { city: 'Nampa', st: 'ID' },  { city: 'Idaho Falls', st: 'ID' },  { city: 'Caldwell', st: 'ID' },
  { city: 'Twin Falls', st: 'ID' },  { city: 'Lewiston', st: 'ID' },  { city: 'Billings', st: 'MT' },
  { city: 'Missoula', st: 'MT' },  { city: 'Great Falls', st: 'MT' },  { city: 'Bozeman', st: 'MT' },
  { city: 'Butte', st: 'MT' },  { city: 'Casper', st: 'WY' },  { city: 'Laramie', st: 'WY' },
  { city: 'Gillette', st: 'WY' },  { city: 'Rock Springs', st: 'WY' },  { city: 'Sheridan', st: 'WY' },
  { city: 'Henderson', st: 'NV' },  { city: 'North Las Vegas', st: 'NV' },  { city: 'Sparks', st: 'NV' },
  { city: 'Elko', st: 'NV' },  { city: 'Fernley', st: 'NV' },  { city: 'Mesquite', st: 'NV' },
  { city: 'Peoria', st: 'AZ' },  { city: 'Chandler', st: 'AZ' },  { city: 'Glendale', st: 'AZ' },
  { city: 'Gilbert', st: 'AZ' },  { city: 'Surprise', st: 'AZ' },  { city: 'Yuma', st: 'AZ' },
  { city: 'Flagstaff', st: 'AZ' },  { city: 'Lake Havasu City', st: 'AZ' },  { city: 'Sedona', st: 'AZ' },
  { city: 'Prescott', st: 'AZ' },  { city: 'Sierra Vista', st: 'AZ' },  { city: 'Bullhead City', st: 'AZ' },
  { city: 'Nogales', st: 'AZ' },  { city: 'Douglas', st: 'AZ' },  { city: 'Los Angeles', st: 'CA' },
  { city: 'Bakersfield', st: 'CA' },  { city: 'Anaheim', st: 'CA' },  { city: 'Santa Ana', st: 'CA' },
  { city: 'Riverside', st: 'CA' },  { city: 'Stockton', st: 'CA' },  { city: 'Irvine', st: 'CA' },
  { city: 'Chula Vista', st: 'CA' },  { city: 'Fremont', st: 'CA' },  { city: 'San Bernardino', st: 'CA' },
  { city: 'Modesto', st: 'CA' },  { city: 'Fontana', st: 'CA' },  { city: 'Oxnard', st: 'CA' },
  { city: 'Moreno Valley', st: 'CA' },  { city: 'Huntington Beach', st: 'CA' },  { city: 'Glendale', st: 'CA' },
  { city: 'Santa Clarita', st: 'CA' },  { city: 'Garden Grove', st: 'CA' },  { city: 'Santa Rosa', st: 'CA' },
  { city: 'Pomona', st: 'CA' },  { city: 'Ontario', st: 'CA' },  { city: 'Lancaster', st: 'CA' },
  { city: 'Palmdale', st: 'CA' },  { city: 'Pasadena', st: 'CA' },  { city: 'Fullerton', st: 'CA' },
  { city: 'Orange', st: 'CA' },  { city: 'Hayward', st: 'CA' },  { city: 'Escondido', st: 'CA' },
  { city: 'Sunnyvale', st: 'CA' },  { city: 'Torrance', st: 'CA' },  { city: 'Sandy Springs', st: 'GA' },
  { city: 'Roswell', st: 'GA' },  { city: 'Johns Creek', st: 'GA' },  { city: 'Alpharetta', st: 'GA' },
  { city: 'Marietta', st: 'GA' },  { city: 'Smyrna', st: 'GA' },
];



const SP_ACTIONS = [
  'just filed a claim',
  'checked their claim status',
  'submitted required documents',
  'was approved for compensation',
  'completed the Eligibility Quiz',
  'started their claim assessment',
  'downloaded their claim report',
  'referred a friend for a claim',
  'requested a document review',
  'received a status update',
  'started their claim process',
  'uploaded medical records',
  'scheduled a follow-up call',
  'got matched with a specialist',
  'submitted an appeal',
  'received their settlement',
  'updated their contact info',
  'confirmed their eligibility',
  'sent in additional evidence',
  'viewed their claim timeline',
  'requested a PDF report',
  'resubmitted corrected forms',
  'checked filing deadlines',
  'signed authorization forms',
  'asked about settlement options',
  'verified their claim ID',
  'requested expedited review',
  'added notes to their file',
  'reviewed their case history',
];

const SP_CASE_TYPES = [
  'Camp Lejeune','Roundup','Talc / Baby Powder','Hernia Mesh','Paraquat',
  'Firefighting Foam','Zantac','Hair Relaxer','CPAP Machines','Social Media Lawsuits',
  'Rideshare Assault','NEC Baby Formula','Depo Provera','Roblox / Gaming','IL Detention',
  '3M Earplugs','Exactech Implants','Bard PowerPort','Elmiron','Taxotere',
  'a mass tort','a class action','a product liability','a personal injury','a toxic exposure',
];

const SP_TIME_PHRASES = [
  'just now','1 minute ago','2 minutes ago','3 minutes ago','4 minutes ago',
  '5 minutes ago','6 minutes ago','7 minutes ago','8 minutes ago','9 minutes ago',
  '10 minutes ago','11 minutes ago','12 minutes ago','13 minutes ago','14 minutes ago',
  '15 minutes ago','18 minutes ago','20 minutes ago','22 minutes ago','25 minutes ago',
  '28 minutes ago','30 minutes ago','35 minutes ago','38 minutes ago','40 minutes ago',
  '45 minutes ago','50 minutes ago','about an hour ago','1 hour ago','recently',
];

// Fisher-Yates shuffle for unbiased random ordering
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Simple seeded hash for session-based uniqueness
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0xFFFFFFFF;
  }
  return Math.abs(hash);
}

// Generate unique social proof notifications — never repeats in a session
function generateSocialProofPool(): Array<{ name: string; location: string; action: string; time: string }> {
  const sessionId = typeof window !== 'undefined'
    ? (sessionStorage.getItem('claimguard-sp-session') || `${Date.now()}-${Math.random().toString(36).slice(2)}`)
    : `${Date.now()}`;

  if (typeof window !== 'undefined') {
    sessionStorage.setItem('claimguard-sp-session', sessionId);
  }

  const seed = hashString(sessionId);
  const pool: Array<{ name: string; location: string; action: string; time: string }> = [];
  const seen = new Set<string>();

  // Shuffle all arrays using seed
  const seededShuffle = (arr: unknown[]): unknown[] => {
    const a = [...arr];
    let s = seed;
    for (let i = a.length - 1; i > 0; i--) {
      s = (s * 16807 + 12345) & 0x7FFFFFFF;
      const j = s % (i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const names = seededShuffle(SP_FIRST_NAMES) as string[];
  const initials = seededShuffle(SP_LAST_INITIALS) as string[];
  const cities = seededShuffle(SP_CITIES) as Array<{ city: string; st: string }>;
  const actions = seededShuffle(SP_ACTIONS) as string[];
  const cases = seededShuffle(SP_CASE_TYPES) as string[];
  const times = seededShuffle(SP_TIME_PHRASES) as string[];

  // Generate up to 10,000 unique combinations
  let attempts = 0;
  const maxPool = 10000;
  const maxAttempts = 200000; // safety cap

  while (pool.length < maxPool && attempts < maxAttempts) {
    const nameIdx = attempts % names.length;
    const initIdx = (attempts * 7 + 3) % initials.length;
    const cityIdx = (attempts * 13 + 5) % cities.length;
    const actionIdx = (attempts * 17 + 11) % actions.length;
    const caseIdx = (attempts * 23 + 7) % cases.length;
    const timeIdx = (attempts * 29 + 13) % times.length;

    const n = `${names[nameIdx]} ${initials[initIdx]}.`;
    const loc = `${cities[cityIdx].city}, ${cities[cityIdx].st}`;

    // Alternate between case-specific and general actions
    const includeCase = actionIdx % 3 === 0;
    const act = includeCase ? `${actions[actionIdx]} for ${cases[caseIdx]}` : actions[actionIdx];

    const key = `${n}|${loc}|${act}|${times[timeIdx]}`;

    if (!seen.has(key)) {
      seen.add(key);
      pool.push({ name: n, location: loc, action: act, time: times[timeIdx], caseType: includeCase ? cases[caseIdx] : cases[caseIdx % 5] });
    }

    attempts++;
  }

  return pool;
}

const SUCCESS_STORIES = [
  {
    name: 'Angela Torres',
    location: 'Jacksonville, NC',
    caseType: 'Camp Lejeune',
    initials: 'AT',
    avatarColor: 'from-blue-500 to-blue-700',
    quote: 'When I received the denial letter, I felt completely defeated. After 22 years of military service, dealing with kidney disease felt like a second battle I wasn\'t prepared for. ClaimGuard Pro stepped in and fought alongside me when I had nothing left to give.',
    beforeStatus: 'Denied',
    afterStatus: 'Approved',
    timeline: '6 months',
    highlight: 'Full medical expenses covered plus additional compensation',
  },
  {
    name: 'George Patterson',
    location: 'Des Moines, IA',
    caseType: 'Roundup',
    initials: 'GP',
    avatarColor: 'from-emerald-500 to-emerald-700',
    quote: 'Three years of going in circles with paperwork and phone calls. I almost gave up entirely. Their team took over and had everything sorted within months. I only wish I had found them sooner.',
    beforeStatus: 'Correction Needed',
    afterStatus: 'Approved',
    timeline: '8 months',
    highlight: 'Substantial settlement after 3 years of stalled progress',
  },
  {
    name: 'Susan Lewis',
    location: 'Scottsdale, AZ',
    caseType: 'Talcum Powder',
    initials: 'SL',
    avatarColor: 'from-purple-500 to-purple-700',
    quote: 'The document specialist caught a critical error in my pathology report submission that I never would have found on my own. That single correction saved my entire claim from being dismissed.',
    beforeStatus: 'Pending (14 months)',
    afterStatus: 'Approved',
    timeline: '4 months',
    highlight: 'Claim revived after 14 months of being stuck in review',
  },
  {
    name: 'Robert Martinez',
    location: 'Charlotte, NC',
    caseType: 'Hernia Mesh',
    initials: 'RM',
    avatarColor: 'from-amber-500 to-amber-700',
    quote: 'After my hernia mesh failed and caused a second surgery, I didn\'t know where to turn. ClaimGuard Pro connected me with the right attorney and helped build a strong case for additional compensation.',
    beforeStatus: 'Not Yet Filed',
    afterStatus: 'Approved',
    timeline: '10 months',
    highlight: 'Successful claim covering surgical revision costs and damages',
  },
  {
    name: 'Dorothy Kim',
    location: 'Fresno, CA',
    caseType: 'Paraquat',
    initials: 'DK',
    avatarColor: 'from-rose-500 to-rose-700',
    quote: 'Watching my husband struggle with Parkinson\'s after decades of farming was heartbreaking. ClaimGuard Pro helped us understand our options and navigate the claims process with compassion and expertise.',
    beforeStatus: 'Under Review',
    afterStatus: 'Approved',
    timeline: '7 months',
    highlight: 'Claim expedited with additional medical documentation support',
  },
  {
    name: 'James Caldwell',
    location: 'Norfolk, VA',
    caseType: 'Firefighting Foam',
    initials: 'JC',
    avatarColor: 'from-teal-500 to-teal-700',
    quote: 'As a firefighter for 18 years, I was exposed to AFFF regularly. When I was diagnosed with thyroid cancer, ClaimGuard Pro helped me file and track my claim through every stage of the process.',
    beforeStatus: 'Pending',
    afterStatus: 'Approved',
    timeline: '9 months',
    highlight: 'Comprehensive settlement including ongoing medical monitoring',
  },
  {
    name: 'Maria Gonzalez',
    location: 'Chicago, IL',
    caseType: 'Rideshare Assault',
    initials: 'MG',
    avatarColor: 'from-indigo-500 to-indigo-700',
    quote: 'After what happened to me during a rideshare trip, I felt scared and alone. ClaimGuard Pro connected me with support resources and helped me understand my legal rights. They treated me with dignity throughout.',
    beforeStatus: 'Not Yet Filed',
    afterStatus: 'Settled',
    timeline: '11 months',
    highlight: 'Confidential settlement with comprehensive support services',
  },
  {
    name: 'Kevin Wright',
    location: 'Springfield, MO',
    caseType: 'Depo Provera',
    initials: 'KW',
    avatarColor: 'from-orange-500 to-orange-700',
    quote: 'I trusted my doctor when they prescribed Depo Provera. When I was diagnosed with a brain tumor, I had no idea the shot could be the cause. ClaimGuard Pro helped me connect the dots and file my claim.',
    beforeStatus: 'Under Review',
    afterStatus: 'Approved',
    timeline: '8 months',
    highlight: 'Medical expenses and ongoing treatment costs covered',
  },
  {
    name: 'Patricia Nguyen',
    location: 'Houston, TX',
    caseType: 'NEC Baby Formula',
    initials: 'PN',
    avatarColor: 'from-cyan-500 to-cyan-700',
    quote: 'Our premature baby developed NEC after being given cow\'s milk-based formula in the NICU. It was the most terrifying experience of our lives. ClaimGuard Pro helped us seek accountability.',
    beforeStatus: 'Pending',
    afterStatus: 'Settled',
    timeline: '14 months',
    highlight: 'Settlement covering medical costs and long-term care needs',
  },
  {
    name: 'David Brown',
    location: 'Miami, FL',
    caseType: 'IL Detention',
    initials: 'DB',
    avatarColor: 'from-slate-500 to-slate-700',
    quote: 'I was wrongfully detained and the conditions were inhumane. ClaimGuard Pro helped me document everything and connected me with attorneys who specialize in civil rights and immigration cases.',
    beforeStatus: 'Not Yet Filed',
    afterStatus: 'Settled',
    timeline: '12 months',
    highlight: 'Confidential settlement with policy reform commitments',
  },
  {
    name: 'Linda Chen',
    location: 'San Jose, CA',
    caseType: 'Social Media',
    initials: 'LC',
    avatarColor: 'from-pink-500 to-pink-700',
    quote: 'My daughter suffered severe mental health issues from social media addiction. The platforms knew their algorithms were harmful to children. ClaimGuard Pro helped us join the fight for accountability.',
    beforeStatus: 'Pending',
    afterStatus: 'Active',
    timeline: 'Ongoing',
    highlight: 'Part of multi-district litigation with significant momentum',
  },
  {
    name: 'Marcus Williams',
    location: 'Atlanta, GA',
    caseType: 'Roblox',
    initials: 'MW',
    avatarColor: 'from-red-500 to-red-700',
    quote: 'My son spent thousands on Roblox without my knowledge through their deceptive microtransaction design. ClaimGuard Pro helped us understand our rights and join other affected families.',
    beforeStatus: 'Not Yet Filed',
    afterStatus: 'Active',
    timeline: 'Ongoing',
    highlight: 'Joining class action seeking refund and policy changes',
  },
];

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

/* Screen reader announcement utility */
function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const el = document.getElementById('sr-announcer');
  if (el) { el.textContent = ''; setTimeout(() => { el.textContent = message; }, 50); }
}

/* ═══════════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════════ */

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      });
    };
    tick();
    // Tick every 30 seconds instead of every second — saves CPU cycles
    const interval = setInterval(tick, 30000);
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
    const skeletonMap = {
      cards: (
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-3 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-8 w-28 mt-2 rounded-md" />
            </div>
          ))}
        </div>
      ),
      form: (
        <div className="space-y-4 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md mt-4" />
        </div>
      ),
      text: (
        <div className="space-y-3 rounded-xl border border-gray-100 dark:border-gray-800 p-6 max-w-2xl mx-auto">
          <Skeleton className="h-6 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ),
      stats: (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 p-5 text-center space-y-2">
              <Skeleton className="h-8 w-16 mx-auto" />
              <Skeleton className="h-3 w-20 mx-auto" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      ),
    };
    return (
      <div ref={ref} aria-hidden="true">
        {skeletonMap[type]}
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
  const { locale, setLocale } = useLanguage();

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

  const { t } = useLanguage();
  const navLinks = useMemo(() => [
    { label: t('nav.home'), href: '#hero' },
    { label: t('nav.howItWorks'), href: '#how-it-works' },
    { label: t('nav.services'), href: '#services' },
    { label: t('nav.eligibilityQuiz'), href: '#eligibility-quiz' },
    { label: t('nav.calculator'), href: '#settlement-calculator' },
    { label: t('nav.trackClaim'), href: '#track-claim' },
    { label: t('nav.resources'), href: '#resources' },
    { label: t('nav.faq'), href: '#faq' },
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.contact'), href: '#contact' },
  ], [locale, t]);
  const navbarTop = scrolled || countdownDismissed ? 'top-0' : 'top-10';

  return (
    <nav className={`fixed left-0 right-0 z-50 transition-all duration-300 ${navbarTop} ${scrolled ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-lg border-b border-gold/20 dark:border-gray-700' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button onClick={() => handleClick('#hero')} className="flex items-center gap-2 group" aria-label={t('nav.goToHomepage')}>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-navy flex items-center justify-center group-hover:bg-navy-light transition-colors">
              <Shield className="w-5 h-5 md:w-6 md:h-6 text-gold" />
            </div>
            <span className={`text-lg md:text-xl font-bold leading-tight tracking-tight transition-colors ${scrolled ? 'text-navy dark:text-white' : 'text-white'}`}>
              Claim<span className="text-gold">Guard</span> Pro
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
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
              {t('nav.getStarted')}
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => setLocale(locale === 'en' ? 'es' : 'en')} className="ml-2 flex items-center gap-1 p-2 rounded-lg transition-colors hover:bg-gold/10" aria-label={t('lang.dismiss')}>
                    <Globe className="w-5 h-5 text-gold" />
                    <span className="text-xs font-bold">{locale === 'en' ? 'ES' : 'EN'}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p className="max-w-xs">{locale === 'en' ? 'Cambiar a Español' : 'Switch to English'}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>

          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className={`p-2 rounded-lg transition-colors ${scrolled ? 'text-navy dark:text-white hover:bg-navy/5 dark:hover:bg-gray-800' : 'text-white hover:bg-white/10'}`} aria-label="Open navigation menu">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white dark:bg-gray-950 p-0">
                <SheetTitle className="sr-only">{t('nav.navigationMenu')}</SheetTitle>
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
                    {navLinks.map((link) => (
                      <button key={link.href} onClick={() => handleClick(link.href)} className="w-full text-left px-6 py-3 text-base font-medium text-navy dark:text-gray-200 hover:bg-navy/5 dark:hover:bg-gray-800 hover:text-gold transition-colors flex items-center justify-between">
                        {link.label}
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </button>
                    ))}
                    <button onClick={() => handleClick('#track-claim')} className="w-full text-left px-6 py-3 text-base font-bold text-gold hover:bg-gold/5 transition-colors flex items-center justify-between">
                      <span className="flex items-center gap-2"><Search className="w-4 h-4" />{t('nav.trackMyClaim')}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </ScrollArea>
                  <div className="p-4 border-t border-border">
                    <a href="tel:4849681529" className="flex items-center justify-center gap-2 mb-3 text-sm text-navy dark:text-gray-300 font-bold">
                      <Phone className="w-4 h-4 text-gold" />(484) 968-1529
                    </a>
                    <Button onClick={() => handleClick('#contact')} className="w-full bg-gold hover:bg-gold-dark text-white font-semibold">{t('nav.getStarted')}</Button>
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
  const { t } = useLanguage();
  const deadlines = useMemo(() => [
    { label: 'NEC Baby Formula', deadline: '2026-09-30T23:59:59Z', emoji: '👶' },
    { label: 'Depo Provera', deadline: '2026-12-31T23:59:59Z', emoji: '💊' },
    { label: 'Hair Relaxer', deadline: '2027-03-15T23:59:59Z', emoji: '✂️' },
    { label: 'Social Media', deadline: '2027-06-30T23:59:59Z', emoji: '📱' },
    { label: 'CPAP Recall', deadline: '2027-01-15T23:59:59Z', emoji: '🫁' },
    { label: 'Zantac', deadline: '2027-08-31T23:59:59Z', emoji: '🏥' },
    { label: 'Exactech Implants', deadline: '2027-04-30T23:59:59Z', emoji: '🦴' },
    { label: 'Rideshare Safety', deadline: '2026-11-30T23:59:59Z', emoji: '🚗' },
  ], []);

  const [activeIdx, setActiveIdx] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const activeDeadline = deadlines[activeIdx];
  const targetDate = useMemo(() => new Date(activeDeadline.deadline), [activeDeadline.deadline]);
  const { days, hours, minutes } = useCountdown(targetDate);

  // Rotate to the next upcoming deadline every 8 seconds
  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      setActiveIdx(prev => {
        const next = (prev + 1) % deadlines.length;
        return next;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [dismissed, deadlines.length]);

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

  if (dismissed || days <= 0 && hours <= 0 && minutes <= 0) return null;

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          key={activeIdx}
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
            <span className="font-medium hidden sm:inline">{activeDeadline.label} {t('countdown.filingDeadline')}</span>
            <span className="font-medium sm:hidden">{activeDeadline.label} {t('countdown.deadlineShort')}</span>
            <span className="countdown-timer font-bold flex items-center gap-1" aria-label={`${days} days ${hours} hours ${minutes} minutes remaining`}>
              <span className="bg-navy/20 px-1.5 py-0.5 rounded text-xs">{days}d</span>
              <span className="bg-navy/20 px-1.5 py-0.5 rounded text-xs">{hours}h</span>
              <span className="bg-navy/20 px-1.5 py-0.5 rounded text-xs">{minutes}m</span>
            </span>
            <button onClick={scrollToContact} className="font-bold underline hover:no-underline ml-1 whitespace-nowrap">{t('countdown.getHelp')}</button>
            <button onClick={dismiss} className="ml-2 p-0.5 hover:bg-white/20 rounded transition-colors" aria-label={t('countdown.dismiss')}>
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* Thin progress dots showing which deadline is active */}
          <div className="flex items-center justify-center gap-1 mt-1">
            {deadlines.map((_, i) => (
              <div key={i} className={`h-0.5 rounded-full transition-all duration-300 ${i === activeIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/40'}`} />
            ))}
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

function CountUpNumber({ value }: { value: number }) {
  const count = useCounter(value, true, 2500);
  return <>{count.toLocaleString()}</>;
}

function HeroSection() {
  const [headlineIdx, setHeadlineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 150]);
  const { t, locale } = useLanguage();
  const headlines = useMemo(() => [t('hero.headline0'), t('hero.headline1'), t('hero.headline2'), t('hero.headline3')], [locale, t]);

  useEffect(() => {
    const current = headlines[headlineIdx];
    let timeout: ReturnType<typeof setTimeout>;
    if (!isDeleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), 50);
    } else if (!isDeleting && charIdx === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), 30);
    } else if (isDeleting && charIdx === 0) {
      const nextIdx = (headlineIdx + 1) % headlines.length;
      const id = requestAnimationFrame(() => { setIsDeleting(false); setHeadlineIdx(nextIdx); });
      return () => { clearTimeout(timeout); cancelAnimationFrame(id); };
    }
    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, headlineIdx, headlines]);

  const displayText = headlines[headlineIdx].slice(0, charIdx);

  const scrollTo = useCallback((id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <img src="/hero-bg.png" alt="" className="w-full h-full object-cover" fetchPriority="high" aria-hidden="true" />
        <div className="hero-gradient absolute inset-0" />
      </motion.div>

      <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {PARTICLE_POSITIONS.map((pos, i) => (
          <div key={i} className="particle-dot" style={{ left: pos.left, top: pos.top, animationDelay: pos.delay, animationDuration: pos.duration }} />
        ))}
      </div>

      <motion.div animate={{ y: [0, -20, 0], x: [0, 10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} className="hidden md:block absolute top-20 right-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <motion.div animate={{ y: [0, 15, 0], x: [0, -15, 0], scale: [1, 0.9, 1] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }} className="hidden md:block absolute bottom-20 left-10 w-96 h-96 bg-navy-light/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <motion.div animate={{ y: [0, -10, 0], x: [0, 20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }} className="absolute top-1/2 right-1/3 w-64 h-64 bg-gold/5 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="max-w-3xl">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <Badge className="mb-6 px-4 py-1.5 bg-gold/20 text-gold border-gold/30 text-sm font-medium backdrop-blur-sm">
              <Shield className="w-3.5 h-3.5 mr-1.5" />
              {t('hero.badge')}
            </Badge>
          </motion.div>

          <motion.h1 initial="hidden" animate="visible" variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { delay: 0.15 } } }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 relative" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {/* Ghost text reserves space for the longest headline — prevents layout shift */}
            <span className="invisible block" aria-hidden="true">{headlines.reduce((a, b) => a.length >= b.length ? a : b, '')}</span>
            <span className="typewriter-cursor absolute top-0 left-0 right-0">{displayText}</span>
          </motion.h1>

          <motion.p initial="hidden" animate="visible" variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { delay: 0.25 } } }} className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed">
            {t('hero.description')}
          </motion.p>

          <motion.div initial="hidden" animate="visible" variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { delay: 0.35 } } }} className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => scrollTo('#track-claim')} size="lg" className="bg-gold hover:bg-gold-dark text-white font-semibold text-base px-8 py-6 shadow-xl shadow-gold/20 transition-all hover:shadow-2xl hover:shadow-gold/30 hover:scale-[1.02]">
              <Search className="w-5 h-5 mr-2" />{t('hero.trackClaim')}
            </Button>
            <Button onClick={() => scrollTo('#eligibility-quiz')} size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold text-base px-8 py-6 backdrop-blur-sm transition-all hover:scale-[1.02]">
              <Target className="w-5 h-5 mr-2" />{t('hero.checkEligibility')}
            </Button>
            <Button onClick={() => scrollTo('#settlement-calculator')} size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold text-base px-8 py-6 backdrop-blur-sm transition-all hover:scale-[1.02]">
              <DollarSign className="w-5 h-5 mr-2" />{t('hero.estimateRecovery')}
            </Button>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { delay: 0.5 } } }} className="mt-12 flex flex-wrap gap-6 text-white/60 text-sm">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-help"><Lock className="w-4 h-4 text-gold" /><span>{t('hero.secureLabel')}</span></div>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p className="max-w-xs">{t('hero.secureTooltip')}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-help"><CheckCircle2 className="w-4 h-4 text-gold" /><span>{t('hero.freeLabel')}</span></div>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p className="max-w-xs">{t('hero.freeTooltip')}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-help"><Clock className="w-4 h-4 text-gold" /><span>{t('hero.supportLabel')}</span></div>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p className="max-w-xs">{t('hero.supportTooltip')}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>

          {/* Live Claim Counter */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-8">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white"><CountUpNumber value={12547} />+</div>
              <div className="text-white/50 text-xs font-medium mt-1">{t('hero.claimsFiled')}</div>
            </div>
            <div className="w-px h-10 bg-white/20 hidden md:block" />
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gold">$<CountUpNumber value={47} />M+</div>
              <div className="text-white/50 text-xs font-medium mt-1">{t('hero.recovered')}</div>
            </div>
            <div className="w-px h-10 bg-white/20 hidden md:block" />
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-sm font-medium">{t('hero.live')}</span>
            </div>
          </div>
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

const LAW_FIRMS = [
  { name: 'Motley Rice LLC', location: 'Charleston, SC', specialty: 'Environmental & Toxic Torts', years: 15, cases: '5,000+' },
  { name: 'Weitz & Luxenberg', location: 'New York, NY', specialty: 'Pharmaceutical Mass Torts', years: 18, cases: '8,000+' },
  { name: 'Lieff Cabraser', location: 'San Francisco, CA', specialty: 'Consumer Protection & MDL', years: 16, cases: '3,500+' },
  { name: 'Simmons Hanly Conroy', location: 'Alton, IL', specialty: 'Asbestos & Environmental', years: 20, cases: '10,000+' },
  { name: 'Levin Papantonio', location: 'Pensacola, FL', specialty: 'Pharmaceutical Litigation', years: 17, cases: '6,000+' },
  { name: 'Beasley Allen', location: 'Montgomery, AL', specialty: 'Personal Injury & Torts', years: 15, cases: '4,200+' },
  { name: 'Napoli Shkolnik', location: 'New York, NY', specialty: 'Environmental Exposure', years: 14, cases: '3,800+' },
  { name: 'Parker Waichman', location: 'New York, NY', specialty: 'Medical Device Litigation', years: 16, cases: '5,500+' },
  { name: 'Baum Hedlund Aristei', location: 'Los Angeles, CA', specialty: 'Pharmaceutical & Aviation', years: 15, cases: '2,800+' },
  { name: 'Kraftson Cude', location: 'Houston, TX', specialty: 'Industrial & Toxic Exposure', years: 13, cases: '1,900+' },
  { name: 'Saiontz & Kirk', location: 'Baltimore, MD', specialty: 'Medical Device Failure', years: 15, cases: '4,100+' },
  { name: 'Hagens Berman', location: 'Seattle, WA', specialty: 'Consumer Class Actions', years: 17, cases: '7,200+' },
];

const TRUST_STATS = [
  { label: 'Years of Partnership', value: '15+', icon: CalendarDays },
  { label: 'Law Firms Nationwide', value: '50+', icon: Building2 },
  { label: 'Cases Co-Managed', value: '62K+', icon: FileText },
  { label: 'States Covered', value: 'All 50', icon: MapPin },
];

const TrustedBySection = memo(function TrustedBySection() {
  const { t } = useLanguage();
  return (
    <section className="relative py-16 md:py-24 bg-gray-950 overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,215,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Glow orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-5 py-2 mb-6">
            <div className="flex -space-x-2">
              {['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500'].map((c, i) => (
                <div key={i} className={`w-6 h-6 ${c} rounded-full border-2 border-gray-950 flex items-center justify-center text-[8px] font-bold text-white`}>
                  {['MR', 'WL', 'LC', 'SH'][i]}
                </div>
              ))}
            </div>
            <span className="text-gold text-xs font-semibold uppercase tracking-wider">{t('trusted.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Trusted by <span className="gradient-text-gold">Top Mass Tort</span> Law Firms
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            {t('trusted.description')}
          </p>
        </motion.div>

        {/* Trust Stats Bar */}
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14 mt-10">
          {TRUST_STATS.map((stat, statIdx) => {
            const labelKeys = ['trusted.years', 'trusted.lawFirms', 'trusted.casesCoManaged', 'trusted.states'] as const;
            return (
            <div key={stat.label} className="text-center p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-gold/30 transition-colors duration-300 group">
              <stat.icon className="w-5 h-5 text-gold mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-gray-500 text-xs uppercase tracking-wider mt-1">{t(labelKeys[statIdx])}</div>
            </div>
            );
          })}
        </motion.div>

        {/* Law Firms Grid */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {LAW_FIRMS.map((firm, idx) => (
              <motion.div
                key={firm.name}
                variants={fadeInUp}
                custom={idx}
                className="group relative rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 hover:bg-white/[0.07] hover:border-gold/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/5"
              >
                {/* Subtle corner glow on hover */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gold/0 group-hover:bg-gold/5 rounded-bl-3xl rounded-tr-2xl transition-all duration-300" aria-hidden="true" />
                <div className="relative">
                  {/* Firm initial badge */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center text-gold text-xs font-bold shrink-0">
                      {firm.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white truncate group-hover:text-gold-light transition-colors">{firm.name}</h3>
                      <p className="text-gray-500 text-xs truncate">{firm.location}</p>
                    </div>
                  </div>

                  {/* Specialty */}
                  <p className="text-gray-400 text-xs mb-3 leading-relaxed">{firm.specialty}</p>

                  {/* Bottom stats */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="w-3 h-3 text-gold/60" />
                      <span className="text-gray-500 text-[11px]">{firm.years} {t('trusted.yearsLabel')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3 h-3 text-gold/60" />
                      <span className="text-gray-500 text-[11px]">{firm.cases} {t('trusted.casesLabel')}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className="w-2.5 h-2.5 text-gold fill-gold/80" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom trust bar */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-full px-6 py-3">
            <BadgeCheck className="w-5 h-5 text-gold" />
            <span className="text-gray-300 text-sm font-medium">{t('trusted.verified')}</span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-gold/60" />
            <span className="hidden sm:inline text-gold text-sm font-semibold">{t('trusted.since')}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

/* ═══════════════════════════════════════════════════════════════
   SECTION: HOW IT WORKS
   ═══════════════════════════════════════════════════════════════ */

const MEDIA_LOGOS = ['Forbes', 'CNN', 'Bloomberg Law', 'Reuters', 'USA Today', 'The Wall Street Journal', 'NBC News', 'Legal Times'];

function MediaBarSection() {
  return (
    <section className="py-6 bg-gray-50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs text-muted-foreground font-medium uppercase tracking-widest mb-4">As Featured In</p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 opacity-40 dark:opacity-30">
          {MEDIA_LOGOS.map((name) => (
            <span key={name} className="text-sm md:text-base font-bold text-navy dark:text-gray-400 tracking-wide whitespace-nowrap" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const { ref, inView } = useInView(0.1);
  const { t } = useLanguage();
  return (
    <section id="how-it-works" className="py-14 md:py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-10">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">{t('howItWorks.badge')}</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {t('howItWorks.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('howItWorks.description')}
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
                  <CardTitle className="text-sm md:text-base font-bold text-navy dark:text-gray-100">{t(`howItWorks.step${item.step}.title`)}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground dark:text-gray-400 text-xs md:text-sm leading-relaxed text-center">{t(`howItWorks.step${item.step}.description`)}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: SERVICES
   ═══════════════════════════════════════════════════════════════ */

function ServicesSection() {
  const { ref, inView } = useInView(0.1);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const { t } = useLanguage();

  return (
    <section id="services" className="py-14 md:py-20 bg-[#F4F1EB] dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-10">
          <Badge className="mb-4 px-3 py-1 bg-navy/10 text-navy border-navy/20 text-xs font-semibold uppercase tracking-wider dark:text-gray-300 dark:border-gray-600">{t('services.badge')}</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {t('services.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('services.description')}</p>
        </motion.div>

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_DATA.map((service, idx) => (
            <motion.div key={service.title} variants={fadeInUp}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="group h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-800/50 dark:border-gray-700 overflow-hidden hover-glow relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                      <CardHeader className="pb-3 relative">
                        <div className="w-12 h-12 rounded-xl bg-navy/5 dark:bg-gray-700 flex items-center justify-center mb-3 group-hover:bg-gold/10 transition-colors">
                          <service.icon className="w-6 h-6 text-navy dark:text-gray-300 group-hover:text-gold transition-colors" />
                        </div>
                        <CardTitle className="text-lg font-bold text-navy dark:text-gray-100">{t(`services.s${idx}.title`)}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 relative">
                        <p className="text-muted-foreground dark:text-gray-400 text-sm leading-relaxed mb-3">{t(`services.s${idx}.description`)}</p>
                        <button
                          onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                          aria-expanded={expandedIdx === idx}
                          className="text-gold-dark dark:text-gold-light text-sm font-semibold hover:text-gold flex items-center gap-1 transition-colors"
                        >
                          {expandedIdx === idx ? t('services.showLess') : t('services.learnMore')}
                          {expandedIdx === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <AnimatePresence>
                          {expandedIdx === idx && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                              <p className="text-sm text-navy/70 dark:text-gray-400 leading-relaxed mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">{t(`services.s${idx}.detail`)}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent side="bottom"><p className="max-w-xs">{t(`services.s${idx}.detail`)}</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: WHY WE'RE DIFFERENT
   ═══════════════════════════════════════════════════════════════ */

function WhyDifferentSection() {
  const { ref, inView } = useInView(0.1);
  const { t } = useLanguage();
  return (
    <section className="py-14 md:py-20 bg-white dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-10">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">{t('whyDiff.badge')}</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {t('whyDiff.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('whyDiff.description')}</p>
        </motion.div>

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer}>
          {/* Desktop table view */}
          <Card className="border-0 shadow-lg overflow-hidden hidden md:block">
            <div className="grid grid-cols-3 bg-navy dark:bg-gray-900 text-white">
              <div className="p-4 text-left font-semibold text-sm border-r border-white/10">{t('whyDiff.feature')}</div>
              <div className="p-4 text-center font-semibold text-sm border-r border-white/10">
                <div className="flex items-center justify-center gap-2"><Shield className="w-4 h-4 text-gold" />{t('whyDiff.us')}</div>
              </div>
              <div className="p-4 text-center font-semibold text-sm">{t('whyDiff.typical')}</div>
            </div>
            {COMPARISON_DATA.map((row, idx) => (
              <motion.div key={row.feature} variants={fadeInUp}>
                <div className={`grid grid-cols-3 ${idx % 2 === 0 ? 'bg-white dark:bg-gray-800/50' : 'bg-gray-50/50 dark:bg-gray-800/30'} border-b border-gray-100 dark:border-gray-700 last:border-0`}>
                  <div className="p-4 text-sm font-medium text-navy dark:text-gray-200 border-r border-gray-100 dark:border-gray-700">{t(`whyDiff.f${idx}`)}</div>
                  <div className="p-4 text-center border-r border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /><span className="text-sm text-navy/80 dark:text-gray-300">{t(`whyDiff.f${idx}.us`)}</span>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <X className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0" /><span className="text-sm text-muted-foreground">{t(`whyDiff.f${idx}.other`)}</span>
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
                  <h4 className="font-semibold text-navy dark:text-gray-100 text-sm mb-3">{t(`whyDiff.f${COMPARISON_DATA.indexOf(row)}`)}</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{t('whyDiff.us')}</span>
                        <p className="text-xs text-emerald-600/80 dark:text-emerald-400/70">{t(`whyDiff.f${COMPARISON_DATA.indexOf(row)}.us`)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                      <X className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t('whyDiff.typical')}</span>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{t(`whyDiff.f${COMPARISON_DATA.indexOf(row)}.other`)}</p>
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

const SETTLEMENT_RANGES: Record<string, { min: number; max: number }> = {
  'Camp Lejeune': { min: 25000, max: 500000 },
  'Roundup': { min: 5000, max: 400000 },
  'Talc / Baby Powder': { min: 10000, max: 500000 },
  'Hernia Mesh': { min: 50000, max: 250000 },
  'Paraquat': { min: 100000, max: 1500000 },
  'Firefighting Foam': { min: 50000, max: 500000 },
  'Zantac': { min: 15000, max: 350000 },
  'Hair Relaxer': { min: 25000, max: 400000 },
  'CPAP Machines': { min: 20000, max: 300000 },
  'Social Media Lawsuits': { min: 10000, max: 250000 },
  'Rideshare Assault': { min: 50000, max: 1000000 },
  'NEC Baby Formula': { min: 100000, max: 2000000 },
  'Depo Provera': { min: 75000, max: 750000 },
  'Roblox / Gaming': { min: 500, max: 25000 },
  'IL Detention': { min: 25000, max: 500000 },
  '3M Earplugs': { min: 50000, max: 350000 },
  'Exactech Implants': { min: 75000, max: 500000 },
  'Bard PowerPort': { min: 50000, max: 400000 },
  'Elmiron': { min: 25000, max: 350000 },
  'Taxotere': { min: 20000, max: 300000 },
  'Uber / Lyft Safety': { min: 30000, max: 750000 },
  'Talcum Powder Cancer': { min: 10000, max: 500000 },
  'AFFF / PFAS Exposure': { min: 50000, max: 500000 },
  'Talc Ovarian Cancer': { min: 15000, max: 500000 },
  'Other': { min: 10000, max: 200000 },
};

function SettlementCalculatorSection() {
  const { ref, inView } = useInView(0.1);
  const { t } = useLanguage();
  const [caseType, setCaseType] = useState('');
  const [severity, setSeverity] = useState('');
  const [showResult, setShowResult] = useState(false);
  const severityMultiplier: Record<string, number> = { 'Mild': 0.5, 'Moderate': 1, 'Severe': 2, 'Life-Threatening': 3 };
  const calculate = () => { if (caseType && severity) setShowResult(true); };
  const resetCalc = () => { setCaseType(''); setSeverity(''); setShowResult(false); };
  const result = useMemo(() => {
    if (!showResult || !caseType || !severity) return null;
    const range = SETTLEMENT_RANGES[caseType] || SETTLEMENT_RANGES['Other'];
    const mult = severityMultiplier[severity] || 1;
    return { low: Math.round(range.min * mult), high: Math.round(range.max * mult) };
  }, [showResult, caseType, severity]);

  return (
    <section id="settlement-calculator" className="py-14 md:py-20 bg-[#F4F1EB] dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-8">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">{t('calc.badge')}</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {t('calc.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('calc.description')}</p>
          <p className="text-xs text-muted-foreground mt-2">{t('calc.disclaimer')}</p>
        </motion.div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleIn}>
          <Card className="border-2 border-gold/20 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-800/50">
            <CardContent className="p-6 md:p-8">
              {!showResult ? (
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-semibold text-navy dark:text-gray-200 mb-2 block">{t('calc.caseType')}</Label>
                    <Select value={caseType} onValueChange={setCaseType}>
                      <SelectTrigger className="w-full"><SelectValue placeholder={t('calc.selectCaseType')} /></SelectTrigger>
                      <SelectContent>{Object.keys(SETTLEMENT_RANGES).map((ct) => (<SelectItem key={ct} value={ct}>{ct}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-navy dark:text-gray-200 mb-2 block">{t('calc.severity')}</Label>
                    <Select value={severity} onValueChange={setSeverity}>
                      <SelectTrigger className="w-full"><SelectValue placeholder={t('calc.selectSeverity')} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mild">{t('calc.mild')}</SelectItem>
                        <SelectItem value="Moderate">{t('calc.moderate')}</SelectItem>
                        <SelectItem value="Severe">{t('calc.severe')}</SelectItem>
                        <SelectItem value="Life-Threatening">{t('calc.lifeThreatening')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={calculate} disabled={!caseType || !severity} className="w-full bg-gold hover:bg-gold-dark text-white font-semibold py-3"><Calculator className="w-4 h-4 mr-2" />{t('calc.calculate')}</Button>
                </div>
              ) : (
                <AnimatePresence mode="wait"><motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4"><DollarSign className="w-8 h-8 text-gold" /></div>
                    <h3 className="text-xl font-bold text-navy dark:text-white mb-2">{t('calc.estimatedRange')}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{caseType} — {severity}</p>
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <div className="text-center"><p className="text-xs text-muted-foreground uppercase tracking-wider">{t('calc.lowEstimate')}</p><p className="text-2xl md:text-3xl font-bold text-navy dark:text-white">${(result?.low ?? 0).toLocaleString()}</p></div>
                      <div className="text-gray-300 dark:text-gray-600 text-2xl">—</div>
                      <div className="text-center"><p className="text-xs text-muted-foreground uppercase tracking-wider">{t('calc.highEstimate')}</p><p className="text-2xl md:text-3xl font-bold text-gold">${(result?.high ?? 0).toLocaleString()}</p></div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-6">{t('calc.estimateDisclaimer')}</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })} className="flex-1 bg-gold hover:bg-gold-dark text-white font-semibold"><Phone className="w-4 h-4 mr-2" />{t('calc.getExpertReview')}</Button>
                      <Button onClick={resetCalc} variant="outline" className="flex-1 dark:border-gray-600 dark:text-gray-200"><RefreshCw className="w-4 h-4 mr-2" />{t('calc.recalculate')}</Button>
                    </div>
                  </div>
                </motion.div></AnimatePresence>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function EligibilityQuizSection() {
  const { ref, inView } = useInView(0.1);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [showResult, setShowResult] = useState(false);
  const { t, locale } = useLanguage();

  const quizQuestions = useMemo(() => [
    { question: t('quiz.q1'), type: 'radio' as const, options: ['Yes', 'No'], key: 'q1' as keyof QuizAnswers },
    { question: t('quiz.q2'), type: 'select' as const, options: ['Camp Lejeune', 'Roundup', 'Talc / Baby Powder', 'Hernia Mesh', 'Paraquat', 'Firefighting Foam', 'Zantac', 'Hair Relaxer', 'CPAP Machines', 'Social Media Lawsuits', 'Rideshare Assault', 'NEC Baby Formula', 'Depo Provera', 'Roblox / Gaming', 'IL Detention', '3M Earplugs', 'Exactech Implants', 'Other'], key: 'q2' as keyof QuizAnswers },
    { question: t('quiz.q3'), type: 'select' as const, options: ['Pending', 'Under Review', 'Approved', 'Denied', 'Correction Needed', 'Not Yet Filed'], key: 'q3' as keyof QuizAnswers },
    { question: t('quiz.q4'), type: 'radio' as const, options: ['Yes', 'No'], key: 'q4' as keyof QuizAnswers },
    { question: t('quiz.q5'), type: 'select' as const, options: ['Missing documents', 'Denied claim', 'No updates on status', 'Incomplete forms', 'Need help filing', 'Other'], key: 'q5' as keyof QuizAnswers },
  ], [locale, t]);

  const handleNext = useCallback(() => {
    if (step < quizQuestions.length - 1) setStep(s => s + 1);
    else { setShowResult(true); announce('Quiz complete. Your assessment results are shown below.', 'assertive'); }
  }, [step, quizQuestions.length, locale, t]);

  const handleBack = useCallback(() => setStep(s => Math.max(0, s - 1)), []);

  const getRecommendation = useCallback((): { score: number; label: string; recommendations: string[]; color: string } => {
    const a = answers;
    let score = 60;
    const recommendations: string[] = [];
    if (a.q1 === 'No') { score -= 15; recommendations.push(t('quiz.r1')); }
    else { recommendations.push(t('quiz.r2')); }
    if (a.q3 === 'Denied') { score -= 20; recommendations.push(t('quiz.r3')); }
    if (a.q3 === 'Correction Needed') { score -= 10; recommendations.push(t('quiz.r4')); }
    if (a.q3 === 'Not Yet Filed') { score -= 15; recommendations.push(t('quiz.r5')); }
    if (a.q5 === 'Missing documents') { recommendations.push(t('quiz.r6')); score -= 5; }
    if (a.q5 === 'Denied claim') { recommendations.push(t('quiz.r7')); score -= 10; }
    if (score >= 75) return { score: Math.min(score, 95), label: t('quiz.strongCandidate'), recommendations, color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800' };
    if (score >= 50) return { score: Math.min(score, 74), label: t('quiz.goodPotential'), recommendations, color: 'text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800' };
    return { score: Math.max(score, 25), label: t('quiz.needsAssessment'), recommendations, color: 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800' };
  }, [answers, locale, t]);

  const resetQuiz = useCallback(() => { setStep(0); setAnswers({}); setShowResult(false); }, []);
  const currentQ = quizQuestions[step];

  return (
    <section id="eligibility-quiz" className="py-14 md:py-20 bg-white dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-8">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">{t('quiz.badge')}</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {t('quiz.title')}
          </h2>
          <p className="text-muted-foreground text-lg">{t('quiz.description')}</p>
        </motion.div>

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleIn}>
          <Card className="border-2 border-gold/20 dark:border-gray-700 shadow-xl overflow-hidden bg-white dark:bg-gray-800/50">
            {!showResult && (
              <div className="bg-navy dark:bg-gray-900 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm font-medium">{t('quiz.question').replace('{n}', String(step + 1)).replace('{total}', String(quizQuestions.length))}</span>
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
                            <span className="text-navy dark:text-gray-200 font-medium">{opt === 'Yes' ? t('quiz.yes') : opt === 'No' ? t('quiz.no') : opt === 'Other' ? t('quiz.other') : opt}</span>
                          </label>
                        ))}
                      </RadioGroup>
                    ) : (
                      <div className="space-y-3">
                        {currentQ.options.map(opt => (
                          <label key={opt} onClick={() => setAnswers(prev => ({ ...prev, [currentQ.key]: opt }))} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${answers[currentQ.key] === opt ? 'border-gold bg-gold/5 shadow-sm' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}`}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${answers[currentQ.key] === opt ? 'border-gold bg-gold' : 'border-gray-300 dark:border-gray-500'}`}>
                              {answers[currentQ.key] === opt && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <span className="text-navy dark:text-gray-200 font-medium">{opt === 'Yes' ? t('quiz.yes') : opt === 'No' ? t('quiz.no') : opt === 'Other' ? t('quiz.other') : opt}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-between mt-8">
                      <Button variant="outline" onClick={handleBack} disabled={step === 0} className="px-6">
                        <ChevronLeft className="w-4 h-4 mr-1" />{t('quiz.back')}
                      </Button>
                      <Button onClick={handleNext} disabled={!answers[currentQ.key]} className="px-6 bg-gold hover:bg-gold-dark text-white font-semibold">
                        {step === quizQuestions.length - 1 ? t('quiz.seeResults') : t('quiz.next')}<ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-gold" />
                      </div>
                      <h3 className="text-2xl font-bold text-navy dark:text-white mb-2">{t('quiz.yourAssessment')}</h3>
                      {(() => { const rec = getRecommendation(); return (
                        <>
                          <Badge className={`text-sm font-semibold px-4 py-1.5 border ${rec.color} mb-4`}>{rec.label}</Badge>
                          <div className="max-w-xs mx-auto mb-4">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-muted-foreground">{t('quiz.eligibilityScore')}</span>
                              <span className="text-sm font-bold text-gold">{rec.score}%</span>
                            </div>
                            <Progress value={rec.score} className="h-3 [&>div]:bg-gold progress-animated" />
                          </div>
                          <div className="space-y-3 text-left mt-6">
                            <p className="text-sm font-semibold text-navy dark:text-gray-200 uppercase tracking-wider">{t('quiz.personalizedRecs')}</p>
                            {rec.recommendations.map((r, i) => (
                              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                                <p className="text-sm text-navy/80 dark:text-gray-300">{r}</p>
                              </div>
                            ))}
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3 mt-8">
                            <Button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })} className="flex-1 bg-gold hover:bg-gold-dark text-white font-semibold">
                              <Phone className="w-4 h-4 mr-2" />{t('quiz.contactSpecialist')}
                            </Button>
                            <Button onClick={() => document.querySelector('#track-claim')?.scrollIntoView({ behavior: 'smooth' })} variant="outline" className="flex-1 dark:border-gray-600 dark:text-gray-200">
                              <Search className="w-4 h-4 mr-2" />{t('quiz.trackMyClaim')}
                            </Button>
                          </div>
                          <button onClick={resetQuiz} className="mt-4 text-sm text-muted-foreground hover:text-gold transition-colors">{t('quiz.retake')}</button>
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

const STATS_TOOLTIP_DATA: Record<string, string> = {
  'Claims Assisted': 'Over 1,250 claimants have trusted us to guide them through the mass tort claims process since 2009.',
  'Success Rate': '98% of our clients who complete the full process receive a favorable outcome on their claims.',
  'Recovered': 'Our clients have recovered a combined total of over $47 million in settlements and compensation.',
  'Years Experience': 'Our team brings 15+ years of specialized experience in mass tort litigation and claims management.',
  'Dedicated Support': 'Our specialists are available 24 hours a day, 7 days a week via phone, email, and live chat.',
  'Secure & Confidential': 'Bank-level 256-bit encryption with HIPAA-compliant systems. Regular third-party security audits.',
};

function StatCardComponent({ icon: Icon, value, suffix, label, inView, progress, prefix = '', tooltip }: {
  icon: typeof Users; value: number; suffix: string; label: string; inView: boolean; progress: number; prefix?: string; tooltip?: string;
}) {
  const count = useCounter(value, inView);
  return (
    <motion.div variants={fadeInUp} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Icon className="w-8 h-8 text-gold mx-auto mb-3" />
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{prefix}{count}{suffix}</div>
              <div className="text-white/50 text-sm font-medium mb-3">{label}</div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom"><p className="max-w-xs">{tooltip}</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={inView ? { width: `${progress}%` } : { width: 0 }} transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }} className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full" />
      </div>
    </motion.div>
  );
}

function WhyChooseUsSection() {
  const { ref, inView } = useInView(0.15);
  const { scrollY } = useScroll();
  const { t, locale } = useLanguage();
  const orbY = useTransform(scrollY, [500, 1200], [0, -40]);
  const statTooltips = useMemo(() => [
    t('stats.tooltip0'), t('stats.tooltip1'), t('stats.tooltip2'), t('stats.tooltip3'), t('stats.tooltip4'), t('stats.tooltip5'),
  ], [locale, t]);
  const statsData = useMemo(() => [
    { icon: Users, value: STATS_DATA[0].value, suffix: STATS_DATA[0].suffix, label: t('stats.label0'), progress: 92 },
    { icon: Award, value: STATS_DATA[1].value, suffix: STATS_DATA[1].suffix, label: t('stats.label1'), progress: 98 },
    { icon: DollarSign, value: STATS_DATA[2].value, suffix: STATS_DATA[2].suffix, label: t('stats.label2'), progress: 85, prefix: '$' },
    { icon: CalendarDays, value: STATS_DATA[3].value, suffix: STATS_DATA[3].suffix, label: t('stats.label3'), progress: 88 },
    { icon: HeadphonesIcon, value: STATS_DATA[4].value, suffix: STATS_DATA[4].suffix, label: t('stats.label4'), progress: 100 },
    { icon: Lock, value: STATS_DATA[5].value, suffix: STATS_DATA[5].suffix, label: t('stats.label5'), progress: 100 },
  ], [locale, t]);

  return (
    <section id="why-choose-us" className="py-14 md:py-20 bg-navy dark:bg-gray-950 relative overflow-hidden">
      <motion.div className="hidden md:block absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" style={{ y: orbY }} aria-hidden="true" />
      <div className="hidden md:block absolute bottom-0 left-0 w-96 h-96 bg-navy-light/30 rounded-full blur-3xl" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-10">
          <Badge className="mb-4 px-3 py-1 bg-gold/20 text-gold border-gold/30 text-xs font-semibold uppercase tracking-wider">{t('stats.badge')}</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {t('stats.title')}
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">{t('stats.description')}</p>
        </motion.div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {statsData.map((stat, i) => (
            <StatCardComponent key={stat.label} {...stat} inView={inView} prefix={stat.prefix} tooltip={statTooltips[i]} />
          ))}
        </motion.div>

        {/* Recovery by Case Type */}
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="mt-10">
          <Card className="border-0 shadow-lg overflow-hidden bg-white/5 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base font-bold">{t('stats.recoveryTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-3 max-h-[500px] md:max-h-none overflow-y-auto md:overflow-visible pr-1">
                {[
                  { type: 'Camp Lejeune', amount: 18.5, color: 'bg-blue-400' },
                  { type: 'Roundup', amount: 12.3, color: 'bg-emerald-400' },
                  { type: 'Paraquat', amount: 8.7, color: 'bg-rose-400' },
                  { type: 'NEC Baby Formula', amount: 7.2, color: 'bg-cyan-400' },
                  { type: 'AFFF / Firefighting Foam', amount: 5.8, color: 'bg-teal-400' },
                  { type: 'Depo Provera', amount: 4.5, color: 'bg-orange-400' },
                  { type: '3M Earplugs', amount: 4.1, color: 'bg-lime-400' },
                  { type: 'Talcum Powder', amount: 3.8, color: 'bg-purple-400' },
                  { type: 'Hernia Mesh', amount: 3.2, color: 'bg-amber-400' },
                  { type: 'Rideshare Assault', amount: 2.9, color: 'bg-indigo-400' },
                  { type: 'Zantac', amount: 2.5, color: 'bg-violet-400' },
                  { type: 'IL Detention', amount: 2.1, color: 'bg-slate-400' },
                  { type: 'Hair Relaxer', amount: 1.8, color: 'bg-fuchsia-400' },
                  { type: 'CPAP Machines', amount: 1.5, color: 'bg-sky-400' },
                  { type: 'Social Media Lawsuits', amount: 1.2, color: 'bg-pink-400' },
                  { type: 'Exactech Implants', amount: 0.9, color: 'bg-stone-400' },
                  { type: 'Bard PowerPort', amount: 3.6, color: 'bg-red-400' },
                  { type: 'Elmiron', amount: 1.4, color: 'bg-yellow-400' },
                  { type: 'Taxotere', amount: 1.1, color: 'bg-green-400' },
                  { type: 'Uber / Lyft Safety', amount: 2.4, color: 'bg-blue-300' },
                  { type: 'Talc Ovarian Cancer', amount: 2.8, color: 'bg-purple-300' },
                  { type: 'Roblox / Gaming', amount: 0.6, color: 'bg-red-300' },
                ].map((item) => (
                  <div key={item.type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">{item.type}</span>
                      <span className="text-white/50">${item.amount}M+</span>
                    </div>
                    <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={inView ? { width: `${(item.amount / 18.5) * 100}%` } : { width: 0 }} transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }} className={`h-full ${item.color} rounded-full`} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: SUCCESS STORIES CAROUSEL
   ═══════════════════════════════════════════════════════════════ */

const CASE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Camp Lejeune': { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
  'Roundup': { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
  'Talcum Powder': { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
  'Hernia Mesh': { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
  'Paraquat': { bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800' },
  'Firefighting Foam': { bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-800' },
  'Rideshare Assault': { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' },
  'Depo Provera': { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' },
  'NEC Baby Formula': { bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-800' },
  'IL Detention': { bg: 'bg-slate-50 dark:bg-slate-900/20', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-800' },
  'Social Media': { bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-200 dark:border-pink-800' },
  'Roblox': { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-800' },
};

function SuccessStoriesCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const totalSlides = SUCCESS_STORIES.length;
  const { t } = useLanguage();

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setActiveIndex(prev => (prev + 1) % totalSlides);
    }, 6000);
  }, [totalSlides]);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [startAutoPlay, stopAutoPlay]);

  const goTo = useCallback((idx: number) => {
    setDirection(idx > activeIndex ? 1 : -1);
    setActiveIndex(idx);
    stopAutoPlay();
    startAutoPlay();
  }, [activeIndex, stopAutoPlay, startAutoPlay]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex(prev => (prev - 1 + totalSlides) % totalSlides);
    stopAutoPlay();
    startAutoPlay();
  }, [totalSlides, stopAutoPlay, startAutoPlay]);

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveIndex(prev => (prev + 1) % totalSlides);
    stopAutoPlay();
    startAutoPlay();
  }, [totalSlides, stopAutoPlay, startAutoPlay]);

  const story = SUCCESS_STORIES[activeIndex];
  const colors = CASE_COLORS[story.caseType] || CASE_COLORS['Camp Lejeune'];

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="relative">
      {/* Main Card */}
      <div className="max-w-5xl mx-auto">
        <Card className="overflow-hidden border-0 shadow-xl bg-white dark:bg-gray-800/50">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left: Avatar + Abstract Background */}
            <div className="relative h-72 md:h-auto md:min-h-[480px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={story.name}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-8"
                >
                  {/* Abstract geometric pattern */}
                  <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                      <div className="absolute top-[10%] left-[10%] w-32 h-32 rounded-full bg-gold/30 blur-2xl" />
                      <div className="absolute bottom-[15%] right-[15%] w-40 h-40 rounded-full bg-blue-500/20 blur-3xl" />
                      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gold/10 blur-3xl" />
                    </div>
                    {/* Grid pattern */}
                    <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gold" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>

                  {/* Large Initials Avatar */}
                  <div className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br ${story.avatarColor} flex items-center justify-center shadow-2xl ring-4 ring-white/10`}>
                    <span className="text-4xl md:text-5xl font-bold text-white tracking-wider" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                      {story.initials}
                    </span>
                  </div>

                  {/* Decorative line */}
                  <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mt-6" />

                  {/* Case type label */}
                  <p className="text-white/50 text-xs uppercase tracking-[0.2em] mt-3 font-medium">{story.caseType}</p>
                </motion.div>
              </AnimatePresence>

              {/* Case type badge */}
              <div className="absolute top-4 left-4 z-10">
                <Badge className={`${colors.bg} ${colors.text} ${colors.border} border text-xs font-semibold backdrop-blur-sm`}>
                  {story.caseType}
                </Badge>
              </div>
            </div>

            {/* Right: Content */}
            <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={story.name}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {/* Before → After */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 text-center p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50">
                      <p className="text-[10px] uppercase tracking-wider text-red-500 dark:text-red-400 font-semibold mb-0.5">{t('stories.before')}</p>
                      <p className="text-sm font-bold text-red-700 dark:text-red-300">{story.beforeStatus}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <ArrowRight className="w-5 h-5 text-gold" />
                    </div>
                    <div className="flex-1 text-center p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50">
                      <p className="text-[10px] uppercase tracking-wider text-emerald-500 dark:text-emerald-400 font-semibold mb-0.5">{t('stories.after')}</p>
                      <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{story.afterStatus}</p>
                    </div>
                  </div>

                  {/* Name & Location */}
                  <h4 className="text-xl md:text-2xl font-bold text-navy dark:text-white mb-1" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                    {story.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{story.location}</span>
                    <span className="mx-1 text-gray-300 dark:text-gray-600">|</span>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t('stories.resolved')} {story.timeline}</span>
                  </div>

                  {/* Quote */}
                  <p className="text-navy/80 dark:text-gray-300 text-sm md:text-base leading-relaxed mb-5 italic">
                    &ldquo;{story.quote}&rdquo;
                  </p>

                  {/* Highlight */}
                  <div className={`flex items-start gap-2.5 p-3 rounded-xl ${colors.bg} border ${colors.border}`}>
                    <CheckCircle2 className={`w-5 h-5 ${colors.text} shrink-0 mt-0.5`} />
                    <p className={`text-sm ${colors.text} font-medium`}>{story.highlight}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation Dots + Arrows */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={goPrev}
          className="rounded-full w-9 h-9 border-gray-200 dark:border-gray-700 hover:bg-gold/10 hover:border-gold/30 hover:text-gold transition-colors"
          aria-label={t('stories.previous')}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-2" role="tablist" aria-label={t('stories.navigation')}>
          {SUCCESS_STORIES.map((s, i) => (
            <button
              key={s.name}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={t('stories.viewStory').replace('{name}', s.name)}
              className={`
                rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold
                ${i === activeIndex
                  ? 'w-8 h-3 bg-gold'
                  : 'w-3 h-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }
              `}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={goNext}
          className="rounded-full w-9 h-9 border-gray-200 dark:border-gray-700 hover:bg-gold/10 hover:border-gold/30 hover:text-gold transition-colors"
          aria-label={t('stories.next')}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Counter */}
      <p className="text-center text-xs text-muted-foreground mt-3">
        {activeIndex + 1} {t('stories.of')} {totalSlides} {t('stories.stories')}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: TESTIMONIALS CAROUSEL
   ═══════════════════════════════════════════════════════════════ */

const TestimonialsSection = memo(function TestimonialsSection() {
  const { ref, inView } = useInView(0.1);
  const { t } = useLanguage();
  return (
    <section className="py-14 md:py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-8">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">{t('testimonials.badge')}</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {t('testimonials.title')}
          </h2>
        </motion.div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleIn}>
          <LazySection type="cards">
            <Carousel opts={{ loop: true, align: 'start' }} className="w-full">
            <CarouselContent>
              {TESTIMONIALS_DATA.map((item) => (
                <CarouselItem key={item.name} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <div className="h-full">
                    <Card className="card-gradient-border h-full hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex gap-0.5 mb-3">
                          {Array.from({ length: item.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                          ))}
                        </div>
                        <Badge className="mb-3 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100">{item.caseType}</Badge>
                        <p className="text-navy/80 dark:text-gray-300 text-sm leading-relaxed mb-5 italic">&ldquo;{item.text}&rdquo;</p>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center text-white font-bold text-sm`}>{item.name.charAt(0)}</div>
                          <div>
                            <div className="font-semibold text-navy dark:text-gray-100 text-sm">{item.name}</div>
                            <div className="text-muted-foreground text-xs flex items-center gap-1">
                              <MapPin className="w-3 h-3" />{item.location}
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
          </LazySection>
        </motion.div>
        <p className="text-center text-xs text-muted-foreground mt-6 max-w-2xl mx-auto">{t('testimonials.disclaimer')}</p>

        {/* Client Success Stories Carousel */}
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="mt-16">
          <h3 className="text-2xl md:text-3xl font-bold text-navy dark:text-white mb-3 text-center" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {t('testimonials.successTitle')}
          </h3>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto text-sm md:text-base">
            {t('testimonials.successDesc')}
          </p>
          <LazySection type="cards">
            <SuccessStoriesCarousel />
          </LazySection>
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

function ClaimPipelineTimeline({ currentStage }: { currentStage: string }) {
  const { t, locale } = useLanguage();
  const pipelineStages = useMemo(() => [t('pipeline.submitted'), t('pipeline.validated'), t('pipeline.underReview'), t('pipeline.decision'), t('pipeline.completed')], [locale, t]);
  const stageIndex = PIPELINE_STAGES.indexOf(currentStage);
  const stageColors = ['bg-blue-500', 'bg-gold', 'bg-violet-500', 'bg-amber-500', 'bg-emerald-500'];
  return (
    <div className="relative py-4">
      <div className="flex items-center justify-between relative">
        {pipelineStages.map((stage, i) => {
          const isCompleted = i < stageIndex;
          const isCurrent = i === stageIndex;
          return (
            <div key={stage} className="flex flex-col items-center relative z-10 flex-1">
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                isCompleted ? `${stageColors[i]} text-white shadow-lg` :
                isCurrent ? `${stageColors[i]} text-white ring-4 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 shadow-lg` :
                'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
              }`}>
                {isCompleted ? <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> : i + 1}
              </div>
              <p className={`text-[10px] md:text-xs mt-2 font-medium text-center ${isCurrent ? 'text-navy dark:text-white font-bold' : isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>{stage}</p>
            </div>
          );
        })}
      </div>
      <div className="absolute top-4 md:top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -z-0 mx-8 md:mx-12 rounded-full">
        <motion.div initial={{ width: '0%' }} animate={{ width: `${(stageIndex / (pipelineStages.length - 1)) * 100}%` }} transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }} className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full" />
      </div>
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
  const { t, locale } = useLanguage();

  const docChecklist = useMemo(() => [
    { name: t('doc.residence'), icon: Building2 },
    { name: t('doc.medical'), icon: FileText },
    { name: t('doc.claimForm'), icon: ClipboardCheck },
    { name: t('doc.authLetter'), icon: FileSignature },
    { name: t('doc.idVerification'), icon: BadgeCheck },
  ], [locale, t]);

  const handleTrack = useCallback(async () => {
    const trimmed = trackingId.trim();
    if (!trimmed) { setError(t('track.error')); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      // First check the real claimant database
      const dbRes = await fetch(`/api/claimants?trackingId=${encodeURIComponent(trimmed)}`);
      const dbData = await dbRes.json();

      if (dbRes.ok && dbData.claimants && dbData.claimants.length > 0) {
        const c = dbData.claimants[0];
        // Map Claimant fields to ClaimResult format
        const statusProgressMap: Record<string, number> = {
          'Submitted': 15,
          'Validated': 35,
          'Under Review': 55,
          'Decision': 80,
          'Completed': 100,
        };
        setResult({
          trackingId: c.trackingId || trimmed,
          status: c.status || 'Submitted',
          claimType: c.claimType,
          description: null,
          filedDate: c.filedDate,
          lastUpdated: c.updatedAt,
          notes: c.notes,
          nextSteps: c.status === 'Completed' ? 'Your claim has been resolved.' : c.status === 'Under Review' ? 'Your claim is being reviewed.' : null,
          progress: statusProgressMap[c.status] || 10,
          claimant: { firstName: c.firstName, lastName: c.lastName },
          history: [{ status: c.status, notes: c.notes, date: c.updatedAt }],
        });
        toast.success(t('track.found'), { description: t('track.foundDesc').replace('{id}', c.trackingId || trimmed) });
        setLoading(false);
        return;
      }

      // Fallback to existing claims/track API
      const res = await fetch('/api/claims/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ trackingId: trimmed }) });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Claim not found');
        toast.error(t('track.notFound'), { description: data.error || t('track.notFoundDesc') });
        return;
      }
      setResult(data.claim);
      toast.success(t('track.found'), { description: t('track.foundDesc').replace('{id}', data.claim.trackingId) });
    } catch {
      setError(t('track.networkErrorDesc').replace('.', ''));
      toast.error(t('track.networkError'), { description: t('track.networkErrorDesc') });
    } finally { setLoading(false); }
  }, [trackingId, toast, t]);

  const downloadPDF = useCallback(async () => {
    if (!result) return;
    setPdfLoading(true);
    try {
      const reportRes = await fetch(`/api/claims/report?trackingId=${result.trackingId}`);
      if (!reportRes.ok) throw new Error('Failed to fetch report data');
      const resData = await reportRes.json();
      const report = resData.report;

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
      toast.success(t('track.pdfDownloaded'), { description: `ClaimGuard-Report-${result.trackingId}.pdf` });
    } catch {
      toast.error(t('track.pdfError'), { description: t('track.pdfErrorDesc') });
    } finally { setPdfLoading(false); }
  }, [result, toast]);


  return (
    <section id="track-claim" className="py-14 md:py-20 bg-[#F4F1EB] dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-8">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">{t('track.badge')}</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {t('track.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('track.description')}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <Search className="w-3 h-3 text-emerald-500" />
            <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">{t('track.hint')}</span>
          </div>
        </motion.div>

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleIn} className="max-w-2xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input value={trackingId} onChange={(e) => { setTrackingId(e.target.value); setError(''); }} onKeyDown={(e) => e.key === 'Enter' && handleTrack()} placeholder={t('track.placeholder')} className="pl-12 h-13 text-base border-2 focus:border-gold bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white" disabled={loading} />
            </div>
            <Button onClick={handleTrack} disabled={loading} className="h-13 px-8 bg-navy dark:bg-gray-800 hover:bg-navy-light dark:hover:bg-gray-700 text-white font-semibold text-base">
              {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />{t('track.searching')}</> : <><Search className="w-5 h-5 mr-2" />{t('track.trackClaim')}</>}
            </Button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-red-800 dark:text-red-300 font-medium text-sm">{error}</p>
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{t('track.needHelp')} <button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })} className="underline font-semibold">{t('track.contactSupport')}</button></p>
              </div>
            </div>
          )}
        </motion.div>

        {loading && <TrackClaimSkeleton />}

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <Card className="border-2 border-gold/20 dark:border-gray-700 shadow-xl overflow-hidden bg-white dark:bg-gray-800/50">
              <div className="bg-navy dark:bg-gray-900 p-6 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">{t('track.trackingId')}</p>
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
                  <p className="text-sm font-semibold text-navy dark:text-gray-200 mb-4 uppercase tracking-wider">{t('track.pipeline')}</p>
                  <ClaimPipelineTimeline currentStage={result.status} />
                </div>
                <Separator className="dark:bg-gray-700" />
                <div>
                  <p className="text-sm font-semibold text-navy dark:text-gray-200 mb-3 uppercase tracking-wider">{t('track.checklist')}</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {docChecklist.map((doc, i) => {
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
                  <div><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t('track.claimant')}</p><p className="font-semibold text-navy dark:text-gray-100">{result.claimant.firstName} {result.claimant.lastName}</p></div>
                  <div><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t('track.claimType')}</p><p className="font-semibold text-navy dark:text-gray-100">{result.claimType || 'N/A'}</p></div>
                  <div><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t('track.filedDate')}</p><p className="font-semibold text-navy dark:text-gray-100">{result.filedDate ? new Date(result.filedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p></div>
                  <div><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t('track.estimatedTimeline')}</p><p className="font-semibold text-navy dark:text-gray-100 flex items-center gap-1"><Timer className="w-4 h-4 text-gold" />{result.status === 'Approved' ? t('track.complete') : result.status === 'Pending' ? '6-12 months' : result.status === 'Under Review' ? '3-6 months' : result.status === 'Denied' ? 'Appeal: 3-9 months' : '2-4 weeks'}</p></div>
                </div>
                {result.notes && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1"><AlertCircle className="w-3.5 h-3.5 inline mr-1" />{t('track.importantNotes')}</p>
                    <p className="text-sm text-amber-900 dark:text-amber-200">{result.notes}</p>
                  </div>
                )}
                {result.nextSteps && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                    <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-1"><ArrowRight className="w-3.5 h-3.5 inline mr-1" />{t('track.nextSteps')}</p>
                    <p className="text-sm text-emerald-900 dark:text-emerald-200">{result.nextSteps}</p>
                  </div>
                )}
                {result.history && result.history.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{t('track.history')}</p>
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
                      {result.status === 'Denied' ? t('track.appealMyClaim') : t('track.fixDocuments')}<ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  )}
                  <Button onClick={downloadPDF} disabled={pdfLoading} variant="outline" className="flex-1 border-navy/20 dark:border-gray-600 text-navy dark:text-gray-200 hover:bg-navy/5 dark:hover:bg-gray-700" size="lg">
                    {pdfLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />{t('track.generatingPdf')}</> : <><FileDown className="w-5 h-5 mr-2" />{t('track.downloadPdf')}</>}
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
  const { t } = useLanguage();

  return (
    <section id="what-we-handle" className="py-14 md:py-20 bg-[#F4F1EB] dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-10">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">{t('handle.badge')}</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {t('handle.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('handle.description')}</p>
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
                      <p className="text-xs text-muted-foreground">{t('handle.filingDeadline')}</p>
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
                  <h4 className="text-sm font-semibold text-navy dark:text-gray-200 mb-2">{t('handle.filingDeadline').replace(':', '')}</h4>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">{selectedCase.deadline}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-navy dark:text-gray-200 mb-2">{t('handle.currentStatuses')}</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedCase.statuses.map(s => (
                      <Badge key={s} variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">{s}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-navy dark:text-gray-200 mb-2">{t('handle.detailedInfo')}</h4>
                  <p className="text-sm text-muted-foreground dark:text-gray-400 leading-relaxed">{selectedCase.detail}</p>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button onClick={() => { setSelectedCase(null); document.querySelector('#eligibility-quiz')?.scrollIntoView({ behavior: 'smooth' }); }} className="flex-1 bg-gold hover:bg-gold-dark text-white font-semibold">{t('handle.checkEligibility')}</Button>
                  <Button onClick={() => { setSelectedCase(null); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }} variant="outline" className="flex-1 dark:border-gray-600 dark:text-gray-200">{t('handle.contactUs')}</Button>
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
  const { t } = useLanguage();
  const gradShift = useTransform(scrollY, [800, 1500], [0, 30]);

  const scrollTo = useCallback((id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section className="py-14 md:py-20 bg-navy dark:bg-gray-950 relative overflow-hidden">
      <motion.div className="hidden md:block absolute top-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" style={{ x: gradShift }} aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" aria-hidden="true" />
      <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-gold" />
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          {t('cta.title')}
        </h2>
        <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          {t('cta.description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => scrollTo('#eligibility-quiz')} size="lg" className="bg-gold hover:bg-gold-dark text-white font-semibold text-base px-8 py-6 shadow-xl shadow-gold/20 transition-all hover:shadow-2xl hover:scale-[1.02]">
            <Target className="w-5 h-5 mr-2" />{t('cta.checkEligibility')}
          </Button>
          <Button onClick={() => scrollTo('#track-claim')} size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold text-base px-8 py-6 backdrop-blur-sm transition-all hover:scale-[1.02]">
            <Search className="w-5 h-5 mr-2" />{t('cta.trackMyClaim')}
          </Button>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-8 text-white/40 text-sm">
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold" /><span>{t('cta.getStarted')}</span></div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold" /><span>{t('cta.alwaysFree')}</span></div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold" /><span>{t('cta.confidential')}</span></div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold" /><span>{t('cta.successRate')}</span></div>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: FILING DEADLINE TRACKER
   ═══════════════════════════════════════════════════════════════ */

const FILING_DEADLINES = [
  { caseType: 'NEC Baby Formula', deadline: '2026-09-30', urgency: 'high', icon: Baby, color: 'bg-cyan-500', desc: 'Families of premature infants who developed NEC after cow\'s milk-based formula in NICUs.' },
  { caseType: 'Rideshare Assault', deadline: '2026-11-30', urgency: 'high', icon: Car, color: 'bg-indigo-500', desc: 'Victims of assault, injury, or safety failures during rideshare trips.' },
  { caseType: 'Depo Provera', deadline: '2026-12-31', urgency: 'medium', icon: Pill, color: 'bg-orange-500', desc: 'Users who developed brain tumors (meningiomas) after using Depo Provera.' },
  { caseType: 'CPAP Machines', deadline: '2027-01-15', urgency: 'medium', icon: Activity, color: 'bg-sky-500', desc: 'Users of recalled Philips CPAP/BiPAP devices with defective foam.' },
  { caseType: 'Exactech Implants', deadline: '2027-04-30', urgency: 'medium', icon: Target, color: 'bg-stone-500', desc: 'Patients with recalled Exactech joint replacement implants.' },
  { caseType: 'Hair Relaxer', deadline: '2027-03-15', urgency: 'low', icon: Sparkles, color: 'bg-fuchsia-500', desc: 'Individuals who developed uterine or ovarian cancer after chemical hair relaxer use.' },
  { caseType: 'Social Media', deadline: '2027-06-30', urgency: 'low', icon: Users, color: 'bg-pink-500', desc: 'Families harmed by social media\'s impact on teen mental health.' },
  { caseType: 'Zantac', deadline: '2027-08-31', urgency: 'low', icon: AlertTriangle, color: 'bg-violet-500', desc: 'Long-term Zantac users who developed cancer from NDMA contamination.' },
];

function FilingDeadlineTracker() {
  const { ref, inView } = useInView(0.1);
  const { t, locale } = useLanguage();

  const descKeys = useMemo(() => [
    t('deadlines.desc0'), t('deadlines.desc1'), t('deadlines.desc2'), t('deadlines.desc3'),
    t('deadlines.desc4'), t('deadlines.desc5'), t('deadlines.desc6'), t('deadlines.desc7'),
  ], [locale, t]);

  const getTimeLeft = useCallback((deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now();
    if (diff <= 0) return { text: t('deadlines.deadlinePassed'), urgent: true };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    if (months > 0) return { text: months === 1 ? t('deadlines.monthLeft').replace('{n}', '1') : t('deadlines.monthsLeft').replace('{n}', String(months)), urgent: months <= 3 };
    return { text: days === 1 ? t('deadlines.dayLeft').replace('{n}', '1') : t('deadlines.daysLeft').replace('{n}', String(days)), urgent: days <= 30 };
  }, [locale, t]);

  return (
    <section className="py-14 md:py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-10">
          <Badge className="mb-4 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 text-xs font-semibold uppercase tracking-wider">
            <Timer className="w-3 h-3 mr-1" />{t('deadlines.badge')}
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {t('deadlines.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('deadlines.description')}</p>
        </motion.div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FILING_DEADLINES.map((item, idx) => {
            const { text, urgent } = getTimeLeft(item.deadline);
            return (
              <motion.div key={item.caseType} variants={fadeInUp}>
                <Card className={`h-full border ${urgent ? 'border-red-200 dark:border-red-800 shadow-lg' : 'border-gray-100 dark:border-gray-800'} hover:shadow-xl transition-all hover:-translate-y-1 bg-white dark:bg-gray-800/50`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${urgent ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                        {text}
                      </span>
                    </div>
                    <h3 className="font-bold text-navy dark:text-white text-sm mb-1">{item.caseType}</h3>
                    <p className="text-muted-foreground dark:text-gray-400 text-xs leading-relaxed mb-3">{descKeys[idx]}</p>
                    <div className="text-[10px] text-muted-foreground/60 dark:text-gray-500">{t('deadlines.deadline')} {new Date(item.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">{t('deadlines.note')}</p>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: FAQ
   ═══════════════════════════════════════════════════════════════ */

function FAQSection() {
  const { ref, inView } = useInView(0.1);
  const [search, setSearch] = useState('');
  const { t, locale } = useLanguage();
  const faqItems = useMemo(() => Array.from({ length: 10 }, (_, i) => ({ q: t(`faq.q${i}` as `faq.q${number}`), a: t(`faq.a${i}` as `faq.a${number}`) })), [locale, t]);
  const filteredFAQ = useMemo(() => {
    if (!search.trim()) return faqItems;
    const q = search.toLowerCase();
    return faqItems.filter(item => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q));
  }, [search, faqItems]);
  return (
    <section id="faq" className="py-14 md:py-20 bg-white dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-8">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">{t('faq.badge')}</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {t('faq.title')}
          </h2>
          <p className="text-muted-foreground text-lg">{t('faq.description')}</p>
        </motion.div>
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('faq.search')}
            className="pl-10 h-11 bg-[#F4F1EB] dark:bg-gray-800 border-0 focus-visible:ring-gold"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy transition-colors" aria-label={t('faq.clearSearch')}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer}>
          <Accordion type="single" collapsible className="space-y-3">
            {filteredFAQ.map((item, i) => (
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
          {filteredFAQ.length === 0 && (
            <p className="text-center text-muted-foreground py-8">{t('faq.noResults')}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: RESOURCES & INSIGHTS
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   SECTION: CASE STUDIES
   ═══════════════════════════════════════════════════════════════ */

function CaseStudiesSection() {
  const { ref, inView } = useInView(0.1);
  const { t } = useLanguage();
  return (
    <section id="case-studies" className="py-14 md:py-20 bg-[#F4F1EB] dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-10">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">{t('caseStudies.badge')}</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {t('caseStudies.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('caseStudies.description')}</p>
        </motion.div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} className="space-y-12">
          {CASE_STUDIES.map((cs, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <Card className="overflow-hidden border-0 shadow-lg hover-glow">
                <div className="grid md:grid-cols-2">
                  <div className={`${cs.badge} p-8 md:p-10 text-white flex flex-col justify-center`}>
                    <Badge className="self-start bg-white/20 text-white border-white/30 text-xs font-medium mb-4">{cs.caseType}</Badge>
                    <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>{t('caseStudies.client')} {cs.name}</h3>
                    <div className="text-4xl font-bold mt-4 mb-2">{cs.compensation}</div>
                    <p className="text-white/70 text-sm">{t('caseStudies.settlementAmount')}</p>
                    <div className="flex items-center gap-4 mt-6">
                      <div className="text-center"><p className="text-xs text-white/50 uppercase tracking-wider mb-1">{t('stories.before')}</p><Badge className="bg-white/20 text-white border-white/20 text-sm">{cs.beforeStatus}</Badge></div>
                      <ArrowRight className="w-5 h-5 text-white/40" aria-hidden="true" />
                      <div className="text-center"><p className="text-xs text-white/50 uppercase tracking-wider mb-1">{t('stories.after')}</p><Badge className="bg-emerald-500/30 text-emerald-100 border-emerald-400/30 text-sm">{cs.afterStatus}</Badge></div>
                    </div>
                  </div>
                  <div className="p-8 md:p-10 bg-white dark:bg-gray-800/50">
                    <div className="space-y-6">
                      <div><p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{t('caseStudies.challenge')}</p><p className="text-sm text-navy/80 dark:text-gray-300 leading-relaxed">{cs.challenge}</p></div>
                      <div><p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Zap className="w-3.5 h-3.5" />{t('caseStudies.solution')}</p><p className="text-sm text-navy/80 dark:text-gray-300 leading-relaxed">{cs.solution}</p></div>
                      <div><p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />{t('caseStudies.outcome')}</p><p className="text-sm text-navy/80 dark:text-gray-300 leading-relaxed">{cs.outcome}</p></div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        <p className="text-center text-xs text-muted-foreground mt-8 max-w-2xl mx-auto">{t('caseStudies.disclaimer')}</p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: CLIENT PORTAL CTA
   ═══════════════════════════════════════════════════════════════ */

function ClientPortalSection() {
  const { ref, inView } = useInView(0.1);
  const { t } = useLanguage();
  return (
    <section className="py-14 md:py-20 bg-gradient-to-br from-navy via-navy-light to-navy dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 15, repeat: Infinity }} className="absolute -top-20 -right-20 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp}>
          <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center mx-auto mb-6">
            <LayoutDashboard className="w-8 h-8 text-gold" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {t('portal.title')}
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            {t('portal.description')}
          </p>
          <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            {[
              { icon: Eye, label: t('portal.realTime') },
              { icon: FileText, label: t('portal.docVault') },
              { icon: Bell, label: t('portal.deadlineAlerts') },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <item.icon className="w-5 h-5 text-gold mx-auto mb-2" />
                <p className="text-white/80 text-sm font-medium">{item.label}</p>
              </div>
            ))}
          </div>
          <Button size="lg" onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })} className="bg-gold hover:bg-gold-dark text-white font-bold px-8 py-3 text-base">
            <ArrowRight className="w-4 h-4 mr-2" />{t('portal.comingSoon')}
          </Button>
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
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [claimType, setClaimType] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkUpdates, setCheckUpdates] = useState(true);
  const [checkDeadlines, setCheckDeadlines] = useState(true);
  const [checkTips, setCheckTips] = useState(false);
  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!emailRegex.test(email)) { toast.error(t('newsletter.validEmail')); return; }
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
        toast.success(data.message || t('newsletter.welcome'));
        setTimeout(() => { setSubmitted(false); setEmail(''); setClaimType(''); setCheckUpdates(true); setCheckDeadlines(true); setCheckTips(false); }, 4000);
      } else {
        toast.error(data.error || t('newsletter.tryAgain'));
      }
    } catch {
      toast.error(t('newsletter.tryAgain'));
    } finally { setLoading(false); }
  }, [email, claimType, checkUpdates, checkDeadlines, checkTips, emailRegex]);

  return (
    <section id="newsletter" className="py-14 md:py-20 bg-navy dark:bg-gray-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl" aria-hidden="true" />
      <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-gold/20 flex items-center justify-center mb-6">
              <Mail className="w-7 h-7 text-gold" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>{t('newsletter.stayInformed')}</h2>
            <p className="text-white/60 mb-6 leading-relaxed">{t('newsletter.description')}</p>
            <div className="space-y-3">
              {[
                { label: t('newsletter.claimUpdates'), checked: checkUpdates, onChange: setCheckUpdates, icon: Search },
                { label: t('newsletter.deadlineAlerts'), checked: checkDeadlines, onChange: setCheckDeadlines, icon: Clock },
                { label: t('newsletter.expertTips'), checked: checkTips, onChange: setCheckTips, icon: BookOpen },
              ].map((item) => (
                <label key={item.label} onClick={() => item.onChange(!item.checked)} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${item.checked ? 'bg-gold border-gold' : 'border-white/30 group-hover:border-white/50'}`}>
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
                <h3 className="text-lg font-bold text-white mb-2">{t('newsletter.getNewsletter')}</h3>
                <p className="text-white/50 text-sm mb-6">{t('newsletter.subscriberCount')}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label className="text-white/60 text-xs mb-1 block">{t('newsletter.emailLabel')}</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-gold" />
                  </div>
                  <div>
                    <Label className="text-white/60 text-xs mb-1 block">{t('newsletter.claimType')}</Label>
                    <Input value={claimType} onChange={(e) => setClaimType(e.target.value)} placeholder="e.g., Camp Lejeune, Roundup..." className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-gold text-sm" />
                  </div>
                  <Button type="submit" disabled={loading || submitted} className={`w-full h-12 font-semibold transition-all text-base ${submitted ? 'bg-emerald-500' : 'bg-gold hover:bg-gold-dark text-white'}`}>
                    {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />{t('newsletter.subscribing')}</> : submitted ? <><CheckCircle2 className="w-5 h-5 mr-2" />{t('newsletter.subscribed')}</> : <><Send className="w-5 h-5 mr-2" />{t('newsletter.subscribe')}</>}
                  </Button>
                </form>
                <div className="flex items-center justify-center gap-4 mt-4 text-white/30 text-xs">
                  <div className="flex items-center gap-1"><Lock className="w-3 h-3" /><span>{t('newsletter.encrypted')}</span></div>
                  <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /><span>{t('newsletter.noSpam')}</span></div>
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
   SECTION: RESOURCES & INSIGHTS (BLOG)
   ═══════════════════════════════════════════════════════════════ */

const BLOG_ARTICLES = [
  {
    id: 'camp-lejeune-guide',
    title: 'The Complete Guide to Camp Lejeune Water Contamination Claims',
    excerpt: 'Everything you need to know about filing a claim under the Camp Lejeune Justice Act...',
    date: 'Jan 15, 2025',
    dateISO: '2025-01-15',
    readTime: '8 min read',
    category: 'Camp Lejeune',
    icon: Building2,
    color: 'bg-blue-500',
    content: 'The Camp Lejeune Justice Act of 2022 created a pathway for veterans, their families, and civilians who were exposed to contaminated water at Camp Lejeune between 1953 and 1987 to seek compensation. Eligible individuals must have lived or worked at the base for at least 30 days during that period and later developed one of several qualifying conditions, including kidney cancer, liver cancer, non-Hodgkin lymphoma, leukemia, multiple myeloma, Parkinson\'s disease, and various other cancers and diseases. The filing process requires comprehensive documentation: military service records or proof of residence, medical records linking your condition to the exposure, and a detailed timeline. Claims are reviewed by the Navy and Justice Department, with current processing times ranging from 6 to 18 months. Our specialists recommend gathering all documentation before filing to avoid the common "Correction Needed" status that delays an estimated 30% of claims.',
  },
  {
    id: 'roundup-update',
    title: 'Roundup Lawsuit 2025: Latest Settlement Updates and Deadlines',
    excerpt: 'Stay informed about the latest developments in the Roundup (glyphosate) litigation...',
    date: 'Jan 10, 2025',
    dateISO: '2025-01-10',
    readTime: '6 min read',
    category: 'Roundup',
    icon: Leaf,
    color: 'bg-emerald-500',
    content: 'The Roundup (glyphosate) litigation continues to evolve in 2025 with significant settlement developments. Bayer, which acquired Monsanto in 2018, has set aside approximately $16 billion for settlements. Current settlement offers range from $5,000 to over $200,000 depending on the severity of diagnosis, duration of Roundup use, and individual circumstances. To qualify, claimants typically need a diagnosis of non-Hodgkin lymphoma or a related condition, proof of Roundup use for at least one year, and medical records supporting the diagnosis. Filing deadlines vary by state, with some bellwether trials scheduled throughout 2025. Key documents needed include purchase receipts or employer records showing herbicide use, complete medical records with pathology reports, and a physician\'s opinion linking the diagnosis to glyphosate exposure. The settlement program remains open, but claimants are encouraged to file as early as possible as deadlines may tighten.',
  },
  {
    id: 'documentation-tips',
    title: '10 Critical Documents You Need for Your Mass Tort Claim',
    excerpt: 'Missing documents is the #1 reason claims get delayed or denied...',
    date: 'Jan 5, 2025',
    dateISO: '2025-01-05',
    readTime: '10 min read',
    category: 'Tips & Guides',
    icon: ClipboardCheck,
    color: 'bg-amber-500',
    content: 'Documentation is the backbone of any successful mass tort claim. Here are the 10 critical documents you need: (1) Government-issued photo ID — verify your identity; (2) Proof of residence during the relevant time period — utility bills, lease agreements, or tax returns; (3) Complete medical records — diagnosis reports, treatment records, and prescription histories from all providers; (4) Proof of exposure — purchase receipts, employment records, or service records showing product use or environmental exposure; (5) Physician\'s opinion letter — a written statement from your doctor linking your condition to the exposure; (6) Timeline documentation — a chronological account connecting exposure to diagnosis; (7) Financial impact records — tax returns, pay stubs, or employer statements showing lost wages; (8) Personal impact statement — a detailed account of how your condition affects daily life; (9) Insurance records — documentation of medical expenses covered and out-of-pocket costs; (10) Prior claim records — any previous claims or appeals related to your condition. Organize all documents chronologically and keep copies of everything you submit.',
  },
  {
    id: 'nec-baby-formula-claims',
    title: 'NEC Baby Formula Claims: What Parents Need to Know in 2025',
    excerpt: 'If your premature baby developed NEC after receiving formula in the NICU, you may be eligible...',
    date: 'Feb 5, 2025',
    dateISO: '2025-02-05',
    readTime: '7 min read',
    category: 'NEC Baby Formula',
    icon: Baby,
    color: 'bg-cyan-500',
    content: 'Necrotizing enterocolitis (NEC) is a devastating intestinal disease that primarily affects premature infants. Research has established a strong link between cow\'s milk-based infant formula and significantly increased NEC risk in preterm babies. Major manufacturers including Mead Johnson (Enfamil) and Abbott Laboratories (Similac) face litigation for failing to adequately warn hospitals and parents about these dangers. Eligible families typically include parents of babies born before 37 weeks who were fed cow\'s milk-based formula in the NICU and subsequently developed NEC. Compensation may cover medical expenses, surgical costs, long-term care needs, and pain and suffering. Key documents include birth records, NICU feeding logs, medical records documenting NEC diagnosis and treatment, and itemized medical bills. Many cases have already resulted in significant settlements, and multi-district litigation continues to gain momentum in 2025.',
  },
  {
    id: 'depo-provera-brain-tumor-link',
    title: 'Depo Provera Brain Tumor Link: Filing a Claim After a Meningioma Diagnosis',
    excerpt: 'New research connects the Depo Provera birth control shot to increased meningioma risk...',
    date: 'Feb 12, 2025',
    dateISO: '2025-02-12',
    readTime: '6 min read',
    category: 'Depo Provera',
    icon: Pill,
    color: 'bg-orange-500',
    content: 'A major 2024 study published in the BMJ found that prolonged use of the Depo Provera contraceptive injection is associated with a significantly increased risk of developing intracranial meningiomas — typically benign but potentially serious brain tumors. The risk was highest among women who used Depo Provera for 12 months or longer. Meningiomas can cause headaches, vision problems, seizures, and neurological deficits, often requiring surgical removal. Women who developed meningiomas after using Depo Provera may be eligible to file claims against Pfizer, the manufacturer. Required documentation includes medical records confirming meningioma diagnosis, pharmacy records showing Depo Provera prescriptions, treatment records, and physician opinions linking the tumor to the contraceptive. Claimants should file promptly as statutes of limitations vary by state and many begin from the date of diagnosis.',
  },
  {
    id: 'social-media-teen-mental-health',
    title: 'Social Media Lawsuits: Holding Platforms Accountable for Teen Mental Health Harm',
    excerpt: 'Internal documents reveal social media companies knew their platforms were harming children...',
    date: 'Feb 20, 2025',
    dateISO: '2025-02-20',
    readTime: '9 min read',
    category: 'Social Media',
    icon: Users,
    color: 'bg-pink-500',
    content: 'Multi-district litigation is moving forward against Meta (Instagram/Facebook), TikTok, Snapchat, and YouTube for their roles in the teen mental health crisis. Internal company documents obtained through discovery reveal that platforms were fully aware of the harmful effects of their algorithms on young users but chose engagement and profit over safety. Eligible cases typically involve minors (under 18) who developed eating disorders, depression, anxiety, self-harm behaviors, or suicidal ideation linked to social media use. Parents report that their children spent excessive hours on these platforms and experienced worsening mental health. Compensation may cover therapy costs, psychiatric treatment, inpatient care, and pain and suffering. Key evidence includes screen time records, mental health treatment records, school counseling reports, and social media usage logs. Over 500 cases are currently pending in federal court, with bellwether trials expected in late 2025.',
  },
  {
    id: 'zantac-ndma-cancer',
    title: 'Zantac Cancer Claims: What You Need to Know About NDMA Contamination',
    excerpt: 'The Zantac recall affects millions of users. Learn about the link between ranitidine and cancer...',
    date: 'Mar 5, 2025',
    dateISO: '2025-03-05',
    readTime: '7 min read',
    category: 'Zantac',
    icon: AlertTriangle,
    color: 'bg-violet-500',
    content: 'In 2020, the FDA recalled all ranitidine products (brand name Zantac) after independent testing discovered that the medication could form NDMA (N-nitrosodimethylamine), a probable human carcinogen, when exposed to heat or stored over time. NDMA is the same compound that led to massive recalls of blood pressure medications in 2018-2019. Individuals who took Zantac regularly for three months or more and subsequently developed cancers of the stomach, liver, bladder, kidney, pancreas, or esophagus may be eligible. The litigation has consolidated into multi-district proceedings in federal court. Required documentation includes pharmacy records showing Zantac prescriptions, complete medical records with cancer diagnosis and pathology reports, and a physician\'s opinion linking the cancer to ranitidine use. Settlement amounts vary widely based on cancer type, duration of use, and individual circumstances.',
  },
  {
    id: 'hair-relaxer-cancer-lawsuits',
    title: 'Hair Relaxer Cancer Lawsuits: The Science Behind the Claims',
    excerpt: 'NIH research confirms the link between chemical hair straighteners and increased cancer risk...',
    date: 'Mar 15, 2025',
    dateISO: '2025-03-15',
    readTime: '8 min read',
    category: 'Hair Relaxer',
    icon: Sparkles,
    color: 'bg-fuchsia-500',
    content: 'A landmark study by the National Institutes of Health (NIH) found that women who frequently used chemical hair straightening products were more than twice as likely to develop uterine cancer compared to those who never used them. The risk was even higher for women who used these products more than four times per year for over five years. Endocrine-disrupting chemicals like parabens, bisphenol A, and phthalates found in hair relaxers are believed to alter hormonal balance and promote cancer cell growth. Major manufacturers including L\'Oreal, SoftSheen-Carson, and Strength of Nature face lawsuits for failing to warn consumers about these cancer risks. Eligible claimants include women who developed uterine cancer, endometrial cancer, ovarian cancer, or uterine fibroids after regular use of chemical hair straighteners. Key documentation includes purchase records, medical records with cancer diagnosis, and treatment history.',
  },
  {
    id: 'cpap-recall-philips',
    title: 'Philips CPAP Recall: Health Risks, Compensation, and Your Next Steps',
    excerpt: 'Millions of recalled CPAP machines may have exposed users to harmful chemicals and particles...',
    date: 'Mar 25, 2025',
    dateISO: '2025-03-25',
    readTime: '8 min read',
    category: 'CPAP Machines',
    icon: Activity,
    color: 'bg-sky-500',
    content: 'Philips Respironics recalled millions of CPAP, BiPAP, and mechanical ventilator devices in June 2021 after discovering that the PE-PUR sound abatement foam used in these devices could degrade over time, releasing black particles, volatile organic compounds (VOCs), and other harmful chemicals into the airway of users. Health risks associated with exposure include respiratory irritation, asthma exacerbation, sinus infections, headaches, and potentially more serious conditions including cancer. Philips has agreed to a consent decree with the FDA requiring extensive corrective actions. Claimants who used recalled devices and experienced health problems may be eligible for compensation covering medical expenses, device replacement costs, and pain and suffering. Required documentation includes device serial numbers, medical records documenting health issues after CPAP use, and proof of device purchase or prescription.',
  },
  {
    id: '3m-earplugs-settlement',
    title: '3M Earplugs Settlement: What Veterans Need to Know About Their Claims',
    excerpt: '3M agreed to a multi-billion dollar settlement over defective combat earplugs. Here\'s how to file...',
    date: 'Apr 1, 2025',
    dateISO: '2025-04-01',
    readTime: '7 min read',
    category: '3M Earplugs',
    icon: Shield,
    color: 'bg-lime-500',
    content: '3M Company agreed to pay over $6 billion to resolve claims that its dual-ended combat earplugs (CAEv2) were defectively designed, causing thousands of military service members to suffer hearing loss and tinnitus. The earplugs, issued to service members between 2003 and 2015, were too short for proper insertion into the ear canal, causing them to loosen during use and fail to protect against battlefield noise. Veterans who served during this period and experienced hearing loss, tinnitus, or both may be eligible for compensation. The claims process requires military service records showing deployment during the relevant period, audiologist evaluations confirming hearing damage, and documentation of the impact on quality of life. Settlement amounts vary significantly based on the severity of hearing damage, with some claims receiving six-figure awards.',
  },
  {
    id: 'rideshare-assault-safety',
    title: 'Rideshare Safety Lawsuits: Your Rights After an Assault or Injury',
    excerpt: 'Uber and Lyft face mounting legal pressure over inadequate driver vetting and passenger safety...',
    date: 'Apr 10, 2025',
    dateISO: '2025-04-10',
    readTime: '9 min read',
    category: 'Rideshare Assault',
    icon: Car,
    color: 'bg-indigo-500',
    content: 'Rideshare companies Uber and Lyft face increasing legal liability for inadequate driver background checks, insufficient safety measures, and failure to protect passengers from assault, sexual assault, kidnapping, and other violent crimes. Thousands of incidents have been reported, and both companies have settled numerous lawsuits. Victims may be entitled to compensation from both the individual driver and the rideshare company under theories of negligent hiring, negligent retention, and vicarious liability. If you experienced assault, injury, or a safety failure during a rideshare trip, it is critical to preserve evidence: save your trip receipt with driver details, screenshot any in-app safety reports, seek medical attention immediately, and file a police report. Compensation may cover medical expenses, therapy costs, lost wages, pain and suffering, and punitive damages. Statutes of limitations vary by state, typically ranging from one to three years from the date of the incident.',
  },
  {
    id: 'roblox-gaming-microtransactions',
    title: 'Roblox and Gaming Lawsuits: Can Parents Recover Unauthorized Charges?',
    excerpt: 'Children are spending thousands on in-game purchases without parental consent. Here\'s what the law says...',
    date: 'Apr 14, 2025',
    dateISO: '2025-04-14',
    readTime: '8 min read',
    category: 'Gaming / Roblox',
    icon: Gamepad2,
    color: 'bg-red-500',
    content: 'Gaming platforms like Roblox, Fortnite, and Minecraft face mounting legal scrutiny over manipulative design patterns targeting children. These platforms use virtual currencies, loot boxes, battle passes, and psychological pressure tactics that obscure the real-world cost of in-game purchases, making it difficult for children to understand they are spending actual money. The Federal Trade Commission has received thousands of complaints from parents whose children made unauthorized purchases ranging from hundreds to tens of thousands of dollars. California and several other states have introduced legislation banning loot boxes for minors. Legal claims may proceed under theories of unfair and deceptive trade practices, violations of child privacy laws (COPPA), and consumer protection statutes. Parents who discover unauthorized charges should immediately request refunds from the platform, dispute charges with their credit card company, document all purchases with screenshots, and report the incident to the FTC. Class action lawsuits are currently moving forward against multiple gaming companies.',
  },
  {
    id: 'elmiron-vision-damage',
    title: 'Elmiron Vision Damage: What Patients Need to Know About Maculopathy Claims',
    excerpt: 'Long-term Elmiron use has been linked to permanent vision damage. Learn about your legal options...',
    date: 'Apr 8, 2025',
    dateISO: '2025-04-08',
    readTime: '7 min read',
    category: 'Elmiron',
    icon: Eye,
    color: 'bg-yellow-500',
    content: 'Elmiron (pentosan polysulfate sodium) has been prescribed for decades to treat interstitial cystitis, a chronic bladder condition. However, a 2018 study published in the Journal of Urology and subsequent research by Emory Eye Center revealed that long-term Elmiron use is linked to a unique form of pigmentary maculopathy — a condition that damages the macula (the part of the retina responsible for sharp central vision) and can cause permanent vision loss. Symptoms include difficulty reading, blurred vision, dark spots in the visual field, and difficulty adapting to dim lighting. The damage may continue to progress even after stopping the medication. Manufacturer Janssen Pharmaceuticals (a subsidiary of Johnson & Johnson) did not include warnings about this risk on the Elmiron label until June 2020, despite knowing about the potential connection for years. Patients who took Elmiron for two years or more and developed vision problems may be eligible for compensation. Required documentation includes prescribing records, ophthalmologist evaluations showing macular changes, and visual field test results.',
  },
  {
    id: 'taxotere-permanent-hair-loss',
    title: 'Taxotere Permanent Hair Loss: Filing a Claim for Chemotherapy Alopecia',
    excerpt: 'Thousands of breast cancer survivors were never warned that Taxotere could cause permanent baldness...',
    date: 'Apr 2, 2025',
    dateISO: '2025-04-02',
    readTime: '8 min read',
    category: 'Taxotere',
    icon: Leaf,
    color: 'bg-green-500',
    content: 'Taxotere (docetaxel), manufactured by Sanofi-Aventis, is a chemotherapy drug widely used to treat breast cancer. While temporary hair loss (alopecia) is an expected side effect of most chemotherapy drugs, studies have shown that Taxotere causes permanent, irreversible hair loss at rates significantly higher than alternative treatments like Taxol (paclitaxel). Internal documents revealed that Sanofi knew about the risk of permanent alopecia as early as 2005 but failed to warn patients or physicians in the United States, even though a warning was added to the European label in 2005. Women who lost their hair permanently after Taxotere treatment have successfully brought claims for failure to warn, negligence, and product liability. Compensation may cover the cost of wigs, hair restoration treatments, emotional distress, and loss of enjoyment of life. Thousands of cases are consolidated in multi-district litigation in federal court. Required documentation includes chemotherapy treatment records, photographs showing hair loss, dermatologist evaluations, and evidence of the emotional and psychological impact.',
  },
  {
    id: 'bard-powerport-complications',
    title: 'Bard PowerPort Complications: Fracture, Migration, and Infection Claims',
    excerpt: 'Defective Bard PowerPort devices have fractured inside patients\' bodies, causing life-threatening complications...',
    date: 'Mar 28, 2025',
    dateISO: '2025-03-28',
    readTime: '8 min read',
    category: 'Bard PowerPort',
    icon: Shield,
    color: 'bg-red-500',
    content: 'The Bard PowerPort is an implantable port catheter device used to deliver medications, chemotherapy, and IV fluids directly into the bloodstream. Manufactured by C.R. Bard (now part of Becton Dickinson), these devices have been linked to serious and potentially life-threatening complications. The primary issue involves catheter fractures — the device can crack or break apart inside the body, sending plastic fragments through the bloodstream. This can lead to serious infections, blood clots, pulmonary embolisms, cardiac arrhythmias, and damage to vital organs. Many patients require emergency surgery to remove the fragmented device and repair the damage. Internal company documents suggest that Bard was aware of higher-than-expected failure rates but continued to market the device without adequate warnings. Patients who experienced PowerPort fractures, infections, or other complications requiring surgical intervention may be eligible for significant compensation. Required documentation includes implantation records, medical records documenting complications, CT scans or imaging showing device failure, and surgical reports.',
  },
  {
    id: 'hernia-mesh-failure-lawsuits',
    title: 'Hernia Mesh Failure: When a Simple Repair Turns Into Years of Pain',
    excerpt: 'Defective hernia mesh devices have caused chronic pain, infection, and the need for multiple revision surgeries...',
    date: 'Mar 18, 2025',
    dateISO: '2025-03-18',
    readTime: '9 min read',
    category: 'Hernia Mesh',
    icon: Shield,
    color: 'bg-amber-500',
    content: 'Hernia repair is one of the most common surgical procedures in the United States, with over one million repairs performed annually. Many of these procedures use surgical mesh to reinforce the weakened abdominal wall. However, several manufacturers including Bard Davol, Ethicon (Johnson & Johnson), and Atrium Medical have produced hernia mesh products that have failed at alarming rates, causing severe complications for patients. Common failure modes include mesh shrinkage, adhesion to internal organs, mesh migration from the implantation site, chronic infection resistant to antibiotics, nerve damage causing debilitating pain, and bowel obstruction or perforation. Many patients require multiple revision surgeries, each carrying additional risk and recovery time. Studies have found that certain polypropylene mesh products have complication rates exceeding 20-30%. Hundreds of thousands of lawsuits have been filed, with significant verdicts and settlements. Required documentation includes surgical records, CT scans showing mesh complications, infection culture results, pain management records, and employment records showing lost wages.',
  },
  {
    id: 'paraquat-parkinsons-lawsuits',
    title: 'Paraquat Parkinson\'s Disease: Agricultural Workers Fight for Justice',
    excerpt: 'The weed killer Paraquat is banned in dozens of countries but still used widely in the U.S. despite links to Parkinson\'s...',
    date: 'Mar 10, 2025',
    dateISO: '2025-03-10',
    readTime: '8 min read',
    category: 'Paraquat',
    icon: Zap,
    color: 'bg-rose-500',
    content: 'Paraquat dichloride is one of the most widely used herbicides in the United States, applied to millions of acres of farmland annually despite being banned in over 60 countries including China, the European Union, and Brazil. Licensed applicators — primarily farmers, agricultural workers, and crop dusters — who were exposed to Paraquat have developed Parkinson\'s disease at rates significantly higher than the general population. A major 2011 study by the National Institutes of Health found that individuals with the highest Paraquat exposure were 2.5 times more likely to develop Parkinson\'s disease. The Agricultural Health Study and multiple subsequent meta-analyses have reinforced this connection. Manufacturer Syngenta has faced thousands of lawsuits alleging that the company failed to adequately warn about the Parkinson\'s risk. Multi-district litigation is centralized in federal court in Illinois. Eligible claimants include licensed applicators and agricultural workers who developed Parkinson\'s disease after documented Paraquat exposure. Required documentation includes applicator license records, employment records showing agricultural work, medical records confirming Parkinson\'s diagnosis, and expert medical opinions linking the disease to Paraquat exposure.',
  },
];

/* ═══════════════════════════════════════════════════════════════
   DATA: NEW SECTIONS CONSTANTS
   ═══════════════════════════════════════════════════════════════ */

const NEWS_HEADLINES = [
  "NEC Baby Formula: $1.2B settlement fund reaches 40% payout milestone",
  "3M Earplugs: Second phase claims window expected to open Q3 2026",
  "Hair Relaxer: MDL bellwether trial date set for September 2026",
  "Camp Lejeune: Navy processes record 500+ claims per month",
  "CPAP Recall: Philips agrees to additional $100M compensation fund",
  "Social Media: Meta faces 5,000+ pending claims from school districts",
  "Depo Provera: FDA orders new black box warning label review",
  "Roundup: Bayer announces $2B supplemental settlement fund",
];

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming",
];

const CLAIM_FORM_CASE_TYPES = [
  "Camp Lejeune","Roundup","Talc/Baby Powder","Hernia Mesh","Paraquat",
  "Firefighting Foam (AFFF)","Zantac","Hair Relaxer","CPAP Machines","Social Media",
  "Rideshare Assault","NEC Baby Formula","Depo Provera","Roblox/Gaming",
  "3M Earplugs","Exactech Implants","Bard PowerPort","Elmiron","Taxotere","Other",
];

const SETTLEMENT_DATA = [
  { name: "Camp Lejeune", icon: Building2, claims: 4821, approved: 78, avgRecovery: "$142,000", status: "Active" as const, progress: 78 },
  { name: "3M Earplugs", icon: Shield, claims: 315600, approved: 52, avgRecovery: "$77,400", status: "Settling" as const, progress: 85 },
  { name: "Roundup", icon: Leaf, claims: 124700, approved: 89, avgRecovery: "$175,000", status: "Settling" as const, progress: 92 },
  { name: "Talc / Baby Powder", icon: Baby, claims: 38900, approved: 64, avgRecovery: "$234,500", status: "Active" as const, progress: 64 },
  { name: "Hernia Mesh", icon: Activity, claims: 21500, approved: 71, avgRecovery: "$98,700", status: "Active" as const, progress: 71 },
  { name: "Paraquat", icon: Zap, claims: 6840, approved: 45, avgRecovery: "$156,200", status: "Active" as const, progress: 45 },
  { name: "NEC Baby Formula", icon: Baby, claims: 14320, approved: 83, avgRecovery: "$312,000", status: "Settling" as const, progress: 40 },
  { name: "CPAP Machines", icon: Brain, claims: 56100, approved: 67, avgRecovery: "$42,800", status: "Active" as const, progress: 67 },
  { name: "Hair Relaxer", icon: Heart, claims: 9240, approved: 38, avgRecovery: "$89,300", status: "Active" as const, progress: 38 },
  { name: "Social Media", icon: Globe, claims: 28700, approved: 22, avgRecovery: "$54,100", status: "Active" as const, progress: 22 },
  { name: "Zantac", icon: Pill, claims: 78400, approved: 58, avgRecovery: "$126,800", status: "Settling" as const, progress: 58 },
  { name: "Depo Provera", icon: Pill, claims: 3210, approved: 15, avgRecovery: "$198,500", status: "Active" as const, progress: 15 },
];

const VIDEO_TESTIMONIALS = [
  { name: "Maria S.", caseType: "Camp Lejeune", duration: "2:34", quote: "After years of illness with no answers, ClaimGuard Pro connected me with specialists who finally got to the bottom of my condition.", image: "/testimonials/maria.jpg", accent: "#059669", views: "12.4K", date: "Mar 2025" },
  { name: "David W.", caseType: "Roundup", duration: "3:12", quote: "I never thought a gardening product could cause so much harm. The team at ClaimGuard Pro fought tirelessly for our family.", image: "/testimonials/david.jpg", accent: "#16a34a", views: "8.7K", date: "Feb 2025" },
  { name: "Angela T.", caseType: "Talc", duration: "1:58", quote: "The compassion and professionalism I experienced was incredible. They made a very difficult time much more manageable.", image: "/testimonials/angela.jpg", accent: "#9333ea", views: "15.2K", date: "Jan 2025" },
  { name: "James R.", caseType: "Hernia Mesh", duration: "4:21", quote: "My surgery left me with complications no one warned me about. ClaimGuard Pro helped me understand my rights and get compensated.", image: "/testimonials/james.jpg", accent: "#2563eb", views: "6.3K", date: "Dec 2024" },
  { name: "Patricia M.", caseType: "Paraquat", duration: "2:47", quote: "As a farmer's widow, I didn't know where to turn. ClaimGuard Pro handled everything and secured a settlement we desperately needed.", image: "/testimonials/patricia.jpg", accent: "#d97706", views: "9.1K", date: "Nov 2024" },
  { name: "Robert L.", caseType: "3M Earplugs", duration: "3:05", quote: "After serving my country, losing my hearing was devastating. ClaimGuard Pro ensured the VA and manufacturers were held accountable.", image: "/testimonials/robert.jpg", accent: "#dc2626", views: "11.8K", date: "Oct 2024" },
];

/* ═══════════════════════════════════════════════════════════════
   SECTION: LANGUAGE TOGGLE BANNER
   ═══════════════════════════════════════════════════════════════ */

function LanguageToggleBanner() {
  const { locale, setLocale, t } = useLanguage();
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem('claimguard-lang-banner-dismissed') === 'true'; } catch { return false; }
  });

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    try { localStorage.setItem('claimguard-lang-banner-dismissed', 'true'); } catch { /* noop */ }
  }, []);

  const handleToggle = useCallback(() => {
    setLocale(locale === 'en' ? 'es' : 'en');
  }, [locale, setLocale]);

  if (dismissed) return null;

  return (
    <div className="bg-blue-900/50 text-blue-100 py-2">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3 text-sm">
        <Globe className="w-4 h-4 shrink-0" />
        {locale === 'en' ? (
          <span>{t('lang.preferSpanish')}{' '}
            <button onClick={handleToggle} className="underline underline-offset-2 hover:text-white font-medium transition-colors">{t('lang.switchSpanish')}</button>
          </span>
        ) : (
          <span>{t('lang.preferEnglish')}{' '}
            <button onClick={handleToggle} className="underline underline-offset-2 hover:text-white font-medium transition-colors">{t('lang.switchEnglish')}</button>
          </span>
        )}
        <button onClick={handleDismiss} className="ml-4 text-blue-300 hover:text-white transition-colors" aria-label={t('lang.dismiss')}>×</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: LIVE NEWS TICKER
   ═══════════════════════════════════════════════════════════════ */

function LiveNewsTicker() {
  const { t } = useLanguage();
  useEffect(() => {
    if (document.getElementById('claimguard-ticker-keyframes')) return;
    const style = document.createElement('style');
    style.id = 'claimguard-ticker-keyframes';
    style.textContent = `@keyframes news-scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}.animate-news-scroll{animation:news-scroll 45s linear infinite}`;
    document.head.appendChild(style);
  }, []);

  return (
    <div className="bg-gray-900 py-2 border-y border-gray-800 overflow-hidden">
      <div className="flex items-center">
        <div className="shrink-0 flex items-center gap-2 px-4 border-r border-gray-800">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" /></span>
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">{t('news.breaking')}</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="animate-news-scroll flex whitespace-nowrap">
            {[...NEWS_HEADLINES, ...NEWS_HEADLINES].map((headline, i) => (
              <span key={i} className="inline-flex items-center">
                <span className="text-xs text-gray-400 mx-8">{headline}</span>
                <span className="text-gray-700 mx-1">&bull;</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: LIVE CLAIM COUNTER
   ═══════════════════════════════════════════════════════════════ */

function useAnimatedCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress >= 1) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [target, duration]);
  return count;
}

function LiveClaimCounter() {
  const { ref, inView } = useInView(0.2);
  const { t } = useLanguage();

  // Daily-varying stats — different every day, deterministic based on date
  const dailyStats = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const seed = dayOfYear + today.getFullYear() * 366;
    // Simple seeded pseudo-random
    const rand = (offset: number) => {
      const x = Math.sin(seed + offset) * 10000;
      return x - Math.floor(x);
    };
    return {
      claimsMonth: Math.floor(900 + rand(1) * 600),         // 900–1,500
      activeCases: Math.floor(7000 + rand(2) * 2500),        // 7,000–9,500
      approvedToday: Math.floor(20 + rand(3) * 45),          // 20–65
      processingTime: (3.0 + rand(4) * 3.5).toFixed(1),     // 3.0–6.5
    };
  }, []);

  const claimsMonth = useAnimatedCounter(inView ? dailyStats.claimsMonth : 0, 2000);
  const activeCases = useAnimatedCounter(inView ? dailyStats.activeCases : 0, 2200);
  const approvedToday = useAnimatedCounter(inView ? dailyStats.approvedToday : 0, 1500);

  const stats = [
    { label: t('liveCounter.claimsMonth'), value: claimsMonth.toLocaleString(), icon: FileText },
    { label: t('liveCounter.activeCases'), value: activeCases.toLocaleString(), icon: Gavel },
    { label: t('liveCounter.approvedToday'), value: approvedToday.toLocaleString(), icon: CheckCircle2 },
    { label: t('liveCounter.processingTime'), value: `${dailyStats.processingTime} Days`, icon: Clock },
  ];

  return (
    <div ref={ref} className="bg-gray-900/50 border-y border-gray-800 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1 text-gold"><stat.icon className="w-4 h-4" /></div>
              <p className="text-2xl md:text-3xl font-bold text-gold">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: CLAIM SUBMISSION INTAKE FORM
   ═══════════════════════════════════════════════════════════════ */

function ClaimSubmissionSection() {
  const { ref, inView } = useInView(0.1);
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', state: '',
    caseType: '', dateOfExposure: '', description: '',
    hasMedicalRecords: false, hasProofOfExposure: false, hasPhysicianLetter: false, hasId: false,
  });

  const updateField = useCallback((field: string, value: string | boolean) => setForm((p) => ({ ...p, [field]: value })), []);

  const stepLabels = [t('claim.step0'), t('claim.step1'), t('claim.step2'), t('claim.step3')];
  const canProceed = useMemo(() => {
    if (step === 0) return form.firstName.trim() && form.lastName.trim() && form.email.trim() && form.phone.trim() && form.state;
    if (step === 1) return form.caseType && form.dateOfExposure && form.description.trim();
    return true;
  }, [step, form]);

  const handleSubmit = useCallback((_e: FormEvent) => setSubmitted(true), []);

  if (submitted) {
    return (
      <section id="file-claim" className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/20">
            <CheckCircle2 className="w-14 h-14 text-green-400" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-3xl md:text-4xl font-bold mb-4 text-navy dark:text-white">
            Claim Submitted <span className="gradient-text-gold">Successfully!</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-gray-500 dark:text-gray-400 text-lg mb-8">
            {t('claim.submittedDesc').replace('{email}', form.email)}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <Button onClick={() => { setSubmitted(false); setStep(0); setForm({ firstName: '', lastName: '', email: '', phone: '', state: '', caseType: '', dateOfExposure: '', description: '', hasMedicalRecords: false, hasProofOfExposure: false, hasPhysicianLetter: false, hasId: false }); }} variant="outline" className="border-gold/30 text-gold-dark dark:text-gold hover:bg-gold/10">
              {t('claim.fileAnother')}
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="file-claim" className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4" ref={ref}>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} className="text-center mb-12">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">{t('claim.badge')}</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-navy dark:text-white" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {t('claim.title')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{t('claim.description')}</p>
        </motion.div>

        {/* Step indicators */}
        <div className="flex items-center justify-center mb-10">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-gold text-gray-950' : 'bg-gray-700 text-gray-400'}`}>
                  {i < step ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                </div>
                <span className={`text-xs mt-2 hidden sm:block ${i === step ? 'text-gold font-medium' : 'text-gray-500'}`}>{label}</span>
              </div>
              {i < stepLabels.length - 1 && <div className={`w-12 sm:w-20 h-0.5 mx-1 transition-colors duration-300 ${i < step ? 'bg-green-500' : 'bg-gray-700'}`} />}
            </div>
          ))}
        </div>

        <Card className="border-gray-200 dark:border-gray-800 dark:bg-gray-900 shadow-2xl">
          <CardContent className="p-6 md:p-10">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="s0" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <h3 className="text-xl font-semibold text-navy dark:text-white mb-6">{t('claim.personalInfo')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label htmlFor="cf-fn" className="text-gray-600 dark:text-gray-300">{t('claim.firstName')}</Label><Input id="cf-fn" placeholder="John" value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" /></div>
                    <div className="space-y-2"><Label htmlFor="cf-ln" className="text-gray-600 dark:text-gray-300">{t('claim.lastName')}</Label><Input id="cf-ln" placeholder="Doe" value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" /></div>
                    <div className="space-y-2"><Label htmlFor="cf-em" className="text-gray-600 dark:text-gray-300">{t('claim.email')}</Label><Input id="cf-em" type="email" placeholder="john@example.com" value={form.email} onChange={(e) => updateField('email', e.target.value)} className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" /></div>
                    <div className="space-y-2"><Label htmlFor="cf-ph" className="text-gray-600 dark:text-gray-300">{t('claim.phoneNumber')}</Label><Input id="cf-ph" type="tel" placeholder="(555) 123-4567" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" /></div>
                  </div>
                  <div className="space-y-2"><Label className="text-gray-600 dark:text-gray-300">{t('claim.state')}</Label>
                    <Select value={form.state} onValueChange={(v) => updateField('state', v)}>
                      <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"><SelectValue placeholder="Select your state" /></SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700">{US_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <h3 className="text-xl font-semibold text-navy dark:text-white mb-6">{t('claim.caseDetails')}</h3>
                  <div className="space-y-2"><Label className="text-gray-600 dark:text-gray-300">{t('claim.caseType')}</Label>
                    <Select value={form.caseType} onValueChange={(v) => updateField('caseType', v)}>
                      <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"><SelectValue placeholder="Select case type" /></SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700 max-h-72 overflow-y-auto">{CLAIM_FORM_CASE_TYPES.map((ct) => <SelectItem key={ct} value={ct}>{ct}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label htmlFor="cf-doe" className="text-gray-600 dark:text-gray-300">{t('claim.dateOfExposure')}</Label><Input id="cf-doe" type="date" value={form.dateOfExposure} onChange={(e) => updateField('dateOfExposure', e.target.value)} className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" /></div>
                  <div className="space-y-2"><Label htmlFor="cf-desc" className="text-gray-600 dark:text-gray-300">{t('claim.caseDescription')}</Label><Textarea id="cf-desc" placeholder="Describe your situation, injuries, and how the product or exposure affected you..." value={form.description} onChange={(e) => updateField('description', e.target.value)} className="min-h-[140px] dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500 resize-y" /></div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <h3 className="text-xl font-semibold text-navy dark:text-white mb-6">{t('claim.documentation')}</h3>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-10 text-center hover:border-gold/50 transition-colors duration-300 cursor-pointer group">
                    <Upload className="w-10 h-10 mx-auto mb-4 text-gray-400 group-hover:text-gold transition-colors" />
                    <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">{t('claim.dragDrop')}</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">{t('claim.fileLimits')}</p>
                    <Button type="button" variant="outline" size="sm" className="mt-4 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:text-gold hover:border-gold/50">{t('claim.browseFiles')}</Button>
                  </div>
                  <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 font-medium">{t('claim.whichDocs')}</p>
                    {([
                      { key: 'hasMedicalRecords', label: t('claim.medRecords') },
                      { key: 'hasProofOfExposure', label: t('claim.proofExposure') },
                      { key: 'hasPhysicianLetter', label: t('claim.physicianLetter') },
                      { key: 'hasId', label: t('claim.govId') },
                    ] as const).map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <input type="checkbox" checked={form[key]} onChange={(e) => updateField(key, e.target.checked)} className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 accent-yellow-500" />
                        <span className="text-gray-600 dark:text-gray-300 group-hover:text-navy dark:group-hover:text-white transition-colors">{label}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <h3 className="text-xl font-semibold text-navy dark:text-white mb-6">{t('claim.reviewSubmit')}</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 space-y-3">
                      <h4 className="text-gold-dark dark:text-gold font-semibold text-sm uppercase tracking-wider">{t('claim.personalInfo')}</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm"><span className="text-gray-400">Name</span><span className="text-navy dark:text-gray-200">{form.firstName} {form.lastName}</span><span className="text-gray-400">Email</span><span className="text-navy dark:text-gray-200">{form.email}</span><span className="text-gray-400">Phone</span><span className="text-navy dark:text-gray-200">{form.phone}</span><span className="text-gray-400">State</span><span className="text-navy dark:text-gray-200">{form.state}</span></div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 space-y-3">
                      <h4 className="text-gold-dark dark:text-gold font-semibold text-sm uppercase tracking-wider">Case Details</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm"><span className="text-gray-400">Case Type</span><span className="text-navy dark:text-gray-200">{form.caseType}</span><span className="text-gray-400">Date of Exposure</span><span className="text-navy dark:text-gray-200">{form.dateOfExposure}</span></div>
                      <div className="mt-2"><span className="text-gray-400 text-sm">Description</span><p className="text-navy dark:text-gray-200 text-sm mt-1 bg-white dark:bg-gray-900/50 rounded-lg p-3">{form.description}</p></div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 space-y-3">
                      <h4 className="text-gold-dark dark:text-gold font-semibold text-sm uppercase tracking-wider">Documents</h4>
                      <div className="flex flex-wrap gap-2">
                        {([
                          [form.hasMedicalRecords, 'Medical Records'],
                          [form.hasProofOfExposure, 'Proof of Exposure'],
                          [form.hasPhysicianLetter, 'Physician Letter'],
                          [form.hasId, 'Photo ID'],
                        ] as [boolean, string][]).map(([has, label]) => (
                          <Badge key={label} variant={has ? 'default' : 'outline'} className={has ? 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30' : 'border-gray-300 dark:border-gray-600 text-gray-400'}>
                            {has && <CheckCircle2 className="w-3 h-3 mr-1" />}{label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 text-center">By submitting, you agree to our Terms of Service and Privacy Policy. Your information is protected by attorney-client privilege.</p>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex justify-between mt-10">
              {step > 0 ? <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)} className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:text-navy dark:hover:text-white">Back</Button> : <div />}
              {step < 3 ? <Button type="button" disabled={!canProceed} onClick={() => setStep((s) => s + 1)} className="bg-gold text-gray-950 hover:bg-gold-dark font-semibold disabled:opacity-40">Continue <ChevronRight className="w-4 h-4 ml-1" /></Button>
              : <Button type="button" onClick={handleSubmit} className="bg-green-500 text-white hover:bg-green-600 font-semibold"><Send className="w-4 h-4 mr-2" /> Submit Claim</Button>}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: SETTLEMENT TRACKER
   ═══════════════════════════════════════════════════════════════ */

function SettlementTrackerSection() {
  const { ref, inView } = useInView(0.1);
  const { t } = useLanguage();
  const statusColor = useCallback((status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Settling': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  }, []);

  return (
    <section id="settlement-tracker" className="py-20 bg-white dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4" ref={ref}>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} className="text-center mb-14">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">{t('settlement.badge')}</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-navy dark:text-white" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {t('settlement.title')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{t('settlement.description')}</p>
        </motion.div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {SETTLEMENT_DATA.map((item) => (
            <motion.div key={item.name} variants={fadeInUp}>
              <Card className="border-gray-200 dark:border-gray-800 dark:bg-gray-900 hover:border-gold/30 transition-all duration-300 h-full hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold"><item.icon className="w-5 h-5" /></div>
                      <h3 className="font-semibold text-navy dark:text-white text-sm">{item.name}</h3>
                    </div>
                    <Badge variant="outline" className={`text-[10px] ${statusColor(item.status)}`}>{item.status}</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">{t('settlement.totalClaims')}</span><span className="text-navy dark:text-gray-200 font-medium">{item.claims.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">{t('settlement.approved')}</span><span className="text-gold font-medium">{item.approved}%</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">{t('settlement.avgRecovery')}</span><span className="text-green-500 dark:text-green-400 font-medium">{item.avgRecovery}</span></div>
                  </div>
                  <Progress value={item.progress} className="h-2 bg-gray-200 dark:bg-gray-800 [&>div]:bg-gold" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 0.8 }} className="text-center text-xs text-gray-400 mt-10 max-w-xl mx-auto">
          {t('settlement.disclaimer')}
        </motion.p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: VIDEO TESTIMONIALS
   ═══════════════════════════════════════════════════════════════ */

function AudioWaveform({ color, isPlaying }: { color: string; isPlaying?: boolean }) {
  const bars = useMemo(() => Array.from({ length: 28 }, (_, i) => ({ h: 8 + Math.random() * 22, delay: i * 0.06 })), []);
  return (
    <div className="flex items-center justify-center gap-[2px] h-6">
      {bars.map((b, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full"
          style={{ backgroundColor: color, opacity: 0.6 }}
          animate={isPlaying ? { height: [b.h * 0.3, b.h, b.h * 0.5, b.h * 0.8, b.h * 0.3] } : { height: b.h * 0.4 }}
          transition={isPlaying ? { duration: 1.2, repeat: Infinity, delay: b.delay, ease: 'easeInOut' } : { duration: 0.3 }}
        />
      ))}
    </div>
  );
}

function VideoTestimonialsSection() {
  const { ref, inView } = useInView(0.1);
  const { t } = useLanguage();
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section id="video-testimonials" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl mx-auto px-4 relative" ref={ref}>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} className="text-center mb-14">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">{t('video.badge')}</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-navy dark:text-white" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {t('video.title')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{t('video.description')}</p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-2"><Play className="w-4 h-4 text-gold" /> 6 Stories</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-gold" /> 18 min total</span>
            <span className="flex items-center gap-2"><Eye className="w-4 h-4 text-gold" /> 63K+ views</span>
          </div>
        </motion.div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VIDEO_TESTIMONIALS.map((item, idx) => {
            const isPlaying = playingIdx === idx;
            const isHovered = hoveredIdx === idx;
            return (
              <motion.div key={item.name} variants={fadeInUp} onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)}>
                <Card className="border-gray-200 dark:border-gray-800 dark:bg-gray-900 overflow-hidden hover:shadow-xl dark:hover:shadow-gold/5 transition-all duration-500 group h-full flex flex-col">
                  {/* Video Thumbnail with Photo */}
                  <div className="relative h-56 overflow-hidden cursor-pointer" onClick={() => setPlayingIdx(isPlaying ? null : idx)}>
                    {/* Portrait Image */}
                    <div className="absolute inset-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    {/* Dark overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                    {/* Animated waveform at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <AudioWaveform color={item.accent} isPlaying={isPlaying} />
                    </div>
                    {/* Play button center */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isHovered || isPlaying ? 'opacity-100' : 'opacity-90'}`}>
                      <motion.div
                        className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md border-2 border-white/30 shadow-2xl"
                        style={{ backgroundColor: `${item.accent}cc` }}
                        animate={isPlaying ? { scale: [1, 1.1, 1] } : isHovered ? { scale: 1.15 } : { scale: 1 }}
                        transition={{ duration: isPlaying ? 1.5 : 0.2, repeat: isPlaying ? Infinity : 0 }}
                      >
                        {isPlaying ? (
                          <div className="flex items-center gap-[3px] ml-0.5">
                            <div className="w-[3px] h-4 bg-white rounded-full animate-pulse" />
                            <div className="w-[3px] h-6 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
                            <div className="w-[3px] h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                          </div>
                        ) : (
                          <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                        )}
                      </motion.div>
                    </div>
                    {/* Duration badge */}
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.duration}
                    </div>
                    {/* Case type badge */}
                    <div className="absolute top-3 left-3 text-white text-xs px-2.5 py-1 rounded-lg font-semibold backdrop-blur-sm" style={{ backgroundColor: `${item.accent}cc` }}>
                      {item.caseType}
                    </div>
                  </div>
                  {/* Content area */}
                  <CardContent className="p-5 flex-1 flex flex-col">
                    {/* Author info row */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gold/30 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-semibold text-navy dark:text-white text-sm truncate">{item.name}</h3>
                          <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{item.date}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                        <Eye className="w-3.5 h-3.5" /> {item.views}
                      </div>
                    </div>
                    {/* Quote */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-1 mb-4 line-clamp-3">&ldquo;{item.quote}&rdquo;</p>
                    {/* Watch story button */}
                    <button
                      onClick={() => setPlayingIdx(isPlaying ? null : idx)}
                      className="flex items-center gap-2 text-sm font-semibold transition-all duration-300 w-full justify-center py-2.5 rounded-lg"
                      style={{ color: item.accent, backgroundColor: isHovered ? `${item.accent}10` : 'transparent' }}
                    >
                      {isPlaying ? (
                        <><Pause className="w-4 h-4" /> Pause Story</>
                      ) : (
                        <>{t('video.watchStory')} <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
        {/* Bottom stats bar */}
        <motion.div variants={fadeInUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="mt-10">
          <Card className="border-gold/20 dark:border-gold/10 bg-gradient-to-r from-gold/5 to-amber-500/5 dark:from-gold/5 dark:to-amber-500/5">
            <CardContent className="py-5 px-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <Video className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy dark:text-white text-sm">Real Stories, Real Results</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Hear directly from claimants who found justice</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-center">
                  <div>
                    <p className="text-lg font-bold text-gold">6</p>
                    <p className="text-xs text-gray-500">Stories</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gold">63K+</p>
                    <p className="text-xs text-gray-500">Views</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gold">4.9</p>
                    <p className="text-xs text-gray-500">Rating</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: REVIEWS WIDGET
   ═══════════════════════════════════════════════════════════════ */

function ReviewsWidget() {
  const { ref, inView } = useInView(0.1);
  const { t } = useLanguage();
  const reviews = [
    { text: "ClaimGuard Pro made the entire process effortless. They handled everything from start to finish.", author: "Sarah M.", caseType: "Camp Lejeune claim" },
    { text: "Professional, responsive, and truly cares about clients. I felt supported every step of the way.", author: "Michael T.", caseType: "Roundup claim" },
    { text: "They caught an error that would have cost me my entire claim. I'm forever grateful.", author: "Jennifer K.", caseType: "Hernia Mesh claim" },
  ];

  return (
    <div ref={ref} className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-10">
            <p className="text-5xl font-bold gradient-text-gold mb-2">4.8</p>
            <p className="text-gray-400 text-sm mb-2">{t('reviews.outOf')}</p>
            <div className="flex items-center justify-center gap-1 mb-3">{[1,2,3,4,5].map((s) => <Star key={s} className="w-5 h-5 fill-gold text-gold" />)}</div>
            <p className="text-gray-400 dark:text-gray-500 text-sm">{t('reviews.basedOn')}</p>
          </motion.div>
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-4 mb-10 text-xs text-gray-400">
            <span className="text-gray-500">{t('reviews.asSeenOn')}</span>
            {["Trustpilot", "Google Reviews", "Better Business Bureau"].map((platform) => (
              <span key={platform} className="px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">{platform}</span>
            ))}
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {reviews.map((review, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="border-gray-200 dark:border-gray-800 dark:bg-gray-800/50 h-full hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-5">
                    <div className="flex gap-0.5 mb-3">{[1,2,3,4,5].map((s) => <Star key={s} className="w-3.5 h-3.5 fill-gold text-gold" />)}</div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-bold">{review.author.charAt(0)}</div>
                      <div><p className="text-navy dark:text-white text-sm font-medium">{review.author}</p><p className="text-gray-400 dark:text-gray-500 text-xs">{review.caseType}</p></div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: RESOURCES & INSIGHTS
   ═══════════════════════════════════════════════════════════════ */

function ResourcesSection() {
  const { ref, inView } = useInView(0.1);
  const { t } = useLanguage();
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);

  return (
    <section id="resources" className="py-14 md:py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-10">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">{t('resources.badge')}</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {t('resources.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('resources.description')}</p>
        </motion.div>

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} className="grid md:grid-cols-3 gap-6">
          {BLOG_ARTICLES.map((article, idx) => (
            <motion.div key={article.title} variants={fadeInUp}>
              <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-800/50 dark:border-gray-700 overflow-hidden hover-glow flex flex-col">
                <div className={`${article.color} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" aria-hidden="true" />
                  <div className="relative">
                    <article.icon className="w-8 h-8 mb-3 opacity-90" />
                    <Badge className="bg-white/20 text-white border-white/30 text-xs font-medium mb-2">{article.category}</Badge>
                    <time dateTime={article.dateISO} className="text-white/60 text-xs">{article.readTime}</time>
                  </div>
                </div>
                <CardContent className="pt-5 pb-6 flex flex-col flex-1">
                  <h3 className="font-bold text-navy dark:text-gray-100 text-base mb-3 leading-tight">{article.title}</h3>
                  <p className="text-muted-foreground dark:text-gray-400 text-sm leading-relaxed mb-4 flex-1">{article.excerpt}</p>
                  <AnimatePresence>
                    {expandedArticle === idx ? (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <div className="text-sm text-navy/70 dark:text-gray-400 leading-relaxed mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 whitespace-pre-line">{article.content}</div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                  <button
                    onClick={() => setExpandedArticle(expandedArticle === idx ? null : idx)}
                    aria-expanded={expandedArticle === idx}
                    className="text-gold-dark dark:text-gold-light text-sm font-semibold hover:text-gold flex items-center gap-1 transition-colors mt-auto"
                  >
                    {expandedArticle === idx ? t('services.showLess') : t('resources.readFull')}
                    {expandedArticle === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: ABOUT US
   ═══════════════════════════════════════════════════════════════ */

function AboutSection() {
  const { ref, inView } = useInView(0.1);
  const { t } = useLanguage();
  const VALUES = [
    { icon: Shield, title: t('about.v0'), desc: t('about.v0d') },
    { icon: Scale, title: t('about.v1'), desc: t('about.v1d') },
    { icon: Users, title: t('about.v2'), desc: t('about.v2d') },
    { icon: Award, title: t('about.v3'), desc: t('about.v3d') },
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
    <section id="about" className="py-14 md:py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-10">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">{t('about.badge')}</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {t('about.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            {t('about.description')}
          </p>
        </motion.div>

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={scaleIn} className="max-w-3xl mx-auto mb-8">
          <Card className="bg-navy dark:bg-gray-900 text-white border-0 shadow-xl overflow-hidden">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-10 h-10 text-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>{t('about.mission')}</h3>
              <p className="text-white/80 leading-relaxed text-lg italic">&ldquo;{t('about.missionQuote')}&rdquo;</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          <h3 className="text-2xl font-bold text-navy dark:text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>{t('about.meetTeam')}</h3>
          <p className="text-muted-foreground">{t('about.teamDesc')}</p>
        </motion.div>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {TEAM_MEMBERS.map((member, idx) => (
            <motion.div key={member.name} variants={fadeInUp}>
              <Card className="text-center border-0 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 bg-white dark:bg-gray-800/50 dark:border-gray-700 hover-glow h-full">
                <CardContent className="p-6">
                  <div className={`w-20 h-20 rounded-full ${member.color} flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold shadow-lg`}>{member.initials}</div>
                  <h4 className="font-bold text-navy dark:text-gray-100 text-base">{member.name}</h4>
                  <p className="text-gold-dark dark:text-gold-light text-xs font-semibold uppercase tracking-wider mb-2">{member.role}</p>
                  <p className="text-muted-foreground dark:text-gray-400 text-xs leading-relaxed">{t(`team.m${idx}`)}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="mt-12 mb-8">
          <h3 className="text-2xl font-bold text-navy dark:text-white mb-8 text-center" style={{ fontFamily: 'Georgia, serif' }}>{t('about.journey')}</h3>
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
            { icon: Shield, label: t('about.bbb') },
            { icon: Lock, label: t('about.ssl') },
            { icon: CheckCircle2, label: t('about.hipaa') },
            { icon: Award, label: t('about.topRated') },
            { icon: Users, label: t('about.subscribers') },
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
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', phone: '', claimId: '', message: '', contactMethod: 'email' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [prefs, setPrefs] = useState({ emailUpdates: true, smsAlerts: false, newsletter: false });
  const [lastSubmit, setLastSubmit] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t('contact.nameRequired');
    if (!emailRegex.test(form.email)) e.email = t('contact.emailRequired');
    if (!form.message.trim()) e.message = t('contact.messageRequired');
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
    // Form throttling: prevent rapid re-submissions
    if (Date.now() - lastSubmit < 3000) { toast.error(t('contact.throttle')); return; }
    setLoading(true);
    setLastSubmit(Date.now());
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('claimId', form.claimId);
      formData.append('message', form.message);
      formData.append('contactMethod', form.contactMethod);
      formData.append('emailUpdates', String(prefs.emailUpdates));
      formData.append('smsAlerts', String(prefs.smsAlerts));
      formData.append('newsletter', String(prefs.newsletter));
      uploadedFiles.forEach(f => formData.append('files', f.file));
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || t('contact.success'));
        announce(t('contact.announce'));
        setForm({ name: '', email: '', phone: '', claimId: '', message: '', contactMethod: 'email' });
        setUploadedFiles([]);
        setPrefs({ emailUpdates: true, smsAlerts: false, newsletter: false });
      } else {
        toast.error(data.error || t('newsletter.tryAgain'));
      }
    } catch {
      toast.error(t('newsletter.tryAgain'));
    } finally { setLoading(false); }
  }, [form, validate, uploadedFiles, prefs, lastSubmit]);

  const formatSize = useCallback((bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }, []);

  return (
    <section id="contact" className="py-14 md:py-20 bg-[#F4F1EB] dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-10">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">{t('contact.badge')}</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {t('contact.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('contact.description')}</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="lg:col-span-3">
            <Card className="border-0 shadow-lg bg-white dark:bg-gray-800/50 dark:border-gray-700">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-name" className="text-sm font-semibold text-navy dark:text-gray-200 mb-1 block">{t('contact.fullName')}</Label>
                      <Input id="contact-name" value={form.name} onChange={(e) => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: '' })); }} placeholder="John Doe" aria-describedby={errors.name ? 'contact-name-error' : undefined} aria-invalid={!!errors.name} className={errors.name ? 'border-red-400 dark:bg-gray-700 dark:border-red-500 dark:text-white' : 'dark:bg-gray-700 dark:border-gray-600 dark:text-white'} />
                      {errors.name && <p id="contact-name-error" className="text-xs text-red-500 mt-1" role="alert">{errors.name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="contact-email" className="text-sm font-semibold text-navy dark:text-gray-200 mb-1 block">{t('contact.email')}</Label>
                      <Input id="contact-email" type="email" value={form.email} onChange={(e) => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })); }} placeholder="john@example.com" aria-describedby={errors.email ? 'contact-email-error' : undefined} aria-invalid={!!errors.email} className={errors.email ? 'border-red-400 dark:bg-gray-700 dark:border-red-500 dark:text-white' : 'dark:bg-gray-700 dark:border-gray-600 dark:text-white'} />
                      {errors.email && <p id="contact-email-error" className="text-xs text-red-500 mt-1" role="alert">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-phone" className="text-sm font-semibold text-navy dark:text-gray-200 mb-1 block">{t('contact.phone')}</Label>
                      <Input id="contact-phone" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(555) 000-0000" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                      <Label htmlFor="contact-claimId" className="text-sm font-semibold text-navy dark:text-gray-200 mb-1 block">{t('contact.claimId')}</Label>
                      <Input id="contact-claimId" value={form.claimId} onChange={(e) => setForm(f => ({ ...f, claimId: e.target.value }))} placeholder="CLM-2024-XXX" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-navy dark:text-gray-200 mb-2 block">{t('contact.preferredMethod')}</Label>
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
                    <Label htmlFor="contact-message" className="text-sm font-semibold text-navy dark:text-gray-200 mb-1 block">{t('contact.message')}</Label>
                    <Textarea id="contact-message" value={form.message} onChange={(e) => { setForm(f => ({ ...f, message: e.target.value })); setErrors(er => ({ ...er, message: '' })); }} placeholder="Tell us about your situation..." rows={4} aria-describedby={errors.message ? 'contact-message-error' : undefined} aria-invalid={!!errors.message} className={errors.message ? 'border-red-400 dark:bg-gray-700 dark:border-red-500 dark:text-white' : 'dark:bg-gray-700 dark:border-gray-600 dark:text-white'} />
                    {errors.message && <p id="contact-message-error" className="text-xs text-red-500 mt-1" role="alert">{errors.message}</p>}
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-navy dark:text-gray-200 mb-2 block">{t('contact.attachDocs')}</Label>
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
                      <p className="text-sm text-muted-foreground dark:text-gray-400">{t('contact.uploadHint')}</p>
                      <p className="text-xs text-muted-foreground dark:text-gray-500 mt-1">{t('contact.uploadLimits')}</p>
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

                  {/* Notification Preferences */}
                  <div className="space-y-3 mt-2">
                    <p className="text-sm font-semibold text-navy dark:text-gray-200">{t('contact.notificationPrefs')}</p>
                    <div className="space-y-2">
                      {[
                        { id: 'emailUpdates', label: t('contact.emailPrefs'), key: 'emailUpdates' as const },
                        { id: 'smsAlerts', label: t('contact.smsPrefs'), key: 'smsAlerts' as const },
                        { id: 'newsletter', label: t('contact.newsletterPrefs'), key: 'newsletter' as const },
                      ].map((pref) => (
                        <label key={pref.id} className="flex items-center gap-2.5 cursor-pointer">
                          <input type="checkbox" checked={prefs[pref.key]} onChange={(e) => setPrefs(p => ({ ...p, [pref.key]: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-gold focus:ring-gold" />
                          <span className="text-sm text-muted-foreground">{pref.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full bg-gold hover:bg-gold-dark text-white font-semibold h-12 text-base">
                    {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />{t('contact.sending')}</> : <><Send className="w-5 h-5 mr-2" />{t('contact.sendMessage')}</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { delay: 0.2 } } }} className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-md overflow-hidden bg-white dark:bg-gray-800/50 dark:border-gray-700">
              <div className="rounded-t-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3105.0!2d-77.02!3d38.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDU0JzAwLjAiTiA3N8KwMDEnMTIuMCJX!5e0!3m2!1sen!2sus!4v1"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="ClaimGuard Pro Office Location"
                />
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0"><MapPin className="w-5 h-5 text-gold" /></div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('contact.officeAddress')}</p>
                    <p className="text-sm font-medium text-navy dark:text-gray-200">1429 Walnut St, 14th Floor</p>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">Philadelphia, PA 19102</p>
                  </div>
                </div>
                {[
                  { icon: Phone, label: t('contact.callUs'), value: '(484) 968-1529', href: 'tel:4849681529' },
                  { icon: Mail, label: 'Email', value: 'info@claimguardpro.com', href: 'mailto:info@claimguardpro.com' },
                  { icon: Clock, label: t('contact.officeHours'), value: 'Mon-Fri: 8AM-8PM EST\nSat: 9AM-5PM EST', href: '' },
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
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('contact.followUs')}</span>
                  <div className="flex gap-2">
                    {[
                              { icon: Facebook, href: 'https://facebook.com/claimguardpro', label: 'Facebook' },
                      { icon: Twitter, href: 'https://x.com/claimguardpro', label: 'X (Twitter)' },
                      { icon: Linkedin, href: 'https://linkedin.com/company/claimguardpro', label: 'LinkedIn' },
                    ].map(s => (
                      <a key={s.label} href={s.href} aria-label={s.label} className="w-9 h-9 rounded-lg bg-navy/5 dark:bg-gray-900 flex items-center justify-center hover:bg-gold/10 hover:text-gold transition-colors text-muted-foreground"><s.icon className="w-4 h-4" /></a>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-navy dark:bg-gray-900 text-white border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <HeadphonesIcon className="w-8 h-8 text-gold mx-auto mb-3" />
                <h4 className="font-bold text-lg mb-1">{t('contact.needHelp')}</h4>
                <p className="text-white/60 text-sm mb-4">{t('contact.specialistsStandingBy')}</p>
                <a href="tel:4849681529" className="block w-full bg-gold hover:bg-gold-dark text-white font-semibold py-3 rounded-lg transition-colors mb-3"><Phone className="w-4 h-4 inline mr-2" />(484) 968-1529</a>
                <a href="mailto:info@claimguardpro.com" className="block w-full bg-white/10 hover:bg-white/15 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"><Mail className="w-4 h-4 inline mr-2" />info@claimguardpro.com</a>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800/50 border-0 shadow-md dark:border-gray-700">
              <CardContent className="p-5">
                <h4 className="font-bold text-navy dark:text-gray-100 text-sm mb-3 flex items-center gap-2"><Star className="w-4 h-4 text-gold" />{t('contact.whyContact')}</h4>
                <ul className="space-y-3">
                  {[
                    { title: t('contact.whyItem0'), desc: t('contact.whyItem0d') },
                    { title: t('contact.whyItem1'), desc: t('contact.whyItem1d') },
                    { title: t('contact.whyItem2'), desc: t('contact.whyItem2d') },
                  ].map(item => (
                    <li key={item.title} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <div><p className="text-sm font-semibold text-navy dark:text-gray-100">{item.title}</p><p className="text-xs text-muted-foreground dark:text-gray-400">{item.desc}</p></div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800/50 border-0 shadow-md dark:border-gray-700">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0"><Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /></div>
                  <div>
                    <h4 className="font-bold text-navy dark:text-gray-100 text-sm mb-1">{t('contact.responseGuarantee')}</h4>
                    <ul className="space-y-1.5 text-xs text-muted-foreground dark:text-gray-400">
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" />{t('contact.responseEmail')}</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" />{t('contact.responsePhone')}</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" />{t('contact.responseChat')}</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" />{t('contact.responseClaims')}</li>
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
  const { t } = useLanguage();
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
                { icon: Shield, title: t('footer.secure'), desc: t('footer.secureDesc') },
                { icon: CheckCircle2, title: t('footer.free'), desc: t('footer.freeDesc') },
                { icon: Award, title: t('footer.bbb'), desc: t('footer.bbbDesc') },
                { icon: Users, title: t('footer.team'), desc: t('footer.teamDesc') },
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
              <p className="text-white/50 text-sm leading-relaxed">{t('footer.tagline')}</p>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-gold">{t('footer.quickLinks')}</h4>
              <div className="space-y-2">
                {[
                  { label: t('footer.trackMyClaim'), href: '#track-claim' },
                  { label: t('footer.eligibilityQuiz'), href: '#eligibility-quiz' },
                  { label: t('footer.ourServices'), href: '#services' },
                  { label: t('footer.claimsWeHandle'), href: '#what-we-handle' },
                  { label: t('footer.resources'), href: '#resources' },
                  { label: t('footer.faq'), href: '#faq' },
                  { label: t('footer.caseStudies'), href: '#case-studies' },
                  { label: t('footer.contactUs'), href: '#contact' },
                  { label: t('footer.newsletter'), href: '#newsletter' },
                ].map(link => (
                  <button key={link.href + link.label} onClick={() => scrollTo(link.href)} className="block text-sm text-white/50 hover:text-gold transition-colors text-left">{link.label}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-gold">{t('footer.practiceAreas')}</h4>
              <div className="space-y-2">
                {['Camp Lejeune', 'Roundup', 'Talc / Baby Powder', 'Hernia Mesh', 'Paraquat', 'Firefighting Foam'].map(area => (
                  <p key={area} className="text-sm text-white/50">{area}</p>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-gold">{t('footer.contact')}</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" /><span className="text-sm text-white/50">1429 Walnut St, 14th Floor<br />Philadelphia, PA 19102</span></div>
                <a href="tel:4849681529" className="flex items-center gap-2 text-sm text-white/50 hover:text-gold transition-colors"><Phone className="w-4 h-4 text-gold" />(484) 968-1529</a>
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
              {t('footer.copyright').replace('{year}', String(new Date().getFullYear()))}
            </p>
            <div className="flex gap-4 text-xs text-white/30">
              <button onClick={() => setPrivacyOpen(true)} className="hover:text-gold transition-colors">{t('footer.privacyPolicy')}</button>
              <button onClick={() => setTermsOpen(true)} className="hover:text-gold transition-colors">{t('footer.termsOfService')}</button>
              <button onClick={() => setDisclaimerOpen(true)} className="hover:text-gold transition-colors">{t('footer.disclaimer')}</button>
            </div>
          </div>
          <p className="text-center text-xs text-white/20 mt-6 max-w-4xl mx-auto leading-relaxed">
            {t('footer.attorneyAd')}
          </p>
        </div>
      </footer>

      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] bg-white dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader><DialogTitle className="text-navy dark:text-white">{t('footer.privacyTitle')}</DialogTitle><DialogDescription className="text-muted-foreground dark:text-gray-400">{t('footer.lastUpdated')}</DialogDescription></DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="text-sm text-muted-foreground dark:text-gray-300 leading-relaxed whitespace-pre-line">{PRIVACY_POLICY_TEXT}</div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] bg-white dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader><DialogTitle className="text-navy dark:text-white">{t('footer.termsTitle')}</DialogTitle><DialogDescription className="text-muted-foreground dark:text-gray-400">{t('footer.lastUpdated')}</DialogDescription></DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="text-sm text-muted-foreground dark:text-gray-300 leading-relaxed whitespace-pre-line">{TERMS_OF_SERVICE_TEXT}</div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={disclaimerOpen} onOpenChange={setDisclaimerOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] bg-white dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader><DialogTitle className="text-navy dark:text-white">{t('footer.disclaimerTitle')}</DialogTitle></DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="text-sm text-muted-foreground dark:text-gray-300 leading-relaxed whitespace-pre-line">{DISCLAIMER_TEXT}</div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: FLOATING LIVE CHAT WIDGET
   ═══════════════════════════════════════════════════════════════ */

interface ChatMessage { id: number; text: string; sender: 'bot' | 'user'; }

function LiveChatWidget() {
  const { t, locale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, text: t('chat.greeting'), sender: 'bot' },
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
        const botMsg: ChatMessage = { id: Date.now() + 1, text: data.reply || t('chat.fallback'), sender: 'bot' };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
      }, minDelay);
    } catch {
      const elapsed = Date.now() - typingStart;
      const minDelay = Math.max(0, 1500 - elapsed);
      setTimeout(() => {
        const fallbackMsg: ChatMessage = { id: Date.now() + 1, text: t('chat.error'), sender: 'bot' };
        setMessages(prev => [...prev, fallbackMsg]);
        setIsTyping(false);
      }, minDelay);
    }
  }, [messages, t]);

  const quickReplies = useMemo(() => [t('chat.quickReply0'), t('chat.quickReply1'), t('chat.quickReply2'), t('chat.quickReply3')], [locale, t]);
  const maxChars = 500;

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
              aria-label={t('chat.openLabel')}
            >
              {msgCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-chat-pulse">{msgCount}</span>
              )}
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="left"><p>{t('chat.title')}</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 w-[calc(100vw-2rem)] h-[70vh] max-w-[400px] max-h-[550px] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col"
            role="dialog"
            aria-label="Live chat window"
          >
            <div className="bg-navy dark:bg-gray-900 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center"><HeadphonesIcon className="w-5 h-5 text-gold" /></div>
                <div>
                  <p className="text-white font-semibold text-sm">{t('chat.title')}</p>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
                    <span className="text-white/60 text-xs">{t('chat.online')}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors p-1" aria-label={t('chat.close')}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 chat-scrollbar bg-gray-50 dark:bg-gray-900" aria-live="polite">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} chat-message-enter`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${msg.sender === 'user' ? 'bg-navy dark:bg-gold text-white dark:text-navy rounded-br-md' : 'bg-white dark:bg-gray-800 text-navy dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700 rounded-bl-md'}`}>
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
              <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center mb-2">{t('chat.typing')}</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    ref={chatInputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value.slice(0, maxChars))}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                    placeholder={t('chat.placeholder')}
                    className="pr-10 h-10 text-sm border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    maxLength={maxChars}
                  />
                  <span className="absolute right-2 bottom-2 text-[10px] text-gray-400">{input.length}/{maxChars}</span>
                </div>
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
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let ticking = false;
    const handler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          setVisible(scrollY > 400);
          setProgress(docHeight > 0 ? Math.min((scrollY / docHeight) * 100, 100) : 0);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollToTop = useCallback(() => window.scrollTo({ top: 0, behavior: 'smooth' }), []);
  const circumference = 2 * Math.PI * 18;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-gold hover:bg-gold-dark text-white shadow-lg flex items-center justify-center transition-colors"
          aria-label={t('backToTop')}
        >
          <svg className="absolute inset-0 w-12 h-12 -rotate-90" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            <circle cx="20" cy="20" r="18" fill="none" stroke="white" strokeWidth="2" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-150" />
          </svg>
          <ArrowUp className="w-5 h-5 relative z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  );
});

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: COOKIE CONSENT BANNER
   ═══════════════════════════════════════════════════════════════ */

function CookieConsentBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [preferences, setPreferences] = useState({ analytics: true, marketing: false, functional: true });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('claimguard-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSavePrefs = useCallback(() => {
    localStorage.setItem('claimguard-cookie-prefs', JSON.stringify(preferences));
    localStorage.setItem('claimguard-cookie-consent', 'accepted');
    setSaved(true);
    setTimeout(() => setVisible(false), 800);
  }, [preferences]);

  const handleAcceptAll = useCallback(() => {
    setPreferences({ analytics: true, marketing: true, functional: true });
    localStorage.setItem('claimguard-cookie-prefs', JSON.stringify({ analytics: true, marketing: true, functional: true }));
    localStorage.setItem('claimguard-cookie-consent', 'accepted');
    setVisible(false);
  }, []);

  const handleDecline = useCallback(() => {
    localStorage.setItem('claimguard-cookie-consent', 'declined');
    setVisible(false);
  }, []);

  if (saved) {
    return (
      <AnimatePresence>
        {visible && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed bottom-0 left-0 right-0 z-[60]">
            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pb-4">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl shadow-2xl border border-emerald-200 dark:border-emerald-800 p-4 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <p className="text-sm text-emerald-800 dark:text-emerald-200 font-medium">{t('cookie.saved')}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[60]"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0"><Cookie className="w-5 h-5 text-gold" /></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-navy dark:text-white mb-1">{t('cookie.title')}</p>
                  <p className="text-xs text-muted-foreground dark:text-gray-400 leading-relaxed">
                    {t('cookie.description')}{' '}
                    <button onClick={() => setPrivacyOpen(true)} className="text-gold underline hover:text-gold-dark">{t('cookie.privacyPolicy')}</button>
                  </p>
                </div>
              </div>

              {prefsOpen && (
                <div className="space-y-3 mb-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                  {[
                    { key: 'analytics' as const, label: t('cookie.analytics'), desc: t('cookie.analyticsDesc') },
                    { key: 'marketing' as const, label: t('cookie.marketing'), desc: t('cookie.marketingDesc') },
                    { key: 'functional' as const, label: t('cookie.functional'), desc: t('cookie.functionalDesc') },
                  ].map(pref => (
                    <label key={pref.key} className="flex items-center justify-between cursor-pointer group">
                      <div>
                        <p className="text-sm font-medium text-navy dark:text-gray-200">{pref.label}</p>
                        <p className="text-xs text-muted-foreground dark:text-gray-500">{pref.desc}</p>
                      </div>
                      <div
                        onClick={() => setPreferences(p => ({ ...p, [pref.key]: !p[pref.key] }))}
                        className={`w-11 h-6 rounded-full transition-colors relative ${preferences[pref.key] ? 'bg-gold' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${preferences[pref.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleDecline} variant="outline" size="sm" className="text-xs h-9 border-gray-300 dark:border-gray-600 dark:text-gray-300 flex-1">{t('cookie.decline')}</Button>
                {!prefsOpen && <Button onClick={() => setPrefsOpen(true)} variant="outline" size="sm" className="text-xs h-9 border-gray-300 dark:border-gray-600 dark:text-gray-300 flex-1">{t('cookie.customize')}</Button>}
                {prefsOpen && <Button onClick={handleSavePrefs} size="sm" className="text-xs h-9 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold flex-1">{t('cookie.savePrefs')}</Button>}
                <Button onClick={handleAcceptAll} size="sm" className="text-xs h-9 bg-gold hover:bg-gold-dark text-white font-semibold flex-1">{t('cookie.acceptAll')}</Button>
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
   COMPONENT: SPLASH SCREEN
   ═══════════════════════════════════════════════════════════════ */

function SplashScreen() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('claimguard-splash-seen');
    if (!seen) {
      const showTimer = setTimeout(() => setVisible(true), 0);
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
        sessionStorage.setItem('claimguard-splash-seen', 'true');
      }, 2000);
      const hideTimer = setTimeout(() => setVisible(false), 2500);
      return () => { clearTimeout(showTimer); clearTimeout(fadeTimer); clearTimeout(hideTimer); };
    }
  }, []);

  if (!visible) return null;

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`} aria-hidden="true">
      <div className="splash-icon">
        <div className="w-16 h-16 rounded-2xl bg-gold flex items-center justify-center mb-4">
          <Shield className="w-9 h-9 text-white" />
        </div>
      </div>
      <h2 className="text-white text-xl font-bold" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
        Claim<span className="text-gold">Guard</span> Pro
      </h2>
      <p className="text-white/50 text-sm mt-2">{t('splash.loading')}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: SOCIAL PROOF NOTIFICATION
   ═══════════════════════════════════════════════════════════════ */

function SocialProofNotification() {
  const { t } = useLanguage();
  const [pool] = useState(() => generateSocialProofPool());
  const [current, setCurrent] = useState(() => Math.floor(Math.random() * Math.min(pool.length, 200)));
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Show first popup after 10s, then cycle every 12-20s with a new random notification
  useEffect(() => {
    if (dismissed) return;
    const showTimer = setTimeout(() => {
      setVisible(true);
      const interval = setInterval(() => {
        // Pick a random index far from current to avoid repeats
        const next = Math.floor(Math.random() * pool.length);
        setCurrent(next);
        setVisible(true);
      }, 12000 + Math.random() * 8000);
      return () => clearInterval(interval);
    }, 10000);
    return () => clearTimeout(showTimer);
  }, [dismissed, pool.length]);

  useEffect(() => {
    if (!visible || dismissed) return;
    const hideTimer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(hideTimer);
  }, [visible, current, dismissed]);

  const data = pool[current % pool.length];

  if (dismissed || !data) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -80, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -80, y: 20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="social-proof-notification"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 p-4 relative">
            <button
              onClick={() => setDismissed(true)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="pr-6">
                <p className="text-sm text-navy dark:text-gray-100">
                  <span className="font-semibold">{data.name}</span> {t('sp.from')} {data.location}
                </p>
                <p className="text-xs text-muted-foreground dark:text-gray-400 mt-0.5">{data.action}</p>
                <Badge className="mt-1.5 text-[10px] px-1.5 py-0 bg-gold/10 text-gold-dark dark:text-gold-light border-gold/20 font-medium">{data.caseType}</Badge>
                <p className="text-[10px] text-muted-foreground/60 dark:text-gray-500 mt-1">{data.time}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: EXIT INTENT POPUP
   ═══════════════════════════════════════════════════════════════ */

function ExitIntentPopup() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem('claimguard-exit-shown');
    if (shown) return;

    const handler = (e: MouseEvent) => {
      if (e.clientY < 10) {
        setVisible(true);
        sessionStorage.setItem('claimguard-exit-shown', 'true');
        document.removeEventListener('mouseout', handler);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mouseout', handler);
    }, 15000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseout', handler);
    };
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!email) return;
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, claimType: 'exit-intent', updates: true, deadlines: true, tips: true }),
      });
      setSubmitted(true);
      setTimeout(() => setVisible(false), 2000);
    } catch {
      // silent
    }
  }, [email]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="exit-intent-popup"
          onClick={() => setVisible(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#1B2A4A] p-6 text-center relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C5A55A] via-[#D4B97A] to-[#C5A55A]" />
              <div className="w-14 h-14 rounded-full bg-[#C5A55A]/20 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-7 h-7 text-[#C5A55A]" />
              </div>
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                {t('exit.title')}
              </h3>
              <p className="text-white/70 text-sm mt-1">{t('exit.subtitle')}</p>
            </div>
            <div className="p-6">
              {submitted ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="font-semibold text-navy dark:text-gray-100">{t('exit.youreIn')}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t('exit.youreInDesc')}</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground dark:text-gray-400 mb-4">
                    {t('exit.description')}
                  </p>
                  <div className="space-y-3">
                    <Input
                      type="email"
                      placeholder={t('exit.placeholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <Button
                      onClick={handleSubmit}
                      className="w-full bg-[#C5A55A] hover:bg-[#A88A3F] text-white font-semibold"
                    >
                      {t('exit.submit')}
                    </Button>
                  </div>
                  <button
                    onClick={() => setVisible(false)}
                    className="block mx-auto mt-4 text-xs text-muted-foreground hover:text-navy dark:hover:text-gray-300 transition-colors underline"
                  >
                    {t('exit.decline')}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION: REFERRAL / AMBASSADOR CTA
   ═══════════════════════════════════════════════════════════════ */

function ReferralSection() {
  const { t } = useLanguage();
  const { ref, inView } = useInView(0.1);
  const [form, setForm] = useState({
    referrerName: '', referrerEmail: '', friendName: '', friendEmail: '', claimType: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!form.referrerName || !form.referrerEmail || !form.friendName || !form.friendEmail) {
      toast.error(t('referral.fillRequired'));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setForm({ referrerName: '', referrerEmail: '', friendName: '', friendEmail: '', claimType: '' });
      } else {
        toast.error(data.error || 'Please try again.');
      }
    } catch {
      toast.error('Failed to submit referral.');
    } finally {
      setLoading(false);
    }
  }, [form]);

  return (
    <section className="py-14 md:py-20 bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUp} className="text-center mb-10">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider dark:text-gold-light">{t('referral.badge')}</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {t('referral.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('referral.description')}</p>
        </motion.div>

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { delay: 0.15 } } }}>
          <Card className="border-0 shadow-lg bg-[#F4F1EB] dark:bg-gray-800/50 dark:border-gray-700">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ref-name" className="text-sm font-semibold text-navy dark:text-gray-200 mb-1 block">{t('referral.yourName')}</Label>
                    <Input id="ref-name" value={form.referrerName} onChange={(e) => setForm(f => ({ ...f, referrerName: e.target.value }))} placeholder="Jane Smith" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  <div>
                    <Label htmlFor="ref-email" className="text-sm font-semibold text-navy dark:text-gray-200 mb-1 block">{t('referral.yourEmail')}</Label>
                    <Input id="ref-email" type="email" value={form.referrerEmail} onChange={(e) => setForm(f => ({ ...f, referrerEmail: e.target.value }))} placeholder="jane@example.com" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="friend-name" className="text-sm font-semibold text-navy dark:text-gray-200 mb-1 block">{t('referral.friendName')}</Label>
                    <Input id="friend-name" value={form.friendName} onChange={(e) => setForm(f => ({ ...f, friendName: e.target.value }))} placeholder="John Doe" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  <div>
                    <Label htmlFor="friend-email" className="text-sm font-semibold text-navy dark:text-gray-200 mb-1 block">{t('referral.friendEmail')}</Label>
                    <Input id="friend-email" type="email" value={form.friendEmail} onChange={(e) => setForm(f => ({ ...f, friendEmail: e.target.value }))} placeholder="john@example.com" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="ref-claim-type" className="text-sm font-semibold text-navy dark:text-gray-200 mb-1 block">{t('referral.friendClaimType')}</Label>
                  <Select value={form.claimType} onValueChange={(v) => setForm(f => ({ ...f, claimType: v }))}>
                    <SelectTrigger id="ref-claim-type" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder={t('referral.selectClaimType')} />
                    </SelectTrigger>
                    <SelectContent>
                      {['Camp Lejeune', 'Roundup', 'Talc / Baby Powder', 'Hernia Mesh', 'Paraquat', 'Firefighting Foam', 'Other'].map(ct => (
                        <SelectItem key={ct} value={ct}>{ct}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white font-semibold h-12 text-base">
                  {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />{t('referral.sending')}</> : <><Send className="w-5 h-5 mr-2" />{t('referral.sendReferral')}</>}
                </Button>
              </form>

              <div className="flex flex-wrap justify-center gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                {[
                  { icon: Lock, label: t('referral.confidential') },
                  { icon: CheckCircle2, label: t('referral.noObligation') },
                  { icon: DollarSign, label: t('referral.freeForBoth') },
                ].map(badge => (
                  <div key={badge.label} className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400">
                    <badge.icon className="w-4 h-4 text-gold" />
                    <span>{badge.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT: MOBILE BOTTOM NAV (with active state)
   ═══════════════════════════════════════════════════════════════ */

const MOBILE_NAV_ITEMS = [
  { icon: Home, labelKey: 'mobile.home', href: '#hero' },
  { icon: Search, labelKey: 'mobile.track', href: '#track-claim' },
  { icon: Target, labelKey: 'mobile.quiz', href: '#eligibility-quiz' },
  { icon: DollarSign, labelKey: 'mobile.calc', href: '#settlement-calculator' },
  { icon: Phone, labelKey: 'mobile.contact', href: '#contact' },
];

function MobileNavItems() {
  const { t } = useLanguage();
  const activeSection = useScrollSpy();
  return (
    <div className="flex items-center justify-around">
      {MOBILE_NAV_ITEMS.map((item) => {
        const label = t(item.labelKey);
        const isActive = activeSection === item.href;
        return (
          <button
            key={item.labelKey}
            onClick={() => document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' })}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 transition-colors ${isActive ? 'text-gold' : 'text-gray-500 hover:text-gray-300'}`}
            aria-label={label}
            aria-current={isActive ? 'true' : undefined}
          >
            <div className="relative">
              <item.icon className="w-5 h-5" />
              {isActive && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold" />}
            </div>
            <span className={`text-[10px] font-medium ${isActive ? 'text-gold' : ''}`}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   REASON SUGGESTIONS — Smart Autocomplete from 13,000+ Reasons
   ═══════════════════════════════════════════════════════════════ */

const ReasonSuggestions = memo(function ReasonSuggestions({ query, onSelect }: { query: string; onSelect: (reason: string) => void }) {
  const [showAll, setShowAll] = useState(false);
  const { suggestions, totalCount } = useMemo(() => {
    if (!query || query.length < 2) return { suggestions: [], totalCount: 0 };
    const q = query.toLowerCase();
    const words = q.split(/\s+/).filter(Boolean);

    // Score each reason by how many query words match
    const scored = REFILE_REASONS.map(reason => {
      const lower = reason.toLowerCase();
      let score = 0;
      for (const w of words) {
        if (lower.includes(w)) score++;
      }
      return { reason, score };
    }).filter(r => r.score > 0).sort((a, b) => b.score - a.score);

    return {
      suggestions: showAll ? scored.slice(0, 50) : scored.slice(0, 8),
      totalCount: scored.length,
    };
  }, [query, showAll]);

  if (suggestions.length === 0) return null;

  return (
    <div className="mt-2 border border-gray-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-800/80 border-b border-gray-700">
        <span className="text-xs text-gray-400">
          {showAll ? 'Showing top 50' : `Top ${suggestions.length}`}
          {totalCount > 8 && !showAll && <span className="text-emerald-400 ml-1"> of {totalCount.toLocaleString()} matches</span>}
        </span>
        {totalCount > 8 && (
          <button onClick={() => setShowAll(!showAll)} className="text-xs text-[#C5A059] hover:text-[#C5A059]/80">
            {showAll ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
      <div className="max-h-[240px] overflow-y-auto">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s.reason)}
            className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-gray-800 hover:text-white transition-colors border-b border-gray-800 last:border-b-0 flex items-start gap-2"
          >
            <ClipboardCheck className="w-3 h-3 mt-0.5 text-[#C5A059] shrink-0" />
            <span>{highlightMatch(s.reason, query)}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const parts: React.ReactNode[] = [];
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter(Boolean);
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    let firstMatch = remaining.length;
    let matchedWord = '';

    for (const w of words) {
      const idx = remaining.toLowerCase().indexOf(w);
      if (idx !== -1 && idx < firstMatch) {
        firstMatch = idx;
        matchedWord = w;
      }
    }

    if (firstMatch === remaining.length) {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }

    if (firstMatch > 0) {
      parts.push(<span key={key++}>{remaining.slice(0, firstMatch)}</span>);
    }
    parts.push(
      <span key={key++} className="text-emerald-400 font-medium">
        {remaining.slice(firstMatch, firstMatch + matchedWord.length)}
      </span>
    );
    remaining = remaining.slice(firstMatch + matchedWord.length);
  }

  return <>{parts}</>;
}

/* ═══════════════════════════════════════════════════════════════
   ADMIN PANEL — CSV Upload & Claimant Management
   ═══════════════════════════════════════════════════════════════ */

const ADMIN_AUTH_TOKEN = 'claimguard-admin-2025';

const STATUS_COLORS: Record<string, string> = {
  'Submitted': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  'Validated': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'Under Review': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  'Decision': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  'Completed': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'File Submitted': 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  'File Rejected': 'bg-red-500/15 text-red-400 border-red-500/30',
  'File In Process': 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  'Waiting for Documents': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Missed Attorneys Call': 'bg-rose-500/15 text-rose-400 border-rose-500/30',
};

const STATUS_DOT_COLORS: Record<string, string> = {
  'Submitted': 'bg-yellow-400',
  'Validated': 'bg-blue-400',
  'Under Review': 'bg-purple-400',
  'Decision': 'bg-orange-400',
  'Completed': 'bg-emerald-400',
  'File Submitted': 'bg-sky-400',
  'File Rejected': 'bg-red-400',
  'File In Process': 'bg-indigo-400',
  'Waiting for Documents': 'bg-amber-400',
  'Missed Attorneys Call': 'bg-rose-400',
};

const VALID_STATUSES = ['Submitted', 'Validated', 'Under Review', 'Decision', 'Completed', 'File Submitted', 'File Rejected', 'File In Process', 'Waiting for Documents', 'Missed Attorneys Call'];

interface ClaimantRecord {
  id: string;
  trackingId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  claimType: string | null;
  status: string;
  state: string | null;
  filedDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AdminStats {
  total: number;
  statusCounts: Record<string, number>;
  claimTypeCounts: Record<string, number>;
}

function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'claimants' | 'add' | 'upload'>('dashboard');
  const [authKey, setAuthKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Claimants state
  const [claimants, setClaimants] = useState<ClaimantRecord[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingClaimants, setLoadingClaimants] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // CSV Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    imported: number;
    updated: number;
    errors: string[];
    totalErrors: number;
  } | null>(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<ClaimantRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Manual Add state
  const [manualForm, setManualForm] = useState({
    trackingId: '', firstName: '', lastName: '', email: '',
    phone: '', claimType: '', status: 'Submitted', state: '', filedDate: '', notes: '',
  });
  const [addingClaimant, setAddingClaimant] = useState(false);

  // Hash detection + keyboard shortcut
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setIsOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        window.location.hash = '';
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleAuth = useCallback(() => {
    if (authKey === ADMIN_AUTH_TOKEN) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid admin key');
    }
  }, [authKey]);

  const fetchClaimants = useCallback(async (page = 1) => {
    setLoadingClaimants(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '25');
      if (searchQuery) params.set('search', searchQuery);
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`/api/admin/claimants?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${ADMIN_AUTH_TOKEN}` },
      });
      const data = await res.json();
      setClaimants(data.claimants || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || 0);
      setCurrentPage(data.page || 1);
    } catch {
      toast.error('Failed to load claimants');
    } finally {
      setLoadingClaimants(false);
    }
  }, [searchQuery, statusFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/export?format=stats', {
        headers: { 'Authorization': `Bearer ${ADMIN_AUTH_TOKEN}` },
      });
      const data = await res.json();
      setStats(data);
    } catch {
      // Silent fail for stats
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      fetchClaimants(1);
      fetchStats();
    }
  }, [isAuthenticated, isOpen, fetchClaimants, fetchStats]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchClaimants(1);
    }
  }, [searchQuery, statusFilter, isAuthenticated, fetchClaimants]);

  const handleUpload = useCallback(async () => {
    if (!uploadFile) return;
    setUploading(true);
    setUploadResult(null);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      const res = await fetch('/api/admin/upload-csv', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${ADMIN_AUTH_TOKEN}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error('Upload failed', { description: data.error });
        setUploadResult({ success: false, imported: 0, updated: 0, errors: [data.error], totalErrors: 1 });
      } else {
        setUploadResult(data);
        toast.success('CSV processed', { description: `Imported: ${data.imported}, Updated: ${data.updated}` });
        setUploadFile(null);
        fetchClaimants(1);
        fetchStats();
      }
    } catch {
      toast.error('Upload error', { description: 'Network error' });
    } finally {
      setUploading(false);
    }
  }, [uploadFile, fetchClaimants, fetchStats]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/claimants/${deleteTarget.trackingId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${ADMIN_AUTH_TOKEN}` },
      });
      if (res.ok) {
        toast.success('Claimant deleted', { description: `${deleteTarget.trackingId} has been removed` });
        fetchClaimants(currentPage);
        fetchStats();
      } else {
        toast.error('Delete failed');
      }
    } catch {
      toast.error('Delete error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, currentPage, fetchClaimants, fetchStats]);

  const handleDownloadExport = useCallback(() => {
    window.open('/api/admin/export?format=csv', '_blank');
  }, []);

  const handleDownloadSample = useCallback(() => {
    window.open('/api/admin/export?format=sample', '_blank');
  }, []);

  const handleManualAdd = useCallback(async () => {
    if (!manualForm.trackingId || !manualForm.firstName || !manualForm.lastName || !manualForm.email) {
      toast.error('Missing required fields', { description: 'Tracking ID, First Name, Last Name, and Email are required.' });
      return;
    }
    setAddingClaimant(true);
    try {
      const res = await fetch('/api/admin/claimants', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ADMIN_AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(manualForm),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error('Failed to add claimant', { description: data.error });
      } else {
        toast.success('Claimant added!', { description: `${manualForm.firstName} ${manualForm.lastName} (${manualForm.trackingId})` });
        setManualForm({ trackingId: '', firstName: '', lastName: '', email: '', phone: '', claimType: '', status: 'Submitted', state: '', filedDate: '', notes: '' });
        fetchClaimants(1);
        fetchStats();
        setActiveTab('claimants');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setAddingClaimant(false);
    }
  }, [manualForm, fetchClaimants, fetchStats]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      setUploadFile(file);
      setUploadResult(null);
    } else {
      toast.error('Please drop a .csv file');
    }
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    window.location.hash = '';
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-6xl h-[90vh] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-[#C5A059]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Admin Panel</h2>
                <p className="text-xs text-gray-500">Claimant Database Management</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] text-gray-500 border-gray-700 hidden sm:flex">
                Ctrl+Shift+A to toggle
              </Badge>
              <Button variant="ghost" size="icon" onClick={handleClose} className="text-gray-400 hover:text-white hover:bg-gray-800">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {!isAuthenticated ? (
            /* Auth Screen */
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="w-full max-w-sm space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-[#C5A059]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Admin Access Required</h3>
                  <p className="text-sm text-gray-400 mt-2">Enter your admin key to continue</p>
                </div>
                <div className="space-y-3">
                  <Input
                    type="password"
                    placeholder="Enter admin key..."
                    value={authKey}
                    onChange={(e) => { setAuthKey(e.target.value); setAuthError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                  {authError && <p className="text-xs text-red-400">{authError}</p>}
                  <Button onClick={handleAuth} className="w-full bg-[#C5A059] hover:bg-[#b08d4e] text-white font-semibold">
                    Authenticate
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Tab Navigation */}
              <div className="flex items-center gap-1 px-4 sm:px-6 border-b border-gray-800 shrink-0">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'dashboard' ? 'text-[#C5A059] border-[#C5A059]' : 'text-gray-400 border-transparent hover:text-gray-200'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
                <button
                  onClick={() => setActiveTab('claimants')}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'claimants' ? 'text-[#C5A059] border-[#C5A059]' : 'text-gray-400 border-transparent hover:text-gray-200'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span className="hidden sm:inline">Claimants</span>
                </button>
                <button
                  onClick={() => setActiveTab('add')}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'add' ? 'text-emerald-400 border-emerald-400' : 'text-gray-400 border-transparent hover:text-gray-200'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Claimant</span>
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'upload' ? 'text-[#C5A059] border-[#C5A059]' : 'text-gray-400 border-transparent hover:text-gray-200'
                  }`}
                >
                  <FileUp className="w-4 h-4" />
                  <span className="hidden sm:inline">Upload CSV</span>
                </button>

                {/* Quick Actions - right aligned */}
                <div className="ml-auto flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={handleDownloadSample} className="text-gray-400 hover:text-[#C5A059] hover:bg-gray-800 text-xs gap-1.5 h-8">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sample CSV</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleDownloadExport} className="text-gray-400 hover:text-[#C5A059] hover:bg-gray-800 text-xs gap-1.5 h-8">
                    <DownloadCloud className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Export All</span>
                  </Button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto">
                <ScrollArea className="h-full">
                  <div className="p-4 sm:p-6">
                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && stats && (
                      <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                          <Card className="bg-gray-800/50 border-gray-700 p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#C5A059]/20 flex items-center justify-center">
                                <UsersRound className="w-5 h-5 text-[#C5A059]" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-white">{stats.total}</p>
                                <p className="text-xs text-gray-400">Total Claimants</p>
                              </div>
                            </div>
                          </Card>

                          {VALID_STATUSES.map(status => (
                            <Card key={status} className="bg-gray-800/50 border-gray-700 p-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${STATUS_COLORS[status]?.split(' ')[0] || 'bg-gray-500/15'}`}>
                                  <CircleDot className={`w-5 h-5 ${STATUS_DOT_COLORS[status] || 'text-gray-400'}`} />
                                </div>
                                <div>
                                  <p className="text-2xl font-bold text-white">{stats.statusCounts[status] || 0}</p>
                                  <p className="text-xs text-gray-400">{status}</p>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>

                        {/* Status Distribution Bar */}
                        <Card className="bg-gray-800/50 border-gray-700 p-4">
                          <h3 className="text-sm font-semibold text-white mb-3">Status Distribution</h3>
                          <div className="w-full h-6 rounded-full bg-gray-700 overflow-hidden flex">
                            {VALID_STATUSES.map(status => {
                              const count = stats.statusCounts[status] || 0;
                              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                              if (pct === 0) return null;
                              return (
                                <div
                                  key={status}
                                  className={`h-full transition-all duration-500 ${STATUS_DOT_COLORS[status]?.replace('bg-', 'bg-') || 'bg-gray-500'}`}
                                  style={{ width: `${pct}%` }}
                                  title={`${status}: ${count} (${pct.toFixed(1)}%)`}
                                />
                              );
                            })}
                          </div>
                          <div className="flex flex-wrap gap-3 mt-3">
                            {VALID_STATUSES.map(status => {
                              const count = stats.statusCounts[status] || 0;
                              const pct = stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : '0';
                              return (
                                <div key={status} className="flex items-center gap-1.5 text-xs text-gray-400">
                                  <div className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT_COLORS[status]}`} />
                                  <span>{status}: {count} ({pct}%)</span>
                                </div>
                              );
                            })}
                          </div>
                        </Card>

                        {/* Claim Type Breakdown */}
                        {Object.keys(stats.claimTypeCounts).length > 0 && (
                          <Card className="bg-gray-800/50 border-gray-700 p-4">
                            <h3 className="text-sm font-semibold text-white mb-3">Top Claim Types</h3>
                            <div className="space-y-3">
                              {Object.entries(stats.claimTypeCounts).map(([type, count]) => {
                                const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                                return (
                                  <div key={type} className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-300">{type}</span>
                                      <span className="text-xs text-gray-500">{count} claimants</span>
                                    </div>
                                    <div className="w-full h-2 rounded-full bg-gray-700 overflow-hidden">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${pct}%` }}
                                        transition={{ duration: 0.8, ease: 'easeOut' }}
                                        className="h-full bg-[#C5A059] rounded-full"
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </Card>
                        )}
                      </div>
                    )}

                    {activeTab === 'dashboard' && !stats && (
                      <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-[#C5A059]" />
                      </div>
                    )}

                    {/* Claimants Tab */}
                    {activeTab === 'claimants' && (
                      <div className="space-y-4">
                        {/* Search & Filter Bar */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                              placeholder="Search by name, email, or tracking ID..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                            />
                          </div>
                          <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-44 bg-gray-800 border-gray-700 text-white">
                              <Filter className="w-4 h-4 text-gray-500 mr-2" />
                              <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="all">All Statuses</SelectItem>
                              {VALID_STATUSES.map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Results Count */}
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">{totalCount} claimant{totalCount !== 1 ? 's' : ''} found</p>
                          <Button variant="ghost" size="sm" onClick={() => fetchClaimants(currentPage)} className="text-gray-400 hover:text-white text-xs gap-1 h-7">
                            <RefreshCw className="w-3 h-3" /> Refresh
                          </Button>
                        </div>

                        {/* Table */}
                        <div className="border border-gray-700 rounded-xl overflow-hidden">
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow className="border-gray-700 hover:bg-gray-800/50">
                                  <TableHead className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Tracking ID</TableHead>
                                  <TableHead className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Name</TableHead>
                                  <TableHead className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Claim Type</TableHead>
                                  <TableHead className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</TableHead>
                                  <TableHead className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Filed Date</TableHead>
                                  <TableHead className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">State</TableHead>
                                  <TableHead className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {loadingClaimants ? (
                                  Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i} className="border-gray-700/50">
                                      {Array.from({ length: 7 }).map((_, j) => (
                                        <TableCell key={j} className="py-3">
                                          <Skeleton className="h-4 w-20 bg-gray-800" />
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  ))
                                ) : claimants.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={7} className="py-12 text-center">
                                      <Database className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                                      <p className="text-gray-500 text-sm">No claimants found</p>
                                      <p className="text-gray-600 text-xs mt-1">Try a different search or upload a CSV file</p>
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  claimants.map((c) => (
                                    <TableRow key={c.id} className="border-gray-700/50 hover:bg-gray-800/30">
                                      <TableCell className="py-3">
                                        <code className="text-xs font-mono text-[#C5A059] bg-[#C5A059]/10 px-1.5 py-0.5 rounded">
                                          {c.trackingId || '—'}
                                        </code>
                                      </TableCell>
                                      <TableCell className="py-3">
                                        <div>
                                          <p className="text-sm font-medium text-white">{c.firstName} {c.lastName}</p>
                                          <p className="text-xs text-gray-500 truncate max-w-[160px]">{c.email}</p>
                                        </div>
                                      </TableCell>
                                      <TableCell className="py-3 hidden md:table-cell">
                                        <span className="text-sm text-gray-300">{c.claimType || '—'}</span>
                                      </TableCell>
                                      <TableCell className="py-3">
                                        <Badge variant="outline" className={`text-[10px] font-semibold border ${STATUS_COLORS[c.status] || STATUS_COLORS['Submitted']}`}>
                                          {c.status}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="py-3 hidden lg:table-cell">
                                        <span className="text-xs text-gray-400">{c.filedDate || '—'}</span>
                                      </TableCell>
                                      <TableCell className="py-3 hidden lg:table-cell">
                                        <span className="text-xs text-gray-400">{c.state || '—'}</span>
                                      </TableCell>
                                      <TableCell className="py-3 text-right">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => setDeleteTarget(c)}
                                          className="text-gray-500 hover:text-red-400 hover:bg-red-400/10 h-8 w-8"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">Page {currentPage} of {totalPages}</p>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => fetchClaimants(Math.max(1, currentPage - 1))}
                                disabled={currentPage <= 1}
                                className="text-gray-400 hover:text-white h-8"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => fetchClaimants(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage >= totalPages}
                                className="text-gray-400 hover:text-white h-8"
                              >
                                <ChevronRightIcon className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Add Claimant Tab */}
                    {activeTab === 'add' && (
                      <div className="max-w-3xl mx-auto space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                            <UserPlus className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">Add New Claimant</h3>
                            <p className="text-xs text-gray-400">Manually add a claimant with detailed case information</p>
                          </div>
                        </div>

                        {/* Section 1: Basic Info */}
                        <Card className="bg-gray-800/50 border-gray-700 p-6">
                          <h4 className="text-sm font-semibold text-[#C5A059] mb-4 flex items-center gap-2"><Users className="w-4 h-4" /> Claimant Information</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <Label className="text-sm text-gray-300 mb-1 block">Tracking ID <span className="text-red-400">*</span></Label>
                              <Input
                                placeholder="CLM-2024-001"
                                value={manualForm.trackingId}
                                onChange={(e) => setManualForm(f => ({ ...f, trackingId: e.target.value.toUpperCase() }))}
                                className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500"
                              />
                            </div>
                            <div>
                              <Label className="text-sm text-gray-300 mb-1 block">First Name <span className="text-red-400">*</span></Label>
                              <Input
                                placeholder="John"
                                value={manualForm.firstName}
                                onChange={(e) => setManualForm(f => ({ ...f, firstName: e.target.value }))}
                                className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500"
                              />
                            </div>
                            <div>
                              <Label className="text-sm text-gray-300 mb-1 block">Last Name <span className="text-red-400">*</span></Label>
                              <Input
                                placeholder="Doe"
                                value={manualForm.lastName}
                                onChange={(e) => setManualForm(f => ({ ...f, lastName: e.target.value }))}
                                className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500"
                              />
                            </div>
                            <div>
                              <Label className="text-sm text-gray-300 mb-1 block">Email <span className="text-red-400">*</span></Label>
                              <Input
                                type="email"
                                placeholder="john@example.com"
                                value={manualForm.email}
                                onChange={(e) => setManualForm(f => ({ ...f, email: e.target.value }))}
                                className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500"
                              />
                            </div>
                            <div>
                              <Label className="text-sm text-gray-300 mb-1 block">Phone</Label>
                              <Input
                                placeholder="555-123-4567"
                                value={manualForm.phone}
                                onChange={(e) => setManualForm(f => ({ ...f, phone: e.target.value }))}
                                className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500"
                              />
                            </div>
                            <div>
                              <Label className="text-sm text-gray-300 mb-1 block">State</Label>
                              <Input
                                placeholder="PA"
                                maxLength={2}
                                value={manualForm.state}
                                onChange={(e) => setManualForm(f => ({ ...f, state: e.target.value.toUpperCase() }))}
                                className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500"
                              />
                            </div>
                          </div>
                        </Card>

                        {/* Section 2: Case Details */}
                        <Card className="bg-gray-800/50 border-gray-700 p-6">
                          <h4 className="text-sm font-semibold text-[#C5A059] mb-4 flex items-center gap-2"><FileText className="w-4 h-4" /> Case Details</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <Label className="text-sm text-gray-300 mb-1 block">Claim Type</Label>
                              <Select
                                value={manualForm.claimType || undefined}
                                onValueChange={(v) => setManualForm(f => ({ ...f, claimType: v }))}
                              >
                                <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                                  <SelectValue placeholder="Select case type..." />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 max-h-[300px]">
                                  {CASE_TYPES.map(ct => (
                                    <SelectItem key={ct} value={ct} className="text-gray-200">{ct}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-sm text-gray-300 mb-1 block">Status</Label>
                              <Select
                                value={manualForm.status}
                                onValueChange={(v) => setManualForm(f => ({ ...f, status: v }))}
                              >
                                <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 max-h-[300px]">
                                  {VALID_STATUSES.map(s => (
                                    <SelectItem key={s} value={s} className="text-gray-200">
                                      <span className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${STATUS_DOT_COLORS[s] || 'bg-gray-400'}`} />
                                        {s}
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-sm text-gray-300 mb-1 block">Filed Date</Label>
                              <Input
                                type="date"
                                value={manualForm.filedDate}
                                onChange={(e) => setManualForm(f => ({ ...f, filedDate: e.target.value }))}
                                className="bg-gray-900 border-gray-600 text-white"
                              />
                            </div>
                          </div>
                        </Card>

                        {/* Section 3: Case Reason / Notes with Smart Search */}
                        <Card className="bg-gray-800/50 border-gray-700 p-6">
                          <h4 className="text-sm font-semibold text-[#C5A059] mb-1 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> Case Reason & Notes
                          </h4>
                          <p className="text-xs text-gray-500 mb-4">
                            Search from <span className="text-emerald-400 font-semibold">{REFILE_REASONS_COUNT.toLocaleString()}+ pre-built reasons</span> or type your own. Start typing to see suggestions.
                          </p>
                          <div className="relative">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
                            <Textarea
                              placeholder="Type to search reasons... e.g. 'Camp Lejeune missing', 'Roundup denied', 'hernia mesh revision'..."
                              value={manualForm.notes}
                              onChange={(e) => setManualForm(f => ({ ...f, notes: e.target.value }))}
                              className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500 min-h-[120px] pl-9"
                            />
                          </div>
                          {/* Smart Suggestions */}
                          {manualForm.notes.length > 1 && (
                            <ReasonSuggestions
                              query={manualForm.notes}
                              onSelect={(reason: string) => setManualForm(f => ({ ...f, notes: reason }))}
                            />
                          )}
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <Button
                            onClick={handleManualAdd}
                            disabled={addingClaimant}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex-1 sm:flex-none"
                          >
                            {addingClaimant ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adding...</> : <><Plus className="w-4 h-4 mr-2" />Add Claimant</>}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setManualForm({ trackingId: '', firstName: '', lastName: '', email: '', phone: '', claimType: '', status: 'Submitted', state: '', filedDate: '', notes: '' })}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            Clear Form
                          </Button>
                        </div>

                        {/* Quick Tips */}
                        <Card className="bg-blue-500/5 border-blue-500/20 p-4">
                          <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Quick Tips
                          </h4>
                          <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                            <li>Tracking ID must be unique — use formats like CLM-2024-001</li>
                            <li>Fields marked with <span className="text-red-400">*</span> are required</li>
                            <li>Use the Case Reason search to pick from {REFILE_REASONS_COUNT.toLocaleString()}+ pre-built refile reasons</li>
                            <li>Status includes 10 stages: from File Submitted through Missed Attorneys Call</li>
                            <li>For bulk additions, use the &quot;Upload CSV&quot; tab instead</li>
                          </ul>
                        </Card>
                      </div>
                    )}

                    {/* Upload Tab */}
                    {activeTab === 'upload' && (
                      <div className="max-w-2xl mx-auto space-y-6">
                        {/* Drag and Drop Zone */}
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
                            isDragging
                              ? 'border-[#C5A059] bg-[#C5A059]/5 scale-[1.02]'
                              : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/30'
                          }`}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) { setUploadFile(file); setUploadResult(null); }
                            }}
                            className="hidden"
                          />
                          <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors ${
                            isDragging ? 'bg-[#C5A059]/20' : 'bg-gray-800'
                          }`}>
                            <FileUp className={`w-8 h-8 ${isDragging ? 'text-[#C5A059]' : 'text-gray-500'}`} />
                          </div>
                          {uploadFile ? (
                            <div>
                              <p className="text-sm font-medium text-white">{uploadFile.name}</p>
                              <p className="text-xs text-gray-500 mt-1">{(uploadFile.size / 1024).toFixed(1)} KB</p>
                              <button
                                onClick={(e) => { e.stopPropagation(); setUploadFile(null); setUploadResult(null); }}
                                className="mt-2 text-xs text-red-400 hover:text-red-300 underline"
                              >
                                Remove file
                              </button>
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm font-medium text-white">Drop your CSV file here or click to browse</p>
                              <p className="text-xs text-gray-500 mt-1">Only .csv files are accepted</p>
                            </div>
                          )}
                        </div>

                        {/* Upload Button */}
                        {uploadFile && (
                          <Button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="w-full bg-[#C5A059] hover:bg-[#b08d4e] text-white font-semibold h-12"
                          >
                            {uploading ? (
                              <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Processing CSV...</>
                            ) : (
                              <><FileUp className="w-5 h-5 mr-2" />Upload & Import Claimants</>
                            )}
                          </Button>
                        )}

                        {/* Upload Result */}
                        {uploadResult && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`rounded-xl border p-4 ${
                              uploadResult.success
                                ? 'bg-emerald-900/20 border-emerald-800'
                                : 'bg-red-900/20 border-red-800'
                            }`}
                          >
                            {uploadResult.success ? (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                  <p className="text-sm font-semibold text-emerald-300">Import Complete</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-3">
                                  <div className="bg-emerald-900/30 rounded-lg p-3">
                                    <p className="text-xl font-bold text-emerald-300">{uploadResult.imported}</p>
                                    <p className="text-xs text-emerald-400">New Import{uploadResult.imported !== 1 ? 's' : ''}</p>
                                  </div>
                                  <div className="bg-blue-900/30 rounded-lg p-3">
                                    <p className="text-xl font-bold text-blue-300">{uploadResult.updated}</p>
                                    <p className="text-xs text-blue-400">Update{uploadResult.updated !== 1 ? 's' : ''}</p>
                                  </div>
                                </div>
                                {uploadResult.errors.length > 0 && (
                                  <div className="mt-3">
                                    <p className="text-xs font-semibold text-amber-400 mb-1">
                                      {uploadResult.totalErrors} warning{uploadResult.totalErrors !== 1 ? 's' : ''}
                                    </p>
                                    <div className="max-h-32 overflow-y-auto space-y-1">
                                      {uploadResult.errors.map((err, i) => (
                                        <p key={i} className="text-xs text-amber-300/80">{err}</p>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-start gap-2">
                                <XCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                                <div>
                                  <p className="text-sm font-semibold text-red-300">Upload Failed</p>
                                  {uploadResult.errors.map((err, i) => (
                                    <p key={i} className="text-xs text-red-400 mt-1">{err}</p>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}

                        {/* CSV Format Instructions */}
                        <Card className="bg-gray-800/50 border-gray-700 p-4">
                          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#C5A059]" />
                            How to Format Your CSV
                          </h3>
                          <div className="space-y-2 text-xs text-gray-400">
                            <p>Your CSV file must have these column headers in the first row:</p>
                            <div className="bg-gray-900 rounded-lg p-3 font-mono text-[11px] overflow-x-auto">
                              tracking_id, first_name, last_name, email, phone, claim_type, status, state, filed_date, notes
                            </div>
                            <div className="mt-3 space-y-1.5">
                              <p className="text-gray-300 font-medium">Required columns:</p>
                              <ul className="list-disc list-inside space-y-0.5 ml-1">
                                <li><code className="text-[#C5A059] bg-[#C5A059]/10 px-1 rounded">first_name</code> — Claimant first name</li>
                                <li><code className="text-[#C5A059] bg-[#C5A059]/10 px-1 rounded">last_name</code> — Claimant last name</li>
                              </ul>
                              <p className="text-gray-300 font-medium mt-2">Optional columns:</p>
                              <ul className="list-disc list-inside space-y-0.5 ml-1">
                                <li><code className="text-[#C5A059] bg-[#C5A059]/10 px-1 rounded">tracking_id</code> — Auto-generated if empty (format: CLM-YYYY-NNN)</li>
                                <li><code className="text-[#C5A059] bg-[#C5A059]/10 px-1 rounded">email</code> — Email address</li>
                                <li><code className="text-[#C5A059] bg-[#C5A059]/10 px-1 rounded">phone</code> — Phone number</li>
                                <li><code className="text-[#C5A059] bg-[#C5A059]/10 px-1 rounded">claim_type</code> — Type of claim (e.g., Camp Lejeune, Roundup)</li>
                                <li><code className="text-[#C5A059] bg-[#C5A059]/10 px-1 rounded">status</code> — Submitted, Validated, Under Review, Decision, or Completed</li>
                                <li><code className="text-[#C5A059] bg-[#C5A059]/10 px-1 rounded">state</code> — US state abbreviation</li>
                                <li><code className="text-[#C5A059] bg-[#C5A059]/10 px-1 rounded">filed_date</code> — Date in ISO format (YYYY-MM-DD)</li>
                                <li><code className="text-[#C5A059] bg-[#C5A059]/10 px-1 rounded">notes</code> — Additional notes</li>
                              </ul>
                            </div>
                            <div className="mt-3 p-3 bg-amber-900/20 border border-amber-800/50 rounded-lg">
                              <p className="text-amber-300 font-medium">💡 Tips:</p>
                              <ul className="list-disc list-inside mt-1 space-y-0.5 text-amber-200/70">
                                <li>If a tracking ID already exists, the record will be updated instead of creating a duplicate</li>
                                <li>Empty tracking IDs will be auto-generated sequentially</li>
                                <li>Invalid status values default to &quot;Submitted&quot;</li>
                              </ul>
                            </div>
                          </div>
                        </Card>

                        {/* Sample Download */}
                        <div className="text-center">
                          <Button variant="outline" onClick={handleDownloadSample} className="border-gray-700 text-gray-300 hover:text-[#C5A059] hover:border-[#C5A059] text-xs gap-2">
                            <FileSpreadsheet className="w-4 h-4" />
                            Download Sample CSV Template
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-gray-900 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Claimant</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete <span className="text-white font-semibold">{deleteTarget?.firstName} {deleteTarget?.lastName}</span> ({deleteTarget?.trackingId})? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Deleting...</> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function HomePage() {
  // BUG 3 FIX: Drive scroll progress bar
  useEffect(() => {
    const bar = document.getElementById('scroll-progress-bar');
    if (!bar) return;
    let ticking = false;
    const handler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
          bar.style.width = `${progress}%`;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <a href="#hero" className="skip-to-content">
        Skip to main content
      </a>
      <SplashScreen />
      <LanguageToggleBanner />
      <main id="main-content" className="min-h-screen flex flex-col">
        <div className="scroll-progress-bar" id="scroll-progress-bar" role="status" aria-label="Page scroll progress" />
        <div aria-live="polite" className="sr-only" id="sr-announcer" />
        <CountdownBanner />
        <Navbar />
        <HeroSection />
        <TrustedBySection />
        <LiveNewsTicker />
        <LiveClaimCounter />
        <HowItWorksSection />
        <ServicesSection />
        <WhyDifferentSection />
        <SettlementTrackerSection />
        <SettlementCalculatorSection />
        <EligibilityQuizSection />
        <WhyChooseUsSection />
        <TestimonialsSection />
        <VideoTestimonialsSection />
        <ClaimSubmissionSection />
        <TrackClaimSection />
        <ResourcesSection />
        <WhatWeHandleSection />
        <CTASection />
        <FilingDeadlineTracker />
        <FAQSection />
        <CaseStudiesSection />
        <ReviewsWidget />
        <NewsletterSection />
        <ReferralSection />
        <ClientPortalSection />
        <AboutSection />
        <ContactSection />
        <Footer />
      </main>
      <LiveChatWidget />
      <BackToTopButton />
      <AdminPanel />
      <CookieConsentBanner />
      <SocialProofNotification />
      <ExitIntentPopup />

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-gray-900/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-800 px-2 py-1.5 safe-area-inset-bottom" aria-label="Mobile navigation">
        <MobileNavItems />
      </nav>
    </>
  );
}
