'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface CursorFollowerProps {
  className?: string;
}

export default function CursorFollower({ className = '' }: CursorFollowerProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [followerPosition, setFollowerPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const animationRef = useRef<number>();

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // 호버 가능한 요소들 감지
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.classList.contains('cursor-pointer') ||
        target.classList.contains('hover:scale-105') ||
        target.classList.contains('hover:shadow-glow-yellow') ||
        target.classList.contains('hover:from-point-yellow-light') ||
        target.classList.contains('hover:border-point-yellow') ||
        target.classList.contains('hover:text-point-yellow') ||
        target.classList.contains('hover:bg-point-yellow') ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]');
      
      if (isInteractive) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.classList.contains('cursor-pointer') ||
        target.classList.contains('hover:scale-105') ||
        target.classList.contains('hover:shadow-glow-yellow') ||
        target.classList.contains('hover:from-point-yellow-light') ||
        target.classList.contains('hover:border-point-yellow') ||
        target.classList.contains('hover:text-point-yellow') ||
        target.classList.contains('hover:bg-point-yellow') ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]');
      
      if (isInteractive) {
        setIsHovering(false);
      }
    };

    // 애니메이션 루프
    const animate = () => {
      setFollowerPosition(prev => ({
        x: prev.x + (mousePosition.x - prev.x) * 0.15, // 0.15 = 딜레이/관성
        y: prev.y + (mousePosition.y - prev.y) * 0.15
      }));
      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    
    // 애니메이션 시작
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition.x, mousePosition.y]);

  return (
    <>
      {/* 메인 커서 점 (8px) */}
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none z-50 ${className}`}
        style={{
          x: mousePosition.x - 4, // 8px / 2 = 4px
          y: mousePosition.y - 4,
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
        }}
      >
        <div className="w-2 h-2 bg-point-yellow rounded-full shadow-glow-yellow" />
      </motion.div>

      {/* 따라오는 커서 점 (8px) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-40"
        style={{
          x: followerPosition.x - 4,
          y: followerPosition.y - 4,
        }}
        animate={{
          scale: isHovering ? 1.2 : 1,
          opacity: 0.8,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      >
        <div className="w-2 h-2 bg-point-yellow/60 rounded-full" />
      </motion.div>

      {/* 연결선 (1.5px) */}
      <svg
        className="fixed top-0 left-0 pointer-events-none z-35"
        style={{ width: '100vw', height: '100vh' }}
      >
        <line
          x1={mousePosition.x}
          y1={mousePosition.y}
          x2={followerPosition.x}
          y2={followerPosition.y}
          stroke="#FFD700"
          strokeWidth="1.5"
          opacity={0.6}
          className="transition-opacity duration-300"
        />
      </svg>
    </>
  );
}
