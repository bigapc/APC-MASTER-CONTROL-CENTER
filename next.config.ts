import type { NextConfig } from "next";

const SECURITY_HEADERS = [
  // Prevent browsers from sniffing MIME types
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Block framing from other origins (clickjacking protection)
  { key: "X-Frame-Options", value: "DENY" },
  // Stop leaking referrer to external sites
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restrict browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // HSTS — only relevant in production (Vercel enforces HTTPS)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Keep Turbopack scoped to this app even when parent directories have lockfiles.
  turbopack: {
    root: process.cwd(),
  },

  // Apply security headers to every route
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
    ];
  },

  // Remove the X-Powered-By header (don't advertise framework version)
  poweredByHeader: false,

  // Strict mode catches React lifecycle issues early
  reactStrictMode: true,
};

export default nextConfig;
