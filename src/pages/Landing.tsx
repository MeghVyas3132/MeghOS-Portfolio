import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import TextPressure from '@/components/TextPressure';
import ScrollFloat from '@/components/ScrollFloat';

interface LandingProps {
  onComplete: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onComplete }) => {
  const [showText, setShowText] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const progressRef = useRef(0);
  const rafRef = useRef<number>();
  const completedRef = useRef(false);

  useEffect(() => {
    // Animate text in after a short delay
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 500);

    // Smooth animation loop
    const animate = () => {
      if (progressRef.current !== scrollProgress) {
        setScrollProgress(progressRef.current);
        
        if (progressRef.current >= 100 && !completedRef.current) {
          completedRef.current = true;
          setTimeout(() => onComplete(), 800);
        }
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    // Handle scroll events
    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();
      
      if (completedRef.current) return;
      
      if (e.deltaY > 0) {
        // Scrolling down - much faster increment (one scroll = done)
        progressRef.current = Math.min(progressRef.current + 35, 100);
      } else {
        // Scrolling up
        progressRef.current = Math.max(progressRef.current - 35, 0);
      }
    };

    // Handle touch events
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      
      if (completedRef.current) return;
      
      const touchY = e.touches[0].clientY;
      const diff = touchStartY - touchY;
      
      // Much more sensitive - one swipe should complete
      if (Math.abs(diff) > 5) {
        if (diff > 0) {
          // Scrolling down - faster on mobile
          progressRef.current = Math.min(progressRef.current + 25, 100);
        } else {
          // Scrolling up
          progressRef.current = Math.max(progressRef.current - 25, 0);
        }
        touchStartY = touchY;
      }
    };

    window.addEventListener('wheel', handleScroll, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      clearTimeout(textTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-background/95">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 will-change-transform"
        style={{ 
          opacity: 1 - (scrollProgress / 100) * 0.3,
          background: 'radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.08) 0%, transparent 50%)',
          transition: 'opacity 0.3s ease-out'
        }}
      />

      {/* Glass overlay that intensifies on scroll */}
      <div 
        className="absolute inset-0 bg-background will-change-transform"
        style={{ 
          opacity: 0.3 + (scrollProgress / 100) * 0.7,
          backdropFilter: `blur(${Math.min(scrollProgress / 10, 10)}px)`,
          transition: 'opacity 0.3s ease-out, backdrop-filter 0.3s ease-out'
        }}
      />

      {/* Content that fades out on scroll */}
      <div 
        className="relative z-10 flex flex-col items-center gap-8 w-full px-8 will-change-transform"
        style={{
          opacity: Math.max(1 - (scrollProgress / 100), 0),
          transform: `translateY(${-scrollProgress * 0.8}px)`,
          transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
        }}
      >
        {/* Welcome Text with Pressure Effect */}
        <div
          className={`text-center space-y-6 w-full max-w-4xl transition-all duration-1000 ${
            showText
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div style={{ position: 'relative', height: '150px' }}>
            <TextPressure
              text="MEGH'S PORTFOLIO"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="#f97316"
              strokeColor="#ea580c"
              minFontSize={36}
            />
          </div>
          
          <div className="mt-8">
            <ScrollFloat
              animationDuration={1}
              ease='back.inOut(2)'
              scrollStart='center bottom+=50%'
              scrollEnd='bottom bottom-=40%'
              stagger={0.03}
              textClassName="text-primary font-bold tracking-wide"
              containerClassName="font-mono"
            >
              Explore Desktop
            </ScrollFloat>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div
          className={`flex flex-col items-center gap-4 mt-12 transition-all duration-1000 delay-500 ${
            showText
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <p className="text-sm text-primary/80 font-medium uppercase tracking-wider">
            Scroll Down
          </p>
          <div className="animate-bounce">
            <ChevronDown className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-64 h-1 bg-border/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent will-change-transform"
            style={{
              width: `${scrollProgress}%`,
              boxShadow: scrollProgress > 0 ? '0 0 20px rgba(249, 115, 22, 0.5)' : 'none',
              transition: 'width 0.3s ease-out, box-shadow 0.3s ease-out'
            }}
          />
        </div>
      </div>

      {/* Desktop Preview that scales in on scroll */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none will-change-transform"
        style={{
          opacity: scrollProgress / 100,
          transform: `scale(${0.8 + (scrollProgress / 100) * 0.2})`,
          transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
        }}
      >
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold text-primary terminal-glow">
            Desktop Loading...
          </div>
          <div className="text-lg text-primary/60">
            {Math.round(scrollProgress)}%
          </div>
        </div>
      </div>
    </div>
  );
};
