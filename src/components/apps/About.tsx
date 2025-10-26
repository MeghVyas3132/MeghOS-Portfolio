import React, { useEffect, useState } from 'react';
import { User, Briefcase, Code, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'portfolio_content';

export const About: React.FC = () => {
  const [content, setContent] = useState({
    name: 'DevOps Engineer',
    role: 'Site Reliability Engineer',
    about: 'Experienced DevOps/SRE professional specializing in container orchestration, CI/CD pipelines, and cloud infrastructure.',
    skills: 'Docker, Kubernetes, Linux, Terraform, Ansible, Jenkins, GitLab CI, AWS, GCP, Prometheus, Grafana',
    resumeUrl: '',
  });

  useEffect(() => {
    fetchContent();
    window.addEventListener('storage', fetchContent);
    return () => window.removeEventListener('storage', fetchContent);
  }, []);

  const fetchContent = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setContent({
          name: data.name || content.name,
          role: data.role || content.role,
          about: data.about || content.about,
          skills: data.skills || content.skills,
          resumeUrl: data.resumeUrl || '',
        });
      } catch (error) {
        console.error('Failed to parse content');
      }
    }
  };

  return (
    <div className="h-full overflow-auto p-8 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center ring-4 ring-primary/20 animate-pulse-glow">
            <User className="w-16 h-16 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground terminal-glow">{content.name}</h1>
          <p className="text-xl text-primary">{content.role}</p>
        </div>

        {/* About Section */}
        <div className="glass-strong rounded-xl p-6 space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 text-primary">
            <Briefcase className="w-5 h-5" />
            <h2 className="text-xl font-semibold">About Me</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">{content.about}</p>
        </div>

        {/* Resume Section */}
        {content.resumeUrl && (
          <div className="glass-strong rounded-xl p-6 space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold text-primary">Resume</h2>
            <Button
              className="w-full bg-primary hover:bg-primary/90"
              onClick={() => window.open(content.resumeUrl, '_blank')}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Resume
            </Button>
          </div>
        )}

        {/* Skills Section */}
        <div className="glass-strong rounded-xl p-6 space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 text-primary">
            <Code className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Technical Skills</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {content.skills.split(',').map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="glass-strong rounded-xl p-6 space-y-2 font-mono text-sm animate-fade-in">
          <div className="text-primary terminal-glow">$ cat /proc/sysinfo</div>
          <div className="text-muted-foreground">
            <div>System: DevOps Portfolio v1.0</div>
            <div>Status: Online</div>
            <div>Uptime: Always available</div>
            <div>Role: DevOps/SRE Engineer</div>
          </div>
        </div>
      </div>
    </div>
  );
};
