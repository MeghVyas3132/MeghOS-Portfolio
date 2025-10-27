import React, { useEffect, useState } from 'react';
import { User, Briefcase, Code, Download, Mail, Phone, Linkedin, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'portfolio_content';

export const About: React.FC = () => {
  const [content, setContent] = useState({
    name: 'Megh Vyas',
    role: 'DevOps Engineer',
    about: 'Aspiring DevOps Engineer with a solid foundation in cloud computing, automation, and CI/CD pipelines. Skilled in Linux, Git, and Docker with hands-on experience in cloud deployment and system management. Passionate about building scalable, reliable, and efficient workflows that bridge development and operations. Quick learner with strong problem-solving and collaboration skills, eager to contribute to modern DevOps initiatives.',
    skills: 'Python, Node.js, JavaScript, React.js, AWS, GCP, Azure, Git, GitHub, GitLab, Docker, Nginx, Terraform, Multi-Cloud Orchestration, Load Balancing, Infrastructure as Code, CI/CD, Salesforce (Apex, LWC)',
    resumeUrl: '',
    email: 'megh.vyas@yahoo.com',
    phone: '+91 88665 48854',
    linkedin: 'https://linkedin.com/in/MeghVyas',
    github: 'https://github.com/MeghVyas3132',
    profilePhoto: 'photo-2.jpg',
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
          email: data.email || '',
          phone: data.phone || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
          profilePhoto: data.profilePhoto || '',
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
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center ring-4 ring-primary/20 animate-pulse-glow overflow-hidden">
            {content.profilePhoto ? (
              <img 
                src={content.profilePhoto} 
                alt={content.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-16 h-16 text-primary-foreground" />
            )}
          </div>
          <h1 className="text-4xl font-bold text-primary terminal-glow">{content.name}</h1>
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

        {/* Let's Connect Section */}
        <div className="glass-strong rounded-xl p-6 space-y-4 animate-fade-in">
          <h2 className="text-xl font-semibold text-primary">Let's Connect</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {content.email && (
              <a
                href={`mailto:${content.email}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/20 transition-all group"
              >
                <Mail className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm text-foreground">{content.email}</p>
                </div>
              </a>
            )}
            
            {content.phone && (
              <a
                href={`tel:${content.phone}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/20 transition-all group"
              >
                <Phone className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm text-foreground">{content.phone}</p>
                </div>
              </a>
            )}
            
            {content.linkedin && (
              <a
                href={content.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/20 transition-all group"
              >
                <Linkedin className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-xs text-muted-foreground">LinkedIn</p>
                  <p className="text-sm text-foreground">View Profile</p>
                </div>
              </a>
            )}
            
            {content.github && (
              <a
                href={content.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/20 transition-all group"
              >
                <Github className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-xs text-muted-foreground">GitHub</p>
                  <p className="text-sm text-foreground">View Repos</p>
                </div>
              </a>
            )}
          </div>
          
          {!content.email && !content.phone && !content.linkedin && !content.github && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Configure contact information in admin mode (🔒)
            </p>
          )}
        </div>

        {/* System Info */}
        <div className="glass-strong rounded-xl p-6 space-y-2 font-mono text-sm animate-fade-in">
          <div className="text-primary terminal-glow">$ cat /proc/sysinfo</div>
          <div className="text-muted-foreground">
            <div>System: MeghOS Portfolio v1.0</div>
            <div>Status: Online</div>
            <div>Uptime: Always available</div>
            <div>Role: DevOps/SRE Engineer</div>
          </div>
        </div>
      </div>
    </div>
  );
};
