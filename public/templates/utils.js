export const truncate = (text = '', len = 320) =>
  text.length > len ? `${text.slice(0, len)}…` : text;

export const categoryLabels = {
  'new': '신규',
  'renewal': '리뉴얼',
  'app': '앱',
  'web': '웹',
  'proposal': '기획안',
  'usability': '사용성평가',
};
