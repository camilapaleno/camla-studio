"use client"

import { useState, useRef, useEffect } from 'react';
import localFont from 'next/font/local';

const pixelTimes = localFont({
  src: [
    {
      path: '../app/fonts/pixeltimes/PixelTimes.ttf',
      weight: '400',
    },
    {
      path: '../app/fonts/pixeltimes/PixelTimes-Bold.ttf',
      weight: '700',
    },
  ],
  variable: '--font-pixel-times',
});

export default function HeroHeader() {
  const text = "connect your brand identity to your online presence.";
  const words = text.split(' ');

  // Track which letters are in pixel font
  const [letterStates, setLetterStates] = useState<{ [key: string]: boolean }>({});
  const animationRefs = useRef<{ [key: number]: NodeJS.Timeout[] }>({});

  const handleMouseEnter = (wordIndex: number, word: string, startLetterIndex: number) => {
    // Clear any existing animations for this word
    if (animationRefs.current[wordIndex]) {
      animationRefs.current[wordIndex].forEach(timeout => clearTimeout(timeout));
    }
    animationRefs.current[wordIndex] = [];

    // Create array of letter indices for this word
    const letterIndices = Array.from({ length: word.length }, (_, i) => i);

    // Shuffle the indices to animate letters in random order
    const shuffled = [...letterIndices].sort(() => Math.random() - 0.5);

    // Animate each letter with flickering
    shuffled.forEach((letterPos, animationIndex) => {
      const globalLetterIndex = startLetterIndex + letterPos;
      const delay = animationIndex * 60; // Stagger each letter by 60ms

      // Create flickering effect for this letter
      const flickerCount = 4; // 2 full cycles
      for (let i = 0; i < flickerCount; i++) {
        const timeout = setTimeout(() => {
          setLetterStates(prev => ({
            ...prev,
            [globalLetterIndex]: i % 2 === 1 // alternate between pixel and normal
          }));
        }, delay + (i * 40)); // Each flicker takes 40ms
        animationRefs.current[wordIndex].push(timeout);
      }

      // Final state - set to pixel font
      const finalTimeout = setTimeout(() => {
        setLetterStates(prev => ({
          ...prev,
          [globalLetterIndex]: true
        }));
      }, delay + (flickerCount * 40));
      animationRefs.current[wordIndex].push(finalTimeout);
    });
  };

  const handleMouseLeave = (wordIndex: number, word: string, startLetterIndex: number) => {
    // Clear any running animations
    if (animationRefs.current[wordIndex]) {
      animationRefs.current[wordIndex].forEach(timeout => clearTimeout(timeout));
      animationRefs.current[wordIndex] = [];
    }

    // Reset all letters in this word back to normal font
    const updates: { [key: string]: boolean } = {};
    for (let i = 0; i < word.length; i++) {
      updates[startLetterIndex + i] = false;
    }
    setLetterStates(prev => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      Object.values(animationRefs.current).forEach(timeouts => {
        timeouts.forEach(timeout => clearTimeout(timeout));
      });
    };
  }, []);

  // Calculate global letter index for each character
  let globalLetterIndex = 0;

  return (
    <h1 className={pixelTimes.variable}>
      {words.map((word, wordIndex) => {
        const wordStartIndex = globalLetterIndex;
        const wordContent = (
          <span
            key={wordIndex}
            className="hero-word"
            onMouseEnter={() => handleMouseEnter(wordIndex, word, wordStartIndex)}
            onMouseLeave={() => handleMouseLeave(wordIndex, word, wordStartIndex)}
          >
            {word.split('').map((letter, letterPos) => {
              const currentGlobalIndex = wordStartIndex + letterPos;
              const isPixel = letterStates[currentGlobalIndex];
              return (
                <span
                  key={letterPos}
                  className={`hero-letter ${isPixel ? 'pixel-font' : ''}`}
                >
                  {letter}
                </span>
              );
            })}
          </span>
        );
        globalLetterIndex += word.length;
        return (
          <span key={wordIndex}>
            {wordContent}
            {wordIndex < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </h1>
  );
}
