import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "newsroom.eclipse.org",
        pathname: "/**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Configure webpack to handle @asciidoctor/core's dynamic requires
    // This is necessary for Next.js 16 compatibility
    if (isServer) {
      config.externals.push("@asciidoctor/core");
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: "/:locale/sponsors",
        destination: "/:locale/sustainers",
        permanent: true,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
