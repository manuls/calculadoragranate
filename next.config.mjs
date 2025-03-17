/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.resfu.com', 'example.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
}

export default nextConfig

