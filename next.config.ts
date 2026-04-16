import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  serverExternalPackages: ['nodemailer'],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
