'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, Users, Briefcase, Clock, ExternalLink, FileText } from 'lucide-react';
import { Project } from '@/types/portfolio';
import { PROJECT_CATEGORIES } from '@/constants/categories';

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id || '';
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch('/api/projects', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!active) return;
        const list: Project[] = Array.isArray(json) ? json : json?.data || [];
        const found = list.find(
          (p) => String(p.id) === String(id) || String((p as unknown as { _id?: string })._id) === String(id)
        );
        setProject(found || null);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-32 pb-24 px-5 sm:px-8">
        <div className="max-w-[1200px] mx-auto text-center text-[#767676]">불러오는 중...</div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-white pt-32 pb-24 px-5 sm:px-8">
        <div className="max-w-[1200px] mx-auto text-center space-y-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#111111]">
            프로젝트를 찾을 수 없습니다.
          </h1>
          <Link
            href="/#all-portfolio"
            className="inline-flex items-center gap-2 text-base font-medium text-[#5C4AAE] hover:underline"
          >
            <ArrowLeft size={18} />
            포트폴리오 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  const categoryLabel = Array.isArray(project.category)
    ? project.category
        .map((c) => PROJECT_CATEGORIES.find((cat) => cat.id === c)?.label || c)
        .join(' · ')
    : PROJECT_CATEGORIES.find((cat) => cat.id === project.category)?.label || 'Project';

  const pdfUrl = project.detailPdf || project.designPdf || project.previewPdf;
  const externalLink = project.link || project.figmaLink || project.designLink;

  // 표지(대표 이미지) + 갤러리 이미지 목록을 순서대로 구성 (중복 제거)
  const projectWithExtras = project as Project & { images?: string[]; gallery?: string[] };
  const rawGallery = Array.isArray(projectWithExtras.images)
    ? projectWithExtras.images
    : Array.isArray(projectWithExtras.gallery)
    ? projectWithExtras.gallery
    : [];
  const allImages: string[] = [];
  if (project.image) {
    allImages.push(project.image);
  }
  rawGallery.forEach((img) => {
    if (img && !allImages.includes(img)) {
      allImages.push(img);
    }
  });

  return (
    <main className="min-h-screen bg-white text-[#111111] pt-24 sm:pt-28 pb-24 sm:pb-32">
      <div className="max-w-[1200px] 2xl:max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* 상단 뒤로가기 */}
        <div className="mb-6">
          <Link
            href="/#all-portfolio"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#767676] hover:text-[#111111] transition-colors"
          >
            <ArrowLeft size={16} />
            All Portfolio.
          </Link>
        </div>

        {/* 프로젝트 상세 카드 */}
        <article className="rounded-xl border border-[#111111]/80 bg-white px-5 py-8 sm:px-10 sm:py-12">
          {/* 상단 카테고리 & 제목 */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#5C4AAE] text-white text-xs sm:text-sm font-semibold">
              {categoryLabel}
            </span>
            {project.date && (
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#767676] tabular-nums">
                <Calendar size={14} />
                {project.date}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-[-0.03em] leading-[1.3] text-[#111111] mb-3">
            {project.title}
          </h1>
          {project.subtitle && (
            <p className="text-base sm:text-xl text-[#505050] leading-[160%] mb-6">
              {project.subtitle}
            </p>
          )}

          {/* 메타 정보 바 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-y border-[#E5E5E5] mb-8 text-sm">
            {project.role && (
              <div>
                <p className="text-xs text-[#767676] flex items-center gap-1 mb-1">
                  <Briefcase size={13} /> 역할
                </p>
                <p className="font-medium text-[#111111]">{project.role}</p>
              </div>
            )}
            {project.duration && (
              <div>
                <p className="text-xs text-[#767676] flex items-center gap-1 mb-1">
                  <Clock size={13} /> 기간
                </p>
                <p className="font-medium text-[#111111]">{project.duration}</p>
              </div>
            )}
            {project.team && (
              <div>
                <p className="text-xs text-[#767676] flex items-center gap-1 mb-1">
                  <Users size={13} /> 참여 인원
                </p>
                <p className="font-medium text-[#111111]">{project.team}</p>
              </div>
            )}
            {project.tags && project.tags.length > 0 && (
              <div>
                <p className="text-xs text-[#767676] mb-1">키워드</p>
                <p className="font-medium text-[#111111] truncate">{project.tags.join(', ')}</p>
              </div>
            )}
          </div>

          {/* 표지 + 등록된 갤러리 이미지 전체 세로 스크롤 뷰 */}
          {allImages.length > 0 && (
            <section className="mb-10 space-y-4 sm:space-y-6">
              {allImages.map((imgSrc, idx) => (
                <div
                  key={`${imgSrc}-${idx}`}
                  className="w-full overflow-hidden rounded-lg border border-[#E5E5E5] bg-[#F5F5F7]"
                >
                  <img
                    src={imgSrc}
                    alt={`${project.title} - ${idx === 0 ? '표지' : `이미지 ${idx}`}`}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    className="w-full h-auto block object-contain"
                  />
                </div>
              ))}
            </section>
          )}

          {/* 프로젝트 설명 */}
          {(project.fullDescription || project.description) && (
            <section className="mb-10">
              <h2 className="text-lg sm:text-xl font-bold text-[#111111] mb-3">프로젝트 개요</h2>
              <p className="text-base sm:text-[17px] text-[#333333] leading-[185%] whitespace-pre-line">
                {project.fullDescription || project.description}
              </p>
            </section>
          )}

          {/* 주요 성과 */}
          {project.achievements && project.achievements.length > 0 && (
            <section className="mb-10 p-6 sm:p-8 rounded-lg bg-[#F7F6FC] border border-[#E6E2F8]">
              <h2 className="text-xs font-semibold tracking-[0.12em] uppercase text-[#5C4AAE] mb-3.5">
                KEY ACHIEVEMENTS
              </h2>
              <ul className="space-y-2.5 text-sm sm:text-base text-[#222222] leading-[170%]">
                {project.achievements.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#5C4AAE] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 링크 / PDF 버튼 */}
          {(pdfUrl || externalLink) && (
            <div className="flex flex-wrap gap-3 pt-4 border-t border-[#E5E5E5]">
              {pdfUrl && (
                <a
                  href={`${pdfUrl}#view=Fit`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111111] text-white text-sm font-semibold hover:opacity-85 transition-opacity"
                >
                  <FileText size={16} />
                  상세 문서(PDF) 보기
                </a>
              )}
              {externalLink && (
                <a
                  href={externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#111111] text-[#111111] text-sm font-semibold hover:!bg-[#111111] hover:!text-white transition-colors"
                >
                  <ExternalLink size={16} />
                  관련 링크 열기
                </a>
              )}
            </div>
          )}
        </article>

        {/* 하단 목록으로 버튼 */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/#all-portfolio"
            className="inline-flex items-center justify-center w-full sm:w-[320px] h-14 sm:h-16 rounded-full border border-[#111111] bg-white text-base sm:text-lg font-semibold text-[#111111] hover:!bg-[#111111] hover:!text-white transition-colors"
          >
            목록으로
          </Link>
        </div>
      </div>
    </main>
  );
}
