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

export const dynamic = 'force-dynamic';

export default function HomePage() {
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
