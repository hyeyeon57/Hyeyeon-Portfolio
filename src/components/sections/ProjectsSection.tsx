'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, Users, Award, FileText, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
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
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryDirection, setGalleryDirection] = useState(0); // 카드 미리보기 슬라이드 방향
  const [lightboxImage, setLightboxImage] = useState<string | null>(null); // 라이트박스 이미지
  const [lightboxIndex, setLightboxIndex] = useState(0); // 라이트박스 이미지 인덱스
  const [showLightboxTooltip, setShowLightboxTooltip] = useState(false); // 라이트박스 자동 툴팁 (최초 1회)
  const [hasShownLightboxTooltip, setHasShownLightboxTooltip] = useState(false); // 이 세션에서 이미 한 번 보여줬는지 여부
  const [showImageTooltip, setShowImageTooltip] = useState(false); // 모달 이미지 툴팁 (3초간 표시)

  // 키보드로 라이트박스 제어 (ESC: 닫기, ← →: 이미지 이동)
  useEffect(() => {
    if (!lightboxImage || !selectedProject) return;
    
    // 라이트박스용 이미지 목록 구성
    const lightboxImages: string[] = [];
    const projectWithExtras = selectedProject as typeof selectedProject & { images?: string[]; gallery?: string[] };
    const backendImages = projectWithExtras?.images;
    if (backendImages && Array.isArray(backendImages)) {
      lightboxImages.push(...backendImages.filter(Boolean));
    } else if (projectWithExtras?.gallery && Array.isArray(projectWithExtras.gallery)) {
      lightboxImages.push(...projectWithExtras.gallery.filter(Boolean));
    }
    if (selectedProject?.image) {
      const main = selectedProject.image as string;
      if (!lightboxImages.includes(main)) {
        lightboxImages.unshift(main);
      }
    }
    
    const total = lightboxImages.length || 1;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxImage(null);
      } else if (e.key === 'ArrowLeft' && total > 1) {
        e.preventDefault();
        const newIndex = (lightboxIndex - 1 + total) % total;
        setLightboxIndex(newIndex);
        if (lightboxImages[newIndex]) {
          setLightboxImage(lightboxImages[newIndex]);
        }
      } else if (e.key === 'ArrowRight' && total > 1) {
        e.preventDefault();
        const newIndex = (lightboxIndex + 1) % total;
        setLightboxIndex(newIndex);
        if (lightboxImages[newIndex]) {
          setLightboxImage(lightboxImages[newIndex]);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, lightboxIndex, selectedProject]);

  // 라이트박스용 이미지 클릭 핸들러 (툴팁 상태도 함께 관리)
  const handleImageClickForLightbox = (image: string, index: number) => {
    setLightboxImage(image);
    setLightboxIndex(index);
  };

  // 라이트박스: "이 페이지에서 최초 진입 1번만" 3초 동안 자동 툴팁 노출
  useEffect(() => {
    if (!lightboxImage) {
      setShowLightboxTooltip(false);
      return;
    }

    // 이미 한 번 보여준 적이 있다면 더 이상 자동 툴팁을 표시하지 않음
    if (hasShownLightboxTooltip) {
      setShowLightboxTooltip(false);
      return;
    }

    setShowLightboxTooltip(true);
    const timer = setTimeout(() => {
      setShowLightboxTooltip(false);
      setHasShownLightboxTooltip(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [lightboxImage, hasShownLightboxTooltip]);

  // 모달 진입 시 3초 동안 이미지 툴팁 표시
  useEffect(() => {
    if (!selectedProject) {
      setShowImageTooltip(false);
      return;
    }

    // 모달이 열릴 때 툴팁 표시
    setShowImageTooltip(true);

    // 3초 후 툴팁 숨김
    const timer = setTimeout(() => {
      setShowImageTooltip(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [selectedProject]);

  // 모달 열릴 때 배경 스크롤 막기
  useEffect(() => {
    if (selectedProject) {
      // 모달이 열릴 때 body 스크롤 막기
      document.body.style.overflow = 'hidden';
    } else {
      // 모달이 닫힐 때 body 스크롤 복원
      document.body.style.overflow = '';
    }

    // cleanup: 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  // BO에서 featured=true로 설정된 프로젝트를 대표 프로젝트로 표시
  // featured 프로젝트만 표시 (개수 제한 없음 - 백엔드에서 설정한 대로)
  // API route에서 이미 boolean으로 변환되어 전달됨
  // useMemo로 필터링 결과 메모이제이션하여 불필요한 재계산 방지
  const displayedProjects = useMemo(() => {
    return projects.filter(project => project.featured);
  }, [projects]);

  // 로딩 UI 제거 - 캐시된 데이터가 있으면 즉시 표시, 없으면 빈 상태로 시작

  if (error) {
    // 에러 타입별 분류
    const is500Error = error.includes('500') || error.includes('Internal Server Error');
    const is503Error = error.includes('503') || error.includes('Service Unavailable');
    const isMongoDBError = error.includes('MongoDB') || error.includes('연결');
    const isNetworkError = error.includes('fetch failed') || error.includes('ECONNREFUSED') || error.includes('연결할 수 없습니다');
    const isTimeoutError = error.includes('타임아웃') || error.includes('timeout');
    
    return (
      <section id="projects" className="py-20 relative overflow-hidden" style={{ backgroundColor: '#F7F7FB' }}>
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-red-800 font-semibold mb-2 text-xl">⚠️ 프로젝트를 불러올 수 없습니다</h3>
            <p className="text-red-600 mb-4 font-medium">{error}</p>
            
            {/* 500 에러 - 백엔드 서버 문제 */}
            {is500Error && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4 text-left">
                <h4 className="text-orange-800 font-semibold mb-2">🔧 500 에러 해결 방법:</h4>
                <ol className="text-sm text-orange-700 list-decimal list-inside space-y-2">
                  <li><strong>백엔드 서버가 실행 중인지 확인:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1">
                      <li>터미널에서 <code className="bg-orange-100 px-1 rounded">npm run dev:server</code> 실행</li>
                      <li><code className="bg-orange-100 px-1 rounded">http://localhost:3005/bo-api/health</code> 접속해서 서버 상태 확인</li>
                    </ul>
                  </li>
                  <li><strong>MongoDB 연결 확인:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1">
                      <li>MongoDB가 실행 중인지 확인</li>
                      <li><code className="bg-orange-100 px-1 rounded">.env</code> 파일에 <code className="bg-orange-100 px-1 rounded">MONGODB_URI</code> 설정 확인</li>
                    </ul>
                  </li>
                  <li><strong>서버 로그 확인:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1">
                      <li>백엔드 서버 터미널에서 에러 메시지 확인</li>
                      <li><code className="bg-orange-100 px-1 rounded">[projectController]</code> 또는 <code className="bg-orange-100 px-1 rounded">[projectService]</code> 로그 확인</li>
                    </ul>
                  </li>
                </ol>
              </div>
            )}
            
            {/* 503 에러 - 서비스 사용 불가 */}
            {is503Error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4 text-left">
                <h4 className="text-yellow-800 font-semibold mb-2">🔧 503 에러 해결 방법:</h4>
                <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1">
                  <li>백엔드 서버가 실행 중인지 확인</li>
                  <li>MongoDB 연결 상태 확인</li>
                  <li>백엔드 서버 상태 확인: <a href="http://localhost:3005/bo-api/health" target="_blank" className="text-blue-600 underline">Health Check</a></li>
                </ol>
              </div>
            )}
            
            {/* 네트워크 에러 - 백엔드 서버에 연결할 수 없음 */}
            {isNetworkError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4 text-left">
                <h4 className="text-red-800 font-semibold mb-2">🌐 네트워크 연결 문제:</h4>
                <p className="text-sm text-red-700 mb-2">
                  백엔드 서버에 연결할 수 없습니다. 다음을 확인하세요:
                </p>
                <ol className="text-sm text-red-700 list-decimal list-inside space-y-1">
                  <li><strong>백엔드 서버 실행:</strong> 터미널에서 <code className="bg-red-100 px-1 rounded">npm run dev:server</code> 실행</li>
                  <li><strong>포트 확인:</strong> 포트 3005가 사용 중인지 확인</li>
                  <li><strong>방화벽 확인:</strong> 방화벽이 포트 3005를 차단하지 않는지 확인</li>
                </ol>
              </div>
            )}
            
            {/* 타임아웃 에러 */}
            {isTimeoutError && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4 text-left">
                <h4 className="text-purple-800 font-semibold mb-2">⏱️ 타임아웃 문제:</h4>
                <p className="text-sm text-purple-700">
                  백엔드 서버 응답이 너무 느립니다. MongoDB 연결이 느리거나 서버가 과부하 상태일 수 있습니다.
                </p>
              </div>
            )}
            
            {/* MongoDB 에러 */}
            {isMongoDBError && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 text-left">
                <h4 className="text-blue-800 font-semibold mb-2">💡 MongoDB 연결 문제:</h4>
                <p className="text-sm text-blue-700">
                  MongoDB 연결이 실패했습니다. <code className="bg-blue-100 px-1 rounded">.env</code> 파일에 <code className="bg-blue-100 px-1 rounded">MONGODB_URI</code>가 올바르게 설정되어 있는지 확인하세요.
                </p>
              </div>
            )}
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4 text-left">
              <h4 className="text-gray-800 font-semibold mb-2">📋 디버깅 방법:</h4>
              <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                <li>브라우저 개발자 도구(F12) → Network 탭에서 <code className="bg-gray-100 px-1 rounded">/api/projects</code> 요청 확인</li>
                <li>브라우저 콘솔(F12) → Console 탭에서 자세한 에러 메시지 확인</li>
                <li>백엔드 서버 터미널에서 에러 로그 확인</li>
                <li>Next.js 서버 터미널에서 <code className="bg-gray-100 px-1 rounded">📡 백엔드 API 호출</code> 로그 확인</li>
              </ul>
            </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12 max-w-7xl mx-auto">
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
              onClick={() => {
                setSelectedProject(project);
              }}
            >
              <div className="bg-white rounded-2xl overflow-hidden border border-line-light hover:border-brand-main/50 transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                {/* Project Image */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-gradient-to-br from-brand-main/5 to-brand-sub-1/5">
                  {project.image && (
                    <Image 
                      src={project.image} 
                      alt={project.title}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-500"
                      style={{ display: 'block', margin: 0 }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      unoptimized={project.image?.startsWith('http') || project.image?.startsWith('//')}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Gallery Preview Button (아이콘 제거 요청으로 비활성화) */}
                  
                  {/* 카테고리 표시: 배열이면 첫 번째, 없거나 유효하지 않으면 표시하지 않음 */}
                  {(() => {
                    // category가 배열인 경우 첫 번째 값 사용
                    const categoryValue = Array.isArray(project.category) 
                      ? project.category[0] 
                      : project.category;
                    
                    // 유효한 카테고리인지 확인
                    const categoryInfo = categoryValue 
                      ? PROJECT_CATEGORIES.find(c => c.id === categoryValue)
                      : null;
                    
                    // 유효한 카테고리가 있으면 표시
                    return categoryInfo ? (
                      <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-brand-main rounded-lg text-xs font-semibold border border-brand-main/20">
                        {categoryInfo.label}
                      </div>
                    ) : null;
                  })()}
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
          <Link href="/projects" prefetch={true}>
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
              className="bg-white rounded-3xl overflow-hidden max-w-5xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl"
              style={{ borderRadius: '1.5rem 1.5rem 0 0' }}
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 bg-white border-b border-line-medium p-4 flex items-start justify-between mb-0">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl md:text-2xl font-bold text-text-main">
                  {selectedProject.title}
                    </h2>
                  </div>
                  <p className="text-brand-main font-medium text-sm">{selectedProject.subtitle}</p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text-main transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
            <div
              className="p-0 custom-scrollbar"
              style={{ overflowY: 'auto', scrollbarGutter: 'stable both-edges' }}
            >
                {/* 이미지 세로 스크롤 - 크게 표시 */}
                {(() => {
                  try {
                    const images: string[] = [];
                    if (selectedProject?.image) images.push(selectedProject.image as string);
                    const projectWithExtras = selectedProject as typeof selectedProject & { gallery?: string[] };
                    if (projectWithExtras?.gallery && Array.isArray(projectWithExtras.gallery)) {
                      images.push(...projectWithExtras.gallery.filter(Boolean));
                    }
                    const total = images.length;
                    if (total === 0) return null;
                    
                    return (
                      <div className="overflow-visible" style={{ marginTop: 0, marginLeft: 0, marginRight: 0, width: '100%' }}>
                        {/* 이미지 영역 - 풀블리드 레이아웃 */}
                        <div className="space-y-0" style={{ margin: 0, padding: 0, width: '100%' }}>
                          {images.map((image, index) => {
                            if (!image) return null;
                            return (
                              <motion.div
                                key={`${image}-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="group relative w-full cursor-pointer hover:opacity-90 transition-opacity"
                                style={{ margin: 0, padding: 0, width: '100%', display: 'block', overflow: 'visible' }}
                                onClick={() => handleImageClickForLightbox(image, index)}
                              >
                                <Image
                                  src={image}
                                  alt={`${selectedProject?.title || ''} - 이미지 ${index + 1}`}
                                  width={1200}
                                  height={800}
                                  className="w-full h-auto object-contain"
                                  style={{ width: '100%', margin: 0, padding: 0, display: 'block', objectFit: 'contain' }}
                                  loading="lazy"
                                  onError={(e) => {
                                    console.error('이미지 로드 실패:', image);
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                  unoptimized={image?.startsWith('http') || image?.startsWith('//')}
                                />
                                
                                {/* 클릭 안내 툴팁 (모달 진입 후 3초간 표시, 첫 번째 이미지에만) */}
                                {index === 0 && (
                                  <AnimatePresence>
                                    {showImageTooltip && (
                                      <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.3 }}
                                        className="pointer-events-none absolute bottom-4 left-0 right-0 mx-auto w-fit bg-black/85 text-white text-sm px-4 py-2 rounded-full shadow-lg flex items-center justify-center gap-2 z-10"
                                      >
                                        <Eye size={16} className="opacity-90" />
                                        <span className="font-medium">이미지 클릭 시 더 크게 볼 수 있어요!</span>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  } catch (error) {
                    console.error('이미지 렌더링 오류:', error);
                    return (
                      <div className="mb-8 rounded-2xl overflow-hidden border border-line-light bg-white p-4 text-center text-text-secondary">
                        이미지를 불러오는 중 오류가 발생했습니다.
                      </div>
                    );
                  }
                })()}

                {/* Project Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 px-8 pt-8">
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
                <div className="flex flex-wrap gap-2 mb-8 px-8">
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
                <div className="mb-8 px-8">
                  <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
                    <span className="text-brand-main">📋</span>
                    프로젝트 개요
                  </h3>
                  <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Achievements */}
                {selectedProject.achievements && selectedProject.achievements.length > 0 && (
                  <div className="mb-8 px-8">
                    <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
                      <span className="text-brand-main">🎯</span>
                      주요 성과
                    </h3>
                    <ul className="space-y-3">
                      {selectedProject.achievements.slice(0, 3).map((achievement, i) => (
                        <li key={i} className="flex items-start gap-3 text-text-secondary">
                          <Award size={18} className="text-brand-main mt-0.5 flex-shrink-0" />
                          <span className="leading-relaxed whitespace-pre-line">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Retrospective */}
                {(selectedProject as typeof selectedProject & { retrospective?: string }).retrospective && (
                  <div className="mb-8 px-8">
                    <h3 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
                      <span className="text-brand-main">💭</span>
                      회고
                    </h3>
                    <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                      {(selectedProject as typeof selectedProject & { retrospective?: string }).retrospective}
                    </p>
                  </div>
                )}

                {/* External Links */}
                <div className="mt-8 pt-8 pb-8 border-t border-line-light flex flex-wrap gap-3 px-8">
                  {/* 프로젝트 상세보기 - PDF 우선, 없으면 링크 */}
                  {(() => {
                    const projectWithExtras = selectedProject as typeof selectedProject & { detailPdf?: string };
                    const detailPdf = projectWithExtras.detailPdf;
                    const link = selectedProject.link;
                    
                    if (detailPdf) {
                      return (
                        <a
                          href={`${detailPdf}#view=Fit`}
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
                    const projectWithExtras = selectedProject as typeof selectedProject & {
                      designPdf?: string;
                      designLink?: string;
                      figmaLink?: string;
                      designFile?: string;
                    };
                    const designPdf = projectWithExtras.designPdf;
                    const designLink = projectWithExtras.designLink || projectWithExtras.figmaLink || projectWithExtras.designFile;
                    
                    if (designPdf) {
                      return (
                        <a
                          href={`${designPdf}#view=Fit`}
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
                  
                </div>
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
                {(() => {
                  const galleryImages: string[] = [];
                  const projectWithExtras = galleryProject as typeof galleryProject & { gallery?: string[] };
                  if (galleryProject?.image) galleryImages.push(galleryProject.image as string);
                  if (projectWithExtras.gallery && Array.isArray(projectWithExtras.gallery)) {
                    galleryImages.push(...projectWithExtras.gallery.filter(Boolean));
                  }
                  if (!galleryImages.length) {
                    return (
                      <div className="text-center text-text-secondary py-12">
                        표시할 이미지가 없습니다.
                      </div>
                    );
                  }

                  const safeIndex = ((galleryIndex % galleryImages.length) + galleryImages.length) % galleryImages.length;
                  const currentImg = galleryImages[safeIndex];
                  const go = (dir: number) => {
                    setGalleryDirection(dir);
                    setGalleryIndex((prev) => (prev + dir + galleryImages.length) % galleryImages.length);
                  };

                  return (
                    <div className="space-y-4">
                      <div className="relative rounded-2xl overflow-hidden border border-line-light bg-bg-light">
                        <AnimatePresence initial={false} mode="wait">
                          <motion.img
                            key={currentImg}
                            src={currentImg}
                            alt={`${galleryProject.title} ${safeIndex + 1}`}
                            className="w-full max-h-[540px] object-contain bg-white"
                            initial={{ opacity: 0, x: galleryDirection >= 0 ? 60 : -60 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: galleryDirection >= 0 ? -60 : 60 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                          />
                        </AnimatePresence>
                        {galleryImages.length > 1 && (
                          <>
                            <button
                              onClick={() => go(-1)}
                              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow border border-line-light flex items-center justify-center text-text-main"
                              aria-label="이전 이미지"
                            >
                              ‹
                            </button>
                            <button
                              onClick={() => go(1)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow border border-line-light flex items-center justify-center text-text-main"
                              aria-label="다음 이미지"
                            >
                              ›
                            </button>
                          </>
                        )}
                      </div>
                      {galleryImages.length > 1 && (
                        <div className="flex flex-wrap justify-center gap-2">
                          {galleryImages.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setGalleryIndex(idx)}
                              className={`w-3 h-3 rounded-full border transition ${idx === safeIndex ? 'bg-brand-main border-brand-main' : 'bg-gray-200 border-gray-300'}`}
                              aria-label={`${idx + 1}번째 이미지 보기`}
                              title={`${idx + 1}번째 이미지`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 라이트박스 (Lightbox) */}
      <AnimatePresence>
        {lightboxImage && selectedProject && (() => {
          try {
            // 선택된 프로젝트에서 라이트박스용 이미지 목록 구성
            const lightboxImages: string[] = [];

            // 백엔드에서 normalize된 images 배열 우선 사용
            const projectWithExtras = selectedProject as typeof selectedProject & { images?: string[]; gallery?: string[] };
            const backendImages = projectWithExtras?.images;
            if (backendImages && Array.isArray(backendImages)) {
              lightboxImages.push(...backendImages.filter(Boolean));
            } else if (projectWithExtras?.gallery && Array.isArray(projectWithExtras.gallery)) {
              // 구 버전 데이터용 fallback
              lightboxImages.push(...projectWithExtras.gallery.filter(Boolean));
            }

            // 메인 이미지가 따로 있고, 배열에 포함되어 있지 않으면 선두에 추가
            if (selectedProject?.image) {
              const main = selectedProject.image as string;
              if (!lightboxImages.includes(main)) {
                lightboxImages.unshift(main);
              }
            }

            const total = lightboxImages.length || 1;
            const safeIndex = total > 0
              ? Math.min(Math.max(lightboxIndex, 0), total - 1)
              : 0;
            const currentImage =
              total > 0 && lightboxImages[safeIndex]
                ? lightboxImages[safeIndex]
                : lightboxImage;

            const handleClose = () => {
              setLightboxImage(null);
            };

            const handlePrev = (e: React.MouseEvent) => {
              e.stopPropagation();
              if (total > 1 && lightboxImages.length > 0) {
                const newIndex = (safeIndex - 1 + total) % total;
                setLightboxIndex(newIndex);
                if (lightboxImages[newIndex]) {
                  setLightboxImage(lightboxImages[newIndex]);
                }
              }
            };

            const handleNext = (e: React.MouseEvent) => {
              e.stopPropagation();
              if (total > 1 && lightboxImages.length > 0) {
                const newIndex = (safeIndex + 1) % total;
                setLightboxIndex(newIndex);
                if (lightboxImages[newIndex]) {
                  setLightboxImage(lightboxImages[newIndex]);
                }
              }
            };

            return (
              <motion.div
                key="lightbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={handleClose}
              >
                {/* 닫기 버튼 */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors z-10"
                  aria-label="닫기"
                >
                  <X size={24} />
                </button>

                {/* 이미지 컨테이너 */}
                <div
                  className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImage}
                      src={currentImage}
                          alt={`${selectedProject?.title || ''} - 이미지 ${safeIndex + 1}`}
                      className="max-w-full max-h-[95vh] object-contain"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      onError={(e) => {
                        console.error('라이트박스 이미지 로드 실패:', currentImage);
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </AnimatePresence>

                  {/* 라이트박스 안에서 방향키 사용 안내 툴팁: 어떤 이미지를 열었든, 열린 직후 3초 동안만 표시 */}
                  {total > 1 && showLightboxTooltip && (
                    <div className="pointer-events-none absolute bottom-14 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg flex items-center gap-1 opacity-90">
                      <Eye size={14} className="opacity-90" />
                      <span className="font-medium">좌우 방향키로 이미지를 넘겨볼 수 있어요</span>
                    </div>
                  )}

                  {/* 이전/다음 버튼 (이미지가 여러 개일 때만) */}
                  {total > 1 && (
                    <>
                      <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-colors"
                        aria-label="이전 이미지"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-colors"
                        aria-label="다음 이미지"
                      >
                        <ChevronRight size={24} />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-4 py-2 rounded-full">
                        {safeIndex + 1} / {total}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            );
          } catch (error) {
            console.error('라이트박스 렌더링 오류:', error);
            return null;
          }
        })()}
      </AnimatePresence>
    </section>
  );
};
