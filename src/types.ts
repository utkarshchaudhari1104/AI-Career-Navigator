export type Proficiency = 'Beginner' | 'Intermediate' | 'Advanced';
export type ExperienceType = 'Internship' | 'Project' | 'Certification' | 'Hackathon' | 'Achievement';
export type RoleMode = 'Remote' | 'Hybrid' | 'On-site';
export type WorkPreference = 'Job' | 'Higher Studies' | 'Both';

export interface Skill {
  name: string;
  proficiency: Proficiency;
}

export interface ExperienceItem {
  type: ExperienceType;
  title: string;
  summary: string;
  details?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  email: string;
  college: string;
  degree: string;
  branch: string;
  currentYear: string;
  graduationYear: number;
  cgpa: number;
  skills: Skill[];
  interests: string[];
  experience: ExperienceItem[];
  careerPreferences: {
    preferredRole: string;
    preferredIndustry: string;
    preferredLocation: string;
    workMode: RoleMode;
    salaryRange: string;
    companySize: string;
    higherStudiesOrJob: WorkPreference;
  };
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'multiple' | 'rating' | 'skill';
  options?: string[];
  min?: number;
  max?: number;
}

export interface AssessmentAnswer {
  questionId: string;
  answer: string | number;
}

export interface Career {
  id: string;
  title: string;
  category: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  salaryRange: string;
  growth: string;
  requiredSkills: string[];
  softSkills: string[];
  responsibilities: string[];
  education: string;
  tools: string[];
  relatedRoles: string[];
  certifications: string[];
  projects: string[];
  companies: string[];
  learningResources: string[];
  roadmap: {
    beginner: string[];
    intermediate: string[];
    advanced: string[];
  };
}

export interface CareerRecommendation {
  careerId: string;
  careerName: string;
  match: number;
  whyItMatches: string;
  requiredSkills: string[];
  existingSkills: string[];
  missingSkills: string[];
  roadmap: string[];
  responsibilities: string[];
  futureGrowth: string;
  relatedRoles: string[];
}

export interface SkillGapItem {
  name: string;
  current: string;
  required: string;
  status: 'Strong' | 'Good' | 'Needs Improvement' | 'Missing';
}

export interface SkillGapSummary {
  score: number;
  strongSkills: string[];
  improvingSkills: string[];
  missingSkills: string[];
  gapItems: SkillGapItem[];
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  roles: string[];
  requiredSkills: string[];
  match: number;
  experienceLevel: string;
  location: string;
  description: string;
  ctc: string;
  hiringRounds: string[];
  benefits: string[];
  applicationUrl: string;
}

export interface JobListing {
  id: string;
  title: string;
  type: 'Internship' | 'Full-time';
  location: string;
  mode: RoleMode;
  career: string;
  company: string;
  skills: string[];
  experience: string;
  salary: string;
  description: string;
}

export interface LearningPhase {
  phase: string;
  title: string;
  topics: string[];
  resources: string[];
  projects: string[];
  time: string;
  completed: boolean;
}

export interface RoadmapProgress {
  careerId: string;
  phases: LearningPhase[];
}

export interface CareerDashboard {
  readinessScore: number;
  profileCompletion: number;
  topCareer: string;
  topMatch: number;
  skillCount: number;
  skillsToImprove: string[];
  learningProgress: number;
}
