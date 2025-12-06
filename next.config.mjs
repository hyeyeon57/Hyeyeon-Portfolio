/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Windows 파일 잠금 문제 해결을 위한 설정
  webpack: (config, { isServer }) => {
    // Windows에서 파일 잠금 문제 완화
    if (process.platform === 'win32') {
      config.watchOptions = {
        poll: 1500,
        aggregateTimeout: 1000,
        ignored: /node_modules/,
        followSymlinks: false,
      };
    }
    return config;
  },
  reactStrictMode: true,
  // Chrome으로 자동 열기 설정
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // /admin, /bo-api 경로를 Next.js API로 라우팅
  async rewrites() {
    return [
      // /admin, /bo-api 요청은 Express 서버리스 함수로 전달
      {
        source: '/admin/:path*',
        destination: '/api/bo-api/admin/:path*',
      },
      {
        source: '/bo-api/:path*',
        destination: '/api/bo-api/:path*',
      },
      // 템플릿 파일은 public/templates에서 자동 제공됨
    ];
  },
};

export default nextConfig;
