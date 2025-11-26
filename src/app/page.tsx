'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ContactSection } from '@/components/sections/ContactSection';

export default function Home() {
  const [theme] = useState<'light' | 'dark'>('light');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isMounted, setIsMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    setIsMounted(true);
    
    // 방문자 로그 저장 (중복 방지)
    const logVisit = async () => {
      // 세션 스토리지를 사용하여 중복 방지
      const visitKey = `visit_${window.location.pathname}_${Date.now()}`;
      const lastVisitTime = sessionStorage.getItem('lastVisitTime');
      const now = Date.now();
      
      // 1초 이내 중복 요청 방지
      if (lastVisitTime && (now - parseInt(lastVisitTime)) < 1000) {
        return;
      }
      
      sessionStorage.setItem('lastVisitTime', now.toString());
      
      try {
        // 백오피스 서버 URL 설정
        // 프로덕션: 같은 프로젝트 내 서버리스 함수 사용
        // 개발: 로컬 BO 서버
        const getApiUrl = () => {
          if (process.env.NEXT_PUBLIC_BACKOFFICE_URL) {
            return process.env.NEXT_PUBLIC_BACKOFFICE_URL;
          }
          
          if (process.env.NODE_ENV === 'production') {
            // 프로덕션: 같은 도메인의 상대 경로 사용
            return '';
          }
          
          return 'http://localhost:3005';
        };
        
        const apiUrl = getApiUrl();
        // 프로덕션에서는 상대 경로(/bo-api), 개발에서는 절대 경로
        const fetchUrl = apiUrl 
          ? `${apiUrl}/bo-api/visitors`
          : '/bo-api/visitors';
        
        await fetch(fetchUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: window.location.pathname,
            userAgent: navigator.userAgent,
          }),
        });
      } catch (error) {
        // 방문자 로그 저장 실패는 무시 (FO 화면에 영향 없음)
        console.error('방문자 로그 저장 실패:', error);
      }
    };
    
    logVisit();
    
    // 해시가 있으면 해당 섹션으로 스크롤, 없으면 최상단으로
    const hash = window.location.hash;
    if (hash) {
      // 약간의 지연을 주어 DOM이 완전히 렌더링되도록 함
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-brand-main z-50 origin-left"
        style={{ scaleX }}
      />

      <motion.main 
        className="relative"
        style={{
          background: 'linear-gradient(135deg, #ECE9FF 0%, #F7F7FF 50%, #FFFFFF 100%)'
        }}
      >
        <HeroSection theme={theme} />
        <ProjectsSection theme={theme} />
        <ExperienceSection theme={theme} />
        <SkillsSection theme={theme} />
        <ContactSection theme={theme} />
      </motion.main>
    </>
  );
}
