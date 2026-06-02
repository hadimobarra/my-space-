import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/project-b",
  assetPrefix: "/project-b",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
