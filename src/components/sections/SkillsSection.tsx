'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { skills } from '@/data/portfolio';

interface SkillsSectionProps {
  theme?: 'light' | 'dark';
}

const AWARD_CATEGORIES = [
  { id: 'renders', label: '3D Renders', preview: false },
  { id: 'animals', label: 'animals', preview: false },
  { id: 'architecture', label: 'architecture & interiors', preview: true },
  { id: 'experimental', label: 'experimental', preview: false },
  { id: 'fashion', label: 'fashion & Beauty', preview: false },
  { id: 'film', label: 'film', preview: false },
  { id: 'nature', label: 'nature', preview: false },
  { id: 'people', label: 'people', preview: false },
];

export const SkillsSection: React.FC<SkillsSectionProps> = () => {
  const [active, setActive] = useState('architecture');
  const toolNames = skills.map((s) => s.name);

  // Map award rows to real skills when possible, fallback to Figma labels
  const rows = AWARD_CATEGORIES.map((cat, i) => ({
    ...cat,
    skillLabel: toolNames[i] || cat.label,
    description: skills[i]?.description,
  }));

  const activeRow = rows.find((r) => r.id === active) || rows[2];

  return (
    <>
      {/* Awards Category */}
      <section
        id="skills"
        className="relative w-full bg-bg-ink-900 text-white px-5 sm:px-8 lg:px-[60px] py-24 sm:py-32 md:py-40"
      >
        <div className="max-w-container mx-auto grid lg:grid-cols-[minmax(0,360px)_1fr] gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="display-xl text-[clamp(2.75rem,6vw,80px)] leading-[1.1] mb-6">
              Awards
              <br />
              Category
            </h2>
            <p className="text-lg font-medium leading-[150%] tracking-[-0.025em] text-white/80 max-w-sm">
              올해 가장 베스트 스킬 카테고리를 확인하고 본인의 작업과 알맞은
              역량을 찾아서 함께 경험해 보세요
            </p>
          </motion.div>

          <div className="relative">
            {rows.map((row) => {
              const isActive = row.id === active;
              return (
                <button
                  key={row.id}
                  type="button"
                  onMouseEnter={() => setActive(row.id)}
                  onFocus={() => setActive(row.id)}
                  onClick={() => setActive(row.id)}
                  className={`group relative w-full flex items-center justify-between text-left border-b transition-colors duration-300 py-6 sm:py-7 ${
                    isActive ? 'border-white border-b-2' : 'border-white/30'
                  }`}
                >
                  <span
                    className={`text-[clamp(1.25rem,2.4vw,36px)] tracking-[-0.025em] capitalize transition-colors ${
                      isActive ? 'text-white font-semibold' : 'text-[#999999] font-normal'
                    }`}
                  >
                    {row.skillLabel}
                  </span>
                  <ArrowUpRight
                    size={22}
                    className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-40'}`}
                  />
                </button>
              );
            })}

            {/* floating preview card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRow.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="hidden xl:block absolute right-[12%] top-[8%] w-[280px] h-[380px] pointer-events-none shadow-[30px_30px_50px_rgba(0,0,0,0.5)] overflow-hidden"
                style={{
                  background:
                    'linear-gradient(160deg, rgba(255,255,255,0.12), rgba(0,0,0,0.55)), linear-gradient(45deg, #5a4a9e, #1a1a1a)',
                }}
              >
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <p className="text-sm text-white/60 mb-2">{activeRow.skillLabel}</p>
                  <p className="text-base text-white/90 leading-relaxed">
                    {activeRow.description || 'Skill category preview'}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Blending technology banner */}
      <section className="relative w-full px-5 sm:px-8 lg:px-[60px] py-10 sm:py-14 bg-white">
        <div className="max-w-container mx-auto">
          <div
            className="relative w-full min-h-[320px] sm:min-h-[480px] md:min-h-[600px] flex items-center justify-center overflow-hidden"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.25) 100%), linear-gradient(135deg, #2a2438 0%, #111 40%, #3a2f1f 100%)',
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
    </>
  );
};
