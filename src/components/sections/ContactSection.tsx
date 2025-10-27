'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { personalInfo } from '@/data/portfolio';

interface ContactSectionProps {
  theme?: 'light' | 'dark';
}

export const ContactSection: React.FC<ContactSectionProps> = ({ theme = 'light' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        setError(result.error || '메시지 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
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
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}
                  
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
                      disabled={isLoading}
                      className="w-full px-5 py-4 border-2 border-line-medium rounded-xl text-text-main placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-main focus:border-transparent transition-all duration-200 hover:border-brand-main/50 bg-bg-dark disabled:opacity-50 disabled:cursor-not-allowed"
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
                      disabled={isLoading}
                      className="w-full px-5 py-4 border-2 border-line-medium rounded-xl text-text-main placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-main focus:border-transparent transition-all duration-200 hover:border-brand-main/50 bg-bg-dark disabled:opacity-50 disabled:cursor-not-allowed"
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
                      disabled={isLoading}
                      className="w-full px-5 py-4 border-2 border-line-medium rounded-xl text-text-main placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-main focus:border-transparent transition-all duration-200 resize-none hover:border-brand-main/50 bg-bg-dark disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    disabled={isLoading}
                    className="w-full px-8 py-5 bg-brand-main hover:bg-brand-main/90 text-white rounded-xl font-bold text-lg shadow minimal hover:shadow minimal-lg transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        전송 중...
                      </>
                    ) : (
                      <>
                        <Send size={24} />
                        메시지 전송
                      </>
                    )}
                  </motion.button>

                  <p className="text-sm text-text-secondary text-center">
                    * 필수 입력 항목입니다
                  </p>
                </form>
              )}
            </div>
        </motion.div>

        {/* Contact Info - Simplified at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
            <div className="bg-white p-8 rounded-2xl shadow minimal border border-line-medium">
              <h3 className="text-2xl font-bold text-text-main mb-6 text-center">
                연락처 정보
              </h3>
              <div className="flex flex-wrap justify-center gap-6">
                <motion.a
                  href={`mailto:${personalInfo.email}`}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 px-6 py-3 bg-brand-main/5 hover:bg-brand-main/10 text-brand-main rounded-xl border border-brand-main/30 transition-all duration-300"
                >
                  <Mail size={20} />
                  <span className="font-semibold">{personalInfo.email}</span>
                </motion.a>

                {personalInfo.phone && (
                  <motion.a
                    href={`tel:${personalInfo.phone}`}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 px-6 py-3 bg-brand-main/5 hover:bg-brand-main/10 text-brand-main rounded-xl border border-brand-main/30 transition-all duration-300"
                  >
                    <Phone size={20} />
                    <span className="font-semibold">{personalInfo.phone}</span>
                  </motion.a>
                )}

                {personalInfo.location && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 px-6 py-3 bg-brand-main/5 text-brand-main rounded-xl border border-brand-main/30"
                  >
                    <MapPin size={20} />
                    <span className="font-semibold">{personalInfo.location}</span>
                  </motion.div>
                )}
              </div>
            </div>
        </motion.div>
      </div>
    </section>
  );
};
