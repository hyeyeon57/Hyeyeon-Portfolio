'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, GraduationCap, Award, TrendingUp } from 'lucide-react';
import { experience, education } from '@/data/portfolio';

export const ExperienceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');

  return (
    <section id="experience" className="py-20 bg-dark-surface border-t border-dark-border relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-point-yellow rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-point-yellow rounded-full blur-3xl" />
      </div>

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
            className="inline-block px-4 py-2 bg-point-yellow/20 text-point-yellow rounded-full text-sm font-semibold mb-4 border border-point-yellow/30"
          >
            🧭 내가 지나온 경로
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Experience
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            기획 동아리에서는 협업과 아이디어 구체화 능력을,
            <br />
            QA에서는 문제 정의와 UX 검증을,
            <br />
            매장 근무에서는 사용자 중심 사고와 대응력을 길렀습니다.
          </p>
        </motion.div>

        {/* Tab Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-dark-bg rounded-2xl p-2 shadow-glow-yellow border border-dark-border">
            <button
              onClick={() => setActiveTab('experience')}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'experience'
                  ? 'bg-point-yellow text-dark-bg shadow-glow-yellow-lg'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              <Briefcase size={20} />
              경력
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'education'
                  ? 'bg-point-yellow text-dark-bg shadow-glow-yellow-lg'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              <GraduationCap size={20} />
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
                    whileHover={{ scale: 1.02 }}
                    className="relative"
                  >
                    {/* Timeline Line */}
                    {index !== experience.length - 1 && (
                      <div className="absolute left-[39px] top-20 bottom-0 w-0.5 bg-gradient-to-b from-point-yellow to-point-yellow-dark opacity-30" />
                    )}

                    <div className="flex gap-6">
                      {/* Icon */}
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-point-yellow to-point-yellow-dark text-dark-bg flex items-center justify-center shadow-glow-yellow-lg"
                      >
                        <Briefcase size={32} />
                      </motion.div>

                      {/* Content Card */}
                      <div className="flex-1 bg-dark-surface rounded-2xl p-8 shadow-glow-yellow hover:shadow-glow-yellow-lg transition-all duration-300 border border-dark-border">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                              {exp.position}
                            </h3>
                            <p className="text-lg font-semibold text-point-yellow mb-1">
                              {exp.company}
                            </p>
                          </div>
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-point-yellow/20 text-point-yellow rounded-xl text-sm font-semibold whitespace-nowrap border border-point-yellow/30">
                            📅 {exp.period}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-text-secondary leading-relaxed mb-6">
                          {exp.description}
                        </p>

                        {/* Achievements */}
                        {exp.achievements && exp.achievements.length > 0 && (
                          <div className="pt-6 border-t border-dark-border">
                            <div className="flex items-center gap-2 mb-4">
                              <Award className="text-point-yellow" size={20} />
                              <p className="font-bold text-white">주요 성과</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {exp.achievements.map((achievement, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  viewport={{ once: true }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="flex items-start gap-2 p-3 bg-point-yellow/10 border border-point-yellow/30 rounded-xl"
                                >
                                  <TrendingUp className="text-point-yellow flex-shrink-0 mt-0.5" size={16} />
                                  <span className="text-sm text-text-secondary">{achievement}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
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
                    whileHover={{ scale: 1.02 }}
                    className="relative"
                  >
                    {/* Timeline Line */}
                    {index !== education.length - 1 && (
                      <div className="absolute left-[39px] top-20 bottom-0 w-0.5 bg-gradient-to-b from-point-yellow to-point-yellow-dark opacity-30" />
                    )}

                    <div className="flex gap-6">
                      {/* Icon */}
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-point-yellow to-point-yellow-dark text-dark-bg flex items-center justify-center shadow-glow-yellow-lg"
                      >
                        <GraduationCap size={32} />
                      </motion.div>

                      {/* Content Card */}
                      <div className="flex-1 bg-dark-surface rounded-2xl p-8 shadow-glow-yellow hover:shadow-glow-yellow-lg transition-all duration-300 border border-dark-border">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                              {edu.school}
                            </h3>
                            <p className="text-lg font-semibold text-point-yellow">
                              {edu.degree} - {edu.field}
                            </p>
                          </div>
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-point-yellow/20 text-point-yellow rounded-xl text-sm font-semibold whitespace-nowrap border border-point-yellow/30">
                            📅 {edu.period}
                          </span>
                        </div>

                        {edu.description && (
                          <p className="text-text-secondary leading-relaxed">
                            {edu.description}
                          </p>
                        )}
                      </div>
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
