import { analyticsRewrites } from '@ascr/analytics/server';

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return analyticsRewrites();
  },
}

export default nextConfig
