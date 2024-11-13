import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TopProjects from './components/TopProjects';
import ProjectsTable from './components/ProjectsTable';
import { calculateProjectScore } from './utils/scoring';
import type { Project } from './types';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          'https://sonarcloud.io/api/components/search_projects',
          {
            params: {
              organization: 'studio-23-xyz',
              ps: 100,
            },
          }
        );
        
        const projectsWithMeasures = await Promise.all(
          response.data.components.map(async (project: Project) => {
            const measuresResponse = await axios.get(
              'https://sonarcloud.io/api/measures/component',
              {
                params: {
                  component: project.key,
                  metricKeys: 'bugs,vulnerabilities,code_smells,coverage,duplicated_lines_density,ncloc,reliability_rating,security_rating,sqale_rating,sqale_index,complexity',
                },
              }
            );
            
            const measures = measuresResponse.data.component.measures.reduce(
              (acc: any, measure: any) => ({
                ...acc,
                [measure.metric]: measure.value,
              }),
              {}
            );
            
            return calculateProjectScore({
              ...project,
              measures,
            });
          })
        );

        setProjects(projectsWithMeasures);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch projects');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="flex items-center space-x-6 mb-6 md:mb-0">
            <img 
              src="https://cdn.baseline.is/static/content/logos/CmpiZrcBVWQnEYx5qnwpwz-Learnathon_logo_Blue.png"
              alt="Learnathon Logo"
              className="h-16 object-contain"
            />
            <div>
              <h1 className="text-4xl font-bold text-primary-navy">Learnathon 3.0 Leaderboard</h1>
              <p className="text-primary-dark/80 text-lg">Project Quality Metrics & Rankings</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-primary-dark/60">Last updated</p>
            <p className="text-primary-dark font-medium">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <TopProjects projects={projects} />
        <ProjectsTable projects={projects} />
      </div>
    </div>
  );
}

export default App;