'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { Menu, X, Shield, Phone, LogIn, LayoutDashboard, User } from 'lucide-react';
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const mounted = useHasMounted();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check login status on mount and on auth-change events
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem('cg_token');
      const userData = localStorage.getItem('cg_user');
      if (token && userData) {
        try {
          const parsed = JSON.parse(userData);
          setIsLoggedIn(true);
          setUserName(parsed.firstName || 'User');
        } catch {
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLogin();
    window.addEventListener('auth-change', checkLogin);
    window.addEventListener('storage', checkLogin);
    return () => {
      window.removeEventListener('auth-change', checkLogin);
      window.removeEventListener('storage', checkLogin);
    };
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openPortal = () => {
    window.dispatchEvent(new CustomEvent('open-portal'));
    setMobileOpen(false);
  };

  const openAdmin = () => {
    window.dispatchEvent(new CustomEvent('open-admin'));
    setMobileOpen(false);
  };

  const openAuth = (tab: 'login' | 'register') => {
    window.dispatchEvent(new CustomEvent('open-auth', { detail: { tab } }));
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-slate-900/95 backdrop-blur-lg shadow-lg border-b border-slate-700/50'
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
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold text-white leading-tight">
                  ClaimGuard
                </span>
                <span className="text-[10px] md:text-xs text-amber-400 font-semibold tracking-widest uppercase -mt-0.5">
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
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-amber-400 rounded-lg hover:bg-slate-800/50 transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Desktop Right */}
            <div className="hidden lg:flex items-center gap-2">
              <a
                href="tel:4849681529"
                className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800/50 transition-colors"
                aria-label="Call us"
              >
                <Phone className="w-5 h-5" />
              </a>

              {isLoggedIn ? (
                <>
                  <Button
                    onClick={openPortal}
                    size="sm"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold shadow-md"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-1.5" />
                    My Portal
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => handleNavClick('#track-claim')}
                    size="sm"
                    className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600"
                  >
                    Track Claim
                  </Button>
                  <Button
                    onClick={() => openAuth('register')}
                    variant="outline"
                    size="sm"
                    className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
                  >
                    <LogIn className="w-4 h-4 mr-1.5" />
                    Sign Up
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Right */}
            <div className="flex lg:hidden items-center gap-2">
              {isLoggedIn && (
                <button
                  onClick={openPortal}
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-amber-400 bg-amber-500/10"
                  aria-label="Open portal"
                >
                  <LayoutDashboard className="w-5 h-5" />
                </button>
              )}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <button
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-300"
                    aria-label="Open menu"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0 bg-slate-900 border-slate-700">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                          <Shield className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-white">ClaimGuard Tort</span>
                      </div>
                    </div>

                    {/* User info card */}
                    {isLoggedIn && (
                      <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <User className="w-4 h-4 text-amber-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{userName}</p>
                            <p className="text-xs text-slate-400">Member</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex-1 overflow-y-auto p-4 space-y-1">
                      {NAV_LINKS.map((link) => (
                        <button
                          key={link.href}
                          onClick={() => handleNavClick(link.href)}
                          className="w-full text-left px-4 py-3 text-base font-medium text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                          {link.label}
                        </button>
                      ))}
                      <div className="border-t border-slate-700 my-3" />
                      <button
                        onClick={() => handleNavClick('#track-claim')}
                        className="w-full text-left px-4 py-3 text-base font-medium text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        Track My Claim
                      </button>
                      {isLoggedIn ? (
                        <button
                          onClick={openPortal}
                          className="w-full text-left px-4 py-3 text-base font-medium text-amber-400 rounded-lg hover:bg-amber-500/10 transition-colors"
                        >
                          Member Portal
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => openAuth('register')}
                            className="w-full text-left px-4 py-3 text-base font-medium text-amber-400 rounded-lg hover:bg-amber-500/10 transition-colors"
                          >
                            Sign Up Free
                          </button>
                          <button
                            onClick={() => openAuth('login')}
                            className="w-full text-left px-4 py-3 text-base font-medium text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
                          >
                            Log In
                          </button>
                        </>
                      )}
                    </div>
                    <div className="p-4 border-t border-slate-700 space-y-3">
                      <Button
                        onClick={() => {
                          setMobileOpen(false);
                          handleNavClick('#contact');
                        }}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold"
                        size="lg"
                      >
                        Free Assessment
                      </Button>
                      <a
                        href="tel:4849681529"
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
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
