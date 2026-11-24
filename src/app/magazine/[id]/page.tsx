'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock, Calendar } from 'lucide-react';
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
      <main className="min-h-screen bg-white pt-36 pb-24 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto text-center text-[#767676]">불러오는 중...</div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-white pt-36 pb-24 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-3xl font-semibold text-[#111111]">게시글을 찾을 수 없습니다.</h1>
          <Link
            href="/#contact"
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
  const nextPost = currentIndex >= 0 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <main className="min-h-screen bg-white text-[#111111] pt-28 sm:pt-36 pb-24 sm:pb-32">
      <article className="max-w-3xl mx-auto px-5 sm:px-8">
        {/* 상단 돌아가기 */}
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#767676] hover:text-[#111111] transition-colors mb-10"
        >
          <ArrowLeft size={16} />
          Magazine 목록으로
        </Link>

        {/* 메타 정보 */}
        <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
          <span className="px-3 py-1 rounded-full bg-[#5C4AAE]/10 text-[#5C4AAE] font-semibold">
            {post.projectTag}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#767676] tabular-nums">
            <Calendar size={14} />
            {post.date}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#767676]">
            <Clock size={14} />
            {post.readTime}
          </span>
        </div>

        {/* 블로그 제목 & 부제 */}
        <h1 className="text-3xl sm:text-4xl md:text-[42px] font-semibold tracking-[-0.03em] leading-[1.28] text-[#111111] mb-4">
          {post.title}
        </h1>
        <p className="text-lg sm:text-xl text-[#767676] leading-[160%] tracking-[-0.02em] mb-8">
          {post.subtitle}
        </p>

        {/* 태그 */}
        <div className="flex flex-wrap gap-2 mb-10">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium text-[#505050] bg-[#F5F5F7] rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 대표 이미지 */}
        <div className="relative w-full aspect-[16/10] bg-[#D9D9D9] rounded-2xl overflow-hidden mb-12">
          {post.image && (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              unoptimized={post.image.startsWith('http') || post.image.startsWith('//')}
            />
          )}
        </div>

        {/* 본문 섹션 */}
        <div className="space-y-12">
          {post.sections.map((section) => (
            <section key={section.heading} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-[-0.025em] text-[#111111]">
                {section.heading}
              </h2>
              <div className="space-y-4 text-base sm:text-[17px] text-[#333333] leading-[185%] tracking-[-0.015em]">
                {section.body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* 핵심 배운 점 박스 */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-[#F7F7FA] border border-[#E8E8EE]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5C4AAE] mb-3">
            Key Takeaways
          </p>
          <ul className="space-y-2.5 text-base text-[#222222]">
            {post.takeaways.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="text-[#5C4AAE] font-bold">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 이전 / 다음 글 내비게이션 */}
        <nav className="mt-16 pt-8 border-t border-[#DBDBDB] grid sm:grid-cols-2 gap-6">
          {prevPost ? (
            <Link
              href={`/magazine/${prevPost.id}`}
              className="group p-5 rounded-xl border border-[#E5E5EC] hover:border-[#111111] transition-colors"
            >
              <p className="inline-flex items-center gap-1.5 text-xs text-[#767676] mb-2">
                <ArrowLeft size={14} />
                이전 회고
              </p>
              <p className="text-base font-medium text-[#111111] line-clamp-2 group-hover:underline">
                {prevPost.title}
              </p>
            </Link>
          ) : (
            <div />
          )}

          {nextPost && (
            <Link
              href={`/magazine/${nextPost.id}`}
              className="group p-5 rounded-xl border border-[#E5E5EC] hover:border-[#111111] transition-colors sm:text-right"
            >
              <p className="inline-flex items-center sm:justify-end gap-1.5 text-xs text-[#767676] mb-2">
                다음 회고
                <ArrowRight size={14} />
              </p>
              <p className="text-base font-medium text-[#111111] line-clamp-2 group-hover:underline">
                {nextPost.title}
              </p>
            </Link>
          )}
        </nav>
      </article>
    </main>
  );
}
