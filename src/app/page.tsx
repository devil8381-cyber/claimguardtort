'use client';

import { useEffect, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/landing/HeroSection';
import ServicesSection from '@/components/landing/ServicesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import StatsSection from '@/components/landing/StatsSection';
import CaseTypesSection from '@/components/landing/CaseTypesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FAQSection from '@/components/landing/FAQSection';
import TrackClaimSection from '@/components/track/TrackClaimSection';
import AboutSection from '@/components/landing/AboutSection';
import ContactSection from '@/components/landing/ContactSection';
import CTASection from '@/components/landing/CTASection';
import AuthModal from '@/components/auth/AuthModal';
import MemberPortal from '@/components/portal/MemberPortal';
import AdminPanel from '@/components/admin/AdminPanel';
import LiveChat from '@/components/chat/LiveChat';

export default function HomePage() {
  // Secret admin trigger: type "admin" 3 times quickly to open admin panel
  const keystrokes = useRef<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      try {
        if (!e || typeof e.key !== 'string') return;
        const key = String(e.key).toLowerCase();
        if (!key || key.length !== 1) return;
        keystrokes.current.push(key);
        if (keystrokes.current.length > 20) {
          keystrokes.current = keystrokes.current.slice(-20);
        }
        const recent = keystrokes.current.join('');
        const adminCount = (recent.match(/admin/g) || []).length;
        if (adminCount >= 3) {
          keystrokes.current = [];
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('open-admin'));
          }
        }
      } catch {
        // Silently ignore keyboard errors
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  return (
    <>
      <a href="#hero" className="skip-to-content">Skip to main content</a>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <HowItWorksSection />
        <StatsSection />
        <CaseTypesSection />
        <TestimonialsSection />
        <FAQSection />
        <TrackClaimSection />
        <AboutSection />
        <ContactSection />
        <CTASection />
      </main>
      <Footer />
      <AuthModal />
      <MemberPortal />
      <AdminPanel />
      <LiveChat />
    </>
  );
}
