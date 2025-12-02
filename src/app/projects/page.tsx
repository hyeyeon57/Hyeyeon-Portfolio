'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Calendar, Users, Award, X, ArrowLeft, Download, Eye, FileText } from 'lucide-react';
import { projects as initialProjects } from '@/data/portfolio';
import Link from 'next/link';

type Project = typeof initialProjects[0];

export default function AllProjectsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]); // 초기값을 빈 배열로 변경 (정적 데이터 사용 안 함)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryProject, setGalleryProject] = useState<Project | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [detailImageIndex, setDetailImageIndex] = useState(0);
  const [detailDirection, setDetailDirection] = useState(0); // 슬라이드 방향 (애니메이션)
  const [galleryDirection, setGalleryDirection] = useState(0); // 갤러리 모달 슬라이드 방향

  // 클라이언트 마운트 시 BO 서버에서 데이터 로드
  useEffect(() => {
    setIsMounted(true);
    
    // 방문자 로그 저장 (중복 방지)
    const logVisit = async () => {
      // 세션 스토리지를 사용하여 중복 방지
      const lastVisitTime = sessionStorage.getItem('lastVisitTime');
      const now = Date.now();
      
      // 1초 이내 중복 요청 방지
      if (lastVisitTime && (now - parseInt(lastVisitTime)) < 1000) {
        return;
      }
      
      sessionStorage.setItem('lastVisitTime', now.toString());
      
      try {
        // 백오피스 서버 URL 설정 (통합 배포 지원)
        const getApiUrl = () => {
          if (typeof window !== 'undefined') {
            // 클라이언트 사이드: 현재 호스트 사용 (같은 프로젝트)
            const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            if (isLocalhost) {
              return 'http://localhost:3005';
            }
            // 같은 프로젝트 내에서 실행 중이면 현재 호스트 사용
            return window.location.origin; // 예: https://hyeyeon-portfolio.vercel.app
          }
          
          // 서버 사이드
          if (process.env.NEXT_PUBLIC_BACKOFFICE_URL) {
            return process.env.NEXT_PUBLIC_BACKOFFICE_URL;
          }
          
          if (process.env.BACKOFFICE_API_URL) {
            return process.env.BACKOFFICE_API_URL;
          }
          
          // Vercel 환경: 같은 프로젝트로 간주
          if (process.env.VERCEL) {
            const vercelUrl = process.env.VERCEL_URL 
              ? `https://${process.env.VERCEL_URL}`
              : 'https://hyeyeon-portfolio.vercel.app';
            return vercelUrl;
          }
          
          return 'http://localhost:3005';
        };
        
        const apiUrl = getApiUrl();
        // 같은 프로젝트 내에서 /bo-api 경로 사용
        const fetchUrl = `${apiUrl}/bo-api/visitors`;
        
        await fetch(fetchUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: window.location.pathname, // /projects 경로 저장
            userAgent: navigator.userAgent,
          }),
        });
      } catch (error) {
        // 방문자 로그 저장 실패는 무시 (FO 화면에 영향 없음)
        console.error('방문자 로그 저장 실패:', error);
      }
    };
    
    logVisit();
    
    const fetchProjects = async (forceRefresh = false) => {
      try {
        // 강제 새로고침 시 타임스탬프를 더 크게 만들어 캐시 완전 무효화
        const timestamp = forceRefresh ? Date.now() + Math.random() : Date.now();
        const response = await fetch(`/api/projects?t=${timestamp}&_=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          console.error('❌ 백엔드 API 호출 실패:', {
            status: response.status,
            statusText: response.statusText,
            url: response.url
          });
          // API 호출 실패 시 빈 배열 사용 (정적 데이터 사용 안 함)
          console.warn('⚠️ 백엔드 연결 실패 - 빈 배열 사용 (정적 데이터 사용 안 함)');
          setProjects([]);
          return;
        }
        
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          // BO 데이터를 우선으로 사용
          const boProjects: Project[] = result.data.map((p: any) => ({
            id: p.id || p._id?.toString() || '',
            title: p.title || '',
            subtitle: p.subtitle || '',
            description: p.description || '',
            fullDescription: p.fullDescription || '',
            image: p.image || p.images?.[0] || '',
            tags: p.tags || [],
            category: p.category || 'new',
            date: p.date || '',
            startDate: (p as any).startDate || '',
            endDate: (p as any).endDate || '',
            role: p.role || '',
            duration: p.duration || '',
            team: p.team || '',
            achievements: p.achievements || [],
            link: p.link || '#',
            designLink: (p as any).designLink || (p as any).figmaLink || (p as any).designFile || '',
            designPdf: (p as any).designPdf || '',
            detailPdf: (p as any).detailPdf || '',
            previewPdf: (p as any).previewPdf || '',
            retrospective: (p as any).retrospective || '',
            gallery: (p as any).gallery || [],
            featured: p.featured === true || p.featured === 'true', // boolean 강제 변환
          } as Project & { designLink?: string; designFile?: string; designPdf?: string; detailPdf?: string; previewPdf?: string }));
          
          // BO에 프로젝트가 있으면 BO 데이터 사용, 없으면 빈 배열 사용
          if (boProjects.length > 0) {
            const featuredCount = boProjects.filter(p => p.featured).length;
            console.log('✅ 백엔드 프로젝트 데이터 로드 성공:', {
              total: boProjects.length,
              featured: featuredCount,
              featuredProjects: boProjects.filter(p => p.featured).map(p => p.title)
            });
            setProjects(boProjects);
          } else {
            // BO에 데이터가 없으면 빈 배열 사용 (정적 데이터 사용 안 함)
            console.warn('⚠️ 백엔드에 프로젝트가 없음 - 빈 배열 사용');
            setProjects([]);
          }
        } else {
          // 응답 형식 오류 시 빈 배열 사용 (정적 데이터 사용 안 함)
          console.error('❌ 백엔드 응답 형식 오류:', result);
          setProjects([]);
        }
      } catch (error) {
        console.error('❌ 프로젝트 로드 오류:', error);
        // 오류 시 빈 배열 사용 (정적 데이터 사용 안 함)
        console.warn('⚠️ 백엔드 연결 실패 - 빈 배열 사용 (정적 데이터 사용 안 함)');
        setProjects([]);
      }
    };

    fetchProjects(true); // 초기 로드 시 강제 새로고침
    
    // 페이지 포커스를 받을 때마다 데이터 새로고침 (즐겨찾기 변경 즉시 반영)
    const handleFocus = () => {
      fetchProjects(true); // 강제 새로고침
    };
    window.addEventListener('focus', handleFocus);
    
    // visibilitychange 이벤트도 감지 (탭 전환 시)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchProjects(true); // 강제 새로고침
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // 주기적으로 새로고침 (5초마다 - 더 자주 체크)
    const interval = setInterval(() => fetchProjects(true), 5000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // 프로젝트 데이터는 BO 서버에서 관리하므로 localStorage 저장 제거

  const formatRange = (project: any) => {
    const toYM = (v?: string | null) => {
      if (!v) return null;
      const trimmed = v.trim();
      // 우선 년-월 포맷 추출
      const m = trimmed.match(/(\d{2,4})[.\-\/](\d{1,2})/);
      if (m) {
        const yy = m[1].slice(-2);
        const mm = m[2].padStart(2, '0');
        return `${yy}-${mm}`;
      }
      const d = new Date(trimmed);
      if (Number.isNaN(d.getTime())) return null;
      const yy = d.getFullYear().toString().slice(-2);
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      return `${yy}-${mm}`;
    };

    const s = project.startDate;
    const e = project.endDate;
    const fs = toYM(s);
    const fe = toYM(e);
    if (fs && fe) return `${fs} ~ ${fe}`;
    if (fs) return fs;

    if (project.date && typeof project.date === 'string') {
      const parts = project.date.split('~').map((p: string) => toYM(p));
      if (parts.length === 2 && parts[0] && parts[1]) return `${parts[0]} ~ ${parts[1]}`;
      if (parts[0]) return parts[0];
      const single = toYM(project.date);
      if (single) return single;
      return project.date;
    }
    return '';
  };

  const categories = [
    { id: 'all', label: '전체', count: projects.length },
    { id: 'featured', label: '대표', count: projects.filter(p => p.featured).length },
    { id: 'new', label: '신규', count: projects.filter(p => p.category === 'new').length },
    { id: 'renewal', label: '리뉴얼', count: projects.filter(p => p.category === 'renewal').length },
    { id: 'app', label: '앱', count: projects.filter(p => p.category === 'app').length },
    { id: 'web', label: '웹', count: projects.filter(p => p.category === 'web').length },
    { id: 'proposal', label: '기획안', count: projects.filter(p => p.category === 'proposal').length },
    { id: 'usability', label: '사용성평가', count: projects.filter(p => p.category === 'usability').length },
  ];

  // 필터링된 프로젝트
  const filteredProjects = selectedCategories.includes('all')
    ? projects
    : selectedCategories.includes('featured')
    ? projects.filter(project => project.featured)
    : projects.filter(project => selectedCategories.includes(project.category));

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (categoryId === 'all') {
        return ['all'];
      }
      
      if (categoryId === 'featured') {
        // 대표 필터는 단독으로만 선택 가능
        return prev.includes('featured') ? ['all'] : ['featured'];
      }
      
      const newCategories = prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev.filter(id => id !== 'all' && id !== 'featured'), categoryId];
      
      return newCategories.length === 0 ? ['all'] : newCategories;
    });
  };

  useEffect(() => {
    // 갤러리 대상 프로젝트가 변경될 때마다 첫 이미지로 초기화
    setGalleryIndex(0);
    setGalleryDirection(0);
  }, [galleryProject]);

  useEffect(() => {
    // 상세 모달 열릴 때 이미지 슬라이더 초기화
    setDetailImageIndex(0);
    setDetailDirection(0);
  }, [selectedProject]);


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
      <div className="min-h-screen py-20" style={{
        background: 'linear-gradient(135deg, #ECE9FF 0%, #F7F7FF 50%, #FFFFFF 100%)'
      }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-text-primary mb-4">전체 프로젝트</h1>
            <p className="text-text-secondary">프로젝트를 불러오는 중...</p>
          </div>
          {/* 스켈레톤 UI */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
            <div className="flex items-center gap-4">
              <Link href="/">
                <motion.button
                  whileHover={{ x: -5 }}
                  className="flex items-center gap-2 text-text-secondary hover:text-brand-main transition-colors duration-300"
                >
                  <ArrowLeft size={20} />
                  <span className="text-sm font-medium">홈으로</span>
                </motion.button>
              </Link>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-brand-main">
              전체 프로젝트
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
                        {formatRange(project)}
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
                {(() => {
                  const detailImages: string[] = [];
                  if ((selectedProject as any).image) detailImages.push((selectedProject as any).image);
                  if ((selectedProject as any).gallery && Array.isArray((selectedProject as any).gallery)) {
                    detailImages.push(...(selectedProject as any).gallery.filter(Boolean));
                  }

                  if (!detailImages.length) return null;
                  const safeIndex = ((detailImageIndex % detailImages.length) + detailImages.length) % detailImages.length;
                  const go = (dir: number) => {
                    setDetailDirection(dir);
                    setDetailImageIndex((prev) => (prev + dir + detailImages.length) % detailImages.length);
                  };

                  return (
                    <div className="mb-8 rounded-2xl overflow-hidden border border-line-light relative group bg-bg-light">
                      <AnimatePresence initial={false} mode="wait">
                        <motion.img
                          key={detailImages[safeIndex]}
                          src={detailImages[safeIndex]}
                          alt={`${selectedProject.title} ${safeIndex + 1}`}
                          className="w-full h-auto max-h-[540px] object-contain bg-white"
                          initial={{ opacity: 0, x: detailDirection >= 0 ? 60 : -60 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: detailDirection >= 0 ? -60 : 60 }}
                          transition={{ duration: 0.35, ease: 'easeInOut' }}
                        />
                      </AnimatePresence>
                      {detailImages.length > 1 && (
                        <>
                          <button
                            onClick={() => go(-1)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow border border-line-light flex items-center justify-center text-text-main opacity-0 group-hover:opacity-100 transition"
                            aria-label="이전 이미지"
                          >
                            ‹
                          </button>
                          <button
                            onClick={() => go(1)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow border border-line-light flex items-center justify-center text-text-main opacity-0 group-hover:opacity-100 transition"
                            aria-label="다음 이미지"
                          >
                            ›
                          </button>
                        </>
                      )}
                      {detailImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 rounded-full bg-black/40 backdrop-blur text-white">
                          {detailImages.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setDetailImageIndex(idx)}
                              className={`w-2.5 h-2.5 rounded-full transition ${idx === safeIndex ? 'bg-white' : 'bg-white/40'}`}
                              aria-label={`${idx + 1}번째 이미지 보기`}
                            />
                          ))}
                        </div>
                      )}
                      {/* Gallery Button - show only if gallery exists */}
                      {(selectedProject as any).gallery && Array.isArray((selectedProject as any).gallery) && (selectedProject as any).gallery.length > 0 && (
                        <button
                          onClick={() => {
                            setGalleryProject(selectedProject);
                            setGalleryIndex(safeIndex);
                            setShowGalleryModal(true);
                          }}
                          className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm text-brand-main transition-all duration-300 border border-brand-main/30 hover:border-brand-main/50 shadow-lg opacity-0 group-hover:opacity-100 flex items-center justify-center"
                          title="프로젝트 미리보기"
                        >
                          <Eye size={20} />
                        </button>
                      )}
                    </div>
                  );
                })()}

                {/* Project Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-bg-light rounded-xl p-4 border border-line-light">
                    <p className="text-xs text-text-secondary mb-1 font-medium">진행 기간</p>
                    <p className="text-sm font-semibold text-text-main">
                      {formatRange(selectedProject) && selectedProject.duration 
                        ? `${formatRange(selectedProject)} (${selectedProject.duration})`
                        : formatRange(selectedProject) || selectedProject.duration || '-'}
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
                  if ((galleryProject as any).image) galleryImages.push((galleryProject as any).image);
                  if ((galleryProject as any).gallery && Array.isArray((galleryProject as any).gallery)) {
                    galleryImages.push(...(galleryProject as any).gallery.filter(Boolean));
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
    </div>
  );
}
