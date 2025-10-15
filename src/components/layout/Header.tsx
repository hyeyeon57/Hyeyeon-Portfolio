'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Briefcase, GraduationCap, Wrench, Mail, Star, RefreshCw, Plus, Award, MapPin, Route } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

              // Update active section based on scroll position (only on home page)
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
  }, [pathname]);

  const navItems = [
    { label: '현위치', href: '/#home', icon: <RefreshCw size={18} /> },
    { label: '즐겨찾기 설정', href: '/#projects', icon: <Star size={18} /> },
    { label: '경유지 추가', href: '/#experience', icon: <Plus size={18} /> },
    { label: '운전 점수', href: '/#skills', icon: <Award size={18} /> },
    { label: '목적지 설정', href: '/#contact', icon: <MapPin size={18} /> },
    { label: '전체 경로보기', href: '/projects', icon: <Route size={18} /> },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-dark-bg/90 backdrop-blur-xl shadow-glow-yellow border-b border-dark-border py-4'
          : 'bg-transparent py-6'
      )}
    >
      <nav className="max-w-container mx-auto px-container-x">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/" 
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-point-yellow via-point-yellow-light to-point-yellow-dark text-transparent bg-clip-text hover:from-point-yellow-light hover:via-point-yellow hover:to-point-yellow-dark transition-all"
            >
              Portfolio
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-2 lg:gap-3 bg-dark-surface/90 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-glow-yellow border border-dark-border">
            {navItems.map((item) => {
              const isActive = item.href.startsWith('#') 
                ? activeSection === item.href.replace('#', '')
                : item.href.startsWith('/#')
                ? activeSection === item.href.replace('/#', '')
                : pathname === item.href;
              return (
                <li key={item.href}>
                  {item.href.startsWith('#') || item.href.startsWith('/#') ? (
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 cursor-pointer',
                        isActive
                          ? 'bg-gradient-to-r from-point-yellow to-point-yellow-dark text-dark-bg shadow-glow-yellow'
                          : 'text-text-secondary hover:bg-dark-bg hover:text-point-yellow'
                      )}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 cursor-pointer',
                        isActive
                          ? 'bg-gradient-to-r from-point-yellow to-point-yellow-dark text-dark-bg shadow-glow-yellow'
                          : 'text-text-secondary hover:bg-dark-bg hover:text-point-yellow'
                      )}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-3 rounded-xl bg-dark-surface shadow-glow-yellow text-text-secondary hover:text-point-yellow transition-colors border border-dark-border"
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
              className="md:hidden mt-4 overflow-hidden"
            >
              <ul className="flex flex-col gap-2 bg-dark-surface rounded-2xl p-4 shadow-glow-yellow-lg border border-dark-border">
                {navItems.map((item, index) => {
                  const isActive = item.href.startsWith('#') 
                    ? activeSection === item.href.replace('#', '')
                    : item.href.startsWith('/#')
                    ? activeSection === item.href.replace('/#', '')
                    : pathname === item.href;
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {item.href.startsWith('#') || item.href.startsWith('/#') ? (
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-200 font-medium cursor-pointer',
                            isActive
                              ? 'bg-gradient-to-r from-point-yellow to-point-yellow-dark text-dark-bg shadow-glow-yellow'
                              : 'text-text-secondary hover:bg-dark-bg hover:text-point-yellow'
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-200 font-medium cursor-pointer',
                            isActive
                              ? 'bg-gradient-to-r from-point-yellow to-point-yellow-dark text-dark-bg shadow-glow-yellow'
                              : 'text-text-secondary hover:bg-dark-bg hover:text-point-yellow'
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      )}
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
