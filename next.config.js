/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;
