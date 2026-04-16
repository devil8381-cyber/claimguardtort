'use client';

import { Shield, Phone, Mail, MapPin } from 'lucide-react';

const FOOTER_LINKS = {
  company: [
    { label: 'About Us', href: '#about' },
    { label: 'Our Services', href: '#services' },
    { label: 'Contact Us', href: '#contact' },
    { label: 'FAQ', href: '#faq' },
  ],
  services: [
    { label: 'Claim Tracking', href: '#track-claim' },
    { label: 'Document Correction', href: '#services' },
    { label: 'Eligibility Review', href: '#services' },
    { label: 'Legal Consultation', href: '#services' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Disclaimer', href: '#disclaimer' },
  ],
};

export default function Footer() {
  const handleClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight">ClaimGuard</span>
                <span className="text-[10px] text-amber-400 font-semibold tracking-widest uppercase -mt-0.5">TORT</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Your trusted partner in mass tort claims recovery. Guiding claimants to fair compensation since 2009.
            </p>
            <div className="space-y-2.5">
              <a href="tel:4849681529" className="flex items-center gap-2 text-sm text-slate-300 hover:text-amber-400 transition-colors">
                <Phone className="w-4 h-4" />
                (484) 968-1529
              </a>
              <a href="mailto:donotreply@claimguardtort.com" className="flex items-center gap-2 text-sm text-slate-300 hover:text-amber-400 transition-colors">
                <Mail className="w-4 h-4" />
                donotreply@claimguardtort.com
              </a>
              <div className="flex items-start gap-2 text-sm text-slate-300">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>1429 Walnut St, 14th Floor, Philadelphia, PA 19102</span>
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleClick(link.href)}
                    className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Services</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleClick(link.href)}
                    className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleClick(link.href)}
                    className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500 text-center md:text-left">
              &copy; {new Date().getFullYear()} ClaimGuard Tort. All rights reserved. This website is for informational purposes only and does not constitute legal advice.
            </p>
            <p className="text-xs text-slate-500 text-center md:text-right">
              Attorney Advertising. Prior results do not guarantee a similar outcome.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
