'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkillsSectionProps {
  theme?: 'light' | 'dark';
}

export const SkillsSection: React.FC<SkillsSectionProps> = () => {
  return (
    <div id="skills">
      {/* 보라색 방사형 그래픽 섹션 (image/Ellipse 185 (7).png) */}
      <section className="relative w-full bg-white overflow-hidden pt-16 sm:pt-24">
        <div className="max-w-container mx-auto px-5 sm:px-8 lg:px-[60px] flex justify-center">
          <div className="relative w-[min(92vw,960px)] h-[min(46vw,480px)] overflow-hidden flex items-start justify-center">
            <motion.img
              src="/images/ellipse-185.png"
              alt=""
              aria-hidden
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={{ rotate: 360 }}
              transition={{
                opacity: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                scale: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                rotate: { repeat: Infinity, duration: 28, ease: 'linear' },
              }}
              className="w-full h-auto aspect-square object-contain origin-center select-none pointer-events-none"
            />
          </div>
        </div>
      </section>

      {/* 다크 섹션 + Blending technology and artistry 배너 (Figma Rectangle 26 + Group 2303) */}
      <section className="relative w-full bg-[#111111] px-5 sm:px-8 lg:px-[60px] py-24 sm:py-36">
        <div className="max-w-container mx-auto">
          <div
            className="relative w-full min-h-[340px] sm:min-h-[480px] md:min-h-[600px] rounded-[40px] sm:rounded-[67px] flex items-center justify-center overflow-hidden"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.2) 29.5%, rgba(255,255,255,0.18) 100%), linear-gradient(0deg, rgba(86,86,86,0.2), rgba(86,86,86,0.2)), linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.2) 100%)',
            }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10 text-center text-white font-normal text-[clamp(2rem,5vw,80px)] leading-[1.2] max-w-[752px] px-6"
            >
              Blending technology
              <br />
              and artistry
            </motion.h2>
          </div>
        </div>
      </section>
    </div>
  );
};
