import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'campusskill-hub.s3.amazonaws.com' },
    ],
  },
  output: 'standalone',
};

export default nextConfig;
