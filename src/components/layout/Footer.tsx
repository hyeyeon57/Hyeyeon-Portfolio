'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { personalInfo } from '@/data/portfolio';

export const Footer: React.FC = () => {
  const [isAtTop, setIsAtTop] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 상태 설정
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 불꽃놀이 효과 (하늘로 올라갔다가 터짐)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isMounted) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const colors = ['#9575CD', '#7986CB', '#9FA8DA', '#B39DDB', '#CE93D8', '#B2EBF2', '#BA68C8'];
    
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      life: number;
      rotation: number;
      shape: 'circle' | 'line' | 'ribbon';
    }

    const particles: Particle[] = [];
    const rockets: Array<{ x: number; y: number; speedY: number; color: string; explodeHeight: number }> = [];
    
    // 발사 위치들 (왼쪽에서 2곳, 오른쪽에서 1곳)
    const launchPoints = [
      { x: canvas.width * 0.15, y: canvas.height },  // 왼쪽 1
      { x: canvas.width * 0.25, y: canvas.height },  // 왼쪽 2
      { x: canvas.width * 0.85, y: canvas.height },  // 오른쪽
    ];

    // 로켓 생성 함수 (보라색 원)
    const createRocket = (index: number, explodeHeight: number, speed: number) => {
      const launchPoint = launchPoints[index];
      rockets.push({
        x: launchPoint.x,
        y: canvas.height,
        speedY: speed,
        color: '#7A68F6',
        explodeHeight: explodeHeight
      });
    };

    // 로켓이 위로 올라가다가 터지는 폭죽 생성 (원형만)
    const createExplosion = (x: number, y: number) => {
      for (let i = 0; i < 50; i++) {
        const angle = (Math.PI * 2 * i) / 50;
        const speed = Math.random() * 6 + 3;
        
        particles.push({
          x: x,
          y: y,
          size: Math.random() * 8 + 4,
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          life: 120,
          rotation: Math.random() * Math.PI * 2,
          shape: 'circle' // 원형만 사용
        });
      }
    };

    // 폭죽 발사 함수 (불규칙하게 터짐)
    const launchFireworks = () => {
      // 로켓 여러 개를 불규칙한 타이밍에 발사
      const positions = [0, 1, 2]; // 왼쪽 2개, 오른쪽 1개
      
      positions.forEach((pos, index) => {
        // 랜덤한 시간차를 두고 발사
        setTimeout(() => {
          // 하나는 낮게, 나머지는 다양한 높이
          let randomHeight;
          if (index === 0) {
            // 첫 번째는 낮게 (40-60%)
            randomHeight = canvas.height * (0.4 + Math.random() * 0.2);
          } else {
            // 나머지는 다양한 높이 (15-45%)
            randomHeight = canvas.height * (0.15 + Math.random() * 0.3);
          }
          const randomSpeed = -(Math.random() * 3 + 3); // -3 ~ -6 사이
          createRocket(pos, randomHeight, randomSpeed);
        }, index * 500 + Math.random() * 1000); // 0ms, 500ms, 1000ms + 랜덤
      });
    };

    // Thank You 배지 주변에서 색종이 터지는 효과
    const createConfetti = (centerX: number, centerY: number) => {
      // 첫 번째 파도 - 강하게 터짐
      for (let i = 0; i < 100; i++) {
        const angle = (Math.PI * 2 * i) / 100;
        const speed = Math.random() * 10 + 8;
        
        particles.push({
          x: centerX,
          y: centerY,
          size: Math.random() * 12 + 6,
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed - 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          life: 120,
          rotation: Math.random() * Math.PI * 2,
          shape: 'circle'
        });
      }
      
      // 두 번째 파도 - 약간 늦게, 조금 더 천천히
      setTimeout(() => {
        for (let i = 0; i < 60; i++) {
          const angle = (Math.PI * 2 * i) / 60;
          const speed = Math.random() * 6 + 4;
          
          particles.push({
            x: centerX,
            y: centerY,
            size: Math.random() * 10 + 5,
            speedX: Math.cos(angle) * speed,
            speedY: Math.sin(angle) * speed - 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
            life: 100,
            rotation: Math.random() * Math.PI * 2,
            shape: 'circle'
          });
        }
      }, 200);
    };

    // Thank You 섹션에 스크롤될 때 색종이와 폭죽 발사 (IntersectionObserver 사용)
    let hasLaunched = sessionStorage.getItem('fireworksLaunched') === 'true';
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasLaunched) {
          // 첫 진입 시에만 발사
          hasLaunched = true;
          sessionStorage.setItem('fireworksLaunched', 'true');
          
          // 파티클과 로켓 초기화
          particles.length = 0;
          rockets.length = 0;
          
          // 0.5초 후 Thank You 배지 중앙에서 색종이 터트림 (페이드인과 동시)
          setTimeout(() => {
            const centerX = canvas.width / 2;
            const centerY = canvas.height * 0.25; // 상단 25% 지점
            createConfetti(centerX, centerY);
          }, 500);
          
          // 0.6초 후 폭죽 발사
          setTimeout(() => {
            launchFireworks();
          }, 600);
        }
      });
    }, { threshold: 0.3 });

    const observerElement = document.querySelector('footer');
    if (observerElement) {
      observer.observe(observerElement);
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 로켓 애니메이션 (보라색 원이 위로 올라감)
      rockets.forEach((rocket, rocketIndex) => {
        rocket.y += rocket.speedY;
        
        // 로켓 그리기 (보라색 원 - 완벽한 원형)
        ctx.save();
        const radius = 10;
        ctx.beginPath();
        ctx.arc(rocket.x, rocket.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = rocket.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = rocket.color;
        ctx.fill();
        ctx.restore();

        // 각 로켓이 설정된 높이에서 폭발
        if (rocket.y < rocket.explodeHeight) {
          createExplosion(rocket.x, rocket.y);
          rockets.splice(rocketIndex, 1);
        }
      });

      // 폭죽 파티클 애니메이션
      particles.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.speedY += 0.15; // 중력 (더 천천히)
        particle.life -= 0.8; // 더 천천히 사라짐
        particle.alpha = Math.max(0, particle.life / 100);
        particle.size *= 0.99;
        particle.rotation += 0.05; // 회전

        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.globalAlpha = particle.alpha;

        if (particle.shape === 'circle') {
          // 원형 색종이
          ctx.beginPath();
          ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
        } else if (particle.shape === 'line') {
          // 짧은 선
          ctx.beginPath();
          ctx.moveTo(-particle.size * 2, 0);
          ctx.lineTo(particle.size * 2, 0);
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.stroke();
        } else if (particle.shape === 'ribbon') {
          // 구불구불한 리본
          ctx.beginPath();
          for (let i = -4; i <= 4; i++) {
            ctx.lineTo(i * 5, Math.sin(i * 0.5) * particle.size * 2);
          }
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 4;
          ctx.stroke();
        }

        ctx.restore();

        // 오래된 파티클 제거
        if (particle.life <= 0) {
          particles.splice(index, 1);
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (typeof window !== 'undefined') {
        cancelAnimationFrame(animationId);
        observer.disconnect();
      }
    };
  }, [isMounted]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-white border-t border-line-light">
      {/* 파티클 효과 Canvas - 클라이언트에서만 렌더링 */}
      {isMounted && (
        <canvas 
          ref={canvasRef} 
          className="absolute top-0 left-0 w-full h-96 pointer-events-none opacity-40 z-0"
        />
      )}
      
      {/* 마무리 메시지 섹션 */}
      <div className="max-w-container mx-auto px-6 md:px-container-x relative z-10" style={{ paddingTop: '12rem', paddingBottom: '24rem' }}>
        <div className="text-center max-w-3xl mx-auto">
          {/* Thank You 배지 - 파티클 효과만 */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="inline-block px-8 py-4 bg-gradient-to-r from-brand-main/20 via-brand-main/30 to-brand-main/20 rounded-full border-2 border-brand-main/40 mb-6 backdrop-blur-sm shadow-lg">
              <p className="text-base font-bold text-brand-main">
                Thank You
              </p>
            </div>
          </motion.div>

          {/* 첫 번째 텍스트 - 폭죽 후 등장 */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
            className="text-3xl md:text-4xl font-light text-text-main mb-6 leading-relaxed"
          >
            끝까지 제 포트폴리오를 봐주셔서 감사합니다.
          </motion.h2>

          {/* 두 번째 텍스트 - 더 늦게 등장 */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 2, ease: "easeOut" }}
            className="text-lg md:text-xl text-text-sub font-light leading-relaxed mb-8"
          >
            이 길의 끝에서, 저의 새로운 출발을 함께할 수 있길 바랍니다.
          </motion.p>
          
          {/* 장식 라인 */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8, delay: 2.3 }}
            className="w-24 h-px bg-gradient-to-r from-transparent via-brand-main to-transparent mx-auto"
          />
        </div>
      </div>

      {/* Footer 영역 */}
      <div className="border-t border-line-medium bg-bg-light">
        <div className="max-w-container mx-auto px-6 md:px-container-x py-12">
          {/* Footer 상단 */}
          <div className="mb-8">
            <div className="max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-light text-text-main mb-3">
                {personalInfo.name}
              </h3>
              <p className="text-base text-text-sub leading-relaxed">
                막다른 길에서도 또 다른 경로를 찾아내는<br />
                <span className="font-bold">내비게이션 같은 기획자</span>입니다.
              </p>
            </div>
          </div>

          {/* 구분선 */}
          <div className="h-px bg-line-medium mb-8" />

          {/* Footer 하단 */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-text-secondary">
              © 2025 {personalInfo.name}. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-text-secondary hover:text-brand-main transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-text-secondary hover:text-brand-main transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-text-secondary hover:text-brand-main transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Button (Top/Bottom) */}
      <motion.button
        onClick={isAtTop ? scrollToBottom : scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-brand-main text-white rounded-full flex items-center justify-center hover:opacity-90 transition-all duration-300 z-50 shadow-lg"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: isAtTop ? 5 : -5 }}
        whileTap={{ scale: 0.9 }}
        title={isAtTop ? '하단으로 이동' : '상단으로 이동'}
      >
        {isAtTop ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
      </motion.button>
    </footer>
  );
};
