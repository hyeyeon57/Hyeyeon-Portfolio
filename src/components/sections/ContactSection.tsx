'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { MAGAZINE_POSTS, MagazinePost } from '@/data/magazine';

interface ContactSectionProps {
  theme?: 'light' | 'dark';
}

export const ContactSection: React.FC<ContactSectionProps> = () => {
  const [posts, setPosts] = useState<MagazinePost[]>(MAGAZINE_POSTS);

  useEffect(() => {
    let active = true;
    fetch('/api/magazines')
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
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="display-xl text-[clamp(2.25rem,6vw,80px)] leading-[1.1] text-black mb-8 sm:mb-16"
        >
          Magazine
        </motion.h2>

        <div className="border-t border-[#DBDBDB]">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="grid grid-cols-1 md:grid-cols-[130px_minmax(0,400px)_1fr] gap-4 sm:gap-6 md:gap-12 py-8 sm:py-12 border-b border-[#DBDBDB] items-start"
            >
              <p className="text-base sm:text-xl font-semibold text-black leading-[110%] tabular-nums">
                {post.date}
              </p>

              <Link
                href={`/magazine/${post.id}`}
                className="relative block w-full aspect-[400/280] bg-[#D9D9D9] overflow-hidden group"
              >
                {post.image && (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    unoptimized={post.image.startsWith('http') || post.image.startsWith('//')}
                  />
                )}
              </Link>

              <div className="flex flex-col min-h-0 md:min-h-[220px]">
                <p className="text-[11px] sm:text-xs font-medium tracking-wide uppercase text-[#5C4AAE] mb-1.5 sm:mb-2">
                  {post.projectTag}
                </p>
                <Link href={`/magazine/${post.id}`}>
                  <h3 className="text-lg sm:text-2xl font-medium tracking-[-0.025em] text-[#111111] mb-2.5 sm:mb-4 hover:opacity-70 transition-opacity">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-sm sm:text-base lg:text-lg text-[#767676] leading-[160%] sm:leading-[26px] tracking-[-0.025em] line-clamp-3 mb-auto">
                  {post.excerpt}
                </p>
                <Link
                  href={`/magazine/${post.id}`}
                  className="inline-flex items-center gap-2 mt-5 sm:mt-8 text-sm sm:text-base font-medium text-[#767676] hover:text-[#111111] transition-colors self-start"
                >
                  자세히보기
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
