/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.qrserver.com",
        pathname: "/v1/create-qr-code/**",
      },
      {
        protocol: "https",
        hostname: "barcode.tec-it.com",
        pathname: "/barcode.ashx/**",
      },
      {
        protocol: "https",
        hostname: "cms.destinycarehome.org",
        pathname: "/**",
      },
      {
        protocol: "http", // Add protocol for local development
        hostname: "test.localhost",
        pathname: "/**",
      },
      {
        hostname: "",
        pathname: "/**",
      },
    ],
  },
  images: {
    domains: [
      "test.localhost",
      "localhost",
      "cms.destinycarehome.org",
      "api.qrserver.com",
      "barcode.tec-it.com",
      "",
    ], // Add your domain(s) here
  },
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: "/:path*",
      },
    ];
  },
};

export default nextConfig;
