import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [new URL("https://zora-gen-cdn.up.railway.app/**")],
  },
};

export default nextConfig;
