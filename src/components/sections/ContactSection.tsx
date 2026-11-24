'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Linkedin, Globe, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { personalInfo, projects } from '@/data/portfolio';
import { useContactForm } from '@/hooks/useContactForm';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContactSectionProps {
  theme?: 'light' | 'dark';
}

export const ContactSection: React.FC<ContactSectionProps> = () => {
  const { formData, isSubmitted, isSubmitting, error, handleChange, handleSubmit } = useContactForm();
  const { t } = useLanguage();

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const inputClass =
    'w-full bg-transparent border-b border-line-light py-4 text-text-main placeholder-text-disabled focus:outline-none focus:border-text-main transition-colors duration-300';

  const magazineItems = projects.slice(0, 4);

  return (
    <section id="contact" className="relative w-full bg-white text-text-main">
      {/* Magazine */}
      <div className="max-w-container mx-auto px-5 sm:px-8 lg:px-[60px] pt-24 sm:pt-32 md:pt-40 pb-20">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="display-xl text-[clamp(2.75rem,6vw,80px)] leading-[1.1] text-black mb-12 sm:mb-16"
        >
          Magazine
        </motion.h2>

        <div className="border-t border-line-light">
          {magazineItems.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="grid grid-cols-1 md:grid-cols-[100px_minmax(0,400px)_1fr] gap-6 md:gap-10 py-8 sm:py-10 border-b border-line-light items-start"
            >
              <p className="text-xl font-semibold text-black leading-[110%]">
                {item.date || '2023.10.10'}
              </p>

              <div className="relative w-full aspect-[400/280] bg-[#D9D9D9] overflow-hidden">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    unoptimized={item.image?.startsWith('http') || item.image?.startsWith('//')}
                  />
                )}
              </div>

              <div className="flex flex-col min-h-[200px]">
                <h3 className="text-2xl font-medium tracking-[-0.025em] text-text-main mb-3">
                  {item.title}
                </h3>
                <p className="text-lg text-text-secondary leading-[26px] tracking-[-0.025em] line-clamp-3 mb-auto">
                  {item.description}
                </p>
                <Link
                  href="/projects"
                  className="link-arrow mt-8 text-base text-text-secondary hover:text-text-main"
                >
                  자세히보기
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Contact form */}
      <div className="max-w-container mx-auto px-5 sm:px-8 lg:px-[60px] pb-24 sm:pb-32 md:pb-40">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 sm:mb-20"
        >
          <p className="text-sm tracking-[0.2em] uppercase text-text-secondary mb-5">
            {t('contact.label')}
          </p>
          <h2 className="display-xl text-5xl sm:text-7xl md:text-8xl lg:text-[110px] max-w-4xl">
            Let&rsquo;s work together
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-0"
          >
            <p className="text-text-sub leading-relaxed mb-10 max-w-md">
              {t('contact.description')}
            </p>

            {[
              {
                label: 'Email',
                value: personalInfo.email,
                href: `mailto:${personalInfo.email}`,
              },
              {
                label: 'Phone',
                value: personalInfo.phone,
                copy: true,
              },
              {
                label: 'Location',
                value: personalInfo.location,
              },
            ].map((row) => (
              <div key={row.label} className="border-b border-line-light py-5">
                <p className="text-xs tracking-[0.15em] uppercase text-text-disabled mb-2">
                  {row.label}
                </p>
                {row.href ? (
                  <a
                    href={row.href}
                    className="inline-flex items-center gap-2 text-lg text-text-main hover:opacity-70 transition-opacity"
                  >
                    {row.value}
                    <ArrowRight size={16} />
                  </a>
                ) : row.copy ? (
                  <button
                    type="button"
                    onClick={() => handleCopy(row.value, row.label)}
                    className="inline-flex items-center gap-2 text-lg text-text-main hover:opacity-70 transition-opacity"
                  >
                    {row.value}
                    {isMounted && copiedField === row.label ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <span className="text-xs text-text-disabled">복사</span>
                    )}
                  </button>
                ) : (
                  <p className="text-lg text-text-main">{row.value}</p>
                )}
              </div>
            ))}

            <div className="flex items-center gap-3 pt-8">
              {personalInfo.social.linkedin && (
                <a
                  href={personalInfo.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full border border-line-light flex items-center justify-center hover:bg-text-main hover:text-white hover:border-text-main transition-colors"
                >
                  <Linkedin size={16} />
                </a>
              )}
              {personalInfo.social.notion && personalInfo.social.notion !== '#' && (
                <a
                  href={personalInfo.social.notion}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full border border-line-light flex items-center justify-center hover:bg-text-main hover:text-white hover:border-text-main transition-colors"
                >
                  <Globe size={16} />
                </a>
              )}
              {personalInfo.social.brunch && (
                <a
                  href={personalInfo.social.brunch}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full border border-line-light flex items-center justify-center text-sm font-medium hover:bg-text-main hover:text-white hover:border-text-main transition-colors"
                >
                  b
                </a>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {isSubmitted ? (
              <div className="flex flex-col items-start gap-4 py-10">
                <CheckCircle className="w-10 h-10 text-text-main" />
                <p className="text-2xl font-medium">메시지가 전송되었습니다.</p>
                <p className="text-text-secondary">빠르게 답변 드리겠습니다.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-xs tracking-[0.12em] uppercase text-text-disabled mb-1">
                    이름 *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="이름"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.12em] uppercase text-text-disabled mb-1">
                    이메일 *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="janghyeyeon57@gmail.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.12em] uppercase text-text-disabled mb-1">
                    메시지 *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="프로젝트 제안, 협업 문의, 채용 관련 연락 모두 환영합니다.&#10;궁금한 점이나 간단한 내용 남겨주시면 최대한 빠르게 답변 드리겠습니다."
                    className={`${inputClass} resize-none`}
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <p className="text-xs text-text-disabled">* 필수 입력 항목입니다</p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-pill btn-pill-outline-dark disabled:opacity-50"
                >
                  {isSubmitting ? '전송 중...' : '메시지 보내기'}
                  <ArrowRight size={18} />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
