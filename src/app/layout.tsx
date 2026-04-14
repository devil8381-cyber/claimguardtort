import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://claimguardpro.com'),
  alternates: {
    canonical: '/',
  },
  title: "ClaimGuard Pro — Your Claims. Our Mission. Maximum Compensation.",
  description:
    "ClaimGuard Pro helps claimants in mass tort class action lawsuits track their claims, correct documentation issues, and maximize their compensation. Free consultation available.",
  keywords: [
    "mass tort",
    "class action",
    "claim tracking",
    "claim assistance",
    "legal help",
    "compensation",
    "ClaimGuard Pro",
    "Camp Lejeune",
    "Roundup lawsuit",
    "talcum powder claim",
    "hernia mesh",
    "paraquat",
    "firefighting foam",
  ],
  authors: [{ name: "ClaimGuard Pro" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "ClaimGuard Pro — Mass Tort Claims Assistance",
    description:
      "Don't let your claim get lost in the system. Track your claim, get expert guidance, and maximize your compensation.",
    type: "website",
    siteName: "ClaimGuard Pro",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ClaimGuard Pro — Free Mass Tort Claims Assistance" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClaimGuard Pro — Mass Tort Claims Assistance",
    description:
      "Track your claim, get expert guidance, and maximize your compensation.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "ClaimGuard Pro",
      url: "https://claimguardpro.com",
      logo: "https://claimguardpro.com/logo.png",
      description:
        "ClaimGuard Pro helps claimants in mass tort class action lawsuits track their claims, correct documentation issues, and maximize their compensation.",
      telephone: "(800) 555-0199",
      email: "info@claimguardpro.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "123 Justice Avenue",
        addressLocality: "Washington",
        addressRegion: "DC",
        postalCode: "20001",
        addressCountry: "US",
      },
      areaServed: "US",
      serviceType: "Mass Tort Claims Assistance",
    },
    {
      "@type": "LegalService",
      name: "ClaimGuard Pro",
      description:
        "Mass tort claim tracking, document correction, eligibility assessment, and settlement maximization.",
      url: "https://claimguardpro.com",
      telephone: "(800) 555-0199",
      priceRange: "Free",
      areaServed: "US",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Claims Assistance Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Claim Status Tracking",
              description: "Real-time tracking of your mass tort claim status and progress.",
            },
            price: "0",
            priceCurrency: "USD",
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Document Correction & Re-filing",
              description: "Expert review and correction of claim documentation issues.",
            },
            priceSpecification: {
              "@type": "PriceSpecification",
              price: "0",
              priceCurrency: "USD",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Eligibility Review",
              description: "Free assessment of your eligibility for mass tort claims.",
            },
            price: "0",
            priceCurrency: "USD",
          },
        ],
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is a mass tort claim?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A mass tort claim is a civil action involving numerous plaintiffs who have suffered similar harm from the same product, device, or environmental exposure. Unlike class actions, each plaintiff in a mass tort has their own individual case.",
          },
        },
        {
          "@type": "Question",
          name: "How long does the claims process take?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The timeline varies significantly depending on the type of claim, the complexity of your case, and the specific settlement program. Generally, once all documentation is complete and submitted, you can expect the review process to take anywhere from 3 to 18 months.",
          },
        },
        {
          "@type": "Question",
          name: "Can I appeal a denied claim?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, in most cases you can appeal a denied claim. The appeals process typically involves submitting additional supporting evidence, correcting any identified deficiencies, and providing a written explanation of why you believe the denial was incorrect.",
          },
        },
        {
          "@type": "Question",
          name: "Is ClaimGuard Pro really free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, ClaimGuard Pro is completely free. Every service we offer — from claim tracking and status checks to document correction, eligibility assessments, and personalized support — is provided at no cost to you, ever.",
          },
        },
        {
          "@type": "Question",
          name: "Is my information secure?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolutely. We use bank-level 256-bit encryption to protect all your personal and medical information. Our systems are HIPAA-compliant and undergo regular security audits. We never share your information without your explicit consent.",
          },
        },
      ],
    },
    {
      "@type": "LegalService",
      name: "ClaimGuard Pro",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5",
        bestRating: "5",
        worstRating: "1",
        reviewCount: "6",
        ratingCount: "6",
      },
      review: [
        { "@type": "Review", author: { "@type": "Person", name: "Margaret H." }, reviewRating: { "@type": "Rating", ratingValue: "5" }, reviewBody: "My claim was stuck in 'Correction Needed' for months. ClaimGuard Pro helped me fix the paperwork within a week and resubmit. Now my claim is approved!" },
        { "@type": "Review", author: { "@type": "Person", name: "Thomas J." }, reviewRating: { "@type": "Rating", ratingValue: "5" }, reviewBody: "I had no idea where my claim stood or what to do next. Their tracking system and support team made everything clear." },
        { "@type": "Review", author: { "@type": "Person", name: "Linda R." }, reviewRating: { "@type": "Rating", ratingValue: "5" }, reviewBody: "After my initial claim was denied, I felt hopeless. ClaimGuard Pro helped me appeal with stronger evidence and we won." },
        { "@type": "Review", author: { "@type": "Person", name: "Robert M." }, reviewRating: { "@type": "Rating", ratingValue: "5" }, reviewBody: "The eligibility quiz gave me confidence to file. Six months later, I received my settlement check." },
        { "@type": "Review", author: { "@type": "Person", name: "Dorothy K." }, reviewRating: { "@type": "Rating", ratingValue: "5" }, reviewBody: "What impressed me most was the real-time tracking. I could see my claim moving through each stage." },
        { "@type": "Review", author: { "@type": "Person", name: "James P." }, reviewRating: { "@type": "Rating", ratingValue: "5" }, reviewBody: "They caught a critical error in my medical records submission that would have cost me my entire claim." },
      ],
    },
    {
      "@type": "Article",
      headline: "Camp Lejeune Water Contamination: Complete Guide to Filing Your Claim",
      description: "Everything you need to know about filing a Camp Lejeune water contamination claim, including eligibility requirements, deadlines, and step-by-step instructions.",
      datePublished: "2025-01-15",
      dateModified: "2025-03-01",
      author: { "@type": "Organization", name: "ClaimGuard Pro" },
      publisher: { "@type": "Organization", name: "ClaimGuard Pro", logo: { "@type": "ImageObject", url: "https://claimguardpro.com/logo.png" } },
    },
    {
      "@type": "Article",
      headline: "Roundup Lawsuit 2025: Latest Settlement Updates and Filing Deadlines",
      description: "Comprehensive overview of the current state of Roundup litigation, recent settlement developments, and what claimants need to know.",
      datePublished: "2025-02-10",
      dateModified: "2025-03-15",
      author: { "@type": "Organization", name: "ClaimGuard Pro" },
      publisher: { "@type": "Organization", name: "ClaimGuard Pro", logo: { "@type": "ImageObject", url: "https://claimguardpro.com/logo.png" } },
    },
    {
      "@type": "Article",
      headline: "10 Critical Documents You Need for Your Mass Tort Claim",
      description: "A detailed checklist of the essential documents required for mass tort claims, from government ID to physician opinion letters.",
      datePublished: "2025-01-28",
      dateModified: "2025-02-20",
      author: { "@type": "Organization", name: "ClaimGuard Pro" },
      publisher: { "@type": "Organization", name: "ClaimGuard Pro", logo: { "@type": "ImageObject", url: "https://claimguardpro.com/logo.png" } },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#111D33" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Analytics - eslint-disable-next-line @next/next/next-script-for-ga */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX', { anonymize_ip: true });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              duration: 4000,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
