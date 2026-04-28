"use client"

import '@/app/globals.css';
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import AnimatedHeader from './AnimatedHeader';
import Pointer from './Pointer';

const BrowserDemo = ({ projects }) => {
  const [activeProject, setActiveProject] = useState(0);
  const [demoActive, setDemoActive] = useState(false);

  const currentProject = projects[activeProject];

  return (
    <section className="featured-websites-browser">

      <div className="browser-websites-header">
        
      <AnimatedHeader
          as="h2"
          style={{ pointerEvents: 'auto' }}
        >
          <span className="pixel">interactive demos</span>
        </AnimatedHeader>
        <AnimatedHeader
          as="h4"
          style={{ pointerEvents: 'auto' }}
          delay={0.5}
        >
          Demos for websites I've made with unique user interactions.
        </AnimatedHeader>
      </div>

      <div className="browser-mockup">
        {currentProject.pointer && (
          <Pointer
            text={currentProject.pointer.text}
            side={currentProject.pointer.side}
            position={currentProject.pointer.position}
            dotColor={currentProject.pointer.dotColor}
          />
        )}
        {/* Browser Chrome */}
        <div className="browser-chrome">
          <div className="browser-dots">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>

          {/* Browser Tabs */}
          <div className="browser-tabs">
            {projects.map((project, index) => (
              <button
                key={index}
                onClick={() => setActiveProject(index)}
                className={`browser-tab ${activeProject === index ? 'active' : ''}`}
              >
                <Image
                  src={project.preview}
                  alt={project.title}
                  width={16}
                  height={16}
                  className="tab-favicon"
                />
                <span className="tab-title">{project.title}</span>
                {activeProject !== index && (
                  <span className="tab-close">×</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Browser Content Area */}
        <div className="browser-content">
          <div className="browser-url-bar">
            <div className="url-controls">
              <button className="url-button">←</button>
              <button className="url-button">→</button>
              <button className="url-button">↻</button>
            </div>
            <div className="url-input">
              <svg className="lock-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
              </svg>
              <span>{currentProject.embed}</span>
            </div>
          </div>

          <div className="iframe-display-wrapper">
            {!demoActive && (
              <div className="demo-overlay" onClick={() => setDemoActive(true)}>
                <div className="demo-overlay-content">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                  </svg>
                  <span>Run demo</span>
                </div>
              </div>
            )}
            <iframe
              title="website-preview"
              src={currentProject.embed}
              className="browser-iframe"
              style={{ pointerEvents: demoActive ? 'auto' : 'none' }}>
            </iframe>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BrowserDemo;
