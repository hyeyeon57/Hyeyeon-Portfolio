'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Calendar, Users, Award, X, Download, Eye, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { projects as initialProjects } from '@/data/portfolio';
import Link from 'next/link';

type Project = typeof initialProjects[0];

export default function AllProjectsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]); // 초기값을 빈 배열로 변경 (정적 데이터 사용 안 함)
  const [loading, setLoading] = useState(true); // 전체 프로젝트 로딩 상태
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryProject, setGalleryProject] = useState<Project | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [detailImageIndex, setDetailImageIndex] = useState(0);
  const [detailDirection, setDetailDirection] = useState(0); // 슬라이드 방향 (애니메이션)
  const [galleryDirection, setGalleryDirection] = useState(0); // 갤러리 모달 슬라이드 방향
  const [lightboxImage, setLightboxImage] = useState<string | null>(null); // 라이트박스 이미지
  const [lightboxIndex, setLightboxIndex] = useState(0); // 라이트박스 이미지 인덱스
  const [isHoveringFirstImage, setIsHoveringFirstImage] = useState(false); // 팝업 내 대표 이미지 hover 상태
  const [showLightboxTooltip, setShowLightboxTooltip] = useState(false); // 라이트박스 자동 툴팁 (최초 1회)
  const [hasShownLightboxTooltip, setHasShownLightboxTooltip] = useState(false); // 이 세션에서 이미 한 번 보여줬는지 여부
  const [isHoveringLightboxImage, setIsHoveringLightboxImage] = useState(false); // 라이트박스 이미지 hover 상태

  // 클라이언트 마운트 시 BO 서버에서 데이터 로드
  useEffect(() => {
    setIsMounted(true);
    
    // 방문자 로그 저장 (비동기, 블로킹 없음)
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
    
    // 방문자 로그는 비동기로 처리 (프로젝트 로딩 블로킹 안 함)
    logVisit();
    
    const fetchProjects = async (forceRefresh = false) => {
      try {
        // localStorage에서 캐시된 데이터 확인 (5분 이내 데이터만 사용)
        const CACHE_KEY = 'projects_cache';
        const CACHE_TIMESTAMP_KEY = 'projects_cache_timestamp';
        const CACHE_DURATION = 5 * 60 * 1000; // 5분
        
        let hasCachedData = false;
        
        if (!forceRefresh && typeof window !== 'undefined') {
          const cachedData = localStorage.getItem(CACHE_KEY);
          const cacheTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
          
          if (cachedData && cacheTimestamp) {
            const cacheAge = Date.now() - parseInt(cacheTimestamp);
            if (cacheAge < CACHE_DURATION) {
              try {
                const parsedProjects = JSON.parse(cachedData);
                if (Array.isArray(parsedProjects) && parsedProjects.length > 0) {
                  console.log('✅ 캐시된 프로젝트 데이터 사용:', parsedProjects.length);
                  setProjects(parsedProjects);
                  setLoading(false);
                  hasCachedData = true;
                  // 백그라운드에서 최신 데이터 가져오기
                  forceRefresh = true;
                }
              } catch (e) {
                console.warn('캐시 데이터 파싱 실패:', e);
              }
            }
          }
        }
        
        // 캐시가 없거나 강제 새로고침인 경우에만 로딩 상태 표시
        if (!hasCachedData) {
          setLoading(true);
        }
        
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
          // API 호출 실패 시 캐시된 데이터가 없으면 빈 배열 설정
          if (!hasCachedData) {
            setProjects([]);
            setLoading(false);
          }
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
            // featured 프로젝트를 상단에 정렬
            const sortedProjects = [...boProjects].sort((a, b) => {
              if (a.featured && !b.featured) return -1; // a가 featured면 위로
              if (!a.featured && b.featured) return 1;  // b가 featured면 위로
              return 0; // 둘 다 featured이거나 둘 다 아니면 기존 순서 유지
            });
            
            const featuredCount = sortedProjects.filter(p => p.featured).length;
            console.log('✅ 백엔드 프로젝트 데이터 로드 성공:', {
              total: sortedProjects.length,
              featured: featuredCount,
              featuredProjects: sortedProjects.filter(p => p.featured).map(p => p.title)
            });
            setProjects(sortedProjects);
            
            // localStorage에 캐시 저장
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem(CACHE_KEY, JSON.stringify(boProjects));
                localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
              } catch (e) {
                console.warn('캐시 저장 실패:', e);
              }
            }
          } else {
            // BO에 데이터가 없으면 빈 배열 사용 (정적 데이터 사용 안 함)
            console.warn('⚠️ 백엔드에 프로젝트가 없음 - 빈 배열 사용');
            setProjects([]);
          }
        } else {
          // 응답 형식 오류 시 빈 배열 사용 (정적 데이터 사용 안 함)
          console.error('❌ 백엔드 응답 형식 오류:', result);
          if (!hasCachedData) {
            setProjects([]);
          }
        }
      } catch (error) {
        console.error('❌ 프로젝트 로드 오류:', error);
        // 오류 시 캐시된 데이터가 없으면 빈 배열 설정
        if (!hasCachedData) {
          setProjects([]);
        }
      } finally {
        setLoading(false);
      }
    };

    // 초기 한 번만 로드
    fetchProjects(false); // 캐시 우선 사용
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

  // 키보드로 라이트박스 제어 (ESC: 닫기, ← →: 이미지 이동)
  useEffect(() => {
    if (!lightboxImage || !selectedProject) return;
    
    // 라이트박스용 이미지 목록 구성
    const lightboxImages: string[] = [];
    const backendImages = (selectedProject as any)?.images;
    if (backendImages && Array.isArray(backendImages)) {
      lightboxImages.push(...backendImages.filter(Boolean));
    } else if ((selectedProject as any)?.gallery && Array.isArray((selectedProject as any).gallery)) {
      lightboxImages.push(...((selectedProject as any).gallery as string[]).filter(Boolean));
    }
    if ((selectedProject as any)?.image) {
      const main = (selectedProject as any).image as string;
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

  // 라이트박스용 이미지 클릭 핸들러
  const handleImageClickForLightbox = (image: string, index: number) => {
    setLightboxImage(image);
    setLightboxIndex(index);
  };

  // 라이트박스: "이 페이지에서 최초 진입 1번만" 3초 동안 자동 툴팁 노출
  useEffect(() => {
    if (!lightboxImage) {
      setShowLightboxTooltip(false);
      setIsHoveringLightboxImage(false);
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

  if (!isMounted || loading) {
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
    <div className="min-h-screen relative" style={{
      background: 'linear-gradient(135deg, #ECE9FF 0%, #F7F7FF 50%, #FFFFFF 100%)'
    }}>
      {/* LNB - 좌측 네비게이션 바 */}
      <div className="max-w-container mx-auto px-6 md:px-container-x py-12 pt-24">
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

        {/* Empty State (로딩이 아닐 때만 표시) */}
        {!loading && filteredProjects.length === 0 && (
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
            className="bg-white rounded-3xl overflow-hidden max-w-7xl w-full max-h-[95vh] overflow-y-auto shadow-2xl"
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

            {/* Modal Content (대표 프로젝트와 동일한 구조) */}
            <div className="p-8 md:p-10">
              {/* 이미지 세로 나열 */}
              {(() => {
                try {
                  const images: string[] = [];
                  if ((selectedProject as any)?.image) images.push((selectedProject as any).image as string);
                  if ((selectedProject as any)?.gallery && Array.isArray((selectedProject as any).gallery)) {
                    images.push(...((selectedProject as any).gallery as string[]).filter(Boolean));
                  }
                  const total = images.length;
                  if (total === 0) return null;
                  
                  return (
                    <div className="mb-8 rounded-2xl overflow-hidden border border-line-light bg-white">
                      <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                        <div className="space-y-4 p-4">
                          {images.map((image, index) => {
                            if (!image) return null;
                            return (
                              <motion.div
                                key={`${image}-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="relative w-full rounded-lg overflow-hidden border border-line-light bg-bg-light cursor-pointer hover:opacity-90 transition-opacity"
                                onMouseEnter={() => {
                                  if (index === 0) {
                                    setIsHoveringFirstImage(true);
                                  }
                                }}
                                onMouseLeave={() => {
                                  if (index === 0) {
                                    setIsHoveringFirstImage(false);
                                  }
                                }}
                                onClick={() => handleImageClickForLightbox(image, index)}
                              >
                                <img
                                  src={image}
                                  alt={`${selectedProject?.title || ''} - 이미지 ${index + 1}`}
                                  className="w-full h-auto object-contain"
                                  loading="lazy"
                                  onError={(e) => {
                                    console.error('이미지 로드 실패:', image);
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />

                                {/* 1번(대표) 이미지 툴팁: hover 시에만 표시 */}
                                {index === 0 && isHoveringFirstImage && (
                                  <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/85 text-white text-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                                    <Eye size={16} className="opacity-90" />
                                    <span className="font-medium">이미지 클릭 시 크게 볼 수 있어요!</span>
                                  </div>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
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
                    const designPdf = (selectedProject as any).designPdf;
                    const designLink = (selectedProject as any).designLink || (selectedProject as any).figmaLink || (selectedProject as any).designFile;
                    
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
                  
                  {/* 미리보기 PDF */}
                  {(selectedProject as any).previewPdf && (
                    <a
                      href={`${(selectedProject as any).previewPdf}#view=Fit`}
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

      {/* 라이트박스 (Lightbox) */}
      <AnimatePresence>
        {lightboxImage && selectedProject && (() => {
          try {
            // 선택된 프로젝트에서 라이트박스용 이미지 목록 구성
            const lightboxImages: string[] = [];

            // 백엔드에서 normalize된 images 배열 우선 사용
            const backendImages = (selectedProject as any)?.images;
            if (backendImages && Array.isArray(backendImages)) {
              lightboxImages.push(...backendImages.filter(Boolean));
            } else if ((selectedProject as any)?.gallery && Array.isArray((selectedProject as any).gallery)) {
              // 구 버전 데이터용 fallback
              lightboxImages.push(...((selectedProject as any).gallery as string[]).filter(Boolean));
            }

            // 메인 이미지가 따로 있고, 배열에 포함되어 있지 않으면 선두에 추가
            if ((selectedProject as any)?.image) {
              const main = (selectedProject as any).image as string;
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
