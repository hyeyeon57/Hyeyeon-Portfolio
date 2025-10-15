'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, GraduationCap, Linkedin, Instagram, Globe, ChevronUp } from 'lucide-react';
import { personalInfo } from '@/data/portfolio';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, url: personalInfo.social?.linkedin || '#' },
    { name: 'Notion', icon: <Globe className="w-5 h-5" />, url: personalInfo.social?.notion || '#' },
    { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, url: personalInfo.social?.instagram || '#' },
  ];

  return (
    <footer className="relative bg-dark-footer border-t border-dark-border pt-16 pb-8">
      <div className="max-w-container mx-auto px-container-x">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* 왼쪽: 자기소개 + SNS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">{personalInfo.name}</h3>
              <p className="text-text-secondary text-lg leading-relaxed max-w-md">
                {personalInfo.bio}
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-dark-surface border border-dark-border rounded-full text-text-secondary hover:text-point-yellow hover:border-point-yellow transition-all duration-300 hover:shadow-glow-yellow"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* 오른쪽: Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h4 className="text-xl font-bold text-white mb-6">Contact Info</h4>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-10 h-10 bg-dark-surface rounded-lg flex items-center justify-center text-point-yellow border border-dark-border group-hover:border-point-yellow transition-all duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-text-tertiary text-sm mb-1">Email</p>
                  <a 
                    href={`mailto:${personalInfo.email}`}
                    className="text-white text-lg hover:text-point-yellow transition-colors"
                  >
                    {personalInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-10 h-10 bg-dark-surface rounded-lg flex items-center justify-center text-point-yellow border border-dark-border group-hover:border-point-yellow transition-all duration-300">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-text-tertiary text-sm mb-1">Phone</p>
                  <a 
                    href={`tel:${personalInfo.phone}`}
                    className="text-white text-lg hover:text-point-yellow transition-colors"
                  >
                    {personalInfo.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-10 h-10 bg-dark-surface rounded-lg flex items-center justify-center text-point-yellow border border-dark-border group-hover:border-point-yellow transition-all duration-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-text-tertiary text-sm mb-1">Location</p>
                  <p className="text-white text-lg">{personalInfo.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-10 h-10 bg-dark-surface rounded-lg flex items-center justify-center text-point-yellow border border-dark-border group-hover:border-point-yellow transition-all duration-300">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-text-tertiary text-sm mb-1">Education</p>
                  <p className="text-white text-lg">Kaywon University of Arts</p>
                  <p className="text-text-tertiary text-sm">디지털미디어디자인과 (기획 전공)</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 구분선 */}
        <div className="h-px bg-dark-border mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-text-tertiary text-sm">
          <p>
            © 2025 {personalInfo.name}. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-point-yellow transition-colors">
              Privacy Policy
            </a>
            <span>·</span>
            <a href="#" className="hover:text-point-yellow transition-colors">
              Terms of Service
            </a>
            <span>·</span>
            <a href="#" className="hover:text-point-yellow transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-14 h-14 bg-point-yellow text-dark-bg rounded-full flex items-center justify-center shadow-glow-yellow-lg hover:shadow-glow-yellow hover:scale-110 transition-all duration-300 z-50"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronUp className="w-6 h-6" />
      </motion.button>
    </footer>
  );
};
