"use client"

import '@/app/globals.css';
import React, { useState } from "react";
import { development } from "@/data/development";
import Project from "./Project";
import AnimatedHeader from './AnimatedHeader';
import PortfolioCard from './PortfolioCard';

const FeaturedWebsites = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  // Filter only featured projects
  const featuredProjects = development.filter((project) => project.featured);

  if (featuredProjects.length === 0) {
    return null; // Don't render if no featured projects
  }

  const openModal = (project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <section className="featured-websites-section">
      <div className="featured-websites-header">
        <AnimatedHeader
          as="h2"
          style={{ pointerEvents: 'auto' }}
        >
          <span className="pixel">recent projects</span>
        </AnimatedHeader>
        <AnimatedHeader
          as="h4"
          style={{ pointerEvents: 'auto' }}
          delay={0.5}
        >
          A couple recent client projects.
        </AnimatedHeader>
      </div>

      <div className="portfolio__container">
        <ul>
          {featuredProjects.map((project, index) => (
            <li key={index}>
              <PortfolioCard
                project={project}
                onClick={() => openModal(project)}
              />
            </li>
          ))}
        </ul>
      </div>

      {selectedProject && (
        <Project data={selectedProject} closeModal={closeModal} />
      )}
    </section>
  );
}

export default FeaturedWebsites;
