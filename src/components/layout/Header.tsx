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
  const pathname = usePathname();

  useEffect(() => {
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
  }, [pathname]);

  const navItems = [
    { label: 'Home', href: '/#home', icon: <Home size={16} /> },
    { label: 'Projects', href: '/#projects', icon: <Briefcase size={16} /> },
    { label: 'Experience', href: '/#experience', icon: <Briefcase size={16} /> },
    { label: 'Skills', href: '/#skills', icon: <Briefcase size={16} /> },
    { label: 'Contact', href: '/#contact', icon: <Mail size={16} /> },
    { label: 'All Projects', href: '/projects', icon: <Briefcase size={16} /> },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-bg-light/90 backdrop-blur-sm border-b border-line-medium py-3'
          : 'bg-bg-light py-5'
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
          <ul className="hidden md:flex items-center gap-8 lg:gap-10">
            {navItems.map((item) => {
              const isActive = item.href.startsWith('#') 
                ? activeSection === item.href.replace('#', '')
                : item.href.startsWith('/#')
                ? pathname === '/' && activeSection === item.href.replace('/#', '')
                : pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 text-sm font-light transition-colors duration-200 border-b-[1px] pb-1',
                      isActive
                        ? 'text-brand-main border-brand-main'
                        : 'text-text-secondary border-transparent hover:text-brand-main hover:border-brand-main/30'
                    )}
                  >
                    <span className="hidden">{item.icon}</span>
                    <span>{item.label}</span>
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
                          'flex items-center gap-3 text-sm font-light py-2 transition-colors',
                          isActive
                            ? 'text-brand-main'
                            : 'text-text-secondary hover:text-brand-main'
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span>{item.label}</span>
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
