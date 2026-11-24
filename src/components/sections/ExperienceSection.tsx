'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { experience, education } from '@/data/portfolio';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExperienceSectionProps {
  theme?: 'light' | 'dark';
}

const YEAR_STACK = ['2022', '2023', '2024', '2026', '2027', '2018', '2019'];

export const ExperienceSection: React.FC<ExperienceSectionProps> = () => {
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');
  const { t } = useLanguage();
  const items = activeTab === 'experience' ? experience : education;

  return (
    <section id="experience" className="relative w-full bg-bg-black text-white overflow-hidden">
      <div className="max-w-container mx-auto px-5 sm:px-8 lg:px-[60px] py-24 sm:py-32 md:py-40">
        <div className="grid lg:grid-cols-[minmax(0,280px)_1fr_auto] gap-10 lg:gap-16 items-start mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="display-xl text-[clamp(2.75rem,6vw,80px)] leading-[1.1] text-white mb-6">
              Life
              <br />
              Career.
            </h2>
            <p className="text-lg font-medium text-white/70 leading-[150%] tracking-[-0.025em] max-w-[240px] mt-6">
              우아함을 상징한 곡선을 모티브로 계층을 나타내다.
            </p>
          </motion.div>

          {/* visual stage */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative min-h-[420px] sm:min-h-[520px] rounded-sm overflow-hidden"
            style={{
              background:
                'radial-gradient(ellipse at 50% 60%, rgba(97,83,176,0.55) 0%, rgba(0,0,0,0.2) 45%, #000 100%)',
            }}
          >
            <div className="absolute inset-8 sm:inset-12 border border-white/10" />
            <div className="absolute left-8 sm:left-14 top-10 sm:top-16 max-w-xs space-y-8">
              {(activeTab === 'education'
                ? [
                    {
                      title: '계원예술대학교 졸업',
                      desc: '디지털미디어디자인학과 기획 전공을 졸업.',
                    },
                    {
                      title: '아트랑 프로젝트',
                      desc: '아트랑 프로젝트를 주제로 졸업 전시회 진행',
                    },
                    {
                      title: '우수 과목 연합 PT',
                      desc: '프로젝트 프로포절 · 매니징 우수 과목 연합 PT 진행',
                      muted: true,
                    },
                  ]
                : [
                    {
                      title: '현대/기아 내비게이션 QA',
                      desc: '화면설계서 기반 오류 검증 및 품질 표준화',
                    },
                    {
                      title: 'di9 디나인컴즈 입사',
                      desc: '기획팀 사원 · UX 기획 및 서비스 운영',
                    },
                    {
                      title: '기획 동아리 KOC',
                      desc: '콘텐츠 기획 및 아이디어 시각화',
                      muted: true,
                    },
                  ]
              ).map((card) => (
                <div
                  key={card.title}
                  className={card.muted ? 'opacity-40' : 'opacity-100'}
                >
                  <p className="text-xl sm:text-2xl font-semibold tracking-[-0.025em] mb-2">
                    {card.title}
                  </p>
                  <p className="text-sm font-light leading-[130%] tracking-[-0.5px] text-white/70 max-w-[220px]">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* year column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden lg:flex flex-col items-end gap-3 pt-4"
          >
            {YEAR_STACK.slice(0, 3).map((y) => (
              <span key={y} className="text-lg font-medium tracking-[-0.025em] text-white/90">
                {y}
              </span>
            ))}
            <div className="my-4 w-[283px] text-right">
              <p className="text-[120px] font-medium leading-none tracking-[-0.025em] text-white">
                2026
              </p>
              <div className="mt-4 h-1 w-full bg-[#111111]" />
            </div>
            {YEAR_STACK.slice(4).map((y) => (
              <span key={y} className="text-lg font-medium tracking-[-0.025em] text-white/90">
                {y}
              </span>
            ))}
          </motion.div>
        </div>

        {/* tabs + list */}
        <div className="flex items-center gap-8 mb-10 border-b border-white/15">
          {(['experience', 'education'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative pb-3 text-base sm:text-lg transition-colors"
            >
              <span className={activeTab === tab ? 'text-white' : 'text-white/40 hover:text-white/70'}>
                {t(`experience.tab.${tab}`)}
              </span>
              {activeTab === tab && (
                <motion.span
                  layoutId="careerTab"
                  className="absolute left-0 right-0 -bottom-px h-0.5 bg-white"
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            {items.map((item, index) => {
              const title =
                activeTab === 'experience'
                  ? (item as (typeof experience)[0]).position
                  : (item as (typeof education)[0]).school;
              const sub =
                activeTab === 'experience'
                  ? (item as (typeof experience)[0]).company
                  : (item as (typeof education)[0]).degree;
              const desc = item.description;
              const period = item.period;
              const achievements =
                activeTab === 'experience'
                  ? (item as (typeof experience)[0]).achievements
                  : undefined;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="grid md:grid-cols-[180px_1fr] gap-4 md:gap-12 py-9 sm:py-11 border-b border-white/15"
                >
                  <p className="text-sm text-white/50 tracking-wide">{period}</p>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-medium tracking-tight mb-1">{title}</h3>
                    <p className="text-white/50 mb-3">{sub}</p>
                    <p className="text-white/70 font-light leading-relaxed mb-4">{desc}</p>
                    {achievements && (
                      <ul className="space-y-1.5">
                        {achievements.map((a) => (
                          <li key={a} className="text-sm text-white/45 flex gap-2">
                            <span className="text-white/30">·</span>
                            {a}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
