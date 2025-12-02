const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { PROJECT_UPLOAD_DIR, PROJECT_PDF_DIR, IMAGE_UPLOAD_DIR } = require('../utils/pathHelpers.cjs');

const bucket = process.env.S3_BUCKET;
const region = process.env.AWS_REGION || 'ap-northeast-2';
const baseUrl =
  process.env.S3_BASE_URL ||
  (bucket ? `https://${bucket}.s3.${region}.amazonaws.com` : null);
const localBaseUrl = process.env.BACKOFFICE_URL || '';

const isS3Enabled = Boolean(bucket && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);

const s3Client = isS3Enabled
  ? new S3Client({
      region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
  : null;

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const decodeOriginalName = (name) => {
  // 일부 환경에서 latin1로 전달되는 파일명을 UTF-8로 복원
  try {
    const decoded = Buffer.from(name, 'latin1').toString('utf8');
    // 복원 결과에 �(replacement)가 많으면 원본을 그대로 사용
    if (decoded.includes('\uFFFD')) {
      return name;
    }
    return decoded;
  } catch (e) {
    return name;
  }
};

const toSafeName = (name) => decodeOriginalName(name).replace(/\s+/g, '_');

const encodeKey = (key) => key.split('/').map(encodeURIComponent).join('/');

const uploadToS3 = async (file, folder = 'projects') => {
  const key = `${folder}/${Date.now()}_${toSafeName(file.originalname || 'file')}`;
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype || 'application/octet-stream',
      // ACL은 버킷이 ACL 비활성화일 때 AccessControlListNotSupported 오류를 유발하므로 설정하지 않음
    })
  );
  const encodedKey = encodeKey(key);
  return `${baseUrl}/${encodedKey}`;
};

const saveLocally = async (file, folder = 'projects') => {
  const dir = folder.includes('pdf') ? PROJECT_PDF_DIR : (folder.startsWith('img') ? IMAGE_UPLOAD_DIR : PROJECT_UPLOAD_DIR);
  ensureDir(dir);
  const filename = `${Date.now()}_${toSafeName(file.originalname || 'file')}`;
  const filepath = path.join(dir, filename);
  await fs.promises.writeFile(filepath, file.buffer);
  const relativePath = folder.startsWith('img')
    ? `/img/${filename}`
    : `/projects${folder.includes('pdf') ? '/pdfs' : ''}/${filename}`;
  return localBaseUrl ? `${localBaseUrl}${relativePath}` : relativePath;
};

const saveFiles = async (files = [], folder = 'projects') => {
  if (!files.length) return [];
  if (isS3Enabled && s3Client) {
    return Promise.all(files.map((file) => uploadToS3(file, folder)));
  }
  return Promise.all(files.map((file) => saveLocally(file, folder)));
};

module.exports = {
  saveFiles,
  isS3Enabled,
  baseUrl,
};
