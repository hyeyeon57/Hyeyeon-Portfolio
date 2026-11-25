'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { MAGAZINE_POSTS, MagazinePost } from '@/data/magazine';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContactSectionProps {
  theme?: 'light' | 'dark';
}

export const ContactSection: React.FC<ContactSectionProps> = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [posts, setPosts] = useState<MagazinePost[]>(MAGAZINE_POSTS);
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 4;
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
    <section id="contact" className="relative w-full bg-white text-[#111111]">
      {/* Magazine (Figma Group 2301) */}
      <div className="max-w-container mx-auto px-5 sm:px-8 lg:px-[60px] py-16 sm:py-28 md:py-40">
        <div className="flex items-center justify-between gap-4 mb-8 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="display-xl text-[clamp(2.25rem,6vw,80px)] leading-[1.1] text-black"
          >
            Magazine
          </motion.h2>
          <Link
            href="/magazine/new"
            aria-label="새 매거진 글 작성"
            title="새 매거진 글 작성"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#111111] flex items-center justify-center text-[#111111] hover:!bg-[#111111] hover:!text-white transition-colors flex-shrink-0"
          >
            <Plus size={20} strokeWidth={1.75} />
          </Link>
        </div>

        <div className="border-t border-[#DBDBDB]">
          {paginatedPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-[#DBDBDB]"
            >
              <Link
                href={`/magazine/${post.id}`}
                className="group grid grid-cols-1 md:grid-cols-[130px_minmax(0,400px)_1fr] gap-4 sm:gap-6 md:gap-12 py-8 sm:py-12 items-start hover:bg-[#FAFAFA]/70 transition-colors"
              >
                <p className="text-base sm:text-xl font-semibold text-black leading-[110%] tabular-nums">
                  {post.date}
                </p>

                <div className="relative block w-full aspect-[400/280] bg-[#D9D9D9] overflow-hidden">
                  {post.image &&
                    (post.image.startsWith('/') ||
                      post.image.startsWith('http://') ||
                      post.image.startsWith('https://') ||
                      post.image.startsWith('data:image/')) && (
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

                <div className="flex flex-col min-h-0 md:min-h-[220px] max-w-[760px] md:pr-12">
                  <p className="text-[11px] sm:text-xs font-medium tracking-wide uppercase text-[#5C4AAE] mb-1.5 sm:mb-2">
                    {post.projectTag}
                  </p>
                  <h3 className="text-lg sm:text-2xl font-medium tracking-[-0.025em] text-[#111111] mb-2.5 sm:mb-4 group-hover:opacity-70 transition-opacity">
                    {post.title}
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-[#767676] leading-[160%] sm:leading-[26px] tracking-[-0.025em] line-clamp-3 mb-auto">
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 mt-5 sm:mt-8 text-sm sm:text-base font-medium text-[#767676] group-hover:text-[#111111] transition-colors self-start">
                    {isEn ? 'Read more' : '자세히보기'}
                    <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
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
    </section>
  );
};
