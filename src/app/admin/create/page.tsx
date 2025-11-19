'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateProject() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    category: '',
    tags: '',
    link: '',
    github: '',
    startDate: '',
    endDate: '',
    featured: false,
    order: 0,
  });
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // 텍스트 필드 추가
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'tags') {
          // 태그를 배열로 변환
          const tagsArray = value.split(',').map((tag: string) => tag.trim()).filter(Boolean);
          formDataToSend.append('tags', JSON.stringify(tagsArray));
        } else {
          formDataToSend.append(key, String(value));
        }
      });

      // 이미지 파일 추가
      images.forEach((file) => {
        formDataToSend.append('images', file);
      });

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        alert('프로젝트가 생성되었습니다! ✅');
        router.push('/admin');
      } else {
        alert('프로젝트 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">새 프로젝트 만들기</h1>
              <p className="text-gray-500 mt-1">프로젝트 정보를 입력하세요</p>
            </div>
            <Link 
              href="/admin"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              ← 돌아가기
            </Link>
          </div>
        </div>
      </header>

      {/* 폼 */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-8">
          {/* 제목 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="프로젝트 제목을 입력하세요"
            />
          </div>

          {/* 짧은 설명 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              짧은 설명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="프로젝트의 간단한 설명"
            />
          </div>

          {/* 상세 설명 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상세 설명
            </label>
            <textarea
              name="longDescription"
              value={formData.longDescription}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="프로젝트에 대한 자세한 설명을 입력하세요"
            />
          </div>

          {/* 카테고리와 순서 */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">선택하세요</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile App">Mobile App</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Data Science">Data Science</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                순서
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          {/* 태그 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              태그
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="React, Node.js, MongoDB (쉼표로 구분)"
            />
            <p className="text-sm text-gray-500 mt-1">쉼표(,)로 구분하여 입력하세요</p>
          </div>

          {/* 링크 */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                프로젝트 링크
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub 링크
              </label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://github.com/user/repo"
              />
            </div>
          </div>

          {/* 날짜 */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시작일 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                종료일
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 이미지 업로드 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              프로젝트 이미지
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-sm text-gray-500 mt-1">
              {images.length > 0 ? `${images.length}개 파일 선택됨` : '최대 10개, 각 10MB 이하'}
            </p>
          </div>

          {/* 추천 프로젝트 */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                ⭐ 추천 프로젝트로 표시
              </span>
            </label>
          </div>

          {/* 제출 버튼 */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {loading ? '생성 중...' : '✅ 프로젝트 생성'}
            </button>
            <Link
              href="/admin"
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-center"
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

