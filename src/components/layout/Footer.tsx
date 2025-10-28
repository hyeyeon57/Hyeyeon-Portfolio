'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { personalInfo } from '@/data/portfolio';

export const Footer: React.FC = () => {
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 상태 설정
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-white border-t border-line-light">
      {/* 마무리 메시지 섹션 */}
      <div className="max-w-container mx-auto px-6 md:px-container-x" style={{ paddingTop: '12rem', paddingBottom: '24rem' }}>
        <div className="text-center max-w-3xl mx-auto">
          {/* Thank You 배지 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-block px-6 py-3 bg-brand-main/5 rounded-full border border-brand-main/20 mb-6">
              <p className="text-sm font-medium text-brand-main">Thank You</p>
            </div>
          </motion.div>

          {/* 첫 번째 텍스트 - 한 줄씩 */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-4xl font-light text-text-main mb-6 leading-relaxed"
          >
            끝까지 제 포트폴리오를 봐주셔서 감사합니다.
          </motion.h2>

          {/* 두 번째 텍스트 */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl text-text-sub font-light leading-relaxed mb-8"
          >
            이 길의 끝에서, 저의 새로운 출발을 함께할 수 있길 바랍니다.
          </motion.p>
          
          {/* 장식 라인 */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="w-24 h-px bg-gradient-to-r from-transparent via-brand-main to-transparent mx-auto"
          />
        </div>
      </div>

      {/* Footer 영역 */}
      <div className="border-t border-line-medium bg-bg-light">
        <div className="max-w-container mx-auto px-6 md:px-container-x py-12">
          {/* Footer 상단 */}
          <div className="mb-8">
            <div className="max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-light text-text-main mb-3">
                {personalInfo.name}
              </h3>
              <p className="text-base text-text-sub leading-relaxed">
                문제 속에서도 길을 찾아 해결하는<br />
                내비게이션 같은 기획자 {personalInfo.name}입니다.
              </p>
            </div>
          </div>

          {/* 구분선 */}
          <div className="h-px bg-line-medium mb-8" />

          {/* Footer 하단 */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-text-secondary">
              © 2025 {personalInfo.name}. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-text-secondary hover:text-brand-main transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-text-secondary hover:text-brand-main transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-text-secondary hover:text-brand-main transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Button (Top/Bottom) */}
      <motion.button
        onClick={isAtTop ? scrollToBottom : scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-brand-main text-white rounded-full flex items-center justify-center hover:opacity-90 transition-all duration-300 z-50 shadow-lg"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: isAtTop ? 5 : -5 }}
        whileTap={{ scale: 0.9 }}
        title={isAtTop ? '하단으로 이동' : '상단으로 이동'}
      >
        {isAtTop ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
      </motion.button>
    </footer>
  );
};
