'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Calendar, Users, Award, X, Star, ArrowLeft } from 'lucide-react';
import { projects, personalInfo } from '@/data/portfolio';
import Link from 'next/link';

export default function AllProjectsPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [favoriteProjects, setFavoriteProjects] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('favoriteProjects');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [showLimitNotification, setShowLimitNotification] = useState(false);
  const [notificationPosition, setNotificationPosition] = useState<{ x: number; y: number } | null>(null);

  const categories = [
    { id: 'all', label: '전체', count: projects.length },
    { id: 'new', label: '신규', count: projects.filter(p => p.category === 'new').length },
    { id: 'renewal', label: '리뉴얼', count: projects.filter(p => p.category === 'renewal').length },
    { id: 'app', label: '앱', count: projects.filter(p => p.category === 'app').length },
    { id: 'web', label: '웹', count: projects.filter(p => p.category === 'web').length },
    { id: 'proposal', label: '기획안', count: projects.filter(p => p.category === 'proposal').length },
    { id: 'usability', label: '사용성평가', count: projects.filter(p => p.category === 'usability').length },
  ];

  const filteredProjects = selectedCategories.includes('all') 
    ? projects 
    : projects.filter(project => selectedCategories.includes(project.category));

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (categoryId === 'all') {
        return ['all'];
      }
      
      const newCategories = prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev.filter(id => id !== 'all'), categoryId];
      
      return newCategories.length === 0 ? ['all'] : newCategories;
    });
  };

  const toggleFavorite = (projectId: string, event: React.MouseEvent) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const position = {
      x: buttonRect.right + 10,
      y: buttonRect.top - 10
    };
    
    setFavoriteProjects(prev => {
      let newFavorites;
      if (prev.includes(projectId)) {
        newFavorites = prev.filter(id => id !== projectId);
      } else if (prev.length < 3) {
        newFavorites = [...prev, projectId];
      } else {
        setNotificationPosition(position);
        setShowLimitNotification(true);
        setTimeout(() => {
          setShowLimitNotification(false);
          setNotificationPosition(null);
        }, 3000);
        return prev;
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('favoriteProjects', JSON.stringify(newFavorites));
      }
      
      return newFavorites;
    });
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #ECE9FF 0%, #F7F7FF 50%, #FFFFFF 100%)'
    }}>
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-line-medium"
      >
        <div className="max-w-container mx-auto px-6 md:px-container-x py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <motion.button
                whileHover={{ x: -5 }}
                className="flex items-center gap-2 text-text-secondary hover:text-brand-main transition-colors duration-300"
              >
                <ArrowLeft size={20} />
                <span className="text-sm font-medium">홈으로</span>
              </motion.button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-brand-main">
              All Projects
            </h1>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </motion.header>

      <div className="max-w-container mx-auto px-6 md:px-container-x py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-6 py-3 bg-brand-main/5 rounded-full border border-brand-main/20 mb-6"
          >
            <p className="text-sm font-medium text-brand-main">✨ 모든 프로젝트</p>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-light text-text-main mb-6">
            Project Gallery
          </h2>
          <p className="text-lg text-text-sub max-w-3xl mx-auto leading-relaxed">
            사용자의 불편과 문제를 발견하고, 체계적인 설계로 더 나은 경험을 만들어간 모든 프로젝트들을 확인해보세요.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              onClick={() => toggleCategory(category.id)}
              className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                selectedCategories.includes(category.id)
                  ? 'bg-brand-main text-white shadow-lg scale-105'
                  : 'bg-white text-text-secondary hover:text-brand-main hover:bg-brand-main/5 border border-line-medium hover:border-brand-main/30'
              }`}
            >
              <span className="flex items-center gap-2">
                {selectedCategories.includes(category.id) && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                )}
                {category.label}
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedCategories.includes(category.id)
                    ? 'bg-white/20'
                    : 'bg-brand-main/10 text-brand-main'
                }`}>
                  {category.count}
                </span>
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="bg-white rounded-2xl overflow-hidden border border-line-light hover:border-brand-main/50 transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden" style={{
                    background: project.id === '1' ? '#F0F2FF' : 
                               project.id === '2' ? '#F8F5FF' : 
                               '#F9FAFB'
                  }}>
                    {project.image && (
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(project.id, e);
                      }}
                      className={`absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
                        favoriteProjects.includes(project.id)
                          ? 'bg-brand-main text-white shadow-lg scale-110'
                          : 'bg-white/90 text-text-secondary hover:bg-brand-main hover:text-white border border-line-medium'
                      }`}
                    >
                      <Star 
                        size={18} 
                        fill={favoriteProjects.includes(project.id) ? 'currentColor' : 'none'}
                      />
                    </button>
                    
                    <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-brand-main rounded-lg text-xs font-semibold border border-brand-main/20">
                      {categories.find(c => c.id === project.category)?.label}
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-brand-main/5 text-brand-main text-xs rounded-lg border border-brand-main/20 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="text-xl font-bold text-text-main mb-2 group-hover:text-brand-main transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-sm text-brand-main font-medium mb-3">
                      {project.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-text-secondary text-sm mb-4 line-clamp-2 flex-1">
                      {project.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-text-secondary pt-4 border-t border-line-light">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-brand-main" />
                        {project.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users size={14} className="text-brand-main" />
                        {project.team}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-text-main mb-2">프로젝트를 찾을 수 없습니다</h3>
            <p className="text-text-secondary">다른 카테고리를 선택해보세요.</p>
          </motion.div>
        )}
      </div>

      {/* Favorite Limit Notification */}
      <AnimatePresence>
        {showLimitNotification && notificationPosition && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: notificationPosition.x, y: notificationPosition.y }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: 'fixed',
              left: notificationPosition.x,
              top: notificationPosition.y,
              zIndex: 9999,
            }}
            className="bg-brand-main text-white px-4 py-3 rounded-xl shadow-2xl border border-white/20"
          >
            <p className="text-sm font-medium whitespace-nowrap">⭐ 즐겨찾기는 최대 3개까지 가능합니다</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 bg-white border-b border-line-medium p-6 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-text-main">
                      {selectedProject.title}
                    </h2>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(selectedProject.id, e);
                      }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        favoriteProjects.includes(selectedProject.id)
                          ? 'bg-brand-main text-white shadow-lg'
                          : 'bg-bg-light text-text-secondary hover:bg-brand-main/10 hover:text-brand-main border border-line-medium'
                      }`}
                    >
                      <Star 
                        size={18} 
                        fill={favoriteProjects.includes(selectedProject.id) ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>
                  <p className="text-brand-main font-medium">{selectedProject.subtitle}</p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-10 h-10 rounded-xl bg-bg-light hover:bg-line-medium transition-colors flex items-center justify-center border border-line-medium"
                >
                  <X size={20} className="text-text-secondary" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                {/* Project Image */}
                {selectedProject.image && (
                  <div className="mb-8 rounded-2xl overflow-hidden">
                    <img 
                      src={selectedProject.image} 
                      alt={selectedProject.title}
                      className="w-full h-auto"
                    />
                  </div>
                )}

                {/* Project Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-bg-light rounded-xl p-4 border border-line-light">
                    <p className="text-xs text-text-secondary mb-1 font-medium">역할</p>
                    <p className="text-sm font-semibold text-text-main">{selectedProject.role}</p>
                  </div>
                  <div className="bg-bg-light rounded-xl p-4 border border-line-light">
                    <p className="text-xs text-text-secondary mb-1 font-medium">기간</p>
                    <p className="text-sm font-semibold text-text-main">{selectedProject.duration}</p>
                  </div>
                  <div className="bg-bg-light rounded-xl p-4 border border-line-light">
                    <p className="text-xs text-text-secondary mb-1 font-medium">팀 구성</p>
                    <p className="text-sm font-semibold text-text-main">{selectedProject.team}</p>
                  </div>
                  <div className="bg-bg-light rounded-xl p-4 border border-line-light">
                    <p className="text-xs text-text-secondary mb-1 font-medium">날짜</p>
                    <p className="text-sm font-semibold text-text-main">{selectedProject.date}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {selectedProject.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-brand-main/5 text-brand-main text-sm rounded-lg border border-brand-main/20 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
                    <span className="text-brand-main">📋</span>
                    프로젝트 개요
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Achievements */}
                {selectedProject.achievements && selectedProject.achievements.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
                      <span className="text-brand-main">🎯</span>
                      주요 성과
                    </h3>
                    <ul className="space-y-3">
                      {selectedProject.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start gap-3 text-text-secondary">
                          <Award size={18} className="text-brand-main mt-0.5 flex-shrink-0" />
                          <span className="leading-relaxed">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* External Link */}
                {selectedProject.link && (
                  <div className="mt-8 pt-8 border-t border-line-light">
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-brand-main text-white rounded-xl hover:opacity-90 transition-all duration-300 shadow-md"
                    >
                      <ExternalLink size={18} />
                      <span className="font-medium">프로젝트 상세보기</span>
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simple Footer for All Projects Page */}
      <footer className="border-t border-line-medium bg-bg-light mt-20">
        <div className="max-w-container mx-auto px-6 md:px-container-x py-12">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-light text-text-main">
              {personalInfo.name}
            </h3>
            <p className="text-sm text-text-sub max-w-xl mx-auto">
              문제 속에서도 길을 찾아 해결하는 내비게이션 같은 기획자
            </p>
            <div className="pt-4 border-t border-line-light max-w-2xl mx-auto">
              <p className="text-sm text-text-secondary">
                © 2024 {personalInfo.name}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
