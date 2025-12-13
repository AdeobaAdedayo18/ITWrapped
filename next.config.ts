import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all HTTPS hostnames for company logos
      },
      {
        protocol: "http",
        hostname: "**", // Allow all HTTP hostnames for company logos
      },
    ],
  },
};

export default nextConfig;
