import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Recharts is CommonJS-heavy; transpiling avoids intermittent runtime `__webpack_modules__[id] is not a function`. */
  transpilePackages: ["recharts"],

  /**
   * Avoid intermittent production build failures (e.g. MODULE_NOT_FOUND for
   * `.next/server/chunks/611.js` while loading `pages/_document`) on some
   * machines where the default webpack build worker races chunk emission.
   */
  experimental: {
    webpackBuildWorker: false,
    staticGenerationMaxConcurrency: 1,
  },
};

export default nextConfig;
