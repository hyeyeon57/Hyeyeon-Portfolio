'use client';

import React, { useEffect, useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

export function AccessGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'granted' | 'blocked'>('loading');
  const [privateMessage, setPrivateMessage] = useState(
    '현재 비공개 모드입니다. 접근 권한이 있는 이메일로 인증 후 열람하실 수 있습니다.'
  );
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkAccess() {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get('access');

        if (urlToken) {
          const verifyRes = await fetch('/api/access', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: urlToken }),
          });
          const verifyJson = await verifyRes.json();
          if (active && verifyRes.ok && verifyJson?.hasAccess) {
            // URL에서 access 쿼리 정리
            params.delete('access');
            const cleanUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}${window.location.hash}`;
            window.history.replaceState({}, '', cleanUrl);
            setStatus('granted');
            return;
          }
        }

        const res = await fetch('/api/access', { cache: 'no-store' });
        const json = await res.json();
        if (!active) return;

        if (json?.privateMessage) {
          setPrivateMessage(json.privateMessage);
        }
        if (json?.mode === 'private' && !json?.hasAccess) {
          setStatus('blocked');
        } else {
          setStatus('granted');
        }
      } catch {
        if (active) setStatus('granted');
      }
    }

    checkAccess();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('이메일 주소를 입력해주세요.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const json = await res.json();
      if (res.ok && json?.hasAccess) {
        setStatus('granted');
      } else {
        setError(json?.message || '접근 권한이 없는 이메일입니다.');
      }
    } catch {
      setError('인증 요청 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#1B365D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === 'blocked') {
    return (
      <div className="min-h-screen bg-[#F2F5F9] flex items-center justify-center px-5">
        <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-xl p-8 sm:p-10 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-11 h-11 rounded-full bg-[#EDF2F8] text-[#1B365D] flex items-center justify-center mx-auto mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#1B365D] mb-2">
              PRIVATE PORTFOLIO
            </p>
            <h1 className="font-serif text-3xl text-[#111111] mb-3">Jang hyeyeon</h1>
            <p className="text-sm text-[#64748B] leading-relaxed break-keep">
              {privateMessage}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                허용된 이메일 주소
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full px-4 py-3 text-sm border border-[#CBD5E1] rounded-lg bg-white text-[#1E293B] focus:outline-none focus:border-[#1B365D]"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-[#1B365D] hover:bg-[#132846] text-white text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{submitting ? '확인 중...' : '접근 인증하기'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[11px] text-center text-[#94A3B8] mt-6">
            접근 권한이 필요하시면 관리자에게 공유 링크 또는 이메일 등록을 요청해주세요.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
