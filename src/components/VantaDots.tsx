import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Make THREE available globally for Vanta
if (typeof window !== 'undefined') {
  (window as any).THREE = THREE;
}

// Declare VANTA on window
declare global {
  interface Window {
    VANTA: {
      DOTS: (config: VantaDotsConfig) => VantaEffect;
    };
  }
}

interface VantaEffect {
  destroy: () => void;
  setOptions: (options: Partial<VantaDotsConfig>) => void;
}

interface VantaDotsConfig {
  el: HTMLElement | null;
  THREE: typeof THREE;
  mouseControls?: boolean;
  touchControls?: boolean;
  gyroControls?: boolean;
  minHeight?: number;
  minWidth?: number;
  scale?: number;
  scaleMobile?: number;
  color?: number;
  color2?: number;
  backgroundColor?: number;
  size?: number;
  spacing?: number;
  showLines?: boolean;
}

interface VantaDotsProps {
  className?: string;
  mouseControls?: boolean;
  touchControls?: boolean;
  gyroControls?: boolean;
  minHeight?: number;
  minWidth?: number;
  scale?: number;
  scaleMobile?: number;
  color?: number;
  color2?: number;
  backgroundColor?: number;
  size?: number;
  spacing?: number;
  showLines?: boolean;
}

const VantaDots: React.FC<VantaDotsProps> = ({
  className = '',
  mouseControls = true,
  touchControls = true,
  gyroControls = false,
  minHeight = 200,
  minWidth = 200,
  scale = 1,
  scaleMobile = 1,
  color = 0x3b82f6,
  color2 = 0x8b5cf6,
  backgroundColor = 0x0a0a0a,
  size = 3,
  spacing = 35,
  showLines = true,
}) => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<VantaEffect | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Vanta.js script dynamically
    const loadVanta = async () => {
      if (window.VANTA) {
        setIsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.dots.min.js';
      script.async = true;
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    };

    loadVanta();
  }, []);

  useEffect(() => {
    if (!isLoaded || !vantaRef.current || !window.VANTA) return;

    const effect = window.VANTA.DOTS({
      el: vantaRef.current,
      THREE,
      mouseControls,
      touchControls,
      gyroControls,
      minHeight,
      minWidth,
      scale,
      scaleMobile,
      color,
      color2,
      backgroundColor,
      size,
      spacing,
      showLines,
    });

    setVantaEffect(effect);

    return () => {
      if (effect) {
        effect.destroy();
      }
    };
  }, [
    isLoaded,
    mouseControls,
    touchControls,
    gyroControls,
    minHeight,
    minWidth,
    scale,
    scaleMobile,
    color,
    color2,
    backgroundColor,
    size,
    spacing,
    showLines,
  ]);

  return (
    <div
      ref={vantaRef}
      className={`absolute inset-0 ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default VantaDots;
