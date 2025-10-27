'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, Users, Award, Star, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/data/portfolio';
import { Button } from '@/components/ui/Button';

interface ProjectsSectionProps {
  theme?: 'light' | 'dark';
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ theme = 'light' }) => {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [showProjectSelection, setShowProjectSelection] = useState(false);
  const [favoriteProjects, setFavoriteProjects] = useState<string[]>([]);
  const [showLimitNotification, setShowLimitNotification] = useState(false);
  const [notificationPosition, setNotificationPosition] = useState<{ x: number; y: number } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Hydration 에러 방지: 클라이언트에서만 localStorage 읽기
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('favoriteProjects');
    if (saved) {
      setFavoriteProjects(JSON.parse(saved));
    }
  }, []);

  const displayedProjects = projects.filter(project => favoriteProjects.includes(project.id));

  const toggleFavorite = (projectId: string, event: React.MouseEvent) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const position = {
      x: buttonRect.right + 10, // 버튼 오른쪽에 10px 간격
      y: buttonRect.top - 10    // 버튼 위쪽에 10px 간격
    };
    
    setFavoriteProjects(prev => {
      let newFavorites;
      if (prev.includes(projectId)) {
        newFavorites = prev.filter(id => id !== projectId);
      } else if (prev.length < 3) {
        newFavorites = [...prev, projectId];
      } else {
        // 3개 제한에 도달했을 때 알림 표시
        setNotificationPosition(position);
        setShowLimitNotification(true);
        setTimeout(() => {
          setShowLimitNotification(false);
          setNotificationPosition(null);
        }, 3000);
        return prev;
      }
      
      // localStorage에 저장
      if (typeof window !== 'undefined') {
        localStorage.setItem('favoriteProjects', JSON.stringify(newFavorites));
      }
      
      return newFavorites;
    });
  };

  const toggleFavoriteFromModal = (projectId: string) => {
    setFavoriteProjects(prev => {
      let newFavorites;
      if (prev.includes(projectId)) {
        newFavorites = prev.filter(id => id !== projectId);
      } else if (prev.length < 3) {
        newFavorites = [...prev, projectId];
      } else {
        // 3개 제한에 도달했을 때는 아무것도 하지 않음
        return prev;
      }
      
      // localStorage에 저장
      if (typeof window !== 'undefined') {
        localStorage.setItem('favoriteProjects', JSON.stringify(newFavorites));
      }
      
      return newFavorites;
    });
  };

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      {/* 상단 그라데이션 마스크 */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-transparent to-white/0 pointer-events-none z-10" />
      {/* 하단 그라데이션 마스크 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-transparent via-transparent to-white/0 pointer-events-none z-10" />

      <div className="max-w-container mx-auto px-container-x relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
                  {isMounted && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 border bg-brand-main/10 text-brand-main border-brand-main/30"
                    >
                      {favoriteProjects.length > 0 ? '즐겨찾기 프로젝트' : '대표 프로젝트'}
                    </motion.span>
                  )}
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-text-main">
            Projects
          </h2>
          <p className="text-2xl text-brand-main font-semibold mb-4">
            "데이터로 문제를 정의하고, 구조로 길을 만든다."
          </p>
          <p className="text-xl text-text-sub max-w-3xl mx-auto">
            {favoriteProjects.length > 0 
              ? '즐겨찾기한 프로젝트들을 확인해보세요.'
              : '사용자의 여정 속 문제를 발견하고, 체계적인 설계로 더 나은 경험을 만들어갑니다.'
            }
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayedProjects.map((project, index) => {
            const cardStyles = ['pastel-card--blue', 'pastel-card--purple', 'pastel-card--gray'];
            const cardStyle = cardStyles[index % 3];
            
            return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="pastel-card bg-white h-full">
                {/* 상단 파스텔 컬러 영역 */}
                <div className={`relative rounded-t-3xl overflow-hidden ${cardStyle}`} style={{ paddingTop: '40px', paddingBottom: '40px', minHeight: '240px' }}>
                  {/* 번호 뱃지 */}
                  <div 
                    className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/95 border border-black/6 shadow-sm flex items-center justify-center z-10"
                    style={{ boxShadow: '0 6px 16px rgba(0,0,0,0.06)' }}
                  >
                    <Star className="w-4 h-4 fill-brand-main text-brand-main" />
                  </div>

                  {/* 아이콘 영역 */}
                  <div className="icon-wrap">
                    <div 
                      className="w-10 h-10 rounded-lg"
                      style={{
                        background: 'linear-gradient(135deg, #3A344E 0%, #6E6A80 100%)'
                      }}
                    />
                  </div>
                </div>

                {/* 하단 흰색 배경 콘텐츠 영역 */}
                <div className="bg-white rounded-b-3xl p-6">
                  {/* 제목 */}
                  <h3 className="text-lg font-semibold mb-2 text-text-main">
                    {project.title}
                  </h3>

                  {/* 설명 */}
                  <p className="text-sm text-text-sub leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
          })}
        </div>

        {/* Add Project Button */}
        {displayedProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onClick={() => setShowProjectSelection(true)}
              className="group cursor-pointer max-w-sm w-full"
            >
              <div className="pastel-card pastel-card--purple bg-white h-full">
                {/* 상단 파스텔 컬러 영역 */}
                <div className="relative rounded-t-3xl overflow-hidden" style={{ paddingTop: '40px', paddingBottom: '40px', minHeight: '240px', background: '#F3E9FF' }}>
                  {/* 플러스 아이콘 */}
                  <div className="icon-wrap">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-4xl font-bold text-brand-main">
                      +
                    </div>
                  </div>
                </div>

                {/* 하단 흰색 배경 콘텐츠 영역 */}
                <div className="bg-white rounded-b-3xl p-6">
                  {/* 제목 */}
                  <h3 className="text-lg font-semibold mb-2 text-text-main">
                    대표 프로젝트 추가
                  </h3>

                  {/* 설명 */}
                  <p className="text-sm text-text-sub leading-relaxed">
                    클릭하여 프로젝트를 선택하고 즐겨찾기하세요 (최대 3개)
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Show All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button
            onClick={() => setShowProjectSelection(true)}
            className="px-8 py-4 bg-brand-main text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-300"
          >
            {displayedProjects.length > 0 ? '프로젝트 변경하기' : '프로젝트 선택하기'}
          </button>
        </motion.div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
              theme === 'dark' ? 'bg-black/95' : 'bg-white/95'
            } backdrop-blur-sm`}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-surface rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-dark-border shadow-glow-yellow-lg"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-dark-surface border-b border-dark-border px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-2xl font-bold text-white">
                  {selectedProject.title}
                </h3>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-10 h-10 rounded-full bg-dark-bg hover:bg-point-yellow/20 border border-dark-border hover:border-point-yellow transition-all duration-300 flex items-center justify-center text-text-secondary hover:text-point-yellow"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto custom-scrollbar max-h-[calc(90vh-80px)]">
                {/* Project Image */}
                <div className="relative h-64 bg-gradient-to-br from-point-yellow/20 to-point-yellow-dark/20 rounded-2xl mb-6 overflow-hidden">
                  <div className="absolute inset-0 bg-dark-bg/60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* 빈 이미지 공간 */}
                  </div>
                </div>

                {/* Meta Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-dark-bg rounded-xl p-4 border border-dark-border">
                    <p className="text-text-tertiary text-sm mb-1">역할</p>
                    <p className="text-white font-semibold">{selectedProject.role}</p>
                  </div>
                  <div className="bg-dark-bg rounded-xl p-4 border border-dark-border">
                    <p className="text-text-tertiary text-sm mb-1">기간</p>
                    <p className="text-white font-semibold">{selectedProject.duration}</p>
                  </div>
                  <div className="bg-dark-bg rounded-xl p-4 border border-dark-border">
                    <p className="text-text-tertiary text-sm mb-1">팀 구성</p>
                    <p className="text-white font-semibold">{selectedProject.team}</p>
                  </div>
                  <div className="bg-dark-bg rounded-xl p-4 border border-dark-border">
                    <p className="text-text-tertiary text-sm mb-1">날짜</p>
                    <p className="text-white font-semibold">{selectedProject.date}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedProject.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-point-yellow/10 text-point-yellow text-sm rounded-lg border border-point-yellow/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-white mb-3">프로젝트 개요</h4>
                  <p className="text-text-secondary leading-relaxed">
                    {selectedProject.fullDescription}
                  </p>
                </div>

                {/* Achievements */}
                {selectedProject.achievements && selectedProject.achievements.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="text-point-yellow" size={24} />
                      <h4 className="text-xl font-bold text-white">주요 성과</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedProject.achievements.map((achievement, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-4 bg-point-yellow/10 border border-point-yellow/30 rounded-xl"
                        >
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-point-yellow text-dark-bg flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </span>
                          <span className="text-text-secondary">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Link Button */}
                {selectedProject.link && selectedProject.link !== '#' && (
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-point-yellow text-dark-bg rounded-xl font-semibold hover:bg-point-yellow-light transition-all duration-300"
                  >
                    <ExternalLink size={20} />
                    프로젝트 상세보기
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
              </AnimatePresence>

              {/* Project Selection Modal */}
              <AnimatePresence>
                {showProjectSelection && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
              theme === 'dark' ? 'bg-black/95' : 'bg-white/95'
            } backdrop-blur-sm`}
                    onClick={() => setShowProjectSelection(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 20 }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-dark-surface rounded-3xl max-w-5xl w-full max-h-[85vh] overflow-hidden border border-dark-border mx-4 project-selection-modal"
                    >
                      {/* Modal Header */}
                      <div className="sticky top-0 bg-dark-surface border-b border-dark-border px-6 py-4 flex items-center justify-between z-10">
                        <h3 className="text-2xl font-bold text-white">
                          프로젝트 선택
                        </h3>
                        <button
                          onClick={() => setShowProjectSelection(false)}
                          className="w-10 h-10 rounded-full bg-dark-bg hover:bg-point-yellow/20 border border-dark-border hover:border-point-yellow transition-all duration-300 flex items-center justify-center text-text-secondary hover:text-point-yellow"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      {/* Modal Content */}
                      <div className="p-6 overflow-y-auto custom-scrollbar max-h-[calc(80vh-80px)]">
                        <div className="mb-6">
                          <p className="text-text-secondary text-center">
                            즐겨찾기할 프로젝트를 선택하세요 (최대 3개)
                          </p>
                          <div className="mt-2 text-center">
                            <span className="text-point-yellow font-semibold">
                              선택된 프로젝트: {favoriteProjects.length}/3
                            </span>
                          </div>
                        </div>

                        {/* Projects Grid */}
                        <div className="grid grid-cols-2 gap-6">
                          {projects.map((project) => (
                            <div
                              key={project.id}
                              className="bg-dark-surface rounded-2xl overflow-hidden border border-dark-border hover:border-point-yellow/50 transition-all duration-75 h-full shadow-lg shadow-white/10 project-selection-card"
                            >
                              {/* Project Image */}
                              <div className="relative aspect-video bg-gradient-to-br from-point-yellow/20 to-point-yellow-dark/20 overflow-hidden project-image-area">
                                <div className="absolute inset-0 bg-dark-bg/60" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="text-point-yellow/60 text-4xl font-bold">
                                    {project.title.charAt(0)}
                                  </div>
                                </div>
                                {/* Favorite Button */}
                                <button
                                  onClick={() => toggleFavoriteFromModal(project.id)}
                                  className={`absolute top-4 left-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                                    favoriteProjects.includes(project.id)
                                      ? 'bg-point-yellow text-dark-bg shadow-glow-yellow'
                                      : 'bg-dark-bg/80 text-text-secondary hover:bg-point-yellow/20 hover:text-point-yellow'
                                  }`}
                                >
                                  <Star 
                                    size={20} 
                                    fill={favoriteProjects.includes(project.id) ? 'currentColor' : 'none'}
                                  />
                                </button>
                                <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-dark-bg/80 text-point-yellow rounded text-xs font-semibold">
                                  {project.category === 'new' ? '신규' : 
                                   project.category === 'renewal' ? '리뉴얼' : 
                                   project.category === 'app' ? '앱' : 
                                   project.category === 'web' ? '웹' : 
                                   project.category === 'proposal' ? '기획서' : 
                                   project.category === 'usability' ? '사용성 평가' : '기타'}
                                </div>
                              </div>

                              {/* Project Content */}
                              <div className="p-4">
                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-2">
                                  {project.tags.slice(0, 2).map((tag, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-1 bg-point-yellow/10 text-point-yellow text-sm rounded border border-point-yellow/30"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>

                                {/* Title & Subtitle */}
                                <h4 className="text-lg font-bold text-white mb-2 line-clamp-1">
                                  {project.title}
                                </h4>
                                <p className="text-sm text-point-yellow/80 mb-2 line-clamp-1">
                                  {project.subtitle}
                                </p>

                                {/* Description */}
                                <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                                  {project.description}
                                </p>

                                {/* Meta Info */}
                                <div className="flex items-center gap-3 text-sm text-text-tertiary">
                                  <span className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    {project.date}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users size={12} />
                                    {project.team}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Close Button */}
                        <div className="mt-8 text-center">
                          <button
                            onClick={() => setShowProjectSelection(false)}
                            className="px-8 py-3 bg-point-yellow text-dark-bg rounded-xl font-semibold hover:bg-point-yellow-light transition-all duration-300"
                          >
                            완료
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Favorite Limit Notification */}
      <AnimatePresence>
        {showLimitNotification && notificationPosition && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed z-50"
            style={{
              left: `${notificationPosition.x}px`,
              top: `${notificationPosition.y}px`,
            }}
          >
            <div className="bg-dark-surface border border-point-yellow/50 rounded-3xl px-6 py-4 shadow-glow-yellow-lg backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-point-yellow/20 flex items-center justify-center">
                  <Star size={20} className="text-point-yellow" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">
                    즐겨찾기 3개 제한
                  </p>
                  <p className="text-text-secondary text-xs">
                    기존 경로를 해제하세요
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
