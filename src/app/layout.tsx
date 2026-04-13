import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
