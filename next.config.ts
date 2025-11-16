import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Temporarily remove output: 'export' for development
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // RTL support will be handled in the app
  // i18n configuration is removed as it's not compatible with static export
};

export default nextConfig;
