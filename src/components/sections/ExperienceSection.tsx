'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award } from 'lucide-react';
import { experience, education } from '@/data/portfolio';

interface ExperienceSectionProps {
  theme?: 'light' | 'dark';
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = () => {
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');

  return (
    <section id="experience" className="py-20 relative overflow-hidden">
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
            className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 border bg-brand-main/10 text-brand-main border-brand-main/30"
          >
            나의 경유지
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-text-main">
            My Waypoint
          </h2>
          <p className="text-xl text-text-sub max-w-3xl mx-auto">
            QA 직무 경험에서는 문제를 정확히 포착하는 <span className="font-bold text-text-main">분석력</span>을,
            <br />
            기획 동아리에서는 아이디어를 구조화하는 <span className="font-bold text-text-main">기획력</span>을,
            <br />
            매장 근무에서는 <span className="font-bold text-text-main">사용자 중심 사고와 대응력</span>을 길렀습니다.
          </p>
        </motion.div>

        {/* Tab Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-white rounded-2xl p-2 shadow minimal border border-line-medium">
            <button
              onClick={() => setActiveTab('experience')}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'experience'
                  ? 'bg-violet-100 text-brand-main shadow minimal'
                  : 'text-text-secondary hover:text-brand-main hover:bg-violet-50'
              }`}
            >
              <img 
                src="/icons/flag1.svg" 
                alt="경력" 
                className={`w-10 h-10 transition-all duration-300 ${
                  activeTab === 'experience' 
                    ? 'opacity-100 scale-110' 
                    : 'opacity-50 grayscale'
                }`}
              />
              경력
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'education'
                  ? 'bg-violet-100 text-brand-main shadow minimal'
                  : 'text-text-secondary hover:text-brand-main hover:bg-violet-50'
              }`}
            >
              <img 
                src="/icons/flag2.svg" 
                alt="학력" 
                className={`w-10 h-10 transition-all duration-300 ${
                  activeTab === 'education' 
                    ? 'opacity-100 scale-110' 
                    : 'opacity-50 grayscale'
                }`}
              />
              학력
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'experience' ? (
            <motion.div
              key="experience"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="relative"
                  >
                    {/* Content Card */}
                    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-line-light">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-3">
                        <div className="flex-1">
                          <h3 className="text-xl md:text-2xl font-bold text-text-main mb-1">
                            {exp.position}
                          </h3>
                          <p className="text-base md:text-lg text-brand-main font-medium">
                            {exp.company}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-main/5 text-brand-main rounded-lg text-sm font-medium whitespace-nowrap border border-brand-main/20">
                          {exp.period}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-text-sub leading-relaxed mb-4">
                        {exp.description}
                      </p>

                      {/* Achievements */}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="pt-4 border-t border-line-light">
                          <div className="flex items-center gap-2 mb-3">
                            <Award className="text-brand-main" size={18} />
                            <p className="font-semibold text-text-main text-sm">주요 성과</p>
                          </div>
                          <ul className="space-y-2">
                            {exp.achievements.map((achievement, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-sm text-text-secondary"
                              >
                                <span className="text-brand-main mt-1">•</span>
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="education"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="relative"
                  >
                    {/* Content Card */}
                    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-line-light">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-3">
                        <div className="flex-1">
                          <h3 className="text-xl md:text-2xl font-bold text-text-main mb-1">
                            {edu.school}
                          </h3>
                          <p className="text-base md:text-lg text-brand-main font-medium">
                            {edu.degree}{edu.field ? ` - ${edu.field}` : ''}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-main/5 text-brand-main rounded-lg text-sm font-medium whitespace-nowrap border border-brand-main/20">
                          {edu.period}
                        </span>
                      </div>

                      {edu.description && (
                        <p className="text-text-sub leading-relaxed">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
