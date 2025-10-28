'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, Linkedin, Globe, Check } from 'lucide-react';
import { personalInfo } from '@/data/portfolio';

interface ContactSectionProps {
  theme?: 'light' | 'dark';
}

export const ContactSection: React.FC<ContactSectionProps> = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // mailto 링크 생성
    const subject = encodeURIComponent(`[포트폴리오 문의] ${formData.name}님의 메시지`);
    const body = encodeURIComponent(
      `이름: ${formData.name}\n이메일: ${formData.email}\n\n메시지:\n${formData.message}`
    );
    const mailtoLink = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
    
    // 이메일 클라이언트 열기
    window.location.href = mailtoLink;
    
    // 폼 초기화
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      {/* 상단 그라데이션 마스크 */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/0 to-transparent pointer-events-none z-0" />
      {/* 하단 그라데이션 마스크 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/0 to-transparent pointer-events-none z-0" />

      <div className="max-w-container mx-auto px-container-x relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 bg-brand-main/10 text-brand-main rounded-full text-sm font-semibold mb-4 border border-brand-main/30"
          >
            Contact
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-light text-text-main mb-4">
            연락하기
          </h2>
          <p className="text-xl text-text-sub max-w-2xl mx-auto">
            프로젝트 문의나 협업 제안이 있으시다면 언제든 연락주세요!
          </p>
        </motion.div>

        {/* Contact Form - Full width on top */}
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto mb-20"
          >
            <div className="bg-white p-8 lg:p-10 rounded-3xl shadow minimal-lg border border-line-medium">
              <h3 className="text-3xl font-bold text-text-main mb-2">
                메시지 보내기
              </h3>
              <p className="text-text-secondary mb-8">
                아래 양식을 작성해주시면 빠르게 연락드리겠습니다.
              </p>

              {isSubmitted ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 360] }}
                    transition={{ duration: 0.6 }}
                    className="w-20 h-20 rounded-full bg-brand-main text-white flex items-center justify-center mb-6 shadow minimal"
                  >
                    <CheckCircle size={40} />
                  </motion.div>
                  <h4 className="text-2xl font-bold text-text-main mb-2">메시지 전송 완료!</h4>
                  <p className="text-text-secondary text-center">
                    메시지를 성공적으로 보냈습니다.<br />
                    빠른 시일 내에 연락드리겠습니다.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">
                      이름 *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="홍길동"
                      required
                      className="w-full px-5 py-4 border-2 border-line-medium rounded-xl text-text-main placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-main focus:border-transparent transition-all duration-200 hover:border-brand-main/50 bg-bg-dark"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">
                      이메일 *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="hello@example.com"
                      required
                      className="w-full px-5 py-4 border-2 border-line-medium rounded-xl text-text-main placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-main focus:border-transparent transition-all duration-200 hover:border-brand-main/50 bg-bg-dark"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">
                      메시지 *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="무엇을 도와드릴까요? 프로젝트나 협업에 대해 자세히 설명해주세요."
                      required
                      className="w-full px-5 py-4 border-2 border-line-medium rounded-xl text-text-main placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-main focus:border-transparent transition-all duration-200 resize-none hover:border-brand-main/50 bg-bg-dark"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-8 py-5 bg-brand-main hover:bg-brand-main/90 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <Send size={24} />
                    메시지 보내기
                  </motion.button>

                  <p className="text-sm text-text-secondary text-center">
                    * 필수 입력 항목입니다
                  </p>
                </form>
              )}
            </div>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-br from-bg-light to-white rounded-3xl p-8 md:p-12 border border-line-light shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Email */}
              <motion.a
                href={`mailto:${personalInfo.email}`}
                whileHover={{ y: -4 }}
                className="group cursor-pointer"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-brand-main/10 flex items-center justify-center group-hover:bg-brand-main transition-all duration-300">
                    <Mail className="w-6 h-6 text-brand-main group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-text-secondary mb-1 font-medium uppercase tracking-wider">Email</p>
                    <p className="text-sm font-medium text-text-main group-hover:text-brand-main transition-colors">
                      {personalInfo.email}
                    </p>
                  </div>
                </div>
              </motion.a>

              {/* Phone */}
              <motion.div
                whileHover={{ y: -4 }}
                className="group cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  handleCopy(personalInfo.phone, 'phone');
                }}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-brand-main/10 flex items-center justify-center group-hover:bg-brand-main transition-all duration-300">
                    {copiedField === 'phone' ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      <Phone className="w-6 h-6 text-brand-main group-hover:text-white transition-colors duration-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-text-secondary mb-1 font-medium uppercase tracking-wider">Phone</p>
                    <p className="text-sm font-medium text-text-main group-hover:text-brand-main transition-colors">
                      {personalInfo.phone}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Location */}
              <motion.a
                href={`https://map.naver.com/v5/search/${encodeURIComponent(personalInfo.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4 }}
                className="group cursor-pointer"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-brand-main/10 flex items-center justify-center group-hover:bg-brand-main transition-all duration-300">
                    <MapPin className="w-6 h-6 text-brand-main group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-1 font-medium uppercase tracking-wider">Location</p>
                    <p className="text-sm font-medium text-text-main group-hover:text-brand-main transition-colors">
                      {personalInfo.location}
                    </p>
                  </div>
                </div>
              </motion.a>
            </div>

            {/* Social Links */}
            <div className="mt-10 pt-8 border-t border-line-light">
              <div className="flex justify-center items-center gap-4">
                {personalInfo.social?.linkedin && (
                  <motion.a
                    href={personalInfo.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-line-medium hover:border-brand-main transition-all duration-300 shadow-sm group"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Linkedin className="w-4 h-4 text-text-secondary group-hover:text-brand-main transition-colors duration-300" />
                  </motion.a>
                )}
                {personalInfo.social?.notion && (
                  <motion.a
                    href={personalInfo.social.notion}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-line-medium hover:border-brand-main transition-all duration-300 shadow-sm group"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Globe className="w-4 h-4 text-text-secondary group-hover:text-brand-main transition-colors duration-300" />
                  </motion.a>
                )}
                {personalInfo.social?.brunch && (
                  <motion.a
                    href={personalInfo.social.brunch}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-line-medium hover:border-brand-main transition-all duration-300 shadow-sm group"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-lg font-bold italic text-text-secondary group-hover:text-brand-main transition-colors duration-300">b</span>
                  </motion.a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
