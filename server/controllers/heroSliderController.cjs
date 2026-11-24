const { ok, fail } = require('../utils/httpResponse.cjs');
const {
  listHeroSliders,
  getAllHeroSliders,
  getHeroSlider,
  createHeroSlider,
  updateHeroSlider,
  deleteHeroSlider,
} = require('../services/heroSliderService.cjs');
const { saveFiles } = require('../services/storageService.cjs');

// 활성화된 슬라이더만 조회 (공개 API)
const getHeroSliders = async (req, res) => {
  try {
    console.log('[heroSliderController] 슬라이더 목록 조회 요청');
    
    const mongoose = require('mongoose');
    const isConnected = mongoose.connection.readyState === 1;
    
    if (!isConnected) {
      console.error('[heroSliderController] MongoDB 연결되지 않음');
      const { connectDB } = require('../config/database.cjs');
      const connected = await connectDB();
      
      if (!connected) {
        return fail(res, 503, 'MongoDB가 연결되지 않았습니다.');
      }
    }
    
    const result = await listHeroSliders();
    
    if (!result.ok) {
      return fail(res, result.status || 500, result.message);
    }
    
    console.log(`[heroSliderController] 슬라이더 목록 조회 성공: ${result.data?.length || 0}개`);
    return ok(res, { data: result.data || [] });
  } catch (error) {
    console.error('[heroSliderController] 슬라이더 목록 조회 중 예외 발생:', error);
    return fail(res, 500, `슬라이더를 불러오는데 실패했습니다: ${error.message}`);
  }
};

// 전체 슬라이더 조회 (관리자용)
const getAllSliders = async (req, res) => {
  try {
    const result = await getAllHeroSliders();
    
    if (!result.ok) {
      return fail(res, result.status || 500, result.message);
    }
    
    return ok(res, { data: result.data || [] });
  } catch (error) {
    console.error('[heroSliderController] 전체 슬라이더 조회 중 예외 발생:', error);
    return fail(res, 500, `슬라이더를 불러오는데 실패했습니다: ${error.message}`);
  }
};

// 슬라이더 상세 조회
const getHeroSliderDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getHeroSlider(id);
    
    if (!result.ok) {
      return fail(res, result.status || 500, result.message);
    }
    
    return ok(res, { data: result.data });
  } catch (error) {
    console.error('[heroSliderController] 슬라이더 조회 중 예외 발생:', error);
    return fail(res, 500, `슬라이더를 불러오는데 실패했습니다: ${error.message}`);
  }
};

// 슬라이더 생성
const postHeroSlider = async (req, res) => {
  try {
    console.log('[heroSliderController] 슬라이더 생성 요청');
    console.log('[heroSliderController] req.body:', req.body);
    console.log('[heroSliderController] req.file:', req.file ? { fieldname: req.file.fieldname, originalname: req.file.originalname, mimetype: req.file.mimetype } : '없음');
    
    const { title, subtitle, description, link, order, active } = req.body;
    let image = req.body.image; // 기존 이미지 URL (수정 시 사용)
    
    // 이미지 파일 처리 (FormData에서 업로드된 파일)
    if (req.file) {
      console.log('[heroSliderController] 이미지 파일 업로드 처리 시작');
      const savedFiles = await saveFiles([req.file], 'hero-sliders');
      if (savedFiles && savedFiles.length > 0) {
        image = savedFiles[0]; // saveFiles는 URL 문자열 배열을 반환하므로 .path 없이 직접 사용
        console.log('[heroSliderController] 이미지 저장 완료:', image);
      } else {
        console.error('[heroSliderController] 이미지 저장 실패: savedFiles가 비어있음');
      }
    }
    
    if (!image) {
      console.error('[heroSliderController] 이미지가 없음 - 생성 실패');
      return fail(res, 400, '이미지는 필수입니다. 이미지 파일을 업로드해주세요.');
    }
    
    const data = {
      image,
      title: title || '',
      subtitle: subtitle || '',
      description: description || '',
      link: link || '',
      order: order !== undefined && order !== '' ? parseInt(order) : undefined,
      active: active !== undefined && active !== '' ? (active === 'true' || active === true || active === '1') : true,
    };
    
    console.log('[heroSliderController] 저장할 데이터:', data);
    
    const result = await createHeroSlider(data);
    
    if (!result.ok) {
      return fail(res, result.status || 500, result.message);
    }
    
    console.log('[heroSliderController] 슬라이더 생성 성공:', result.data?._id || result.data?.id);
    return ok(res, { data: result.data }, 201);
  } catch (error) {
    console.error('[heroSliderController] 슬라이더 생성 중 예외 발생:', error);
    console.error('[heroSliderController] 에러 스택:', error.stack);
    return fail(res, 500, `슬라이더를 생성하는데 실패했습니다: ${error.message}`);
  }
};

// 슬라이더 수정
const putHeroSlider = async (req, res) => {
  try {
    console.log('[heroSliderController] 슬라이더 수정 요청');
    console.log('[heroSliderController] 수정 ID:', req.params.id);
    console.log('[heroSliderController] req.body:', req.body);
    console.log('[heroSliderController] req.file:', req.file ? { fieldname: req.file.fieldname, originalname: req.file.originalname, mimetype: req.file.mimetype } : '없음');
    
    const { id } = req.params;
    const { title, subtitle, description, link, order, active } = req.body;
    let image = req.body.image; // 기존 이미지 URL 또는 새로 업로드된 이미지
    
    // 새 이미지 파일이 있으면 저장 (수정 시 이미지 변경)
    if (req.file) {
      console.log('[heroSliderController] 새 이미지 파일 업로드 처리 시작');
      const savedFiles = await saveFiles([req.file], 'hero-sliders');
      if (savedFiles && savedFiles.length > 0) {
        image = savedFiles[0]; // saveFiles는 URL 문자열 배열을 반환하므로 .path 없이 직접 사용
        console.log('[heroSliderController] 새 이미지 저장 완료:', image);
      }
    }
    
    const data = {};
    if (image) data.image = image;
    if (title !== undefined) data.title = title;
    if (subtitle !== undefined) data.subtitle = subtitle;
    if (description !== undefined) data.description = description;
    if (link !== undefined) data.link = link;
    if (order !== undefined && order !== '') data.order = parseInt(order);
    if (active !== undefined && active !== '') {
      data.active = active === 'true' || active === true || active === '1';
    }
    
    console.log('[heroSliderController] 수정할 데이터:', data);
    
    const result = await updateHeroSlider(id, data);
    
    if (!result.ok) {
      return fail(res, result.status || 500, result.message);
    }
    
    console.log('[heroSliderController] 슬라이더 수정 성공');
    return ok(res, { data: result.data });
  } catch (error) {
    console.error('[heroSliderController] 슬라이더 수정 중 예외 발생:', error);
    console.error('[heroSliderController] 에러 스택:', error.stack);
    return fail(res, 500, `슬라이더를 수정하는데 실패했습니다: ${error.message}`);
  }
};

// 슬라이더 삭제
const deleteHeroSliderById = async (req, res) => {
  try {
    console.log('[heroSliderController] 슬라이더 삭제 요청');
    const { id } = req.params;
    
    const result = await deleteHeroSlider(id);
    
    if (!result.ok) {
      return fail(res, result.status || 500, result.message);
    }
    
    console.log('[heroSliderController] 슬라이더 삭제 성공');
    return ok(res, { data: result.data });
  } catch (error) {
    console.error('[heroSliderController] 슬라이더 삭제 중 예외 발생:', error);
    return fail(res, 500, `슬라이더를 삭제하는데 실패했습니다: ${error.message}`);
  }
};

module.exports = {
  getHeroSliders,
  getAllSliders,
  getHeroSliderDetail,
  postHeroSlider,
  putHeroSlider,
  deleteHeroSliderById,
};

