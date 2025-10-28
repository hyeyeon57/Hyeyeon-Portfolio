'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Mail, Phone, MapPin, GraduationCap, Calendar } from 'lucide-react';
import { personalInfo } from '@/data/portfolio';

export const AboutSection: React.FC = () => {
  const profileInfo = [
    { icon: <Mail className="w-5 h-5" />, label: '이메일', value: personalInfo.email },
    { icon: <Phone className="w-5 h-5" />, label: '연락처', value: personalInfo.phone },
    { icon: <MapPin className="w-5 h-5" />, label: '거주지', value: personalInfo.location },
    { icon: <GraduationCap className="w-5 h-5" />, label: '학력', value: '계원예술대학교 디지털미디어디자인과 (기획 전공)' },
    { icon: <Calendar className="w-5 h-5" />, label: '입사 가능일', value: personalInfo.availableDate },
  ];

  const capabilities = [
    '문제 정의 및 사용자 리서치',
    'UX 플로우 / IA 설계',
    '기능정의서·화면설계서 작성',
    'QA 품질 검증 및 프로세스 개선'
  ];

  return (
    <section id="about" className="relative py-20 bg-dark-bg border-t border-dark-border">
      <div className="max-w-container mx-auto px-container-x">
        {/* 섹션 헤더 */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Compass className="w-8 h-8 text-point-yellow" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              &ldquo;기획은 길을 만드는 일이다.&rdquo;
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* 왼쪽: 기획자 철학 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-6">
                사용자 흐름 속에서 문제를 정의하고,
                <br />
                데이터를 기반으로 방향을 설계하는 기획자입니다.
              </p>
              <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
                단순히 화면을 만드는 것이 아니라,
                <br />
                사용자가 목적지까지 <span className="text-point-yellow font-semibold">&lsquo;길을 잃지 않도록&rsquo;</span> 안내하는
                <br />
                내비게이션 같은 기획을 추구합니다.
              </p>
            </div>

            {/* 핵심 역량 */}
            <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-point-yellow">✦</span>
                핵심 역량
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {capabilities.map((capability, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3 text-text-secondary"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <span className="text-point-yellow mt-1">▸</span>
                    <span className="text-sm md:text-base">{capability}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 오른쪽: Profile Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-dark-surface border border-dark-border rounded-2xl p-8 h-full">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                <span className="text-point-yellow">👤</span>
                Profile Info
              </h3>
              
              <div className="space-y-6">
                {profileInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4 pb-6 border-b border-dark-border last:border-0 last:pb-0"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-dark-bg rounded-lg flex items-center justify-center text-point-yellow border border-dark-border">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-text-tertiary text-sm mb-1">{item.label}</p>
                      <p className="text-white text-base md:text-lg font-medium">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 이름 강조 */}
              <motion.div
                className="mt-8 pt-8 border-t border-dark-border text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <p className="text-text-tertiary text-sm mb-2">이름</p>
                <p className="text-3xl font-bold text-white mb-2">
                  {personalInfo.name}
                </p>
                <p className="text-xl text-point-yellow">
                  {personalInfo.englishName}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* 다운로드 버튼 */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <a
            href={personalInfo.resumeUrl}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-point-yellow text-dark-bg rounded-full font-semibold hover:bg-point-yellow-light transition-all duration-300 shadow-glow-yellow hover:shadow-glow-yellow-lg"
          >
            📄 이력서 다운로드
          </a>
          <a
            href={personalInfo.coverLetterUrl}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-dark-surface border-2 border-point-yellow text-point-yellow rounded-full font-semibold hover:bg-point-yellow hover:text-dark-bg transition-all duration-300"
          >
            🧾 자기소개서 다운로드
          </a>
        </motion.div>
      </div>
    </section>
  );
};

