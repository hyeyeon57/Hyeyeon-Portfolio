'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { MAGAZINE_POSTS, MagazinePost } from '@/data/magazine';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MagazineListPage() {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [posts, setPosts] = useState<MagazinePost[]>(MAGAZINE_POSTS);
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 6;
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const paginatedPosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  useEffect(() => {
    let active = true;
    fetch('/api/magazines', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (active && json?.success && Array.isArray(json.data) && json.data.length > 0) {
          setPosts(json.data);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-white text-[#111111] pt-24 sm:pt-28 pb-24 sm:pb-32">
      <div className="max-w-[1200px] 2xl:max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* 상단 매거진 히어로 배너 */}
        <div
          className="relative w-full rounded-xl overflow-hidden px-6 py-14 sm:py-20 text-center text-white mb-10 sm:mb-14 border border-[#111111]/15"
          style={{
            background:
              'linear-gradient(135deg, #21164D 0%, #5C4AAE 55%, #84D4B5 100%)',
          }}
        >
          <p className="text-xs font-medium tracking-[0.18em] uppercase text-white/75 mb-2">
            RETROSPECTIVE
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-[-0.03em] mb-3">
            Magazine
          </h1>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-md mx-auto">
            {isEn
              ? 'Retrospectives and UX insights from planning and shipping digital products.'
              : '프로젝트를 기획하고 만들어온 과정의 회고와 인사이트를 기록합니다.'}
          </p>
        </div>

        {/* 상단 바: 총 개수 + 글쓰기 버튼 */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <p className="text-sm sm:text-base text-[#767676]">
            {isEn ? `Total ${posts.length} articles` : `전체 ${posts.length}개의 회고`}
          </p>
          <Link
            href="/magazine/new"
            aria-label="새 매거진 글 작성"
            title="새 매거진 글 작성"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#111111] text-sm font-medium text-[#111111] hover:!bg-[#111111] hover:!text-white transition-colors"
          >
            <Plus size={16} />
            <span>{isEn ? 'Write' : '글 작성'}</span>
          </Link>
        </div>

        {/* 매거진 목록 */}
        <div className="border-t border-[#DBDBDB]">
          {paginatedPosts.map((post) => {
            const hasValidImage =
              post.image &&
              (post.image.startsWith('/') ||
                post.image.startsWith('http://') ||
                post.image.startsWith('https://') ||
                post.image.startsWith('data:image/'));

            return (
              <article key={post.id} className="border-b border-[#DBDBDB]">
                <Link
                  href={`/magazine/${post.id}`}
                  className="group grid grid-cols-1 md:grid-cols-[120px_minmax(0,360px)_1fr] gap-4 sm:gap-6 md:gap-10 py-8 sm:py-10 items-start hover:bg-[#FAFAFA]/70 transition-colors"
                >
                  <p className="text-base sm:text-lg font-semibold text-black leading-[110%] tabular-nums">
                    {post.date}
                  </p>

                  <div className="relative block w-full aspect-[400/280] bg-[#D9D9D9] rounded-lg overflow-hidden">
                    {hasValidImage && (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        unoptimized={
                          post.image.startsWith('http') ||
                          post.image.startsWith('//') ||
                          post.image.startsWith('data:')
                        }
                      />
                    )}
                  </div>

                  <div className="flex flex-col min-h-0 md:min-h-[200px] max-w-[760px] md:pr-8">
                    <p className="text-[11px] sm:text-xs font-medium tracking-wide uppercase text-[#5C4AAE] mb-1.5 sm:mb-2">
                      {post.projectTag}
                    </p>
                    <h2 className="text-lg sm:text-2xl font-medium tracking-[-0.025em] text-[#111111] mb-2.5 sm:mb-3 group-hover:opacity-70 transition-opacity">
                      {post.title}
                    </h2>
                    <p className="text-sm sm:text-base text-[#767676] leading-[165%] tracking-[-0.02em] line-clamp-3 mb-auto">
                      {post.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-2 mt-5 sm:mt-6 text-sm sm:text-base font-medium text-[#767676] group-hover:text-[#111111] transition-colors self-start">
                      {isEn ? 'Read more' : '자세히보기'}
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        {/* 페이지네이션 */}
        <div className="mt-10 sm:mt-14 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="이전 페이지"
            className="w-10 h-10 rounded-full border border-[#DBDBDB] flex items-center justify-center text-[#111111] hover:border-[#111111] disabled:opacity-35 disabled:hover:border-[#DBDBDB] transition-colors"
          >
            <ChevronLeft size={18} />
          </button>

          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => {
            const active = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#111111] text-white'
                    : 'text-[#767676] hover:text-[#111111] hover:bg-[#F5F5F7]'
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="다음 페이지"
            className="w-10 h-10 rounded-full border border-[#DBDBDB] flex items-center justify-center text-[#111111] hover:border-[#111111] disabled:opacity-35 disabled:hover:border-[#DBDBDB] transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </main>
  );
}
