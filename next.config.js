import createNextIntlPlugin from "next-intl/plugin";

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "geototal-backend-e6f32f49f836.herokuapp.com",
        pathname: "/geototal/user/image/**",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
