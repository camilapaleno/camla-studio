import '@/app/globals.css';
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';

const Project = ({ data, closeModal }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [isActive, setActive] = useState(true);
  const [scale, setScale] = useState(1);
  const wrapperRef = useRef(null);

  // Fixed dimensions for iframe content
  const DESKTOP_WIDTH = 1430;
  const DESKTOP_HEIGHT = 780;
  const MOBILE_WIDTH = 430;
  const MOBILE_HEIGHT = 920;

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Extract calculateScale function so it can be called from animation callback
  const calculateScale = () => {
    if (!wrapperRef.current) return;

    const wrapper = wrapperRef.current;
    const wrapperWidth = wrapper.clientWidth;
    const wrapperHeight = wrapper.clientHeight;

    // Prevent invalid calculations when wrapper hasn't been sized yet
    if (wrapperWidth === 0 || wrapperHeight === 0) return;

    // Get the target dimensions based on active state
    const targetWidth = isActive ? DESKTOP_WIDTH : MOBILE_WIDTH;
    const targetHeight = isActive ? DESKTOP_HEIGHT : MOBILE_HEIGHT;

    // Calculate scale to fit within wrapper while maintaining aspect ratio
    const scaleX = wrapperWidth / targetWidth;
    const scaleY = wrapperHeight / targetHeight;
    const newScale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond 100%

    setScale(newScale);
  };

  useEffect(() => {
    calculateScale();

    // Use ResizeObserver to detect when wrapper gets its actual size
    const resizeObserver = new ResizeObserver(calculateScale);
    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    window.addEventListener('resize', calculateScale);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', calculateScale);
    };
  }, [isActive]);


  const modalContent = (
    <motion.div
      className="modal"
      style={{ zIndex: 99999 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className='frame'
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onAnimationComplete={() => calculateScale()}
      >
        <div className="project-layout">

          {/* Left Info Panel */}
          <div className="project-info-panel">
            <button onClick={closeModal} className="back-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>

            <div className="info">
              <h1>{data.title}</h1>
              <p>{data.long}</p>

              {data.tools && <p className="tools-info"><strong>Tools:</strong> {data.tools}</p>}

              {data.website === 'none' ? null
              : <a className="see-full-site"
              href={data.website}
              target="_blank"
              rel="noreferrer">
                See full site
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>  }

              {data.github === 'none' ? null
              : <a className="see-full-site"
              href={data.github}
              target="_blank"
              rel="noreferrer">
                View on GitHub
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a> }

              {data.caseStudy ?
              <a className="see-full-site"
              href={`/case-studies/${data.caseStudy}`}>
                See case study
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </a> : null }
            </div>
          </div>

          {/* Right Content Area - Iframe, Video, or Gallery */}
          {data.embed === 'none' ? null :
            <div className="project-iframe-container">
              <div className="iframe-toggle-buttons">
                <button
                  onClick={() => setActive(true)}
                  className={isActive ? "active" : ""}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                  </svg>
                </button>
                <button
                  onClick={() => setActive(false)}
                  className={!isActive ? "active" : ""}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </button>
              </div>

              <div className="iframe-display-wrapper" ref={wrapperRef}>
                <div
                  className="iframe-scale-container"
                  style={{
                    width: isActive ? `${DESKTOP_WIDTH}px` : `${MOBILE_WIDTH}px`,
                    height: isActive ? `${DESKTOP_HEIGHT}px` : `${MOBILE_HEIGHT}px`,
                    transform: `scale(${scale})`,
                  }}
                >
                  <iframe
                    title="iframe"
                    src={data.embed}
                    className={isActive ? "desktop" : "mobile"}
                    style={{
                      width: isActive ? `${DESKTOP_WIDTH}px` : `${MOBILE_WIDTH}px`,
                      height: isActive ? `${DESKTOP_HEIGHT}px` : `${MOBILE_HEIGHT}px`,
                    }}>
                  </iframe>
                </div>
              </div>
            </div>
          }

          {data.youtube === 'none' ? null :
            <div className="project-content-container">
              <div className="content-display-wrapper">
                <iframe title="video" src={data.youtube} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
              </div>
            </div>
          }

          {data.gallery === 'none' ? null :
            <div className="project-content-container">
              <div className="content-display-wrapper gallery">
                {data.gallery.map((image) =>
                  <img key={image} src={image} alt="gallery"/>
                )}
              </div>
            </div>
          }
        </div>
      </motion.div>
    </motion.div>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}

export default Project;