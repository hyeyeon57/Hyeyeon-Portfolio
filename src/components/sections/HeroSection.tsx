'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  theme?: 'light' | 'dark';
}

const rise = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};

export const HeroSection: React.FC<HeroSectionProps> = () => {
  return (
    <section
      id="home"
      className="relative w-full min-h-screen bg-bg-black overflow-hidden flex items-center"
    >
      {/* 메인 섹션 배경 이미지 */}
      <img
        src="/images/main-section.jpg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 w-full h-full object-cover object-center select-none"
      />
      {/* 텍스트 가독성 및 하단 자연스러운 연결을 위한 은은한 오버레이 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%)',
        }}
      />

      <div className="relative z-10 w-full px-5 sm:px-8 lg:px-[60px] pt-28 pb-20">
        <div className="max-w-container mx-auto">
          <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl">
            <motion.p
              variants={rise}
              className="text-white text-lg font-medium tracking-[-0.025em] mb-5"
            >
              작은 디테일에서 발견한 가능성
            </motion.p>

            <motion.h1
              variants={rise}
              className="text-white font-normal tracking-[-0.02em] leading-[1.05] text-[clamp(2.4rem,7.2vw,100px)]"
            >
              AN INNOCEAN OF DETAILS
            </motion.h1>
            <motion.div
              variants={rise}
              className="mt-1 sm:mt-0 sm:pl-[min(20vw,308px)] flex flex-wrap items-center gap-5 sm:gap-7"
            >
              <h1 className="text-white font-normal tracking-[-0.02em] leading-[1.05] text-[clamp(2.4rem,7.2vw,100px)]">
                &amp; POSSIBILITIES
              </h1>
              <motion.a
                href="#projects"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 h-[42px] sm:h-[50px] px-5 sm:px-6 rounded-full bg-white text-text-main text-sm sm:text-base font-semibold tracking-[-0.025em] flex-shrink-0"
              >
                자세히보기
                <ArrowRight size={16} />
              </motion.a>
            </motion.div>
            <motion.h1
              variants={rise}
              className="text-white font-normal tracking-[-0.02em] leading-[1.05] text-[clamp(2.4rem,7.2vw,100px)]"
            >
              THOUGHT INTO ACTION
            </motion.h1>
            <motion.h1
              variants={rise}
              className="text-white font-normal tracking-[-0.02em] leading-[1.05] text-[clamp(2.4rem,7.2vw,100px)]"
            >
              MADE REAL
            </motion.h1>

            <motion.div
              variants={rise}
              className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <span className="text-white text-xl sm:text-2xl font-semibold tracking-[-0.025em]">
                Execution
              </span>
              <span className="hidden sm:inline-block w-px h-5 bg-white/60" />
              <span className="text-white text-base sm:text-lg font-medium tracking-[-0.025em]">
                무한한 가능성에 실행력을 더해 완성합니다.
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
