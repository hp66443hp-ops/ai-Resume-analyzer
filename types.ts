
export interface User {
  email: string;
  name: string;
  role: 'company' | 'candidate';
  password?: string;
}

export interface Company extends User {
  role: 'company';
  website: string;
}

export interface Candidate extends User {
  role: 'candidate';
  linkedin: string;
  defaultResume: File;
}

export interface Applicant {
  name: string;
  email: string;
  linkedin: string;
  salaryExpectation: string;
  coverLetter: string;
  screeningAnswer: string;
  resumeFile: string;
}

export interface JobPosting {
  id: number;
  title: string;
  location: string;
  applicants: Applicant[];
  date: string;
  companyName: string;
  description: string;
}

export interface AnalyzedCandidateContact {
  email: string;
  phone: string;
}

export interface AnalyzedCandidate {
  name: string;
  role: string;
  matchScore: number;
  contact: AnalyzedCandidateContact;
  linkedin: string;
  summary: string;
  matchedRequirements: string[];
  missingRequirements: string[];
}

export interface AnalysisResult {
  candidates: AnalyzedCandidate[];
  overallSuggestions: string[];
}
