import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {}, // ✅ Replace `loaders` with `rules`
    },
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false, // ✅ Prevents Webpack from bundling `fs`
    };
    return config;
  },
};

export default nextConfig;
