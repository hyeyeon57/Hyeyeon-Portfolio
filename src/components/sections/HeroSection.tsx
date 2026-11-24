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
      {/* 우측 이미지 영역 + 상하 그라데이션 오버레이 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-[55%] max-w-[1186px]"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.87) 0%, rgba(0,0,0,0) 48.44%, rgba(0,0,0,0.87) 100%), radial-gradient(ellipse at 40% 45%, rgba(180,160,220,0.35) 0%, rgba(80,60,140,0.2) 35%, rgba(0,0,0,0) 70%)',
        }}
      />

      {/* 좌·우·상·하 페이드 마스크 */}
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-[22%] pointer-events-none"
        style={{ background: 'linear-gradient(270deg, #000000 52%, rgba(0,0,0,0) 100%)' }}
      />
      <div
        aria-hidden
        className="absolute inset-y-0 left-[42%] w-[22%] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #000000 52%, rgba(0,0,0,0) 100%)' }}
      />

      {/* 떠다니는 구체 악센트 */}
      <motion.div
        aria-hidden
        animate={{ y: [0, -18, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        className="pointer-events-none absolute right-[18%] top-[42%] w-[min(28vw,420px)] h-[min(28vw,420px)] rounded-full"
        style={{
          background:
            'radial-gradient(circle at 35% 30%, rgba(200,180,255,0.55), rgba(90,70,180,0.25) 45%, rgba(0,0,0,0) 70%)',
          filter: 'blur(2px)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[6%] top-[22%] w-2 h-2 rounded-full bg-white/40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[7%] top-[52%] w-4 h-4 rounded-full bg-white/25"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[22%] top-[65%] w-2 h-2 rounded-full bg-white/30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[14%] top-[40%] w-6 h-6 rounded-full bg-white/20"
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
            <motion.h1
              variants={rise}
              className="text-white font-normal tracking-[-0.02em] leading-[1.05] text-[clamp(2.4rem,7.2vw,100px)] mt-1 sm:mt-0 sm:pl-[min(20vw,308px)]"
            >
              &amp; POSSIBILITIES
            </motion.h1>
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

            <motion.div variants={rise} className="mt-10 sm:mt-12">
              <motion.a
                href="#projects"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-3 h-[72px] px-9 rounded-full bg-white text-text-main text-xl font-semibold tracking-[-0.025em]"
              >
                자세히보기
                <ArrowRight size={20} />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
