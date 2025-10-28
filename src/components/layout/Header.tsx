'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Briefcase, Mail } from 'lucide-react';
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
      label: '출발지', 
      labelEn: 'Start',
      description: '기획자로서 나의 정체성 소개',
      href: '/#home', 
      icon: <Home size={16} /> 
    },
    { 
      label: '즐겨찾기', 
      labelEn: 'Main Projects',
      description: '대표 프로젝트',
      href: '/#projects', 
      icon: <Briefcase size={16} /> 
    },
    { 
      label: '경유지', 
      labelEn: 'My Waypoint',
      description: '학력·경력 여정',
      href: '/#experience', 
      icon: <Briefcase size={16} /> 
    },
    { 
      label: '주행 기록', 
      labelEn: 'UX Skills Log',
      description: '기획 역량과 도구',
      href: '/#skills', 
      icon: <Briefcase size={16} /> 
    },
    { 
      label: '최종 목적지', 
      labelEn: 'Contact & Closing',
      description: '회사와의 연결 의지',
      href: '/#contact', 
      icon: <Mail size={16} /> 
    },
    { 
      label: '전체 경로보기', 
      labelEn: 'All Projects',
      description: '모든 프로젝트 모아보기',
      href: '/projects', 
      icon: <Briefcase size={16} /> 
    },
  ];

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
                  
                  {/* 호버 설명 - 탭 중앙 정렬 */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50 whitespace-nowrap">
                    <div className="bg-white border border-line-medium rounded-lg p-3 shadow-lg relative mx-auto">
                      {/* 화살표 */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 border-l border-t border-line-medium bg-white transform rotate-45"></div>
                      
                      <div className="text-xs text-brand-main font-semibold mb-1 text-center">
                        {item.labelEn}
                      </div>
                      <div className="text-xs text-text-secondary text-center">
                        {item.description}
                      </div>
                    </div>
                  </div>
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
