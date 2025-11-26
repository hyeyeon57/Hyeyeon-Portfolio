'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 백오피스 서버 URL 설정
      // 별도 프로젝트로 배포된 경우 백엔드 URL 사용
      const getBackofficeUrl = () => {
        // 클라이언트 사이드에서는 NEXT_PUBLIC_ 접두사가 붙은 환경 변수만 접근 가능
        // 빌드 타임에 주입되므로 런타임에 확인
        if (typeof window !== 'undefined') {
          // 환경 변수는 빌드 타임에 주입되므로 직접 확인 불가
          // 대신 호스트명으로 판단
          const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
          
          if (isLocalhost) {
            return 'http://localhost:3005';
          }
          
          // 프로덕션: 별도 프로젝트로 배포된 경우 백엔드 URL 사용
          // 프론트엔드: hyeyeon-portfolio.vercel.app
          // 백엔드: hyeyeon-portfolio-admin.vercel.app
          return 'https://hyeyeon-portfolio-admin.vercel.app';
        }
        
        // 서버 사이드 렌더링 시
        if (process.env.NEXT_PUBLIC_BACKOFFICE_URL) {
          return process.env.NEXT_PUBLIC_BACKOFFICE_URL;
        }
        
        if (process.env.NODE_ENV === 'production') {
          return 'https://hyeyeon-portfolio-admin.vercel.app';
        }
        
        return 'http://localhost:3005';
      };

      const backofficeUrl = getBackofficeUrl();
      // 백오피스 API는 /bo-api/* 경로로 분리됨 (Next.js /api와 충돌 방지)
      const fetchUrl = `${backofficeUrl}/bo-api/auth/login`;
      
      console.log('🔐 로그인 요청 시작:', {
        backofficeUrl,
        fetchUrl,
        username,
        password: password ? '***' : '없음',
        hostname: typeof window !== 'undefined' ? window.location.hostname : 'server'
      });

      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      
      console.log('📡 응답 받음:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      // 응답 상태 확인
      if (!response.ok) {
        console.error('❌ 응답 오류:', {
          status: response.status,
          statusText: response.statusText,
          url: fetchUrl
        });
        
        if (response.status === 401) {
          const result = await response.json().catch((e) => {
            console.error('JSON 파싱 오류:', e);
            return { error: '아이디 또는 비밀번호가 올바르지 않습니다.' };
          });
          console.error('❌ 인증 실패:', result);
          setError(result.error || '아이디 또는 비밀번호가 올바르지 않습니다.');
          return;
        }
        
        if (response.status === 404) {
          setError('백엔드 서버를 찾을 수 없습니다. 환경 변수를 확인해주세요.');
          console.error('❌ 백엔드 서버 연결 실패:', fetchUrl);
          return;
        }
        
        const errorText = await response.text().catch(() => '알 수 없는 오류');
        console.error('❌ HTTP 오류:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json().catch((e) => {
        console.error('❌ JSON 파싱 오류:', e);
        throw new Error('서버 응답을 파싱할 수 없습니다.');
      });
      
      console.log('✅ 응답 데이터:', result);

      if (result.success) {
        console.log('✅ 로그인 성공');
        // 로그인 성공 - 백엔드 관리자 페이지로 리다이렉트
        const adminUrl = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
          ? 'http://localhost:3005/admin'
          : 'https://hyeyeon-portfolio-admin.vercel.app/admin';
        
        console.log('🔄 리다이렉트:', adminUrl);
        window.location.href = adminUrl;
      } else {
        setError(result.error || '아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (error: any) {
      console.error('❌ 로그인 오류:', error);
      setError(error.message || '로그인 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">관리자 로그인</h1>
            <p className="text-gray-500">포트폴리오 관리 시스템</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">아이디</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="아이디를 입력하세요"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-12"
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  로그인 중...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  로그인
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              포트폴리오로 돌아가기
            </a>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 Jang Haeyeon Portfolio</p>
        </div>
      </div>
    </div>
  );
}

