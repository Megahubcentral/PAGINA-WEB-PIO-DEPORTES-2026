import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      { source: "/categoria/tenis", destination: "/categoria/tennis", permanent: true },
      { source: "/categoria/fiba", destination: "/categoria/baloncesto-fiba", permanent: true },
      { source: "/categoria/f1", destination: "/categoria/formula-1", permanent: true },
      { source: "/categoria/formula1", destination: "/categoria/formula-1", permanent: true },
      { source: "/categoria/moto-gp", destination: "/categoria/motogp", permanent: true },
      { source: "/categoria/motor", destination: "/categoria/automovilismo", permanent: true },
      { source: "/categoria/beisbol-del-caribe", destination: "/categoria/beisbol-latino", permanent: true },
    ];
  },
  async rewrites() {
    return [
      { source: "/sitemap-noticias-:chunk(\\d+)\\.xml", destination: "/sitemap-noticias/:chunk" },
    ];
  },
};

export default nextConfig;
