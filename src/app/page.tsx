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
    
    // 방문자 로그 저장 (visitorId 생성 및 중복 방지)
    const logVisit = async () => {
      const lastVisitTime = sessionStorage.getItem('lastVisitTime');
      const now = Date.now();
      
      // 1초 이내 중복 요청 방지
      if (lastVisitTime && (now - parseInt(lastVisitTime)) < 1000) {
        return;
      }
      
      sessionStorage.setItem('lastVisitTime', now.toString());

      // visitorId 생성/로드 (localStorage)
      const VISITOR_KEY = 'visitorId';
      let visitorId = localStorage.getItem(VISITOR_KEY);
      if (!visitorId) {
        visitorId = (typeof crypto !== 'undefined' && crypto.randomUUID)
          ? crypto.randomUUID()
          : `vid_${Date.now()}_${Math.random().toString(16).slice(2)}`;
        localStorage.setItem(VISITOR_KEY, visitorId);
      }
      
      try {
        // 백오피스 API URL 사용 (통합 API 설정)
        const { getBackofficeApiUrl } = await import('@/lib/api-config');
        const fetchUrl = getBackofficeApiUrl('/visitors');
        
        await fetch(fetchUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            visitorId,
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
    
    // ScrollToTop 컴포넌트에서 처리하므로 여기서는 제거
    // 해시가 있으면 해당 섹션으로 스크롤하는 것은 ScrollToTop에서 처리
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
