import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow local images from /images/uploads/ that are added dynamically after build
    remotePatterns: [
      {
        protocol: "https",
        hostname: "linguagerman.com",
      },
    ],
  },
};

export default nextConfig;
