'use client';

import { useState, useEffect, useRef, useCallback, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import {
  Shield,
  Search,
  FileCheck,
  Users,
  Phone,
  Mail,
  Clock,
  ChevronRight,
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
  Loader2,
} from 'lucide-react';

/* ─── Intersection Observer Hook ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ─── Counter Animation Hook ─── */
function useCounter(target: number, inView: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, inView, duration]);
  return count;
}

/* ─── Section Wrapper with fade-in ─── */
function AnimatedSection({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      id={id}
      className={`${className} transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {children}
    </div>
  );
}

/* ─── NAV ─── */
const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Services', href: '#services' },
  { label: 'Why Choose Us', href: '#why-choose-us' },
  { label: 'Track My Claim', href: '#track-claim' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleClick = useCallback((href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gold/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={() => handleClick('#hero')}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-navy flex items-center justify-center group-hover:bg-navy-light transition-colors">
              <Shield className="w-5 h-5 md:w-6 md:h-6 text-gold" />
            </div>
            <div className="flex flex-col">
              <span
                className={`text-lg md:text-xl font-bold leading-tight tracking-tight transition-colors ${
                  scrolled ? 'text-navy' : 'text-white'
                }`}
              >
                Claim<span className="text-gold">Guard</span> Pro
              </span>
            </div>
          </button>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleClick(link.href)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all hover:bg-gold/10 hover:text-gold ${
                  scrolled ? 'text-navy' : 'text-white/90 hover:text-gold'
                }`}
              >
                {link.label}
              </button>
            ))}
            <Button
              onClick={() => handleClick('#contact')}
              size="sm"
              className="ml-2 bg-gold hover:bg-gold-dark text-white font-semibold"
            >
              Free Consultation
            </Button>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  className={`p-2 rounded-lg transition-colors ${
                    scrolled ? 'text-navy hover:bg-navy/5' : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center">
                        <Shield className="w-4 h-4 text-gold" />
                      </div>
                      <span className="text-lg font-bold text-navy">
                        Claim<span className="text-gold">Guard</span> Pro
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 py-4 overflow-y-auto">
                    {NAV_LINKS.map((link) => (
                      <button
                        key={link.href}
                        onClick={() => handleClick(link.href)}
                        className="w-full text-left px-6 py-3 text-base font-medium text-navy hover:bg-navy/5 hover:text-gold transition-colors flex items-center justify-between"
                      >
                        {link.label}
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                  <div className="p-4 border-t border-border">
                    <Button
                      onClick={() => handleClick('#contact')}
                      className="w-full bg-gold hover:bg-gold-dark text-white font-semibold"
                    >
                      Free Consultation
                    </Button>
                    <a
                      href="tel:8005550199"
                      className="flex items-center justify-center gap-2 mt-3 text-sm text-navy font-medium"
                    >
                      <Phone className="w-4 h-4 text-gold" />
                      (800) 555-0199
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
}

/* ─── HERO ─── */
function HeroSection() {
  const scrollTo = useCallback((id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="/hero-bg.png"
          alt="Professional legal office"
          className="w-full h-full object-cover"
        />
        <div className="hero-gradient absolute inset-0" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-navy-light/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="max-w-3xl">
          <div className="animate-fade-in-up opacity-0">
            <Badge className="mb-6 px-4 py-1.5 bg-gold/20 text-gold border-gold/30 text-sm font-medium backdrop-blur-sm">
              <Shield className="w-3.5 h-3.5 mr-1.5" />
              Trusted by 1,000+ Claimants Nationwide
            </Badge>
          </div>

          <h1
            className="animate-fade-in-up opacity-0 delay-100 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Don&apos;t Let Your Claim{' '}
            <span className="text-gold">Get Lost</span> in the System
          </h1>

          <p className="animate-fade-in-up opacity-0 delay-200 text-lg sm:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed">
            Mass tort claims can be overwhelming. ClaimGuard Pro guides you through every
            step — from tracking your claim status to correcting paperwork errors — so you
            get the compensation you deserve.
          </p>

          <div className="animate-fade-in-up opacity-0 delay-300 flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => scrollTo('#track-claim')}
              size="lg"
              className="bg-gold hover:bg-gold-dark text-white font-semibold text-base px-8 py-6 shadow-xl shadow-gold/20 transition-all hover:shadow-2xl hover:shadow-gold/30 hover:scale-[1.02]"
            >
              <Search className="w-5 h-5 mr-2" />
              Track My Claim
            </Button>
            <Button
              onClick={() => scrollTo('#contact')}
              size="lg"
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold text-base px-8 py-6 backdrop-blur-sm transition-all hover:scale-[1.02]"
            >
              <Phone className="w-5 h-5 mr-2" />
              Get Free Consultation
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="animate-fade-in-up opacity-0 delay-500 mt-12 flex flex-wrap gap-6 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-gold" />
              <span>Secure & Confidential</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gold" />
              <span>No Upfront Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold" />
              <span>24/7 Support Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-gold rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
}

/* ─── HOW IT WORKS ─── */
const STEPS = [
  {
    step: 1,
    icon: Search,
    title: 'Submit Your Tracking Link',
    description:
      'Enter your unique claim ID or tracking link provided by the claims administrator. Our system instantly pulls your claim details.',
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    step: 2,
    icon: Eye,
    title: 'Review Your Claim Status',
    description:
      'See exactly where your claim stands in the process. View real-time status updates, history, and next steps — all in one clear dashboard.',
    color: 'bg-gold/10 text-gold-dark',
  },
  {
    step: 3,
    icon: FileSignature,
    title: 'Get Expert Guidance',
    description:
      'Our dedicated team identifies issues, helps correct documents, re-signs paperwork, and ensures you meet every deadline for maximum compensation.',
    color: 'bg-green-500/10 text-green-600',
  },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider">
            How It Works
          </Badge>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Three Simple Steps to{' '}
            <span className="text-gold">Resolve Your Claim</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We&apos;ve streamlined the claims assistance process so you can focus on what matters —
            getting the compensation you deserve.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8 md:gap-6">
          {STEPS.map((item, idx) => (
            <AnimatedSection key={item.step}>
              <div className="relative group">
                {/* Connector line */}
                {idx < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[calc(50%+3rem)] right-[calc(-50%+3rem)] h-0.5 bg-gradient-to-r from-gold/40 to-gold/10" />
                )}
                <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center shrink-0`}
                      >
                        <item.icon className="w-7 h-7" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-sm">
                        {item.step}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-navy mt-4">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SERVICES ─── */
const SERVICES = [
  {
    icon: Search,
    title: 'Claim Status Tracking',
    description:
      'Instantly check where your claim stands. Our real-time tracking system shows your claim status, progress, and any actions needed.',
  },
  {
    icon: FileSignature,
    title: 'Document Correction & Re-filing',
    description:
      'Missed signatures? Incorrect forms? Our experts identify and fix documentation issues quickly, re-filing on your behalf to avoid delays.',
  },
  {
    icon: UserCheck,
    title: 'Eligibility Review & Verification',
    description:
      'Not sure if you qualify? We review your case against settlement criteria and help establish your eligibility with supporting evidence.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Personalized Claimant Support',
    description:
      'Every claim is unique. Get a dedicated support specialist who understands your case and guides you through every step of the process.',
  },
];

function ServicesSection() {
  return (
    <section id="services" className="py-20 md:py-28 bg-[#F4F1EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge className="mb-4 px-3 py-1 bg-navy/10 text-navy border-navy/20 text-xs font-semibold uppercase tracking-wider">
            Our Services
          </Badge>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Comprehensive Claims{' '}
            <span className="text-gold">Assistance</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From tracking to resolution, we provide end-to-end support for your mass tort claim.
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => (
            <AnimatedSection key={service.title}>
              <Card className="group h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center mb-3 group-hover:bg-gold/10 transition-colors">
                    <service.icon className="w-6 h-6 text-navy group-hover:text-gold transition-colors" />
                  </div>
                  <CardTitle className="text-lg font-bold text-navy">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── WHY CHOOSE US ─── */
const STATS = [
  { icon: Users, value: 1000, suffix: '+', label: 'Claims Assisted' },
  { icon: Award, value: 98, suffix: '%', label: 'Success Rate' },
  { icon: HeadphonesIcon, value: 24, suffix: '/7', label: 'Dedicated Support' },
  { icon: Lock, value: 100, suffix: '%', label: 'Secure & Confidential' },
];

const TESTIMONIALS = [
  {
    name: 'Margaret H.',
    location: 'Austin, TX',
    text: "My claim was stuck in 'Correction Needed' for months. ClaimGuard Pro helped me fix the paperwork within a week and resubmit. Now my claim is approved!",
    rating: 5,
  },
  {
    name: 'Thomas J.',
    location: 'Columbus, OH',
    text: "I had no idea where my claim stood or what to do next. Their tracking system and support team made everything clear. Highly recommend their services.",
    rating: 5,
  },
  {
    name: 'Linda R.',
    location: 'Phoenix, AZ',
    text: "After my initial claim was denied, I felt hopeless. ClaimGuard Pro helped me appeal with stronger evidence and we won. I'm so grateful for their persistence.",
    rating: 5,
  },
];

function StatCard({ icon: Icon, value, suffix, label, inView }: {
  icon: typeof Users;
  value: number;
  suffix: string;
  label: string;
  inView: boolean;
}) {
  const count = useCounter(value, inView);
  return (
    <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
      <Icon className="w-8 h-8 text-gold mx-auto mb-3" />
      <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
        {count}{suffix}
      </div>
      <div className="text-white/50 text-sm font-medium">{label}</div>
    </div>
  );
}

function WhyChooseUsSection() {
  const { ref: statsRef, inView: statsInView } = useInView(0.2);

  return (
    <section id="why-choose-us" className="py-20 md:py-28 bg-navy relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy-light/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge className="mb-4 px-3 py-1 bg-gold/20 text-gold border-gold/30 text-xs font-semibold uppercase tracking-wider">
            Why Choose Us
          </Badge>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Your Trusted Partner in{' '}
            <span className="text-gold">Claims Recovery</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            We&apos;ve helped thousands of claimants navigate complex mass tort processes with
            proven results and personalized care.
          </p>
        </AnimatedSection>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {STATS.map((stat) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              inView={statsInView}
            />
          ))}
        </div>

        {/* Testimonials */}
        <AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <Card
                key={t.name}
                className="bg-white/5 border-white/10 backdrop-blur-sm text-white hover:bg-white/10 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-gold text-gold"
                      />
                    ))}
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed mb-6 italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">{t.name}</div>
                      <div className="text-white/40 text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {t.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── TRACK MY CLAIM ─── */
interface ClaimResult {
  trackingId: string;
  status: string;
  claimType: string | null;
  description: string | null;
  filedDate: string | null;
  lastUpdated: string;
  notes: string | null;
  nextSteps: string | null;
  progress: number;
  claimant: {
    firstName: string;
    lastName: string;
  };
  history: {
    status: string;
    notes: string | null;
    date: string;
  }[];
}

function getStatusConfig(status: string) {
  switch (status) {
    case 'Pending':
      return { badge: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock, color: 'text-amber-600' };
    case 'Under Review':
      return { badge: 'bg-blue-100 text-blue-800 border-blue-200', icon: Eye, color: 'text-blue-600' };
    case 'Approved':
      return { badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2, color: 'text-emerald-600' };
    case 'Denied':
      return { badge: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle, color: 'text-red-600' };
    case 'Correction Needed':
      return { badge: 'bg-violet-100 text-violet-800 border-violet-200', icon: FileSignature, color: 'text-violet-600' };
    default:
      return { badge: 'bg-gray-100 text-gray-800 border-gray-200', icon: Clock, color: 'text-gray-600' };
  }
}

function TrackClaimSection() {
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClaimResult | null>(null);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleTrack = useCallback(async () => {
    const trimmed = trackingId.trim();
    if (!trimmed) {
      setError('Please enter a tracking ID');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/claims/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingId: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Claim not found');
        toast({
          title: 'Claim Not Found',
          description: data.error || 'Please verify your tracking ID.',
          variant: 'destructive',
        });
        return;
      }
      setResult(data.claim);
      toast({
        title: 'Claim Found',
        description: `Successfully retrieved status for ${data.claim.trackingId}`,
      });
    } catch {
      setError('Network error. Please try again.');
      toast({
        title: 'Error',
        description: 'Could not connect to the server. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [trackingId, toast]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleTrack();
    },
    [handleTrack]
  );

  return (
    <section id="track-claim" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider">
            Track Your Claim
          </Badge>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Real-Time Claim <span className="text-gold">Status Check</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Enter your tracking ID below to see where your claim stands, view history, and get
            clear next steps.
          </p>
        </AnimatedSection>

        {/* Search input */}
        <AnimatedSection className="max-w-2xl mx-auto mb-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={trackingId}
                onChange={(e) => {
                  setTrackingId(e.target.value);
                  setError('');
                }}
                onKeyDown={handleKeyDown}
                placeholder="Enter Tracking ID (e.g., CLM-2024-001)"
                className="pl-12 h-13 text-base border-2 focus:border-gold bg-white"
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleTrack}
              disabled={loading}
              className="h-13 px-8 bg-navy hover:bg-navy-light text-white font-semibold text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Track Claim
                </>
              )}
            </Button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-red-800 font-medium text-sm">{error}</p>
                <p className="text-red-600 text-sm mt-1">
                  Need help?{' '}
                  <button
                    onClick={() =>
                      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                    }
                    className="underline font-semibold hover:text-red-800"
                  >
                    Contact our support team
                  </button>
                </p>
              </div>
            </div>
          )}
        </AnimatedSection>

        {/* Demo hint */}
        {!result && !error && (
          <AnimatedSection className="text-center mb-10">
            <p className="text-sm text-muted-foreground">
              Try demo tracking IDs:{' '}
              <button onClick={() => { setTrackingId('CLM-2024-001'); setError(''); }} className="text-gold font-semibold hover:underline">CLM-2024-001</button>
              {', '}
              <button onClick={() => { setTrackingId('CLM-2024-002'); setError(''); }} className="text-gold font-semibold hover:underline">CLM-2024-002</button>
              {', '}
              <button onClick={() => { setTrackingId('CLM-2024-003'); setError(''); }} className="text-gold font-semibold hover:underline">CLM-2024-003</button>
              {', '}
              <button onClick={() => { setTrackingId('CLM-2024-004'); setError(''); }} className="text-gold font-semibold hover:underline">CLM-2024-004</button>
              {', '}
              <button onClick={() => { setTrackingId('CLM-2024-005'); setError(''); }} className="text-gold font-semibold hover:underline">CLM-2024-005</button>
            </p>
          </AnimatedSection>
        )}

        {/* Result card */}
        {result && (
          <AnimatedSection className="max-w-3xl mx-auto">
            <Card className="border-2 border-gold/20 shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-navy p-6 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">Tracking ID</p>
                    <p className="text-2xl font-bold flex items-center gap-2">
                      <Shield className="w-6 h-6 text-gold" />
                      {result.trackingId}
                    </p>
                  </div>
                  <Badge
                    className={`text-sm font-semibold px-4 py-1.5 border ${getStatusConfig(result.status).badge}`}
                  >
                    {(() => {
                      const StatusIcon = getStatusConfig(result.status).icon;
                      return StatusIcon ? <StatusIcon className="w-4 h-4 mr-1.5" /> : null;
                    })()}
                    {result.status}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6 space-y-6">
                {/* Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-navy">Claim Progress</span>
                    <span className="text-sm font-bold text-gold">{result.progress}%</span>
                  </div>
                  <Progress value={result.progress} className="h-2.5 [&>div]:bg-gold" />
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Filed</span>
                    <span>Under Review</span>
                    <span>Decision</span>
                  </div>
                </div>

                <Separator />

                {/* Details grid */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Claimant
                    </p>
                    <p className="font-semibold text-navy">
                      {result.claimant.firstName} {result.claimant.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Claim Type
                    </p>
                    <p className="font-semibold text-navy">{result.claimType || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Filed Date
                    </p>
                    <p className="font-semibold text-navy">
                      {result.filedDate
                        ? new Date(result.filedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Last Updated
                    </p>
                    <p className="font-semibold text-navy">
                      {new Date(result.lastUpdated).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {result.description && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Description
                    </p>
                    <p className="text-sm text-navy/80 leading-relaxed">{result.description}</p>
                  </div>
                )}

                {/* Notes */}
                {result.notes && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
                      <AlertCircle className="w-3.5 h-3.5 inline mr-1" />
                      Important Notes
                    </p>
                    <p className="text-sm text-amber-900">{result.notes}</p>
                  </div>
                )}

                {/* Next Steps */}
                {result.nextSteps && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
                      <ArrowRight className="w-3.5 h-3.5 inline mr-1" />
                      Next Steps
                    </p>
                    <p className="text-sm text-emerald-900">{result.nextSteps}</p>
                  </div>
                )}

                {/* History timeline */}
                {result.history && result.history.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Claim History
                    </p>
                    <div className="space-y-3">
                      {result.history.map((h, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <div className="flex flex-col items-center mt-1">
                            <div
                              className={`w-2.5 h-2.5 rounded-full ${
                                i === 0 ? 'bg-gold' : 'bg-gray-300'
                              }`}
                            />
                            {i < result.history.length - 1 && (
                              <div className="w-0.5 h-8 bg-gray-200" />
                            )}
                          </div>
                          <div className="pb-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge
                                variant="secondary"
                                className={`text-xs ${getStatusConfig(h.status).badge}`}
                              >
                                {h.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(h.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                            {h.notes && (
                              <p className="text-sm text-navy/70 mt-1">{h.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action button */}
                {(result.status === 'Denied' || result.status === 'Correction Needed') && (
                  <Button
                    onClick={() =>
                      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                    }
                    className="w-full bg-gold hover:bg-gold-dark text-white font-semibold"
                    size="lg"
                  >
                    {result.status === 'Denied'
                      ? 'Appeal My Claim — Get Help Now'
                      : 'Fix My Documents — Schedule Correction'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}

/* ─── ABOUT ─── */
function AboutSection() {
  const VALUES = [
    {
      icon: Shield,
      title: 'Integrity First',
      desc: 'We operate with complete transparency and always put our claimants\' interests first.',
    },
    {
      icon: Scale,
      title: 'Justice for All',
      desc: 'We believe every claimant deserves fair representation and equal access to compensation.',
    },
    {
      icon: Users,
      title: 'Personalized Care',
      desc: 'No cookie-cutter solutions. Every claim gets individualized attention from our experts.',
    },
    {
      icon: Award,
      title: 'Proven Results',
      desc: 'With a 98% success rate, our track record speaks for itself.',
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-[#F4F1EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <AnimatedSection>
            <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider">
              About Us
            </Badge>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-6 leading-tight"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Fighting for the{' '}
              <span className="text-gold">Compensation</span> You Deserve
            </h2>
            <div className="space-y-4 text-muted-foreground text-base leading-relaxed">
              <p>
                ClaimGuard Pro was founded with a singular mission: to ensure that no one is left
                behind in complex mass tort litigation. Our team of legal professionals, claims
                specialists, and client advocates brings decades of combined experience in class
                action lawsuit support.
              </p>
              <p>
                We understand that navigating the claims process can be confusing and stressful.
                That&apos;s why we&apos;ve built comprehensive tools and assembled a dedicated team
                to guide claimants through every step — from initial filing to final resolution.
              </p>
              <p>
                Whether your claim is stuck in review, denied due to paperwork errors, or you simply
                need to understand your rights, ClaimGuard Pro is here to help.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="grid sm:grid-cols-2 gap-4">
              {VALUES.map((v) => (
                <Card
                  key={v.title}
                  className="bg-white border-0 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <CardContent className="p-5">
                    <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center mb-3">
                      <v.icon className="w-5 h-5 text-navy" />
                    </div>
                    <h3 className="font-bold text-navy mb-1">{v.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Trust badges */}
            <div className="mt-6 p-4 bg-white rounded-xl shadow-md flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-navy">
                <CheckCircle2 className="w-5 h-5 text-gold" />
                <span className="text-sm font-medium">BBB Accredited</span>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2 text-navy">
                <Lock className="w-5 h-5 text-gold" />
                <span className="text-sm font-medium">SSL Encrypted</span>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2 text-navy">
                <Shield className="w-5 h-5 text-gold" />
                <span className="text-sm font-medium">HIPAA Compliant</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ─── */
function ContactSection() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    claimId: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Name is required (min 2 characters)';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';
    if (form.phone && !/^[\d\s\-\(\)\+]+$/.test(form.phone)) errs.phone = 'Invalid phone number';
    if (!form.message.trim() || form.message.trim().length < 10) errs.message = 'Message is required (min 10 characters)';
    return errs;
  };

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const errs = validate();
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;

      setLoading(true);
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrors({ message: data.details?.join('. ') || data.error || 'Submission failed' });
          toast({
            title: 'Error',
            description: data.details?.join('. ') || data.error || 'Submission failed',
            variant: 'destructive',
          });
          return;
        }
        setSubmitted(true);
        toast({
          title: 'Message Sent!',
          description: data.message || 'We\'ll get back to you within 24 hours.',
        });
      } catch {
        setErrors({ message: 'Network error. Please try again.' });
        toast({
          title: 'Error',
          description: 'Could not connect to the server.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    [form, toast]
  );

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  if (submitted) {
    return (
      <section id="contact" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-lg mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2
              className="text-3xl font-bold text-navy mb-3"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Thank You!
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Your message has been received. Our team will get back to you within 24 hours.
            </p>
            <Button
              onClick={() => {
                setSubmitted(false);
                setForm({ name: '', email: '', phone: '', claimId: '', message: '' });
              }}
              variant="outline"
              className="border-navy text-navy hover:bg-navy hover:text-white"
            >
              Send Another Message
            </Button>
          </AnimatedSection>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <Badge className="mb-4 px-3 py-1 bg-gold/10 text-gold-dark border-gold/20 text-xs font-semibold uppercase tracking-wider">
            Contact Us
          </Badge>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Get Your Free <span className="text-gold">Consultation</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have questions about your claim? Our experts are ready to help. Reach out today —
            no obligation, no upfront fees.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Form */}
          <AnimatedSection className="lg:col-span-3">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold text-navy">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="John Smith"
                        className={`h-11 ${errors.name ? 'border-red-300 focus:border-red-500' : 'focus:border-gold'}`}
                      />
                      {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-navy">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="john@example.com"
                        className={`h-11 ${errors.email ? 'border-red-300 focus:border-red-500' : 'focus:border-gold'}`}
                      />
                      {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold text-navy">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="(555) 123-4567"
                        className={`h-11 ${errors.phone ? 'border-red-300 focus:border-red-500' : 'focus:border-gold'}`}
                      />
                      {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="claimId" className="text-sm font-semibold text-navy">
                        Claim ID <span className="text-muted-foreground font-normal">(optional)</span>
                      </Label>
                      <Input
                        id="claimId"
                        value={form.claimId}
                        onChange={(e) => updateField('claimId', e.target.value)}
                        placeholder="CLM-2024-001"
                        className="h-11 focus:border-gold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-semibold text-navy">
                      Message <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      value={form.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      placeholder="Describe your situation or question..."
                      rows={5}
                      className={`resize-none ${errors.message ? 'border-red-300 focus:border-red-500' : 'focus:border-gold'}`}
                    />
                    {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full bg-gold hover:bg-gold-dark text-white font-semibold text-base"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Contact info sidebar */}
          <AnimatedSection className="lg:col-span-2">
            <div className="space-y-6">
              {/* Phone */}
              <Card className="border-0 shadow-md bg-navy text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm font-medium">Call Us</p>
                      <a
                        href="tel:8005550199"
                        className="text-xl font-bold text-gold hover:text-gold-light transition-colors"
                      >
                        (800) 555-0199
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-navy" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">Email Us</p>
                      <a
                        href="mailto:support@claimguardpro.com"
                        className="font-bold text-navy hover:text-gold transition-colors"
                      >
                        support@claimguardpro.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hours */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-navy" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">Business Hours</p>
                      <p className="font-bold text-navy">Mon – Fri: 9 AM – 6 PM EST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-navy" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">Headquarters</p>
                      <p className="font-bold text-navy text-sm">1200 Justice Ave, Suite 400</p>
                      <p className="text-navy text-sm">Washington, D.C. 20001</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  const scrollTo = useCallback((id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <footer className="bg-navy-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-12 md:py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gold/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-gold" />
              </div>
              <span className="text-xl font-bold">
                Claim<span className="text-gold">Guard</span> Pro
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Your trusted partner in mass tort claims assistance. We help claimants navigate
              complex legal processes and maximize their compensation.
            </p>
            <p className="text-gold text-sm font-semibold italic">
              &ldquo;Your Claims. Our Mission. Maximum Compensation.&rdquo;
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', href: '#hero' },
                { label: 'How It Works', href: '#how-it-works' },
                { label: 'Services', href: '#services' },
                { label: 'Track My Claim', href: '#track-claim' },
              ].map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-white/50 hover:text-gold text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', href: '#about' },
                { label: 'Contact', href: '#contact' },
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Service', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-white/50 hover:text-gold text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:8005550199"
                  className="text-white/50 hover:text-gold text-sm transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  (800) 555-0199
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@claimguardpro.com"
                  className="text-white/50 hover:text-gold text-sm transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  support@claimguardpro.com
                </a>
              </li>
              <li>
                <span className="text-white/50 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Mon – Fri: 9 AM – 6 PM EST
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <Separator className="bg-white/10" />
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p>&copy; {new Date().getFullYear()} ClaimGuard Pro. All rights reserved.</p>
          <div className="flex gap-6">
            <button className="hover:text-gold transition-colors">Privacy Policy</button>
            <button className="hover:text-gold transition-colors">Terms of Service</button>
            <button className="hover:text-gold transition-colors">Disclaimer</button>
          </div>
        </div>

        {/* Legal disclaimer */}
        <div className="pb-6">
          <p className="text-[11px] text-white/25 leading-relaxed max-w-4xl">
            Disclaimer: ClaimGuard Pro is not a law firm and does not provide legal advice. We are a
            claims assistance service that helps claimants navigate the administrative process of
            mass tort settlements. Results may vary. Past performance does not guarantee future
            outcomes. This website is for informational purposes only and does not constitute legal
            counsel. Please consult with a licensed attorney for legal advice regarding your specific
            situation.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── MAIN PAGE ─── */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <ServicesSection />
        <WhyChooseUsSection />
        <TrackClaimSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
