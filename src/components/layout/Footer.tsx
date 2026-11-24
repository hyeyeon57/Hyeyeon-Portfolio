'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { personalInfo } from '@/data/portfolio';

export const Footer: React.FC = () => {
  const [isAtTop, setIsAtTop] = useState(true);
  const pathname = usePathname();
  const [policyModal, setPolicyModal] = useState<null | 'privacy' | 'cookie'>(null);

  useEffect(() => {
    const handleScroll = () => setIsAtTop(window.scrollY < 100);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToBottom = () =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });

  const closePolicyModal = () => setPolicyModal(null);

  const renderPolicyContent = () => {
    if (policyModal === 'privacy') {
      return (
        <div className="space-y-2 text-sm leading-relaxed text-text-secondary">
          <h3 className="text-xl font-semibold text-text-main mb-2">Privacy Policy</h3>
          <ul className="space-y-1 list-disc list-inside">
            <li>본 웹사이트는 개인 식별이 불가능한 형태의 방문 통계 데이터를 수집합니다.</li>
            <li>수집된 정보는 서비스 품질 개선 및 내부 분석 목적으로만 사용되며, 공개되지 않습니다.</li>
          </ul>
          <div className="font-semibold text-text-main pt-1">1. 수집하는 정보</div>
          <ul className="space-y-1 list-disc list-inside">
            <li>익명 식별값(visitorId: UUID)</li>
            <li>접속 로그(IP 주소, 브라우저(User-Agent) 정보, 방문 시간, 방문 경로 등)</li>
          </ul>
          <div className="font-semibold text-text-main pt-1">2. 수집 목적</div>
          <ul className="space-y-1 list-disc list-inside">
            <li>방문자 수 분석 및 서비스 품질 개선</li>
            <li>오류 분석 및 보안 유지</li>
            <li>내부 관리용 통계 확인</li>
          </ul>
          <div className="font-semibold text-text-main pt-1">3. 사용 및 제공 범위</div>
          <ul className="space-y-1 list-disc list-inside">
            <li>개인 식별 목적에 사용하지 않습니다.</li>
            <li>내부 분석용으로만 사용되며 외부에 공개되지 않습니다.</li>
            <li>제3자에게 판매하거나 마케팅 목적으로 제공하지 않습니다.</li>
          </ul>
          <div className="font-semibold text-text-main pt-1">4. 보관 기간</div>
          <p>목적 범위 내에서 보관하며, 목적 달성 후 삭제될 수 있습니다.</p>
          <div className="font-semibold text-text-main pt-1">5. 사용자 권리</div>
          <p>로그 수집에 대한 문의 및 삭제 요청이 가능하며, 가능한 범위 내에서 처리합니다.</p>
          <div className="font-semibold text-text-main pt-1">6. 보안 조치</div>
          <p>외부 공유 없이 안전하게 저장·관리합니다.</p>
          <div className="font-semibold text-text-main pt-1">7. 정책 변경</div>
          <p>서비스 운영/법령 변경 시 본 페이지에 공지합니다. 최종 업데이트: 2025-12-10</p>
        </div>
      );
    }

    if (policyModal === 'cookie') {
      return (
        <div className="space-y-2 text-sm leading-relaxed text-text-secondary">
          <h3 className="text-xl font-semibold text-text-main mb-2">Cookie Policy</h3>
          <p>방문자 수 통계를 위해 익명 식별값(visitorId)을 쿠키 또는 로컬스토리지에 저장합니다.</p>
          <div className="font-semibold text-text-main pt-1">1. 저장되는 정보</div>
          <ul className="space-y-1 list-disc list-inside">
            <li>익명 방문자 식별값(visitorId: UUID)</li>
            <li>쿠키 또는 로컬스토리지 기록</li>
          </ul>
          <div className="font-semibold text-text-main pt-1">2. 사용 목적</div>
          <ul className="space-y-1 list-disc list-inside">
            <li>반복 방문 여부 확인</li>
            <li>방문자 수 통계 분석</li>
            <li>서비스 개선 및 내부 분석</li>
          </ul>
          <div className="font-semibold text-text-main pt-1">3. 사용하지 않는 목적</div>
          <ul className="space-y-1 list-disc list-inside">
            <li>광고 및 맞춤 추천</li>
            <li>개인 식별 또는 행동 추적</li>
            <li>제3자 제공 또는 판매</li>
          </ul>
          <div className="font-semibold text-text-main pt-1">4. 차단 방법</div>
          <p>브라우저 설정에서 쿠키/로컬스토리지 저장을 제한하거나 삭제할 수 있습니다. 차단 시 통계 정확도가 저하될 수 있습니다.</p>
          <div className="font-semibold text-text-main pt-1">5. 정책 변경</div>
          <p>쿠키 사용 목적 변경 시 본 페이지에 고지합니다. 최종 업데이트: 2025-12-10</p>
        </div>
      );
    }
    return null;
  };

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="relative bg-[#050505] text-white">
      <div className="max-w-container mx-auto px-5 sm:px-8 lg:px-[60px] pt-12 sm:pt-14 pb-10">
        {/* top columns */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-[120px] xl:gap-[205px] pb-10">
          <div>
            <p className="text-[15px] font-bold tracking-[-0.02em] text-white mb-4">
              Jang Haeyeon
            </p>
            <p className="text-base text-[#CCCCCC]">
              2026 Jang Haeyeon Portfolio All rights reserved.
            </p>
          </div>

          <div>
            <p className="text-[15px] font-bold tracking-[-0.02em] text-white mb-4">SNS</p>
            <div className="flex flex-wrap gap-5 text-base text-[#CCCCCC]">
              <a href={`mailto:${personalInfo.email}`} className="hover:text-white transition-colors">
                Email
              </a>
              <a
                href={personalInfo.social.brunch}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Instagram
              </a>
              <a
                href={personalInfo.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Linkedln
              </a>
            </div>
          </div>

          <div>
            <p className="text-[15px] font-bold tracking-[-0.02em] text-white mb-4">Admin</p>
            <div className="flex flex-wrap gap-5 text-base text-[#CCCCCC]">
              <a
                href="/admin/viewer"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white transition-colors"
              >
                Admin Viewer
              </a>
              <a
                href="/admin/login"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white transition-colors"
              >
                Admin Login
              </a>
              <button
                onClick={() => setPolicyModal('privacy')}
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setPolicyModal('cookie')}
                className="hover:text-white transition-colors"
              >
                Cookie Policy
              </button>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-[#555555]" />

        {/* bottom brand + contact */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 pt-10 pb-4">
          <span className="font-serif-display text-[clamp(2.5rem,5vw,64px)] leading-none text-white">
            hY Porfolio
          </span>

          <div className="md:text-right">
            <p className="text-2xl font-bold tracking-[-0.02em] text-white mb-2">
              {personalInfo.phone}
            </p>
            <div className="flex flex-wrap md:justify-end gap-4 text-base tracking-[-0.025em] text-[#CCCCCC]">
              <a href={`mailto:${personalInfo.email}`} className="hover:text-white transition-colors">
                {personalInfo.email}
              </a>
              <Link href="/#contact" className="underline hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      <motion.button
        onClick={isAtTop ? scrollToBottom : scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-white text-text-main rounded-full border border-[#E5E5EC] flex items-center justify-center hover:bg-text-main hover:text-white transition-colors duration-300 z-50 shadow-lg"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: isAtTop ? 4 : -4 }}
        whileTap={{ scale: 0.9 }}
        title={isAtTop ? '하단으로 이동' : '상단으로 이동'}
      >
        <ArrowUp className={`w-5 h-5 transition-transform ${isAtTop ? 'rotate-180' : ''}`} />
      </motion.button>

      {policyModal && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative max-h-[85vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={closePolicyModal}
              className="absolute top-4 right-4 text-text-secondary hover:text-text-main"
              aria-label="Close"
            >
              ✕
            </button>
            {renderPolicyContent()}
          </div>
        </div>
      )}
    </footer>
  );
};
