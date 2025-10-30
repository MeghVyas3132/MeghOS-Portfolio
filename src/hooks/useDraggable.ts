import { useState, useCallback, useRef } from 'react';

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
  const lastUpdateTimeRef = useRef(0);

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

    const now = Date.now();
    // Update at most every 16ms (60fps) to avoid excessive updates
    if (now - lastUpdateTimeRef.current < 16) return;
    lastUpdateTimeRef.current = now;

    const deltaX = e.clientX - dragStartPos.current.x;
    const deltaY = e.clientY - dragStartPos.current.y;

    const newPosition = {
      x: Math.max(0, Math.min(window.innerWidth - 200, elementStartPos.current.x + deltaX)),
      y: Math.max(0, Math.min(window.innerHeight - 100, elementStartPos.current.y + deltaY)),
    };

    // Update immediately
    setPosition(newPosition);
    onPositionChange?.(newPosition);
  }, [onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    isDraggingRef.current = false;
    lastUpdateTimeRef.current = 0;
  }, []);

  return {
    position,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
