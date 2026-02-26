import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "zwroadjmnejlrxmvghlz.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/en/sell/new',
        destination: '/en/sell-my-car',
        permanent: true,
      },
      {
        source: '/en/sell',
        destination: '/en/seller/listings',
        permanent: true,
      },
      {
        source: '/en/buy',
        destination: '/en/cars',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
