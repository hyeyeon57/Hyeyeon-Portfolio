'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Bookmark, ChevronDown, LayoutGrid, List } from 'lucide-react';
import { PROJECT_CATEGORIES } from '@/constants/categories';
import { useProjects } from '@/hooks/useProjects';

type SortOption = 'latest' | 'oldest' | 'title';
type ViewMode = 'grid' | 'list';

const SORT_LABELS: Record<SortOption, string> = {
  latest: 'Latest',
  oldest: 'Oldest',
  title: 'Title',
};

function extractYear(dateStr?: string): number {
  if (!dateStr) return 0;
  const match = String(dateStr).match(/\d{4}/);
  return match ? parseInt(match[0], 10) : 0;
}

function parseDateValue(dateStr?: string): number {
  if (!dateStr) return 0;
  const normalized = String(dateStr).replace(/[^\d]/g, '');
  if (normalized.length >= 6) {
    return parseInt(normalized.slice(0, 8).padEnd(8, '0'), 10);
  }
  const year = extractYear(dateStr);
  return year ? year * 10000 : 0;
}

export const AllPortfolioSection: React.FC = () => {
  const { projects } = useProjects();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [openDropdown, setOpenDropdown] = useState<'sort' | 'year' | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    projects.forEach((p) => {
      const y = extractYear(p.date);
      if (y) years.add(String(y));
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [projects]);

  const sortedProjects = useMemo(() => {
    let list = [...projects];

    if (selectedCategory !== 'all') {
      list = list.filter((p) =>
        Array.isArray(p.category)
          ? p.category.includes(selectedCategory)
          : p.category === selectedCategory
      );
    }

    if (selectedYear !== 'all') {
      list = list.filter((p) => String(extractYear(p.date)) === selectedYear);
    }

    list.sort((a, b) => {
      if (sortBy === 'latest') {
        const diff = parseDateValue(b.date) - parseDateValue(a.date);
        if (diff !== 0) return diff;
        if (a.title === '요기요' && b.title !== '요기요') return -1;
        if (b.title === '요기요' && a.title !== '요기요') return 1;
        return 0;
      }
      if (sortBy === 'oldest') {
        const diff = parseDateValue(a.date) - parseDateValue(b.date);
        if (diff !== 0) return diff;
        return a.title.localeCompare(b.title, 'ko');
      }
      return a.title.localeCompare(b.title, 'ko');
    });

    return list;
  }, [projects, selectedCategory, selectedYear, sortBy]);

  const visibleProjects = sortedProjects.slice(0, 6);

  return (
    <section id="all-portfolio" className="relative w-full bg-white text-[#111111]">
      <div className="max-w-container mx-auto px-5 sm:px-8 lg:px-[60px] py-24 sm:py-32">
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <h2 className="text-[clamp(2.75rem,5.5vw,80px)] font-normal tracking-[-0.03em] text-[#111111] leading-[1.1]">
            All Portfolio.
          </h2>
          <p className="max-w-[432px] text-lg text-[#767676] leading-[160%]">
            신규 서비스 구축부터 앱·웹 사용성 개선까지 사용자 경험과 비즈니스 가치를 함께 고민한 프로젝트들을 담았습니다.
          </p>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-nowrap md:flex-wrap gap-2.5 sm:gap-3 mb-7 overflow-x-auto pb-1 -mx-5 px-5 sm:mx-0 sm:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {[{ id: 'all', label: 'All Works' }, ...PROJECT_CATEGORIES].map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center whitespace-nowrap flex-shrink-0 px-4 sm:px-5 py-2.5 sm:py-[13px] rounded-full border border-[#DBDBDB] text-sm sm:text-base transition-colors ${
                  isActive
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-transparent text-[#111111] hover:border-[#111111]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="h-px w-full bg-[#DBDBDB] mb-7" />

        {/* Filter toolbar */}
        <div
          ref={toolbarRef}
          className="flex flex-wrap items-center justify-between gap-4 mb-12 text-sm sm:text-base"
        >
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="text-base sm:text-lg text-[#111111] whitespace-nowrap">
              {selectedCategory === 'all'
                ? 'All Works'
                : PROJECT_CATEGORIES.find((c) => c.id === selectedCategory)?.label || 'All Works'}
            </span>
            <span className="text-base sm:text-lg text-[#767676]">{sortedProjects.length}</span>
          </div>

          <div className="flex items-center gap-3.5 sm:gap-6 text-[#111111] flex-nowrap">
            <span className="text-[#767676] whitespace-nowrap">Sort by</span>

            {/* Latest / Sort dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
                className="inline-flex items-center gap-1.5 sm:gap-2 whitespace-nowrap hover:opacity-70 transition-opacity"
                aria-expanded={openDropdown === 'sort'}
              >
                <span>{SORT_LABELS[sortBy]}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${openDropdown === 'sort' ? 'rotate-180' : ''}`}
                />
              </button>

              {openDropdown === 'sort' && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-[#DBDBDB] shadow-lg py-1 z-30">
                  {(['latest', 'oldest', 'title'] as SortOption[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSortBy(option);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        sortBy === option
                          ? 'bg-[#111111] text-white font-medium'
                          : 'text-[#111111] hover:bg-[#F5F5F5]'
                      }`}
                    >
                      {SORT_LABELS[option]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Year dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'year' ? null : 'year')}
                className="inline-flex items-center gap-1.5 sm:gap-2 whitespace-nowrap hover:opacity-70 transition-opacity"
                aria-expanded={openDropdown === 'year'}
              >
                <span>{selectedYear === 'all' ? 'Year' : selectedYear}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${openDropdown === 'year' ? 'rotate-180' : ''}`}
                />
              </button>

              {openDropdown === 'year' && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-[#DBDBDB] shadow-lg py-1 z-30">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedYear('all');
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      selectedYear === 'all'
                        ? 'bg-[#111111] text-white font-medium'
                        : 'text-[#111111] hover:bg-[#F5F5F5]'
                    }`}
                  >
                    All Years
                  </button>
                  {availableYears.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => {
                        setSelectedYear(year);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        selectedYear === year
                          ? 'bg-[#111111] text-white font-medium'
                          : 'text-[#111111] hover:bg-[#F5F5F5]'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="h-6 w-px bg-[#DBDBDB]" />

            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="그리드 보기"
              className="transition-colors"
            >
              <LayoutGrid
                size={20}
                className={viewMode === 'grid' ? 'text-[#111111]' : 'text-[#999999] hover:text-[#111111]'}
              />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="리스트 보기"
              className="transition-colors"
            >
              <List
                size={20}
                className={viewMode === 'list' ? 'text-[#111111]' : 'text-[#999999] hover:text-[#111111]'}
              />
            </button>
          </div>
        </div>

        {/* Portfolio Grid / List */}
        {visibleProjects.length === 0 ? (
          <div className="py-20 text-center text-[#767676] text-lg border-t border-[#DBDBDB]">
            조건에 맞는 프로젝트가 없습니다.
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-16 mb-16">
            {visibleProjects.map((project) => (
              <Link
                key={`all-${project.id}`}
                href="/projects"
                className="group block text-left"
              >
                <div className="relative w-full aspect-[581/470] bg-[#D9D9D9] overflow-hidden mb-5">
                  {project.image && (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      unoptimized={
                        project.image.startsWith('http') ||
                        project.image.startsWith('//') ||
                        project.image.endsWith('.svg')
                      }
                    />
                  )}
                  {(project.featured === true || String(project.featured) === 'true') && (
                    <span
                      title="대표 고정 프로젝트"
                      className="absolute right-5 top-5 w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#111111] shadow-sm"
                    >
                      <Bookmark size={18} strokeWidth={1.5} className="fill-[#111111]" />
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 mb-2 sm:mb-3 text-xs sm:text-[15px] text-[#767676]">
                  <span className="truncate">
                    {Array.isArray(project.category)
                      ? PROJECT_CATEGORIES.find((c) => c.id === project.category[0])?.label
                      : PROJECT_CATEGORIES.find((c) => c.id === project.category)?.label || 'Project'}
                  </span>
                  <span>{project.date}</span>
                </div>

                <div className="flex items-center justify-between gap-3 mb-1.5 sm:mb-2">
                  <h3 className="text-xl sm:text-[26px] lg:text-[28px] font-medium tracking-[-0.02em] text-[#111111] line-clamp-1">
                    {project.title}
                  </h3>
                  <ArrowUpRight size={20} className="flex-shrink-0 text-[#111111]" />
                </div>

                <p className="text-sm sm:text-base lg:text-[17px] text-[#767676] leading-[150%] line-clamp-1">
                  {project.subtitle || project.description}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border-t border-[#DBDBDB] mb-16">
            {visibleProjects.map((project) => (
              <Link
                key={`list-${project.id}`}
                href="/projects"
                className="group grid grid-cols-1 md:grid-cols-[240px_1fr_auto] gap-6 items-center py-6 border-b border-[#DBDBDB] hover:bg-[#FAFAFA] transition-colors"
              >
                <div className="relative w-full aspect-[581/470] bg-[#D9D9D9] overflow-hidden">
                  {project.image && (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      unoptimized={
                        project.image.startsWith('http') ||
                        project.image.startsWith('//') ||
                        project.image.endsWith('.svg')
                      }
                    />
                  )}
                  {(project.featured === true || String(project.featured) === 'true') && (
                    <span
                      title="대표 고정 프로젝트"
                      className="absolute right-3 top-3 w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#111111] shadow-sm"
                    >
                      <Bookmark size={14} strokeWidth={1.5} className="fill-[#111111]" />
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-2 text-sm text-[#767676]">
                    <span>
                      {Array.isArray(project.category)
                        ? PROJECT_CATEGORIES.find((c) => c.id === project.category[0])?.label
                        : PROJECT_CATEGORIES.find((c) => c.id === project.category)?.label || 'Project'}
                    </span>
                    <span>{project.date}</span>
                  </div>
                  <h3 className="text-2xl font-medium tracking-[-0.02em] text-[#111111] mb-1">
                    {project.title}
                  </h3>
                  <p className="text-base text-[#767676] line-clamp-2">
                    {project.subtitle || project.description}
                  </p>
                </div>
                <ArrowUpRight size={22} className="text-[#111111] hidden md:block" />
              </Link>
            ))}
          </div>
        )}

        {/* Bottom continuation */}
        <div className="border-t border-[#DBDBDB] pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-base text-[#767676]">
            Showing {visibleProjects.length} of {sortedProjects.length}
          </p>
          <Link href="/projects" prefetch={true} className="w-full sm:w-auto">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-12 w-full sm:w-[300px] h-14 sm:h-16 border border-[#111111] text-base sm:text-lg text-[#111111] hover:bg-[#111111] hover:text-white transition-colors"
            >
              Load more
              <span className="text-xl leading-none">+</span>
            </button>
          </Link>
          <p className="text-base text-[#767676] hidden sm:block">Next up</p>
        </div>
      </div>
    </section>
  );
};
