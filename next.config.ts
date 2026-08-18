import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      { source: "/categoria/tenis", destination: "/categoria/tennis", permanent: true },
    ];
  },
};

export default nextConfig;
