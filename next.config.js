const withNextIntl = require("next-intl/plugin")("./i18n.js")

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.resfu.com',
      },
      {
        protocol: 'https',
        hostname: 'tmssl.akamaized.net',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = withNextIntl(nextConfig)
