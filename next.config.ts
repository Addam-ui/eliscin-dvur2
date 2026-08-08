import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Bez tohohle si Next kvůli cizímu package-lock.json výš ve stromu
  // vybere špatný kořen projektu a do buildu zabalí nesmysly.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
