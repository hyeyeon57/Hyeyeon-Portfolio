import type { NextApiRequest, NextApiResponse } from 'next';

const { generatePresignedUrls, isS3Enabled } = require('../../../server/services/storageService.cjs');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // S3가 활성화되지 않은 경우
    if (!isS3Enabled) {
      return res.status(400).json({
        error: 'S3가 활성화되지 않았습니다. 로컬 환경에서는 사용할 수 없습니다.',
      });
    }

    const { files, folder = 'projects' } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: '파일 정보가 필요합니다' });
    }

    // 각 파일에 대해 filename과 contentType이 있는지 확인
    for (const file of files) {
      if (!file.filename || !file.contentType) {
        return res.status(400).json({
          error: '각 파일에는 filename과 contentType이 필요합니다',
        });
      }
    }

    const presignedUrls = await generatePresignedUrls(files, folder);

    return res.status(200).json({
      success: true,
      data: presignedUrls,
    });
  } catch (error: any) {
    console.error('Presigned URL 생성 오류:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Presigned URL 생성 실패',
    });
  }
}
