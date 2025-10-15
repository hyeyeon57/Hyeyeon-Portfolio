export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  fullDescription: string;
  image: string;
  category: string;
  tags: string[];
  date: string;
  role: string;
  duration: string;
  team: string;
  featured: boolean;
  achievements: string[];
  link?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
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
    instagram: string;
    notion: string;
  };
  availableDate: string;
  resumeUrl: string;
  coverLetterUrl: string;
}



