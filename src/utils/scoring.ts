import type { Project, ScoringCriteria } from '../types';

export const scoringCriteria: ScoringCriteria = {
  coverage: [
    { range: [90, 100], points: 20 },
    { range: [80, 89], points: 17 },
    { range: [70, 79], points: 14 },
    { range: [60, 69], points: 10 },
    { range: [0, 59], points: 5 },
  ],
  bugs: [
    { range: [0, 1], points: 15 },
    { range: [2, 3], points: 12 },
    { range: [4, 6], points: 9 },
    { range: [7, 10], points: 5 },
    { range: [11, Infinity], points: 2 },
  ],
  vulnerabilities: [
    { range: [0, 0], points: 15 },
    { range: [1, 1], points: 12 },
    { range: [2, 3], points: 9 },
    { range: [4, 5], points: 5 },
    { range: [6, Infinity], points: 2 },
  ],
  codeSmells: [
    { range: [0, 10], points: 20 },
    { range: [11, 25], points: 15 },
    { range: [26, 50], points: 10 },
    { range: [51, 100], points: 5 },
    { range: [101, Infinity], points: 2 },
  ],
  technicalDebt: [
    { range: [0, 5], points: 20 },
    { range: [6, 15], points: 15 },
    { range: [16, 30], points: 10 },
    { range: [31, 50], points: 5 },
    { range: [51, Infinity], points: 2 },
  ],
  complexity: [
    { range: [0, 50], points: 10 },
    { range: [51, 100], points: 8 },
    { range: [101, 200], points: 6 },
    { range: [201, 300], points: 4 },
    { range: [301, Infinity], points: 2 },
  ],
};

const getPoints = (value: number, criteria: Array<{ range: [number, number]; points: number }>) => {
  const match = criteria.find(({ range }) => value >= range[0] && value <= range[1]);
  return match ? match.points : 0;
};

export const calculateProjectScore = (project: Project): Project => {
  const measures = project.measures;
  if (!measures) return project;

  // Convert technical debt from minutes to hours
  const technicalDebtHours = measures.sqale_index ? parseInt(measures.sqale_index) / 60 : 0;

  const score = {
    coverage: getPoints(measures.coverage || 0, scoringCriteria.coverage),
    bugs: getPoints(measures.bugs || 0, scoringCriteria.bugs),
    vulnerabilities: getPoints(measures.vulnerabilities || 0, scoringCriteria.vulnerabilities),
    codeSmells: getPoints(measures.code_smells || 0, scoringCriteria.codeSmells),
    technicalDebt: getPoints(technicalDebtHours, scoringCriteria.technicalDebt),
    complexity: getPoints(measures.complexity || 0, scoringCriteria.complexity),
    total: 0,
  };

  score.total = Object.values(score).reduce((sum, value) => sum + value, 0) - score.total;

  return { ...project, score };
};