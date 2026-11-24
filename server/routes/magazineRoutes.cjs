const express = require('express');
const router = express.Router();
const Magazine = require('../models/Magazine.cjs');

const DEFAULT_MAGAZINES = [
  {
    slug: 'yogiyo-retro',
    date: '2025.03.18',
    readTime: '4 min read',
    projectTag: '요기요 앱 리뉴얼',
    title: '주문 여정의 이탈 지점을 다시 설계하며 — 요기요 앱 UX 리뉴얼 회고',
    subtitle: '복잡한 탐색 구조를 덜어내고, 주문까지의 판단 피로를 줄이기 위한 리뉴얼 기록',
    excerpt:
      '배달 앱에서 사용자가 메뉴를 고르고 결제까지 도달하는 과정은 생각보다 많은 판단 피로를 동반합니다. 이번 리뉴얼에서는 정보 탐색과 옵션 선택 흐름을 단순화하며, 기획자가 데이터를 어떻게 화면 구조로 번역해야 하는지 깊이 고민했습니다.',
    image: '/projects/yogiyo.png',
    tags: ['UX/UI 리뉴얼', '주문 여정', '정보구조(IA)', '모바일 앱'],
    sections: [
      {
        heading: '1. 문제의 발견 — 왜 사용자는 홈에서 망설일까?',
        body: [
          '요기요 앱을 분석하면서 가장 먼저 눈에 띈 것은 홈 화면부터 장바구니 진입까지의 인지 부하였다. 프로모션 배너, 카테고리 아이콘, 추천 매장 영역이 한 화면에 혼재되어 있어 사용자가 원하는 매장을 빠르게 좁혀가기 어려웠다.',
          '특히 배달 앱은 배고픈 상태에서 짧은 시간 안에 결정을 내려야 하는 서비스이기 때문에, 작은 탐색 마찰도 곧바로 이탈로 이어진다는 점이 핵심 문제였다.',
        ],
      },
      {
        heading: '2. 해결 전략 — 두 가지 핵심 과업으로 재정의하기',
        body: [
          '사용자 인터뷰와 여정 지도를 바탕으로 핵심 과업을 "빠른 재주문"과 "조건별 탐색" 두 가지로 재정의했다. 홈 상단의 정보 위계를 정리하고, 자주 사용하는 필터와 할인 혜택 정보를 직관적으로 재배치하는 데 집중했다.',
          '메뉴 상세 및 옵션 선택 화면에서도 필수/선택 옵션을 시각적으로 명확히 구분해 결제 전 오입력을 줄이고자 했다.',
        ],
      },
      {
        heading: '3. 회고 — 덜어내는 기획의 힘',
        body: [
          '이번 프로젝트를 통해 화면을 화려하게 채우는 것보다, 사용자가 망설이는 순간을 정확히 짚어내고 불필요한 선택지를 덜어내는 과정이 UX 기획의 본질이라는 점을 다시 한번 체감했다.',
        ],
      },
    ],
    takeaways: [
      '탐색과 재주문이라는 두 가지 핵심 과업 중심의 홈 구조 재편',
      '혜택·배달비 등 의사결정 핵심 정보의 시각적 위계 강화',
      '옵션 선택부터 결제까지의 흐름 단순화로 인지 부하 감소',
    ],
    order: 0,
  },
  {
    slug: 'srt-retro',
    date: '2025.12.17',
    readTime: '5 min read',
    projectTag: 'SRT 승차권 예매 개선',
    title: '예매 단계를 7단계에서 4단계로 줄이기까지 — SRT FO·BO 화면설계 회고',
    subtitle: '프론트 예매 UX와 백오피스 운영 정책을 함께 설계하며 배운 서비스 구조화',
    excerpt:
      '기차표 예매는 시간 압박 속에서 이뤄지는 대표적인 과업입니다. FO 화면뿐만 아니라 관리자(BO) 정책까지 함께 설계하면서, 프론트 UX와 백오피스 운영 구조가 어떻게 맞물려 돌아가는지 몸소 배운 프로젝트였습니다.',
    image: '/projects/1765325614531_SRT표지.jpg',
    tags: ['화면설계서(SB)', 'FO/BO 기획', '프로세스 최적화', 'IA'],
    sections: [
      {
        heading: '1. 배경 — 7단계 예매 흐름의 병목',
        body: [
          'SRT 승차권 예매 개선 프로젝트에서는 기존 7단계에 걸쳐 분산되어 있던 조회·열차 선택·좌석 선택·결제 흐름을 4단계로 압축하는 것을 목표로 삼았다.',
          '출발 직전 급하게 표를 예매하는 사용자일수록 페이지 전환 횟수가 많아질수록 실수가 잦고 이탈률이 높아졌다.',
        ],
      },
      {
        heading: '2. FO와 BO를 함께 바라보는 시야',
        body: [
          '단순히 화면 수만 줄이는 것이 아니라, 매진·예약 대기·할인 적용 같은 예외 케이스와 관리자(BO)에서 제어해야 하는 정책까지 IA와 화면설계서(SB)에 빈틈없이 담아내는 과정이 가장 큰 도전이었다.',
          '개발자와 디자이너가 같은 그림을 보며 협업할 수 있도록 정책 정의와 디스크립션을 일관된 규칙으로 구조화했다.',
        ],
      },
      {
        heading: '3. 회고 — 문서가 곧 협업의 언어다',
        body: [
          'FO 화면 뒤편에 있는 데이터 흐름과 운영 정책을 함께 설계해 본 경험이 이후 실무 기획에서 개발·디자인 팀과 원활하게 소통하는 탄탄한 밑거름이 되었다.',
        ],
      },
    ],
    takeaways: [
      '예매 프로세스 7단계 → 4단계 단축으로 과업 완료 속도 개선',
      'FO 사용자 화면과 BO 관리자 정책의 유기적 연결 설계',
      '예외 케이스와 상태값을 명확히 정의한 실무형 화면설계서 작성',
    ],
    order: 1,
  },
  {
    slug: 'millie-retro',
    date: '2024.11.05',
    readTime: '4 min read',
    projectTag: '밀리의 서재 사용성 개선',
    title: '아이트래킹 시선 데이터로 찾아낸 책장 UX — 밀리의 서재 개선 회고',
    subtitle: '정성 인터뷰를 넘어 시선 추적 데이터로 과업 성공률 60% → 96%를 만든 과정',
    excerpt:
      '설문이나 인터뷰만으로는 사용자가 실제로 어디서 시선을 멈추고 헤매는지 놓치기 쉽습니다. Tobii Pro 아이트래킹 실험을 통해 책장 관리 성공률을 60%에서 96%로 끌어올린 검증 과정을 기록했습니다.',
    image: '/projects/millie.jpg',
    tags: ['아이트래킹', 'UT 검증', '데이터 기반 UX', '사용성 개선'],
    sections: [
      {
        heading: '1. 말로 설명되지 않는 불편함',
        body: [
          '밀리의 서재 사용자들은 "내 서재"에서 책을 분류하고 관리하는 기능에 대해 막연한 불편함을 호소했지만, 정확히 어느 지점에서 막히는지 말로 설명하지 못하는 경우가 많았다.',
        ],
      },
      {
        heading: '2. Tobii Pro 아이트래킹으로 확인한 시선 경로',
        body: [
          '아이트래킹 히트맵과 시선 경로(Gaze Plot)를 분석한 결과, 편집 진입 버튼의 시각적 위계가 약하고 책장 계층 구조가 직관적이지 않아 사용자의 시선이 반복적으로 흩어지는 패턴을 발견했다.',
          '이 데이터를 근거로 편집 동선과 책장 이동 인터랙션을 재설계했다.',
        ],
      },
      {
        heading: '3. 회고 — 데이터로 설득하는 기획자',
        body: [
          '2차 검증 실험에서 과업 성공률이 60%에서 96%로 크게 향상되었다. 직감이 아닌 객관적 근거로 문제를 증명하고 해결했을 때의 설득력을 몸소 느낀 프로젝트였다.',
        ],
      },
    ],
    takeaways: [
      '정성 인터뷰와 아이트래킹 정량 데이터를 결합한 문제 정의',
      '시선 분산 원인을 제거한 책장 편집 UI 위계 재설계',
      '2차 UT 검증을 통한 과업 성공률 60% → 96% 개선 입증',
    ],
    order: 2,
  },
  {
    slug: 'artlang-retro',
    date: '2024.09.20',
    readTime: '4 min read',
    projectTag: 'ART-LANG 졸업전시',
    title: '신진 작가와 관객을 잇는 온라인 전시 플랫폼 — ART-LANG 기획 회고',
    subtitle: '기획부터 졸업전시 부스 운영까지, 사용자의 손끝에서 완성된 서비스',
    excerpt:
      '오프라인 전시의 공간적 제약을 넘어, 한 손에 담기는 나만의 전시회를 만들고 싶었습니다. 기획부터 졸업전시 부스 운영까지 팀을 리딩하며 사용자 피드백을 현장에서 직접 들었던 소중한 기록입니다.',
    image: '/projects/artrang.jpg',
    tags: ['졸업전시', '신규 서비스 기획', '팀 리딩', '플랫폼'],
    sections: [
      {
        heading: '1. 기획 의도 — 한 손에 담기는 나만의 전시회',
        body: [
          'ART-LANG은 신진 작가에게는 작품 홍보의 기회를, 아트슈머에게는 취향 기반 전시 탐색 경험을 제공하는 온라인 전시 플랫폼으로 기획했다.',
        ],
      },
      {
        heading: '2. 팀 리딩과 오프라인 전시 경험',
        body: [
          '졸업전시 프로젝트로 진행하면서 초기 아이디어 발산부터 서비스 정책 수립, 프로토타입 제작, 오프라인 전시 부스 연출까지 전 과정을 팀원들과 함께 호흡하며 완성했다.',
          '일정과 산출물을 조율하며 각자의 강점이 결과물에 녹아들도록 커뮤니케이션하는 법을 배웠다.',
        ],
      },
      {
        heading: '3. 회고 — 사용자의 반응 속에서 완성되는 기획',
        body: [
          '전시장에서 관람객들이 직접 서비스를 써보며 건넨 생생한 피드백을 통해, 기획은 문서에서 끝나는 것이 아니라 사용자의 실제 경험 속에서 비로소 완성된다는 것을 깊이 배웠다.',
        ],
      },
    ],
    takeaways: [
      '신진 작가와 관람객 양면의 니즈를 연결한 신규 플랫폼 기획',
      '기획·디자인·개발 및 오프라인 전시 부스까지 End-to-End 리딩',
      '현장 관람객 피드백 수집을 통한 실사용자 관점 검증',
    ],
    order: 3,
  },
];

async function ensureSeeded() {
  const count = await Magazine.countDocuments();
  if (count === 0) {
    await Magazine.insertMany(DEFAULT_MAGAZINES);
  }
}

const normalize = (doc) => ({
  id: doc.slug || String(doc._id),
  _id: String(doc._id),
  slug: doc.slug,
  date: doc.date || '',
  readTime: doc.readTime || '4 min read',
  projectTag: doc.projectTag || '',
  title: doc.title,
  subtitle: doc.subtitle || '',
  excerpt: doc.excerpt || '',
  image: doc.image || '',
  tags: Array.isArray(doc.tags) ? doc.tags : [],
  sections: Array.isArray(doc.sections) ? doc.sections : [],
  takeaways: Array.isArray(doc.takeaways) ? doc.takeaways : [],
  order: doc.order ?? 0,
});

// 목록 조회
router.get('/', async (req, res) => {
  try {
    await ensureSeeded();
    const list = await Magazine.find().sort({ order: 1, createdAt: -1 }).lean();
    res.json({ success: true, data: list.map(normalize) });
  } catch (error) {
    console.error('[magazineRoutes] GET / error:', error);
    res.status(500).json({ success: false, message: '매거진 목록을 불러오지 못했습니다.' });
  }
});

// 단건 조회 (slug 또는 _id)
router.get('/:id', async (req, res) => {
  try {
    await ensureSeeded();
    const { id } = req.params;
    let doc = await Magazine.findOne({ slug: id }).lean();
    if (!doc && id.match(/^[0-9a-fA-F]{24}$/)) {
      doc = await Magazine.findById(id).lean();
    }
    if (!doc) {
      return res.status(404).json({ success: false, message: '매거진 글을 찾을 수 없습니다.' });
    }
    res.json({ success: true, data: normalize(doc) });
  } catch (error) {
    console.error('[magazineRoutes] GET /:id error:', error);
    res.status(500).json({ success: false, message: '매거진 글을 불러오지 못했습니다.' });
  }
});

// 생성
router.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    const slug =
      (body.slug && String(body.slug).trim()) ||
      `post-${Date.now()}`;
    const created = await Magazine.create({
      slug,
      date: body.date || new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      readTime: body.readTime || '4 min read',
      projectTag: body.projectTag || '',
      title: body.title || '제목 없음',
      subtitle: body.subtitle || '',
      excerpt: body.excerpt || '',
      image: body.image || '',
      tags: Array.isArray(body.tags) ? body.tags : [],
      sections: Array.isArray(body.sections) ? body.sections : [],
      takeaways: Array.isArray(body.takeaways) ? body.takeaways : [],
      order: typeof body.order === 'number' ? body.order : 0,
    });
    res.status(201).json({ success: true, data: normalize(created.toObject()) });
  } catch (error) {
    console.error('[magazineRoutes] POST / error:', error);
    res.status(500).json({ success: false, message: '매거진 글 생성에 실패했습니다.' });
  }
});

// 수정
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const filter = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };
    const updated = await Magazine.findOneAndUpdate(
      filter,
      {
        $set: {
          date: body.date,
          readTime: body.readTime,
          projectTag: body.projectTag,
          title: body.title,
          subtitle: body.subtitle,
          excerpt: body.excerpt,
          image: body.image,
          tags: Array.isArray(body.tags) ? body.tags : [],
          sections: Array.isArray(body.sections) ? body.sections : [],
          takeaways: Array.isArray(body.takeaways) ? body.takeaways : [],
          order: typeof body.order === 'number' ? body.order : 0,
        },
      },
      { new: true }
    ).lean();
    if (!updated) {
      return res.status(404).json({ success: false, message: '매거진 글을 찾을 수 없습니다.' });
    }
    res.json({ success: true, data: normalize(updated) });
  } catch (error) {
    console.error('[magazineRoutes] PUT /:id error:', error);
    res.status(500).json({ success: false, message: '매거진 글 수정에 실패했습니다.' });
  }
});

// 삭제
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const filter = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };
    const deleted = await Magazine.findOneAndDelete(filter).lean();
    if (!deleted) {
      return res.status(404).json({ success: false, message: '매거진 글을 찾을 수 없습니다.' });
    }
    res.json({ success: true, message: '삭제되었습니다.' });
  } catch (error) {
    console.error('[magazineRoutes] DELETE /:id error:', error);
    res.status(500).json({ success: false, message: '매거진 글 삭제에 실패했습니다.' });
  }
});

module.exports = router;
