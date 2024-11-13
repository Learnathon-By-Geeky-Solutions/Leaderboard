import React from 'react';
import { Trophy, Medal } from 'lucide-react';
import type { Project } from '../types';
import ScoreBreakdown from './ScoreBreakdown';

interface TopProjectsProps {
  projects: Project[];
}

const TopProjects: React.FC<TopProjectsProps> = ({ projects }) => {
  const topThree = projects
    .sort((a, b) => (b.score?.total || 0) - (a.score?.total || 0))
    .slice(0, 3);

  const medals = [
    { icon: Trophy, color: 'text-yellow-500', bgColor: 'bg-primary-blue/5' },
    { icon: Medal, color: 'text-gray-400', bgColor: 'bg-primary-navy/5' },
    { icon: Medal, color: 'text-amber-600', bgColor: 'bg-primary-dark/5' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {topThree.map((project, index) => {
        const Icon = medals[index].icon;
        return (
          <div
            key={project.key}
            className={`${medals[index].bgColor} rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <Icon className={`w-8 h-8 ${medals[index].color}`} />
              <div className="text-right">
                <span className="text-2xl font-bold text-primary-blue">#{index + 1}</span>
                <div className="text-sm font-medium text-primary-dark/70">
                  {project.score?.total}/100 points
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-primary-navy mb-4">{project.name}</h3>
            {project.score && <ScoreBreakdown score={project.score} />}
          </div>
        );
      })}
    </div>
  );
};

export default TopProjects;