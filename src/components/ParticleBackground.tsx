"use client"

import React, { useState, useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  backgroundColor?: string;
  particleColor?: string;
  gradientColorCenter?: string;
  gradientColorOuter?: string;
  linearGradientColor?: string;
}

const ParticleBackground = ({
  backgroundColor = 'transparent',
}: ParticleBackgroundProps) => {
  // Get colors from CSS variables based on theme
  const getColors = () => {
    if (typeof window === 'undefined') {
      return {
        particleColor: '#fff',
        gradientColorCenter: '#264dd9',
        gradientColorOuter: '#5f26d9',
        linearGradientColor: '#CBE7FF'
      };
    }

    const styles = getComputedStyle(document.body);
    return {
      particleColor: styles.getPropertyValue('--particle-color').trim() || '#fff',
      gradientColorCenter: styles.getPropertyValue('--particle-gradient-center').trim() || '#264dd9',
      gradientColorOuter: styles.getPropertyValue('--particle-gradient-outer').trim() || '#5f26d9',
      linearGradientColor: styles.getPropertyValue('--particle-bg').trim() || '#CBE7FF'
    };
  };

  const [colors, setColors] = useState(getColors());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Update colors on mount and whenever the theme attribute changes
    setColors(getColors());

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      setColors(getColors());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [containerPosition, setContainerPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const animationRef = useRef<number | null>(null);

  // Generate initial particles
  const generateParticles = (count = 20) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 600,
      y: Math.random() * 400,
      vx: (Math.random() - 0.5) * 0.2, // Very slow velocity
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.6 + 0.2,
    }));
  };

  const [particles, setParticles] = useState(() => generateParticles());

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth container movement with ease-out effect
  useEffect(() => {
    let animationFrameId: number;

    const updateContainerPosition = () => {
      setContainerPosition(prev => {
        const targetX = (mousePosition.x - window.innerWidth / 2) * 0.15;
        const targetY = (mousePosition.y - window.innerHeight / 2) * 0.15;

        // Ease-out interpolation - faster at first, then slows down
        const easeOutFactor = 0.08;
        const dx = targetX - prev.x;
        const dy = targetY - prev.y;

        return {
          x: prev.x + dx * easeOutFactor,
          y: prev.y + dy * easeOutFactor,
        };
      });

      animationFrameId = requestAnimationFrame(updateContainerPosition);
    };

    animationFrameId = requestAnimationFrame(updateContainerPosition);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePosition]);

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => {
          let newX = particle.x + particle.vx;
          let newY = particle.y + particle.vy;
          let newVx = particle.vx;
          let newVy = particle.vy;

          // Bounce off walls
          if (newX <= 0 || newX >= 600) {
            newVx = -newVx;
            newX = Math.max(0, Math.min(600, newX));
          }
          if (newY <= 0 || newY >= 400) {
            newVy = -newVy;
            newY = Math.max(0, Math.min(400, newY));
          }

          // Add slight randomness to movement
          newVx += (Math.random() - 0.5) * 0.005;
          newVy += (Math.random() - 0.5) * 0.005;

          // Limit velocity to very slow
          const maxVel = 0.3;
          newVx = Math.max(-maxVel, Math.min(maxVel, newVx));
          newVy = Math.max(-maxVel, Math.min(maxVel, newVy));

          return {
            ...particle,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
          };
        })
      );

      animationRef.current = requestAnimationFrame(animateParticles);
    };

    animationRef.current = requestAnimationFrame(animateParticles);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Convert hex to RGBA for smooth blending
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

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" style={{ backgroundColor }}>
      {/* Linear gradient from top - full width */}
      <div
        className="absolute top-0 left-0 w-full"
        style={{
          height: '300px',
          background: `linear-gradient(to bottom, ${colors.linearGradientColor}, ${hexToRgba(colors.linearGradientColor, 0.5)} 50%, transparent 100%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Circular gradient at top - dual gradient effect with seamless blending */}
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: '1200px',
          height: '900px',
          background: `
            radial-gradient(50% 50% at 50% 50%,
              ${colors.gradientColorCenter} 0%,
              ${hexToRgba(colors.gradientColorCenter, 0.52)} 53%,
              ${hexToRgba(colors.gradientColorOuter, 0.3)} 70%,
              ${hexToRgba(colors.gradientColorOuter, 0.1)} 85%,
              transparent 100%
            )
          `,
          borderRadius: '50%',
          top: '-400px',
          pointerEvents: 'none',
          transform: `translate(-50%, 0) translate(${containerPosition.x}px, ${containerPosition.y}px)`,
          transition: 'none',
        }}
      />


      {/* Particle container */}
      {/* <div
        ref={containerRef}
        className="absolute top-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: '600px',
          height: '400px',
          transform: `translate(-50%, 0) translate(${containerPosition.x}px, ${containerPosition.y}px)`,
          transition: 'none', 
        }}
      >

        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              backgroundColor: colors.particleColor,
              borderRadius: '0%',
            }}
          />
        ))}
      </div> */}
    </div>
  );
};

export default ParticleBackground;
