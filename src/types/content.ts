export type Project = {
  slug: string;
  title: string;
  description: string;
  highlights: string[];
  tech: string[];
  repoUrl: string;
  liveUrl?: string;
  featured: boolean;
};

export type ExperienceItem = {
  role: string;
  organization: string;
  period: string;
  bullets: string[];
};

export type Certification = {
  name: string;
  issuer: string;
  year: string;
};
