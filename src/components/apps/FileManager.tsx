import React, { useState, useEffect } from 'react';
import { ExternalLink, Github, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'portfolio_content';

const DEFAULT_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Zyphron - Multi-Language Auto Deployment Platform',
    description: 'Building a Full-stack DevOps Platform that automatically detects, builds, containerizes, and deploys applications across multiple languages (React, Node.js, Python, Java, PHP, Dotnet, etc) using Docker, Nginx, and Terraform. Implemented CI/CD automation, multi-cloud orchestration (AWS, GCP, Oracle Cloud), and caching to reduce build time by 70% and enable one-click deployments. Zyphron supports frontend, backend, and full-stack projects with features like monitoring, log checking, health checkup, and ELK alerts POST deployment.',
    demoUrl: '',
    repoUrl: 'https://github.com/MeghVyas3132/MeghOS-Portfolio',
    tags: ['DevOps', 'CI/CD', 'Docker', 'Terraform', 'Nginx', 'Multi-Cloud', 'AWS', 'GCP', 'Python', 'Node.js', 'React', 'Java'],
  },
];

interface Project {
  id: string;
  title: string;
  description: string;
  demoUrl: string;
  repoUrl: string;
  tags: string[];
}

export const FileManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    loadProjects();
    window.addEventListener('storage', loadProjects);
    return () => window.removeEventListener('storage', loadProjects);
  }, []);

  const loadProjects = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.projects && Array.isArray(data.projects)) {
          setProjects(data.projects);
          return;
        }
      } catch (error) {
        console.error('Failed to parse projects');
      }
    }
    // If no projects in localStorage, show default projects
    setProjects(DEFAULT_PROJECTS);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-4 bg-muted/20">
        <div className="flex items-center gap-3">
          <FolderOpen className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-primary">My Projects</h2>
        </div>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-auto p-6">
        {projects.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4 max-w-md">
              <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto" />
              <h3 className="text-xl font-semibold text-foreground">No Projects Yet</h3>
              <p className="text-sm text-muted-foreground">
                Projects will appear here once added.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="glass-strong rounded-lg p-6 space-y-4 hover:border-primary/50 transition-all animate-fade-in"
              >
                <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
                
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  {project.demoUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => window.open(project.demoUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </Button>
                  )}
                  {project.repoUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => window.open(project.repoUrl, '_blank')}
                    >
                      <Github className="w-4 h-4" />
                      View Code
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
