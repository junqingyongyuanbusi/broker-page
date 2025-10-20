/** @type {import('next').NextConfig} */
const nextConfig = {
  // 图片优化配置
  images: {
    domains: ['supabase.co', 'localhost'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 开启SWC编译器
  swcMinify: true,

  // 压缩
  compress: true,

  // 生产环境优化
  productionBrowserSourceMaps: false,

  // 实验性功能
  experimental: {
    optimizeCss: true,
  },

  // 重定向旧URL
  async redirects() {
    return [
      {
        source: '/broker/:slug',
        destination: '/brokers/:slug',
        permanent: true,
      },
    ];
  },

  // 自定义headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;