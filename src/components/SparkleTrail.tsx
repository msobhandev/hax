import React, { useEffect, useState } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export const SparkleTrail: React.FC = () => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    // Check reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Only on pointer devices with fine pointer (desktop)
    if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const colors = ['#f59e0b', '#ec4899', '#8b5cf6', '#38bdf8', '#fbbf24'];
    let lastTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastTime < 60) return; // throttle sparkle generation
      lastTime = now;

      const newSparkle: Sparkle = {
        id: Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.floor(Math.random() * 8) + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      setSparkles((prev) => [...prev.slice(-12), newSparkle]);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const cleanupInterval = window.setInterval(() => {
      setSparkles((prev) => (prev.length > 0 ? prev.slice(1) : prev));
    }, 180);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(cleanupInterval);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
      {sparkles.map((s) => (
        <span
          key={s.id}
          style={{
            left: `${s.x}px`,
            top: `${s.y}px`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.color,
            boxShadow: `0 0 10px ${s.color}`,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full animate-ping opacity-75"
        />
      ))}
    </div>
  );
};
