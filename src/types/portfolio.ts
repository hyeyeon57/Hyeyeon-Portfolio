import type { CategoryId } from '@/constants/categories';

/**
 * 프로젝트 인터페이스
 * - MongoDB 스키마(server/models/Project.cjs)와 완전히 일치
 */
export interface Project {
  // 기본 정보
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  fullDescription?: string;

  // 미디어
  image?: string;
  gallery?: string[];

  // 메타데이터
  category: CategoryId;
  tags: string[];
  date?: string;
  role?: string;
  duration?: string;
  team?: string;

  // 성과 및 회고
  achievements: string[];
  retrospective?: string;

  // 링크 및 파일
  link?: string;
  designLink?: string;
  figmaLink?: string;
  designFile?: string;
  designPdf?: string;
  detailPdf?: string;
  previewPdf?: string;

  // 대표 프로젝트 여부
  featured: boolean;

  // 시스템 필드 (MongoDB timestamps)
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field?: string;
  period: string;
  description: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  period: string;
  description: string;
  achievements: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  description: string;
}

export interface PersonalInfo {
  name: string;
  englishName: string;
  title: string;
  bio: string;
  description: string;
  email: string;
  phone: string;
  location: string;
  social: {
    github: string;
    linkedin: string;
    brunch: string;
    notion: string;
  };
  availableDate: string;
  resumeUrl: string | null;
  coverLetterUrl: string | null;
}



