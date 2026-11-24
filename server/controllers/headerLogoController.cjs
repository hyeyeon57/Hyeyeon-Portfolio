const HeaderLogo = require('../models/HeaderLogo.cjs');
const { connectDB } = require('../config/database.cjs');
const { ok, fail } = require('../utils/httpResponse.cjs');
const { PUBLIC_DIR } = require('../utils/pathHelpers.cjs');
const path = require('path');
const fs = require('fs').promises;

/**
 * 헤더 로고 정보 조회
 */
const getHeaderLogo = async (req, res) => {
  try {
    await connectDB();
    
    // 단일 문서 조회 (없으면 null 반환)
    const logo = await HeaderLogo.findOne({});
    
    return ok(res, { 
      data: logo ? {
        url: logo.url,
        fileName: logo.fileName,
        updatedAt: logo.updatedAt,
      } : null,
      message: '헤더 로고 정보를 조회했습니다.' 
    });
  } catch (error) {
    console.error('[headerLogoController] 헤더 로고 조회 실패:', error);
    return fail(res, 500, `헤더 로고 정보를 조회하는데 실패했습니다: ${error.message || '알 수 없는 오류'}`);
  }
};

/**
 * 헤더 로고 업로드/업데이트
 */
const updateHeaderLogo = async (req, res) => {
  try {
    await connectDB();
    
    let url, fileName;
    
    // JSON으로 URL을 받는 경우 (클라이언트에서 uploadFilesToS3로 업로드한 후)
    if (req.headers['content-type']?.includes('application/json')) {
      const body = req.body;
      url = body.url;
      fileName = body.fileName || `logo_${Date.now()}.png`;
      
      if (!url || typeof url !== 'string') {
        return fail(res, 400, 'URL이 제공되지 않았습니다.');
      }
      
      console.log('[headerLogoController] JSON으로 URL 받음:', { url, fileName });
    } else {
      // 기존 방식: multer로 파일을 받는 경우
      const file = req.file;
      
      if (!file) {
        return fail(res, 400, '파일이 업로드되지 않았습니다.');
      }
      
      // 이미지 파일만 허용
      if (!file.mimetype.startsWith('image/')) {
        return fail(res, 400, '이미지 파일만 업로드 가능합니다.');
      }
      
      // 로컬 환경에서만 파일 시스템에 저장
      if (process.env.VERCEL) {
        return fail(res, 400, 'Vercel 환경에서는 파일 업로드가 지원되지 않습니다. Vercel Blob Storage 또는 S3를 사용해주세요.');
      }
      
      const logoDir = path.join(PUBLIC_DIR, 'logo');
      try {
        await fs.mkdir(logoDir, { recursive: true });
      } catch (mkdirError) {
        console.warn('[headerLogoController] 폴더 생성 실패 (무시):', mkdirError?.message);
      }
      
      // 기존 로고 파일 삭제
      const existingLogo = await HeaderLogo.findOne({});
      if (existingLogo && existingLogo.url && !existingLogo.url.startsWith('http')) {
        const oldFilePath = path.join(PUBLIC_DIR, existingLogo.url.replace(/^\//, ''));
        try {
          await fs.unlink(oldFilePath);
        } catch (unlinkError) {
          console.warn('[headerLogoController] 기존 파일 삭제 실패 (무시):', unlinkError?.message);
        }
      }
      
      // 새 파일 저장
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileNameWithExt = uniqueSuffix + path.extname(file.originalname);
      const filePath = path.join(logoDir, fileNameWithExt);
      
      await fs.writeFile(filePath, file.buffer || await fs.readFile(file.path));
      
      // 임시 파일 삭제 (diskStorage 사용 시)
      if (file.path && file.path !== filePath) {
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.warn('[headerLogoController] 임시 파일 삭제 실패 (무시):', unlinkError?.message);
        }
      }
      
      url = `/logo/${fileNameWithExt}`;
      fileName = file.originalname;
    }
    
    // 기존 로고가 있으면 업데이트, 없으면 생성
    const existingLogo = await HeaderLogo.findOne({});
    
    if (existingLogo) {
      existingLogo.url = url;
      existingLogo.fileName = fileName;
      existingLogo.updatedAt = new Date();
      await existingLogo.save();
      console.log('[headerLogoController] 헤더 로고 업데이트 완료:', { url, fileName });
    } else {
      const newLogo = new HeaderLogo({
        url,
        fileName,
      });
      await newLogo.save();
      console.log('[headerLogoController] 헤더 로고 생성 완료:', { url, fileName });
    }
    
    return ok(res, { 
      data: { url, fileName },
      message: '헤더 로고가 업로드되었습니다.' 
    });
  } catch (error) {
    console.error('[headerLogoController] 헤더 로고 업로드 실패:', error);
    return fail(res, 500, `헤더 로고 업로드에 실패했습니다: ${error.message || '알 수 없는 오류'}`);
  }
};

/**
 * 헤더 로고 삭제
 */
const deleteHeaderLogo = async (req, res) => {
  try {
    await connectDB();
    
    const logo = await HeaderLogo.findOne({});
    
    if (!logo) {
      return fail(res, 404, '헤더 로고가 존재하지 않습니다.');
    }
    
    // 파일 삭제 (로컬 환경에서만)
    if (!process.env.VERCEL && logo.url && !logo.url.startsWith('http')) {
      const filePath = path.join(PUBLIC_DIR, logo.url.replace(/^\//, ''));
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.warn('[headerLogoController] 파일 삭제 실패 (무시):', unlinkError?.message);
      }
    }
    
    await HeaderLogo.deleteOne({ _id: logo._id });
    
    return ok(res, { message: '헤더 로고가 삭제되었습니다.' });
  } catch (error) {
    console.error('[headerLogoController] 헤더 로고 삭제 실패:', error);
    return fail(res, 500, `헤더 로고 삭제에 실패했습니다: ${error.message || '알 수 없는 오류'}`);
  }
};

module.exports = {
  getHeaderLogo,
  updateHeaderLogo,
  deleteHeaderLogo,
};

