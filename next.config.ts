import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "197.243.0.108",
        port: "5003",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
