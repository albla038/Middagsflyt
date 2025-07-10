import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // TODO Switch of in production
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "**/*.(jpg|jpeg|png|gif|svg|webp)",
      },
    ],
  },
};

export default nextConfig;
