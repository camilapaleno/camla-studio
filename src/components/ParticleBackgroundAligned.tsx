"use client"

import React, { useState, useEffect, useRef } from 'react';

type Align = 'top' | 'bottom' | 'left' | 'right';

interface ParticleBackgroundAlignedProps {
  backgroundColor?: string;
  align?: Align;
}

const hexToRgba = (hex: string, alpha: number) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `rgba(0, 0, 0, ${alpha})`;
};

const getLinearGradientStyle = (align: Align, color: string, halfColor: string): React.CSSProperties => {
  const gradient = (dir: string) =>
    `linear-gradient(${dir}, ${color}, ${halfColor} 50%, transparent 100%)`;

  switch (align) {
    case 'top':
      return { position: 'absolute', top: 0, left: 0, width: '100%', height: '300px', background: gradient('to bottom'), pointerEvents: 'none' };
    case 'bottom':
      return { position: 'absolute', bottom: 0, left: 0, width: '100%', height: '300px', background: gradient('to top'), pointerEvents: 'none' };
    case 'left':
      return { position: 'absolute', top: 0, left: 0, height: '100%', width: '300px', background: gradient('to right'), pointerEvents: 'none' };
    case 'right':
      return { position: 'absolute', top: 0, right: 0, height: '100%', width: '300px', background: gradient('to left'), pointerEvents: 'none' };
  }
};

const getRadialGradientStyle = (
  align: Align,
  colors: { gradientColorCenter: string; gradientColorOuter: string },
  containerPosition: { x: number; y: number },
  hexToRgba: (hex: string, alpha: number) => string
): React.CSSProperties => {
  const { gradientColorCenter, gradientColorOuter } = colors;
  const radialBg = `
    radial-gradient(50% 50% at 50% 50%,
      ${gradientColorCenter} 0%,
      ${hexToRgba(gradientColorCenter, 0.52)} 43%,
      ${hexToRgba(gradientColorOuter, 0.3)} 70%,
      ${hexToRgba(gradientColorOuter, 0.1)} 85%,
      transparent 100%
    )
  `;

  const base: React.CSSProperties = {
    position: 'absolute',
    background: radialBg,
    borderRadius: '50%',
    pointerEvents: 'none',
    transition: 'none',
  };

  switch (align) {
    case 'top':
      return {
        ...base,
        width: '1200px',
        height: '900px',
        left: '50%',
        top: '-400px',
        transform: `translate(-50%, 0) translate(${containerPosition.x}px, ${containerPosition.y}px)`,
      };
    case 'bottom':
      return {
        ...base,
        width: '1200px',
        height: '900px',
        left: '50%',
        bottom: '-500px',
        transform: `translate(-50%, 0) translate(${containerPosition.x}px, ${containerPosition.y}px)`,
      };
    case 'left':
      return {
        ...base,
        width: '900px',
        height: '1200px',
        top: '50%',
        left: '-400px',
        transform: `translate(0, -50%) translate(${containerPosition.x}px, ${containerPosition.y}px)`,
      };
    case 'right':
      return {
        ...base,
        width: '900px',
        height: '1200px',
        top: '50%',
        right: '-400px',
        transform: `translate(0, -50%) translate(${containerPosition.x}px, ${containerPosition.y}px)`,
      };
  }
};

const ParticleBackgroundAligned = ({
  backgroundColor = 'transparent',
  align = 'top',
}: ParticleBackgroundAlignedProps) => {
  const getColors = () => {
    if (typeof window === 'undefined') {
      return {
        particleColor: '#fff',
        gradientColorCenter: '#94330e',
        gradientColorOuter: '#5f26d9',
        linearGradientColor: '#CBE7FF',
      };
    }
    const styles = getComputedStyle(document.body);
    return {
      particleColor: styles.getPropertyValue('--particle-color').trim() || '#fff',
      gradientColorCenter: styles.getPropertyValue('--particle-gradient-center').trim() || '#94330e',
      gradientColorOuter: styles.getPropertyValue('--particle-gradient-outer').trim() || '#5f26d9',
      linearGradientColor: styles.getPropertyValue('--particle-bg').trim() || '#CBE7FF',
    };
  };

  const [colors, setColors] = useState(getColors());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setColors(getColors());

    const observer = new MutationObserver(() => setColors(getColors()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [containerPosition, setContainerPosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const updateContainerPosition = () => {
      setContainerPosition(prev => {
        const targetX = (mousePosition.x - window.innerWidth / 2) * 0.15;
        const targetY = (mousePosition.y - window.innerHeight / 2) * 0.15;
        const easeOutFactor = 0.08;
        return {
          x: prev.x + (targetX - prev.x) * easeOutFactor,
          y: prev.y + (targetY - prev.y) * easeOutFactor,
        };
      });
      animationFrameId = requestAnimationFrame(updateContainerPosition);
    };

    animationFrameId = requestAnimationFrame(updateContainerPosition);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePosition]);

  const halfColor = hexToRgba(colors.linearGradientColor, 0.5);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" style={{ backgroundColor }}>
      <div style={getLinearGradientStyle(align, colors.linearGradientColor, halfColor)} />
      <div style={getRadialGradientStyle(align, colors, containerPosition, hexToRgba)} />
    </div>
  );
};

export default ParticleBackgroundAligned;
