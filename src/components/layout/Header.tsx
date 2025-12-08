'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Briefcase, Mail, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (pathname === '/') {
        const sections = ['home', 'projects', 'experience', 'skills', 'contact'];
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
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, isMounted]);

  const navItems = [
    { 
      label: '홈', 
      labelEn: 'Home',
      description: '기획자로서 나의 정체성 소개',
      href: '/#home', 
      icon: <Home size={16} /> 
    },
    { 
      label: '대표 프로젝트', 
      labelEn: 'Main Projects',
      description: '대표 프로젝트',
      href: '/#projects', 
      icon: <Briefcase size={16} /> 
    },
    { 
      label: '전체 프로젝트', 
      labelEn: 'All Projects',
      description: '모든 프로젝트 모아보기',
      href: '/projects', 
      icon: <Briefcase size={16} /> 
    },
    { 
      label: '나의 이력', 
      labelEn: 'My Experience',
      description: '학력·경력 여정',
      href: '/#experience', 
      icon: <Briefcase size={16} /> 
    },
    { 
      label: '나의 역량', 
      labelEn: 'My Skills',
      description: '기획 역량과 도구',
      href: '/#skills', 
      icon: <Briefcase size={16} /> 
    },
    { 
      label: '연락하기', 
      labelEn: 'Contact',
      description: '회사와의 연결 의지',
      href: '/#contact', 
      icon: <Mail size={16} /> 
    },
  ];

  // 관리자 페이지에서는 Header 숨기기
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // 전체 프로젝트 페이지에서는 다른 헤더 레이아웃
  const isProjectsPage = pathname === '/projects';

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/90 backdrop-blur-sm border-b border-line-medium py-3'
          : 'bg-white py-5'
      )}
    >
      <nav className="max-w-container mx-auto px-6 md:px-container-x">
        {isProjectsPage ? (
          // 전체 프로젝트 페이지 헤더
          <div className="flex items-center">
            {/* 홈으로 버튼 */}
            <Link href="/">
              <motion.button
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-text-secondary hover:text-brand-main transition-colors duration-300"
              >
                <ArrowLeft size={20} />
                <span className="text-sm font-medium">홈으로</span>
              </motion.button>
            </Link>
          </div>
        ) : (
          // 기본 헤더 레이아웃
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                href="/" 
                className="text-xl md:text-2xl font-light text-text-main hover:text-text-sub transition-colors tracking-tight"
              >
                Portfolio
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-4 lg:gap-6">
              {navItems.map((item) => {
                const isActive = item.href.startsWith('#') 
                  ? activeSection === item.href.replace('#', '')
                  : item.href.startsWith('/#')
                  ? pathname === '/' && activeSection === item.href.replace('/#', '')
                  : pathname === item.href;
                return (
                  <li key={item.href} className="relative group">
                    <Link
                      href={item.href}
                      prefetch={item.href === '/projects'}
                      className={cn(
                        'flex flex-col items-center gap-1 text-sm font-light transition-all duration-200 px-3 py-2 rounded-lg relative z-10',
                        isActive
                          ? 'text-brand-main bg-brand-main/5'
                          : 'text-text-secondary hover:text-brand-main hover:bg-brand-main/5'
                      )}
                    >
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <span className="hidden">{item.icon}</span>
                        <span>{item.label}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2 text-text-main"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        )}

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4 overflow-hidden border-t border-line-medium pt-4"
            >
              <ul className="flex flex-col gap-4">
                {navItems.map((item, index) => {
                  const isActive = item.href.startsWith('#') 
                    ? activeSection === item.href.replace('#', '')
                    : item.href.startsWith('/#')
                    ? pathname === '/' && activeSection === item.href.replace('/#', '')
                    : pathname === item.href;
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.15 }}
                    >
                      <Link
                        href={item.href}
                        prefetch={item.href === '/projects'}
                        className={cn(
                          'flex flex-col gap-1 py-3 px-4 rounded-lg transition-all',
                          isActive
                            ? 'text-brand-main bg-brand-main/5'
                            : 'text-text-secondary hover:text-brand-main hover:bg-brand-main/5'
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="text-sm font-medium">{item.label}</span>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-brand-main">{item.labelEn}</span>
                          <span className="text-xs text-text-tertiary">{item.description}</span>
                        </div>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};
