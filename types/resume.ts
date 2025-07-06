export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  website?: string
  linkedin?: string
  summary: string
}

export interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  location: string
  startDate: string
  endDate: string
  gpa?: string
}

export interface Skill {
  id: string
  name: string
  category: string
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  url?: string
  github?: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  url?: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  certifications: Certification[]
}

export interface ATSScore {
  overall: number
  keywordMatch: number
  formatting: number
  sections: number
  readability: number
  suggestions: string[]
  matchedKeywords: string[]
  missingKeywords: string[]
  templateScore: number
}

export interface TemplateATSRating {
  id: string
  name: string
  atsScore: number
  pros: string[]
  cons: string[]
  bestFor: string[]
}
