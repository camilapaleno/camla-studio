"use client"

import '@/app/globals.css';
import React from "react";

const PortfolioCard = ({ project, onClick }) => {
  return (
    <button className='portfolio-card-glass' onClick={onClick}>
      <div className="portfolio-card-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
      </div>

      <div className="portfolio-card-preview">
        <img src={project.preview.src} alt={project.name} />
        <img src={project.overlay.src} alt={project.name} className="overlay-image" />

        <div className="portfolio-card-content">
          <div className="portfolio-card-glass-bg"></div>
          <div className="portfolio-card-text-content">
            <h3 className="portfolio-card-title">{project.title}</h3>
            <div className="portfolio-card-tools">
              {project.projectType === "client" && (
                <span className="portfolio-card-tool client-tag">Client<span className="emoji">D</span></span>
              )}
              {project.tools.split(',').map((tool, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="tool-separator">·</span>}
                  <span className="portfolio-card-tool">{tool.trim()}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

export default PortfolioCard;
