/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Chrome으로 자동 열기 설정
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // /admin 경로를 Next.js 라우팅에서 제외하고 API로 전달
  async rewrites() {
    return [
      // /admin 경로는 Next.js가 처리하지 않고 서버리스 함수로 전달
      {
        source: '/admin/:path*',
        destination: '/api/index',
      },
      {
        source: '/bo-api/:path*',
        destination: '/api/index',
      },
    ];
  },
};

export default nextConfig;
