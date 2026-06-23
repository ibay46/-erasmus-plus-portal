import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["jsdom", "isomorphic-dompurify"],
};

export default nextConfig;
