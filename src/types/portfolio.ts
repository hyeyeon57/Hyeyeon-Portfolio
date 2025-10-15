export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  category: string;
  tags: string[];
  year: string;
  role: string;
  duration: string;
  isFeatured: boolean;
  images: string[];
  features: string[];
  challenges?: string;
  solution?: string;
  results?: string;
  link?: string;
  github?: string;
}

export interface Education {
  school: string;
  degree: string;
  field: string;
  period: string;
  description?: string;
}

export interface Experience {
  company: string;
  position: string;
  period: string;
  description: string[];
  achievements?: string[];
}

export interface Skill {
  category: string;
  tools: {
    name: string;
    level: number; // 1-5
    icon?: string;
  }[];
}

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone?: string;
  location?: string;
  bio: string;
  avatar: string;
  social?: {
    github?: string;
    linkedin?: string;
    behance?: string;
    instagram?: string;
  };
}



