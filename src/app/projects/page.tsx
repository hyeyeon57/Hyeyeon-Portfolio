'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Calendar, Users, Award, X, Star, ArrowLeft, Plus, Edit3, Trash2, Settings, Download, Eye } from 'lucide-react';
import { projects as initialProjects } from '@/data/portfolio';
import Link from 'next/link';
import { ProjectForm } from '@/components/forms/ProjectForm';

type Project = typeof initialProjects[0];

export default function AllProjectsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [favoriteProjects, setFavoriteProjects] = useState<string[]>([]);
  const [showLimitNotification, setShowLimitNotification] = useState(false);
  const [notificationPosition, setNotificationPosition] = useState<{ x: number; y: number } | null>(null);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryProject, setGalleryProject] = useState<Project | null>(null);
  const [fromFavorites, setFromFavorites] = useState(false);

  // 클라이언트 마운트 시 localStorage에서 데이터 로드
  useEffect(() => {
    setIsMounted(true);
    
    // 프로젝트 로드
    const savedProjects = localStorage.getItem('customProjects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
    
    // 즐겨찾기 로드
    const savedFavorites = localStorage.getItem('favoriteProjects');
    if (savedFavorites) {
      setFavoriteProjects(JSON.parse(savedFavorites));
    }
    
    // URL 쿼리 파라미터 확인
    const params = new URLSearchParams(window.location.search);
    setFromFavorites(params.get('from') === 'favorites');
  }, []);

  // 프로젝트 변경 시 localStorage에 저장 (마운트 후에만)
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('customProjects', JSON.stringify(projects));
    }
  }, [projects, isMounted]);

  const categories = [
    { id: 'all', label: '전체', count: projects.length },
    { id: 'new', label: '신규', count: projects.filter(p => p.category === 'new').length },
    { id: 'renewal', label: '리뉴얼', count: projects.filter(p => p.category === 'renewal').length },
    { id: 'app', label: '앱', count: projects.filter(p => p.category === 'app').length },
    { id: 'web', label: '웹', count: projects.filter(p => p.category === 'web').length },
    { id: 'proposal', label: '기획안', count: projects.filter(p => p.category === 'proposal').length },
    { id: 'usability', label: '사용성평가', count: projects.filter(p => p.category === 'usability').length },
  ];

  // 필터링된 프로젝트 (즐겨찾기를 상단에 정렬)
  const filteredProjects = (selectedCategories.includes('all') 
    ? projects 
    : projects.filter(project => selectedCategories.includes(project.category))
  ).sort((a, b) => {
    const aIsFavorite = favoriteProjects.includes(a.id);
    const bIsFavorite = favoriteProjects.includes(b.id);
    
    // 즐겨찾기가 먼저 오도록 정렬
    if (aIsFavorite && !bIsFavorite) return -1;
    if (!aIsFavorite && bIsFavorite) return 1;
    return 0;
  });

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

  // 프로젝트 삭제
  const handleDeleteProject = (projectId: string) => {
    if (confirm('정말 이 프로젝트를 삭제하시겠습니까?')) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
      setFavoriteProjects(prev => prev.filter(id => id !== projectId));
    }
  };

  // 프로젝트 편집 열기
  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowEditModal(true);
    setShowManageModal(false);
  };

  // 프로젝트 편집 저장
  const handleSaveEdit = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    setShowEditModal(false);
    setEditingProject(null);
  };

  // 프로젝트 추가
  const handleAddProject = (newProject: Omit<Project, 'id'>) => {
    const newId = String(projects.length + 1);
    const projectWithId = { ...newProject, id: newId };
    setProjects(prev => [...prev, projectWithId]);
    setShowAddModal(false);
  };

  // 프로젝트 전체 다운로드
  const handleDownloadAll = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `projects_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #ECE9FF 0%, #F7F7FF 50%, #FFFFFF 100%)'
      }}>
        <div className="text-text-sub">Loading...</div>
      </div>
    );
  }

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
            <Link href={fromFavorites ? "/#projects" : "/"}>
              <motion.button
                whileHover={{ x: -5 }}
                className="flex items-center gap-2 text-text-secondary hover:text-brand-main transition-colors duration-300"
              >
                <ArrowLeft size={20} />
                <span className="text-sm font-medium">{fromFavorites ? "즐겨찾기로" : "홈으로"}</span>
              </motion.button>
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-brand-main">
              전체 경로보기
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
          <div className="flex items-center justify-center mb-6 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block px-6 py-3 bg-brand-main/5 rounded-full border border-brand-main/20"
            >
              <p className="text-sm font-medium text-brand-main">전체 프로젝트</p>
            </motion.div>
            <div className="absolute right-0 flex items-center gap-2">
              <motion.button
                onClick={handleDownloadAll}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 bg-brand-main/10 hover:bg-brand-main/20 text-brand-main rounded-xl transition-all duration-300 border border-brand-main/30 hover:border-brand-main/50"
                title="전체 다운로드"
              >
                <Download size={20} />
              </motion.button>
              <motion.button
                onClick={() => setShowManageModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 bg-brand-main/10 hover:bg-brand-main/20 text-brand-main rounded-xl transition-all duration-300 border border-brand-main/30 hover:border-brand-main/50"
                title="프로젝트 관리"
              >
                <Settings size={20} />
              </motion.button>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-text-main mb-4">
            All Project
          </h2>
          <p className="text-base text-text-sub max-w-3xl mx-auto leading-relaxed">
            문제에서 시작해, 더 나은 경험으로 도달한 모든 경로를 만나보세요.
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
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-brand-main/5 to-brand-sub-1/5">
                    {project.image && (
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 block"
                        style={{ display: 'block', margin: 0 }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                          {/* Favorite Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(project.id, e);
                            }}
                      className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
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
                    
                    {/* Gallery Preview Button */}
                    {(project as any).gallery && Array.isArray((project as any).gallery) && (project as any).gallery.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setGalleryProject(project);
                          setShowGalleryModal(true);
                        }}
                        className="absolute top-16 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm bg-white/90 hover:bg-white text-brand-main border border-brand-main/30 hover:border-brand-main/50 shadow-lg opacity-0 group-hover:opacity-100"
                        title="프로젝트 미리보기"
                      >
                        <Eye size={18} />
                      </button>
                    )}
                    
                    <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-brand-main rounded-lg text-xs font-semibold border border-brand-main/20">
                            {categories.find(c => c.id === project.category)?.label}
                          </div>
                        </div>

                {/* Project Content - 여백 최소화 */}
                  <div className="px-4 pt-3 pb-4 flex-1 flex flex-col">
                  {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-2">
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
                    <h3 className="text-lg font-bold text-text-main mb-1 group-hover:text-brand-main transition-colors duration-300 line-clamp-1">
                    {project.title}
                  </h3>
                    <p className="text-sm text-brand-main font-medium mb-2 line-clamp-1">
                    {project.subtitle}
                  </p>

                  {/* Description */}
                    <p className="text-text-secondary text-sm mb-3 line-clamp-2 flex-1">
                    {project.description}
                  </p>

                  {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-text-secondary pt-3 border-t border-line-light mt-auto">
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
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
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
                  className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text-main transition-colors"
              >
                  <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
              <div className="p-8">
              {/* Project Image with Gallery Button */}
                {selectedProject.image && (
                  <div className="mb-8 rounded-2xl overflow-hidden border border-line-light relative group">
                    <img 
                      src={selectedProject.image} 
                      alt={selectedProject.title}
                      className="w-full h-auto"
                    />
                    {/* Gallery Button - show only if gallery exists */}
                    {(selectedProject as any).gallery && Array.isArray((selectedProject as any).gallery) && (selectedProject as any).gallery.length > 0 && (
                      <button
                        onClick={() => {
                          setGalleryProject(selectedProject);
                          setShowGalleryModal(true);
                        }}
                        className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm text-brand-main transition-all duration-300 border border-brand-main/30 hover:border-brand-main/50 shadow-lg opacity-0 group-hover:opacity-100 flex items-center justify-center"
                        title="프로젝트 미리보기"
                      >
                        <Eye size={20} />
                      </button>
                    )}
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
                  <div className="mb-8">
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

              {/* Retrospective */}
              {(selectedProject as any).retrospective && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
                    <span className="text-brand-main">💭</span>
                    회고
                  </h3>
                  <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                    {(selectedProject as any).retrospective}
                  </p>
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

      {/* Project Management Modal */}
      <AnimatePresence>
        {showManageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-dark/80 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setShowManageModal(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden border border-line-medium shadow-xl"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-line-medium px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-2xl font-bold text-text-main">
                  프로젝트 관리
                </h3>
                <button
                  onClick={() => setShowManageModal(false)}
                  className="w-10 h-10 rounded-full bg-bg-light hover:bg-brand-main/10 border border-line-medium hover:border-brand-main transition-all duration-300 flex items-center justify-center text-text-secondary hover:text-brand-main"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto custom-scrollbar max-h-[calc(85vh-80px)]">
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white rounded-2xl border border-line-medium hover:border-brand-main/50 transition-all duration-300 p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-brand-main/10 to-brand-sub-1/10 flex items-center justify-center">
                          {project.image ? (
                            <img 
                              src={project.image} 
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl font-bold text-brand-main">
                              {project.title.charAt(0)}
                            </span>
                          )}
                </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-text-main mb-1">
                            {project.title}
                          </h4>
                          <p className="text-sm text-text-secondary line-clamp-1">
                            {project.subtitle}
                  </p>
                </div>
              </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="p-2 rounded-lg bg-brand-main/10 hover:bg-brand-main/20 text-brand-main transition-all duration-300"
                          title="편집"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-all duration-300"
                          title="삭제"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add New Project Button */}
                  <button
                    onClick={() => {
                      setShowManageModal(false);
                      setShowAddModal(true);
                    }}
                    className="w-full p-6 bg-brand-main/5 hover:bg-brand-main/10 border-2 border-dashed border-brand-main/30 hover:border-brand-main/50 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 text-brand-main font-medium"
                  >
                    <Plus size={20} />
                    <span>새 프로젝트 추가</span>
                  </button>
              </div>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Project Modal */}
      <AnimatePresence>
        {showEditModal && editingProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-dark/80 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setShowEditModal(false);
                setEditingProject(null);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-hidden border border-line-medium shadow-xl"
            >
              <div className="sticky top-0 bg-white border-b border-line-medium px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-2xl font-bold text-text-main">
                  프로젝트 편집
                </h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProject(null);
                  }}
                  className="w-10 h-10 rounded-full bg-bg-light hover:bg-brand-main/10 border border-line-medium hover:border-brand-main transition-all duration-300 flex items-center justify-center text-text-secondary hover:text-brand-main"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar max-h-[calc(85vh-80px)]">
                <ProjectForm
                  project={editingProject}
                  onSave={handleSaveEdit}
                  onCancel={() => {
                    setShowEditModal(false);
                    setEditingProject(null);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Project Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-dark/80 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setShowAddModal(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-hidden border border-line-medium shadow-xl"
            >
              <div className="sticky top-0 bg-white border-b border-line-medium px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-2xl font-bold text-text-main">
                  새 프로젝트 추가
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-10 h-10 rounded-full bg-bg-light hover:bg-brand-main/10 border border-line-medium hover:border-brand-main transition-all duration-300 flex items-center justify-center text-text-secondary hover:text-brand-main"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar max-h-[calc(85vh-80px)]">
                <ProjectForm
                  onSave={handleAddProject}
                  onCancel={() => setShowAddModal(false)}
                />
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Gallery Modal */}
      <AnimatePresence>
        {showGalleryModal && galleryProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setShowGalleryModal(false);
                setGalleryProject(null);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] shadow-2xl"
            >
              {/* Gallery Header */}
              <div className="sticky top-0 z-10 bg-white border-b border-line-medium px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                  <Eye size={24} className="text-brand-main" />
                  프로젝트 미리보기
                </h3>
                <button
                  onClick={() => {
                    setShowGalleryModal(false);
                    setGalleryProject(null);
                  }}
                  className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text-main transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Gallery Content */}
              <div className="p-6 overflow-y-auto custom-scrollbar max-h-[calc(90vh-80px)]">
                <div className="space-y-2">
                  {/* Main Image */}
                  {galleryProject.image && (
                    <div className="rounded-2xl overflow-hidden border border-line-light">
                      <img 
                        src={galleryProject.image} 
                        alt={galleryProject.title}
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                  
                  {/* Additional Gallery Images */}
                  {(galleryProject as any).gallery && Array.isArray((galleryProject as any).gallery) && (
                    (galleryProject as any).gallery.slice(0, 9).map((imgSrc: string, index: number) => (
                      <div key={index} className="rounded-2xl overflow-hidden border border-line-light">
                        <img 
                          src={imgSrc} 
                          alt={`${galleryProject.title} - ${index + 2}`}
                          className="w-full h-auto"
                        />
                      </div>
                    ))
                  )}
              </div>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
