import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // TODO Remove in production
        pathname: "**/*.(jpg|jpeg|png|gif|svg|webp)",
      },
    ],
  },
};

export default nextConfig;
