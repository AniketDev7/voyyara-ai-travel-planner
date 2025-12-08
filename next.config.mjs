/** @type {import('next').NextConfig} */
const nextConfig = {
  // Generate a unique build ID based on timestamp
  generateBuildId: async () => `build-${Date.now()}`,
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

