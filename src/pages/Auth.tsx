import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

export const Auth: React.FC = () => {
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    toast.error('This is a demo portfolio. Authentication is not implemented.');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="glass-strong max-w-md w-full rounded-xl p-8 space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary terminal-glow">Demo Login</h1>
          <p className="text-muted-foreground">
            This is a demo portfolio. Authentication is not implemented.
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                className="pl-10 bg-background/50"
                placeholder="demo@example.com"
                disabled
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                className="pl-10 bg-background/50"
                placeholder="••••••••"
                disabled
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90"
          >
            Back to Portfolio
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            This is a demo feature. No authentication is required.
          </p>
        </div>
      </div>
    </div>
  );
};
