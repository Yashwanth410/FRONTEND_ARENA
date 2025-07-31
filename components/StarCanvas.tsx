import React, { useRef, useEffect, useCallback } from 'react';
import { Theme, Star } from '../types';

interface StarCanvasProps {
  theme: Theme;
}

const CONFIGURATION = {
  STAR_COUNT: 700,
  ROTATION_SPEED: 0.0005,
  ORBITAL_RINGS: 120,
  TRAIL_LENGTH: { min: 0.08, max: 0.12 },
  NORMAL_STAR_THICKNESS: { min: 0.5, max: 1.0 },
  SPECIAL_STAR_THICKNESS: { min: 1.0, max: 2.5 },
  SPECIAL_STAR_CHANCE: 0.05,
  GLOW_ENABLED: true,
  GLOW_RADIUS_MULTIPLIER: 6,
  GLOW_OPACITY: 0.3,
  ROTATION_CENTER: { x: 50, y: 180 },
};

const THEME_COLORS = {
  light: { bg: 'rgba(255, 255, 255, 1)', normal: 'rgba(0, 0, 0, 1)', special: 'rgba(0, 174, 255, 1)' },
  dark:  { bg: 'rgba(0, 0, 0, 1)', normal: 'rgba(255, 255, 255, 1)', special: 'rgba(0, 174, 255, 1)' }
};

const StarCanvas: React.FC<StarCanvasProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const totalAngleRef = useRef(0);
  const pivotRef = useRef({ x: 0, y: 0 });

  const initStars = useCallback((width: number, height: number) => {
    starsRef.current = [];
    pivotRef.current = {
      x: width * (CONFIGURATION.ROTATION_CENTER.x / 100),
      y: height * (CONFIGURATION.ROTATION_CENTER.y / 100),
    };
    const maxRadius = Math.sqrt(
      Math.max(pivotRef.current.x ** 2, (width - pivotRef.current.x) ** 2) +
      Math.max(pivotRef.current.y ** 2, (height - pivotRef.current.y) ** 2)
    );
    const radiusSteps = Array.from(
      { length: CONFIGURATION.ORBITAL_RINGS },
      (_, i) => Math.sqrt((i + 1) / CONFIGURATION.ORBITAL_RINGS) * maxRadius
    );

    for (let i = 0; i < CONFIGURATION.STAR_COUNT; i++) {
      const isSpecial = Math.random() < CONFIGURATION.SPECIAL_STAR_CHANCE;
      const sizeConfig = isSpecial ? CONFIGURATION.SPECIAL_STAR_THICKNESS : CONFIGURATION.NORMAL_STAR_THICKNESS;
      starsRef.current.push({
        isSpecial,
        size: Math.random() * (sizeConfig.max - sizeConfig.min) + sizeConfig.min,
        r: radiusSteps[i % CONFIGURATION.ORBITAL_RINGS],
        theta: Math.random() * 2 * Math.PI,
        trailLength: Math.random() * (CONFIGURATION.TRAIL_LENGTH.max - CONFIGURATION.TRAIL_LENGTH.min) + CONFIGURATION.TRAIL_LENGTH.min,
      });
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const currentThemeColors = THEME_COLORS[theme];
    
    ctx.fillStyle = currentThemeColors.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    totalAngleRef.current += CONFIGURATION.ROTATION_SPEED;
    
    const { x: pivotX, y: pivotY } = pivotRef.current;
    
    // Pass 1: Draw glows
    if (CONFIGURATION.GLOW_ENABLED) {
        starsRef.current.forEach(s => {
            if (s.isSpecial) {
                const headAngle = s.theta + totalAngleRef.current;
                const headX = pivotX + s.r * Math.cos(headAngle);
                const headY = pivotY + s.r * Math.sin(headAngle);
                const glowRadius = s.size * CONFIGURATION.GLOW_RADIUS_MULTIPLIER;
                const gradient = ctx.createRadialGradient(headX, headY, 0, headX, headY, glowRadius);
                gradient.addColorStop(0, `rgba(0, 174, 255, ${CONFIGURATION.GLOW_OPACITY})`);
                gradient.addColorStop(1, 'rgba(0, 174, 255, 0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(headX, headY, glowRadius, 0, 2 * Math.PI);
                ctx.fill();
            }
        });
    }

    // Pass 2 & 3: Draw trails
    const normalStars = starsRef.current.filter(s => !s.isSpecial);
    const specialStars = starsRef.current.filter(s => s.isSpecial);

    [normalStars, specialStars].forEach((starGroup, index) => {
        ctx.strokeStyle = index === 0 ? currentThemeColors.normal : currentThemeColors.special;
        starGroup.forEach(s => {
            const headAngle = s.theta + totalAngleRef.current;
            const tailAngle = headAngle - s.trailLength;
            ctx.beginPath();
            ctx.lineWidth = s.size;
            ctx.lineCap = 'round';
            ctx.arc(pivotX, pivotY, s.r, tailAngle, headAngle);
            ctx.stroke();
        });
    });

    animationFrameIdRef.current = requestAnimationFrame(animate);
  }, [theme]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars(canvas.width, canvas.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if(animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initStars, animate]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none" />;
};

export default StarCanvas;