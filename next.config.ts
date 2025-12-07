import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'eu-images.contentstack.com',
      },
      {
        protocol: 'https',
        hostname: 'images.contentstack.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.contentstack.io',
      },
    ],
  },
};

export default nextConfig;
