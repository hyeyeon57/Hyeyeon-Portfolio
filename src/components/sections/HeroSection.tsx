'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { personalInfo } from '@/data/portfolio';

interface HeroSectionProps {
  theme?: 'light' | 'dark';
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  const ref = useRef(null);

  return (
    <section 
      ref={ref}
      id="home" 
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: `
          radial-gradient(45% 40% at 75% 15%, rgba(252,235,255,0.12) 0%, rgba(252,235,255,0) 65%),
          radial-gradient(50% 45% at 85% 60%, rgba(231,240,255,0.10) 0%, rgba(231,240,255,0) 65%),
          radial-gradient(40% 40% at 20% 80%, rgba(243,233,255,0.12) 0%, rgba(243,233,255,0) 60%),
          radial-gradient(35% 35% at 50% 50%, rgba(240,242,255,0.08) 0%, rgba(240,242,255,0) 70%),
          radial-gradient(30% 35% at 10% 50%, rgba(122,104,246,0.08) 0%, rgba(122,104,246,0) 65%),
          linear-gradient(135deg, #ECE9FF 0%, #FFFFFF 48%, #F7F7FF 100%)
        `
      }}
    >

      <div className="max-w-container mx-auto px-6 md:px-container-x relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* 텍스트 콘텐츠 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            {/* 질문 */}
            <motion.h2
              className="text-lg md:text-xl font-light mb-8 leading-tight tracking-tight text-text-main"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              장혜연은 어떤 기획자인가?
            </motion.h2>

            {/* 자기소개 */}
            <motion.p
              className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed max-w-2xl mb-12 text-text-sub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              막다른 길에서도 또 다른 경로를 찾아내는<br />
              <span className="font-bold">내비게이션 같은 기획자</span>입니다.
            </motion.p>

            {/* CTA 버튼 */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <a
                href={personalInfo.resumeUrl}
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-light text-white bg-brand-main hover:opacity-90 transition-all duration-300"
              >
                이력서 다운로드
              </a>
              <a
                href={personalInfo.coverLetterUrl}
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-light text-brand-main bg-transparent hover:bg-brand-main/5 transition-all duration-300 border border-brand-main/30 hover:border-brand-main"
              >
                자기소개서 다운로드
              </a>
            </motion.div>
          </motion.div>

          {/* 우측 자동차 애니메이션 */}
          <motion.div
            className="hidden lg:flex items-center justify-center relative h-[400px] w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* 자동차 SVG - 심플한 아이콘 스타일 (먼저 렌더링) */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              viewBox="0 0 500 400"
              preserveAspectRatio="xMidYMid meet"
              style={{ zIndex: 2 }}
            >
              <defs>
                <filter id="carShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                  <feOffset dx="0" dy="2" result="offsetblur"/>
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.25"/>
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <g filter="url(#carShadow)">
                {/* 심플한 자동차 아이콘 - 원근감 적용 */}
                <g transform="translate(-60, -36)">
                  <g>
                    {/* 자동차 몸체 - 심플한 형태 */}
                    <rect x="5" y="15" width="30" height="12" rx="2" fill="#7A68F6"/>
                    
                    {/* 자동차 지붕 */}
                    <path
                      d="M 12 15 L 15 8 L 25 8 L 28 15 Z"
                      fill="#7A68F6"
                    />
                    
                    {/* 창문 */}
                    <rect x="16" y="10" width="8" height="5" rx="1" fill="rgba(255,255,255,0.3)"/>
                    
                    {/* 바퀴 */}
                    <circle cx="12" cy="27" r="3.5" fill="#5A4ED6"/>
                    <circle cx="12" cy="27" r="2" fill="#FFFFFF" opacity="0.3"/>
                    <circle cx="28" cy="27" r="3.5" fill="#5A4ED6"/>
                    <circle cx="28" cy="27" r="2" fill="#FFFFFF" opacity="0.3"/>
                    
                    {/* 헤드라이트 */}
                    <circle cx="34" cy="20" r="1.5" fill="#FFFFFF" opacity="0.8"/>
                    
                    {/* 크기 애니메이션 (원근감) */}
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      values="3;1.5;1.5"
                      keyTimes="0;1;1"
                      dur="4s"
                      repeatCount="indefinite"
                      additive="sum"
                    />
                  </g>
                </g>
                
                {/* 애니메이션 모션 */}
                <animateMotion
                  dur="4s"
                  repeatCount="indefinite"
                  path="M 50 350 Q 150 250, 250 200 T 450 100"
                  rotate="auto"
                />
              </g>
              
              <path id="carPath" d="M 50 350 Q 150 250, 250 200 T 450 100" fill="none" />
            </svg>

            {/* 길 SVG 경로 - 자동차가 지나간 자리에만 생김 (뒤에 렌더링) */}
            <svg 
              className="absolute inset-0 w-full h-full" 
              viewBox="0 0 500 400"
              preserveAspectRatio="xMidYMid meet"
              style={{ zIndex: 1 }}
            >
              {/* 길 그리기 (자동차가 지나간 자리만 표시) */}
              <path
                d="M 50 350 Q 150 250, 250 200 T 450 100"
                fill="none"
                stroke="#7A68F6"
                strokeWidth="8"
                strokeLinecap="round"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset="1"
                style={{ opacity: 0.3 }}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="1;0;1"
                  keyTimes="0;1;1"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>

            {/* 장식용 점들 */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-brand-main"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute top-1/2 right-1/3 w-2 h-2 rounded-full bg-brand-main"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            <motion.div
              className="absolute bottom-1/4 left-1/2 w-2.5 h-2.5 rounded-full bg-brand-main"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="text-xs font-light text-text-secondary">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-text-secondary" />
        </motion.div>
      </motion.div>
    </section>
  );
};
