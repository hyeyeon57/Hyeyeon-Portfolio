'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Project } from '@/types/portfolio';

interface ProjectFormProps {
  project?: Project | Partial<Project>;
  onSave: (project: Project | Omit<Project, 'id'>) => void;
  onCancel: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    subtitle: project?.subtitle || '',
    description: project?.description || '',
    fullDescription: (project as any)?.fullDescription || '',
    category: project?.category || 'new',
    tags: (project?.tags && Array.isArray(project.tags)) ? project.tags.join(', ') : '',
    date: project?.date || '',
    team: project?.team || '',
    role: project?.role || '',
    duration: project?.duration || '',
    link: project?.link || '',
    image: project?.image || '',
    achievements: (project as any)?.achievements && Array.isArray((project as any).achievements) 
      ? (project as any).achievements.join('\n') 
      : '',
    gallery: (project as any)?.gallery && Array.isArray((project as any).gallery) 
      ? (project as any).gallery.join('\n') 
      : '',
    retrospective: (project as any)?.retrospective || '',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 제목만 필수로 체크
    if (!formData.title.trim()) {
      alert('프로젝트 제목은 필수 입력 사항입니다.');
      return;
    }
    
    const projectData = {
      ...project,
      title: formData.title,
      subtitle: formData.subtitle || '제목 없음',
      description: formData.description || '설명 없음',
      fullDescription: formData.fullDescription || formData.description || '설명 없음',
      category: formData.category as 'new' | 'renewal' | 'app' | 'web' | 'proposal' | 'usability',
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : ['미분류'],
      date: formData.date || '날짜 미정',
      team: formData.team || '미정',
      role: formData.role || '미정',
      duration: formData.duration || '미정',
      achievements: formData.achievements ? formData.achievements.split('\n').map(a => a.trim()).filter(Boolean) : [],
      ...(formData.link && { link: formData.link }),
      ...(formData.image && { image: formData.image }),
      ...(formData.gallery && { gallery: formData.gallery.split('\n').map(url => url.trim()).filter(Boolean) }),
      ...(formData.retrospective && { retrospective: formData.retrospective }),
    };

    if (project && 'id' in project && project.id) {
      onSave({ ...projectData, id: project.id } as Project);
    } else {
      onSave(projectData as Omit<Project, 'id'>);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-main mb-2">프로젝트 제목 *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="제목을 입력하세요"
            className="w-full px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">부제목</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="부제목을 입력하세요"
            className="w-full px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">설명 (짧은 설명)</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="프로젝트 짧은 설명을 입력하세요"
          rows={3}
          className="w-full px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">상세 설명</label>
        <textarea
          name="fullDescription"
          value={formData.fullDescription}
          onChange={handleChange}
          placeholder="프로젝트 상세 설명을 입력하세요"
          rows={5}
          className="w-full px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">카테고리</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main"
          >
            <option value="new">신규</option>
            <option value="renewal">리뉴얼</option>
            <option value="app">앱</option>
            <option value="web">웹</option>
            <option value="proposal">기획안</option>
            <option value="usability">사용성평가</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">태그 (쉼표로 구분)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="UX 디자인, 사용성 평가, 기획"
            className="w-full px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">날짜</label>
          <input
            type="text"
            name="date"
            value={formData.date}
            onChange={handleChange}
            placeholder="2024.01"
            className="w-full px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">팀 구성</label>
          <input
            type="text"
            name="team"
            value={formData.team}
            onChange={handleChange}
            placeholder="1인"
            className="w-full px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">기간</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="2주"
            className="w-full px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">역할</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="기획자"
            className="w-full px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">링크 (선택)</label>
          <input
            type="text"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main"
          />
          <p className="text-xs text-text-secondary mt-1">비워두면 저장되지 않습니다</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">메인 이미지 경로 (선택)</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="/projects/image.jpg"
          className="w-full px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main"
        />
        <p className="text-xs text-text-secondary mt-1">비워두면 저장되지 않습니다</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">갤러리 이미지 (선택, 최대 9개)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={isUploading}
          onChange={async (e) => {
            const files = Array.from(e.target.files || []);
            if (files.length === 0) return;
            
            if (files.length > 9) {
              alert('최대 9개의 이미지만 선택할 수 있습니다.');
              e.target.value = '';
              return;
            }

            setIsUploading(true);
            setUploadProgress('업로드 중...');

            try {
              const formData = new FormData();
              files.forEach((file) => {
                formData.append('files', file);
              });

              const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
              });

              const result = await response.json();

              if (result.success) {
                setUploadProgress(`✓ ${result.message}`);
                setFormData(prev => ({ 
                  ...prev, 
                  gallery: result.paths.join('\n') 
                }));
                setTimeout(() => setUploadProgress(''), 3000);
              } else {
                throw new Error(result.error || '업로드 실패');
              }
            } catch (error) {
              console.error('업로드 오류:', error);
              alert('파일 업로드 중 오류가 발생했습니다.');
              setUploadProgress('');
            } finally {
              setIsUploading(false);
              e.target.value = '';
            }
          }}
          className="w-full px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-main/10 file:text-brand-main hover:file:bg-brand-main/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <p className="text-xs text-text-secondary mt-1">최대 9개의 이미지를 선택하세요 (JPG, PNG, etc.)</p>
        
        {uploadProgress && (
          <div className="mt-2 text-sm text-brand-main font-medium">
            {uploadProgress}
          </div>
        )}
        
        {formData.gallery && (
          <div className="mt-2 text-xs text-text-secondary">
            <p className="font-medium mb-1">업로드된 이미지:</p>
            <div className="space-y-1">
              {formData.gallery.split('\n').filter(Boolean).map((path, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-brand-main">✓</span>
                  <span>{path.split('/').pop()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">주요 성과 (줄바꿈으로 구분)</label>
        <textarea
          name="achievements"
          value={formData.achievements}
          onChange={handleChange}
          placeholder="주요 성과를 한 줄씩 입력하세요&#10;예: 사용자 만족도 20% 향상&#10;예: 예매 단계 7→4단계 축소"
          rows={5}
          className="w-full px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main resize-y"
        />
        <p className="text-xs text-text-secondary mt-1">각 성과를 줄바꿈으로 구분하여 입력하세요</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">회고 (선택)</label>
        <textarea
          name="retrospective"
          value={formData.retrospective}
          onChange={handleChange}
          placeholder="프로젝트를 진행하며 느낀 점, 배운 점, 개선할 점 등을 작성하세요"
          rows={5}
          className="w-full px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main resize-y"
        />
        <p className="text-xs text-text-secondary mt-1">프로젝트 상세보기에서 💭 회고 섹션으로 표시됩니다</p>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isUploading}
          className="flex-1 px-6 py-3 bg-bg-light text-text-secondary rounded-xl font-medium hover:bg-line-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isUploading}
          className="flex-1 px-6 py-3 bg-brand-main text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? '업로드 중...' : (project ? '수정 완료' : '추가 완료')}
        </button>
      </div>
    </form>
  );
};

