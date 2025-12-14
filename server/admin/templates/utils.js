export const truncate = (text = '', len = 320) =>
  text.length > len ? `${text.slice(0, len)}…` : text;

export const categoryLabels = {
  'new': '신규',
  'renewal': '리뉴얼',
  'proposal': '제안서',
  'design': '화면설계서',
  'etc': '기타',
};
