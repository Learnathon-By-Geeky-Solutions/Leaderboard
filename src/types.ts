export interface Project {
  key: string;
  name: string;
  qualifier: string;
  visibility: string;
  lastAnalysisDate?: string;
  measures?: {
    bugs?: number;
    vulnerabilities?: number;
    code_smells?: number;
    coverage?: number;
    duplicated_lines_density?: number;
    ncloc?: number;
    reliability_rating?: string;
    security_rating?: string;
    sqale_rating?: string;
    sqale_index?: string;
    complexity?: number;
  };
  score?: {
    total: number;
    coverage: number;
    bugs: number;
    vulnerabilities: number;
    codeSmells: number;
    technicalDebt: number;
    complexity: number;
  };
}

export interface ScoringCriteria {
  coverage: Array<{ range: [number, number]; points: number; }>;
  bugs: Array<{ range: [number, number]; points: number; }>;
  vulnerabilities: Array<{ range: [number, number]; points: number; }>;
  codeSmells: Array<{ range: [number, number]; points: number; }>;
  technicalDebt: Array<{ range: [number, number]; points: number; }>;
  complexity: Array<{ range: [number, number]; points: number; }>;
}