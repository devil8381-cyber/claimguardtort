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
  },
  twitter: {
    card: "summary_large_image",
    title: "ClaimGuard Pro — Mass Tort Claims Assistance",
    description:
      "Track your claim, get expert guidance, and maximize your compensation.",
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
      priceRange: "Free tracking; contingency for services",
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
              priceComponentType: "https://schema.org/ContingentPrice",
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
          name: "How much does ClaimGuard Pro charge?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "ClaimGuard Pro provides initial claim tracking, status checks, and eligibility assessments completely free of charge. For document correction and personalized support, we work on a contingency basis — you only pay if your claim is successful.",
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
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
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
