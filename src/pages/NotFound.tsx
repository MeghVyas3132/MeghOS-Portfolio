import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="text-center glass-strong p-8 rounded-xl animate-fade-in">
        <h1 className="mb-4 text-6xl font-bold text-primary terminal-glow">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary hover:text-primary/80 underline transition-colors">
          Return to Portfolio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
