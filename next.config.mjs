/** @type {import('next').NextConfig} */
const nextConfig = {
  // Return null to let Next.js auto-generate the build ID using nanoid
  generateBuildId: async () => null,
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

