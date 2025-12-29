import type { NextConfig } from "next";

// Validate env vars at build time by importing the env module
import "./src/env";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
