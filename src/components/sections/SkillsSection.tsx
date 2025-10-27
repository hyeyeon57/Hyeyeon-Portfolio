'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wrench } from 'lucide-react';
import { skills } from '@/data/portfolio';

interface SkillsSectionProps {
  theme?: 'light' | 'dark';
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ theme = 'light' }) => {
  // Main tools와 보조 툴 분리
  const mainTools = skills.filter(skill => 
    ['Figma', 'Excel', 'Google Spreadsheet', 'PowerPoint', 'AI Tools (Cursor·GPT·Gemini·UXpilot)', 'Notion', 'Eye-Tracking (Tobii Pro)'].includes(skill.name)
  );
  
  const auxiliaryTools = skills.filter(skill => 
    ['MS Word / 한글(HWP)', 'Illustrator', 'Photoshop', 'Premiere Pro'].includes(skill.name)
  );

  // Level을 퍼센트로 변환 (5단계 -> 100%)
  const getLevelPercent = (level: number) => (level / 5) * 100;

  return (
    <section id="skills" className="py-20 relative overflow-hidden">
      {/* 상단 그라데이션 마스크 */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/0 to-transparent pointer-events-none z-0" />
      {/* 하단 그라데이션 마스크 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/0 to-transparent pointer-events-none z-0" />

      <div className="max-w-container mx-auto px-container-x relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 bg-brand-main/10 text-brand-main rounded-full text-sm font-semibold mb-4 border border-brand-main/30"
          >
            🛠️ 기획자의 내비게이션 도구들
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-light text-text-main mb-4">
            Tools & Capabilities
          </h2>
          <p className="text-xl text-text-sub max-w-2xl mx-auto">
            다양한 도구를 활용해 사용자 경험을 설계하고,
            <br />
            데이터 기반의 체계적인 기획을 수행합니다.
          </p>
        </motion.div>

        {/* Main Tools */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow minimal border border-line-medium">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-brand-main flex items-center justify-center shadow minimal">
                <Wrench className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-text-main">Main Tools</h3>
            </div>

            <div className="space-y-8">
              {mainTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Tool Name & Percentage */}
                  <div className="flex justify-between items-baseline mb-3">
                    <div>
                      <span className="text-lg font-bold text-text-main">
                        {tool.name}
                      </span>
                      <p className="text-sm text-text-secondary mt-1">
                        {tool.description}
                      </p>
                    </div>
                    <span className="text-2xl font-bold text-brand-main ml-4">
                      {getLevelPercent(tool.level)}%
                    </span>
                  </div>

                  {/* Progress Bar - Gradient Line */}
                  <div className="relative h-2 bg-line-medium rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${getLevelPercent(tool.level)}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.2,
                        delay: index * 0.1,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      className="absolute top-0 left-0 h-full rounded-full bg-brand-main"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Auxiliary Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <p className="text-sm text-text-tertiary mb-3">
            보조 툴
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {auxiliaryTools.map((tool) => (
              <motion.span
                key={tool.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-dark-surface border border-dark-border rounded-xl text-sm text-text-tertiary hover:text-text-secondary hover:border-point-yellow/30 transition-all duration-300 cursor-default"
              >
                {tool.name}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-dark-surface rounded-2xl p-6 border border-dark-border text-center hover:border-point-yellow/30 transition-all duration-300">
            <div className="text-4xl font-bold text-point-yellow mb-2">
              {mainTools.length}+
            </div>
            <p className="text-text-secondary">전문 툴 활용</p>
          </div>
          <div className="bg-dark-surface rounded-2xl p-6 border border-dark-border text-center hover:border-point-yellow/30 transition-all duration-300">
            <div className="text-4xl font-bold text-point-yellow mb-2">
              {Math.round(mainTools.reduce((acc, tool) => acc + getLevelPercent(tool.level), 0) / mainTools.length)}%
            </div>
            <p className="text-text-secondary">평균 숙련도</p>
          </div>
          <div className="bg-dark-surface rounded-2xl p-6 border border-dark-border text-center hover:border-point-yellow/30 transition-all duration-300">
            <div className="text-4xl font-bold text-point-yellow mb-2">
              5+
            </div>
            <p className="text-text-secondary">년 경력</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
