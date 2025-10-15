'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { personalInfo } from '@/data/portfolio';

export const ContactSection: React.FC = () => {
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
    <section id="contact" className="py-20 bg-dark-surface border-t border-dark-border relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-point-yellow/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-point-yellow-dark/20 rounded-full blur-3xl" />
      </div>

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
            className="inline-block px-4 py-2 bg-point-yellow/20 text-point-yellow rounded-full text-sm font-semibold mb-4 border border-point-yellow/30"
          >
            Contact
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            연락하기
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            프로젝트 문의나 협업 제안이 있으시다면 언제든 연락주세요!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-7xl mx-auto">
          {/* Contact Info - 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="sticky top-24">
              <h3 className="text-3xl font-bold text-white mb-8">
                연락처 정보
              </h3>

              <div className="space-y-6 mb-10">
                <motion.a
                  href={`mailto:${personalInfo.email}`}
                  whileHover={{ scale: 1.05, x: 10 }}
                  className="flex items-start gap-4 p-5 bg-dark-bg rounded-2xl shadow-lg hover:shadow-glow-yellow transition-all duration-300 border border-dark-border group"
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-point-yellow to-point-yellow-dark text-dark-bg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-text-tertiary mb-1 font-medium">이메일</p>
                    <p className="text-lg font-bold text-white group-hover:text-point-yellow transition-colors">
                      {personalInfo.email}
                    </p>
                  </div>
                </motion.a>

                {personalInfo.phone && (
                  <motion.a
                    href={`tel:${personalInfo.phone}`}
                    whileHover={{ scale: 1.05, x: 10 }}
                    className="flex items-start gap-4 p-5 bg-dark-bg rounded-2xl shadow-lg hover:shadow-glow-yellow transition-all duration-300 border border-dark-border group"
                  >
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-point-yellow to-point-yellow-dark text-dark-bg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Phone size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-text-tertiary mb-1 font-medium">전화</p>
                      <p className="text-lg font-bold text-white group-hover:text-point-yellow transition-colors">
                        {personalInfo.phone}
                      </p>
                    </div>
                  </motion.a>
                )}

                {personalInfo.location && (
                  <motion.div
                    whileHover={{ scale: 1.05, x: 10 }}
                    className="flex items-start gap-4 p-5 bg-dark-bg rounded-2xl shadow-lg hover:shadow-glow-yellow transition-all duration-300 border border-dark-border group"
                  >
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-point-yellow to-point-yellow-dark text-dark-bg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-text-tertiary mb-1 font-medium">위치</p>
                      <p className="text-lg font-bold text-white">
                        {personalInfo.location}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Additional Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="p-8 bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg rounded-3xl border border-dark-border shadow-glow-yellow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="text-point-yellow" size={28} />
                  <h4 className="text-xl font-bold text-white">빠른 응답</h4>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  새로운 프로젝트나 협업 기회에 항상 열려있습니다. 
                  함께 멋진 무언가를 만들어보고 싶으시다면 주저하지 말고 연락주세요!
                  보통 24시간 이내에 답변드립니다.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Contact Form - 3 columns */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="bg-dark-bg p-8 lg:p-10 rounded-3xl shadow-glow-yellow-lg border border-dark-border">
              <h3 className="text-3xl font-bold text-white mb-2">
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
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-point-yellow to-point-yellow-dark text-dark-bg flex items-center justify-center mb-6 shadow-lg"
                  >
                    <CheckCircle size={40} />
                  </motion.div>
                  <h4 className="text-2xl font-bold text-white mb-2">메시지 전송 완료!</h4>
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
                      className="w-full px-5 py-4 border-2 border-dark-border rounded-xl text-white placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-point-yellow focus:border-transparent transition-all duration-200 hover:border-point-yellow/50 bg-dark-surface disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="w-full px-5 py-4 border-2 border-dark-border rounded-xl text-white placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-point-yellow focus:border-transparent transition-all duration-200 hover:border-point-yellow/50 bg-dark-surface disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="w-full px-5 py-4 border-2 border-dark-border rounded-xl text-white placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-point-yellow focus:border-transparent transition-all duration-200 resize-none hover:border-point-yellow/50 bg-dark-surface disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    disabled={isLoading}
                    className="w-full px-8 py-5 bg-gradient-to-r from-point-yellow to-point-yellow-dark text-dark-bg rounded-xl font-bold text-lg shadow-lg hover:shadow-glow-yellow-lg hover:from-point-yellow-light hover:to-point-yellow transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-dark-bg border-t-transparent rounded-full animate-spin" />
                        전송 중...
                      </>
                    ) : (
                      <>
                        <Send size={24} />
                        메시지 전송
                      </>
                    )}
                  </motion.button>

                  <p className="text-sm text-text-tertiary text-center">
                    * 필수 입력 항목입니다
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
