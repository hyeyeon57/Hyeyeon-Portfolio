'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { experience, education } from '@/data/portfolio';

interface ExperienceSectionProps {
  theme?: 'light' | 'dark';
}

interface CareerSlide {
  year: string;
  left: {
    title: string;
    subtitle: string;
    period?: string;
    cardType: 'ati' | 'di9' | 'detail';
    bullets?: string[];
    caption?: string;
    linkText?: string;
    linkHref?: string;
    mutedTitle?: string;
    mutedDesc?: string;
  };
  right: {
    title: string;
    subtitle: string;
    period?: string;
    cardType: 'ati' | 'di9' | 'detail';
    bullets?: string[];
    caption?: string;
    linkText?: string;
    linkHref?: string;
    mutedTitle?: string;
    mutedDesc?: string;
  };
}

const CAREER_SLIDES: CareerSlide[] = [
  {
    year: '2026',
    left: {
      title: 'di9 디나인컴즈 입사',
      subtitle: '기획팀 사원 입사 · 2026.02-2026.12',
      period: '2026.02-2026.12',
      cardType: 'di9',
      bullets: [
        'UX 기획 및 서비스 운영 경험',
        '화면 설계 및 정책 정의',
        '개발·디자인 협업과 QA 경험',
        '실제 서비스 개선 및 고도화 프로젝트',
      ],
    },
    right: {
      title: '계원예술대학교 졸업',
      subtitle: '계원예술대학교 디지털미디어디자인학과\n기획 전공을 졸업.',
      period: education[0]?.period || '2024.03 - 2026.03',
      cardType: 'ati',
      caption: '아트랑 프로젝트 를 주제로 졸업 전시회 진행',
      linkText: '> 아트랑 웹사이트 확인 하기',
      linkHref: '#projects',
      mutedTitle: '우수 과목 연합 PT',
      mutedDesc: '프로젝트 프로포절\n프로젝트 매니징 우수 과목 연합 PT 진행',
    },
  },
  {
    year: '2025',
    left: {
      title: experience[1].position,
      subtitle: `${experience[1].company}\n${experience[1].description}`,
      period: experience[1].period,
      cardType: 'detail',
      bullets: experience[1].achievements,
      mutedTitle: '팀 프로젝트 리딩',
      mutedDesc: '기획 동아리 멘토링 콘텐츠 기획 및 제작',
    },
    right: {
      title: experience[2].position,
      subtitle: `${experience[2].company} · ${experience[2].period}`,
      period: experience[2].period,
      cardType: 'detail',
      bullets: experience[2].achievements,
    },
  },
  {
    year: '2024',
    left: {
      title: experience[0].position,
      subtitle: `${experience[0].company}\n${experience[0].description}`,
      period: experience[0].period,
      cardType: 'detail',
      bullets: experience[0].achievements,
      mutedTitle: education[0].school,
      mutedDesc: `${education[0].degree}\n${education[0].period}`,
    },
    right: {
      title: education[0].school,
      subtitle: education[0].degree,
      period: education[0].period,
      cardType: 'detail',
      bullets: [
        'UX/UI 기획 및 디지털 미디어 디자인 전공',
        '사용자 리서치 및 아이트래킹 분석 프로젝트',
        '화면설계서(SB) 및 프로토타이핑 실습',
      ],
    },
  },
  {
    year: '2022',
    left: {
      title: experience[3].position,
      subtitle: `${experience[3].company}\n${experience[3].description}`,
      period: experience[3].period,
      cardType: 'detail',
      bullets: experience[3].achievements,
      mutedTitle: education[1].school,
      mutedDesc: `${education[1].degree}\n${education[1].period}`,
    },
    right: {
      title: education[1].school,
      subtitle: education[1].degree,
      period: education[1].period,
      cardType: 'detail',
      bullets: [
        education[1].description,
        '기초 학업 과정 및 동아리 활동 이수',
      ],
    },
  },
];

// 반원(호) 궤적 애니메이션
const arcVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    rotate: direction > 0 ? 18 : -18,
    x: direction > 0 ? 110 : -110,
    y: direction > 0 ? 70 : -50,
    scale: 0.94,
  }),
  center: {
    opacity: 1,
    rotate: 0,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    rotate: direction > 0 ? -18 : 18,
    x: direction > 0 ? -110 : 110,
    y: direction > 0 ? -50 : 70,
    scale: 0.94,
    transition: {
      duration: 0.45,
      ease: [0.4, 0, 1, 1],
    },
  }),
};

export const ExperienceSection: React.FC<ExperienceSectionProps> = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const goToSlide = (nextIndex: number) => {
    const total = CAREER_SLIDES.length;
    const normalized = ((nextIndex % total) + total) % total;
    setDirection(nextIndex >= activeIndex ? 1 : -1);
    setActiveIndex(normalized);
  };

  const currentSlide = CAREER_SLIDES[activeIndex];
  const prevYears = CAREER_SLIDES.slice(0, activeIndex);
  const nextYears = CAREER_SLIDES.slice(activeIndex + 1);

  return (
    <section id="experience" className="relative w-full bg-white text-white overflow-hidden">
      <div className="pl-5 sm:pl-8 lg:pl-[60px]">
        <div className="relative bg-black">
          <div className="max-w-container mx-auto px-5 sm:px-8 lg:pr-[60px] lg:pl-14">
            <div className="relative grid lg:grid-cols-[360px_1fr_auto] gap-8 lg:gap-12 items-stretch min-h-[780px]">
              {/* 좌측 화이트 카드 (하단에 검은 배경이 살짝 보이도록 여백 유지) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative bg-white text-black p-8 sm:p-10 mb-6 sm:mb-8 flex flex-col justify-between min-h-[460px] lg:min-h-[740px] overflow-hidden"
              >
            <img
              src="/images/life-career-card.png"
              alt="User Experience"
              aria-hidden
              className="pointer-events-none absolute inset-0 w-full h-full object-cover object-bottom select-none"
            />
            <div className="relative z-10 pt-4">
              <h2 className="display-xl text-[clamp(2.75rem,5vw,80px)] leading-[1.1] text-black mb-6">
                Life
                <br />
                Career.
              </h2>
              <p className="text-lg font-medium text-[#505050] leading-[150%] tracking-[-0.025em] max-w-[230px]">
                우아함을 상징한 곡선을 모티브로 계층을 나타내다.
              </p>
            </div>
          </motion.div>

          {/* 중앙 블랙 커리어 반원 캐러셀 스테이지 */}
          <div className="relative flex flex-col justify-between py-12 sm:py-16 px-2 sm:px-6 overflow-hidden">
            {/* 이중 곡선 반원 아크 장식 (회전 반응) */}
            <motion.svg
              aria-hidden="true"
              viewBox="0 0 1100 820"
              fill="none"
              animate={{ rotate: activeIndex * -3 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: '20% 100%' }}
              className="pointer-events-none hidden lg:block absolute -left-24 top-0 w-[112%] h-full overflow-visible"
            >
              <path
                d="M -40 175 C 320 65, 760 220, 960 820"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="1.5"
              />
              <path
                d="M -40 190 C 315 80, 748 232, 945 820"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="1.5"
              />
            </motion.svg>

            {/* 반원 궤적 캐러셀 슬라이드 */}
            <div className="relative z-10 my-auto pt-6 min-h-[540px] flex items-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentSlide.year}
                  custom={direction}
                  variants={arcVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  style={{ transformOrigin: '15% 120%' }}
                  className="w-full grid xl:grid-cols-[minmax(0,410px)_minmax(0,340px)] gap-10 xl:gap-12 items-start"
                >
                  {/* 좌측 블록 */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-semibold tracking-[-0.025em] text-white mb-2">
                        {currentSlide.left.title}
                      </h3>
                      <p className="text-sm font-light leading-[145%] tracking-[-0.5px] text-white/70 whitespace-pre-line">
                        {currentSlide.left.subtitle}
                      </p>
                    </div>

                    {currentSlide.left.cardType === 'di9' ? (
                      <>
                        <div className="w-full max-w-[324px] h-[164px] bg-white text-[#111111] p-5 flex flex-col justify-between shadow-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-[10px] font-medium text-[#2B82C9] mb-0.5">기획팀 사원</p>
                              <p className="text-lg font-bold text-[#1D74BD] tracking-tight">장혜연</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-extrabold text-[#1D74BD] leading-none tracking-tight">
                                di9
                              </p>
                              <p className="text-[8px] font-semibold text-[#1D74BD] mt-0.5">디나인컴즈</p>
                            </div>
                          </div>

                          <div className="flex items-end justify-between gap-3">
                            <div className="text-[8px] text-[#3B82B8] leading-[1.45]">
                              <p>010-2807-5250 &nbsp; janghyeyeon57@di9.co.kr</p>
                              <p>06540 서울특별시 서초구 신반포로 23길 5 (잠원동) 3층</p>
                              <p>대표번호 02-3443-8052</p>
                            </div>
                            <div className="w-9 h-9 p-1 border border-[#1D74BD]/40 grid grid-cols-3 gap-0.5 flex-shrink-0">
                              <span className="bg-[#1D74BD]" />
                              <span className="bg-transparent" />
                              <span className="bg-[#1D74BD]" />
                              <span className="bg-transparent" />
                              <span className="bg-[#1D74BD]" />
                              <span className="bg-[#1D74BD]" />
                              <span className="bg-[#1D74BD]" />
                              <span className="bg-[#1D74BD]" />
                              <span className="bg-transparent" />
                            </div>
                          </div>
                        </div>

                        {currentSlide.left.bullets && (
                          <ul className="space-y-1.5 text-sm font-light leading-[145%] tracking-[-0.4px] text-white/70 pt-1">
                            {currentSlide.left.bullets.map((b) => (
                              <li key={b}>· {b}</li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : currentSlide.left.cardType === 'ati' ? (
                      <>
                        {/* ATI 명함 & 전시 부스 카드 */}
                        <div className="grid grid-cols-[1.9fr_1fr] w-full max-w-[410px] h-[170px] overflow-hidden border border-white/15 bg-[#111111]">
                          <div className="relative p-4 flex flex-col justify-between bg-gradient-to-br from-[#1B1B1D] via-[#101012] to-[#080809]">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-[9px] text-white/50 tracking-wide mb-0.5">Planner</p>
                                <p className="text-sm font-semibold text-white tracking-tight">
                                  장혜연{' '}
                                  <span className="text-[9px] font-normal text-white/55 ml-1">
                                    JANG HYE YEON
                                  </span>
                                </p>
                              </div>
                              <p className="text-[8px] text-white/45 text-right leading-tight">
                                한 손에 담기는 나만의 전시회
                                <br />
                                아트랑
                              </p>
                            </div>
                            <div className="flex items-end justify-between gap-2">
                              <div className="text-[8px] text-white/60 leading-relaxed space-y-0.5">
                                <p>
                                  <span className="text-white/40 mr-2">MOBILE</span>010-2807-5250
                                </p>
                                <p>
                                  <span className="text-white/40 mr-2">E-MAIL</span>janghyeyeon57@gmail.com
                                </p>
                              </div>
                              <span className="text-2xl font-extrabold tracking-tighter text-white leading-none">
                                AT/.
                              </span>
                            </div>
                          </div>

                          <div className="relative bg-[#EAE8E4] text-[#111111] p-3 flex flex-col justify-between overflow-hidden">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold tracking-tight">AT/.</span>
                              <span className="text-[8px] text-black/40">2025</span>
                            </div>
                            <div className="my-auto mx-auto w-full h-[88px] rounded bg-white shadow-sm border border-black/10 p-2 flex flex-col justify-between">
                              <div className="w-8 h-1.5 rounded-full bg-[#5C4AAE]/70" />
                              <div className="space-y-1">
                                <div className="w-full h-1.5 rounded bg-black/10" />
                                <div className="w-3/4 h-1.5 rounded bg-black/10" />
                              </div>
                              <div className="flex justify-end">
                                <span className="w-4 h-4 rounded-full bg-[#111111]" />
                              </div>
                            </div>
                            <p className="text-[8px] text-black/50 text-right">Graduation Exhibition</p>
                          </div>
                        </div>

                        {currentSlide.left.caption && (
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-light tracking-[-0.4px] text-white/70 max-w-[410px]">
                            <span>{currentSlide.left.caption}</span>
                            {currentSlide.left.linkText && (
                              <a
                                href={currentSlide.left.linkHref || '#projects'}
                                className="text-white/75 hover:text-white transition-colors"
                              >
                                {currentSlide.left.linkText}
                              </a>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full max-w-[410px] p-5 border border-white/15 bg-[#121215] space-y-3">
                        {currentSlide.left.period && (
                          <p className="text-xs text-white/45 tracking-wide">{currentSlide.left.period}</p>
                        )}
                        {currentSlide.left.bullets && (
                          <ul className="space-y-1.5 text-sm font-light text-white/80">
                            {currentSlide.left.bullets.map((b) => (
                              <li key={b}>· {b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    {currentSlide.left.mutedTitle && (
                      <div className="pt-4 opacity-100 md:opacity-45">
                        <h3 className="text-2xl font-semibold tracking-[-0.025em] text-white mb-2">
                          {currentSlide.left.mutedTitle}
                        </h3>
                        <p className="text-sm font-light leading-[140%] tracking-[-0.5px] text-white/70 whitespace-pre-line">
                          {currentSlide.left.mutedDesc}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 우측 블록 */}
                  <div className="xl:pt-40 space-y-5">
                    <div>
                      <h3 className="text-2xl font-semibold tracking-[-0.025em] text-white mb-1.5">
                        {currentSlide.right.title}
                      </h3>
                      <p className="text-sm font-light leading-[130%] tracking-[-0.5px] text-white/70">
                        {currentSlide.right.subtitle}
                      </p>
                    </div>

                    {currentSlide.right.cardType === 'ati' ? (
                      <>
                        <div className="grid grid-cols-[1.9fr_1fr] w-full max-w-[410px] h-[170px] overflow-hidden border border-white/15 bg-[#111111]">
                          <div className="relative p-4 flex flex-col justify-between bg-gradient-to-br from-[#1B1B1D] via-[#101012] to-[#080809]">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-[9px] text-white/50 tracking-wide mb-0.5">Planner</p>
                                <p className="text-sm font-semibold text-white tracking-tight">
                                  장혜연{' '}
                                  <span className="text-[9px] font-normal text-white/55 ml-1">
                                    JANG HYE YEON
                                  </span>
                                </p>
                              </div>
                              <p className="text-[8px] text-white/45 text-right leading-tight">
                                한 손에 담기는 나만의 전시회
                                <br />
                                아트랑
                              </p>
                            </div>
                            <div className="flex items-end justify-between gap-2">
                              <div className="text-[8px] text-white/60 leading-relaxed space-y-0.5">
                                <p>
                                  <span className="text-white/40 mr-2">MOBILE</span>010-2807-5250
                                </p>
                                <p>
                                  <span className="text-white/40 mr-2">E-MAIL</span>janghyeyeon57@gmail.com
                                </p>
                              </div>
                              <span className="text-2xl font-extrabold tracking-tighter text-white leading-none">
                                AT/.
                              </span>
                            </div>
                          </div>

                          <div className="relative bg-[#EAE8E4] text-[#111111] p-3 flex flex-col justify-between overflow-hidden">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold tracking-tight">AT/.</span>
                              <span className="text-[8px] text-black/40">2025</span>
                            </div>
                            <div className="my-auto mx-auto w-full h-[88px] rounded bg-white shadow-sm border border-black/10 p-2 flex flex-col justify-between">
                              <div className="w-8 h-1.5 rounded-full bg-[#5C4AAE]/70" />
                              <div className="space-y-1">
                                <div className="w-full h-1.5 rounded bg-black/10" />
                                <div className="w-3/4 h-1.5 rounded bg-black/10" />
                              </div>
                              <div className="flex justify-end">
                                <span className="w-4 h-4 rounded-full bg-[#111111]" />
                              </div>
                            </div>
                            <p className="text-[8px] text-black/50 text-right">Graduation Exhibition</p>
                          </div>
                        </div>

                        {currentSlide.right.caption && (
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-light tracking-[-0.4px] text-white/70 max-w-[410px]">
                            <span>{currentSlide.right.caption}</span>
                            {currentSlide.right.linkText && (
                              <a
                                href={currentSlide.right.linkHref || '#projects'}
                                className="text-white/75 hover:text-white transition-colors"
                              >
                                {currentSlide.right.linkText}
                              </a>
                            )}
                          </div>
                        )}

                        {currentSlide.right.mutedTitle && (
                          <div className="pt-4 opacity-100 md:opacity-45">
                            <h3 className="text-2xl font-semibold tracking-[-0.025em] text-white mb-2">
                              {currentSlide.right.mutedTitle}
                            </h3>
                            <p className="text-sm font-light leading-[140%] tracking-[-0.5px] text-white/70 whitespace-pre-line">
                              {currentSlide.right.mutedDesc}
                            </p>
                          </div>
                        )}
                      </>
                    ) : currentSlide.right.cardType === 'di9' ? (
                      <div className="w-full max-w-[324px] h-[164px] bg-white text-[#111111] p-5 flex flex-col justify-between shadow-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-[10px] font-medium text-[#2B82C9] mb-0.5">기획팀 사원</p>
                            <p className="text-lg font-bold text-[#1D74BD] tracking-tight">장혜연</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-extrabold text-[#1D74BD] leading-none tracking-tight">
                              di9
                            </p>
                            <p className="text-[8px] font-semibold text-[#1D74BD] mt-0.5">디나인컴즈</p>
                          </div>
                        </div>

                        <div className="flex items-end justify-between gap-3">
                          <div className="text-[8px] text-[#3B82B8] leading-[1.45]">
                            <p>010-2807-5250 &nbsp; janghyeyeon57@di9.co.kr</p>
                            <p>06540 서울특별시 서초구 신반포로 23길 5 (잠원동) 3층</p>
                            <p>대표번호 02-3443-8052</p>
                          </div>
                          <div className="w-9 h-9 p-1 border border-[#1D74BD]/40 grid grid-cols-3 gap-0.5 flex-shrink-0">
                            <span className="bg-[#1D74BD]" />
                            <span className="bg-transparent" />
                            <span className="bg-[#1D74BD]" />
                            <span className="bg-transparent" />
                            <span className="bg-[#1D74BD]" />
                            <span className="bg-[#1D74BD]" />
                            <span className="bg-[#1D74BD]" />
                            <span className="bg-[#1D74BD]" />
                            <span className="bg-transparent" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full max-w-[324px] p-5 bg-white text-[#111111] shadow-lg space-y-2">
                        <p className="text-xs font-medium text-[#5C4AAE]">
                          {currentSlide.right.period}
                        </p>
                        <p className="text-lg font-bold tracking-tight">{currentSlide.right.title}</p>
                        <p className="text-xs text-[#505050] leading-relaxed">
                          {currentSlide.right.subtitle}
                        </p>
                      </div>
                    )}

                    {currentSlide.right.bullets && currentSlide.right.bullets.length > 0 && (
                      <ul className="space-y-1.5 text-sm font-light leading-[145%] tracking-[-0.4px] text-white/70 pt-1">
                        {currentSlide.right.bullets.map((b) => (
                          <li key={b}>· {b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 하단 캐러셀 컨트롤 + 인디케이터 도트 */}
            <div className="relative z-10 mt-10 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => goToSlide(activeIndex - 1)}
                aria-label="이전 커리어"
                className="w-8 h-8 rounded-full border border-white/25 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-2">
                {CAREER_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.year}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    aria-label={`${slide.year}년 커리어 보기`}
                    className={`h-[7px] rounded-full transition-all duration-300 ${
                      idx === activeIndex
                        ? 'w-5 bg-white'
                        : 'w-[7px] bg-[#D9D9D9]/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => goToSlide(activeIndex + 1)}
                aria-label="다음 커리어"
                className="w-8 h-8 rounded-full border border-white/25 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* 우측 클릭 가능한 연도 컬럼 */}
          <div className="hidden lg:flex flex-col items-end justify-start gap-3 pt-12">
            {prevYears.map((s, idx) => (
              <button
                key={s.year}
                type="button"
                onClick={() => goToSlide(idx)}
                className="text-lg font-medium tracking-[-0.025em] text-white/50 hover:text-white transition-colors"
              >
                {s.year}
              </button>
            ))}

            <div className="my-4 w-[283px] text-right">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentSlide.year}
                  initial={{ opacity: 0, y: direction > 0 ? 18 : -18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: direction > 0 ? -18 : 18 }}
                  transition={{ duration: 0.35 }}
                  className="text-[120px] font-medium leading-none tracking-[-0.025em] text-white"
                >
                  {currentSlide.year}
                </motion.p>
              </AnimatePresence>
              <div className="mt-4 h-[2px] w-full bg-[#222222]" />
            </div>

            {nextYears.map((s, idx) => (
              <button
                key={s.year}
                type="button"
                onClick={() => goToSlide(activeIndex + 1 + idx)}
                className="text-lg font-medium tracking-[-0.025em] text-white/50 hover:text-white transition-colors"
              >
                {s.year}
              </button>
            ))}
          </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};
