'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface HearSeeFeelSectionProps {
  theme?: 'light' | 'dark';
}

export const HearSeeFeelSection: React.FC<HearSeeFeelSectionProps> = () => {
  return (
    <section className="relative w-full bg-white overflow-hidden text-white">
      <div className="pl-5 sm:pl-8 lg:pl-[60px]">
        <div className="relative overflow-hidden">
          {/* Conic gradient 배경 이미지 (image/3.png) */}
          <img
            src="/images/hear-see-feel-bg.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 w-full h-full object-cover object-[68%_center] md:object-center select-none"
          />

          <div className="relative z-10 max-w-container mx-auto px-5 sm:px-8 lg:px-[60px] py-20 sm:py-28">
        {/* 상단 Let's, See / Feel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-10 mb-14 sm:mb-20"
        >
          <h2 className="display-thin text-[clamp(3.5rem,10vw,180px)] text-white leading-none tracking-[-0.025em] whitespace-nowrap">
            Let&rsquo;s, See
          </h2>

          <div className="flex-1 min-w-[200px] max-w-[422px] pb-3 lg:pb-6">
            <div className="flex items-end justify-between gap-4 mb-4">
              <p className="text-white text-base sm:text-lg font-medium leading-[150%] tracking-[-0.025em] max-w-[290px]">
                눈으로 보고 분위기를 느끼며 3D모션을 파악하고 여러가지 연출을 직접 경험하세요
              </p>
              <Search className="w-7 h-7 text-white flex-shrink-0" strokeWidth={1.75} />
            </div>
            <div className="h-[2px] w-full bg-white" />
          </div>

          <h2 className="display-thin text-[clamp(3.5rem,10vw,180px)] text-white leading-none tracking-[-0.025em] whitespace-nowrap">
            Feel
          </h2>
        </motion.div>

        {/* 하단 2열 #F1F1F5 카드 (Figma Group 1707481533) */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-7">
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-[#F1F1F5] text-[#111111] p-8 sm:p-12 lg:p-16 min-h-[460px] sm:min-h-[560px] flex flex-col justify-between"
          >
            <div className="grid sm:grid-cols-[100px_1fr_1fr] gap-6 items-start">
              <div className="w-[100px] h-[117px] bg-[#D9D9D9] flex-shrink-0 overflow-hidden">
                <img
                  src="/images/profile.png"
                  alt="프로필 이미지"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <p className="text-lg font-semibold tracking-[-0.025em] text-[#111111] mb-3">
                  Who I AM?
                </p>
                <p className="text-base font-medium text-[#505050] leading-[150%] tracking-[-0.025em]">
                  어떤 시선으로 문제를 발견하고, 아이디어를 발전시키는가?
                </p>
              </div>
              <p className="text-base font-medium text-[#767676] leading-[150%] tracking-[-0.025em]">
                사용자의 여정 속 문제를 정의하고, 리서치와 기획으로 더 나은 방향을 설계합니다. 작은 디테일에서 가능성을 발견해 실행으로 이어 붙입니다.
              </p>
            </div>

            <h3 className="mt-16 text-[clamp(2rem,3.4vw,48px)] leading-[1.2] font-normal text-[#111111]">
              How UX
              <br />
              Thinking
              <br />
              Works
            </h3>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="bg-[#F1F1F5] text-[#111111] p-8 sm:p-12 lg:p-16 min-h-[460px] sm:min-h-[560px] flex flex-col justify-between"
          >
            <div className="grid sm:grid-cols-[100px_1fr_1fr] gap-6 items-start">
              <div className="w-[100px] h-[117px] bg-[#D9D9D9] flex-shrink-0 overflow-hidden">
                <img
                  src="/images/profile.png"
                  alt="프로필 이미지"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <p className="text-lg font-semibold tracking-[-0.025em] text-[#111111] mb-3">
                  How I Created?
                </p>
                <p className="text-base font-medium text-[#505050] leading-[150%] tracking-[-0.025em]">
                  아이디어를 어떻게 구체화하고 실제 결과물로 구현하는가?
                </p>
              </div>
              <p className="text-base font-medium text-[#767676] leading-[150%] tracking-[-0.025em]">
                리서치·아이트래킹·화면설계·QA까지 이어지는 프로세스로 아이디어를 검증하고, 협업 속에서 서비스로 구체화합니다.
              </p>
            </div>

            <h3 className="mt-16 text-[clamp(2rem,3.4vw,48px)] leading-[1.2] font-normal text-[#111111]">
              What Is
              <br />
              UX Planning?
            </h3>
          </motion.article>
        </div>
      </div>
        </div>
      </div>
    </section>
  );
};
