'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { personalInfo } from '@/data/portfolio';

interface HeroSectionProps {
  theme?: 'light' | 'dark';
}

export const HeroSection: React.FC<HeroSectionProps> = ({ theme = 'light' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section 
      ref={ref}
      id="home" 
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: `
          radial-gradient(60% 55% at 18% 18%, rgba(122,104,246,0.20) 0%, rgba(122,104,246,0) 60%),
          radial-gradient(50% 45% at 86% 22%, rgba(252,235,255,0.22) 0%, rgba(252,235,255,0) 65%),
          radial-gradient(45% 45% at 78% 80%, rgba(231,240,255,0.18) 0%, rgba(231,240,255,0) 60%),
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
            {/* 이름 */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-light mb-6 leading-tight tracking-tight text-text-main"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {personalInfo.name}
            </motion.h1>

            {/* 타이틀 */}
            <motion.div
              className="text-lg md:text-xl font-light mb-12 leading-relaxed text-text-main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="font-normal text-text-main">{personalInfo.title}</div>
            </motion.div>

            {/* 자기소개 */}
            <motion.p
              className="text-base md:text-lg font-light leading-relaxed max-w-2xl mb-12 text-text-sub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {personalInfo.bio}
            </motion.p>

            {/* CTA 버튼 */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <a
                href={personalInfo.resumeUrl}
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-light text-white bg-brand-main hover:opacity-90 transition-all duration-300"
              >
                Resume Download
              </a>
              <a
                href={personalInfo.coverLetterUrl}
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-light text-brand-main bg-transparent hover:bg-brand-main/5 transition-all duration-300 border border-brand-main/30 hover:border-brand-main"
              >
                Cover Letter
              </a>
            </motion.div>
          </motion.div>

          {/* 우측 빈 공간 */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
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
