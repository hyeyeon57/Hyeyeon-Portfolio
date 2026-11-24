'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface HearSeeFeelSectionProps {
  theme?: 'light' | 'dark';
}

export const HearSeeFeelSection: React.FC<HearSeeFeelSectionProps> = () => {
  return (
    <>
      {/* Hear, See / Feel — conic gradient stage */}
      <section className="relative w-full overflow-hidden text-white">
        <div
          className="absolute inset-0"
          style={{
            background:
              'conic-gradient(from -51.28deg at 58.62% 74.84%, #6153B0 -14.97deg, #5741AD 6.92deg, #BDFFC9 138deg, #6153B0 345.03deg, #5741AD 366.92deg)',
          }}
        />
        <div className="absolute inset-0 bg-black/25" />

        <div className="relative z-10 max-w-container mx-auto px-5 sm:px-8 lg:px-[60px] py-24 sm:py-32 md:py-40">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-10"
          >
            <h2 className="display-thin text-[clamp(3.5rem,12vw,200px)] text-white leading-none tracking-[-0.025em]">
              Hear, See
            </h2>

            <div className="flex-1 min-w-[200px] max-w-sm pb-4 lg:pb-8">
              <p className="text-white text-lg font-medium leading-[150%] tracking-[-0.025em] mb-6">
                눈으로 보고 분위기를 느끼며
                <br />
                3D모션을 파악하고 여러가지
                <br />
                연출을 직접 경험하세요
              </p>
              <div className="h-0.5 w-full max-w-[422px] bg-white mb-4" />
              <Search className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>

            <h2 className="display-thin text-[clamp(3.5rem,12vw,200px)] text-white leading-none tracking-[-0.025em] lg:ml-auto">
              Feel
            </h2>
          </motion.div>

          {/* indicator dots */}
          <div className="mt-16 sm:mt-24 flex items-center justify-center gap-[7px]">
            <span className="w-[7px] h-[7px] rounded-full bg-[#D9D9D9]" />
            <span className="w-[7px] h-[7px] rounded-full bg-white" />
            <span className="w-[7px] h-[7px] rounded-full bg-[#D9D9D9]" />
            <span className="w-[7px] h-[7px] rounded-full bg-[#D9D9D9]" />
            <span className="w-[7px] h-[7px] rounded-full bg-[#D9D9D9]" />
          </div>
        </div>
      </section>

      {/* Who I AM? / How I created? */}
      <section className="relative w-full bg-white px-5 sm:px-8 lg:px-[60px] py-16 sm:py-24">
        <div className="max-w-container mx-auto grid md:grid-cols-2 gap-6 lg:gap-7">
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-bg-soft p-8 sm:p-10 lg:p-14 min-h-[420px] sm:min-h-[520px] flex flex-col"
          >
            <div className="flex gap-5 mb-10">
              <div className="w-[100px] h-[117px] bg-line-strong/40 flex-shrink-0 overflow-hidden">
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      'linear-gradient(160deg, #c8c4d8 0%, #8a849e 50%, #3a3648 100%)',
                  }}
                />
              </div>
              <div>
                <p className="text-lg font-medium tracking-[-0.025em] text-text-main mb-2">
                  Who I AM?
                </p>
                <p className="text-base text-text-sub leading-[150%] tracking-[-0.025em] max-w-[200px]">
                  어떤 시선으로 문제를 발견하고, 아이디어를 발전시키는가?
                </p>
              </div>
            </div>
            <p className="text-base font-medium text-text-secondary leading-[150%] tracking-[-0.025em] max-w-xs mb-auto">
              사용자의 여정 속 문제를 정의하고, 리서치와 기획으로 더 나은 방향을
              설계합니다. 작은 디테일에서 가능성을 발견해 실행으로 이어 붙입니다.
            </p>
            <h3 className="mt-12 text-[clamp(1.75rem,3.2vw,48px)] leading-[1.2] font-normal text-text-main">
              How UX
              <br />
              Thinking Works
            </h3>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="bg-bg-soft p-8 sm:p-10 lg:p-14 min-h-[420px] sm:min-h-[520px] flex flex-col"
          >
            <div className="flex gap-5 mb-10">
              <div className="w-[100px] h-[117px] bg-line-strong/40 flex-shrink-0 overflow-hidden">
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      'linear-gradient(160deg, #e8e4dc 0%, #a89f90 50%, #4a4438 100%)',
                  }}
                />
              </div>
              <div>
                <p className="text-xl capitalize tracking-tight text-[#0D0D0D] mb-2">
                  How I created?
                </p>
                <p className="text-base font-medium text-text-sub leading-[150%] tracking-[-0.025em] max-w-[200px]">
                  아이디어를 어떻게 구체화하고 실제 결과물로 구현하는가?
                </p>
              </div>
            </div>
            <p className="text-base font-medium text-text-secondary leading-[150%] tracking-[-0.025em] max-w-sm mb-auto">
              리서치·아이트래킹·화면설계·QA까지 이어지는 프로세스로 아이디어를
              검증하고, 협업 속에서 서비스로 구체화합니다.
            </p>
            <h3 className="mt-12 text-[clamp(1.75rem,3.2vw,48px)] leading-[1.2] font-normal text-text-main">
              What Is
              <br />
              UX Planning?
            </h3>
          </motion.article>
        </div>
      </section>
    </>
  );
};
