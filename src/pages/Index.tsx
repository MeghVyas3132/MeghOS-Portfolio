import { useState, useEffect } from 'react';
import { Desktop } from '@/components/Desktop';
import { Landing } from './Landing';

const Index = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [hasSeenLanding, setHasSeenLanding] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Check if user has already seen the landing page in this session
    const seen = sessionStorage.getItem('landingShown');
    if (seen) {
      setShowLanding(false);
      setHasSeenLanding(true);
    }
    
    // Add listener for when user wants to see landing again
    const handleShowLanding = () => {
      sessionStorage.removeItem('landingShown');
      setIsTransitioning(true);
      setTimeout(() => {
        setShowLanding(true);
        setHasSeenLanding(false);
        setIsTransitioning(false);
      }, 300);
    };
    
    window.addEventListener('showLanding', handleShowLanding);
    
    return () => {
      window.removeEventListener('showLanding', handleShowLanding);
    };
  }, []);

  const handleLandingComplete = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      sessionStorage.setItem('landingShown', 'true');
      setShowLanding(false);
      setHasSeenLanding(true);
      setIsTransitioning(false);
    }, 500);
  };

  if (showLanding && !hasSeenLanding) {
    return <Landing onComplete={handleLandingComplete} />;
  }

  return (
    <div className={`transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <Desktop />
    </div>
  );
};

export default Index;
