const withNextIntl = require("next-intl/plugin")("./i18n.js")

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.resfu.com', 'tmssl.akamaized.net', 'example.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = withNextIntl(nextConfig)
