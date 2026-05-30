import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'campusskill-hub.s3.amazonaws.com'],
  },
  output: 'standalone',
};

export default nextConfig;
