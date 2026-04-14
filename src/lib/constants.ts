'use client';

import { createContext, useContext } from 'react';
import {
  Shield,
  Search,
  Users,
  Eye,
  FileSignature,
  ClipboardCheck,
  UserCheck,
  HeadphonesIcon,
  Gavel,
  DollarSign,
  CalendarDays,
  Lock,
  Award,
  Building2,
  FileText,
  BadgeCheck,
  Target,
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
  Home,
  Phone,
  Star,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Zap,
  MapPin,
  type LucideIcon,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   COMPANY SETTINGS CONTEXT
   ═══════════════════════════════════════════════════════════════ */

const DEFAULT_COMPANY_SETTINGS = {
  companyName: 'ClaimGuard Pro',
  phone: '(484) 968-1529',
  phoneHref: 'tel:4849681529',
  email: 'info@claimguardpro.com',
  emailHref: 'mailto:info@claimguardpro.com',
  address: '1429 Walnut St, 14th Floor, Philadelphia, PA 19102',
  privacyEmail: 'privacy@claimguardpro.com',
  legalEmail: 'legal@claimguardpro.com',
};

type CompanySettings = typeof DEFAULT_COMPANY_SETTINGS;

const CompanySettingsContext = createContext<CompanySettings>(DEFAULT_COMPANY_SETTINGS);

function useCompanySettings() {
  return useContext(CompanySettingsContext);
}

/* ═══════════════════════════════════════════════════════════════
   NAVIGATION & HERO DATA
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

const PARTICLE_POSITIONS = Array.from({ length: 20 }, (_, i) => ({
  left: `${((i * 37 + 13) % 97)}%`,
  top: `${((i * 53 + 7) % 95)}%`,
  delay: `${(i * 0.7) % 8}s`,
  duration: `${6 + (i % 7)}s`,
}));

/* ═══════════════════════════════════════════════════════════════
   CASE & SERVICE DATA
   ═══════════════════════════════════════════════════════════════ */

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

const STATS_TOOLTIP_DATA: Record<string, string> = {
  'Claims Assisted': 'Over 1,250 claimants have trusted us to guide them through the mass tort claims process since 2009.',
  'Success Rate': '98% of our clients who complete the full process receive a favorable outcome on their claims.',
  'Recovered': 'Our clients have recovered a combined total of over $47 million in settlements and compensation.',
  'Years Experience': 'Our team brings 15+ years of specialized experience in mass tort litigation and claims management.',
  'Dedicated Support': 'Our specialists are available 24 hours a day, 7 days a week via phone, email, and live chat.',
  'Secure & Confidential': 'Bank-level 256-bit encryption with HIPAA-compliant systems. Regular third-party security audits.',
};

/* ═══════════════════════════════════════════════════════════════
   TESTIMONIALS & FAQ DATA
   ═══════════════════════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════════════════════
   CASE STUDIES & SUCCESS STORIES
   ═══════════════════════════════════════════════════════════════ */

const CASE_STUDIES = [
  { name: 'Margaret H.', caseType: 'Camp Lejeune Water Contamination', badge: 'bg-blue-500', challenge: 'Margaret was stationed at Camp Lejeune for 3 years and developed a rare form of kidney disease. Her initial claim was denied due to incomplete medical records linking her condition to the contaminated water supply.', solution: 'Our team worked with Margaret to obtain comprehensive medical opinions, gathered additional service records, and built a detailed timeline of her exposure. We identified key military health records that had been overlooked.', outcome: "After a 6-month appeals process, Margaret's claim was approved with a significant settlement. She received her payment within 90 days of approval. Specific results vary per case.", compensation: 'Significant Settlement', beforeStatus: 'Denied', afterStatus: 'Approved' },
  { name: 'Thomas J.', caseType: 'Roundup (Glyphosate) Exposure', badge: 'bg-emerald-500', challenge: 'Thomas, a farmer for 25 years, developed non-Hodgkin lymphoma after decades of Roundup use. His claim was stuck in "Correction Needed" for 8 months due to missing purchase records.', solution: 'We helped Thomas compile decades of agricultural supply invoices, secured supporting medical opinions from two oncologists, and corrected multiple form errors in his original submission.', outcome: "Thomas's corrected claim was approved, and he received a substantial recovery. Specific results vary per case.", compensation: 'Substantial Recovery', beforeStatus: 'Correction Needed', afterStatus: 'Approved' },
  { name: 'Dorothy K.', caseType: 'Talcum Powder / Ovarian Cancer', badge: 'bg-purple-500', challenge: 'Dorothy used talcum powder products for over 40 years before being diagnosed with ovarian cancer. Her claim was pending for 14 months with no updates.', solution: "Our team escalated Dorothy's case with the claims administrator, identified the processing bottleneck (a missing pathology report), and facilitated expedited review of her complete medical file.", outcome: "Dorothy's claim was moved to active review within 2 weeks and was approved 3 months later with a favorable outcome. Specific results vary per case.", compensation: 'Favorable Outcome', beforeStatus: 'Pending (14 months)', afterStatus: 'Approved' },
];

const SUCCESS_STORIES = [
  {
    name: 'Angela Torres',
    location: 'Jacksonville, NC',
    caseType: 'Camp Lejeune',
    initials: 'AT',
    image: '/images/success-story-1.jpg',
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
    image: '/images/success-story-2.jpg',
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
    image: '/images/success-story-3.jpg',
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
    image: '/images/success-story-4.jpg',
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
    image: '/images/success-story-5.jpg',
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
    image: '/images/success-story-6.jpg',
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

/* ═══════════════════════════════════════════════════════════════
   TEAM & PIPELINE DATA
   ═══════════════════════════════════════════════════════════════ */

const TEAM_MEMBERS = [
  { name: 'Sarah Mitchell', role: 'Founder & Lead Attorney', color: 'bg-blue-500', initials: 'SM', photo: '/team/sarah.jpg', bio: 'Former government attorney with 20+ years of mass tort litigation experience.' },
  { name: 'David Chen', role: 'Senior Claims Analyst', color: 'bg-emerald-500', initials: 'DC', photo: '/team/david.jpg', bio: 'Expert in claims processing and document analysis. Extensive experience reviewing mass tort claims.' },
  { name: 'Jessica Rodriguez', role: 'Client Relations Director', color: 'bg-purple-500', initials: 'JR', photo: '/team/jessica.jpg', bio: 'Passionate advocate for claimants\' rights. Manages our 24/7 support team.' },
  { name: 'Michael Thompson', role: 'Document Specialist', color: 'bg-amber-500', initials: 'MT', photo: '/team/michael.jpg', bio: 'Detail-oriented paralegal specializing in document correction. High success rate in claim corrections.' },
  { name: 'Emily Watson', role: 'Legal Strategy Advisor', color: 'bg-rose-500', initials: 'EW', photo: '/team/emily.jpg', bio: 'Skilled attorney specializing in settlement negotiation. Helped clients recover substantial compensation.' },
  { name: 'Marcus Johnson', role: 'Technology Director', color: 'bg-teal-500', initials: 'MJ', photo: '/team/marcus.jpg', bio: 'Built our proprietary claim tracking system. Ensures reliable platform performance.' },
];

const PIPELINE_STAGES = ['Submitted', 'Validated', 'Under Review', 'Decision', 'Completed'];

const DOC_CHECKLIST = [
  { name: 'Proof of Residence', icon: Building2 },
  { name: 'Medical Records', icon: FileText },
  { name: 'Claim Form', icon: ClipboardCheck },
  { name: 'Authorization Letter', icon: FileSignature },
  { name: 'ID Verification', icon: BadgeCheck },
];

/* ═══════════════════════════════════════════════════════════════
   CASE TYPE DETAILS
   ═══════════════════════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════════════════════
   COMPARISON & TRUST DATA
   ═══════════════════════════════════════════════════════════════ */

const COMPARISON_DATA = [
  { feature: 'Real-Time Claim Tracking', us: { label: 'Instant tracking with pipeline visualization', has: true }, others: { label: 'Manual status checks via phone', has: false } },
  { feature: 'Document Correction Support', us: { label: 'Expert review + correction + re-filing', has: true }, others: { label: 'Self-service or no support', has: false } },
  { feature: 'Eligibility Assessment', us: { label: 'Free interactive quiz + expert review', has: true }, others: { label: 'Basic checklist only', has: false } },
  { feature: 'Dedicated Specialist', us: { label: 'Assigned claim specialist for your case', has: true }, others: { label: 'General support line', has: false } },
  { feature: 'Settlement Maximization', us: { label: 'Data-driven analysis to maximize recovery', has: true }, others: { label: 'Accept first offer as-is', has: false } },
  { feature: '24/7 Availability', us: { label: 'Round-the-clock support and chat', has: true }, others: { label: 'Business hours only', has: false } },
  { feature: 'Data Security', us: { label: '256-bit encryption, HIPAA compliant', has: true }, others: { label: 'Standard security', has: false } },
];

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

const MEDIA_LOGOS = ['Forbes', 'CNN', 'Bloomberg Law', 'Reuters', 'USA Today', 'The Wall Street Journal', 'NBC News', 'Legal Times'];

/* ═══════════════════════════════════════════════════════════════
   SETTLEMENT CALCULATOR DATA
   ═══════════════════════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════════════════════
   CASE COLORS (for success stories & carousel)
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

/* ═══════════════════════════════════════════════════════════════
   FILING DEADLINES DATA
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

/* ═══════════════════════════════════════════════════════════════
   BLOG & NEWS DATA
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
    image: '/blog/camp-lejeune.jpg',
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
    image: '/blog/roundup.jpg',
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
    image: '/blog/documentation.jpg',
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
    image: '/blog/nec-formula.jpg',
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
    image: '/blog/depo-provera.jpg',
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
   MOBILE NAV ITEMS
   ═══════════════════════════════════════════════════════════════ */

const MOBILE_NAV_ITEMS = [
  { icon: Home, labelKey: 'mobile.home', href: '#hero' },
  { icon: Search, labelKey: 'mobile.track', href: '#track-claim' },
  { icon: Target, labelKey: 'mobile.quiz', href: '#eligibility-quiz' },
  { icon: DollarSign, labelKey: 'mobile.calc', href: '#settlement-calculator' },
  { icon: Phone, labelKey: 'mobile.contact', href: '#contact' },
];

/* ═══════════════════════════════════════════════════════════════
   LEGAL TEXT GENERATORS
   ═══════════════════════════════════════════════════════════════ */

function getPrivacyPolicyText(s: CompanySettings) {
  return `Privacy Policy for ${s.companyName}

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

To exercise any of these rights, please contact us at ${s.privacyEmail}.

7. Contact

If you have questions about this Privacy Policy, please contact us at:
Email: ${s.privacyEmail}
Phone: ${s.phone}
Address: ${s.address}`;
}

function getTermsOfServiceText(s: CompanySettings) {
  return `Terms of Service for ${s.companyName}

Last Updated: January 2025

1. Services

${s.companyName} provides mass tort claim assistance services including claim tracking, document correction support, eligibility assessment, and referral to qualified legal professionals. Our services are designed to assist claimants in navigating the complex mass tort claims process.

2. Important Disclaimers

${s.companyName} is NOT a law firm and does not provide legal advice. The information on this website is for general informational purposes only. Nothing on this website should be construed as legal advice or create an attorney-client relationship.

Prior results described on this website do not guarantee a similar outcome for any individual case. Case results depend on many factors unique to each claim.

3. Limitations of Liability

To the maximum extent permitted by law, ${s.companyName} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services or website. Our total liability shall not exceed the value of services provided to you.

4. User Responsibilities

You agree to:
- Provide accurate and truthful information
- Not misuse our services or website
- Not attempt to gain unauthorized access to our systems
- Comply with all applicable laws and regulations
- Maintain the confidentiality of your account credentials

5. Indemnification

You agree to indemnify and hold harmless ${s.companyName}, its officers, directors, employees, and agents from and against any claims, damages, losses, or expenses arising from your use of our services or your violation of these Terms.

6. Intellectual Property

All content on this website, including text, graphics, logos, and software, is the property of ${s.companyName} and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.

7. Governing Law

These Terms shall be governed by and construed in accordance with the laws of the District of Columbia, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of the District of Columbia.

8. Modifications

We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our website. Your continued use of our services after such changes constitutes acceptance of the modified Terms.

9. Contact

For questions about these Terms, contact us at:
Email: ${s.legalEmail}
Phone: ${s.phone}
Address: ${s.address}`;
}

const DISCLAIMER_TEXT = `Legal Disclaimer

ClaimGuard Pro is not a law firm. We are a claims assistance service that connects claimants with qualified legal professionals and provides administrative support throughout the mass tort claims process.

The information provided on this website is for general informational purposes only and does not constitute legal advice, legal opinion, or any other form of professional advice. You should not act upon any information provided without first seeking qualified legal counsel from a licensed attorney in your jurisdiction.

Testimonials and case results displayed on this website reflect the experiences of individual clients. Every case is different, and past results do not guarantee or predict a similar outcome in any future case. The testimonials displayed are given verbatim except for correction of grammatical or typing errors. Some testimonials may have been shortened for brevity.

Attorney Advertising. Prior results do not guarantee a similar outcome. The information on this site is not legal advice. Your access to and use of this site is subject to additional Terms and Conditions.

ClaimGuard Pro makes no representations or warranties, express or implied, regarding the accuracy, completeness, or reliability of any information on this website. Any reliance you place on such information is strictly at your own risk.

By using this website, you acknowledge that you have read, understood, and agree to this disclaimer.`;

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
function generateSocialProofPool(): Array<{ name: string; location: string; action: string; time: string; caseType?: string }> {
  const sessionId = typeof window !== 'undefined'
    ? (sessionStorage.getItem('claimguard-sp-session') || `${Date.now()}-${Math.random().toString(36).slice(2)}`)
    : `${Date.now()}`;

  if (typeof window !== 'undefined') {
    sessionStorage.setItem('claimguard-sp-session', sessionId);
  }

  const seed = hashString(sessionId);
  const pool: Array<{ name: string; location: string; action: string; time: string; caseType?: string }> = [];
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

/* ═══════════════════════════════════════════════════════════════
   TRACK CLAIM HELPERS
   ═══════════════════════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════════════════════
   ADMIN CONSTANTS & INTERFACES
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

/* ═══════════════════════════════════════════════════════════════
   SHARED INTERFACES
   ═══════════════════════════════════════════════════════════════ */

interface ClaimResult {
  trackingId: string; status: string; claimType: string | null; description: string | null;
  filedDate: string | null; lastUpdated: string; notes: string | null; nextSteps: string | null;
  progress: number; claimant: { firstName: string; lastName: string };
  history: { status: string; notes: string | null; date: string }[];
}

interface QuizAnswers { q1: string; q2: string; q3: string; q4: string; q5: string; }

interface UploadedFile { file: File; id: string; }

interface ChatMessage { id: number; text: string; sender: 'bot' | 'user'; }

/* ═══════════════════════════════════════════════════════════════
   EXPORTS
   ═══════════════════════════════════════════════════════════════ */

export {
  // Company Settings Context
  DEFAULT_COMPANY_SETTINGS,
  CompanySettingsContext,
  useCompanySettings,
  type CompanySettings,

  // Navigation & Hero
  NAV_LINKS,
  HERO_HEADLINES,
  PARTICLE_POSITIONS,

  // Case & Service Data
  CASE_TYPES,
  TRUST_BADGES,
  HOW_IT_WORKS_STEPS,
  SERVICES_DATA,
  STATS_DATA,
  STATS_TOOLTIP_DATA,

  // Testimonials & FAQ
  TESTIMONIALS_DATA,
  FAQ_DATA,

  // Case Studies & Success Stories
  CASE_STUDIES,
  SUCCESS_STORIES,

  // Team & Pipeline
  TEAM_MEMBERS,
  PIPELINE_STAGES,
  DOC_CHECKLIST,

  // Case Type Details
  CASE_TYPE_DETAILS,

  // Comparison & Trust
  COMPARISON_DATA,
  LAW_FIRMS,
  TRUST_STATS,
  MEDIA_LOGOS,

  // Settlement Calculator
  SETTLEMENT_RANGES,

  // Case Colors
  CASE_COLORS,

  // Filing Deadlines
  FILING_DEADLINES,

  // Blog & News
  BLOG_ARTICLES,
  NEWS_HEADLINES,

  // Form Data
  US_STATES,
  CLAIM_FORM_CASE_TYPES,
  SETTLEMENT_DATA,
  VIDEO_TESTIMONIALS,

  // Mobile Nav
  MOBILE_NAV_ITEMS,

  // Legal Text Generators
  getPrivacyPolicyText,
  getTermsOfServiceText,
  DISCLAIMER_TEXT,

  // Social Proof Generator
  SP_FIRST_NAMES,
  SP_LAST_INITIALS,
  SP_CITIES,
  SP_ACTIONS,
  SP_CASE_TYPES,
  SP_TIME_PHRASES,
  shuffleArray,
  hashString,
  generateSocialProofPool,

  // Track Claim Helpers
  getStatusConfig,
  getStageIndex,

  // Admin Constants
  ADMIN_AUTH_TOKEN,
  STATUS_COLORS,
  STATUS_DOT_COLORS,
  VALID_STATUSES,

  // Interfaces
  type ClaimantRecord,
  type AdminStats,
  type ClaimResult,
  type QuizAnswers,
  type UploadedFile,
  type ChatMessage,
};
