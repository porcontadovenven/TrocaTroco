import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nqetigprgmkvoyxygqty.supabase.co",
      },
    ],
  },
};

export default nextConfig;
