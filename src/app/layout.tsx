import type { Metadata } from "next";
import Script from "next/script";
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
  metadataBase: new URL('https://claimguardtort.com'),
  alternates: {
    canonical: '/',
  },
  title: "ClaimGuard Tort — Fighting for Every Dollar You Deserve",
  description:
    "ClaimGuard Tort helps claimants in mass tort class action lawsuits track their claims, correct documentation issues, and maximize their compensation. Free consultation available.",
  keywords: [
    "mass tort",
    "class action",
    "claim tracking",
    "claim assistance",
    "legal help",
    "compensation",
    "ClaimGuard Tort",
    "Camp Lejeune",
    "Roundup lawsuit",
    "talcum powder claim",
    "hernia mesh",
    "paraquat",
    "firefighting foam",
  ],
  authors: [{ name: "ClaimGuard Tort" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "ClaimGuard Tort — Mass Tort Claims Assistance",
    description:
      "Don't let your claim get lost in the system. Track your claim, get expert guidance, and maximize your compensation.",
    type: "website",
    siteName: "ClaimGuard Tort",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ClaimGuard Tort — Free Mass Tort Claims Assistance" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClaimGuard Tort — Mass Tort Claims Assistance",
    description:
      "Track your claim, get expert guidance, and maximize your compensation.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0F172A" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
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
        <div id="sr-announcer" className="sr-only" aria-live="polite" />
      </body>
    </html>
  );
}
