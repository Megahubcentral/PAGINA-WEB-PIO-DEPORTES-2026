import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      { source: "/categoria/tenis", destination: "/categoria/tennis", permanent: true },
    ];
  },
};

export default nextConfig;
