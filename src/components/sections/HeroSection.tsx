'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileDown, FileText, ChevronDown, Navigation } from 'lucide-react';
import { personalInfo } from '@/data/portfolio';

export const HeroSection: React.FC = () => {
  return (
    <section id="home" className="relative py-20 lg:py-32 overflow-hidden bg-dark-bg">
      {/* 네비게이션 라인 애니메이션 배경 */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#FFC700" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFD700" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {/* 지도 노선처럼 흐르는 라인들 */}
          <motion.path
            d="M 0 200 Q 200 100 400 200 T 800 200 Q 1000 300 1200 200"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.path
            d="M 0 400 Q 300 300 600 400 T 1200 400"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, delay: 0.3, ease: "easeInOut" }}
          />
          <motion.path
            d="M 0 600 Q 250 500 500 600 T 1000 600 Q 1100 650 1200 600"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, delay: 0.6, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <div className="max-w-container mx-auto px-container-x relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[600px]">
          {/* 텍스트 콘텐츠 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* 메인 문구 */}
            <motion.h1
              className="text-xl md:text-2xl lg:text-3xl font-normal text-white mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              문제 속에서도 길을 찾아 해결하는,
              <br />
              <span className="font-bold text-point-yellow">네비게이션 같은 기획자</span> <span className="text-point-yellow">{personalInfo.name}</span>입니다.
            </motion.h1>

            {/* 서브 문구 */}
            <motion.p
              className="text-lg md:text-xl text-text-secondary mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {personalInfo.description}
            </motion.p>

            {/* 다운로드 버튼들 */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-35 mt-32"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <a
                href={personalInfo.resumeUrl}
                className="group relative inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-point-yellow to-point-yellow-dark text-dark-bg rounded-2xl font-semibold hover:from-point-yellow-light hover:to-point-yellow transition-all duration-300 shadow-lg hover:shadow-glow-yellow-lg transform hover:-translate-y-1"
              >
                <FileDown className="w-4 h-4" />
                <span>이력서 다운로드</span>
              </a>
              <a
                href={personalInfo.coverLetterUrl}
                className="group relative inline-flex items-center justify-center gap-3 px-6 py-3 bg-dark-surface border border-point-yellow/30 text-white rounded-2xl font-semibold hover:border-point-yellow hover:text-point-yellow hover:bg-point-yellow/10 transition-all duration-300 backdrop-blur-sm"
              >
                <FileText className="w-4 h-4" />
                <span>자기소개서 다운로드</span>
              </a>
            </motion.div>
          </motion.div>

          {/* 네비게이션 아이콘 또는 인물 사진 영역 */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              {/* 배경 그라데이션 원 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-point-yellow/20 via-point-yellow-dark/10 to-transparent rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* 메인 컨테이너 */}
              <motion.div
                className="relative w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-dark-surface via-dark-bg to-dark-surface rounded-3xl flex items-center justify-center border border-point-yellow/30 shadow-2xl backdrop-blur-sm"
                animate={{
                  rotateY: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(18, 18, 18, 0.9) 50%, rgba(30, 30, 30, 0.8) 100%)',
                  boxShadow: '0 0 60px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)'
                }}
              >
                {/* 내부 네비게이션 아이콘 */}
                <div className="relative">
                  <Navigation className="w-40 h-40 md:w-48 md:h-48 text-point-yellow" strokeWidth={1.2} />
                  
                  {/* 아이콘 주변 글로우 */}
                  <motion.div
                    className="absolute inset-0 bg-point-yellow/20 rounded-full blur-xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </motion.div>

              {/* 회전하는 장식 원들 */}
              <motion.div
                className="absolute inset-0 border border-point-yellow/20 rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <motion.div
                className="absolute inset-4 border border-dashed border-point-yellow/15 rounded-full"
                animate={{ rotate: -360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              
              {/* 플로팅 포인트들 */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-point-yellow rounded-full"
                  style={{
                    left: `${20 + (i * 12)}%`,
                    top: `${15 + (i * 8)}%`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 2 + (i * 0.3),
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll to Explore */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-text-secondary text-sm font-medium">Scroll to Explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6 text-point-yellow" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
