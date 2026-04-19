import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:3001';
    return [
      {
        source: '/api/backend/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
