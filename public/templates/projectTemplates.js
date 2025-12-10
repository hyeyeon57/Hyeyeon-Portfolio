// 프로젝트 관련 템플릿 모음 (dashboard.html에서 모듈로 로드)

import { truncate } from './utils.js';

export const statsCardsTemplate = (stats) => `
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="p-4 rounded-xl border shadow-sm flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-500">오늘 방문자</p>
        <p class="text-2xl font-semibold text-gray-900 mt-1">${stats.today || 0}</p>
      </div>
      <div class="p-3 bg-blue-50 text-blue-600 rounded-lg">
        <i data-lucide="sun" class="w-6 h-6"></i>
      </div>
    </div>
    <div class="p-4 rounded-xl border shadow-sm flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-500">이번 주 방문자</p>
        <p class="text-2xl font-semibold text-gray-900 mt-1">${stats.thisWeek || 0}</p>
      </div>
      <div class="p-3 bg-purple-50 text-purple-600 rounded-lg">
        <i data-lucide="calendar" class="w-6 h-6"></i>
      </div>
    </div>
    <div class="p-4 rounded-xl border shadow-sm flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-500">전체 방문자</p>
        <p class="text-2xl font-semibold text-gray-900 mt-1">${stats.total || 0}</p>
      </div>
      <div class="p-3 bg-green-50 text-green-600 rounded-lg">
        <i data-lucide="trending-up" class="w-6 h-6"></i>
      </div>
    </div>
  </div>
`;

export const renderFileRows = (files = [], projectId) => {
  if (!files.length) {
    return `
      <div class="text-center py-8 text-gray-400">
        <i data-lucide="file-x" class="w-12 h-12 mx-auto mb-2"></i>
        <p>등록된 파일이 없습니다</p>
      </div>
    `;
  }
  return `
    <div class="space-y-2">
      ${files
        .map(
          (file) => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
          <div class="flex items-center gap-3">
            <i data-lucide="${file.type === 'pdf' ? 'file-text' : 'file-image'}" class="w-5 h-5 text-blue-600"></i>
            <span class="text-sm text-gray-700 max-w-[320px] truncate" title="${file.name}">${truncate(file.name)}</span>
          </div>
          <div class="flex gap-2">
            <a href="${file.url}" target="_blank" class="p-2 text-blue-600 hover:bg-blue-50 rounded transition" title="열기">
              <i data-lucide="eye" class="w-4 h-4"></i>
            </a>
            <button onclick="downloadFile('${projectId}', '${file.name}')" class="p-2 text-green-600 hover:bg-green-50 rounded transition" title="다운로드">
              <i data-lucide="download" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      `
        )
        .join('')}
    </div>
  `;
};

export const renderActions = (project) => {
  const detailPdf = project.detailPdf;
  const link = project.link && project.link !== '#' ? project.link : '';
  const designPdf = project.designPdf;
  const designLink = project.designLink || project.figmaLink || project.designFile;
  return `
    <div class="border-t pt-6 space-y-3">
      <h3 class="text-lg font-semibold text-gray-900">프로젝트 액션</h3>
      <div class="flex flex-wrap gap-3">
        ${
          detailPdf
            ? `<a href="${detailPdf}" target="_blank" class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow"><i data-lucide="file-text" class="w-4 h-4"></i>프로젝트 상세보기</a>`
            : link
              ? `<a href="${link}" target="_blank" class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow"><i data-lucide="external-link" class="w-4 h-4"></i>프로젝트 상세보기</a>`
              : `<button disabled class="inline-flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed opacity-60"><i data-lucide="file-text" class="w-4 h-4"></i>프로젝트 상세보기</button>`
        }
        ${
          designPdf
            ? `<a href="${designPdf}" target="_blank" class="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition shadow"><i data-lucide="file-text" class="w-4 h-4"></i>화면 설계서 보기</a>`
            : designLink
              ? `<a href="${designLink}" target="_blank" class="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition shadow"><i data-lucide="file-text" class="w-4 h-4"></i>화면 설계서 보기</a>`
              : `<button disabled class="inline-flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed opacity-60"><i data-lucide="file-text" class="w-4 h-4"></i>화면 설계서 보기</button>`
        }
      </div>
    </div>
  `;
};

export const renderDetailModal = (project, files, categoryLabels, isAuthenticated) => {
  const projectId = project._id || project.id;
  const isPdf = (file = {}) => {
    const name = (file.name || '').toLowerCase();
    return file.type === 'pdf' || name.endsWith('.pdf');
  };

  const imageFiles = (files || []).filter((f) => !isPdf(f));
  const pdfFiles = (files || []).filter(isPdf);

  // 프로젝트의 이미지 URL을 직접 사용
  const projectImages = [];
  if (project.image) {
    projectImages.push({
      url: project.image,
      name: project.image.split('/').pop() || '대표 이미지',
      path: project.image
    });
  }
  const galleryList = project.images || project.gallery || [];
  if (Array.isArray(galleryList)) {
    galleryList.forEach(imgUrl => {
      if (imgUrl && imgUrl !== project.image) {
        projectImages.push({
          url: imgUrl,
          name: imgUrl.split('/').pop() || '갤러리 이미지',
          path: imgUrl
        });
      }
    });
  }

  // files API에서 가져온 이미지와 프로젝트 이미지 합치기 (중복 제거)
  const allImages = [...projectImages];
  imageFiles.forEach(file => {
    const exists = allImages.some(img => img.url === file.url || img.path === file.path || img.url === file.path);
    if (!exists) {
      allImages.push(file);
    }
  });

  // 대표 이미지 찾기
  let mainImage = null;
  if (project.image && allImages.length > 0) {
    mainImage = allImages.find((img) => {
      const imgPath = project.image || '';
      return imgPath && (img.path === imgPath || img.url === imgPath || img.url === project.image);
    });
    // 찾지 못했으면 project.image를 직접 사용
    if (!mainImage && project.image) {
      mainImage = {
        url: project.image,
        name: project.image.split('/').pop() || '대표 이미지',
        path: project.image
      };
      // allImages에 없으면 추가
      if (!allImages.some(img => img.url === project.image)) {
        allImages.unshift(mainImage);
      }
    }
  }
  
  // 갤러리 이미지: mainImage를 제외한 나머지
  const galleryImages = allImages.filter((img) => {
    if (!mainImage) return true;
    return img.url !== mainImage.url && img.path !== mainImage.path;
  });

  const pdfRows = renderFileRows(pdfFiles, projectId);
  const actions = renderActions(project);
  const tabGroup = `tabs-${projectId}`;
  const imgPane = `images-${projectId}`;
  const pdfPane = `pdfs-${projectId}`;

  const renderImageCards = (items, label) => {
    if (!items || !items.length) return '';
    return `
      <div class="space-y-3">
        ${label ? `<p class="text-sm font-medium text-gray-700 mb-2">${label}</p>` : ''}
        <div class="grid grid-cols-2 gap-3" id="gallery-images-${projectId}">
          ${items
            .map(
              (img, idx) => `
            <div class="border rounded-lg overflow-hidden bg-gray-50 hover:shadow-md transition-shadow relative cursor-move" draggable="true" data-image-index="${idx}" data-image-url="${img.url}" data-image-name="${img.name || ''}">
              <div class="absolute top-2 left-2 z-10 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                ${idx + 1}
              </div>
              <div class="bg-gray-100 cursor-pointer" onclick="openImageModal('${img.url}', '${img.name || ''}')">
                <img src="${img.url}" alt="${img.name}" class="w-full h-auto max-h-[150px] object-contain mx-auto" style="display: block; pointer-events: none;" />
              </div>
              <div class="px-2 py-1.5 flex items-center justify-between text-xs text-gray-700 bg-white">
                <span class="flex-1 break-all" title="${img.name || ''}">${img.name || ''}</span>
                <button onclick="downloadFile('${projectId}', '${img.name}')" class="p-1 text-green-600 hover:bg-green-50 rounded flex-shrink-0" title="다운로드">
                  <i data-lucide="download" class="w-3 h-3"></i>
                </button>
              </div>
            </div>`
            )
            .join('')}
        </div>
      </div>
    `;
  };
  return `
    <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onclick="this.remove()">
      <div class="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col" style="display: flex; flex-direction: column; max-height: 90vh; overflow: hidden;" onclick="event.stopPropagation()">
        <div class="flex-shrink-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-900">${project.title}</h2>
          <button onclick="this.closest('.fixed').remove()" class="p-2 hover:bg-gray-100 rounded-full transition">
            <i data-lucide="x" class="w-6 h-6"></i>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-6 space-y-6 min-h-0 modal-scroll" style="overflow-y: auto !important; overflow-x: hidden; flex: 1 1 auto; min-height: 0; max-height: calc(90vh - 140px); scrollbar-width: thin; scrollbar-color: #9ca3af #f3f4f6; -webkit-overflow-scrolling: touch;">
          <style>
            .modal-scroll::-webkit-scrollbar {
              width: 8px;
            }
            .modal-scroll::-webkit-scrollbar-track {
              background: #f3f4f6;
              border-radius: 4px;
            }
            .modal-scroll::-webkit-scrollbar-thumb {
              background: #9ca3af;
              border-radius: 4px;
            }
            .modal-scroll::-webkit-scrollbar-thumb:hover {
              background: #6b7280;
            }
          </style>
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-1">부제목</h3>
            <p class="text-lg text-gray-900">${project.subtitle || ''}</p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-1">설명</h3>
            <p class="text-gray-700">${project.description || ''}</p>
          </div>
          ${project.fullDescription ? `
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">프로젝트 개요</h3>
              <p class="text-gray-700 whitespace-pre-line">${project.fullDescription}</p>
            </div>
          ` : ''}
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">카테고리</h3>
              <div class="flex flex-wrap gap-2">
                ${Array.isArray(project.category) 
                  ? project.category.map(cat => `<span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">${categoryLabels[cat] || cat}</span>`).join('')
                  : `<span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">${categoryLabels[project.category] || project.category}</span>`
                }
              </div>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">날짜</h3>
              <p class="text-gray-700">${project.date || ''}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">역할</h3>
              <p class="text-gray-700">${project.role || ''}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">기간</h3>
              <p class="text-gray-700">${project.duration || ''}</p>
            </div>
          </div>
          ${(project.tags || []).length > 0 ? `
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">태그</h3>
              <div class="flex flex-wrap gap-2">
                ${(project.tags || []).map(tag => `
                  <span class="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700">${tag}</span>
                `).join('')}
              </div>
            </div>
          ` : ''}
          ${(project.achievements || []).length > 0 ? `
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">주요 성과</h3>
              <ul class="list-none space-y-2 text-gray-700">
                ${(project.achievements || []).slice(0, 3).map(achievement => `
                  <li class="flex items-start gap-2">
                    <span class="text-purple-600 mt-0.5">🎯</span>
                    <span class="whitespace-pre-line">${achievement.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

          ${actions}

          <!-- 파일 관리 섹션 -->
          <div class="border-t pt-6">
            ${(mainImage || galleryImages.length > 0 || pdfFiles.length > 0) ? `
            <div class="flex items-center gap-2 mb-4">
              <button class="px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white" data-tab-btn="${tabGroup}" data-target="${imgPane}">이미지</button>
              <button class="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700" data-tab-btn="${tabGroup}" data-target="${pdfPane}">PDF</button>
            </div>
            ` : ''}
            <div id="${imgPane}" class="space-y-4">
              ${mainImage ? renderImageCards([mainImage], '대표 이미지') : ''}
              ${galleryImages.length ? renderImageCards(galleryImages, '갤러리 이미지') : (!mainImage ? `
                <div class="text-center py-8 text-gray-400">
                  <i data-lucide="image-off" class="w-12 h-12 mx-auto mb-2"></i>
                  <p>등록된 이미지가 없습니다</p>
                </div>` : '')}
            </div>
            <div id="${pdfPane}" class="space-y-4 hidden">
              ${pdfRows}
            </div>
          </div>
        </div>
        <div class="flex-shrink-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
          ${
            isAuthenticated
              ? `<button onclick="editProject('${project.id}'); this.closest('.fixed').remove();" class="px-4 py-2 text-white rounded-lg transition" style="background-color: #7A68F6;" onmouseover="this.style.backgroundColor='#6B5AE5'" onmouseout="this.style.backgroundColor='#7A68F6'">
            수정하기
          </button>`
              : ''
          }
          <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            닫기
          </button>
        </div>
      </div>
    </div>
  `;
};

export const renderEditModal = (project, categoryLabels) => {
  // 완료 상태 체크
  const hasDescription = project.title && project.description && project.category && (Array.isArray(project.category) ? project.category.length > 0 : project.category);
  const hasPdf = (project.designPdf && project.designPdf.trim() !== '') && (project.detailPdf && project.detailPdf.trim() !== '');
  // 대표 이미지와 갤러리 이미지가 모두 있어야 완료
  const hasMainImage = project.image && project.image.trim() !== '';
  const hasGalleryImages = (project.images && project.images.length > 0) || (project.gallery && project.gallery.length > 0);
  const hasImage = hasMainImage && hasGalleryImages;
  
  return `
    <div class="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4" style="backdrop-filter: blur(4px);">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col relative z-[10000] overflow-hidden border border-gray-100" onclick="event.stopPropagation()">
        <div class="flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div>
              <h2 class="text-xl font-bold text-gray-900">프로젝트 수정</h2>
              <p class="text-xs text-gray-500 mt-0.5">프로젝트 정보를 수정하세요</p>
            </div>
            <div class="flex items-center gap-3 ml-2">
              <div class="w-3 h-3 rounded-full ${hasDescription ? '' : 'border bg-transparent'}" title="프로젝트 설명 ${hasDescription ? '완료' : '미완료'}" style="transition: all 0.3s; ${hasDescription ? 'background-color: #7A68F6;' : 'border-color: #7A68F6;'}"></div>
              <div class="w-3 h-3 rounded-full ${hasPdf ? 'bg-blue-500' : 'border border-blue-500 bg-transparent'}" title="PDF 업로드 ${hasPdf ? '완료' : '미완료'}" style="transition: all 0.3s;"></div>
              <div class="w-3 h-3 rounded-full ${hasImage ? 'bg-emerald-600' : 'border border-emerald-600 bg-transparent'}" title="이미지 업로드 ${hasImage ? '완료' : '미완료'}" style="transition: all 0.3s;"></div>
            </div>
          </div>
          <button onclick="this.closest('.fixed').remove()" class="p-2 hover:bg-white/80 rounded-lg transition-colors text-gray-500 hover:text-gray-700">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
        <form id="editForm" class="flex-1 overflow-y-auto p-6 space-y-6 min-h-0 bg-gray-50/30" style="max-height: calc(92vh - 140px); scrollbar-width: thin; scrollbar-color: #cbd5e0 #f7fafc; -webkit-overflow-scrolling: touch; overflow-y: auto !important;">
          <div class="bg-white rounded-xl p-6 border border-gray-300 shadow-sm">
            <div class="flex items-center gap-2 mb-5 pb-4 border-b border-gray-200">
              <div>
                <h3 class="text-base font-bold text-gray-900">프로젝트 설명</h3>
                <p class="text-xs text-gray-500">프로젝트의 기본 정보를 입력하세요</p>
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">제목 <span class="text-red-500">*</span></label>
                <input type="text" name="title" value="${project.title || ''}" required class="w-full px-4 py-2.5 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">부제목</label>
                <input type="text" name="subtitle" value="${project.subtitle || ''}" class="w-full px-4 py-2.5 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">설명 <span class="text-red-500">*</span></label>
                <textarea name="description" required rows="3" class="w-full px-4 py-2.5 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none bg-white">${project.description || ''}</textarea>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">프로젝트 개요</label>
                <textarea name="fullDescription" rows="4" class="w-full px-4 py-2.5 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none bg-white">${project.fullDescription || ''}</textarea>
              </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">카테고리 <span class="text-red-500">*</span> (다중 선택 가능)</label>
                <div class="space-y-2 border border-gray-300 rounded-lg p-3 bg-white">
                  ${Object.entries(categoryLabels).map(([key, label]) => {
                    const isSelected = Array.isArray(project.category) 
                      ? project.category.includes(key)
                      : project.category === key;
                    return `
                    <label class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                      <input type="checkbox" name="category" value="${key}" ${isSelected ? 'checked' : ''} class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2" style="accent-color: #7A68F6;" />
                      <span class="ml-2 text-xs text-gray-700">${label}</span>
                    </label>
                    `;
                  }).join('')}
                </div>
                <p class="text-xs text-gray-500 mt-1">원하는 카테고리를 클릭하여 선택하세요. 여러 개 선택 가능합니다.</p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">태그 <span class="text-xs text-gray-500 font-normal">(쉼표로 구분)</span></label>
                <input type="text" name="tags" value="${(project.tags || []).join(', ')}" class="w-full px-4 py-2.5 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white" placeholder="예: 태그1, 태그2, 태그3" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">팀 구성</label>
              <input type="text" name="team" value="${project.team || ''}" class="w-full px-4 py-2.5 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white" placeholder="예: 3명" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">시작일</label>
                <input type="date" name="startDate" id="editStartDate" value="${project.startDate || ''}" class="w-full px-4 py-2.5 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">종료일</label>
                <input type="date" name="endDate" id="editEndDate" value="${project.endDate || ''}" class="w-full px-4 py-2.5 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">기간 <span class="text-xs text-gray-500 font-normal">(자동 계산)</span></label>
              <input type="text" name="duration" id="editDuration" value="${project.duration || ''}" class="w-full px-4 py-2.5 text-xs text-gray-600 border border-gray-300 rounded-lg bg-gray-50" readonly />
              <p class="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                <i data-lucide="info" class="w-3 h-3"></i>
                시작일/종료일을 선택하면 자동 계산됩니다.
              </p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">역할</label>
                <input type="text" name="role" value="${project.role || ''}" class="w-full px-4 py-2.5 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white" placeholder="예: UX 기획자" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">링크</label>
                <input type="text" name="link" value="${project.link || ''}" class="w-full px-4 py-2.5 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white" placeholder="https://..." />
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">주요 성과 (최대 3개)</label>
              <div id="achievementsContainer" class="space-y-2">
                ${[0, 1, 2].map((index) => {
                  const achievement = (project.achievements || [])[index] || '';
                  return `
                  <div class="flex gap-2 items-start achievement-item">
                    <div class="flex items-center justify-center w-8 h-8 mt-1 flex-shrink-0">
                      <span class="text-purple-600 text-lg">🎯</span>
                    </div>
                    <textarea name="achievements[]" rows="2" placeholder="성과 ${index + 1} (엔터로 줄바꿈 가능)" class="flex-1 px-4 py-2.5 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-y bg-white">${achievement.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
                    ${achievement ? `
                    <button type="button" onclick="const item = this.closest('.achievement-item'); const textarea = item.querySelector('textarea'); textarea.value = '';" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1">
                      <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                    ` : ''}
                  </div>
                `;
                }).join('')}
              </div>
              <p class="text-xs text-gray-500 mt-1">최대 3개의 성과를 입력할 수 있습니다. 각 성과 내에서 엔터를 눌러 줄바꿈할 수 있습니다.</p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">회고</label>
              <textarea name="retrospective" rows="5" class="w-full px-4 py-2.5 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none bg-white" placeholder="프로젝트를 진행하며 느낀 점, 배운 점, 개선할 점 등을 작성하세요">${project.retrospective || ''}</textarea>
            </div>
            <div class="flex justify-center pt-4 border-t border-gray-200 mt-4">
              <button type="submit" form="editForm" class="w-full px-6 py-3 text-white rounded-lg text-sm font-medium shadow-sm transition-colors" style="background-color: #7A68F6;" onmouseover="this.style.backgroundColor='#6B5AE5'" onmouseout="this.style.backgroundColor='#7A68F6'">
                저장
              </button>
            </div>
          </div>
          </div>
          <div class="bg-white rounded-xl p-6 border border-gray-300 shadow-sm">
            <div class="flex items-center gap-2 mb-5 pb-4 border-b border-gray-200">
              <div>
                <h3 class="text-base font-bold text-gray-900">PDF 업로드</h3>
                <p class="text-xs text-gray-500">업로드 후 URL이 자동으로 저장됩니다</p>
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">화면 설계서 PDF</label>
                <div class="flex items-center gap-2 flex-wrap">
                  <input type="file" accept="application/pdf" id="editDesignPdfFile" class="text-xs flex-1 min-w-[120px]" />
                  <button type="button" onclick="uploadPdfInEdit('design')" class="px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium shadow-sm" style="background-color: #2563eb;" onmouseover="this.style.backgroundColor='#1D4ED8'" onmouseout="this.style.backgroundColor='#2563eb'">업로드</button>
                </div>
                <div class="mt-2 flex items-center gap-2">
                  <span id="editDesignPdfStatus" class="text-xs text-gray-600 break-all">${project.designPdf ? `<a href="${project.designPdf}" target="_blank" class="text-blue-600 hover:text-blue-700 underline font-normal break-all">${truncate(project.designPdf.split('/').pop())}</a>` : '<span class="text-gray-400">파일이 없습니다</span>'}</span>
                  ${project.designPdf ? `<button type="button" id="removeDesignPdfBtn" class="px-2 py-1 text-xs text-white rounded transition-colors flex-shrink-0" style="background-color: #2563eb; border: 1px solid #2563eb;" onmouseover="this.style.backgroundColor='#1D4ED8'; this.style.borderColor='#1D4ED8'" onmouseout="this.style.backgroundColor='#2563eb'; this.style.borderColor='#2563eb'">삭제</button>` : ''}
                </div>
                <input type="hidden" name="designPdf" id="editDesignPdf" value="${project.designPdf || ''}" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">프로젝트 상세보기 PDF</label>
                <div class="flex items-center gap-2 flex-wrap">
                  <input type="file" accept="application/pdf" id="editDetailPdfFile" class="text-xs flex-1 min-w-[120px]" />
                  <button type="button" onclick="uploadPdfInEdit('detail')" class="px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium shadow-sm" style="background-color: #2563eb;" onmouseover="this.style.backgroundColor='#1D4ED8'" onmouseout="this.style.backgroundColor='#2563eb'">업로드</button>
                </div>
                <div class="mt-2 flex items-center gap-2">
                  <span id="editDetailPdfStatus" class="text-xs text-gray-600 break-all">${project.detailPdf ? `<a href="${project.detailPdf}" target="_blank" class="text-blue-600 hover:text-blue-700 underline font-normal break-all">${truncate(project.detailPdf.split('/').pop())}</a>` : '<span class="text-gray-400">파일이 없습니다</span>'}</span>
                  ${project.detailPdf ? `<button type="button" id="removeDetailPdfBtn" class="px-2 py-1 text-xs text-white rounded transition-colors flex-shrink-0" style="background-color: #2563eb; border: 1px solid #2563eb;" onmouseover="this.style.backgroundColor='#1D4ED8'; this.style.borderColor='#1D4ED8'" onmouseout="this.style.backgroundColor='#2563eb'; this.style.borderColor='#2563eb'">삭제</button>` : ''}
                </div>
                <input type="hidden" name="detailPdf" id="editDetailPdf" value="${project.detailPdf || ''}" />
              </div>
            </div>
            <div class="flex justify-center pt-4 border-t border-gray-200 mt-4">
              <button type="submit" form="editForm" class="w-full px-6 py-3 text-white rounded-lg text-sm font-medium shadow-sm transition-colors" style="background-color: #2563eb;" onmouseover="this.style.backgroundColor='#1D4ED8'" onmouseout="this.style.backgroundColor='#2563eb'">
                저장
              </button>
            </div>
          </div>
          <div class="bg-white rounded-xl p-6 border border-gray-300 shadow-sm">
            <div class="flex items-center gap-2 mb-5 pb-4 border-b border-gray-200">
              <div>
                <h3 class="text-base font-bold text-gray-900">이미지 업로드</h3>
                <p class="text-xs text-gray-500">대표 이미지 1개, 갤러리 이미지 여러 개</p>
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">대표 이미지</label>
                <div class="flex items-center gap-2 flex-wrap">
                  <input type="file" accept="image/png, image/jpeg" id="editMainImageFile" class="text-xs flex-1 min-w-[120px]" />
                  <button type="button" onclick="uploadImageInEdit('main')" class="px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium shadow-sm" style="background-color: #16a34a;" onmouseover="this.style.backgroundColor='#15803d'" onmouseout="this.style.backgroundColor='#16a34a'">업로드</button>
                </div>
                <div class="flex items-center gap-2 mt-2" id="editMainImageStatusWrapper">
                  <div id="editMainImageStatus" class="text-sm" style="color: #15803d;">${project.image ? `<a href="${project.image}" target="_blank" class="text-green-600 hover:text-green-700 underline font-medium">${truncate(project.image.split('/').pop())}</a>` : '<span class="text-gray-400">파일이 없습니다</span>'}</div>
                  ${project.image ? `<button type="button" id="removeMainImageBtn" class="px-2 py-1 text-xs text-white rounded transition-colors" style="background-color: #16a34a; border: 1px solid #16a34a;" onmouseover="this.style.backgroundColor='#15803d'; this.style.borderColor='#15803d'" onmouseout="this.style.backgroundColor='#16a34a'; this.style.borderColor='#16a34a'">삭제</button>` : ''}
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">갤러리 이미지 <span class="text-xs text-gray-500 font-normal">(다중 선택 가능)</span></label>
                <div class="flex items-center gap-2 flex-wrap">
                  <input type="file" accept="image/png, image/jpeg" id="editGalleryImagesFile" class="text-xs flex-1 min-w-[120px]" multiple />
                  <button type="button" onclick="uploadImageInEdit('gallery')" class="px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium shadow-sm" style="background-color: #16a34a;" onmouseover="this.style.backgroundColor='#15803d'" onmouseout="this.style.backgroundColor='#16a34a'">업로드</button>
                </div>
                <div id="editGalleryImagesStatus" class="text-sm text-gray-600 space-y-2 max-h-40 overflow-y-auto mt-2" style="scrollbar-width: thin; scrollbar-color: #cbd5e0 #f7fafc;">
                  ${(project.images || []).map((img, idx) => `<div class="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-lg border border-gray-200" data-existing-gallery="${img}">
                    <span class="truncate flex-1 text-xs font-medium" title="${img}">${truncate(img.split('/').pop())}</span>
                    <button type="button" class="px-2 py-1 text-xs text-white rounded transition-colors flex-shrink-0" style="background-color: #3BBA70; border: 1px solid #3BBA70;" onmouseover="this.style.backgroundColor='#2a8a54'; this.style.borderColor='#2a8a54'" onmouseout="this.style.backgroundColor='#3BBA70'; this.style.borderColor='#3BBA70'" data-remove-gallery="${idx}">삭제</button>
                  </div>`).join('')}
                  ${(project.images || []).length === 0 ? '<p class="text-xs text-gray-400 text-center py-2">갤러리 이미지가 없습니다</p>' : ''}
                </div>
              </div>
            </div>
            <div class="flex flex-col items-center pt-4 border-t border-gray-200 mt-4">
              <button type="submit" form="editForm" class="w-full px-6 py-3 text-white rounded-lg text-sm font-medium shadow-sm transition-colors" style="background-color: #16a34a;" onmouseover="this.style.backgroundColor='#15803d'" onmouseout="this.style.backgroundColor='#16a34a'">
                저장
              </button>
              <div id="editSuccessMessage" class="mt-3 text-sm text-green-600 font-medium hidden"></div>
            </div>
          </div>
        </form>
      </div>
    </div>
  `;
};

