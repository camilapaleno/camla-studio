"use client"

import { caseStudies } from "@/data/caseStudies";
import { useState, useRef } from "react";

import AnimatedHeader from "./AnimatedHeader";
import CaseStudyCard from "./CaseStudyCard";

export default function FeaturedCaseStudies() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter only featured case studies
  const featuredStudies = caseStudies.filter((study) => study.featured);

  if (featuredStudies.length === 0) {
    return null; // Don't render if no featured case studies
  }

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 450; // Approximate width of one card + gap
    const newPosition = direction === 'left'
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });

    setScrollPosition(newPosition);
  };

  return (
    <section className="featured-case-studies">
      <div className="featured-case-studies-header">
        <AnimatedHeader
          as="h2"
          style={{ pointerEvents: 'auto' }}
          delay={0.5}
        >
          <span className="pixel">case studies</span>
        </AnimatedHeader>
        <AnimatedHeader
          as="h4"
          style={{ pointerEvents: 'auto' }}
          delay={0.5}
        >Write ups about recent projects I've done, including the challenges and solutions.
        </AnimatedHeader>
        
      </div>

      <div className="case-studies-gallery-container">

        <div className="case-studies-gallery" ref={scrollContainerRef}>
          {featuredStudies.map((study) => (
            <CaseStudyCard
              key={study.id}
              id={study.id}
              title={study.title}
              shortDescription={study.shortDescription}
              coverImage={study.coverImage}
              tools={study.tools}
            />
          ))}
        </div>




      </div>        
      <div className="gallery-nav-btns">
          <button
            className="gallery-nav-btn left"
            onClick={() => scroll('left')}
            disabled={scrollPosition === 0}
          >
            ←
          </button>
          <button
            className="gallery-nav-btn right"
            onClick={() => scroll('right')}
          >
            →
          </button>
        </div>
    </section>
  );
}
