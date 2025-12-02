const { ok, fail } = require('../utils/httpResponse.cjs');
const { saveFiles } = require('../services/storageService.cjs');

const decodeOriginalName = (name) => {
  try {
    return Buffer.from(name, 'latin1').toString('utf8');
  } catch (e) {
    return name;
  }
};

const uploadPdfHandler = async (req, res) => {
  if (!req.file) {
    return fail(res, 400, 'PDF 파일이 업로드되지 않았습니다.');
  }

  const decodedName = decodeOriginalName(req.file.originalname || 'file.pdf');
  req.file.originalname = decodedName;
  const [url] = await saveFiles([req.file], 'projects/pdfs');

  return ok(res, {
    path: url,
    filename: decodedName,
    message: 'PDF 파일이 업로드되었습니다.',
  });
};

module.exports = { uploadPdfHandler };
