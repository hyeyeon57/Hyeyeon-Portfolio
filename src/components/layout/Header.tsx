'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (pathname === '/') {
        const sections = ['home', 'projects', 'skills', 'experience', 'contact'];
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, isMounted]);

  const navItems = [
    { key: 'home', href: '/#home' },
    { key: 'projects', href: '/#projects' },
    { key: 'skills', href: '/#skills' },
    { key: 'careers', href: '/#experience' },
    { key: 'contact', href: '/#contact' },
  ];

  // 관리자 페이지에서는 Header 숨기기
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const isProjectsPage = pathname === '/projects';
  // 히어로 위(스크롤 전, 홈)에서는 흰 글씨 / 스크롤 후·서브페이지에서는 검정 글씨
  const onDark = pathname === '/' && !isScrolled && !isProjectsPage;

  return (
    <motion.header
      className={cn(
        'fixed top-0 left-0 right-0 transition-all duration-500',
        isScrolled || isProjectsPage
          ? 'bg-white/95 backdrop-blur-md border-b border-line-light'
          : 'bg-transparent border-b border-transparent'
      )}
      style={{ zIndex: 1000, height: '80px' }}
    >
      <nav className="w-full h-full px-5 sm:px-8 lg:px-[60px]">
        <div className="max-w-container mx-auto h-full">
          {isProjectsPage ? (
            <div className="flex items-center h-full">
              <Link href="/">
                <motion.button
                  whileHover={{ x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-text-secondary hover:text-text-main transition-colors duration-300"
                >
                  <ArrowLeft size={20} />
                  <span className="text-sm font-medium">홈으로</span>
                </motion.button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full h-full">
              {/* 세리프 워드마크 */}
              <Link href="/" className="flex items-center flex-shrink-0 z-10">
                <span
                  className={cn(
                    'font-serif-display text-2xl sm:text-[28px] tracking-tight transition-colors duration-500',
                    onDark ? 'text-white' : 'text-text-main'
                  )}
                >
                  Jang hyeyeon
                </span>
              </Link>

              {/* 중앙 내비게이션 (알약 테두리) */}
              <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
                <ul className="flex items-center gap-3">
                  {navItems.map((item) => {
                    const isActive =
                      pathname === '/' &&
                      activeSection === item.href.replace('/#', '');
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            'inline-flex items-center justify-center px-5 py-3 rounded-pill text-lg transition-all duration-300 border',
                            onDark
                              ? isActive
                                ? 'border-white text-white'
                                : 'border-[#666666] text-white hover:border-white/70'
                              : isActive
                              ? 'border-text-main text-text-main'
                              : 'border-line-light text-text-secondary hover:text-text-main hover:border-text-main'
                          )}
                        >
                          {t(`nav.${item.key}`)}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* 우측: 언어 + Admin */}
              <div className="hidden lg:flex items-center gap-5 flex-shrink-0 z-10">
                <button
                  onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    onDark ? 'text-white/70 hover:text-white' : 'text-text-secondary hover:text-text-main'
                  )}
                  aria-label="언어 변경"
                >
                  {language === 'ko' ? 'KO' : 'EN'}
                </button>

                <Link href="/admin/login" target="_blank" rel="noopener noreferrer">
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      'inline-flex items-center gap-1.5 text-sm font-medium transition-colors',
                      onDark ? 'text-white/70 hover:text-white' : 'text-text-secondary hover:text-text-main'
                    )}
                  >
                    <span>Admin</span>
                    <ArrowUpRight size={15} />
                  </motion.button>
                </Link>
              </div>

              {/* 모바일 메뉴 버튼 */}
              <button
                className={cn('lg:hidden p-2 z-10 transition-colors', onDark ? 'text-white' : 'text-text-main')}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="메뉴 열기"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}

          {/* 모바일 내비게이션 */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm lg:hidden z-40 top-[80px]"
                  onClick={() => setIsMobileMenuOpen(false)}
                />

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-line-light shadow-lg z-50"
                >
                  <div className="px-6 py-6 space-y-1">
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.15 }}
                      >
                        <Link
                          href={item.href}
                          className="block py-3 text-base font-medium text-text-main"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {t(`nav.${item.key}`)}
                        </Link>
                      </motion.div>
                    ))}

                    <div className="pt-4 mt-4 border-t border-line-light flex items-center justify-between gap-4">
                      <button
                        onClick={() => {
                          setLanguage(language === 'ko' ? 'en' : 'ko');
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-sm font-medium text-text-secondary"
                      >
                        {language === 'ko' ? 'KO' : 'EN'}
                      </button>
                      <Link
                        href="/admin/login"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-main"
                      >
                        <span>Admin</span>
                        <ArrowUpRight size={15} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </motion.header>
  );
};
