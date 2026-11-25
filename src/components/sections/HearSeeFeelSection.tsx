'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface HearSeeFeelSectionProps {
  theme?: 'light' | 'dark';
}

export const HearSeeFeelSection: React.FC<HearSeeFeelSectionProps> = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [coverLetterUrl, setCoverLetterUrl] = useState<string | null>(null);
  const fullTypingText = isEn
    ? 'Want to know more about Hyeyeon Jang? Download the cover letter and resume to explore.'
    : '지원자 장혜연에 대해 알고 싶으시다면 자기소개서와 이력서를 다운받아서 확인해주세요.';
  const [typedCount, setTypedCount] = useState(0);

  useEffect(() => {
    setTypedCount(0);
    let idx = 0;
    let pauseTimer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      idx += 1;
      setTypedCount(idx);
      if (idx < fullTypingText.length) {
        pauseTimer = setTimeout(tick, 65);
      } else {
        pauseTimer = setTimeout(() => {
          if (cancelled) return;
          idx = 0;
          setTypedCount(0);
          pauseTimer = setTimeout(tick, 450);
        }, 2600);
      }
    };

    pauseTimer = setTimeout(tick, 350);
    return () => {
      cancelled = true;
      if (pauseTimer) clearTimeout(pauseTimer);
    };
  }, [fullTypingText]);

  useEffect(() => {
    let active = true;
    fetch('/api/documents')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!active || !json?.data) return;
        if (json.data.resume?.url) setResumeUrl(json.data.resume.url);
        if (json.data.coverLetter?.url) setCoverLetterUrl(json.data.coverLetter.url);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const handleDownloadClick = (e: React.MouseEvent, url: string | null, label: string) => {
    if (!url) {
      e.preventDefault();
      alert(isEn ? `${label} is not uploaded yet.` : `등록된 ${label} 파일이 아직 없습니다. 관리자 > 문서 관리에서 등록해 주세요.`);
    }
  };

  return (
    <section className="relative w-full bg-white overflow-hidden text-white">
      <div className="pl-5 sm:pl-8 lg:pl-[60px] 3xl:pl-[max(60px,calc((100vw-1920px)/2))]">
        <div className="relative overflow-hidden">
          {/* 모바일용 부드러운 보라-민트 그라데이션 (핀치 포인트 없음) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 md:hidden"
            style={{
              background:
                'linear-gradient(150deg, #543EAF 0%, #6A5BC4 42%, #A6E8C6 100%)',
            }}
          />
          {/* PC/태블릿용 Conic gradient 배경 이미지 (image/3.png) */}
          <img
            src="/images/hear-see-feel-bg.png"
            alt=""
            aria-hidden
            className="pointer-events-none hidden md:block absolute inset-0 w-full h-full object-cover object-center select-none"
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

          <div className="flex-1 min-w-[200px] max-w-[460px] pb-3 lg:pb-6">
            <div className="flex items-end justify-between gap-4 mb-4 min-h-[54px]">
              <p className="text-white text-[15px] sm:text-[17px] font-medium leading-[150%] tracking-[-0.025em] max-w-[390px] break-keep">
                {fullTypingText.slice(0, typedCount)}
                <span className="inline-block w-[2px] h-[1.05em] bg-white align-middle ml-0.5 animate-pulse" />
              </p>
              <Search className="w-7 h-7 text-white flex-shrink-0" strokeWidth={1.75} />
            </div>
            <div className="h-[2px] w-full bg-white" />
          </div>

          <h2 className="display-thin text-[clamp(3.5rem,10vw,180px)] text-white leading-none tracking-[-0.025em] whitespace-nowrap">
            Me
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
                  {isEn
                    ? 'From what perspective do I spot problems and grow ideas?'
                    : '어떤 시선으로 문제를 발견하고, 아이디어를 발전시키는가?'}
                </p>
              </div>
              <p className="text-base font-medium text-[#767676] leading-[150%] tracking-[-0.025em]">
                {isEn
                  ? 'I define friction points across user journeys and design better directions through research and planning—turning small details into execution.'
                  : '사용자의 여정 속 문제를 정의하고, 리서치와 기획으로 더 나은 방향을 설계합니다. 작은 디테일에서 가능성을 발견해 실행으로 이어 붙입니다.'}
              </p>
            </div>

            <div className="mt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <h3 className="text-[clamp(2rem,3.4vw,48px)] leading-[1.2] font-normal text-[#111111]">
                How UX
                <br />
                Thinking
                <br />
                Works
              </h3>

              <a
                href={coverLetterUrl ? `${coverLetterUrl}#view=Fit` : '#'}
                target={coverLetterUrl ? '_blank' : undefined}
                rel={coverLetterUrl ? 'noopener noreferrer' : undefined}
                onClick={(e) => handleDownloadClick(e, coverLetterUrl, '자기소개서')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#111111] text-white text-sm font-medium tracking-[-0.02em] hover:bg-[#5C4AAE] transition-colors self-start sm:self-end flex-shrink-0"
              >
                <Download size={15} />
                <span>{isEn ? 'Cover Letter' : '자기소개서 다운로드'}</span>
              </a>
            </div>
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
                  {isEn
                    ? 'How do I shape ideas into tangible digital products?'
                    : '아이디어를 어떻게 구체화하고 실제 결과물로 구현하는가?'}
                </p>
              </div>
              <p className="text-base font-medium text-[#767676] leading-[150%] tracking-[-0.025em]">
                {isEn
                  ? 'Through research, eye-tracking, storyboards, and QA, I validate hypotheses and ship real services in close collaboration.'
                  : '리서치·아이트래킹·화면설계·QA까지 이어지는 프로세스로 아이디어를 검증하고, 협업 속에서 서비스로 구체화합니다.'}
              </p>
            </div>

            <div className="mt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <h3 className="text-[clamp(2rem,3.4vw,48px)] leading-[1.2] font-normal text-[#111111]">
                What Is
                <br />
                UX Planning?
              </h3>

              <a
                href={resumeUrl ? `${resumeUrl}#view=Fit` : '#'}
                target={resumeUrl ? '_blank' : undefined}
                rel={resumeUrl ? 'noopener noreferrer' : undefined}
                onClick={(e) => handleDownloadClick(e, resumeUrl, '이력서')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#111111] text-white text-sm font-medium tracking-[-0.02em] hover:bg-[#5C4AAE] transition-colors self-start sm:self-end flex-shrink-0"
              >
                <Download size={15} />
                <span>{isEn ? 'Resume' : '이력서 다운로드'}</span>
              </a>
            </div>
          </motion.article>
        </div>
      </div>
        </div>
      </div>
    </section>
  );
};
