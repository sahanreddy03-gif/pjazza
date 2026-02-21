import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/", destination: "/pjazza", permanent: false }];
  },
};

export default nextConfig;
