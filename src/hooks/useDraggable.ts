import { useState, useCallback, useRef, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface DraggableResult {
  position: Position;
  isDragging: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: MouseEvent) => void;
  handleMouseUp: () => void;
}

export const useDraggable = (
  initialPosition: Position,
  onPositionChange?: (position: Position) => void
): DraggableResult => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const elementStartPos = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const pendingUpdate = useRef<Position | null>(null);

  // Use RAF for smooth updates
  useEffect(() => {
    if (!isDraggingRef.current) return;

    const animate = () => {
      if (pendingUpdate.current) {
        setPosition(pendingUpdate.current);
        onPositionChange?.(pendingUpdate.current);
        pendingUpdate.current = null;
      }
      
      if (isDraggingRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isDragging, onPositionChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.no-drag')) {
      return;
    }
    
    setIsDragging(true);
    isDraggingRef.current = true;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    elementStartPos.current = position;
    e.preventDefault();
    e.stopPropagation();
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - dragStartPos.current.x;
    const deltaY = e.clientY - dragStartPos.current.y;

    const newPosition = {
      x: Math.max(0, Math.min(window.innerWidth - 200, elementStartPos.current.x + deltaX)),
      y: Math.max(0, Math.min(window.innerHeight - 100, elementStartPos.current.y + deltaY)),
    };

    // Store update for RAF to apply
    pendingUpdate.current = newPosition;
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    isDraggingRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  return {
    position,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
