import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Remove deprecated turbo config
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  webpack: config => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  images: {
    domains: ["localhost", "ik.imagekit.io"],
  },
};

export default nextConfig;
