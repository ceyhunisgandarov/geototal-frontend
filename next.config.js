import createNextIntlPlugin from "next-intl/plugin";

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.0.114",
        port: "8080",
        pathname: "/geototal/user/image/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/geototal/user/image/**",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
