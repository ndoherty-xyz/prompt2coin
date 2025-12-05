import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [new URL("https://zora-gen-cdn.up.railway.app/**")],
  },

  // Needed for a wallet connect issue
  // https://github.com/vercel/next.js/issues/86099
  // https://github.com/pinojs/thread-stream/issues/183
  // https://github.com/WalletConnect/walletconnect-monorepo/issues/7080
  serverExternalPackages: ["pino", "pino-pretty", "thread-stream"],
};

export default nextConfig;
