import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Save, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';

const ADMIN_PASSWORD = 'Ikon@3132';
const STORAGE_KEY = 'portfolio_content';

interface EditModeProps {
  onClose: () => void;
}

interface PortfolioContent {
  name: string;
  role: string;
  about: string;
  skills: string;
  googleDrivePhotos: string;
  resumeUrl: string;
}

export const EditMode: React.FC<EditModeProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [content, setContent] = useState<PortfolioContent>({
    name: 'DevOps Engineer',
    role: 'Site Reliability Engineer',
    about: 'Experienced DevOps/SRE professional specializing in container orchestration, CI/CD pipelines, and cloud infrastructure.',
    skills: 'Docker, Kubernetes, Linux, Terraform, Ansible, Jenkins, GitLab CI, AWS, GCP, Prometheus, Grafana, Nginx, PostgreSQL, Redis',
    googleDrivePhotos: '',
    resumeUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setContent(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse stored content');
      }
    }
    setLoading(false);
  };

  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success('Authentication successful!');
    } else {
      toast.error('Incorrect password');
    }
  };

  const handleSave = () => {
    setSaving(true);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      toast.success('Content updated successfully!');
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="glass-strong max-w-md w-full rounded-xl p-6 space-y-6 animate-window-open">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-6 h-6 text-primary terminal-glow" />
              <h2 className="text-2xl font-bold text-primary terminal-glow">Admin Access</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Enter Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                className="glass border-primary/30"
                placeholder="Enter admin password"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Default password: <code className="text-primary">Refer me and i will tell you the Default Password</code>
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handlePasswordSubmit} variant="outline" className="bg-primary hover:bg-primary/90 text-primary-foreground border-primary">
              <Lock className="w-4 h-4 mr-2" />
              Authenticate
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-strong max-w-2xl w-full rounded-xl p-6 space-y-6 animate-window-open bg-background/95">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary terminal-glow">Edit Portfolio Content</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-auto">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={content.name}
              onChange={(e) => setContent({ ...content, name: e.target.value })}
              className="glass border-primary/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={content.role}
              onChange={(e) => setContent({ ...content, role: e.target.value })}
              className="glass border-primary/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              value={content.about}
              onChange={(e) => setContent({ ...content, about: e.target.value })}
              className="glass border-primary/30 min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Textarea
              id="skills"
              value={content.skills}
              onChange={(e) => setContent({ ...content, skills: e.target.value })}
              className="glass border-primary/30"
              placeholder="Docker, Kubernetes, Linux, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="googleDrivePhotos">Photo URLs</Label>
            <Input
              id="googleDrivePhotos"
              value={content.googleDrivePhotos}
              onChange={(e) => setContent({ ...content, googleDrivePhotos: e.target.value })}
              className="glass border-primary/30"
              placeholder="https://i.imgur.com/abc.jpg, https://i.imgur.com/xyz.png"
            />
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-primary">✅ Recommended: Use Imgur (easiest!)</p>
              <p>1. Go to imgur.com/upload → Upload photos</p>
              <p>2. Right-click each → "Copy image address"</p>
              <p>3. Paste URLs here, separated by commas</p>
              <p className="text-[10px] text-amber-400 mt-2">⚠️ Google Drive doesn't work due to CORS. Use Imgur, Cloudinary, or any direct image URLs instead.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resumeUrl">Resume URL</Label>
            <Input
              id="resumeUrl"
              value={content.resumeUrl}
              onChange={(e) => setContent({ ...content, resumeUrl: e.target.value })}
              className="glass border-primary/30"
              placeholder="Enter Google Drive resume link"
            />
            <p className="text-xs text-muted-foreground">
              Upload your resume to Google Drive and paste the shareable link
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90">
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
