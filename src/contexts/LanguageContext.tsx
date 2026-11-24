'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ko' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 번역 데이터
const translations = {
  ko: {
    // Navigation
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.careers': 'Careers',
    'nav.contact': 'Contact',
    
    // Hero Section
    'hero.question': '장혜연은 어떤 기획자인가?',
    'hero.line1': '막다른 길에서도',
    'hero.line2': '또 다른 경로를 찾아내는',
    'hero.line3': '내비게이션 같은 기획자',
    'hero.resume': '이력서 다운로드',
    'hero.coverLetter': '자기소개서 다운로드',
    
    // Projects Section
    'projects.label': 'Projects',
    'projects.title': '',
    'projects.description': '신규 서비스 구축부터 앱·웹 사용성 개선까지\n사용자 경험과 비즈니스 가치를 함께 고민한 프로젝트들을 담았습니다.',
    'projects.viewAll': '전체 프로젝트 보기',
    
    // Experience Section
    'experience.label': '나의 이력',
    'experience.title': '',
    'experience.description': '문제를 정확히 포착하고 해결책을 구조화하는\nQA 직무 경험에서는 {analysis}을, 기획 동아리에서는 {planning}을, 매장 근무에서는 {userCentric}을 길렀습니다.',
    'experience.analysis': '분석력',
    'experience.planning': '기획력',
    'experience.userCentric': '사용자 중심 사고와 대응력',
    'experience.tab.experience': '경력',
    'experience.tab.education': '학력',
    'experience.achievements': '주요 성과',
    
    // Skills Section
    'skills.label': 'Tool Skill',
    'skills.title': '',
    'skills.description': '문제를 해결해온 제 기획 역량을 수치화했습니다.\n다양한 도구를 활용한 실전 경험을 통계로 확인하세요.',
    'skills.mainTools': 'Main Tools',
    'skills.auxiliaryTools': '보조 툴',
    'skills.mainToolCount': '전문 툴 활용',
    'skills.averageSkill': '평균 숙련도',
    'skills.experience': 'QA 경험',
    
    // Contact Section
    'contact.label': '연락하기',
    'contact.title': '',
    'contact.description': '프로젝트 제안, 협업 문의, 채용 관련 연락 모두 환영합니다.\n궁금한 점이나 간단한 내용 남겨주시면 최대한 빠르게 답변 드리겠습니다.',
    'contact.sendMessage': '메시지 보내기',
    'contact.formDescription': '아래 양식을 작성해주시면 빠르게 연락드리겠습니다.',
    'contact.name': '이름',
    'contact.email': '이메일',
    'contact.message': '메시지',
    'contact.send': '메시지 보내기',
    'contact.sending': '전송 중...',
    'contact.success': '메시지 전송 완료!',
    'contact.successDescription': '메시지를 성공적으로 보냈습니다.\n빠른 시일 내에 연락드리겠습니다.',
    'contact.required': '* 필수 입력 항목입니다',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.careers': 'Careers',
    'nav.contact': 'Contact',
    
    // Hero Section
    'hero.question': 'Who is Janghyeyeon as a planner?',
    'hero.line1': 'Even in dead-end situations,',
    'hero.line2': 'I find alternative paths -',
    'hero.line3': 'A planner like a navigation system',
    'hero.resume': 'Download Resume',
    'hero.coverLetter': 'Download Cover Letter',
    
    // Projects Section
    'projects.label': 'Projects',
    'projects.title': '',
    'projects.description': '신규 서비스 구축부터 앱·웹 사용성 개선까지\n사용자 경험과 비즈니스 가치를 함께 고민한 프로젝트들을 담았습니다.',
    'projects.viewAll': 'View All Projects',
    
    // Experience Section
    'experience.label': 'My Experience',
    'experience.title': '',
    'experience.description': 'Accurately identifying problems and structuring solutions\nIn QA roles, I developed {analysis}, in planning clubs, I developed {planning}, and in retail work, I developed {userCentric}.',
    'experience.analysis': 'analytical skills',
    'experience.planning': 'planning skills',
    'experience.userCentric': 'user-centered thinking and responsiveness',
    'experience.tab.experience': 'Experience',
    'experience.tab.education': 'Education',
    'experience.achievements': 'Key Achievements',
    
    // Skills Section
    'skills.label': 'Tool Skill',
    'skills.title': '',
    'skills.description': 'Quantifying my planning capabilities through problem-solving\nCheck out practical experience with various tools in statistics.',
    'skills.mainTools': 'Main Tools',
    'skills.auxiliaryTools': 'Auxiliary Tools',
    'skills.mainToolCount': 'Main Tools',
    'skills.averageSkill': 'Average Proficiency',
    'skills.experience': 'QA Experience',
    
    // Contact Section
    'contact.label': 'Contact',
    'contact.title': '',
    'contact.description': 'All project proposals, collaboration inquiries, and recruitment contacts are welcome\nFeel free to leave any questions or brief messages, and I will respond as quickly as possible.',
    'contact.sendMessage': 'Send Message',
    'contact.formDescription': 'Please fill out the form below and we will contact you promptly.',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.sending': 'Sending...',
    'contact.success': 'Message Sent Successfully!',
    'contact.successDescription': 'Your message has been sent successfully.\nI will contact you as soon as possible.',
    'contact.required': '* Required fields',
  },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ko');

  useEffect(() => {
    // localStorage에서 언어 설정 불러오기
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'ko' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    // HTML lang 속성 업데이트
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.ko] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

