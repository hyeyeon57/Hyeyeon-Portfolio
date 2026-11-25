'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SkillsSectionProps {
  theme?: 'light' | 'dark';
}

function MotionGraphicsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId = 0;
    let startTime = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const orbs = [
      { x: 0.22, y: 0.35, r: 0.42, color: 'rgba(108, 78, 224, 0.55)', speedX: 0.28, speedY: 0.21, phase: 0 },
      { x: 0.78, y: 0.62, r: 0.46, color: 'rgba(116, 224, 186, 0.38)', speedX: -0.22, speedY: 0.26, phase: 1.7 },
      { x: 0.52, y: 0.25, r: 0.36, color: 'rgba(164, 120, 255, 0.42)', speedX: 0.19, speedY: -0.24, phase: 3.1 },
      { x: 0.35, y: 0.78, r: 0.34, color: 'rgba(54, 42, 140, 0.55)', speedX: -0.17, speedY: -0.19, phase: 4.5 },
    ];

    const stars = Array.from({ length: 42 }, (_, i) => ({
      x: ((i * 73 + 11) % 100) / 100,
      y: ((i * 41 + 17) % 100) / 100,
      size: 2.2 + (i % 4) * 1.4,
      twinkleSpeed: 1.4 + (i % 5) * 0.55,
      phase: i * 1.37,
      drift: 0.004 + (i % 4) * 0.002,
      isFourPoint: i % 3 !== 0,
    }));

    const drawSparkleStar = (cx: number, cy: number, r: number, alpha: number) => {
      // 은은한 별빛 후광
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.6);
      glow.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.75})`);
      glow.addColorStop(0.45, `rgba(210, 225, 255, ${alpha * 0.25})`);
      glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 2.6, 0, Math.PI * 2);
      ctx.fill();

      // 4각 반짝이는 별 (✦)
      const inner = r * 0.22;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const radius = i % 2 === 0 ? r : inner;
        const angle = (i * Math.PI) / 4;
        const sx = cx + Math.cos(angle) * radius;
        const sy = cy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.fill();
    };

    const render = (now: number) => {
      const t = (now - startTime) * 0.001;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      // 1. Deep studio dark base
      ctx.fillStyle = '#0B0B10';
      ctx.fillRect(0, 0, w, h);

      // 2. Flowing volumetric gradient orbs
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (const orb of orbs) {
        const cx = (orb.x + Math.sin(t * orb.speedX + orb.phase) * 0.16) * w;
        const cy = (orb.y + Math.cos(t * orb.speedY + orb.phase) * 0.14) * h;
        const radius = Math.max(w, h) * orb.r;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 3. Flowing kinetic wave ribbons
      ctx.save();
      for (let line = 0; line < 4; line++) {
        ctx.beginPath();
        const baseY = h * (0.28 + line * 0.15);
        for (let x = 0; x <= w; x += 12) {
          const y =
            baseY +
            Math.sin(x * 0.0045 + t * (0.9 + line * 0.2) + line) * (24 + line * 8) +
            Math.cos(x * 0.002 - t * 0.6) * 14;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle =
          line % 2 === 0
            ? `rgba(180, 160, 255, ${0.14 - line * 0.02})`
            : `rgba(130, 232, 198, ${0.12 - line * 0.015})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
      ctx.restore();

      // 4. Rotating orbital ring
      ctx.save();
      ctx.translate(w * 0.5, h * 0.5);
      ctx.rotate(t * 0.14);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, Math.min(w, h) * 0.42, Math.min(w, h) * 0.19, 0.35, 0, Math.PI * 2);
      ctx.stroke();

      ctx.rotate(-t * 0.25);
      ctx.strokeStyle = 'rgba(166, 232, 198, 0.12)';
      ctx.beginPath();
      ctx.ellipse(0, 0, Math.min(w, h) * 0.34, Math.min(w, h) * 0.14, -0.45, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 5. Twinkling stars (반짝반짝 별)
      ctx.save();
      for (const s of stars) {
        const px = ((s.x + Math.sin(t * 0.15 + s.phase) * 0.008 + 1) % 1) * w;
        const py = ((s.y - t * s.drift + 10) % 1) * h;
        const twinkle = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.phase));
        const scale = 0.75 + 0.45 * twinkle;
        if (s.isFourPoint) {
          drawSparkleStar(px, py, s.size * scale, twinkle * 0.95);
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.7})`;
          ctx.beginPath();
          ctx.arc(px, py, s.size * 0.35 * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 w-full h-full"
    />
  );
}

export const SkillsSection: React.FC<SkillsSectionProps> = () => {
  return (
    <div id="skills">
      {/* 보라색 방사형 그래픽 섹션 (image/Ellipse 185 (7).png) */}
      <section className="relative w-full bg-white overflow-hidden pt-16 sm:pt-24">
        <div className="max-w-container mx-auto px-5 sm:px-8 lg:px-[60px] flex justify-center">
          <div className="relative w-[min(92vw,960px)] h-[min(46vw,480px)] overflow-hidden flex items-start justify-center">
            <motion.img
              src="/images/ellipse-185.png"
              alt=""
              aria-hidden
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={{ rotate: 360 }}
              transition={{
                opacity: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                scale: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                rotate: { repeat: Infinity, duration: 28, ease: 'linear' },
              }}
              className="w-full h-auto aspect-square object-contain origin-center select-none pointer-events-none"
            />
          </div>
        </div>
      </section>

      {/* 다크 섹션 + 장혜연 모션그래픽 배너 (Blending technology and artistry) */}
      <section className="relative w-full bg-[#111111] px-5 sm:px-8 lg:px-[60px] py-24 sm:py-36">
        <div className="max-w-container mx-auto">
          <div className="relative w-full min-h-[340px] sm:min-h-[480px] md:min-h-[600px] rounded-[40px] sm:rounded-[67px] flex items-center justify-center overflow-hidden bg-[#0B0B10]">
            {/* 실시간 60fps 장혜연 모션그래픽 캔버스 */}
            <MotionGraphicsCanvas />

            {/* 중앙 텍스트 가독성용 은은한 비네팅 오버레이 */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(11,11,16,0.28) 0%, rgba(11,11,16,0.52) 100%)',
              }}
            />

            <div className="relative z-10 flex flex-col items-center text-center px-6">
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center text-white font-normal text-[clamp(2rem,5vw,80px)] leading-[1.2] max-w-[752px] drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
              >
                Blending technology
                <br />
                and artistry
              </motion.h2>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
