"use client"

import { motion, useInView } from "motion/react";
import React, { useRef } from "react";

interface AnimatedHeaderProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  once?: boolean; // whether animation should happen only once
}

export default function AnimatedHeader({
  children,
  as = 'h1',
  className = '',
  style = {},
  delay = 0,
  once = true
}: AnimatedHeaderProps) {
  const MotionComponent = motion[as];
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.3 });

  // Convert children to string and split into words
  const text = React.Children.toArray(children)
    .map(child => {
      if (typeof child === 'string') return child;
      if (React.isValidElement(child) && typeof child.props.children === 'string') {
        return child.props.children;
      }
      return '';
    })
    .join(' ');

  const words = text.split(' ');

  // Process children to preserve spans and structure
  const processChildren = (node: React.ReactNode): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    let wordIndex = 0;

    const traverse = (child: React.ReactNode) => {
      if (typeof child === 'string') {
        const childWords = child.split(' ');
        childWords.forEach((word, idx) => {
          if (word) {
            result.push(
              <motion.span
                key={`word-${wordIndex}`}
                initial={{ filter: "blur(10px)", opacity: 0, y: 12 }}
                animate={isInView ? { filter: "blur(0)", opacity: 1, y: 0 } : { filter: "blur(10px)", opacity: 0, y: 12 }}
                transition={{ duration: 0.5, delay: delay + 0.1 * wordIndex }}
                style={{ display: 'inline-block', marginRight: '0.3em' }}
              >
                {word}
              </motion.span>
            );
            wordIndex++;
          }
        });
      } else if (React.isValidElement(child)) {
        // Wrap the entire element (like span.pixel or span.emoji) in motion
        result.push(
          <motion.span
            key={`word-${wordIndex}`}
            initial={{ filter: "blur(10px)", opacity: 0, y: 12 }}
            animate={isInView ? { filter: "blur(0)", opacity: 1, y: 0 } : { filter: "blur(10px)", opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: delay + 0.1 * wordIndex }}
            style={{ display: 'inline-block', marginRight: '0.3em' }}
          >
            {child}
          </motion.span>
        );
        wordIndex++;
      } else if (Array.isArray(child)) {
        child.forEach(traverse);
      }
    };

    React.Children.forEach(children, traverse);
    return result;
  };

  return (
    <MotionComponent ref={ref} className={className} style={style}>
      {processChildren(children)}
    </MotionComponent>
  );
}
