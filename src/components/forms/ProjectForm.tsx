'use client';

import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Project } from '@/types/portfolio';

interface ProjectFormProps {
  project?: Project | Partial<Project>;
  onSave: (project: Project | Omit<Project, 'id'>) => void;
  onCancel: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSave, onCancel }) => {
  const parseDateToMonthValue = (dateString?: string) => {
    if (!dateString) return '';
    // Named capturing groups 대신 일반 capturing groups 사용 (ES2018 미만 호환)
    const match = dateString.match(/(\d{2,4})[.\-\/](\d{1,2})/);
    if (!match) return '';
    const rawYear = match[1];
    const year = rawYear.length === 2 ? `20${rawYear}` : rawYear;
    const month = match[2].padStart(2, '0');
    return `${year}-${month}`;
  };

  const [achievements, setAchievements] = useState<string[]>(
    (project as any)?.achievements && Array.isArray((project as any).achievements) 
      ? (project as any).achievements.filter((a: string) => a && a.trim() !== '')
      : []
  );

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
    designLink: (project as any)?.designLink || (project as any)?.figmaLink || (project as any)?.designFile || '',
    designPdf: (project as any)?.designPdf || '',
    detailPdf: (project as any)?.detailPdf || '',
    previewPdf: (project as any)?.previewPdf || '',
    image: project?.image || '',
    gallery: (project as any)?.gallery && Array.isArray((project as any).gallery) 
      ? (project as any).gallery.join('\n') 
      : '',
    retrospective: (project as any)?.retrospective || '',
  });

  const monthInputValue = useMemo(
    () => parseDateToMonthValue(formData.date),
    [formData.date]
  );

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [pdfUploadProgress, setPdfUploadProgress] = useState<{ [key: string]: string }>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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
      category: formData.category as 'new' | 'renewal' | 'app' | 'web' | 'design',
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : ['미분류'],
      date: formData.date || '날짜 미정',
      team: formData.team || '미정',
      role: formData.role || '미정',
      duration: formData.duration || '미정',
      achievements: achievements.filter((a: string) => a && a.trim() !== ''),
      ...(formData.link && { link: formData.link }),
      ...(formData.designLink && { designLink: formData.designLink }),
      ...(formData.designPdf && { designPdf: formData.designPdf }),
      ...(formData.detailPdf && { detailPdf: formData.detailPdf }),
      ...(formData.previewPdf && { previewPdf: formData.previewPdf }),
      ...(formData.image && { image: formData.image }),
      ...(formData.gallery && { gallery: formData.gallery.split('\n').map((url: string) => url.trim()).filter(Boolean) }),
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
            <option value="design">화면설계서</option>
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
          <p className="text-xs text-text-secondary mt-1">FO 모달의 태그 섹션에 표시됩니다</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">상세 설명 (선택)</label>
        <textarea
          name="fullDescription"
          value={formData.fullDescription}
          onChange={handleChange}
          placeholder="프로젝트 상세 설명을 입력하세요 (선택 사항)"
          rows={5}
          className="w-full px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main"
        />
        <p className="text-xs text-text-secondary mt-1">상세 설명은 현재 FO 모달에 표시되지 않습니다</p>
      </div>

      {/* 진행 기간, 팀 구성, 역량, 기여도 (FO 모달과 동일한 구성) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">진행 기간 - 시작 월</label>
          <input
            type="month"
            name="date"
            value={monthInputValue}
            onChange={(e) => {
              const value = e.target.value;
              setFormData(prev => ({
                ...prev,
                date: value ? value.replace('-', '.') : '',
              }));
            }}
            placeholder="2024-01"
            className="w-full px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main"
          />
          <p className="text-xs text-text-secondary mt-1">달력에서 선택하거나 YYYY-MM 입력 시 자동 변환되어 저장됩니다.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">진행 기간 - 기간</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="2주"
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
          <label className="block text-sm font-medium text-text-secondary mb-2">역량 (쉼표로 구분)</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="AI 활용, Cursor, Figma MCP"
            className="w-full px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main"
          />
          <p className="text-xs text-text-secondary mt-1">쉼표로 구분하면 원형 박스로 표시됩니다</p>
        </div>
      </div>

      {/* PDF 파일 첨부 (화면 설계서, 프로젝트 상세보기, 미리보기) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-main mb-4">PDF 파일 첨부</h3>
        
        {/* 화면 설계서 PDF */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">화면 설계서 PDF</label>
          <div className="flex gap-2">
            <input
              type="file"
              accept=".pdf"
              disabled={isUploading || !!pdfUploadProgress['design']}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                
                if (file.type !== 'application/pdf') {
                  alert('PDF 파일만 업로드 가능합니다.');
                  e.target.value = '';
                  return;
                }

                setIsUploading(true);
                setPdfUploadProgress(prev => ({ ...prev, design: '업로드 중...' }));

                try {
                  const uploadFormData = new FormData();
                  uploadFormData.append('file', file);
                  uploadFormData.append('type', 'pdf');

                  console.log('PDF 업로드 시작:', file.name, file.size, file.type);

                  const response = await fetch('/api/upload-pdf', {
                    method: 'POST',
                    body: uploadFormData,
                  });

                  console.log('PDF 업로드 응답 상태:', response.status, response.statusText);

                  if (!response.ok) {
                    const errorText = await response.text();
                    console.error('PDF 업로드 HTTP 오류:', errorText);
                    throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
                  }

                  const result = await response.json();
                  console.log('PDF 업로드 결과:', result);

                  if (result.success) {
                    setPdfUploadProgress(prev => ({ ...prev, design: `✓ ${result.path}` }));
                    setFormData(prev => ({ ...prev, designPdf: result.path }));
                    setTimeout(() => setPdfUploadProgress(prev => {
                      const newProgress = { ...prev };
                      delete newProgress.design;
                      return newProgress;
                    }), 3000);
                  } else {
                    throw new Error(result.error || '업로드 실패');
                  }
                } catch (error: any) {
                  console.error('PDF 업로드 오류:', error);
                  alert(`PDF 파일 업로드 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
                  setPdfUploadProgress(prev => {
                    const newProgress = { ...prev };
                    delete newProgress.design;
                    return newProgress;
                  });
                } finally {
                  setIsUploading(false);
                  e.target.value = '';
                }
              }}
              className="flex-1 px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-main/10 file:text-brand-main hover:file:bg-brand-main/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {formData.designPdf && (
              <a
                href={`${formData.designPdf}#view=Fit`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-brand-main/10 text-brand-main rounded-lg hover:bg-brand-main/20 transition-colors text-sm font-medium whitespace-nowrap"
              >
                현재 파일 보기
              </a>
            )}
          </div>
          {pdfUploadProgress['design'] && (
            <p className="text-xs text-brand-main mt-1">{pdfUploadProgress['design']}</p>
          )}
          {formData.designPdf && !pdfUploadProgress['design'] && (
            <p className="text-xs text-text-secondary mt-1">업로드된 파일: {formData.designPdf.split('/').pop()}</p>
          )}
        </div>

        {/* 프로젝트 상세보기 PDF */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">프로젝트 상세보기 PDF</label>
          <div className="flex gap-2">
            <input
              type="file"
              accept=".pdf"
              disabled={isUploading || !!pdfUploadProgress['detail']}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                
                if (file.type !== 'application/pdf') {
                  alert('PDF 파일만 업로드 가능합니다.');
                  e.target.value = '';
                  return;
                }

                setIsUploading(true);
                setPdfUploadProgress(prev => ({ ...prev, detail: '업로드 중...' }));

                try {
                  const uploadFormData = new FormData();
                  uploadFormData.append('file', file);
                  uploadFormData.append('type', 'pdf');

                  console.log('PDF 업로드 시작:', file.name, file.size, file.type);

                  const response = await fetch('/api/upload-pdf', {
                    method: 'POST',
                    body: uploadFormData,
                  });

                  console.log('PDF 업로드 응답 상태:', response.status, response.statusText);

                  if (!response.ok) {
                    const errorText = await response.text();
                    console.error('PDF 업로드 HTTP 오류:', errorText);
                    throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
                  }

                  const result = await response.json();
                  console.log('PDF 업로드 결과:', result);

                  if (result.success) {
                    setPdfUploadProgress(prev => ({ ...prev, detail: `✓ ${result.path}` }));
                    setFormData(prev => ({ ...prev, detailPdf: result.path }));
                    setTimeout(() => setPdfUploadProgress(prev => {
                      const newProgress = { ...prev };
                      delete newProgress.detail;
                      return newProgress;
                    }), 3000);
                  } else {
                    throw new Error(result.error || '업로드 실패');
                  }
                } catch (error: any) {
                  console.error('PDF 업로드 오류:', error);
                  alert(`PDF 파일 업로드 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
                  setPdfUploadProgress(prev => {
                    const newProgress = { ...prev };
                    delete newProgress.detail;
                    return newProgress;
                  });
                } finally {
                  setIsUploading(false);
                  e.target.value = '';
                }
              }}
              className="flex-1 px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-main/10 file:text-brand-main hover:file:bg-brand-main/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {formData.detailPdf && (
              <a
                href={`${formData.detailPdf}#view=Fit`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-brand-main/10 text-brand-main rounded-lg hover:bg-brand-main/20 transition-colors text-sm font-medium whitespace-nowrap"
              >
                현재 파일 보기
              </a>
            )}
          </div>
          {pdfUploadProgress['detail'] && (
            <p className="text-xs text-brand-main mt-1">{pdfUploadProgress['detail']}</p>
          )}
          {formData.detailPdf && !pdfUploadProgress['detail'] && (
            <p className="text-xs text-text-secondary mt-1">업로드된 파일: {formData.detailPdf.split('/').pop()}</p>
          )}
        </div>

        {/* 미리보기 PDF */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">미리보기 PDF</label>
          <div className="flex gap-2">
            <input
              type="file"
              accept=".pdf"
              disabled={isUploading || !!pdfUploadProgress['preview']}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                
                if (file.type !== 'application/pdf') {
                  alert('PDF 파일만 업로드 가능합니다.');
                  e.target.value = '';
                  return;
                }

                setIsUploading(true);
                setPdfUploadProgress(prev => ({ ...prev, preview: '업로드 중...' }));

                try {
                  const uploadFormData = new FormData();
                  uploadFormData.append('file', file);
                  uploadFormData.append('type', 'pdf');

                  console.log('PDF 업로드 시작:', file.name, file.size, file.type);

                  const response = await fetch('/api/upload-pdf', {
                    method: 'POST',
                    body: uploadFormData,
                  });

                  console.log('PDF 업로드 응답 상태:', response.status, response.statusText);

                  if (!response.ok) {
                    const errorText = await response.text();
                    console.error('PDF 업로드 HTTP 오류:', errorText);
                    throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
                  }

                  const result = await response.json();
                  console.log('PDF 업로드 결과:', result);

                  if (result.success) {
                    setPdfUploadProgress(prev => ({ ...prev, preview: `✓ ${result.path}` }));
                    setFormData(prev => ({ ...prev, previewPdf: result.path }));
                    setTimeout(() => setPdfUploadProgress(prev => {
                      const newProgress = { ...prev };
                      delete newProgress.preview;
                      return newProgress;
                    }), 3000);
                  } else {
                    throw new Error(result.error || '업로드 실패');
                  }
                } catch (error: any) {
                  console.error('PDF 업로드 오류:', error);
                  alert(`PDF 파일 업로드 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
                  setPdfUploadProgress(prev => {
                    const newProgress = { ...prev };
                    delete newProgress.preview;
                    return newProgress;
                  });
                } finally {
                  setIsUploading(false);
                  e.target.value = '';
                }
              }}
              className="flex-1 px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-main/10 file:text-brand-main hover:file:bg-brand-main/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {formData.previewPdf && (
              <a
                href={`${formData.previewPdf}#view=Fit`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-brand-main/10 text-brand-main rounded-lg hover:bg-brand-main/20 transition-colors text-sm font-medium whitespace-nowrap"
              >
                현재 파일 보기
              </a>
            )}
          </div>
          {pdfUploadProgress['preview'] && (
            <p className="text-xs text-brand-main mt-1">{pdfUploadProgress['preview']}</p>
          )}
          {formData.previewPdf && !pdfUploadProgress['preview'] && (
            <p className="text-xs text-text-secondary mt-1">업로드된 파일: {formData.previewPdf.split('/').pop()}</p>
          )}
        </div>
      </div>

      {/* 프로젝트 상세보기, 화면 설계서 보기 링크 (기존 링크 입력 필드) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">프로젝트 상세보기 링크 (선택)</label>
          <input
            type="text"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main"
          />
          <p className="text-xs text-text-secondary mt-1">PDF 대신 외부 링크를 사용할 경우 입력</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">화면 설계서 링크 (선택)</label>
          <input
            type="text"
            name="designLink"
            value={formData.designLink}
            onChange={handleChange}
            placeholder="https://figma.com/..."
            className="w-full px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main"
          />
          <p className="text-xs text-text-secondary mt-1">PDF 대신 Figma 링크를 사용할 경우 입력</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">메인 이미지 (선택)</label>
        <div className="flex gap-2">
          <input
            type="file"
            accept="image/*"
            disabled={isUploading || !!pdfUploadProgress['mainImage']}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              
              if (!file.type.startsWith('image/')) {
                alert('이미지 파일만 업로드 가능합니다.');
                e.target.value = '';
                return;
              }

              setIsUploading(true);
              setPdfUploadProgress(prev => ({ ...prev, mainImage: '업로드 중...' }));

              try {
                const uploadFormData = new FormData();
                uploadFormData.append('files', file);

                console.log('메인 이미지 업로드 시작:', file.name, file.size, file.type);

                const response = await fetch('/api/upload', {
                  method: 'POST',
                  body: uploadFormData,
                });

                console.log('메인 이미지 업로드 응답 상태:', response.status, response.statusText);

                if (!response.ok) {
                  const errorText = await response.text();
                  console.error('메인 이미지 업로드 HTTP 오류:', errorText);
                  throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();
                console.log('메인 이미지 업로드 결과:', result);

                if (result.success && result.paths && result.paths.length > 0) {
                  setPdfUploadProgress(prev => ({ ...prev, mainImage: `✓ ${result.paths[0]}` }));
                  setFormData(prev => ({ ...prev, image: result.paths[0] }));
                  setTimeout(() => setPdfUploadProgress(prev => {
                    const newProgress = { ...prev };
                    delete newProgress.mainImage;
                    return newProgress;
                  }), 3000);
                } else {
                  throw new Error(result.error || '업로드 실패');
                }
              } catch (error: any) {
                console.error('메인 이미지 업로드 오류:', error);
                alert(`이미지 파일 업로드 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
                setPdfUploadProgress(prev => {
                  const newProgress = { ...prev };
                  delete newProgress.mainImage;
                  return newProgress;
                });
              } finally {
                setIsUploading(false);
                e.target.value = '';
              }
            }}
            className="flex-1 px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-main/10 file:text-brand-main hover:file:bg-brand-main/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {formData.image && (
            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({ ...prev, image: '' }));
              }}
              className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium whitespace-nowrap"
            >
              이미지 제거
            </button>
          )}
        </div>
        {pdfUploadProgress['mainImage'] && (
          <p className="text-xs text-brand-main mt-1">{pdfUploadProgress['mainImage']}</p>
        )}
        {formData.image && !pdfUploadProgress['mainImage'] && (
          <div className="mt-2">
            <p className="text-xs text-text-secondary mb-1">현재 이미지:</p>
            <div className="flex items-center gap-2">
              <img 
                src={formData.image} 
                alt="메인 이미지 미리보기"
                className="w-24 h-24 object-cover rounded border border-line-medium"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="text-xs text-text-secondary truncate flex-1">{formData.image.split('/').pop()}</span>
            </div>
          </div>
        )}
        <p className="text-xs text-text-secondary mt-1">또는 직접 경로 입력: <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="/projects/image.jpg" className="ml-1 px-2 py-1 text-xs border border-line-medium rounded" /></p>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">갤러리 이미지 (선택, 최대 30개)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={isUploading}
          onChange={async (e) => {
            const files = Array.from(e.target.files || []);
            if (files.length === 0) return;

            if (files.length > 30) {
              alert('최대 30개의 이미지만 선택할 수 있습니다.');
              e.target.value = '';
              return;
            }

            setIsUploading(true);
            setUploadProgress('업로드 중...');

            try {
              const uploadFormData = new FormData();
              files.forEach((file) => {
                uploadFormData.append('files', file);
              });

              console.log('갤러리 이미지 업로드 시작:', files.length, '개 파일');

              const response = await fetch('/api/upload', {
                method: 'POST',
                body: uploadFormData,
              });

              console.log('갤러리 이미지 업로드 응답 상태:', response.status, response.statusText);

              if (!response.ok) {
                const errorText = await response.text();
                console.error('갤러리 이미지 업로드 HTTP 오류:', errorText);
                throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
              }

              const result = await response.json();
              console.log('갤러리 이미지 업로드 결과:', result);

              if (result.success && result.paths && result.paths.length > 0) {
                setUploadProgress(`✓ ${result.paths.length}개 이미지 업로드 완료`);
                setFormData(prev => {
                  const existingGallery = prev.gallery ? prev.gallery.split('\n').filter(Boolean) : [];
                  const newGallery = [...existingGallery, ...result.paths];
                  return {
                    ...prev, 
                    gallery: newGallery.join('\n')
                  };
                });
                setTimeout(() => setUploadProgress(''), 3000);
              } else {
                throw new Error(result.error || '업로드 실패');
              }
            } catch (error: any) {
              console.error('갤러리 이미지 업로드 오류:', error);
              alert(`이미지 파일 업로드 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
              setUploadProgress('');
            } finally {
              setIsUploading(false);
              e.target.value = '';
            }
          }}
          className="w-full px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-main/10 file:text-brand-main hover:file:bg-brand-main/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <p className="text-xs text-text-secondary mt-1">최대 30개의 이미지를 선택하세요 (JPG, PNG, etc.)</p>
        
        {uploadProgress && (
          <div className="mt-2 text-sm text-brand-main font-medium">
            {uploadProgress}
          </div>
        )}
        
        {formData.gallery && (
          <div className="mt-4">
            <p className="text-xs font-medium text-text-secondary mb-2">업로드된 이미지 (드래그하여 순서 변경 가능):</p>
            <div className="space-y-2">
              {formData.gallery.split('\n').filter(Boolean).map((path: string, index: number, array: string[]) => {
                const galleryArray = array.filter(Boolean);
                
                const moveUp = () => {
                  if (index === 0) return;
                  const newArray = [...galleryArray];
                  [newArray[index - 1], newArray[index]] = [newArray[index], newArray[index - 1]];
                  setFormData(prev => ({
                    ...prev,
                    gallery: newArray.join('\n')
                  }));
                };
                const moveDown = () => {
                  if (index === galleryArray.length - 1) return;
                  const newArray = [...galleryArray];
                  [newArray[index], newArray[index + 1]] = [newArray[index + 1], newArray[index]];
                  setFormData(prev => ({
                    ...prev,
                    gallery: newArray.join('\n')
                  }));
                };
                const removeImage = () => {
                  const newArray = galleryArray.filter((_, i) => i !== index);
                  setFormData(prev => ({
                    ...prev,
                    gallery: newArray.join('\n')
                  }));
                };
                
                const handleDragStart = (e: React.DragEvent) => {
                  setDraggedIndex(index);
                  e.dataTransfer.effectAllowed = 'move';
                };
                
                const handleDragOver = (e: React.DragEvent) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  setDragOverIndex(index);
                };
                
                const handleDragLeave = () => {
                  setDragOverIndex(null);
                };
                
                const handleDrop = (e: React.DragEvent) => {
                  e.preventDefault();
                  if (draggedIndex === null || draggedIndex === index) {
                    setDraggedIndex(null);
                    setDragOverIndex(null);
                    return;
                  }
                  
                  const newArray = [...galleryArray];
                  const [removed] = newArray.splice(draggedIndex, 1);
                  newArray.splice(index, 0, removed);
                  
                  setFormData(prev => ({
                    ...prev,
                    gallery: newArray.join('\n')
                  }));
                  
                  setDraggedIndex(null);
                  setDragOverIndex(null);
                };
                
                return (
                  <div 
                    key={`${path}-${index}`}
                    draggable
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex items-center gap-2 p-2 border rounded-lg transition-all group cursor-move ${
                      draggedIndex === index 
                        ? 'border-brand-main bg-brand-main/10 opacity-50' 
                        : dragOverIndex === index
                        ? 'border-brand-main bg-brand-main/5'
                        : 'border-line-medium hover:bg-bg-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-text-tertiary">
                      <div className="cursor-grab active:cursor-grabbing">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                        </svg>
                      </div>
                      <button
                        type="button"
                        onClick={moveUp}
                        disabled={index === 0}
                        className="p-1 hover:bg-bg-primary rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        title="위로 이동"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={moveDown}
                        disabled={index === galleryArray.length - 1}
                        className="p-1 hover:bg-bg-primary rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        title="아래로 이동"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    <span className="text-brand-main flex-shrink-0 font-medium">#{index + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {path.startsWith('http') || path.startsWith('/') ? (
                          <img 
                            src={path} 
                            alt={`Gallery ${index + 1}`}
                            className="w-12 h-12 object-cover rounded border border-line-medium"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : null}
                        <span className="text-xs text-text-secondary truncate">{path.split('/').pop()}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="이미지 제거"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 프로젝트 개요 (FO 모달과 동일한 순서) */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          <span className="text-brand-main">📋</span> 프로젝트 개요 (짧은 설명)
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="프로젝트 짧은 설명을 입력하세요"
          rows={3}
          className="w-full px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main"
        />
        <p className="text-xs text-text-secondary mt-1">FO 모달의 "프로젝트 개요" 섹션에 표시됩니다</p>
      </div>

      {/* 주요 성과 (FO 모달과 동일한 순서) */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          <span className="text-brand-main">🎯</span> 주요 성과
        </label>
        <div className="space-y-2">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={achievement}
                onChange={(e) => {
                  const newAchievements = [...achievements];
                  newAchievements[index] = e.target.value;
                  setAchievements(newAchievements);
                }}
                placeholder={`성과 ${index + 1}`}
                className="flex-1 px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main"
              />
              <button
                type="button"
                onClick={() => {
                  const newAchievements = achievements.filter((_, i) => i !== index);
                  setAchievements(newAchievements);
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setAchievements([...achievements, ''])}
            className="w-full px-4 py-2 border border-line-medium border-dashed rounded-lg text-text-secondary hover:bg-bg-secondary transition-colors"
          >
            + 성과 추가
          </button>
        </div>
        <p className="text-xs text-text-secondary mt-1">각 성과를 개별적으로 입력하세요. FO 모달의 "주요 성과" 섹션에 표시됩니다</p>
      </div>

      {/* 회고 (FO 모달과 동일한 순서) */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          <span className="text-brand-main">💭</span> 회고
        </label>
        <textarea
          name="retrospective"
          value={formData.retrospective}
          onChange={handleChange}
          placeholder="프로젝트를 진행하며 느낀 점, 배운 점, 개선할 점 등을 작성하세요"
          rows={5}
          className="w-full px-4 py-2 border border-line-medium rounded-lg focus:outline-none focus:border-brand-main resize-y"
        />
        <p className="text-xs text-text-secondary mt-1">FO 모달의 "회고" 섹션에 표시됩니다</p>
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


