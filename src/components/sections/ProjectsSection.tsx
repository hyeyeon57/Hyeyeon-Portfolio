'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, Users, Award, Eye, FileText } from 'lucide-react';
import Link from 'next/link';
import { PROJECT_CATEGORIES } from '@/constants/categories';
import { useProjects } from '@/hooks/useProjects';

interface ProjectsSectionProps {
  theme?: 'light' | 'dark';
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = () => {
  // 커스텀 훅으로 데이터 페칭 로직 분리
  const { projects, loading, error } = useProjects();

  // UI 상태만 관리
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryProject, setGalleryProject] = useState<typeof projects[0] | null>(null);

  // BO에서 featured=true로 설정된 프로젝트를 대표 프로젝트로 표시
  // featured 프로젝트만 표시 (개수 제한 없음 - 백엔드에서 설정한 대로)
  // featured 필드를 명시적으로 boolean으로 변환하여 필터링
  const displayedProjects = projects.filter(project => {
    const isFeatured = project.featured === true || project.featured === 'true';
    return isFeatured;
  });
  
  // 디버깅: featured 프로젝트 개수 확인 (항상 로그 출력)
  if (typeof window !== 'undefined') {
    console.log('📌 대표 프로젝트 필터링 결과:', {
      totalProjects: projects.length,
      featuredCount: displayedProjects.length,
      featuredProjects: displayedProjects.map(p => ({ title: p.title, featured: p.featured })),
      allProjects: projects.map(p => ({ title: p.title, featured: p.featured, featuredType: typeof p.featured }))
    });
  }

  // 에러 또는 로딩 상태 표시
  if (loading) {
    return (
      <section id="projects" className="py-20 relative overflow-hidden" style={{ backgroundColor: '#F7F7FB' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-primary mb-4">대표 프로젝트</h2>
            <p className="text-text-secondary">프로젝트를 불러오는 중...</p>
          </div>
          {/* 스켈레톤 UI */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    // 503 에러인 경우 특별한 메시지 표시
    const is503Error = error.includes('503') || error.includes('Service Unavailable');
    const isMongoDBError = error.includes('MongoDB') || error.includes('연결');
    
    return (
      <section id="projects" className="py-20 relative overflow-hidden" style={{ backgroundColor: '#F7F7FB' }}>
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-red-800 font-semibold mb-2">⚠️ 프로젝트를 불러올 수 없습니다</h3>
            <p className="text-red-600 mb-4">{error}</p>
            
            {is503Error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4 text-left">
                <h4 className="text-yellow-800 font-semibold mb-2">🔧 503 에러 해결 방법:</h4>
                <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1">
                  <li>Vercel 환경 변수 확인: <code className="bg-yellow-100 px-1 rounded">MONGODB_URI</code> 설정 여부</li>
                  <li>MongoDB Atlas Network Access: <code className="bg-yellow-100 px-1 rounded">0.0.0.0/0</code> 설정 확인</li>
                  <li>백엔드 서버 상태 확인: <a href="/bo-api/health" target="_blank" className="text-blue-600 underline">Health Check</a></li>
                  <li>Vercel 로그 확인: Deployments → Functions → /bo-api/projects</li>
                </ol>
              </div>
            )}
            
            {isMongoDBError && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 text-left">
                <h4 className="text-blue-800 font-semibold mb-2">💡 MongoDB 연결 문제:</h4>
                <p className="text-sm text-blue-700">
                  MongoDB 연결이 실패했습니다. Vercel 환경 변수에 <code className="bg-blue-100 px-1 rounded">MONGODB_URI</code>가 올바르게 설정되어 있는지 확인하세요.
                </p>
              </div>
            )}
            
            <p className="text-sm text-red-500 mt-4">
              브라우저 콘솔(F12)을 열어 자세한 오류를 확인하세요.
              <br />
              백엔드 서버 연결 상태를 확인해주세요.
            </p>
          </div>
        </div>
      </section>
    );
  }

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
                    대표 프로젝트
                  </motion.span>
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-text-main">
            Main Projects
          </h2>
          <p className="text-2xl text-brand-main font-semibold">
            &ldquo;제가 가장 자신 있게 안내할 수 있는 프로젝트를 소개합니다.&rdquo;
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
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-brand-main/5 to-brand-sub-1/5">
                  {project.image && (
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 block"
                      style={{ display: 'block', margin: 0 }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
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
                    {PROJECT_CATEGORIES.find(c => c.id === project.category)?.label || project.category}
                  </div>
                </div>

                {/* Project Content */}
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
          );
          })}
        </div>

        {/* Show All Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
          <Link href="/projects">
            <button
              className="px-8 py-4 bg-brand-main text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-300"
            >
              전체 프로젝트 보기
            </button>
          </Link>
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
                    <p className="text-xs text-text-secondary mb-1 font-medium">진행 기간</p>
                    <p className="text-sm font-semibold text-text-main">
                      {selectedProject.date && selectedProject.duration 
                        ? `${selectedProject.date} (${selectedProject.duration})`
                        : selectedProject.date || selectedProject.duration || '-'}
                    </p>
                  </div>
                  <div className="bg-bg-light rounded-xl p-4 border border-line-light">
                    <p className="text-xs text-text-secondary mb-1 font-medium">팀 구성</p>
                    <p className="text-sm font-semibold text-text-main">{selectedProject.team || '-'}</p>
                  </div>
                  <div className="bg-bg-light rounded-xl p-4 border border-line-light">
                    <p className="text-xs text-text-secondary mb-2 font-medium">역량</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.role ? (
                        selectedProject.role.split(/[,，、]/).map((keyword, index) => {
                          const trimmedKeyword = keyword.trim();
                          if (!trimmedKeyword) return null;
                          return (
                            <span
                              key={index}
                              className="px-3 py-1 bg-brand-main/5 text-brand-main text-xs font-medium rounded-full border border-brand-main/20"
                            >
                              {trimmedKeyword}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-sm text-text-secondary">-</span>
                      )}
                    </div>
                  </div>
                  <div className="bg-bg-light rounded-xl p-4 border border-line-light">
                    <p className="text-xs text-text-secondary mb-1 font-medium">기여도</p>
                    <p className="text-sm font-semibold text-text-main">
                      {selectedProject.achievements && selectedProject.achievements.length > 0
                        ? `${selectedProject.achievements.length}개 성과`
                        : selectedProject.role || '-'}
                    </p>
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
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
                    <span className="text-brand-main">💭</span>
                    회고
                  </h3>
                  <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                    {(selectedProject as any).retrospective || '회고 내용이 없습니다.'}
                  </p>
                </div>

                {/* External Links */}
                <div className="mt-8 pt-8 border-t border-line-light flex flex-wrap gap-3">
                  {/* 프로젝트 상세보기 - PDF 우선, 없으면 링크 */}
                  {(() => {
                    const detailPdf = (selectedProject as any).detailPdf;
                    const link = selectedProject.link;
                    
                    if (detailPdf) {
                      return (
                        <a
                          href={detailPdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-main text-white rounded-xl hover:opacity-90 transition-all duration-300 shadow-md"
                        >
                          <FileText size={18} />
                          <span className="font-medium">프로젝트 상세보기</span>
                        </a>
                      );
                    } else if (link && link !== '#') {
                      return (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-main text-white rounded-xl hover:opacity-90 transition-all duration-300 shadow-md"
                        >
                          <ExternalLink size={18} />
                          <span className="font-medium">프로젝트 상세보기</span>
                        </a>
                      );
                    } else {
                      return (
                        <button
                          disabled
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed opacity-50"
                        >
                          <ExternalLink size={18} />
                          <span className="font-medium">프로젝트 상세보기</span>
                        </button>
                      );
                    }
                  })()}
                  
                  {/* 화면 설계서 보기 - PDF 우선, 없으면 링크 */}
                  {(() => {
                    const designPdf = (selectedProject as any).designPdf;
                    const designLink = (selectedProject as any).designLink || (selectedProject as any).figmaLink || (selectedProject as any).designFile;
                    
                    if (designPdf) {
                      return (
                        <a
                          href={designPdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:opacity-90 transition-all duration-300 shadow-md"
                        >
                          <FileText size={18} />
                          <span className="font-medium">화면 설계서 보기</span>
                        </a>
                      );
                    } else if (designLink) {
                      const isFile = designLink && (designLink.startsWith('/') || designLink.startsWith('./') || designLink.match(/\.(pdf|doc|docx|ppt|pptx|xls|xlsx)$/i));
                      
                      if (isFile) {
                        return (
                          <a
                            href={designLink.startsWith('/') ? designLink : `/${designLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:opacity-90 transition-all duration-300 shadow-md"
                          >
                            <FileText size={18} />
                            <span className="font-medium">화면 설계서 보기</span>
                          </a>
                        );
                      } else {
                        return (
                          <a
                            href={designLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:opacity-90 transition-all duration-300 shadow-md"
                          >
                            <FileText size={18} />
                            <span className="font-medium">화면 설계서 보기</span>
                          </a>
                        );
                      }
                    } else {
                      return (
                        <button
                          disabled
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed opacity-50"
                        >
                          <FileText size={18} />
                          <span className="font-medium">화면 설계서 보기</span>
                        </button>
                      );
                    }
                  })()}
                  
                  {/* 미리보기 PDF */}
                  {(selectedProject as any).previewPdf && (
                    <a
                      href={(selectedProject as any).previewPdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:opacity-90 transition-all duration-300 shadow-md"
                    >
                      <FileText size={18} />
                      <span className="font-medium">미리보기</span>
                    </a>
                  )}
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
