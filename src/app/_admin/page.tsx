'use client';

import { useEffect } from 'react';

export default function AdminDashboardRedirect() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    const targetUrl = isLocalhost
      ? 'http://localhost:3005/admin'
      : 'https://hyeyeon-portfolio-admin.vercel.app/admin';

    window.location.replace(targetUrl);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <p className="text-sm text-gray-500">관리자 대시보드로 이동 중입니다...</p>
        <p className="text-xs text-gray-400">
          잠시만 기다려주세요. 자동으로 이동하지 않으면{' '}
          <a
            href="https://hyeyeon-portfolio-admin.vercel.app/admin"
            className="text-blue-600 hover:underline"
          >
            여기를 클릭
          </a>
          해주세요.
        </p>
      </div>
    </div>
  );
}
