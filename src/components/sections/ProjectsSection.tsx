'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, Users, Award, Star, Eye } from 'lucide-react';
import { projects as initialProjects } from '@/data/portfolio';

interface ProjectsSectionProps {
  theme?: 'light' | 'dark';
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = () => {
  const [projects, setProjects] = useState<typeof initialProjects>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [showProjectSelection, setShowProjectSelection] = useState(false);
  const [favoriteProjects, setFavoriteProjects] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryProject, setGalleryProject] = useState<typeof projects[0] | null>(null);

  // Hydration 에러 방지: 클라이언트에서만 localStorage 읽기
  useEffect(() => {
    setIsMounted(true);
    
    // 커스텀 프로젝트 로드 (갤러리 정보 포함)
    const savedProjects = localStorage.getItem('customProjects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
    
    // 즐겨찾기 로드
      const saved = localStorage.getItem('favoriteProjects');
    if (saved) {
      setFavoriteProjects(JSON.parse(saved));
    }
  }, []);

  const displayedProjects = projects.filter(project => favoriteProjects.includes(project.id));

  const toggleFavoriteFromModal = (projectId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    setFavoriteProjects(prev => {
      let newFavorites;
      if (prev.includes(projectId)) {
        // 이미 선택된 경우 해제
        newFavorites = prev.filter(id => id !== projectId);
        console.log('Unfavorited:', projectId, 'New favorites:', newFavorites);
      } else if (prev.length < 3) {
        // 3개 미만이면 추가
        newFavorites = [...prev, projectId];
        console.log('Favorited:', projectId, 'New favorites:', newFavorites);
      } else {
        // 3개 제한에 도달
        alert('최대 3개까지만 선택할 수 있습니다. 기존 프로젝트를 해제한 후 추가해주세요.');
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
    <section id="projects" className="py-20 relative overflow-hidden" style={{ backgroundColor: '#F7F7FB' }}>
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
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                      className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 border bg-brand-main/10 text-brand-main border-brand-main/30"
                  >
                    {isMounted && favoriteProjects.length > 0 ? '즐겨찾기 프로젝트' : '대표 프로젝트'}
                  </motion.span>
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-text-main">
            Main Projects
          </h2>
          <p className="text-2xl text-brand-main font-semibold mb-4">
            &ldquo;제가 가장 자신 있게 안내할 수 있는 프로젝트를 소개합니다.&rdquo;
          </p>
          <p className="text-xl text-text-sub max-w-3xl mx-auto">
            {isMounted && favoriteProjects.length > 0 
              ? '즐겨찾기한 프로젝트들을 확인해보세요.'
              : '사용자의 여정 속 문제를 발견하고, 체계적인 설계로 더 나은 경험을 만들어갑니다.'
            }
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayedProjects.map((project, index) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const cardStyles = ['pastel-card--blue', 'pastel-card--purple', 'pastel-card--gray'];
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
              <div className="bg-white rounded-2xl overflow-hidden border border-line-light hover:border-brand-main/50 transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                {/* 상단 이미지 영역 */}
                <div className="relative overflow-hidden bg-gradient-to-br from-brand-main/5 to-brand-sub-1/5" style={{ minHeight: '200px', height: '200px' }}>
                  {/* 번호 뱃지 (즐겨찾기 해제 버튼) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteFromModal(project.id, e);
                    }}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/95 border border-black/6 shadow-sm flex items-center justify-center z-10 hover:scale-110 transition-transform duration-200"
                    style={{ boxShadow: '0 6px 16px rgba(0,0,0,0.06)' }}
                    title="즐겨찾기 해제"
                  >
                    <Star className="w-4 h-4 fill-brand-main text-brand-main" />
                  </button>

                  {/* 미리보기 버튼 (갤러리가 있을 때만 표시) */}
                  {(project as any).gallery && Array.isArray((project as any).gallery) && (project as any).gallery.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setGalleryProject(project);
                        setShowGalleryModal(true);
                      }}
                      className="absolute top-16 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm bg-white/90 hover:bg-white text-brand-main border border-brand-main/30 hover:border-brand-main/50 shadow-lg opacity-0 group-hover:opacity-100"
                      title="프로젝트 미리보기"
                    >
                      <Eye size={16} />
                    </button>
                  )}

                  {/* 프로젝트 이미지 */}
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover block"
                      style={{ display: 'block', margin: 0 }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-5xl font-light text-brand-main/30">
                        {project.title.charAt(0)}
                      </div>
                  </div>
                  )}
                </div>

                {/* 하단 흰색 배경 콘텐츠 영역 */}
                <div className="bg-white px-5 pt-3 pb-4 flex-1">
                  {/* 제목 */}
                  <h3 className="text-lg font-semibold mb-1.5 text-text-main">
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

          {/* Add Project Button - 3개 미만일 때 표시 */}
          {displayedProjects.length < 3 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: displayedProjects.length * 0.1 }}
              onClick={() => setShowProjectSelection(true)}
              className="group cursor-pointer"
            >
              <div className="pastel-card pastel-card--purple bg-white h-full">
                {/* 상단 파스텔 컬러 영역 */}
                <div className="relative rounded-t-3xl overflow-hidden flex items-center justify-center" style={{ paddingTop: '40px', paddingBottom: '40px', minHeight: '240px', background: '#F8F5FF' }}>
                  {/* 플러스 아이콘 */}
                  <div className="text-6xl font-light text-brand-main">
                    +
                  </div>
                </div>

                {/* 하단 흰색 배경 콘텐츠 영역 */}
                <div className="bg-white rounded-b-3xl p-6">
                  {/* 제목 */}
                  <h3 className="text-lg font-semibold mb-2 text-text-main">
                      프로젝트 추가
                  </h3>

                  {/* 설명 */}
                  <p className="text-sm text-text-sub leading-relaxed">
                    클릭하여 즐겨찾기 프로젝트를 추가하세요
                  </p>
                </div>
              </div>
          </motion.div>
        )}
        </div>

        {/* Show All Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
          <button
            onClick={() => {
              if (displayedProjects.length > 0) {
                // 전체 경로보기 페이지로 이동 (즐겨찾기에서 왔다는 표시)
                window.location.href = '/projects?from=favorites';
              } else {
                setShowProjectSelection(true);
              }
            }}
            className="px-8 py-4 bg-brand-main text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-300"
          >
            {displayedProjects.length > 0 ? '전체 경로보기' : '프로젝트 선택하기'}
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-dark/80 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedProject(null);
              }
            }}
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
                        toggleFavoriteFromModal(selectedProject.id, e);
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

              {/* Project Selection Modal */}
              <AnimatePresence>
                {showProjectSelection && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-dark/80 backdrop-blur-sm"
                    onClick={() => setShowProjectSelection(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 20 }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-white rounded-3xl max-w-5xl w-full max-h-[85vh] overflow-hidden border border-line-medium mx-4 project-selection-modal shadow-xl"
                    >
                      {/* Modal Header */}
                      <div className="sticky top-0 bg-white border-b border-line-medium px-6 py-4 flex items-center justify-between z-10">
                        <h3 className="text-2xl font-bold text-text-main">
                          프로젝트 선택
                        </h3>
                        <button
                          onClick={() => setShowProjectSelection(false)}
                          className="w-10 h-10 rounded-full bg-bg-light hover:bg-brand-main/10 border border-line-medium hover:border-brand-main transition-all duration-300 flex items-center justify-center text-text-secondary hover:text-brand-main"
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
                        <div className="grid grid-cols-2 gap-4">
                          {projects.map((project) => (
                            <div
                              key={project.id}
                              className="bg-white rounded-2xl overflow-hidden border border-line-medium hover:border-brand-main/50 transition-all duration-75 h-full shadow-md project-selection-card"
                            >
                              {/* Project Image */}
                              <div className="relative aspect-video bg-gradient-to-br from-brand-main/10 to-brand-sub-1/10 overflow-hidden project-image-area">
                                {project.image ? (
                                  <img 
                                    src={project.image} 
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                    style={{ display: 'block' }}
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <>
                                    <div className="absolute inset-0 bg-bg-light/40" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="text-point-yellow/60 text-4xl font-bold">
                                    {project.title.charAt(0)}
                                  </div>
                                </div>
                                  </>
                                )}
                                {/* Favorite Button */}
                                <button
                                  onClick={(e) => toggleFavoriteFromModal(project.id, e)}
                                  className={`absolute w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                                    favoriteProjects.includes(project.id)
                                      ? 'bg-brand-main text-white shadow-lg'
                                      : 'bg-white/90 text-text-secondary hover:bg-brand-main/10 hover:text-brand-main border border-line-medium'
                                  }`}
                                  style={{ top: '16px', right: '16px', left: 'auto' }}
                                >
                                  <Star 
                                    size={20} 
                                    fill={favoriteProjects.includes(project.id) ? 'currentColor' : 'none'}
                                  />
                                </button>
                                <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-white/90 text-brand-main rounded text-xs font-semibold border border-brand-main/30">
                                  {project.category === 'new' ? '신규' : 
                                   project.category === 'renewal' ? '리뉴얼' : 
                                   project.category === 'app' ? '앱' : 
                                   project.category === 'web' ? '웹' : 
                                   project.category === 'proposal' ? '기획서' : 
                                   project.category === 'usability' ? '사용성 평가' : '기타'}
                                </div>
                              </div>

                              {/* Project Content */}
                              <div className="px-4 py-2 pb-4">
                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-1">
                                  {project.tags.slice(0, 2).map((tag, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-1 bg-brand-main/10 text-brand-main text-sm rounded border border-brand-main/30"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>

                                {/* Title & Subtitle */}
                                <h4 className="text-lg font-bold text-text-main mb-1 line-clamp-1">
                                  {project.title}
                                </h4>
                                <p className="text-sm text-brand-main mb-1 line-clamp-1">
                                  {project.subtitle}
                                </p>

                                {/* Description */}
                                <p className="text-text-secondary text-sm mb-2 line-clamp-2">
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
                            className="px-8 py-3 bg-brand-main text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-300 shadow-md"
                          >
                            완료
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

      {/* Gallery Modal */}
      <AnimatePresence>
        {showGalleryModal && galleryProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
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
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-line-medium px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-2xl font-bold text-text-main">
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

              {/* Modal Content - Image Gallery */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] space-y-4">
                {/* Main Image */}
                {galleryProject.image && (
                  <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-brand-main/5 to-brand-sub-1/5">
                    <img 
                      src={galleryProject.image} 
                      alt={`${galleryProject.title} - 메인`}
                      className="w-full h-auto object-contain"
                      style={{ maxHeight: '500px' }}
                    />
                  </div>
                )}

                {/* Gallery Images */}
                {(galleryProject as any).gallery && Array.isArray((galleryProject as any).gallery) && (galleryProject as any).gallery.length > 0 && (
                  <div className="space-y-4">
                    {(galleryProject as any).gallery.map((imagePath: string, index: number) => (
                      <div 
                        key={index} 
                        className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-brand-main/5 to-brand-sub-1/5"
                      >
                        <img 
                          src={imagePath} 
                          alt={`${galleryProject.title} - ${index + 1}`}
                          className="w-full h-auto object-contain"
                          style={{ maxHeight: '500px' }}
                        />
                </div>
                    ))}
                </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
