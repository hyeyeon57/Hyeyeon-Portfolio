'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

function getTodayDotDate() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

function parseSectionsInput(raw: string) {
  const text = raw.trim();
  if (!text) return [];
  if (text.includes('## ')) {
    return text
      .split(/^##\s+/m)
      .filter((b) => b.trim())
      .map((block) => {
        const lines = block.split('\n');
        const heading = (lines.shift() || '회고').trim();
        const body = lines
          .join('\n')
          .trim()
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean);
        return { heading, body };
      });
  }
  return [
    {
      heading: '회고',
      body: text
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
    },
  ];
}

export default function NewMagazinePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [title, setTitle] = useState('');
  const [projectTag, setProjectTag] = useState('');
  const [date, setDate] = useState(getTodayDotDate);
  const [subtitle, setSubtitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [image, setImage] = useState('');
  const [tags, setTags] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [takeaways, setTakeaways] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const slug = `magazine-${Date.now()}`;
      const payload = {
        slug,
        title: title.trim(),
        projectTag: projectTag.trim() || 'RETROSPECTIVE',
        date: date.trim() || getTodayDotDate(),
        readTime: '5 min read',
        subtitle: subtitle.trim(),
        excerpt: excerpt.trim(),
        image:
          image.trim().startsWith('/') ||
          image.trim().startsWith('http://') ||
          image.trim().startsWith('https://') ||
          image.trim().startsWith('data:image/')
            ? image.trim()
            : '',
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        sections: parseSectionsInput(bodyText),
        takeaways: takeaways
          .split('\n')
          .map((t) => t.trim())
          .filter(Boolean),
        order: 0,
      };

      const res = await fetch('/api/magazines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok || !json?.success) {
        throw new Error(json?.message || '저장에 실패했습니다.');
      }

      const createdId = json.data?.id || slug;
      router.push(`/magazine/${createdId}`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : '저장에 실패했습니다.');
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#111111] pt-24 sm:pt-28 pb-24 sm:pb-32">
      <div className="max-w-[1200px] 2xl:max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* 상단 매거진 배너 */}
        <div
          className="relative w-full rounded-xl overflow-hidden px-6 py-12 sm:py-16 text-center text-white mb-6 sm:mb-8 border border-[#111111]/15"
          style={{
            background:
              'linear-gradient(135deg, #21164D 0%, #5C4AAE 55%, #84D4B5 100%)',
          }}
        >
          <p className="text-xs font-medium tracking-[0.18em] uppercase text-white/75 mb-2">
            NEW RETROSPECTIVE
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] mb-2">
            새 매거진 글 작성
          </h1>
          <p className="text-sm sm:text-base text-white/90">
            프로젝트를 진행하며 느낀 회고와 인사이트를 기록해 보세요.
          </p>
        </div>

        {/* 작성 폼 카드 */}
        <div className="rounded-xl border border-[#111111]/80 bg-white px-5 py-8 sm:px-10 sm:py-12">
          <div className="mb-6">
            <Link
              href="/magazine"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#767676] hover:text-[#111111] transition-colors"
            >
              <ArrowLeft size={16} />
              Magazine 목록으로
            </Link>
          </div>

          {errorMsg && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#222222] mb-2">제목 *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="회고 글 제목을 입력하세요"
                className="w-full px-4 py-3 rounded-lg border border-[#DBDBDB] text-base focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-[#222222] mb-2">
                  프로젝트 태그
                </label>
                <input
                  type="text"
                  value={projectTag}
                  onChange={(e) => setProjectTag(e.target.value)}
                  placeholder="예: 요기요 앱 리뉴얼"
                  className="w-full px-4 py-3 rounded-lg border border-[#DBDBDB] text-base focus:outline-none focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#222222] mb-2">작성일</label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="2026.11.25"
                  className="w-full px-4 py-3 rounded-lg border border-[#DBDBDB] text-base focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#222222] mb-2">
                요약 (메인 리스트 노출) *
              </label>
              <textarea
                rows={3}
                required
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="메인 Magazine 리스트에 보일 요약 문구를 입력하세요"
                className="w-full px-4 py-3 rounded-lg border border-[#DBDBDB] text-base focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-[#222222] mb-2">부제목</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="상세 페이지 상단 부제목 (선택)"
                  className="w-full px-4 py-3 rounded-lg border border-[#DBDBDB] text-base focus:outline-none focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#222222] mb-2">
                  대표 이미지 URL (비워두면 회색 박스)
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/projects/yogiyo.png (선택)"
                  className="w-full px-4 py-3 rounded-lg border border-[#DBDBDB] text-base focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#222222] mb-2">
                태그 (쉼표로 구분)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="UX Renewal, 회고, 화면설계"
                className="w-full px-4 py-3 rounded-lg border border-[#DBDBDB] text-base focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#222222] mb-2">
                본문 내용 (## 소제목 으로 섹션 구분 가능)
              </label>
              <textarea
                rows={10}
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                placeholder={"## 01. 문제 정의\n내용을 입력하세요...\n\n## 02. 배운 점\n내용을 입력하세요..."}
                className="w-full px-4 py-3 rounded-lg border border-[#DBDBDB] text-base leading-relaxed focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#222222] mb-2">
                Key Takeaways (한 줄에 하나씩)
              </label>
              <textarea
                rows={3}
                value={takeaways}
                onChange={(e) => setTakeaways(e.target.value)}
                placeholder={"핵심 배움 1\n핵심 배움 2"}
                className="w-full px-4 py-3 rounded-lg border border-[#DBDBDB] text-base focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-[#E5E5E5]">
              <Link
                href="/magazine"
                className="inline-flex items-center justify-center w-full sm:w-auto px-8 h-12 rounded-full border border-[#111111] bg-white text-sm sm:text-base font-medium text-[#111111] hover:!bg-[#111111] hover:!text-white transition-colors"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center w-full sm:w-auto px-10 h-12 rounded-full bg-[#111111] text-white text-sm sm:text-base font-semibold hover:opacity-85 disabled:opacity-50 transition-opacity"
              >
                {submitting ? '저장 중...' : '등록하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
