'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Menu, X, Shield, Phone, Sun, Moon, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const mounted = useHasMounted();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 dark:border-slate-700/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button
              onClick={() => handleNavClick('#hero')}
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-tight">
                  ClaimGuard
                </span>
                <span className="text-[10px] md:text-xs text-amber-600 dark:text-amber-400 font-semibold tracking-widest uppercase -mt-0.5">
                  TORT
                </span>
              </div>
            </button>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-amber-400 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Desktop Right */}
            <div className="hidden lg:flex items-center gap-3">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              )}
              <a
                href="tel:4849681529"
                className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Call us"
              >
                <Phone className="w-5 h-5" />
              </a>
              <Button
                onClick={() => handleNavClick('#track-claim')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all"
                size="sm"
              >
                Track My Claim
              </Button>
              <Button
                onClick={() => {
                  const event = new CustomEvent('open-auth', { detail: { tab: 'register' } });
                  window.dispatchEvent(event);
                }}
                variant="outline"
                size="sm"
                className="border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20"
              >
                <LogIn className="w-4 h-4 mr-1.5" />
                Sign Up
              </Button>
            </div>

            {/* Mobile Right */}
            <div className="flex lg:hidden items-center gap-2">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              )}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <button
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300"
                    aria-label="Open menu"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <div className="flex flex-col h-full bg-white dark:bg-slate-900">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                          <Shield className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">ClaimGuard Tort</span>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-1">
                      {NAV_LINKS.map((link) => (
                        <button
                          key={link.href}
                          onClick={() => handleNavClick(link.href)}
                          className="w-full text-left px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-200 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          {link.label}
                        </button>
                      ))}
                      <div className="border-t border-gray-200 dark:border-slate-700 my-3" />
                      <button
                        onClick={() => {
                          setMobileOpen(false);
                          const event = new CustomEvent('open-auth', { detail: { tab: 'register' } });
                          window.dispatchEvent(event);
                        }}
                        className="w-full text-left px-4 py-3 text-base font-medium text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors"
                      >
                        Sign Up Free
                      </button>
                      <button
                        onClick={() => {
                          setMobileOpen(false);
                          const event = new CustomEvent('open-auth', { detail: { tab: 'login' } });
                          window.dispatchEvent(event);
                        }}
                        className="w-full text-left px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-200 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        Log In
                      </button>
                    </div>
                    <div className="p-4 border-t border-gray-200 dark:border-slate-700 space-y-3">
                      <Button
                        onClick={() => {
                          setMobileOpen(false);
                          handleNavClick('#track-claim');
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                        size="lg"
                      >
                        Track My Claim
                      </Button>
                      <a
                        href="tel:4849681529"
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        (484) 968-1529
                      </a>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
