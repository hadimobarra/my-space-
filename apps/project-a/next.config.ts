import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/project-a",
  assetPrefix: "/project-a",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
