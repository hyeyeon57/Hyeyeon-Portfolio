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
  // _admin 폴더를 빌드에서 완전히 제외
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // rewrites가 작동하도록 Next.js 라우팅 우선순위 낮춤
  async rewrites() {
    return [
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
