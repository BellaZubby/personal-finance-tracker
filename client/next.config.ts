import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // for cloudinary
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
