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
            ? `<a href="${detailPdf}" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow"><i data-lucide="file-text" class="w-4 h-4"></i>프로젝트 상세보기</a>`
            : link
              ? `<a href="${link}" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow"><i data-lucide="external-link" class="w-4 h-4"></i>프로젝트 상세보기</a>`
              : `<button disabled class="inline-flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed opacity-60"><i data-lucide="file-text" class="w-4 h-4"></i>프로젝트 상세보기</button>`
        }
        ${
          designPdf
            ? `<a href="${designPdf}" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow"><i data-lucide="file-text" class="w-4 h-4"></i>화면 설계서 보기</a>`
            : designLink
              ? `<a href="${designLink}" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow"><i data-lucide="file-text" class="w-4 h-4"></i>화면 설계서 보기</a>`
              : `<button disabled class="inline-flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed opacity-60"><i data-lucide="file-text" class="w-4 h-4"></i>화면 설계서 보기</button>`
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

  const mainImage = imageFiles.find((f) => {
    const imgPath = project.image || '';
    const fname = imgPath.split('/').pop();
    return imgPath && (f.path === imgPath || f.url === imgPath || f.name === fname);
  });
  const galleryImages = imageFiles.filter((f) => f !== mainImage);

  const pdfRows = renderFileRows(pdfFiles, projectId);
  const actions = renderActions(project);
  const tabGroup = `tabs-${projectId}`;
  const imgPane = `images-${projectId}`;
  const pdfPane = `pdfs-${projectId}`;

  const renderImageCards = (items, label) => {
    if (!items || !items.length) return '';
    return `
      <div class="space-y-2">
        ${label ? `<p class="text-sm font-medium text-gray-700">${label}</p>` : ''}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${items
            .map(
              (img) => `
            <div class="border rounded-lg overflow-hidden bg-gray-50">
              <div class="aspect-video bg-gray-100">
                <img src="${img.url}" alt="${img.name}" class="w-full h-full object-cover" />
              </div>
              <div class="px-3 py-2 flex items-center justify-between text-sm text-gray-700">
                <span class="truncate max-w-[220px]" title="${img.name}">${truncate(img.name || '')}</span>
                <button onclick="downloadFile('${projectId}', '${img.name}')" class="p-1 text-green-600 hover:bg-green-50 rounded">
                  <i data-lucide="download" class="w-4 h-4"></i>
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
      <div class="bg-white rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden" onclick="event.stopPropagation()">
        <div class="flex-shrink-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-900">${project.title}</h2>
          <button onclick="this.closest('.fixed').remove()" class="p-2 hover:bg-gray-100 rounded-full transition">
            <i data-lucide="x" class="w-6 h-6"></i>
          </button>
        </div>
        <div class="flex-1 p-6 space-y-6" style="overflow-y: auto; overflow-x: hidden; flex: 1 1 auto; min-height: 0; scrollbar-width: thin; scrollbar-color: #cbd5e0 #f7fafc; -webkit-overflow-scrolling: touch;">
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
              <h3 class="text-sm font-medium text-gray-500 mb-1">상세 설명</h3>
              <p class="text-gray-700 whitespace-pre-line">${project.fullDescription}</p>
            </div>
          ` : ''}
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">카테고리</h3>
              <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">${categoryLabels[project.category] || project.category}</span>
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
              <ul class="list-disc list-inside space-y-1 text-gray-700">
                ${(project.achievements || []).map(achievement => `
                  <li>${achievement}</li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

          ${actions}

          <!-- 파일 관리 섹션 -->
          <div class="border-t pt-6">
            <div class="flex items-center gap-2 mb-4">
              <button class="px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white" data-tab-btn="${tabGroup}" data-target="${imgPane}">이미지</button>
              <button class="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700" data-tab-btn="${tabGroup}" data-target="${pdfPane}">PDF</button>
            </div>
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
        <div class="flex-shrink-0 bg-white border-t px-6 py-4 flex justify-end gap-3" style="flex-shrink: 0;">
          ${
            isAuthenticated
              ? `<button onclick="editProject('${project.id}'); this.closest('.fixed').remove();" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
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
  return `
    <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" id="editModalBackdrop">
      <div class="bg-white rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] flex flex-col" onclick="event.stopPropagation()">
        <div class="flex-shrink-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 class="text-xl font-bold text-gray-900">프로젝트 수정</h2>
          <button onclick="this.closest('.fixed').remove()" class="p-2 hover:bg-gray-100 rounded-full transition">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
        <form id="editForm" class="flex-1 overflow-y-auto p-6 space-y-4" style="scrollbar-width: thin; scrollbar-color: #cbd5e0 #f7fafc;">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">제목 *</label>
            <input type="text" name="title" value="${project.title || ''}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">부제목</label>
            <input type="text" name="subtitle" value="${project.subtitle || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">설명 *</label>
            <textarea name="description" required rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg">${project.description || ''}</textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">상세 설명</label>
            <textarea name="fullDescription" rows="5" class="w-full px-4 py-2 border border-gray-300 rounded-lg">${project.fullDescription || ''}</textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">카테고리 *</label>
              <select name="category" required class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                ${Object.entries(categoryLabels).map(([key, label]) => `<option value="${key}" ${project.category === key ? 'selected' : ''}>${label}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">태그 (쉼표로 구분)</label>
              <input type="text" name="tags" value="${(project.tags || []).join(', ')}" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">팀 구성</label>
              <input type="text" name="team" value="${project.team || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">시작일</label>
                <input type="date" name="startDate" id="editStartDate" value="${project.startDate || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">종료일</label>
                <input type="date" name="endDate" id="editEndDate" value="${project.endDate || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">기간 (자동 계산)</label>
              <input type="text" name="duration" id="editDuration" value="${project.duration || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" readonly />
              <p class="text-xs text-gray-500 mt-1">시작일/종료일을 선택하면 자동 계산됩니다.</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">역할</label>
              <input type="text" name="role" value="${project.role || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">링크</label>
              <input type="text" name="link" value="${project.link || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">주요 성과 (줄바꿈으로 구분)</label>
            <textarea name="achievements" rows="5" class="w-full px-4 py-2 border border-gray-300 rounded-lg">${(project.achievements || []).join('\\n')}</textarea>
          </div>
          <div class="space-y-3 border rounded-lg p-3 bg-gray-50">
            <div class="flex items-center gap-2">
              <i data-lucide="file-text" class="w-4 h-4 text-gray-600"></i>
              <h3 class="text-base font-semibold text-gray-800">PDF 업로드</h3>
              <span class="text-xs text-gray-500">(업로드 후 URL 자동 저장)</span>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">화면 설계서 PDF</label>
              <div class="flex items-center gap-3 flex-wrap">
                <input type="file" accept="application/pdf" id="editDesignPdfFile" class="text-sm" />
                <button type="button" onclick="console.log('🔘 Design PDF 업로드 버튼 클릭'); if (window.uploadPdfInEdit) { window.uploadPdfInEdit('design'); } else { console.error('❌ window.uploadPdfInEdit가 정의되지 않았습니다!'); alert('업로드 함수를 찾을 수 없습니다. 페이지를 새로고침해주세요.'); }" class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">업로드</button>
                <span id="editDesignPdfStatus" class="text-sm text-gray-600">
                  ${project.designPdf 
                    ? `<a href="${project.designPdf}" target="_blank" class="text-blue-600 underline">${truncate(project.designPdf.split('/').pop())}</a>` 
                    : '<span class="text-gray-400">선택된 파일 없음</span>'}
                </span>
                ${project.designPdf ? `<button type="button" id="removeDesignPdfBtn" class="px-2 py-1 text-xs text-red-600 border border-red-200 rounded">삭제</button>` : ''}
              </div>
              <input type="hidden" name="designPdf" id="editDesignPdf" value="${project.designPdf || ''}" />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">프로젝트 상세보기 PDF</label>
              <div class="flex items-center gap-3 flex-wrap">
                <input type="file" accept="application/pdf" id="editDetailPdfFile" class="text-sm" />
                <button type="button" onclick="console.log('🔘 Detail PDF 업로드 버튼 클릭'); if (window.uploadPdfInEdit) { window.uploadPdfInEdit('detail'); } else { console.error('❌ window.uploadPdfInEdit가 정의되지 않았습니다!'); alert('업로드 함수를 찾을 수 없습니다. 페이지를 새로고침해주세요.'); }" class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">업로드</button>
                <span id="editDetailPdfStatus" class="text-sm text-gray-600">
                  ${project.detailPdf 
                    ? `<a href="${project.detailPdf}" target="_blank" class="text-blue-600 underline">${truncate(project.detailPdf.split('/').pop())}</a>` 
                    : '<span class="text-gray-400">선택된 파일 없음</span>'}
                </span>
                ${project.detailPdf ? `<button type="button" id="removeDetailPdfBtn" class="px-2 py-1 text-xs text-red-600 border border-red-200 rounded">삭제</button>` : ''}
              </div>
              <input type="hidden" name="detailPdf" id="editDetailPdf" value="${project.detailPdf || ''}" />
            </div>
          </div>
          <div class="space-y-3 border rounded-lg p-3 bg-gray-50">
            <div class="flex items-center gap-2">
              <i data-lucide="image" class="w-4 h-4 text-gray-600"></i>
              <h3 class="text-base font-semibold text-gray-800">이미지 업로드</h3>
              <span class="text-xs text-gray-500">(대표 1개, 갤러리 여러 개)</span>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">대표 이미지</label>
              <input type="file" accept="image/png, image/jpeg" id="editMainImageFile" class="text-sm" />
              <div class="flex items-center gap-2" id="editMainImageStatusWrapper">
                <div id="editMainImageStatus" class="text-sm text-gray-600">${project.image ? `<a href="${project.image}" target="_blank" class="text-blue-600 underline">${truncate(project.image.split('/').pop())}</a>` : ''}</div>
                ${project.image ? `<button type="button" id="removeMainImageBtn" class="px-2 py-1 text-xs text-red-600 border border-red-200 rounded">삭제</button>` : ''}
              </div>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">갤러리 이미지 (다중 선택)</label>
              <input type="file" accept="image/png, image/jpeg" id="editGalleryImagesFile" class="text-sm" multiple />
              <div id="editGalleryImagesStatus" class="text-sm text-gray-600 space-y-1">
                ${(project.images || []).map((img, idx) => `<div class="flex items-center gap-2" data-existing-gallery="${img}">
                  <span class="truncate max-w-[240px]" title="${img}">${truncate(img.split('/').pop())}</span>
                  <button type="button" class="px-2 py-1 text-xs text-red-600 border border-red-200 rounded" data-remove-gallery="${idx}">삭제</button>
                </div>`).join('')}
              </div>
            </div>
          </div>
          <div class="flex gap-3 pt-4 pb-2 sticky bottom-0 bg-white border-t -mx-6 px-6 py-4 mt-4">
            <button type="submit" class="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm">
              수정 완료
            </button>
            <button type="button" onclick="this.closest('.fixed').remove()" class="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm">
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
};
