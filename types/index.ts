export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  category: "react" | "nextjs" | "typescript";
  image: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime: number;
  content: string;
}

export interface Skill {
  name: string;
  level: number;
  category: "frontend" | "uiux" | "tools";
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  technologies: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
}

export interface Service {
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface NavLink {
  label: string;
  href: string;
}
