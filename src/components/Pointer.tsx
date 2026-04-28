"use client"

import React from 'react';

interface PointerProps {
  text: string;
  side: 'left' | 'right';
  position: number; // percentage from top (0-100)
  dotColor?: string;
}

export default function Pointer({
  text,
  side,
  position,
  dotColor = 'var(--pixel-purple)'
}: PointerProps) {
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${position}%`,
    [side]: side === 'left' ? 'calc(100%)' : 'calc(100%)',
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    zIndex: 100,
    flexDirection: side === 'left' ? 'row-reverse' : 'row',
    transform: 'translateY(-50%)',
  };

  return (
    <div className="pointer-container" style={containerStyle}>
      <div className="pointer-label">
        <div className="pointer-dot" style={{ backgroundColor: dotColor }}></div>
        <span className="pointer-text">{text}</span>
      </div>
      <div className="pointer-arrow" style={{
        transform: side === 'left' ? 'scaleX(-1)' : 'none',
        marginLeft: side === 'left' ? '0' : '0px',
        marginRight: side === 'right' ? '0' : '0px',
      }}>
        <svg width="50" height="1" viewBox="0 0 50 1" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="1" x2="50" y2="1" stroke="currentColor" strokeWidth="1"/>
          <path d="M110 1L105 3.5V-1.5L110 1Z" fill="currentColor"/>
        </svg>
      </div>
    </div>
  );
}
