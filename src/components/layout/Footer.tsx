'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Instagram, Globe, ChevronUp } from 'lucide-react';
import { personalInfo } from '@/data/portfolio';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { name: 'LinkedIn', icon: <Linkedin className="w-4 h-4" />, url: personalInfo.social?.linkedin || '#' },
    { name: 'Notion', icon: <Globe className="w-4 h-4" />, url: personalInfo.social?.notion || '#' },
    { name: 'Instagram', icon: <Instagram className="w-4 h-4" />, url: personalInfo.social?.instagram || '#' },
  ];

  return (
    <footer className="relative bg-white border-t border-gray-200 pt-24 pb-12">
      <div className="max-w-container mx-auto px-6 md:px-container-x">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* 왼쪽: 자기소개 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-light text-black mb-4">{personalInfo.name}</h3>
              <p className="text-sm font-light text-gray-600 leading-relaxed max-w-md">
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
                  className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full text-gray-600 hover:text-black hover:border-black transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
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
            className="space-y-8"
          >
            <h4 className="text-sm font-light text-black mb-6 uppercase tracking-widest">Contact</h4>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <a 
                    href={`mailto:${personalInfo.email}`}
                    className="text-sm font-light text-black hover:text-gray-500 transition-colors"
                  >
                    {personalInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <a 
                    href={`tel:${personalInfo.phone}`}
                    className="text-sm font-light text-black hover:text-gray-500 transition-colors"
                  >
                    {personalInfo.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm font-light text-white">{personalInfo.location}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 구분선 */}
        <div className="h-px bg-gray-200 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-gray-400">
          <p>
            © 2025 {personalInfo.name}. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-black transition-colors">
              Privacy
            </a>
            <span>·</span>
            <a href="#" className="hover:text-black transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
                onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all duration-300 z-50"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
};
