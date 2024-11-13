import React from 'react';
import type { Project } from '../types';

interface ScoreBreakdownProps {
  score: NonNullable<Project['score']>;
}

const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ score }) => {
  const categories = [
    { name: 'Coverage', score: score.coverage, max: 20 },
    { name: 'Bugs', score: score.bugs, max: 15 },
    { name: 'Vulnerabilities', score: score.vulnerabilities, max: 15 },
    { name: 'Code Smells', score: score.codeSmells, max: 20 },
    { name: 'Technical Debt', score: score.technicalDebt, max: 20 },
    { name: 'Complexity', score: score.complexity, max: 10 },
  ];

  return (
    <div className="space-y-2">
      {categories.map(category => (
        <div key={category.name} className="flex items-center gap-2">
          <span className="text-sm text-primary-dark/70 w-32">{category.name}</span>
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-blue rounded-full transition-all duration-300"
              style={{ width: `${(category.score / category.max) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium w-16 text-right text-primary-dark">
            {category.score}/{category.max}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ScoreBreakdown;