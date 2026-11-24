import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: {
    // Two root layouts (English and Persian) need a 404 page of their own.
    globalNotFound: true,
  },
};

export default nextConfig;
