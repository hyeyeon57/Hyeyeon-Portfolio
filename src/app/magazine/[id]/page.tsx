'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { MAGAZINE_POSTS, MagazinePost, getMagazinePost } from '@/data/magazine';

export default function MagazineDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id || '';
  const [posts, setPosts] = useState<MagazinePost[]>(MAGAZINE_POSTS);
  const [post, setPost] = useState<MagazinePost | undefined>(() => getMagazinePost(id));
  const [loading, setLoading] = useState(!post);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch('/api/magazines').then((r) => (r.ok ? r.json() : null)),
      fetch(`/api/magazines/${encodeURIComponent(id)}`).then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([listJson, itemJson]) => {
        if (!active) return;
        if (listJson?.success && Array.isArray(listJson.data) && listJson.data.length > 0) {
          setPosts(listJson.data);
        }
        if (itemJson?.success && itemJson.data) {
          setPost(itemJson.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading && !post) {
    return (
      <main className="min-h-screen bg-white pt-32 pb-24 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto text-center text-[#767676]">불러오는 중...</div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-white pt-32 pb-24 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#111111]">
            게시글을 찾을 수 없습니다.
          </h1>
          <Link
            href="/magazine"
            className="inline-flex items-center gap-2 text-base font-medium text-[#5C4AAE] hover:underline"
          >
            <ArrowLeft size={18} />
            Magazine 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  const currentIndex = posts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost =
    currentIndex >= 0 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <main className="min-h-screen bg-white text-[#111111] pt-24 sm:pt-28 pb-24 sm:pb-32">
      <div className="max-w-[1200px] 2xl:max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* 상단 매거진 히어로 배너 카드 */}
        <div
          className="relative w-full rounded-xl overflow-hidden px-6 py-14 sm:py-20 text-center text-white mb-6 sm:mb-8 border border-[#111111]/15"
          style={{
            background:
              'linear-gradient(135deg, #21164D 0%, #5C4AAE 55%, #84D4B5 100%)',
          }}
        >
          <p className="text-xs font-medium tracking-[0.18em] uppercase text-white/75 mb-2">
            RETROSPECTIVE
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] mb-3">
            Magazine
          </h2>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-md mx-auto">
            프로젝트를 기획하고 만들어온 과정의
            <br className="sm:hidden" /> 회고와 인사이트를 기록합니다.
          </p>
        </div>

        {/* 본문 아티클 카드 */}
        <article className="rounded-xl border border-[#111111]/80 bg-white px-5 py-8 sm:px-10 sm:py-12">
          {/* 제목 */}
          <h1 className="text-2xl sm:text-3xl md:text-[34px] font-bold tracking-[-0.03em] leading-[1.35] text-[#111111] mb-4">
            {post.title}
          </h1>

          {/* 메타 정보 + 우측 배지 */}
          <div className="flex flex-wrap items-end justify-between gap-3 pb-6 sm:pb-8 border-b border-[#E5E5E5]">
            <div className="space-y-1 text-xs sm:text-sm text-[#767676]">
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center gap-1.5 tabular-nums">
                <Calendar size={14} />
                <span>{post.date}</span>
              </div>
            </div>

            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#5C4AAE] text-white text-xs sm:text-sm font-semibold tracking-[-0.01em]">
              {post.projectTag}
            </span>
          </div>

          {/* 부제목 & 태그 */}
          <div className="pt-6 sm:pt-8 mb-8">
            {post.subtitle && (
              <p className="text-base sm:text-lg text-[#505050] leading-[170%] tracking-[-0.015em] mb-5">
                {post.subtitle}
              </p>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium text-[#505050] bg-[#F5F5F7] rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 대표 이미지 (비어있거나 유효하지 않은 URL이면 회색 박스) */}
          <div className="relative w-full aspect-[16/10] bg-[#D9D9D9] rounded-lg overflow-hidden mb-10 sm:mb-12">
            {post.image &&
              (post.image.startsWith('/') ||
                post.image.startsWith('http://') ||
                post.image.startsWith('https://') ||
                post.image.startsWith('data:image/')) && (
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized={
                    post.image.startsWith('http') ||
                    post.image.startsWith('//') ||
                    post.image.startsWith('data:')
                  }
                />
              )}
          </div>

          {/* 본문 섹션 */}
          <div className="space-y-10 sm:space-y-12">
            {post.sections.map((section) => (
              <section key={section.heading} className="space-y-3.5">
                <h2 className="text-lg sm:text-xl font-bold tracking-[-0.025em] text-[#111111]">
                  {section.heading}
                </h2>
                <div className="space-y-4 text-[15px] sm:text-[17px] text-[#333333] leading-[185%] tracking-[-0.015em]">
                  {(section.body || (section as unknown as { paragraphs?: string[] }).paragraphs || []).map(
                    (paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    )
                  )}
                </div>
              </section>
            ))}
          </div>

          {/* 핵심 회고 요약 */}
          {post.takeaways && post.takeaways.length > 0 && (
            <div className="mt-12 p-6 sm:p-8 rounded-lg bg-[#F7F6FC] border border-[#E6E2F8]">
              <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#5C4AAE] mb-3.5">
                KEY TAKEAWAYS
              </p>
              <ul className="space-y-2.5 text-sm sm:text-base text-[#222222] leading-[170%]">
                {post.takeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#5C4AAE] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>

        {/* 이전 글 / 다음 글 스택 카드 */}
        {(prevPost || nextPost) && (
          <div className="mt-8 rounded-xl border border-[#111111]/80 bg-white overflow-hidden">
            {prevPost && (
              <Link
                href={`/magazine/${prevPost.id}`}
                className="block px-6 py-5 sm:px-8 sm:py-6 hover:bg-[#FAFAFA] transition-colors"
              >
                <span className="block text-xs sm:text-sm text-[#767676] mb-1.5">이전 글</span>
                <p className="text-base sm:text-lg font-semibold text-[#111111] line-clamp-1">
                  {prevPost.title}
                </p>
              </Link>
            )}

            {prevPost && nextPost && <div className="h-px bg-[#111111]/20" />}

            {nextPost && (
              <Link
                href={`/magazine/${nextPost.id}`}
                className="block px-6 py-5 sm:px-8 sm:py-6 hover:bg-[#FAFAFA] transition-colors"
              >
                <span className="block text-xs sm:text-sm text-[#767676] mb-1.5">다음 글</span>
                <p className="text-base sm:text-lg font-semibold text-[#111111] line-clamp-1">
                  {nextPost.title}
                </p>
              </Link>
            )}
          </div>
        )}

        {/* 하단 목록으로 필 버튼 */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/magazine"
            className="inline-flex items-center justify-center w-full sm:w-[320px] h-14 sm:h-16 rounded-full border border-[#111111] bg-white text-base sm:text-lg font-semibold text-[#111111] hover:!bg-[#111111] hover:!text-white transition-colors"
          >
            목록으로
          </Link>
        </div>
      </div>
    </main>
  );
}
