import type { NextConfig } from "next";

const defaultApiUrl =
  process.env.NODE_ENV === "production"
    ? "https://app.jpengineering.com.np/api/v1"
    : "http://127.0.0.1:8000/api/v1";

const rawApiUrl =
  process.env.INTERNAL_BACKEND_API_URL ||
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  defaultApiUrl;

// Remove trailing /api/v1 or /api to obtain the backend base origin (e.g. https://app.jpengineering.com.np)
const backendOrigin =
  rawApiUrl.replace(/\/api(\/v1)?\/?$/, "") ||
  (process.env.NODE_ENV === "production"
    ? "https://app.jpengineering.com.np"
    : "http://127.0.0.1:8000");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "app.jpengineering.com.np",
      },
      {
        protocol: "https",
        hostname: "*.jpengineering.com.np",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/services/:path*",
        destination: "/products",
        permanent: false,
      },
      {
        source: "/projects/:path*",
        destination: "/products",
        permanent: false,
      },
      {
        source: "/gallery/:path*",
        destination: "/products",
        permanent: false,
      },
      {
        source: "/blog/:path*",
        destination: "/about/introduction",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
